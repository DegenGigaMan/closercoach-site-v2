/**
 * @fileoverview DeferredMount — gates child rendering on `requestIdleCallback`
 * (with a setTimeout fallback for Safari, which still hasn't shipped the API
 * as of 2026-Q1). Used to keep non-critical providers and overlays out of the
 * first hydration pass so the LCP critical path doesn't pay for them.
 *
 * @description
 * Why this exists: layout.tsx renders SmoothScroll (Lenis init), ScrollToTop
 * (floating-back-to-top button), and CookieConsent (overlay banner) on every
 * page. None of them need to mount before LCP — the user can't have scrolled
 * yet, the back-to-top button is irrelevant pre-scroll, and the cookie banner
 * showing 100-200ms later is acceptable. Mounting them in the first hydration
 * pass adds parse + compile + useEffect cost that competes with hero paint.
 *
 * Per render-delay audit 2026-05-09 Patch 3 (~150-300ms mobile LCP saved).
 *
 * Usage:
 *   <DeferredMount>
 *     <SmoothScroll />
 *     <ScrollToTop />
 *   </DeferredMount>
 */

'use client'

import { useEffect, useState, type ReactNode } from 'react'

type Props = {
	children: ReactNode
	/** Hard timeout if requestIdleCallback never fires (default 3000ms). */
	timeout?: number
}

export default function DeferredMount({ children, timeout = 3000 }: Props) {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return
		let idleId: number | null = null
		let timeoutId: ReturnType<typeof setTimeout> | null = null

		const win = window as Window & {
			requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
			cancelIdleCallback?: (id: number) => void
		}

		if (typeof win.requestIdleCallback === 'function') {
			idleId = win.requestIdleCallback(() => setReady(true), { timeout })
		} else {
			/* Safari fallback. 200ms approximates "after first paint settles." */
			timeoutId = setTimeout(() => setReady(true), 200)
		}

		return () => {
			if (idleId !== null && typeof win.cancelIdleCallback === 'function') {
				win.cancelIdleCallback(idleId)
			}
			if (timeoutId !== null) clearTimeout(timeoutId)
		}
	}, [timeout])

	if (!ready) return null
	return <>{children}</>
}
