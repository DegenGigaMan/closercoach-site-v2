/** @fileoverview /sales — Book a Demo. Two-column card layout: info left,
 *  Calendly right. Both columns sit inside a single bordered card on the
 *  dark page surface, separated by a vertical rule. */

import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, VideoCamera, CheckCircle, Globe } from '@phosphor-icons/react/dist/ssr'
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
		<section className='min-h-screen bg-cc-foundation py-12 md:py-16'>
			<div className='mx-auto w-full max-w-5xl px-6'>

				{/* Unified card */}
				<div className='overflow-hidden rounded-2xl border border-white/[0.08]'>
					<div className='flex flex-col lg:flex-row'>

						{/* ── Left info panel ── */}
						<div className='flex flex-col gap-7 bg-white/[0.02] p-8 lg:w-96 lg:shrink-0 lg:p-10'>

							{/* Host */}
							<div className='flex items-center gap-3'>
								<Image
									src='/images/taylor-martinez.jpg'
									alt='Taylor Martinez'
									width={44}
									height={44}
									className='h-11 w-11 rounded-full object-cover ring-2 ring-cc-accent/30'
								/>
								<div>
									<p className='text-xs text-cc-text-muted'>with</p>
									<p className='text-sm font-semibold text-white'>Taylor Martinez</p>
								</div>
							</div>

							{/* Divider */}
							<div className='h-px bg-white/[0.06]' />

							{/* Meeting title */}
							<div>
								<h1
									className='text-balance leading-tight text-white'
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)',
										fontWeight: 700,
										letterSpacing: '-0.01em',
									}}
								>
									See CloserCoach{' '}
									<em className='italic text-cc-accent'>in action.</em>
								</h1>
								<p className='mt-2 text-sm leading-relaxed text-cc-text-secondary'>
									Live demo of how top sales teams use AI roleplay to close more deals.
								</p>
							</div>

							{/* Meta */}
							<ul className='flex flex-col gap-2.5 text-sm text-cc-text-secondary'>
								<li className='flex items-center gap-2.5'>
									<Clock size={14} weight='regular' className='shrink-0 text-cc-text-muted' />
									45 minutes
								</li>
								<li className='flex items-center gap-2.5'>
									<VideoCamera size={14} weight='regular' className='shrink-0 text-cc-text-muted' />
									Video call
								</li>
								<li className='flex items-center gap-2.5'>
									<Globe size={14} weight='regular' className='shrink-0 text-cc-text-muted' />
									Your timezone
								</li>
							</ul>

							{/* Divider */}
							<div className='h-px bg-white/[0.06]' />

							{/* What you get */}
							<ul className='flex flex-col gap-2.5'>
								{BULLETS.map((b) => (
									<li key={b} className='flex items-start gap-2.5 text-sm text-cc-text-secondary'>
										<CheckCircle size={14} weight='fill' className='mt-0.5 shrink-0 text-cc-accent' />
										{b}
									</li>
								))}
							</ul>

							{/* Reassurance */}
							<p className='mt-auto text-xs text-cc-text-muted'>
								Can&rsquo;t make these times?{' '}
								<a
									href='mailto:hello@closercoach.ai'
									className='text-cc-accent/80 underline-offset-4 hover:text-cc-accent hover:underline'
								>
									hello@closercoach.ai
								</a>
							</p>
						</div>

						{/* Vertical divider (desktop only) */}
						<div className='hidden w-px shrink-0 bg-white/[0.08] lg:block' />

						{/* ── Right calendar panel ── */}
						<div className='flex min-w-0 flex-1 items-center justify-center p-6 lg:p-8'>
							<div className='w-full max-w-[520px]'>
								<CalendlyWrapper />
							</div>
						</div>

					</div>
				</div>

			</div>
		</section>
	)
}
