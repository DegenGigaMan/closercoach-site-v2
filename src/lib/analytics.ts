import type { PostHog } from 'posthog-js'

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

declare global {
	interface Window {
		posthog?: PostHog
	}
}

export const track = (event: EventName, properties?: Record<string, unknown>): void => {
	if (typeof window === 'undefined') return
	window.posthog?.capture(event, properties)
}
