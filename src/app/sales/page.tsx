/** @fileoverview /sales — Book a Demo. Fits in one viewport height.
 *  CalendlyEmbed loaded with ssr:false to avoid hydration mismatch. */

import type { Metadata } from 'next'
import { Clock, VideoCamera, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import CalendlyWrapper from './CalendlyWrapper'

const TITLE = 'Book a Demo'
const DESCRIPTION =
	'Book a 30-minute demo with the CloserCoach team and see how AI sales coaching can level up your reps.'

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
		<section className='flex min-h-[calc(100dvh-4rem)] flex-col bg-cc-foundation py-10 md:py-12'>
			<div className='mx-auto flex w-full max-w-6xl flex-1 flex-col px-6'>

				{/* Page headline */}
				<div className='mb-8 text-center'>
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
				</div>

				{/* Two-column layout — flex-1 so it fills remaining viewport */}
				<div className='flex flex-1 flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8'>

					{/* ── Left: host info ── */}
					<div className='flex-shrink-0 lg:w-64'>
						<div className='h-full rounded-2xl border border-white/[0.06] bg-cc-surface-card/40 p-7'>
							{/* Avatar */}
							<div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-cc-accent/30 bg-cc-accent/10'>
								<span className='font-[family-name:var(--font-heading)] text-lg font-bold text-cc-accent'>
									TM
								</span>
							</div>

							<p className='mb-1 text-sm text-cc-text-muted'>Taylor Martinez</p>
							<h2
								className='mb-5 text-lg font-bold text-cc-text-primary'
								style={{ fontFamily: 'var(--font-heading)' }}
							>
								Complimentary Team Setup Call
							</h2>

							{/* Meta */}
							<div className='mb-5 flex flex-col gap-2.5'>
								<div className='flex items-center gap-2 text-sm text-cc-text-secondary'>
									<Clock size={15} weight='regular' className='flex-shrink-0 text-cc-accent' aria-hidden />
									45 min
								</div>
								<div className='flex items-center gap-2 text-sm text-cc-text-secondary'>
									<VideoCamera size={15} weight='regular' className='flex-shrink-0 text-cc-accent' aria-hidden />
									Video call
								</div>
							</div>

							<div className='mb-5 h-px bg-white/[0.06]' />

							{/* Bullets */}
							<ul className='flex flex-col gap-2.5'>
								{BULLETS.map((b) => (
									<li key={b} className='flex items-start gap-2 text-sm text-cc-text-secondary'>
										<CheckCircle size={15} weight='fill' className='mt-0.5 flex-shrink-0 text-cc-accent' aria-hidden />
										{b}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* ── Right: Calendly embed ── */}
					<div className='min-h-[560px] min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0f14]'>
						<CalendlyWrapper />
					</div>

				</div>
			</div>
		</section>
	)
}
