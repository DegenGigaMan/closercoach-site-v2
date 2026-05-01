/** @fileoverview Side-effect wrapper that initializes PostHog when cookie
 *  consent is 'accepted'. Re-evaluates on a 'cookie-consent-change' window
 *  event so a later accept (post-decline reversal) wires analytics live.
 *  Renders children unchanged.
 *
 *  Privacy-conservative init defaults:
 *  - autocapture: false (use manual track() for the 8 instrumented events)
 *  - disable_session_recording: true (privacy-sensitive, not in cookie policy scope)
 *  - disable_surveys: true (not used at launch)
 *  - capture_pageview: false (manual SPA pageview emission)
 *  Override at the project level in PostHog UI if any of these change. */

'use client'

import { useEffect, type ReactNode } from 'react'
import posthog from 'posthog-js'

const STORAGE_KEY = 'cookie-consent'

type Props = {
	children: ReactNode
}

/**
 * @description Reads NEXT_PUBLIC_POSTHOG_KEY + NEXT_PUBLIC_POSTHOG_HOST from
 * env. If either is missing, logs a console warning and skips init (no crash).
 * Also exposes the posthog instance on window so the typed helper in
 * src/lib/analytics.ts can capture events without importing the SDK.
 */
export const PostHogProvider = ({ children }: Props) => {
	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
		const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

		const tryInit = () => {
			if (typeof window === 'undefined') return
			const consent = localStorage.getItem(STORAGE_KEY)
			if (consent !== 'accepted') return
			if (!key || !host) {
				// Surface in console but never throw — env wiring lands later in launch-readiness wave.
				console.warn('[PostHog] NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST missing; skipping init.')
				return
			}
			if (window.posthog) return
			posthog.init(key, {
				api_host: host,
				capture_pageview: false,
				autocapture: false,
				disable_session_recording: true,
				disable_surveys: true,
				persistence: 'localStorage+cookie',
			})
			window.posthog = posthog
		}

		tryInit()

		const onConsentChange = () => tryInit()
		window.addEventListener('cookie-consent-change', onConsentChange)
		return () => {
			window.removeEventListener('cookie-consent-change', onConsentChange)
		}
	}, [])

	return <>{children}</>
}
