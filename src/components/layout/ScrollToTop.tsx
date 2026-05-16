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
 *   - Skips the initial mount (browser handles fresh navigations natively).
 *   - On every subsequent pathname change, calls window.scrollTo to reset the
 *     native scroll position AND dispatches a `scroll-reset` event so the
 *     SmoothScroll/Lenis listener can snap Lenis's internal target to 0 with
 *     immediate+force. This avoids the race where Lenis was lerping toward a
 *     stale target (e.g. the bottom of the previous page's footer) and ended
 *     up overriding the native scrollTo on repeat visits to the same URL.
 *
 * G-FOOTER-SCROLL fix (2026-05-02): added the scroll-reset event dispatch
 * so revisits like footer Privacy → Terms → Privacy land at the top every
 * time, not only on the first click.
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
		window.dispatchEvent(new Event('scroll-reset'))
	}, [pathname])

	return null
}
