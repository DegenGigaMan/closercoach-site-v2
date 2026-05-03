/** @fileoverview Lenis smooth scroll wrapper. Initializes smooth scrolling globally.
 *
 * G-FOOTER-SCROLL fix (2026-05-02):
 *   1. Disable the browser's automatic scrollRestoration so back/forward navigation
 *      and revisits to a cached URL don't replay an old scroll position. Without
 *      this, navigating to a previously-visited page (e.g. footer Privacy →
 *      Terms → Privacy) silently restores the prior scroll position before our
 *      ScrollToTop effect runs, and Lenis can end up animating from that restored
 *      position instead of from the top.
 *   2. Listen for a custom `scroll-reset` event dispatched by ScrollToTop on
 *      every route change. When received, call lenis.scrollTo(0, immediate+force)
 *      so Lenis's internal target snaps to the top in lockstep with the native
 *      window scroll. Fixes the race where window.scrollTo(0) wins on first
 *      navigation but Lenis's lerping over a stale target wins on repeat visits
 *      to the same URL.
 */

'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
	useEffect(() => {
		if ('scrollRestoration' in window.history) {
			window.history.scrollRestoration = 'manual'
		}

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) return

		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
		function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
		requestAnimationFrame(raf)

		const onScrollReset = () => {
			lenis.scrollTo(0, { immediate: true, force: true })
		}
		window.addEventListener('scroll-reset', onScrollReset)

		return () => {
			window.removeEventListener('scroll-reset', onScrollReset)
			lenis.destroy()
		}
	}, [])
	return null
}
