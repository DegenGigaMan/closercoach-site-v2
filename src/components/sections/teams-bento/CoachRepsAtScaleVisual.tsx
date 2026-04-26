/** @fileoverview S6 Card 1 visual — "Coach Reps At Scale" calendar mockup.
 *
 * Composition (per Figma 93-16849, hero col-span-2 card):
 *   ─ Top row: "YOUR CALENDAR BEFORE" mono kicker + horizontal connector
 *     ─ Emerald play-orb center marker
 *     ─ "6h cleared up!" emerald pill right
 *
 *   ─ Calendar lane (left ~70%): 8AM / 9AM / 10AM / 11AM time markers with
 *     a horizontal divider per hour. Each hour seats one "Sarah Chen 10:30am"
 *     meeting card (4 cards stacked vertically, the 4th fading to indicate
 *     more below the fold). Each card has a left emerald accent rail + small
 *     portrait + name + time.
 *
 *   ─ AI sessions panel (right ~30%): 5 stacked closer avatars with
 *     `-space-x-N` overlap, "● 10 AI sessions active" emerald label below.
 *
 * The composition narrates: "your calendar is already FULL of repetitive
 * coaching slots — AI takes the repetition, you get 6 hours back." */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { Sparkle } from '@phosphor-icons/react'

const HOURS = ['8 AM', '9 AM', '10 AM', '11 AM'] as const

const STACKED_AVATARS = [
	{ src: '/images/step1/avatar-sarah-v2.png', alt: 'Closer 1' },
	{ src: '/images/avatars/closer-1.png', alt: 'Closer 2' },
	{ src: '/images/avatars/closer-2.png', alt: 'Closer 3' },
	{ src: '/images/avatars/closer-3.png', alt: 'Closer 4' },
	{ src: '/images/step1/avatar-marcus-face.png', alt: 'Closer 5' },
] as const

function MeetingCard({ fading = false }: { fading?: boolean }): ReactElement {
	return (
		<div
			className={`relative flex items-center gap-3 rounded-xl border border-cc-surface-border bg-cc-surface-card/80 px-3 py-2.5 backdrop-blur-sm transition-opacity duration-300 ${fading ? 'opacity-30' : 'opacity-100'}`}
		>
			<span aria-hidden='true' className='absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-cc-accent' />
			<div className='relative ml-1 h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
				<Image
					src='/images/step1/avatar-sarah-v2.png'
					alt='Sarah Chen'
					fill
					sizes='28px'
					className='object-cover'
					unoptimized
				/>
			</div>
			<div className='flex min-w-0 flex-col leading-none'>
				<span className='text-trim text-[13px] font-semibold text-white'>Sarah Chen</span>
				<span className='text-trim mt-1 text-[11px] text-cc-text-secondary'>10:30am</span>
			</div>
		</div>
	)
}

export default function CoachRepsAtScaleVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden bg-cc-foundation px-5 pt-5 pb-3 md:px-8 md:pt-7 md:pb-4'>
			{/* Top row: kicker + connector + play orb + cleared pill. The middle
			 * connectors flex-1 and shrink to nothing on narrow widths so the
			 * 4 anchor elements (kicker, orb, cleared pill) always sit on one
			 * line without overflow. */}
			<div className='flex items-center gap-2 md:gap-3'>
				<span
					className='text-trim shrink-0 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-cc-text-secondary'
				>
					Your calendar before
				</span>
				<span aria-hidden='true' className='hidden h-px flex-1 bg-gradient-to-r from-cc-accent/60 via-cc-accent/30 to-transparent sm:block' />
				<div className='relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cc-foundation-deep ring-2 ring-cc-accent shadow-[0_0_16px_rgba(16,185,129,0.45)]'>
					<Sparkle size={14} weight='fill' className='text-cc-accent' />
				</div>
				<span aria-hidden='true' className='hidden h-px shrink-0 bg-gradient-to-r from-cc-accent/30 to-cc-accent/60 sm:block sm:w-12 md:w-16' />
				<div className='ml-auto shrink-0 rounded-full border border-cc-accent/40 bg-cc-accent/10 px-2.5 py-1.5 sm:ml-0'>
					<span className='text-trim flex items-center gap-1.5 text-[10px] font-medium text-cc-mint md:text-[11px]'>
						<Sparkle size={11} weight='fill' aria-hidden='true' />
						6h cleared up!
					</span>
				</div>
			</div>

			{/* Body: calendar lane (left) + sessions panel (right). On <md the
			 * sessions panel collapses inline below the avatar group so the
			 * calendar lane gets full width and the AI-sessions label doesn't
			 * clip off the card edge. */}
			<div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:gap-6'>
				{/* Calendar lane */}
				<div className='relative flex flex-col gap-2'>
					{HOURS.map((hour, i) => (
						<div key={hour} className='flex items-start gap-3'>
							<span className='text-trim mt-2 w-10 shrink-0 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-wider text-cc-text-secondary/70'>
								{hour}
							</span>
							<div className='relative flex-1'>
								<span aria-hidden='true' className='absolute -top-1 left-0 right-0 h-px bg-cc-surface-border' />
								<MeetingCard fading={i === HOURS.length - 1} />
							</div>
						</div>
					))}
				</div>

				{/* Sessions panel — desktop right-rail / mobile inline below */}
				<div className='flex flex-row items-center gap-3 md:w-[180px] md:flex-col md:items-start md:justify-start md:gap-2.5 md:pt-12'>
					<div className='flex -space-x-2'>
						{STACKED_AVATARS.map((a) => (
							<div key={a.alt} className='relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-cc-foundation'>
								<Image src={a.src} alt={a.alt} fill sizes='28px' className='object-cover' unoptimized />
							</div>
						))}
					</div>
					<p className='text-trim flex items-center gap-1.5 text-[11px] font-medium text-cc-mint'>
						<span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-cc-accent shadow-[0_0_6px_rgba(16,185,129,0.8)]' />
						10 AI sessions active
					</p>
				</div>
			</div>

			{/* Bottom fade so the 4th card seats naturally against card body */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-cc-foundation'
			/>
		</div>
	)
}
