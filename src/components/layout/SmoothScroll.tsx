/** @fileoverview Lenis smooth scroll wrapper. Initializes smooth scrolling globally.
 *
 * G-FOOTER-SCROLL fix (2026-05-02): listens for a custom `scroll-reset` event
 * dispatched by ScrollToTop on every route change. When received, snaps
 * Lenis's internal target to 0 in lockstep with the native window scroll so
 * footer Privacy → Terms → Privacy revisits land at the top.
 *
 * H-21 scroll-lock fix (2026-05-04):
 *   - Dropped `force: true` from the scrollTo call (was overriding Lenis's
 *     user-input lock and causing intermittent desktop scroll lock).
 *   - Ref guard against Strict Mode double-init.
 *   - 100ms debounce on `scroll-reset`.
 *
 * Refresh restoration (2026-05-05): we no longer set
 * `history.scrollRestoration = 'manual'` so the browser's native scroll
 * restoration runs on hard refresh — user keeps their scroll position. The
 * footer-revisit fix doesn't need manual restoration; ScrollToTop's
 * pathname-change handler already covers client-side navigation.
 */

'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
	const lenisRef = useRef<Lenis | null>(null)

	useEffect(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) return

		if (lenisRef.current) return

		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
		lenisRef.current = lenis

		function raf(time: number) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}
		requestAnimationFrame(raf)

		let resetTimer: ReturnType<typeof setTimeout> | null = null
		const onScrollReset = () => {
			if (resetTimer) clearTimeout(resetTimer)
			resetTimer = setTimeout(() => {
				lenis.scrollTo(0, { immediate: true })
			}, 100)
		}
		window.addEventListener('scroll-reset', onScrollReset)

		return () => {
			window.removeEventListener('scroll-reset', onScrollReset)
			if (resetTimer) clearTimeout(resetTimer)
			lenis.destroy()
			lenisRef.current = null
		}
	}, [])

	return null
}
