/** @fileoverview Fires scroll_depth_25 / 50 / 75 / 100 events once per page
 *  view as the user crosses each threshold. Resets on route change. */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track, type EventName } from '@/lib/analytics'

const THRESHOLDS: ReadonlyArray<{ pct: number; event: EventName }> = [
	{ pct: 25, event: 'scroll_depth_25' },
	{ pct: 50, event: 'scroll_depth_50' },
	{ pct: 75, event: 'scroll_depth_75' },
	{ pct: 100, event: 'scroll_depth_100' },
]

export const ScrollDepthTracker = () => {
	const pathname = usePathname()

	useEffect(() => {
		const fired = new Set<number>()

		const compute = () => {
			const doc = document.documentElement
			const scrollable = doc.scrollHeight - window.innerHeight
			if (scrollable <= 0) return
			const pct = (window.scrollY / scrollable) * 100
			for (const { pct: threshold, event } of THRESHOLDS) {
				if (pct >= threshold && !fired.has(threshold)) {
					fired.add(threshold)
					track(event, { pathname })
				}
			}
		}

		const onScroll = () => {
			window.requestAnimationFrame(compute)
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		// Initial compute in case page is short enough that 25% is already passed.
		compute()

		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [pathname])

	return null
}
