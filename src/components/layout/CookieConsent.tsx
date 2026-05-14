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
