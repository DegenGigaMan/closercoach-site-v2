/** @fileoverview /sales — Book a Demo. Light-mode warm page with AL-020 top
 *  content block (Hyperbound-inspired): headline + intro + 3 benefit cards
 *  (Train / Score / Progress), then a two-column unified card (info left,
 *  Calendly right). Top block adds substance without pushing the calendar
 *  below the fold on desktop; concise enough to keep the calendar reachable
 *  with a short scroll on mobile. */

import Image from 'next/image'
import { Clock, VideoCamera, CheckCircle, Globe, Sparkle } from '@phosphor-icons/react/dist/ssr'
import CalendlyWrapper from './CalendlyWrapper'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
	title: 'Book a Demo',
	description: 'Book a 45-minute demo with the CloserCoach team and see how AI sales coaching trains your reps.',
	path: '/sales',
})

const BULLETS = [
	'Live walkthrough of the AI roleplay engine',
	'See real call scoring in action',
	'Custom onboarding plan for your team',
]

/* AL-020 (Alim 2026-05-15): top content block copy. Hyperbound-inspired
 * mobile layout pattern — light surface, large bold headline, short intro,
 * 3 stacked benefit cards with green sparkle icons + bold lead words. */
const BENEFITS = [
	{
		lead: 'Train',
		body: 'Reps practice with AI roleplays that sound like real buyers — real objections, real pressure, real stakes. Built for the calls your team actually makes, not generic scripts.',
	},
	{
		lead: 'Score',
		body: 'AI scorecards turn every call into a clear picture of what worked, what didn’t, and what to fix. The coaching moment stops being a guess.',
	},
	{
		lead: 'Progress',
		body: 'Track skill growth across your whole team. See who’s improving, who’s plateauing, and who needs you — before it shows up in the pipeline.',
	},
] as const

const BG = '#FAF9F7'
const BENEFIT_CARD_BG = '#EEF4FB'
const BENEFIT_CARD_BORDER = 'rgba(15, 23, 42, 0.06)'
const TEXT_PRIMARY = '#111827'
const TEXT_SECONDARY = '#4B5563'
const TEXT_MUTED = '#9CA3AF'
const DIVIDER = 'rgba(0,0,0,0.08)'

