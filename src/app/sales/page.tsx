/** @fileoverview /sales — Book a Demo. One-column composition with the
 *  Calendly widget as the page subject. CalendlyEmbed loaded via dynamic
 *  import (ssr:false) inside CalendlyWrapper to avoid hydration mismatch.
 *
 *  Restructured 2026-05-02: dropped the prior two-column wrapper (left
 *  host-info card + right iframe with min-h:560 + overflow scroll) which
 *  produced a double-chrome look around the calendar. Now the calendar
 *  sits flush on cc-foundation, auto-sized via react-calendly. Host
 *  attribution lives inline above the calendar; the three "what you get"
 *  bullets live as a horizontal trust strip below. */

import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, VideoCamera, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import CalendlyWrapper from './CalendlyWrapper'

const TITLE = 'Book a Demo'
const DESCRIPTION =
	'Book a 45-minute demo with the CloserCoach team and see how AI sales coaching trains your reps.'

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: '/sales' },
	openGraph: {
		title: `${TITLE} | CloserCoach`,
		description: DESCRIPTION,
		url: '/sales',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: `${TITLE} | CloserCoach`,
		description: DESCRIPTION,
	},
}

const BULLETS = [
	'Live walkthrough of the AI roleplay engine',
	'See real call scoring in action',
	'Custom onboarding plan for your team',
]

export default function SalesPage() {
	return (
		<section className='bg-cc-foundation pb-20 pt-12 md:pb-24 md:pt-16'>
			<div className='mx-auto w-full max-w-3xl px-6'>

				{/* Page headline */}
				<div className='text-center'>
					<p className='mb-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.22em] text-cc-text-muted'>
						No commitment · 45 minutes
					</p>
					<h1
						className='text-cc-text-primary text-balance'
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(1.75rem, 4vw, 3rem)',
							lineHeight: 1.0,
							letterSpacing: '-0.015em',
							fontWeight: 700,
						}}
					>
						See CloserCoach{' '}
						<em className='italic font-bold text-cc-accent'>in action.</em>
					</h1>
					<p className='mt-4 text-base text-cc-text-secondary md:text-lg'>
						Pick a time. Live demo with Taylor.
					</p>
				</div>

				{/* Host attribution — inline strip above the calendar.
				 * Replaces the prior left-side card. Photo + name + meta in one row. */}
				<div className='mt-8 flex items-center justify-center gap-3 text-sm text-cc-text-secondary md:mt-10'>
					<Image
						src='/images/taylor-martinez.jpg'
						alt='Taylor Martinez'
						width={36}
						height={36}
						className='h-9 w-9 rounded-full object-cover ring-2 ring-cc-accent/30'
					/>
					<span className='flex items-center gap-2 md:gap-3'>
						<span className='text-cc-text-primary'>
							with <span className='font-medium text-white'>Taylor Martinez</span>
						</span>
						<span aria-hidden='true' className='text-cc-text-muted'>·</span>
						<span className='inline-flex items-center gap-1.5'>
							<Clock size={14} weight='regular' className='text-cc-accent' aria-hidden='true' />
							45 min
						</span>
						<span aria-hidden='true' className='text-cc-text-muted'>·</span>
						<span className='inline-flex items-center gap-1.5'>
							<VideoCamera size={14} weight='regular' className='text-cc-accent' aria-hidden='true' />
							Video call
						</span>
					</span>
				</div>
			</div>

			{/* Calendly widget — full bleed within max-w-4xl, no wrapper card,
			 * sits flush on cc-foundation. react-calendly auto-sizes via
			 * postMessage so no internal scrollbar. */}
			<div className='mx-auto mt-8 w-full max-w-4xl px-6 md:mt-10'>
				<CalendlyWrapper />
			</div>

			{/* Trust strip — three bullets carry the same proof the prior left
			 * card did, but as a horizontal trust band below the calendar. */}
			<div className='mx-auto mt-12 w-full max-w-3xl px-6 md:mt-16'>
				<ul className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6'>
					{BULLETS.map((b) => (
						<li
							key={b}
							className='flex items-start gap-2.5 text-sm text-cc-text-secondary'
						>
							<CheckCircle
								size={16}
								weight='fill'
								className='mt-0.5 flex-shrink-0 text-cc-accent'
								aria-hidden='true'
							/>
							{b}
						</li>
					))}
				</ul>
			</div>

			{/* Reassurance footer */}
			<p className='mx-auto mt-10 max-w-3xl px-6 text-center text-xs text-cc-text-muted md:mt-12'>
				Can&rsquo;t make these times?{' '}
				<a
					href='mailto:hello@closercoach.ai'
					className='underline-offset-4 transition-colors hover:text-white hover:underline'
				>
					hello@closercoach.ai
				</a>
			</p>
		</section>
	)
}
