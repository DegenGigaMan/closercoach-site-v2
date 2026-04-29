/** @fileoverview Wave Y.1 (Alim 2026-04-28): force scroll-to-top on mount of
 * the blog post route. The AnnouncementBanner Read More link routes here from
 * any page, and Next.js default route navigation can preserve scroll position
 * (or pause briefly under Lenis smooth-scroll) so users land mid-article.
 * This client effect resets window scroll instantly on mount, then taps Lenis
 * via window.scrollTo so the Lenis wrapper picks up the same target. */

'use client'

import { useEffect } from 'react'

export default function ScrollTopOnMount() {
	useEffect(() => {
		// Instant jump: bypass any in-flight Lenis tween. 'auto' over 'smooth'
		// because the user just landed on a new route and expects the article
		// header, not a slow scroll choreography.
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
	}, [])

	return null
}