export default function SalesPage() {
	return (
		<section className='min-h-screen py-10 md:py-12' style={{ background: BG }}>
			<div className='mx-auto w-full max-w-5xl px-6'>

				{/* AL-020 top content block — Hyperbound-inspired. Concise so the
				 * unified booking card below remains visible quickly on desktop
				 * and reachable with one short scroll on mobile. */}
				<div className='mx-auto flex max-w-3xl flex-col items-center gap-5 pb-10 text-center md:pb-12'>
					<h2
						className='text-balance leading-[1.05]'
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
							fontWeight: 700,
							letterSpacing: '-0.015em',
							color: TEXT_PRIMARY,
						}}
					>
						The Mobile First{' '}
						<em className='italic' style={{ color: '#059669' }}>Revenue Activation</em>{' '}
						Platform
					</h2>
					<p
						className='text-pretty text-[15px] leading-relaxed md:text-base'
						style={{ color: TEXT_SECONDARY }}
					>
						CloserCoach is the AI sales training platform that builds real skill through realistic practice, then proves it on every call. See exactly where each rep stands — and exactly how to get them to quota.
					</p>
				</div>

				<div className='grid grid-cols-1 gap-3 pb-12 md:grid-cols-3 md:gap-4 md:pb-14'>
					{BENEFITS.map((b) => (
						<div
							key={b.lead}
							className='flex flex-col gap-2 rounded-xl p-5 md:p-6'
							style={{
								background: BENEFIT_CARD_BG,
								border: `1px solid ${BENEFIT_CARD_BORDER}`,
							}}
						>
							<Sparkle
								size={18}
								weight='fill'
								className='shrink-0'
								style={{ color: '#10B981' }}
								aria-hidden='true'
							/>
							<p className='text-[15px] leading-relaxed' style={{ color: TEXT_SECONDARY }}>
								<span className='font-semibold' style={{ color: TEXT_PRIMARY }}>
									{b.lead}.
								</span>{' '}
								{b.body}
							</p>
						</div>
					))}
				</div>

				{/* Unified card */}
				<div
					className='overflow-hidden rounded-2xl'
					style={{
						background: BG,
						boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.07)',
						border: '1px solid rgba(0,0,0,0.08)',
					}}
				>
					<div className='flex flex-col lg:flex-row'>

						{/* ── Left info panel ── */}
						<div
							className='flex flex-col gap-7 p-8 lg:w-96 lg:shrink-0 lg:p-10'
							style={{ background: BG, borderRight: `1px solid ${DIVIDER}` }}
						>
							{/* Logo — matches navbar: dark green bg + icon + wordmark */}
							<div className='flex items-center gap-2.5'>
								<div
									className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md'
									style={{ background: 'linear-gradient(135deg, #0D2B1A 0%, #0A1F12 100%)' }}
								>
									<Image
										src='/cc-logomark-192.png'
										alt=''
										width={22}
										height={22}
									/>
								</div>
								<span
									className='text-[15px] font-semibold tracking-tight'
									style={{ color: TEXT_PRIMARY }}
								>
									CloserCoach
								</span>
							</div>

							{/* Divider */}
							<div className='h-px' style={{ background: DIVIDER }} />

							{/* Host */}
							<div className='flex items-center gap-3'>
								<Image
									src='/images/taylor-martinez.jpg'
									alt='Taylor Martinez'
									width={44}
									height={44}
									className='h-11 w-11 rounded-full object-cover'
									style={{ boxShadow: '0 0 0 2px rgba(16,185,129,0.4)' }}
								/>
								<div>
									<p className='text-xs' style={{ color: TEXT_MUTED }}>with</p>
									<p className='text-sm font-semibold' style={{ color: TEXT_PRIMARY }}>Taylor Martinez</p>
								</div>
							</div>

							{/* Meeting title */}
							<div>
								<h1
									className='text-balance leading-tight'
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)',
										fontWeight: 700,
										letterSpacing: '-0.01em',
										color: TEXT_PRIMARY,
									}}
								>
									See CloserCoach{' '}
									<em className='italic' style={{ color: '#059669' }}>in action.</em>
								</h1>
								<p className='mt-2 text-sm leading-relaxed' style={{ color: TEXT_SECONDARY }}>
									Live demo of how top sales teams use AI roleplay to close more deals.
								</p>
							</div>

							{/* Meta */}
							<ul className='flex flex-col gap-2.5 text-sm' style={{ color: TEXT_SECONDARY }}>
								<li className='flex items-center gap-2.5'>
									<Clock size={14} weight='regular' className='shrink-0' style={{ color: TEXT_MUTED }} />
									45 minutes
								</li>
								<li className='flex items-center gap-2.5'>
									<VideoCamera size={14} weight='regular' className='shrink-0' style={{ color: TEXT_MUTED }} />
									Video call
								</li>
								<li className='flex items-center gap-2.5'>
									<Globe size={14} weight='regular' className='shrink-0' style={{ color: TEXT_MUTED }} />
									Your timezone
								</li>
							</ul>

							{/* Divider */}
							<div className='h-px' style={{ background: DIVIDER }} />

							{/* What you get */}
							<ul className='flex flex-col gap-2.5'>
								{BULLETS.map((b) => (
									<li key={b} className='flex items-start gap-2.5 text-sm' style={{ color: TEXT_SECONDARY }}>
										<CheckCircle size={14} weight='fill' className='mt-0.5 shrink-0' style={{ color: '#10B981' }} />
										{b}
									</li>
								))}
							</ul>

							{/* Reassurance */}
							<p className='mt-auto text-xs' style={{ color: TEXT_MUTED }}>
								Can&rsquo;t make these times?{' '}
								<a
									href='mailto:hello@closercoach.ai'
									className='underline-offset-4 hover:underline'
									style={{ color: '#059669' }}
								>
									hello@closercoach.ai
								</a>
							</p>
						</div>

						{/* ── Right calendar panel ── */}
						<div
							className='flex min-w-0 flex-1 flex-col items-center justify-center p-6 lg:p-8'
							style={{ background: BG }}
						>
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
