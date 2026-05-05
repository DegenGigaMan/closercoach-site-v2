/** @fileoverview S5 Results — Floating Proof Composition per Figma 81:4377
 * (recomposed master, Wave Q 2026-04-27; Wave Q.2 mobile pattern 2026-04-27).
 *
 * 7 designed proof components orbit the centered "Every call, scored. Every
 * no, is now a yes." billboard on a warm surface (AL-017 copy swap, Alim
 * 2026-05-01 AM Slack — italic emphasis moves from "improving" to the
 * closer's transformation moment):
 *
 *   1. Camil Reese profile card (top-left, w 240) — Recent Performance bars
 *      (Week 1 amber C, Week 8 emerald A with +2 trust badge), real headshot
 *      from /images/prospects/camil-reese.png
 *   2. Performance Gains stats (top-center) — 7% Close Rate / 50% Faster Ramp
 *      / 30% More Deals
 *   3. C+ → A grade-up badge card (top-right) — +2 grades indicator
 *   4. 16+ Industries pill (right mid)
 *   5. 20,000+ closers + 3,000+ calls/day stack (left mid)
 *   6. 7-Dimensions Scored radar (center bottom) — Discovery / Pitch /
 *      Objection Handling / Closing / Tonality / Pace / Clarity heptagon
 *   7. Coached vs Uncoached area chart (bottom-right) — 2x outcome delta
 *
 * Desktop (lg+): floating layout with absolute positioning matching the
 * Figma 81:4377 frame coordinates. Container max-w-[1232px] mx-auto with
 * generous height to fit headline + 7 floating cards.
 *
 * Mobile (<lg): Reflex AI floating-on-mobile pattern. Only 2 cards reveal —
 * Camil Reese profile above the headline and Coached vs Uncoached chart
 * below. Cards retain their native 240px width, slight horizontal offsets
 * preserve the "floating, not gridded" feel. The other 5 cards stay defined
 * as components (still invoked on desktop) but are not rendered on mobile.
 *
 * Color discipline: card surface #F2EDE5 (raw hex per Figma — no new token).
 * Wave R FIX-03 (2026-04-27): every TEXT color use of emerald flips to
 * #059669 (cc-accent-hover) for WCAG AA on the warm #F2EDE5 surface (raw
 * #10B981 measures ~2.0:1, fails 3:1 even at large-text). Raw #10B981
 * stays on DECORATIVE SVG fills only — radar polygon, chart strokes/fills,
 * grade-ring arcs, legend dots, badge backgrounds. */

'use client'

