/** @fileoverview S5 Results (W4 blueprint v2 port). Warm surface. Real-proof orbit
 * composition replaces the prior "Undisputed Leader" superlative headline + skill
 * dashboard variant.
 *
 * Composition per section-blueprint v2 S5:
 *   1. Small Geist Mono overline: "Real numbers. Real closers."
 *   2. Billboard headline (AO once-per-page treatment): "The Numbers That Prove
 *      You're Getting Better." Lora Bold clamp(3rem, 10vw, 8rem). "Getting Better"
 *      italicized for emphasis (weight+italic per VIS S2 lock -- color variation
 *      avoided on warm surface for WCAG AA).
 *   3. Orbit proof cards (6 desktop, 3 mobile):
 *        A -- Profile anchor (duotone avatar, A- grade, 4/5 tier dots)
 *        B -- Scorecard (5 dimension bars, "Pitch: B+" chip)
 *        C -- Before/After (Week 1 C- to Week 8 A, +3 delta)
 *        D -- Coached vs Uncoached (76% vs 47%, Hyperbound attribution, P4)
 *        E -- Performance Gains (P1 7%, P2 50%, P3 30%)
 *        F -- Quota Hit Donut (76%, coached weekly)
 *      Mobile collapses to A + B + D only per blueprint "Mobile critical" note.
 *   4. Context callout: "Coached weekly: 76% quota hit. Coached quarterly: 47%.
 *      CloserCoach coaches you every day."
 *   5. App Store testimonial carousel (3 CS-1 badged cards: A3 DH8125, A6 anon,
 *      A7 pif taylor). Named customers T2/T3 reserved for S5.5, not duplicated.
 *   6. Review count anchor: "378+ reviews on the App Store." (A2)
 *   7. Ego appeal line: "After one roleplay you will know: B grade, Top 15%,
 *      211 WPM, 64/36 talk-listen ratio. Every number gets better." (PC5 + PC6)
 *
 * Copy locked to lp-copy-deck-v5. Proof locked to proof-inventory (P1, P2, P3, P4,
 * A2, A3, A4, A6, A7, PC5, PC6, IB6 Hyperbound attribution).
 *
 * WCAG AA on warm surface:
 *   - Emerald text uses #059669 (cc-accent-hover), not #10B981
 *   - Amber stat text uses #D97706 (amber-600), not #F59E0B
 *   - Body text: #475569 (text-secondary-warm) on #F5F0EB = 6.7:1
 *   - Headlines: #1A1D26 (text-primary-warm) on #F5F0EB = 14.9:1
 *
 * Hydration safety: all initial props are stable. No client-branched state in
 * initial. Reduced-motion via useReducedMotion collapses transitions to duration 0.
 *
 * Zero fabricated data. Marcus Chen / Meridian Financial killed per blueprint.
 * Profile card uses anonymized "Insurance closer" label (names reserved for S5.5). */

'use client'

import { useRef, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA } from '@/lib/constants'
import { Star } from '@phosphor-icons/react'

/* ── Tokens used inline where Tailwind token lookup is insufficient for AA ── */

const AMBER_AA = '#D97706' // amber-600: AA-safe stat text on warm surface
const EMERALD_AA = '#059669' // cc-accent-hover: AA-safe emerald text on warm

/* ── Shared reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactElement | ReactElement[]
	className?: string
	delay?: number
}

/**
 * @description Local scroll-reveal wrapper. Stable initial props so server and client
 * first-render match. Reduced motion collapses the transition to 0s, preserving the
 * same initial opacity (visible due to animate=) without visual flicker.
 */
function Reveal({ children, className = '', delay = 0 }: RevealProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement | null>(null)
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 18 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{children}
		</motion.div>
	)
}

/* ── Orbit Card A: Profile anchor ── */

/**
 * @description Profile anchor card. Anonymous sample closer with duotone avatar
 * (CSS filter emerald tint on the existing SVG placeholder), industry label,
 * A- grade, 4-of-5 tier dots. Copy note "Illustrative scorecard data" flags this
 * as representative, not a named customer (names reserved for S5.5).
 */
