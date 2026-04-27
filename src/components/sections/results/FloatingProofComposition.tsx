/** @fileoverview S5 Results — Floating Proof Composition per Figma 81:4377.
 *
 * Replaces the prior hub-spoke composition. 6 designed proof components
 * orbit the centered "Every call, scored. Every rep, improving." billboard
 * on a warm surface:
 *
 *   1. Camil Reese profile card (top-left) — Recent Performance bars
 *      (Week 1 amber C, Week 8 emerald A with +2 trust badge)
 *   2. Pitch score card (top-right) — B+ rating + You 72% / Top 10% 89%
 *      progress bars
 *   3. Close Rate ↑10% pill (mid-left)
 *   4. "We have a deal" italic quote pill (center-bottom)
 *   5. 7-Dimensions Scored radar (center) — Discovery / Pitch / Objection
 *      Handling / Closing / Tonality / Pace / Clarity heptagon
 *   6. Coached vs Uncoached area chart (bottom-right) — 2x outcome delta
 *
 * Desktop (lg+): floating layout with absolute positioning matching the
 * Figma frame exactly. Container max-w-[1232px] mx-auto h-[600px].
 *
 * Mobile (<lg): vertical stack — headline centered on top, all 6 cards
 * stack below in a 1-col then 2-col grid that surfaces the most narrative
 * cards (profile + pitch + radar + chart) and puts the chip components
 * (close rate + quote) in their own row.
 *
 * AA-safe on warm surface — emerald #059669 (cc-accent-hover), no raw
 * #10B981 in interactive text. Card backgrounds use cc-warm-secondary
 * (#F2EDE5) with subtle border + emerald-tinted shadow per Figma. */

'use client'