import { useRef, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { ArrowRight, ArrowUp } from '@phosphor-icons/react'

const EMERALD_RAW = '#10B981'    // Figma master raw emerald (large-text/decorative)
const EMERALD_AA = '#059669'     // cc-accent-hover (small body text on warm)
const AMBER_RAW = '#F59E0B'      // Figma master raw amber (display type only)
const SLATE_LABEL = '#475569'    // Body labels in legend
const SANDSTONE = '#7A6E60'      // Radar axis labels
const CARD_BG = '#F2EDE5'        // Figma master card surface
const CARD_BORDER = 'rgba(0,0,0,0.05)'
const CARD_SHADOW = '0px 0px 20px 0px rgba(16,185,129,0.05)'

const CAMIL_AVATAR = '/images/prospects/camil-reese.png'

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
	const inView = useInView(ref, { once: true, margin: '0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			style={style}
			initial={{ opacity: 0, y: 16 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
			/* Phase 8 (2026-05-01): cut 0.72 -> 0.5 + tightened margin so the
			 * floating proof cards reveal as the section enters viewport, not
			 * after the user scrolls past. */
			transition={reduced ? { duration: 0 } : { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{children}
		</motion.div>
	)
}

/* ─── Shared card shell ─── */

const CARD_STYLE: React.CSSProperties = {
	background: CARD_BG,
	border: `1px solid ${CARD_BORDER}`,
	boxShadow: CARD_SHADOW,
}

/* ─── 1. Camil Reese profile card (Figma 81:4380) ─── */

function CamilReeseProfileCard(): ReactElement {
	return (
		<div
			className='flex w-[240px] flex-col gap-4 overflow-clip rounded-[16px] p-[13px]'
			style={CARD_STYLE}
		>
			{/* Header: avatar + name + role */}
			<div className='flex w-full items-center gap-3'>
				<div
					className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full'
					style={{ border: '1px solid rgba(255,255,255,0.15)' }}
				>
					<Image
						src={CAMIL_AVATAR}
						alt='Camil Reese'
						fill
						sizes='32px'
						className='object-cover'
						unoptimized
					/>
				</div>
				<div className='flex min-w-0 flex-1 flex-col items-start justify-center gap-2'>
					<p
						className='text-trim whitespace-nowrap text-[12px] font-semibold leading-none'
						style={{ color: 'rgba(0,0,0,0.7)' }}
					>
						Camil Reese
					</p>
					<p
						className='text-trim whitespace-nowrap text-[10px] leading-none'
						style={{ color: 'rgba(0,0,0,0.5)' }}
					>
						Sales rep
					</p>
				</div>
			</div>

			{/* Recent Performance label */}
			<div className='flex w-full flex-col gap-2'>
				<p className='text-trim text-[10px] font-medium leading-[1.4] text-black'>
					Recent Performance
				</p>

				{/* Two bars: Week 1 (amber C, h-47) + Week 8 (emerald A, h-86 with +2 badge) */}
				<div className='flex w-full items-end justify-center gap-4'>
					<div className='flex flex-1 flex-col items-center gap-2'>
						<div
							className='flex h-[47px] w-full items-start rounded-tl-[12px] rounded-tr-[12px] px-[9px] py-[13px]'
							style={{
								background: 'rgba(245,158,11,0.1)',
								border: '1px solid rgba(245,158,11,0.1)',
							}}
						>
							<span
								className='text-trim text-[24px] font-bold leading-[36px]'
								style={{ fontFamily: 'var(--font-heading)', color: AMBER_RAW }}
							>
								C
							</span>
						</div>
						<p
							className='text-trim w-full text-center text-[10px] font-medium leading-[1.4]'
							style={{ color: 'rgba(0,0,0,0.4)' }}
						>
							Week 1
						</p>
					</div>
					<div className='flex flex-1 flex-col items-center gap-2'>
						<div
							className='flex h-[86px] w-full items-start rounded-tl-[12px] rounded-tr-[12px] px-[9px] py-[13px]'
							style={{
								background: 'rgba(16,185,129,0.1)',
								border: '1px solid rgba(16,185,129,0.1)',
							}}
						>
							<div className='flex items-center gap-1'>
								<span
									className='text-trim text-[24px] font-bold leading-[36px]'
									style={{ fontFamily: 'var(--font-heading)', color: EMERALD_AA }}
								>
									A
								</span>
								<span
									className='inline-flex items-center gap-[2px] rounded-[4px] p-[3px]'
									style={{ background: EMERALD_RAW, border: '1px solid rgba(16,185,129,0.1)' }}
								>
									<ArrowUp size={9} weight='bold' style={{ color: '#DBE8DB' }} aria-hidden='true' />
									<span
										className='text-[12px] font-semibold leading-none'
										style={{ color: '#DBE8DB' }}
									>
										2
									</span>
								</span>
							</div>
						</div>
						<p
							className='text-trim w-full text-center text-[10px] font-medium leading-[1.4]'
							style={{ color: 'rgba(0,0,0,0.4)' }}
						>
							Week 8
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── 2. Performance Gains stats (3-stat strip) ─── */

function PerformanceGainsCard(): ReactElement {
	const stats = [
		{ value: '7%', label: 'Close rate' },
		{ value: '50%', label: 'Faster ramp' },
		{ value: '30%', label: 'More deals' },
	] as const
	return (
		<div
			className='flex flex-col items-center gap-4 overflow-clip rounded-[16px] p-[13px]'
			style={CARD_STYLE}
		>
			<p
				className='text-trim whitespace-nowrap text-[12px] font-semibold uppercase leading-none'
				style={{
					fontFamily: 'var(--font-mono)',
					color: SLATE_LABEL,
					letterSpacing: '0.72px',
				}}
			>
				Performance gains
			</p>
			<div className='flex w-[278px] items-center gap-4'>
				{stats.map((s) => (
					<div key={s.label} className='flex flex-1 flex-col items-center justify-center gap-3'>
						<p
							className='text-trim whitespace-nowrap text-[28px] font-bold leading-none'
							style={{ fontFamily: 'var(--font-heading)', color: EMERALD_AA }}
						>
							{s.value}
						</p>
						<p
							className='text-trim whitespace-nowrap text-[10px] font-medium uppercase leading-none'
							style={{
								fontFamily: 'var(--font-mono)',
								color: 'rgba(0,0,0,0.5)',
								letterSpacing: '1px',
							}}
						>
							{s.label}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

/* ─── 3. Grade-up badge: C+ → A (+2 grades) ─── */

function GradeUpCard(): ReactElement {
	return (
		<div
			className='flex flex-col items-center justify-center rounded-[16px] px-[14px] py-[12px]'
			style={{
				background: '#F5F0EB',
				border: '1px solid #E5DDD4',
			}}
		>
			<div className='flex items-center gap-2'>
				{/* C+ ring */}
				<div className='relative flex h-[64px] w-[64px] items-center justify-center'>
					<svg
						className='absolute inset-0'
						viewBox='0 0 64 64'
						aria-hidden='true'
					>
						<circle
							cx='32'
							cy='32'
							r='28'
							fill='none'
							stroke='rgba(245,158,11,0.2)'
							strokeWidth='3'
						/>
						<circle
							cx='32'
							cy='32'
							r='28'
							fill='none'
							stroke={AMBER_RAW}
							strokeWidth='3'
							strokeLinecap='round'
							strokeDasharray={`${2 * Math.PI * 28 * 0.5} ${2 * Math.PI * 28}`}
							transform='rotate(-90 32 32)'
						/>
					</svg>
					<span
						className='relative text-[28px] font-semibold leading-[40px]'
						style={{ fontFamily: 'var(--font-heading)', color: AMBER_RAW }}
					>
						C+
					</span>
				</div>

				{/* Arrow + +2 grades pill */}
				<div className='flex flex-col items-center gap-1'>
					<ArrowRight size={20} weight='regular' style={{ color: SANDSTONE }} aria-hidden='true' />
					<span
						className='inline-flex items-start rounded-full px-[6px] py-[4px]'
						style={{ background: 'rgba(16,185,129,0.1)' }}
					>
						<span
							className='text-trim whitespace-nowrap text-[8px] font-semibold leading-none'
							style={{ color: EMERALD_AA }}
						>
							+2 grades
						</span>
					</span>
				</div>

				{/* A ring */}
				<div className='relative flex h-[64px] w-[64px] items-center justify-center'>
					<svg
						className='absolute inset-0'
						viewBox='0 0 64 64'
						aria-hidden='true'
					>
						<circle
							cx='32'
							cy='32'
							r='28'
							fill='none'
							stroke='rgba(16,185,129,0.2)'
							strokeWidth='3'
						/>
						<circle
							cx='32'
							cy='32'
							r='28'
							fill='none'
							stroke={EMERALD_RAW}
							strokeWidth='3'
							strokeLinecap='round'
							strokeDasharray={`${2 * Math.PI * 28 * 0.95} ${2 * Math.PI * 28}`}
							transform='rotate(-90 32 32)'
						/>
					</svg>
					<span
						className='relative text-[28px] font-semibold leading-[40px]'
						style={{ fontFamily: 'var(--font-heading)', color: EMERALD_AA }}
					>
						A
					</span>
				</div>
			</div>
		</div>
	)
}

/* ─── 4. 16+ Industries pill ─── */

function IndustriesPill(): ReactElement {
	return (
		<div
			className='flex flex-col items-center gap-3 overflow-clip rounded-[16px] p-[13px]'
			style={CARD_STYLE}
		>
			<p
				className='text-trim whitespace-nowrap text-[28px] font-bold leading-none'
				style={{ fontFamily: 'var(--font-heading)', color: 'rgba(0,0,0,0.7)' }}
			>
				16+
			</p>
			<p
				className='text-trim whitespace-nowrap text-[10px] font-medium uppercase leading-none'
				style={{
					fontFamily: 'var(--font-mono)',
					color: 'rgba(0,0,0,0.5)',
					letterSpacing: '1px',
				}}
			>
				Industries
			</p>
		</div>
	)
}

/* ─── 5a. Single stat card (used for 20,000+ + 3,000+ stack) ─── */

type StatCardProps = {
	value: string
	label: string
	width?: number
}

function StatCard({ value, label, width = 200 }: StatCardProps): ReactElement {
	return (
		<div
			className='flex flex-col items-start gap-4 overflow-clip rounded-[16px] p-[17px]'
			style={{ ...CARD_STYLE, width }}
		>
			<p
				className='text-trim whitespace-nowrap text-[28px] font-bold leading-none'
				style={{ fontFamily: 'var(--font-heading)', color: 'rgba(0,0,0,0.7)' }}
			>
				{value}
			</p>
			<p
				className='text-trim whitespace-nowrap text-[12px] font-medium uppercase leading-none'
				style={{
					fontFamily: 'var(--font-mono)',
					color: 'rgba(0,0,0,0.5)',
					letterSpacing: '1.2px',
				}}
			>
				{label}
			</p>
		</div>
	)
}

/* ─── 6. 7-Dimensions Scored radar (Figma 81:4428) ─── */

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
	const cy = size / 2 + 6
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
			className='flex flex-col items-center gap-4 overflow-clip rounded-[16px] p-[13px]'
			style={CARD_STYLE}
		>
			<p
				className='text-trim text-[20px] font-medium leading-[1.4] opacity-70'
				style={{ fontFamily: 'var(--font-heading)', color: 'black' }}
			>
				7-Dimensions Scored
			</p>
			<svg
				width={size}
				height={size + 16}
				viewBox={`0 0 ${size} ${size + 16}`}
				aria-hidden='true'
			>
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
					stroke={EMERALD_RAW}
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
							fill={EMERALD_RAW}
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
							fill={SANDSTONE}
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

/* ─── 7. Coached vs Uncoached area chart ─── */

function CoachedVsUncoachedChart(): ReactElement {
	return (
		<div
			className='flex w-[240px] flex-col gap-4 overflow-clip rounded-[16px] p-[13px]'
			style={CARD_STYLE}
		>
			{/* Legend */}
			<div className='flex w-full items-center justify-center gap-4'>
				<div className='flex items-center gap-2 whitespace-nowrap'>
					<span
						className='shrink-0 rounded-full'
						style={{ width: 10, height: 10, background: EMERALD_RAW }}
					/>
					<span
						className='text-[13px] leading-[20px]'
						style={{ color: SLATE_LABEL }}
					>
						Coached
					</span>
				</div>
				<div className='flex items-center gap-2 whitespace-nowrap'>
					<span
						className='shrink-0 rounded-full'
						style={{ width: 10, height: 10, background: '#94A3B8' }}
					/>
					<span
						className='text-[13px] leading-[20px]'
						style={{ color: SLATE_LABEL }}
					>
						Uncoached
					</span>
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
						stroke={EMERALD_RAW}
						strokeWidth={1.5}
						strokeLinejoin='round'
					/>
				</svg>
				{/* 2x badge — decorative annotation, aria-hidden so screen
				 * readers don't say "two ex". The chart's labeled axis +
				 * Coached/Uncoached legend already convey the meaning. */}
				<span
					aria-hidden='true'
					className='absolute -top-3 right-2 text-[28px] font-bold leading-none text-black'
					style={{ fontFamily: 'var(--font-heading)' }}
				>
					2x
				</span>
			</div>
		</div>
	)
}

/* ─── Headline (per Figma 81:4377 master, text-[80px] Lora Bold, leading 0.9) ─── */

function ResultsHeadline(): ReactElement {
	return (
		<motion.h2
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '0px' }}
			transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const }}
			className='text-trim text-balance text-center text-cc-text-primary-warm'
			style={{
				fontFamily: 'var(--font-heading)',
				fontWeight: 700,
				fontSize: 'clamp(2.25rem, 7.2vw, 5rem)',
				lineHeight: 0.9,
				letterSpacing: '-0.015em',
			}}
		>
			Every call, Scored.
			<br />
			Every no,{' '}
			<em
				className='italic font-bold'
				style={{ color: EMERALD_AA, fontFamily: 'var(--font-heading)' }}
			>
				is now a yes
			</em>
			.
		</motion.h2>
	)
}

/* ─── Composition ─── */

export default function FloatingProofComposition(): ReactElement {
	return (
		<div className='relative mx-auto w-full max-w-[1232px] px-6 md:px-0'>
			{/* Mobile (<md, <768): Reflex AI floating-on-mobile pattern.
			 * Only Camil profile (above) and Coached vs Uncoached chart (below)
			 * reveal. Headline stays the dominant centerpiece. Subtle horizontal
			 * offsets preserve the floating feel. Wave R FIX-05 (2026-04-27):
			 * trigger flipped from `lg:` to `md:` so tablets (768-1023) get the
			 * full 7-card composition. */}
			<div className='flex flex-col items-center gap-6 md:hidden'>
				<Float delay={0} className='self-center -translate-x-3'>
					<CamilReeseProfileCard />
				</Float>
				<ResultsHeadline />
				<Float delay={0.12} className='self-center translate-x-3'>
					<CoachedVsUncoachedChart />
				</Float>
			</div>

			{/* Tablet + desktop floating layout (md+, 768+). Wave R FIX-05
			 * (2026-04-27): the absolute-positioned coordinate map is preserved
			 * at its native 1232px frame width and compressed via CSS scale on
			 * narrower tablets so cards never overflow or collide. lg+ (1024+)
			 * snaps back to native scale.
			 *
			 * Coordinate map per Figma 81:4377 master (frame ~1024×570). Mapped
			 * to a 1232-wide container with proportional left percentages and
			 * absolute top offsets. Headline is the gravity center (z-10), cards
			 * float around (z-0).
			 *
			 *   - Camil Reese:        left  9%,  top   0px (top-left)
			 *   - Performance Gains:  left 50%,  top 130px (translate-x-1/2 center)
			 *   - Grade-up (C+ → A):  right 5%,  top  20px (top-right)
			 *   - 16+ Industries:     right 0,   top 240px (mid-right)
			 *   - 20k stack:          left -1%,  top 320px (mid-left, two cards)
			 *   - 7-Dimensions Radar: left 50%,  top 460px (translate-x-1/2 center)
			 *   - Coached chart:      right 0,   top 440px (bottom-right)
			 */}
			<div className='hidden md:block'>
				{/* Outer height tracks the scaled-down box so the section
				 * preserves its vertical rhythm. 760 × 0.58 ≈ 441, × 0.82 ≈ 624.
				 * Wave R FIX-05: scale chosen so the 1232 frame's edge-aligned
				 * cards (left:-1%, right:0%) clear the md viewport (768) without
				 * clipping.
				 *
				 * Wave R.2 FIX-01 (2026-04-27): outer-card positions tightened at
				 * md so every card sits ≥24px from viewport edges. At md scale
				 * 0.58 with translate-x(-50%) centering, edge-percentage offsets
				 * inside the 1232 frame project to actual viewport gutters that
				 * are too close to the edge. Per-card md overrides (Tailwind
				 * arbitrary-value left-/right- prefixes) pull outer cards inward;
				 * lg+ snaps back to the original Figma values. */}
				<div className='relative h-[460px] overflow-visible lg:h-[640px] xl:h-[760px]'>
					<div
						className='absolute left-1/2 top-0 h-[760px] w-[1232px] origin-top -translate-x-1/2 scale-[0.58] lg:scale-[0.82] xl:scale-100'
					>
						{/* Headline gravity center */}
						<div className='absolute left-1/2 top-[230px] z-10 flex w-[860px] -translate-x-1/2 flex-col items-center'>
							<ResultsHeadline />
						</div>

						{/* Top row */}
						<Float delay={0} className='absolute left-[12%] top-0 lg:left-[8%]'>
							<CamilReeseProfileCard />
						</Float>
						<Float
							delay={0.06}
							className='absolute left-1/2 top-[110px] -translate-x-1/2'
						>
							<PerformanceGainsCard />
						</Float>
						<Float delay={0.12} className='absolute right-[8%] top-[20px] lg:right-[5%]'>
							<GradeUpCard />
						</Float>

						{/* Mid row */}
						<Float delay={0.18} className='absolute right-[3%] top-[230px] lg:right-0'>
							<IndustriesPill />
						</Float>
						<Float delay={0.22} className='absolute left-[3%] top-[320px] lg:left-[-1%]'>
							<div className='flex flex-col items-start gap-4'>
								<StatCard value='20,000+' label='Sales closers' />
								<div className='pl-12'>
									<StatCard value='3,000+' label='Calls / day' />
								</div>
							</div>
						</Float>

						{/* Bottom row */}
						<Float
							delay={0.3}
							className='absolute left-1/2 top-[430px] -translate-x-1/2'
						>
							<SevenDimensionsRadar />
						</Float>
						{/* H-24 (2026-05-04): right-0 at lg+ collided visually with
						 * IndustriesPill (also right-0). Bumped to lg:right-[5%] so
						 * the card sits within the GradeUp/IndustriesPill spacing
						 * convention and stops feeling crammed against the edge. */}
						<Float delay={0.36} className='absolute right-[3%] top-[420px] lg:right-[5%]'>
							<CoachedVsUncoachedChart />
						</Float>
					</div>
				</div>
			</div>
		</div>
	)
}
