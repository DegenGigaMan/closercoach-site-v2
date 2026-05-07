/** @fileoverview PostHog initialization + SPA pageview capture.
 *
 *  Mount strategy (refined 2026-05-06 — adopted modern defaults preset):
 *    - Init PostHog ALWAYS on first client render (regardless of cookie
 *      consent state). Pre-consent persistence is `memory` so no cookies
 *      are written until the user accepts. On accept, persistence is
 *      upgraded to `localStorage+cookie` for cross-session continuity.
 *      On decline, persistence stays `memory` (events still capture for
 *      that session; nothing persists across reloads).
 *    - Reverse proxy via /ingest/* (next.config.ts rewrites). The Vercel
 *      env var NEXT_PUBLIC_POSTHOG_HOST (e.g. https://us.i.posthog.com)
 *      is the *project region indicator* — it tells the rewrite which
 *      PostHog cluster to target. The SDK itself uses '/ingest' relative
 *      to our origin so ad blockers cannot block the request without
 *      blocking the entire site.
 *    - `defaults: '2026-01-30'` adopts PostHog's modern preset, which
 *      enables $pageview + $pageleave + scroll depth + web vitals. This
 *      is what fills the 3 checks PostHog's dashboard "improve your
 *      setup" panel scans for. Explicit options below take precedence.
 *    - SPA pageview capture is set explicitly to 'history_change' so
 *      $pageview fires on initial load AND on App Router navigations
 *      (history.pushState/replaceState). No need for a separate
 *      SuspendedPostHogPageView component.
 *    - capture_pageleave: true is explicit (preset would default to
 *      'if_capture_pageview' but we want it on regardless).
 *    - Autocapture stays disabled — the LP uses an explicit event taxonomy
 *      (src/lib/analytics.ts) for click/conversion events. Pageviews +
 *      pageleaves + scroll + web vitals are auto-captured via the preset.
 *    - Session recording + surveys remain disabled (privacy-conservative
 *      overrides, not in cookie-policy scope).
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
 */
export const PostHogProvider = ({ children }: Props) => {
	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
		if (typeof window === 'undefined') return
		if (!key) {
			console.warn('[PostHog] NEXT_PUBLIC_POSTHOG_KEY missing; skipping init.')
			return
		}
		if (window.posthog) return

		const consent = localStorage.getItem(STORAGE_KEY)
		const hasAccepted = consent === 'accepted'

		posthog.init(key, {
			/* Use the reverse-proxy path so ad blockers cannot block the
			 * request without blocking the whole site. next.config.ts
			 * rewrites /ingest/* to the public PostHog ingest cluster. */
			api_host: '/ingest',
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

			/* Autocapture disabled — explicit event taxonomy in
			 * src/lib/analytics.ts handles clicks + conversions. Keeps
			 * event volume predictable + the dashboard signal-clean.
			 * Overrides the defaults preset's autocapture setting. */
			autocapture: false,

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
		return () => {
			window.removeEventListener('cookie-consent-change', onConsentChange)
		}
	}, [])

	return <>{children}</>
}