import { useRef, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { CaretDown, ArrowUp } from '@phosphor-icons/react'

const EMERALD_AA = '#059669'
const AMBER_WARM = '#B45309'
const CARD_BG = 'rgba(242,237,229,0.9)'
const CARD_BORDER = 'rgba(0,0,0,0.06)'
const CARD_SHADOW = '0 0 24px rgba(16,185,129,0.06), 0 8px 24px rgba(13,15,20,0.04)'

const CAMIL_AVATAR = '/images/avatars/closer-1.png'

/* ─── Float wrapper: handles entrance motion + reduced-motion fallback ─── */

type FloatProps = {
	children: ReactElement
	delay?: number
	className?: string
	style?: React.CSSProperties
}

function Float({ children, delay = 0, className = '', style }: FloatProps): ReactElement {
	const reduced = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement | null>(null)
	const inView = useInView(ref, { once: true, margin: '-10% 0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			style={style}
			initial={{ opacity: 0, y: 16 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
			transition={reduced ? { duration: 0 } : { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{children}
		</motion.div>
	)
}

/* ─── 1. Camil Reese profile card ─── */

function CamilReeseProfileCard(): ReactElement {
	return (
		<div
			className='flex w-[240px] flex-col gap-4 rounded-2xl p-[13px]'
			style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
		>
			{/* Header: avatar + name + role */}
			<div className='flex items-center gap-3'>
				<div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full' style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
					<Image src={CAMIL_AVATAR} alt='Camil Reese' fill sizes='32px' className='object-cover' unoptimized />
				</div>
				<div className='flex min-w-0 flex-col gap-1'>
					<p className='text-trim text-[12px] font-semibold leading-none' style={{ color: 'rgba(0,0,0,0.7)' }}>
						Camil Reese
					</p>
					<p className='text-trim text-[10px] leading-none' style={{ color: 'rgba(0,0,0,0.5)' }}>
						Sales rep
					</p>
				</div>
			</div>

			{/* Recent Performance label */}
			<p className='text-trim text-[10px] font-medium leading-tight text-black'>
				Recent Performance
			</p>

			{/* Two bars: Week 1 (amber C, short) + Week 8 (emerald A, tall) */}
			<div className='flex items-end justify-center gap-6'>
				<div className='flex flex-1 flex-col gap-2'>
					<div
						className='flex h-[47px] items-start rounded-t-xl px-[9px] py-[13px]'
						style={{
							background: 'rgba(245,158,11,0.1)',
							border: '1px solid rgba(245,158,11,0.1)',
						}}
					>
						<span
							className='text-[24px] font-bold leading-none'
							style={{ fontFamily: 'var(--font-heading)', color: AMBER_WARM }}
						>
							C
						</span>
					</div>
					<p className='text-center text-[10px] font-medium leading-tight' style={{ color: 'rgba(0,0,0,0.4)' }}>
						Week 1
					</p>
				</div>
				<div className='flex flex-1 flex-col gap-2'>
					<div
						className='flex h-[86px] items-start rounded-t-xl px-[9px] py-[13px]'
						style={{
							background: 'rgba(16,185,129,0.1)',
							border: '1px solid rgba(16,185,129,0.1)',
						}}
					>
						<div className='flex items-center gap-1'>
							<span
								className='text-[24px] font-bold leading-none'
								style={{ fontFamily: 'var(--font-heading)', color: EMERALD_AA }}
							>
								A
							</span>
							<span
								className='inline-flex items-center gap-0.5 rounded p-[3px]'
								style={{ background: EMERALD_AA, border: '1px solid rgba(16,185,129,0.1)' }}
							>
								<ArrowUp size={9} weight='bold' className='text-white' aria-hidden='true' />
								<span className='text-[12px] font-semibold leading-none text-white'>2</span>
							</span>
						</div>
					</div>
					<p className='text-center text-[10px] font-medium leading-tight' style={{ color: 'rgba(0,0,0,0.4)' }}>
						Week 8
					</p>
				</div>
			</div>
		</div>
	)
}

/* ─── 2. Pitch score card ─── */

function PitchScoreCard(): ReactElement {
	return (
		<div
			className='w-[271px] overflow-hidden rounded-2xl'
			style={{ background: CARD_BG, border: '1px solid #E5DDD4', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
		>
			{/* Header: Pitch + B+ pill + caret */}
			<div className='flex items-center justify-between px-5 py-2'>
				<p className='text-[14px] font-bold leading-5 text-[#1A1A1A]' style={{ fontFamily: 'var(--font-heading)' }}>
					Pitch
				</p>
				<div className='flex items-center gap-3'>
					<div
						className='flex items-start rounded-lg px-2 py-1'
						style={{ background: 'rgba(5,150,105,0.1)' }}
					>
						<span
							className='text-[20px] font-bold leading-4'
							style={{ fontFamily: 'var(--font-heading)', color: EMERALD_AA }}
						>
							B+
						</span>
					</div>
					<CaretDown size={12} weight='regular' style={{ color: '#64748B' }} aria-hidden='true' />
				</div>
			</div>

			{/* Body: progress bars */}
			<div className='flex flex-col gap-3 border-t border-[#E5DDD4] px-5 py-4'>
				<div className='flex flex-col gap-1.5'>
					<div className='flex items-center justify-between'>
						<span className='text-[10px] leading-4 text-[#475569]'>You</span>
						<span
							className='text-[10px] font-semibold leading-[15px] text-[#1A1A1A]'
							style={{ fontFamily: 'var(--font-mono)' }}
						>
							72%
						</span>
					</div>
					<div className='h-1.5 w-full overflow-hidden rounded-full bg-[#F5F0EB]'>
						<div className='h-full rounded-full' style={{ width: '72%', background: EMERALD_AA }} />
					</div>
				</div>
				<div className='flex flex-col gap-1.5'>
					<div className='flex items-center justify-between'>
						<span className='text-[10px] leading-4 text-[#475569]'>Top 10%</span>
						<span
							className='text-[10px] font-semibold leading-[15px] text-[#1A1A1A]'
							style={{ fontFamily: 'var(--font-mono)' }}
						>
							89%
						</span>
					</div>
					<div className='h-1.5 w-full overflow-hidden rounded-full bg-[#F5F0EB]'>
						<div className='h-full rounded-full' style={{ width: '89%', background: 'rgba(16,185,129,0.4)' }} />
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── 3. Close Rate ↑10% pill ─── */

function CloseRatePill(): ReactElement {
	return (
		<div
			className='inline-flex items-center gap-8 rounded-2xl px-[13px] py-[13px]'
			style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
		>
			<span
				className='text-[20px] font-medium leading-none whitespace-nowrap'
				style={{ fontFamily: 'var(--font-heading)', color: 'rgba(0,0,0,0.7)' }}
			>
				Close Rate
			</span>
			<span className='inline-flex items-center gap-0.5'>
				<ArrowUp size={20} weight='bold' style={{ color: EMERALD_AA }} aria-hidden='true' />
				<span
					className='text-[24px] font-bold leading-none whitespace-nowrap'
					style={{ fontFamily: 'var(--font-heading)', color: EMERALD_AA }}
				>
					10%
				</span>
			</span>
		</div>
	)
}

/* ─── 4. "We have a deal" quote pill ─── */

function DealQuotePill(): ReactElement {
	return (
		<div
			className='inline-flex h-[46px] items-center justify-center rounded-2xl px-[13px]'
			style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
		>
			<span
				className='text-[20px] font-medium italic leading-none whitespace-nowrap'
				style={{ fontFamily: 'var(--font-heading)', color: 'rgba(0,0,0,0.7)' }}
			>
				&ldquo;We have a deal&rdquo;
			</span>
		</div>
	)
}

/* ─── 5. 7-Dimensions Scored radar ─── */

const RADAR_AXES = [
	'Discovery',
	'Pitch',
	'Objection\nHandling',
	'Closing',
	'Tonality',
	'Pace',
	'Clarity',
] as const

const RADAR_SCORES = [0.78, 0.85, 0.7, 0.92, 0.6, 0.72, 0.82] as const

function SevenDimensionsRadar(): ReactElement {
	const size = 220
	const cx = size / 2
	const cy = size / 2 + 8 // shift down slightly so axis labels sit in margin
	const radius = 70

	const axisPoint = (i: number, scale: number) => {
		const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2
		return {
			x: cx + Math.cos(angle) * radius * scale,
			y: cy + Math.sin(angle) * radius * scale,
		}
	}

	const labelPoint = (i: number) => {
		const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2
		return {
			x: cx + Math.cos(angle) * (radius + 18),
			y: cy + Math.sin(angle) * (radius + 18),
		}
	}

	const scoredPath = RADAR_SCORES
		.map((s, i) => {
			const p = axisPoint(i, s)
			return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
		})
		.join(' ') + ' Z'

	const ringPaths = [0.33, 0.66, 1].map((scale) =>
		Array.from({ length: 7 }, (_, i) => axisPoint(i, scale))
			.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
			.join(' ') + ' Z'
	)

	return (
		<div
			className='flex flex-col items-center gap-4 rounded-2xl p-[13px]'
			style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
		>
			<p
				className='text-[20px] font-medium leading-tight'
				style={{ fontFamily: 'var(--font-heading)', color: 'rgba(0,0,0,0.7)' }}
			>
				7-Dimensions Scored
			</p>
			<svg width={size} height={size + 16} viewBox={`0 0 ${size} ${size + 16}`} aria-hidden='true'>
				{/* Concentric heptagon rings */}
				{ringPaths.map((d, i) => (
					<path
						key={i}
						d={d}
						fill='none'
						stroke='rgba(13,15,20,0.12)'
						strokeWidth={1}
					/>
				))}
				{/* Axis spokes */}
				{Array.from({ length: 7 }, (_, i) => {
					const p = axisPoint(i, 1)
					return (
						<line
							key={i}
							x1={cx}
							y1={cy}
							x2={p.x}
							y2={p.y}
							stroke='rgba(13,15,20,0.08)'
							strokeWidth={1}
						/>
					)
				})}
				{/* Scored polygon (filled emerald) */}
				<path
					d={scoredPath}
					fill='rgba(16,185,129,0.25)'
					stroke={EMERALD_AA}
					strokeWidth={1.5}
					strokeLinejoin='round'
				/>
				{/* Score points */}
				{RADAR_SCORES.map((s, i) => {
					const p = axisPoint(i, s)
					return (
						<circle
							key={i}
							cx={p.x}
							cy={p.y}
							r={3}
							fill={EMERALD_AA}
						/>
					)
				})}
				{/* Axis labels */}
				{RADAR_AXES.map((axis, i) => {
					const p = labelPoint(i)
					return (
						<text
							key={axis}
							x={p.x}
							y={p.y}
							fontSize={8}
							fontWeight={500}
							textAnchor='middle'
							dominantBaseline='middle'
							fill='#7A6E60'
							style={{ fontFamily: 'var(--font-sans)' }}
						>
							{axis.split('\n').map((line, j) => (
								<tspan key={j} x={p.x} dy={j === 0 ? 0 : 9}>
									{line}
								</tspan>
							))}
						</text>
					)
				})}
			</svg>
		</div>
	)
}

/* ─── 6. Coached vs Uncoached area chart ─── */

function CoachedVsUncoachedChart(): ReactElement {
	return (
		<div
			className='flex w-[240px] flex-col gap-4 rounded-2xl p-[13px]'
			style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
		>
			{/* Legend */}
			<div className='flex items-center justify-center gap-6'>
				<div className='flex items-center gap-2'>
					<span className='inline-block h-2.5 w-2.5 rounded-full' style={{ background: EMERALD_AA }} />
					<span className='text-[14px] leading-5 text-[#475569]'>Coached</span>
				</div>
				<div className='flex items-center gap-2'>
					<span className='inline-block h-2.5 w-2.5 rounded-full bg-[#94A3B8]' />
					<span className='text-[14px] leading-5 text-[#475569]'>Uncoached</span>
				</div>
			</div>

			{/* Chart SVG */}
			<div className='relative w-full'>
				<svg viewBox='0 0 214 72' className='w-full' aria-hidden='true'>
					<defs>
						<linearGradient id='cvu-coached' x1='0' x2='0' y1='0' y2='1'>
							<stop offset='0%' stopColor='rgba(16,185,129,0.4)' />
							<stop offset='100%' stopColor='rgba(16,185,129,0)' />
						</linearGradient>
						<linearGradient id='cvu-uncoached' x1='0' x2='0' y1='0' y2='1'>
							<stop offset='0%' stopColor='rgba(148,163,184,0.3)' />
							<stop offset='100%' stopColor='rgba(148,163,184,0)' />
						</linearGradient>
					</defs>
					{/* Uncoached area (flat-ish, low) */}
					<path
						d='M 0 60 L 30 58 L 60 56 L 90 55 L 120 53 L 150 52 L 180 50 L 214 48 L 214 72 L 0 72 Z'
						fill='url(#cvu-uncoached)'
					/>
					<path
						d='M 0 60 L 30 58 L 60 56 L 90 55 L 120 53 L 150 52 L 180 50 L 214 48'
						fill='none'
						stroke='#94A3B8'
						strokeWidth={1.5}
						strokeLinejoin='round'
					/>
					{/* Coached area (rises sharply) */}
					<path
						d='M 0 58 L 30 54 L 60 48 L 90 38 L 120 28 L 150 20 L 180 14 L 214 10 L 214 72 L 0 72 Z'
						fill='url(#cvu-coached)'
					/>
					<path
						d='M 0 58 L 30 54 L 60 48 L 90 38 L 120 28 L 150 20 L 180 14 L 214 10'
						fill='none'
						stroke={EMERALD_AA}
						strokeWidth={1.5}
						strokeLinejoin='round'
					/>
				</svg>
				{/* 2x badge */}
				<span
					className='absolute right-1 top-0 text-[20px] font-bold leading-5 text-black'
					style={{ fontFamily: 'var(--font-heading)' }}
				>
					2x
				</span>
			</div>
		</div>
	)
}

/* ─── Headline ─── */

function ResultsHeadline(): ReactElement {
	return (
		<motion.h2
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
			className='text-trim text-balance text-center text-cc-text-primary-warm'
			style={{
				fontFamily: 'var(--font-heading)',
				fontWeight: 700,
				fontSize: 'clamp(2.25rem, 8vw, 6.5rem)',
				lineHeight: 0.95,
				letterSpacing: '-0.015em',
			}}
		>
			Every call, scored.
			<br />
			Every rep, <em className='italic font-bold' style={{ color: EMERALD_AA }}>improving</em>.
		</motion.h2>
	)
}

function ResultsEyebrow(): ReactElement {
	return (
		<motion.p
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
			className='text-center font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary-warm md:text-xs'
		>
			Real numbers. Real closers.
		</motion.p>
	)
}

/* ─── Composition ─── */

export default function FloatingProofComposition(): ReactElement {
	return (
		<div className='relative mx-auto w-full max-w-[1232px] px-6 lg:px-0'>
			{/* Mobile / tablet (<lg): eyebrow + headline + stacked cards in a grid. */}
			<div className='flex flex-col gap-8 lg:hidden'>
				<div className='flex flex-col items-center gap-5'>
					<ResultsEyebrow />
					<ResultsHeadline />
				</div>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<Float delay={0}>
						<div className='flex justify-center'>
							<CamilReeseProfileCard />
						</div>
					</Float>
					<Float delay={0.08}>
						<div className='flex justify-center'>
							<PitchScoreCard />
						</div>
					</Float>
				</div>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<Float delay={0.16}>
						<div className='flex justify-center'>
							<CloseRatePill />
						</div>
					</Float>
					<Float delay={0.2}>
						<div className='flex justify-center'>
							<DealQuotePill />
						</div>
					</Float>
				</div>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
					<Float delay={0.24}>
						<div className='flex justify-center'>
							<SevenDimensionsRadar />
						</div>
					</Float>
					<Float delay={0.32}>
						<div className='flex justify-center'>
							<CoachedVsUncoachedChart />
						</div>
					</Float>
				</div>
			</div>

			{/* Desktop floating layout (lg+). Container is positioned BEHIND the
			 * SectionResults heading, with cards absolutely placed per Figma
			 * 81:4377 frame coordinates. The headline above is not nested inside
			 * this wrapper — it stays in SectionResults' main flow so semantic
			 * heading order is preserved.
			 *
			 * Coordinate map (Figma frame 1232 × ~600):
			 *   - Camil Reese:   left 160,  top 21,  w 240
			 *   - Pitch:         left 750,  top 73,  w 271
			 *   - Close Rate:    left  -7,  top 396
			 *   - "We have a deal": left 91, top 454
			 *   - 7-Dimensions:  left 486,  top 442
			 *   - Coached chart: left 921,  top 437, w 240
			 *
			 * Heading sits in the visual gap between the top row (Camil + Pitch)
			 * and the bottom row (chips + radar + chart). Z-index pattern: cards
			 * z-0, headline z-10. */}
			{/* Desktop floating layout (lg+). Container is `relative h-[760px]`
			 * with eyebrow + headline absolutely centered in the middle band
			 * and the 6 floating cards positioned around them per Figma frame
			 * coordinates. Heading sits between top row (Camil + Pitch) and
			 * bottom row (chips + radar + chart). Z-index pattern: cards z-0,
			 * heading z-10. */}
			<div className='relative hidden h-[760px] lg:block'>
				{/* Eyebrow + headline in middle band */}
				<div className='absolute left-1/2 top-[200px] z-10 flex w-[860px] -translate-x-1/2 flex-col items-center gap-5'>
					<ResultsEyebrow />
					<ResultsHeadline />
				</div>

				{/* Top row: Camil Reese + Pitch */}
				<Float delay={0} className='absolute' style={{ left: '13%', top: '21px' }}>
					<CamilReeseProfileCard />
				</Float>
				<Float delay={0.08} className='absolute' style={{ left: '60.9%', top: '73px' }}>
					<PitchScoreCard />
				</Float>

				{/* Bottom row: chips + radar + chart */}
				<Float delay={0.16} className='absolute' style={{ left: '0%', top: '500px' }}>
					<CloseRatePill />
				</Float>
				<Float delay={0.2} className='absolute' style={{ left: '8%', top: '584px' }}>
					<DealQuotePill />
				</Float>
				<Float delay={0.24} className='absolute' style={{ left: '39%', top: '470px' }}>
					<SevenDimensionsRadar />
				</Float>
				<Float delay={0.32} className='absolute' style={{ left: '74.7%', top: '540px' }}>
					<CoachedVsUncoachedChart />
				</Float>
			</div>
		</div>
	)
}
