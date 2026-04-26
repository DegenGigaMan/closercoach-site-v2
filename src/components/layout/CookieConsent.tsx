/** @fileoverview Cookie consent banner. Wave I FIX-01 (P0):
 *  - Compact pill (~280×80) at bottom-right corner.
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

	return (
		<aside
			role='complementary'
			aria-label='Cookie notice'
			className='fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-[280px]'
		>
			<div className='flex items-center gap-2 rounded-full border border-cc-surface-border bg-cc-surface/95 px-3 py-2 shadow-lg backdrop-blur-md'>
				<p className='flex-1 text-xs leading-tight text-cc-text-secondary'>
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
					className='inline-flex h-7 items-center justify-center rounded-full px-2.5 text-xs text-cc-text-secondary transition-colors hover:text-white'
				>
					Decline
				</button>
				<button
					type='button'
					onClick={() => handleChoice('accepted')}
					className='inline-flex h-7 items-center justify-center rounded-full bg-cc-accent px-3 text-xs font-medium text-cc-foundation transition-colors hover:bg-cc-accent-hover'
				>
					Accept
				</button>
			</div>
		</aside>
	)
}
