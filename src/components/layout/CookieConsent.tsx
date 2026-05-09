/** @fileoverview Cookie consent banner.
 *
 *  L-01 (2026-05-09): visibility now anchored on a SINGLE IntersectionObserver
 *  watching `#press-strip` (the third major LP section after Hero + SocialProof).
 *  Once press-strip enters the viewport for the first time, the banner is
 *  shown and the latch stays open — scrolling back up does NOT hide it. This
 *  replaces the prior multi-trigger logic (scroll threshold + delay + primary
 *  CTA observer) which produced the bug Andy flagged: the banner flashed
 *  briefly while the user was still in or just past the hero (because the
 *  hero's primary CTA temporarily left the viewport), vanished, then
 *  reappeared persistently at section 3. The new logic shows it ONCE at the
 *  intended moment and persists.
 *
 *  Mobile (<md): full-width bottom-CENTER slim bar (~52px), 44px tap targets.
 *  Desktop (md+): wide center-aligned banner at bottom (max-w-2xl, longer copy).
 *  Persisted choice in localStorage suppresses the banner permanently.
 *
 *  Falls back to the old `#how-it-works` anchor (section 4) if `#press-strip`
 *  is not present in the DOM, so subpages that don't render the press strip
 *  still get a deterministic show point. */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'

const STORAGE_KEY = 'cookie-consent'

export default function CookieConsent() {
	const [allowedToShow, setAllowedToShow] = useState(false)
	const [dismissed, setDismissed] = useState(false)

	useEffect(() => {
		const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
		if (stored) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
			setDismissed(true)
			return
		}

		/* Section 3 anchor: PressStrip is the third major LP section (Hero,
		 * SocialProof, PressStrip). Falls back to How It Works on subpages
		 * that don't render PressStrip. If neither anchor exists (legal pages,
		 * /pricing, etc.), the body fallback fires once the page is scrolled
		 * past 800px, so the banner still appears on long pages. */
		const anchor =
			document.querySelector('#press-strip') ||
			document.querySelector('#how-it-works') ||
			null

		let observer: IntersectionObserver | null = null
		let onScroll: (() => void) | null = null
		const reveal = () => setAllowedToShow(true)

		if (anchor) {
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							reveal()
							observer?.disconnect()
							observer = null
							break
						}
					}
				},
				{ threshold: 0.1 },
			)
			observer.observe(anchor)
		} else {
			onScroll = () => {
				if (window.scrollY >= 800) {
					reveal()
					if (onScroll) {
						window.removeEventListener('scroll', onScroll)
						onScroll = null
					}
				}
			}
			window.addEventListener('scroll', onScroll, { passive: true })
			onScroll()
		}

		return () => {
			observer?.disconnect()
			if (onScroll) window.removeEventListener('scroll', onScroll)
		}
	}, [])

	const handleChoice = (choice: 'accepted' | 'declined') => {
		localStorage.setItem(STORAGE_KEY, choice)
		window.dispatchEvent(new Event('cookie-consent-change'))
		track('cookie_consent_choice', { choice })
		setDismissed(true)
	}

	if (dismissed || !allowedToShow) return null

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

			{/* Desktop banner (md+). H-07-FIX (2026-05-05): bumped max-width
			 * xl→2xl and added whitespace-nowrap on the copy so the full
			 * "We use cookies to improve your experience. Learn more" line
			 * + Decline + Accept buttons all sit on a single row at md+. */}
			<div className='mx-auto hidden max-w-2xl items-center justify-between gap-4 rounded-xl border border-cc-surface-border bg-cc-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-md md:flex'>
				<p className='whitespace-nowrap text-sm text-cc-text-secondary'>
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
