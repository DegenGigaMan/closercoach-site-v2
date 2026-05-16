/** @fileoverview PostHog initialization + SPA pageview capture.
 *
 *  Mount strategy (refined 2026-05-09 — launch-day dashboard tuning):
 *    - Init PostHog ALWAYS on first client render (regardless of cookie
 *      consent state). Pre-consent persistence is `memory` so no cookies
 *      are written until the user accepts. On accept, persistence is
 *      upgraded to `localStorage+cookie` for cross-session continuity.
 *      On decline, persistence stays `memory` (events still capture for
 *      that session; nothing persists across reloads).
 *    - Reverse proxy via /d4/* (next.config.ts rewrites; renamed from
 *      /ingest -> /d4 on 2026-05-16 because modern blocklists pattern-
 *      match the semantic /ingest prefix in addition to posthog.com).
 *      The Vercel env var NEXT_PUBLIC_POSTHOG_HOST (e.g.
 *      https://us.i.posthog.com) is the *project region indicator* — it
 *      tells the rewrite which PostHog cluster to target. The SDK itself
 *      uses '/d4' relative to our origin so ad blockers cannot block the
 *      request without blocking the entire site. Note: the PostHog
 *      dashboard's "reverse proxy not configured" check is a known
 *      false-positive when using Next.js rewrites (vs vercel.json
 *      rewrites) — the /d4 path IS proxying correctly; the dashboard
 *      heuristic just doesn't detect Next.js-flavored rewrites. Verified
 *      via Network tab: requests fire to /d4/* on our origin, not
 *      us.i.posthog.com directly.
 *    - `defaults: '2026-01-30'` adopts PostHog's modern preset. Per the
 *      type defs in @posthog/types, '2026-01-30' inherits from earlier
 *      presets (capture_pageview='history_change', strict replay minimum
 *      duration, rageclick content ignore list) plus
 *      external_scripts_inject_target='head'. It does NOT auto-enable
 *      web_vitals or scroll-depth — those need explicit config.
 *    - capture_performance: { web_vitals, network_timing } is set
 *      explicitly here. web_vitals: true tells posthog-js to wrap fetch
 *      and capture LCP/CLS/FCP/INP via Chrome's web-vitals lib. Without
 *      this, $web_vitals events never fire, regardless of the defaults
 *      preset. network_timing: true uses the Performance Observer to
 *      capture network timing alongside session replay; cheap given
 *      session replay stays disabled, but enables the dashboard check.
 *    - Scroll depth captures fire as $pageview properties
 *      ($prev_pageview_max_scroll_percentage etc.) gated by
 *      `disable_scroll_properties` (default false), NOT by autocapture.
 *      So scroll depth fires today regardless of autocapture: false.
 *    - SPA pageview capture is set explicitly to 'history_change' so
 *      $pageview fires on initial load AND on App Router navigations
 *      (history.pushState/replaceState). No need for a separate
 *      SuspendedPostHogPageView component.
 *    - capture_pageleave: true is explicit (preset would default to
 *      'if_capture_pageview' but we want it on regardless).
 *    - Autocapture stays disabled — the LP uses an explicit event taxonomy
 *      (src/lib/analytics.ts) for click/conversion events. Andy locked
 *      this 2026-04 to keep event volume predictable. Trade-off: PostHog
 *      dashboard's autocapture-related "improve your setup" hints will
 *      stay flagged. That is acceptable; we don't want click-firehose.
 *    - Session recording + surveys remain disabled (privacy-conservative
 *      overrides, not in cookie-policy scope).
 *
 *  Init deferral (refined 2026-05-09):
 *    - Init wrapped in requestIdleCallback with timeout: 1000 (down from
 *      3000). Cuts the dead window where fast-bouncing visitors close
 *      the tab BEFORE PostHog's beforeunload listener attaches, which
 *      previously meant their $pageleave events never fired. The 1s
 *      ceiling still respects LCP optimization — PostHog's ~50-60KB
 *      bundle is not blocking initial paint, just deferred slightly.
 *    - 200ms setTimeout fallback for Safari (no requestIdleCallback).
 *
 *  Env requirements (all NEXT_PUBLIC_*, set in Vercel + .env.local):
 *    - NEXT_PUBLIC_POSTHOG_KEY  — project API key (phc_*)
 *    - NEXT_PUBLIC_POSTHOG_HOST — region host (us.i.posthog.com or eu.i.
 *      posthog.com). Used as the rewrite destination, not the SDK target.
 *
 *  Renders children unchanged. */

'use client'

import { useEffect, type ReactNode } from 'react'
import posthog from 'posthog-js'

const STORAGE_KEY = 'cookie-consent'

type Props = {
	children: ReactNode
}

/**
 * @description Initializes PostHog once per client session. Listens for
 * 'cookie-consent-change' to upgrade persistence post-accept. Exposes the
 * posthog instance on window so the typed helper in src/lib/analytics.ts
 * can capture events without importing the SDK in every component.
 *
 * Init deferred to requestIdleCallback (timeout 1000) per launch-day
 * tuning 2026-05-09. The earlier 3000ms ceiling risked fast-bouncing
 * visitors closing the tab before PostHog's beforeunload listener
 * attached, which suppressed $pageleave + skewed bounce-rate. 1s ceiling
 * still respects the LCP path (PostHog ~50-60KB is non-critical) but
 * cuts the dead window where bounce events miss.
 */
