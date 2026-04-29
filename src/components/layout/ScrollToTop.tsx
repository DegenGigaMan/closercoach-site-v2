/** @fileoverview Wave AA.1 (Andy 2026-04-28): global route-change scroll reset.
 *
 * Mounted once in the root layout. Listens to pathname changes via Next.js
 * `usePathname()` and resets window scroll to the top on every route change.
 * Replaces the per-route ScrollTopOnMount that only fixed the blog post page
 * (Wave Y.1). Now any internal route navigation -- footer legal links,
 * announcement banner Read More, header nav, /thank-you redirect -- lands at
 * the page top regardless of where the user was scrolled.
 *
 * Behavior:
 *   - Skips the initial mount (browser handles fresh navigations natively;
 *     routing this would fight Lenis on first paint).
 *   - On every subsequent pathname change, calls window.scrollTo with
 *     behavior 'auto'. Using 'auto' over 'smooth' because the user just
 *     navigated and expects the new page header, not a slow scroll
 *     choreography. Lenis picks up the same target via the standard
 *     window.scrollTo API.
 *   - SmoothScroll's Lenis instance does not intercept programmatic
 *     window.scrollTo calls in lerp:0.1 mode, so the jump is instant and
 *     subsequent user wheel events resume Lenis-smoothed motion.
 */

'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
	const pathname = usePathname()
	const isFirstMount = useRef(true)

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false
			return
		}
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
	}, [pathname])

	return null
}