function ProfileAnchorCard(): ReactElement {
	return (
		<div className='rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			<div className='flex items-center gap-4'>
				<div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cc-warm-border'>
					{/* Duotone treatment applied via CSS filter: sepia into emerald hue-rotate
					    plus slight saturation trim. The placeholder SVG is intentionally generic
					    and not a real customer portrait. */}
					<Image
						src='/images/avatars/closer-1.svg'
						alt=''
						aria-hidden='true'
						fill
						sizes='64px'
						style={{
							filter: 'sepia(0.9) hue-rotate(90deg) saturate(1.4) brightness(0.85)',
							objectFit: 'cover',
						}}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<span className='text-sm font-semibold text-cc-text-primary-warm'>
						Insurance closer
					</span>
					<span className='font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
						8-week progression
					</span>
				</div>
			</div>

			<div className='mt-6 flex items-end justify-between'>
				<div className='flex flex-col gap-1'>
					<span
						className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-cc-text-secondary-warm'
					>
						Overall grade
					</span>
					<span
						className='font-[family-name:var(--font-heading)]'
						style={{
							fontWeight: 700,
							fontSize: '3rem',
							lineHeight: 1,
							color: EMERALD_AA,
						}}
					>
						A-
					</span>
				</div>
				{/* 4-of-5 tier dots */}
				<div className='flex items-center gap-1.5' aria-label='Tier rating 4 of 5'>
					{[0, 1, 2, 3, 4].map((i) => (
						<span
							key={i}
							className='block h-2.5 w-2.5 rounded-full'
							style={{
								backgroundColor: i < 4 ? EMERALD_AA : 'rgba(0,0,0,0.12)',
							}}
						/>
					))}
				</div>
			</div>

			<p className='mt-5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
				Illustrative scorecard data
			</p>
		</div>
	)
}

/* ── Orbit Card B: Scorecard ── */

const SCORECARD_DIMENSIONS: ReadonlyArray<{ label: string; pct: number; grade: string }> = [
	{ label: 'Discovery', pct: 78, grade: 'B+' },
	{ label: 'Pitch', pct: 84, grade: 'B+' },
	{ label: 'Objection Handling', pct: 72, grade: 'B' },
	{ label: 'Closing', pct: 80, grade: 'B+' },
	{ label: 'Tonality', pct: 85, grade: 'A-' },
] as const

/**
 * @description Scorecard card. 5 dimension horizontal bars with emerald fill on a
 * neutral track, plus a "Pitch: B+" chip top-right as the signature moment.
 */
