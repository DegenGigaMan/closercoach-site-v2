/** @fileoverview Sticky top announcement banner. Dismissable, persisted via localStorage.
 *  Sits ABOVE the sticky Header. Sets --cc-banner-h on <html> so Header and main can offset. */

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from '@phosphor-icons/react'

const STORAGE_KEY = 'cc-announcement-dismissed-2026-04-27'
const BANNER_HEIGHT = 36

type AnnouncementBannerProps = {
	message?: string
	href?: string
	linkLabel?: string
}

export default function AnnouncementBanner({
	message = 'CloserCoach raises $1M to build Duolingo for sales',
	href = '/blog/closercoach-raises-1m',
	linkLabel = 'Read more',
}: AnnouncementBannerProps) {
	// SSR-safe initial: render nothing until client hydrates.
	const [dismissed, setDismissed] = useState<boolean | null>(null)
	const ranRef = useRef(false)

	useEffect(() => {
		if (ranRef.current) return
		ranRef.current = true
		const stored = localStorage.getItem(STORAGE_KEY) === '1'
		// eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
		setDismissed(stored)
		document.documentElement.style.setProperty(
			'--cc-banner-h',
			stored ? '0px' : `${BANNER_HEIGHT}px`
		)
	}, [])

	const dismiss = () => {
		localStorage.setItem(STORAGE_KEY, '1')
		setDismissed(true)
		document.documentElement.style.setProperty('--cc-banner-h', '0px')
	}

	if (dismissed !== false) return null

	return (
		<aside
			role='complementary'
			aria-label='Site announcement'
			className='fixed left-0 right-0 top-0 z-[60] border-b border-cc-accent/20 bg-cc-surface'
			style={{ height: BANNER_HEIGHT }}
		>
			{/* Wave R FIX-02: whole banner is a single Link so the entire horizontal
			 * area is the tap target on mobile (was: small inline "Read more" link
			 * that clipped past the 390 viewport edge via `truncate`). The dismiss
			 * button sits OUTSIDE the Link so tapping the X dismisses without
			 * navigating to the post. */}
			{href ? (
				<Link
					href={href}
					aria-label={`${message} — ${linkLabel}`}
					className='absolute inset-0 flex h-full items-center justify-center gap-3 px-6 text-xs text-cc-text-secondary md:text-sm'
				>
					<span className='relative flex h-2 w-2 shrink-0' aria-hidden='true'>
						<span className='absolute inline-flex h-full w-full rounded-full bg-cc-accent opacity-60 motion-safe:animate-ping' />
						<span className='relative inline-flex h-2 w-2 rounded-full bg-cc-accent' />
					</span>
					<p className='mx-auto max-w-[calc(100%-72px)] truncate text-center'>
						<span className='text-white'>{message}</span>
						{' '}
						<span className='text-cc-accent underline-offset-2 group-hover:underline'>
							{linkLabel}
						</span>
					</p>
				</Link>
			) : (
				<div className='mx-auto flex h-full max-w-7xl items-center justify-center gap-3 px-6 text-xs text-cc-text-secondary md:text-sm'>
					<span className='relative flex h-2 w-2 shrink-0' aria-hidden='true'>
						<span className='absolute inline-flex h-full w-full rounded-full bg-cc-accent opacity-60 motion-safe:animate-ping' />
						<span className='relative inline-flex h-2 w-2 rounded-full bg-cc-accent' />
					</span>
					<p className='truncate text-center'>
						<span className='text-white'>{message}</span>
					</p>
				</div>
			)}
			<button
				type='button'
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					dismiss()
				}}
				aria-label='Dismiss announcement'
				className='absolute right-3 top-1/2 z-[1] flex h-6 w-6 shrink-0 -translate-y-1/2 items-center justify-center rounded text-cc-text-muted transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-cc-accent'
			>
				<X size={14} weight='bold' />
			</button>
		</aside>
	)
}
