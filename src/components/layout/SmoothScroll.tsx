/** @fileoverview Lenis smooth scroll wrapper. Initializes smooth scrolling globally.
 *
 * G-FOOTER-SCROLL fix (2026-05-02):
 *   1. Disable the browser's automatic scrollRestoration so back/forward navigation
 *      and revisits to a cached URL don't replay an old scroll position.
 *   2. Listen for a custom `scroll-reset` event dispatched by ScrollToTop on
 *      every route change. When received, snap Lenis's internal target to 0 in
 *      lockstep with the native window scroll.
 *
 * H-21 scroll-lock fix (2026-05-04):
 *   - Dropped `force: true` from the scrollTo call — it was overriding Lenis's
 *     user-input lock. When a path change fired mid-scroll, Lenis's targetScroll
 *     snapped to 0 while actualScroll was mid-page, so Lenis thought it was "at
 *     target" and stopped processing wheel events until refresh.
 *   - Added ref guard against double-init under Strict Mode (effect runs →
 *     cleanup → re-runs in dev; without the guard the listener could be on a
 *     destroyed Lenis instance).
 *   - Added 100ms debounce on `scroll-reset` so back-to-back path changes
 *     don't double-snap.
 */

'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
	const lenisRef = useRef<Lenis | null>(null)

	useEffect(() => {
		if ('scrollRestoration' in window.history) {
			window.history.scrollRestoration = 'manual'
		}

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