function ScorecardCard(): ReactElement {
	return (
		<div className='rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex flex-col gap-1'>
					<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
						Your closer score
					</span>
					<span className='display-sm text-cc-text-primary-warm'>5 dimensions</span>
				</div>
				<span
					className='shrink-0 rounded-full px-3 py-1 text-xs font-semibold'
					style={{
						backgroundColor: 'rgba(5,150,105,0.12)',
						color: EMERALD_AA,
					}}
				>
					Pitch: B+
				</span>
			</div>

			<div className='mt-5 flex flex-col gap-3'>
				{SCORECARD_DIMENSIONS.map((d) => (
					<div key={d.label} className='flex items-center gap-3'>
						<span className='w-32 shrink-0 text-[12px] font-medium text-cc-text-primary-warm md:text-sm'>
							{d.label}
						</span>
						<div className='h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]'>
							<div
								className='h-full rounded-full'
								style={{ width: `${d.pct}%`, backgroundColor: EMERALD_AA }}
							/>
						</div>
						<span
							className='w-8 shrink-0 text-right font-[family-name:var(--font-mono)] text-[11px] font-medium'
							style={{ color: EMERALD_AA }}
						>
							{d.grade}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

/* ── Orbit Card C: Before / After ── */

/**
 * @description Before/After comparison card. Week 1 C- (muted/red) vs Week 8 A
 * (emerald), vertical bar graphic underneath each, +3 delta badge. Context copy
 * labels this as "Representative user journey" -- not a universal guarantee.
 */
function BeforeAfterCard(): ReactElement {
	return (
		<div className='rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			<div className='flex items-center justify-between'>
				<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
					Progression
				</span>
				<span
					className='rounded-full px-2.5 py-0.5 text-[11px] font-semibold'
					style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: EMERALD_AA }}
				>
					+3 grades
				</span>
			</div>

			<div className='mt-5 grid grid-cols-2 gap-4'>
				<div className='flex flex-col items-start gap-2'>
					<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
						Week 1
					</span>
					<span
						className='font-[family-name:var(--font-heading)]'
						style={{ fontWeight: 700, fontSize: '2.5rem', lineHeight: 1, color: '#9CA3AF' }}
					>
						C-
					</span>
					<div className='mt-1 h-12 w-8 rounded-sm bg-black/[0.12]' aria-hidden='true' />
				</div>
				<div className='flex flex-col items-start gap-2'>
					<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
						Week 8
					</span>
					<span
						className='font-[family-name:var(--font-heading)]'
						style={{ fontWeight: 700, fontSize: '2.5rem', lineHeight: 1, color: EMERALD_AA }}
					>
						A
					</span>
					<div
						className='mt-1 h-20 w-8 rounded-sm'
						style={{ backgroundColor: EMERALD_AA }}
						aria-hidden='true'
					/>
				</div>
			</div>

			<p className='mt-5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
				Representative user journey
			</p>
		</div>
	)
}

/* ── Orbit Card D: Coached vs Uncoached ── */

/**
 * @description Coached vs Uncoached 2-row horizontal bar comparison. Deploys P4
 * (Hyperbound industry benchmark, not a CC-specific claim). Proper attribution
 * in Geist Mono muted below the chart satisfies IB6.
 */
function CoachingComparisonCard(): ReactElement {
	return (
		<div className='rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			<div className='flex flex-col gap-1'>
				<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
					Quota attainment
				</span>
				<span className='display-sm text-cc-text-primary-warm'>Coached vs uncoached</span>
			</div>

			<div className='mt-5 flex flex-col gap-4'>
				{/* Uncoached row */}
				<div className='flex items-center gap-3'>
					<span className='w-20 shrink-0 text-[12px] font-medium text-cc-text-primary-warm'>
						Uncoached
					</span>
					<div className='relative h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]'>
						<div
							className='h-full rounded-full bg-black/[0.25]'
							style={{ width: '47%' }}
						/>
					</div>
					<span
						className='w-10 shrink-0 text-right font-[family-name:var(--font-mono)] text-[12px] font-semibold text-cc-text-secondary-warm'
					>
						47%
					</span>
				</div>
				{/* Coached row */}
				<div className='flex items-center gap-3'>
					<span className='w-20 shrink-0 text-[12px] font-medium text-cc-text-primary-warm'>
						Coached
					</span>
					<div className='relative h-3 flex-1 overflow-hidden rounded-full bg-black/[0.06]'>
						<div
							className='h-full rounded-full'
							style={{ width: '76%', backgroundColor: EMERALD_AA }}
						/>
					</div>
					<span
						className='w-10 shrink-0 text-right font-[family-name:var(--font-mono)] text-[12px] font-semibold'
						style={{ color: EMERALD_AA }}
					>
						76%
					</span>
				</div>
			</div>

			<p className='mt-5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
				Industry benchmark &middot; Hyperbound
			</p>
		</div>
	)
}

/* ── Orbit Card E: Performance Gains ── */

const PERFORMANCE_GAINS: ReadonlyArray<{ value: string; label: string }> = [
	{ value: '7%', label: 'Close rate' },
	{ value: '50%', label: 'Faster ramp' },
	{ value: '30%', label: 'More deals' },
] as const

/**
 * @description Performance gains stack. 3 rows, each a big Geist Mono amber
 * (AA-safe #D97706) number + Inter label. Deploys P1, P2, P3 verbatim.
 */
function PerformanceGainsCard(): ReactElement {
	return (
		<div className='rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
				Performance gains
			</span>
			<div className='mt-4 flex flex-col gap-3'>
				{PERFORMANCE_GAINS.map((g) => (
					<div
						key={g.label}
						className='flex items-baseline justify-between gap-4 border-b border-cc-warm-border pb-3 last:border-b-0 last:pb-0'
					>
						<span
							className='font-[family-name:var(--font-mono)]'
							style={{
								fontWeight: 500,
								fontSize: '2rem',
								lineHeight: 1.1,
								color: AMBER_AA,
							}}
						>
							{g.value}
						</span>
						<span className='text-sm text-cc-text-secondary-warm'>{g.label}</span>
					</div>
				))}
			</div>
		</div>
	)
}

/* ── Orbit Card F: Quota Hit Donut ── */

/**
 * @description Quota hit donut. 76% emerald (AA) donut fill with big center
 * number. Deploys P4 in donut form (complements Card D's bar comparison).
 * Context line: "Coached weekly." SVG stroke-dasharray calculation for 76%.
 */
function QuotaDonutCard(): ReactElement {
	const RADIUS = 58
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS
	const PCT = 76
	const OFFSET = CIRCUMFERENCE * (1 - PCT / 100)

	return (
		<div className='rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
				Quota hit
			</span>

			<div className='mt-3 flex items-center justify-center py-2'>
				<div className='relative h-36 w-36'>
					<svg
						viewBox='0 0 140 140'
						width='100%'
						height='100%'
						aria-hidden='true'
					>
						{/* Track */}
						<circle
							cx='70'
							cy='70'
							r={RADIUS}
							fill='none'
							stroke='rgba(0,0,0,0.08)'
							strokeWidth='12'
						/>
						{/* Arc */}
						<circle
							cx='70'
							cy='70'
							r={RADIUS}
							fill='none'
							stroke={EMERALD_AA}
							strokeWidth='12'
							strokeLinecap='round'
							strokeDasharray={CIRCUMFERENCE}
							strokeDashoffset={OFFSET}
							transform='rotate(-90 70 70)'
						/>
					</svg>
					<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
						<span
							className='font-[family-name:var(--font-mono)]'
							style={{
								fontWeight: 500,
								fontSize: '2.25rem',
								lineHeight: 1,
								color: EMERALD_AA,
							}}
						>
							76%
						</span>
					</div>
				</div>
			</div>

			<p className='mt-2 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
				Coached weekly
			</p>
		</div>
	)
}

/* ── App Store testimonial cards ── */

type Review = {
	quote: string
	handle: string
}

const APP_STORE_REVIEWS: ReadonlyArray<Review> = [
	{
		quote:
			"This app has helped me streamline my process. I am able to get in 'reps' while I learn. Really good with specific scenarios, and helping you with pace, tonality, and goals completed.",
		handle: 'DH8125',
	},
	{
		quote:
			"After coming back to this app after a couple of months I'm super impressed at the improvements that have been made. Highly recommend this app!!!",
		handle: 'Anonymous',
	},
	{
		quote:
			"I can already tell it's going to be the next wave of sales training and recruiting. I can see myself using this to help drill my closers.",
		handle: 'pif taylor',
	},
] as const

/**
 * @description App Store review card. CS-1 badge (star cluster + source pill),
 * italic quote body, handle in Geist Mono muted.
 */
function ReviewCard({ quote, handle }: Review): ReactElement {
	return (
		<div className='flex h-full flex-col rounded-lg border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-7'>
			{/* CS-1 badge: 5 stars + App Store source pill */}
			<div className='flex items-center gap-3'>
				<div className='flex gap-0.5' aria-label='Five stars'>
					{Array.from({ length: 5 }, (_, i) => (
						<Star key={i} size={14} weight='fill' style={{ color: AMBER_AA }} aria-hidden='true' />
					))}
				</div>
				<span
					className='rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]'
					style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: EMERALD_AA }}
				>
					App Store Review
				</span>
			</div>

			<p
				className='mt-5 flex-1 text-[15px] leading-relaxed text-cc-text-primary-warm md:text-base'
				style={{ fontStyle: 'italic' }}
			>
				&ldquo;{quote}&rdquo;
			</p>

			<p className='mt-5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-cc-text-secondary-warm'>
				{handle}
			</p>
		</div>
	)
}

/* ── Section ── */

/**
 * @description S5 Results. Warm surface with billboard headline as gravity center,
 * 6 real orbit proof cards (3 on mobile), context callout, App Store testimonial
 * carousel, review count anchor, and ego appeal line. All data traces to proof-
 * inventory (P1, P2, P3, P4, A2, A3, A6, A7, PC5, PC6, IB6). Zero fabricated
 * metrics or named customers.
 */
export default function SectionResults(): ReactElement {
	return (
		<section
			id='results'
			data-surface='warm'
			className='relative bg-cc-warm py-16 md:py-24'
		>
			<div className='mx-auto max-w-7xl px-6'>
				{/* Overline + Billboard headline */}
				<Reveal className='flex flex-col items-center text-center'>
					<p className='mb-5 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary-warm md:text-xs'>
						Real numbers. Real closers.
					</p>
					<h2
						className='text-balance text-cc-text-primary-warm'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: 'clamp(2.25rem, 10vw, 8rem)',
							lineHeight: 0.96,
							letterSpacing: '-0.015em',
						}}
					>
						The Numbers That Prove You&rsquo;re{' '}
						<span style={{ fontStyle: 'italic' }}>Getting Better</span>.
					</h2>
				</Reveal>

				{/* Orbit cards -- desktop: 3 col x 2 row; mobile: A + B + D only */}
				<div className='mt-12 md:mt-20'>
					{/* Desktop grid (6 cards) */}
					<div className='hidden gap-5 md:grid md:grid-cols-3 md:gap-6'>
						<Reveal delay={0}>
							<ProfileAnchorCard />
						</Reveal>
						<Reveal delay={0.05}>
							<ScorecardCard />
						</Reveal>
						<Reveal delay={0.1}>
							<BeforeAfterCard />
						</Reveal>
						<Reveal delay={0.15}>
							<CoachingComparisonCard />
						</Reveal>
						<Reveal delay={0.2}>
							<PerformanceGainsCard />
						</Reveal>
						<Reveal delay={0.25}>
							<QuotaDonutCard />
						</Reveal>
					</div>

					{/* Mobile stack (3 cards: A, B, D) -- per blueprint mobile-critical note */}
					<div className='flex flex-col gap-5 md:hidden'>
						<Reveal delay={0}>
							<ProfileAnchorCard />
						</Reveal>
						<Reveal delay={0.05}>
							<ScorecardCard />
						</Reveal>
						<Reveal delay={0.1}>
							<CoachingComparisonCard />
						</Reveal>
					</div>
				</div>

				{/* Context callout */}
				<Reveal className='mt-12 md:mt-16' delay={0.05}>
					<p className='mx-auto max-w-3xl text-center text-base text-cc-text-primary-warm md:text-lg'>
						Coached weekly:{' '}
						<span className='font-semibold' style={{ color: EMERALD_AA }}>
							76%
						</span>{' '}
						quota hit. Coached quarterly:{' '}
						<span className='font-semibold text-cc-text-secondary-warm'>47%</span>.
						CloserCoach coaches you every day.
					</p>
				</Reveal>

				{/* App Store testimonial carousel */}
				<div className='mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3 md:gap-6'>
					{APP_STORE_REVIEWS.map((r, i) => (
						<Reveal key={r.handle} delay={i * 0.08}>
							<ReviewCard quote={r.quote} handle={r.handle} />
						</Reveal>
					))}
				</div>

				{/* Review count anchor (A2) */}
				<Reveal className='mt-8 md:mt-10' delay={0.05}>
					<p className='text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-cc-text-secondary-warm'>
						378+ reviews on the App Store.
					</p>
				</Reveal>

				{/* Ego appeal line (PC5 + PC6) */}
				<Reveal className='mt-16 md:mt-24' delay={0.05}>
					<p className='mx-auto max-w-3xl text-balance text-center text-base text-cc-text-primary-warm md:text-lg'>
						After one roleplay you will know:{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>B grade</span>
						{' '}&middot;{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>Top 15%</span>
						{' '}&middot;{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>211 WPM</span>
						{' '}&middot;{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>
							64/36 talk-listen ratio
						</span>
						. Every number gets better.
					</p>
				</Reveal>

				{/* CTA */}
				<Reveal className='mt-12 flex justify-center md:mt-16' delay={0.05}>
					<MotionCTA variant='primary' size='lg' href={CTA.tryFree.href} warmSurface>
						{CTA.tryFree.text}
					</MotionCTA>
				</Reveal>
			</div>
		</section>
	)
}