export const PostHogProvider = ({ children }: Props) => {
	useEffect(() => {
		/* Defensive .trim() guards against trailing whitespace / newline
		 * characters baked into the env value at Vercel-side or via a
		 * dotenv quoted-value expansion of "\n". A bad key with a trailing
		 * newline silently produced 0 ingest events for an entire pre-
		 * launch window — never again. */
		const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
		if (typeof window === 'undefined') return
		if (!key) {
			console.warn('[PostHog] NEXT_PUBLIC_POSTHOG_KEY missing; skipping init.')
			return
		}
		if (window.posthog) return

		const win = window as Window & {
			requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
			cancelIdleCallback?: (id: number) => void
		}

		let idleId: number | null = null
		let fallbackTimer: ReturnType<typeof setTimeout> | null = null
		let consentListenerAttached = false
		let consentListener: (() => void) | null = null

		const initPostHog = () => {
			if (window.posthog) return

			const consent = localStorage.getItem(STORAGE_KEY)
			const hasAccepted = consent === 'accepted'

			posthog.init(key, {
			/* Use the reverse-proxy path so ad blockers cannot block the
			 * request without blocking the whole site. next.config.ts
			 * rewrites /d4/* to the public PostHog ingest cluster. */
			api_host: '/d4',
			ui_host: 'https://us.posthog.com',

			/* Adopt PostHog's modern defaults preset (2026-01-30 release).
			 * Bundle enables $pageview, $pageleave, scroll depth, and
			 * web vitals capture — the three checks the PostHog dashboard
			 * "improve your setup" panel looks for. Our explicit overrides
			 * below take precedence over anything the preset enables. */
			defaults: '2026-01-30',

			/* Explicit so SPA history.pushState path is unambiguous (App
			 * Router navigation). The defaults preset already sets this
			 * to history_change; explicit value documents the intent and
			 * survives future preset bumps. */
			capture_pageview: 'history_change',

			/* Explicit pageleave capture so bounce rate + session duration
			 * report accurately. */
			capture_pageleave: true,

			/* Core Web Vitals + network timing capture (2026-05-09).
			 * web_vitals=true wraps fetch with Chrome's web-vitals lib so
			 * LCP/CLS/FCP/INP fire as $web_vitals events on every page.
			 * Without this, the defaults preset alone does NOT enable web
			 * vitals capture. network_timing=true layers Performance
			 * Observer data on top — cheap with session replay disabled,
			 * and turns on the dashboard's "performance capture" check. */
			capture_performance: {
				web_vitals: true,
				network_timing: true,
			},

			/* Autocapture enabled (2026-05-09 launch-day flip). On a fresh
			 * marketing LP, autocapture buys click heatmaps, button frequency,
			 * flow analysis, and form interaction signal we'd never get from
			 * an explicit-only event taxonomy. src/lib/analytics.ts still
			 * handles named conversion events on top — autocapture layers
			 * background coverage underneath. Cost is more event volume +
			 * some noise (recoverable via dashboard filters); benefit is no
			 * blind spots on a product whose user behavior is still being
			 * learned. Scroll depth fires as $pageview properties regardless
			 * (gated by `disable_scroll_properties`, default false). */
			autocapture: true,

			/* Privacy-conservative overrides on top of the defaults preset. */
			disable_session_recording: true,
			disable_surveys: true,
			person_profiles: 'identified_only',

			/* Pre-consent: events capture in memory for the session (no
			 * cookies set). On 'cookie-consent-change' to 'accepted' the
			 * persistence is upgraded below. On decline, persistence stays
			 * memory — events still flow, but nothing crosses sessions. */
				persistence: hasAccepted ? 'localStorage+cookie' : 'memory',
				disable_persistence: false,
			})
			window.posthog = posthog

			const onConsentChange = () => {
				const next = localStorage.getItem(STORAGE_KEY)
				if (next === 'accepted') {
					posthog.set_config({ persistence: 'localStorage+cookie' })
				} else if (next === 'declined') {
					posthog.set_config({ persistence: 'memory' })
				}
			}
			window.addEventListener('cookie-consent-change', onConsentChange)
			consentListener = onConsentChange
			consentListenerAttached = true
		}

		if (typeof win.requestIdleCallback === 'function') {
			idleId = win.requestIdleCallback(initPostHog, { timeout: 1000 })
		} else {
			fallbackTimer = setTimeout(initPostHog, 200)
		}

		return () => {
			if (idleId !== null && typeof win.cancelIdleCallback === 'function') {
				win.cancelIdleCallback(idleId)
			}
			if (fallbackTimer !== null) clearTimeout(fallbackTimer)
			if (consentListenerAttached && consentListener) {
				window.removeEventListener('cookie-consent-change', consentListener)
			}
		}
	}, [])

	return <>{children}</>
}
