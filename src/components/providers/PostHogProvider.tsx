/** @fileoverview PostHog initialization + SPA pageview capture.
 *
 *  Mount strategy (rewritten 2026-05-05):
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
 *    - SPA pageview capture is enabled via capture_pageview: 'history_change'
 *      so $pageview fires on initial load AND on App Router navigations
 *      (history.pushState/replaceState). No need for a separate
 *      SuspendedPostHogPageView component.
 *    - Autocapture stays disabled — the LP uses an explicit event taxonomy
 *      (src/lib/analytics.ts) for click/conversion events. Pageviews are
 *      the only auto-captured event.
 *    - Session recording + surveys remain disabled (privacy-conservative
 *      defaults, not in cookie-policy scope).
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

			/* Capture $pageview on initial load AND on history.pushState /
			 * replaceState (App Router SPA navigation). This is the single
			 * config that fixed the "no data captured" issue — the prior
			 * setup used capture_pageview: false with no manual pageview
			 * emitter, so zero $pageview events ever fired. */
			capture_pageview: 'history_change',

			/* Autocapture disabled — explicit event taxonomy in
			 * src/lib/analytics.ts handles clicks + conversions. Keeps
			 * event volume predictable + the dashboard signal-clean. */
			autocapture: false,

			/* Privacy-conservative defaults. */
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
