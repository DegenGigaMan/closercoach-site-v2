/** @fileoverview Typed PostHog event helper. Defensive: no-ops if PostHog
 *  hasn't been initialized (cookie consent declined or not yet granted). */

import type { PostHog } from 'posthog-js'

/**
 * @description Canonical event taxonomy for the CC LP. Adding a new event?
 * Add it here first so all callers are type-checked.
 */
export type EventName =
	| 'hero_cta_click'
	| 'pricing_tier_select'
	| 'book_demo_click'
	| 'download_click'
	| 'faq_open'
	| 'scroll_depth_25'
	| 'scroll_depth_50'
	| 'scroll_depth_75'
	| 'scroll_depth_100'
	| 'cookie_consent_choice'
	| 'route_view'

declare global {
	interface Window {
		posthog?: PostHog
	}
}

/**
 * @description Fire a typed PostHog capture. Safe to call from any component
 * lifecycle: noop on the server, noop if PostHog isn't loaded.
 */
export const track = (event: EventName, properties?: Record<string, unknown>): void => {
	if (typeof window === 'undefined') return
	window.posthog?.capture(event, properties)
}
