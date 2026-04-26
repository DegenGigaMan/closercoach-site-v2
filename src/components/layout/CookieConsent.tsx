/** @fileoverview Cookie consent banner.
 *  Wave I FIX-01 (P0) + Wave J.1 (FIX-01 P1, 2026-04-26):
 *  - Mobile (<md): full-width bottom-CENTER slim bar (~52px), 44px tap targets.
 *  - Desktop (md+): compact pill (~280×80) at bottom-right corner, 28px buttons.
 *  - Hidden by default. Shows ONLY when ALL of:
 *      (a) user has scrolled past hero (>= 200px scrollY)
 *      (b) >= 4s elapsed since mount (clean first impression)
 *      (c) NO element with [data-primary-cta] is currently in viewport
 *        (IntersectionObserver tracks all such elements; banner suppresses
 *         while any are visible so primary purchase CTAs are never occluded)
 *  - Persisted to localStorage. */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'
const SCROLL_THRESHOLD = 200
const MIN_DELAY_MS = 4000

export default function CookieConsent() {
	const [allowedToShow, setAllowedToShow] = useState(false)
	const [primaryCtaVisible, setPrimaryCtaVisible] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const scrollPassedRef = useRef(false)
	const delayPassedRef = useRef(false)

	useEffect(() => {
		const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
		if (stored) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
			setDismissed(true)
			return
		}

		const checkAllowed = () => {
			if (scrollPassedRef.current && delayPassedRef.current) {
				setAllowedToShow(true)
			}
		}

		const onScroll = () => {
			if (!scrollPassedRef.current && window.scrollY >= SCROLL_THRESHOLD) {
				scrollPassedRef.current = true
				checkAllowed()
			}
		}

		const delayTimer = setTimeout(() => {
			delayPassedRef.current = true
			checkAllowed()
		}, MIN_DELAY_MS)

		window.addEventListener('scroll', onScroll, { passive: true })
		// Trigger initial check in case user is already scrolled
		onScroll()

		// Observe primary CTA elements. While any is in view, banner stays hidden.
		const visibleSet = new Set<Element>()
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visibleSet.add(entry.target)
					} else {
						visibleSet.delete(entry.target)
					}
				}
				setPrimaryCtaVisible(visibleSet.size > 0)
			},
			{ threshold: 0.1 }
		)

		// Defer observer attachment to next frame so client components have rendered.
		const attachTimer = setTimeout(() => {
			const targets = document.querySelectorAll('[data-primary-cta]')
			targets.forEach((el) => observer.observe(el))
		}, 100)

		return () => {
			clearTimeout(delayTimer)
			clearTimeout(attachTimer)
			window.removeEventListener('scroll', onScroll)
			observer.disconnect()
		}
	}, [])

	const handleChoice = (choice: 'accepted' | 'declined') => {
		localStorage.setItem(STORAGE_KEY, choice)
		setDismissed(true)
	}

	if (dismissed || !allowedToShow || primaryCtaVisible) return null

	/* Wave J.1 (FIX-01 P1):
	 *  - <md (mobile, ≤767px): full-width bottom-CENTER slim bar (~52px tall).
	 *    Mercury and Linear use this on mobile because mobile content reaches
	 *    edge-to-edge — a bottom-LEFT pill consistently overlaps adjacent
	 *    content (cards, badges, avatars) on every surface.
	 *  - md+ (desktop, 768px+): bottom-RIGHT corner pill from Wave I (compact,
	 *    primary-CTA-aware, doesn't fight desktop content).
	 *  - Tap targets: h-11 (44px) on mobile to clear iOS HIG floor; h-7 (28px)
	 *    on md+ keeps the desktop pill compact. */
	return (
		<aside
			role='complementary'
			aria-label='Cookie notice'
			className='fixed inset-x-0 bottom-0 z-50 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-[280px]'
		>
			<div className='flex min-h-[52px] items-center justify-center gap-2 border-t border-cc-surface-border bg-cc-surface/95 px-4 py-2 shadow-lg backdrop-blur-md sm:min-h-0 sm:justify-start sm:rounded-full sm:border sm:px-3'>
				<p className='flex-1 text-xs leading-tight text-cc-text-secondary sm:flex-1'>
					Cookies?{' '}
					<Link
						href='/cookie-policy'
						className='text-cc-accent underline-offset-2 hover:underline'
					>
						Learn
					</Link>
				</p>
				<button
					type='button'
					onClick={() => handleChoice('declined')}
					className='inline-flex h-11 items-center justify-center rounded-full px-3 text-xs text-cc-text-secondary transition-colors hover:text-white sm:h-7 sm:px-2.5'
				>
					Decline
				</button>
				<button
					type='button'
					onClick={() => handleChoice('accepted')}
					className='inline-flex h-11 items-center justify-center rounded-full bg-cc-accent px-4 text-xs font-medium text-cc-foundation transition-colors hover:bg-cc-accent-hover sm:h-7 sm:px-3'
				>
					Accept
				</button>
			</div>
		</aside>
	)
}
