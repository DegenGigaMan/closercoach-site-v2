/* Gates child rendering on requestIdleCallback so non-critical providers
 * (SmoothScroll, ScrollToTop, CookieConsent) don't compete with hero paint. */

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
