import Image from 'next/image'
import { Clock, VideoCamera, CheckCircle, Globe } from '@phosphor-icons/react/dist/ssr'
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

const BG = '#FAF9F7'
const TEXT_PRIMARY = '#111827'
const TEXT_SECONDARY = '#4B5563'
const TEXT_MUTED = '#9CA3AF'
const DIVIDER = 'rgba(0,0,0,0.08)'

export default function SalesPage() {
	return (
		<section className='min-h-screen py-12 md:py-16' style={{ background: BG }}>
			<div className='mx-auto w-full max-w-5xl px-6'>

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
