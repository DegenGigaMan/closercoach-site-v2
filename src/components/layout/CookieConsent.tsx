/** @fileoverview Cookie consent banner.
 *  Wave I FIX-01 (P0) + Wave J.1 (FIX-01 P1, 2026-04-26) + H-07 (2026-05-04):
 *  - Mobile (<md): full-width bottom-CENTER slim bar (~52px), 44px tap targets.
 *  - Desktop (md+): wide center-aligned banner at bottom (max-w-xl, longer copy).
 *    Reverts the Wave I/J.1 bottom-right corner pill which felt awkward on
 *    desktop (Andy 2026-05-04) — the wider bar reads as a deliberate notice
 *    rather than a tiny dismissable pill.
 *  - Hidden by default. Shows ONLY when ALL of:
 *      (a) user has scrolled past hero (>= 200px scrollY)
 *      (b) >= 4s elapsed since mount (clean first impression)
 *      (c) NO element with [data-primary-cta] is currently in viewport
 *  - Persisted to localStorage. */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'

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
		onScroll()

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
		window.dispatchEvent(new Event('cookie-consent-change'))
		track('cookie_consent_choice', { choice })
		setDismissed(true)
	}

	if (dismissed || !allowedToShow || primaryCtaVisible) return null

	/* H-07 (2026-05-04):
	 *   - Mobile (<md): full-width bottom bar from Wave J.1, 44px tap targets,
	 *     short "Cookies?" copy (mobile real-estate is tight).
	 *   - Desktop (md+): wider center-aligned banner with the longer
	 *     "We use cookies to improve your experience. Learn more" copy.
	 *     max-w-xl (~576px), bottom: 1rem, mx-auto, rounded-xl shell.
	 */
	return (
		<aside
			role='complementary'
			aria-label='Cookie notice'
			className='fixed inset-x-0 bottom-0 z-50 md:bottom-4 md:p-4'
		>
			{/* Mobile bar (<md) */}
			<div className='flex min-h-[52px] items-center justify-center gap-2 border-t border-cc-surface-border bg-cc-surface/95 px-4 py-2 shadow-lg backdrop-blur-md md:hidden'>
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
					className='inline-flex h-11 items-center justify-center rounded-full px-3 text-xs text-cc-text-secondary transition-colors hover:text-white'
				>
					Decline
				</button>
				<button
					type='button'
					onClick={() => handleChoice('accepted')}
					className='inline-flex h-11 items-center justify-center rounded-full bg-cc-accent px-4 text-xs font-medium text-cc-foundation transition-colors hover:bg-cc-accent-hover'
				>
					Accept
				</button>
			</div>

			{/* Desktop banner (md+) */}
			<div className='mx-auto hidden max-w-xl items-center justify-between gap-4 rounded-xl border border-cc-surface-border bg-cc-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-md md:flex'>
				<p className='text-sm text-cc-text-secondary'>
					We use cookies to improve your experience.{' '}
					<Link
						href='/cookie-policy'
						className='text-cc-accent underline-offset-2 hover:underline'
					>
						Learn more
					</Link>
				</p>
				<div className='flex shrink-0 items-center gap-2'>
					<button
						type='button'
						onClick={() => handleChoice('declined')}
						className='rounded-lg px-3 py-1.5 text-sm text-cc-text-secondary transition-colors hover:text-white'
					>
						Decline
					</button>
					<button
						type='button'
						onClick={() => handleChoice('accepted')}
						className='rounded-lg bg-cc-accent px-3 py-1.5 text-sm font-medium text-cc-foundation transition-colors hover:bg-cc-accent-hover'
					>
						Accept
					</button>
				</div>
			</div>
		</aside>
	)
}
