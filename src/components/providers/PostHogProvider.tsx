'use client'

import { useEffect, type ReactNode } from 'react'
import posthog from 'posthog-js'

const STORAGE_KEY = 'cookie-consent'

type Props = {
	children: ReactNode
}

export const PostHogProvider = ({ children }: Props) => {
	useEffect(() => {
		const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
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
			 * rewrites /ingest/* to the public PostHog ingest cluster. */
			api_host: '/ingest',
			ui_host: 'https://us.posthog.com',

			defaults: '2026-01-30',

			/* Explicit so SPA history.pushState path is unambiguous (App
			 * Router navigation). The defaults preset already sets this
			 * to history_change; explicit value documents the intent and
			 * survives future preset bumps. */
			capture_pageview: 'history_change',

			/* Explicit pageleave capture so bounce rate + session duration
			 * report accurately. */
			capture_pageleave: true,

			capture_performance: {
				web_vitals: true,
				network_timing: true,
			},

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
