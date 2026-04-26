/** @fileoverview Founder Credibility Strip (W5). NEW section between S5 Results
 * and whatever follows. Dark surface (contrast break after warm S5). Answers the
 * enterprise-buyer question "who's behind this?" with F1-F7 founder credentials
 * and G1/G2/G3 growth trajectory.
 *
 * Composition per section-blueprint v2 Founder Credibility Strip:
 *   1. Geist Mono overline: "Built by founders who've done this before."
 *   2. Billboard-adjacent headline (display-lg scale, smaller than S4/S5 billboards):
 *      "Built to last. Built by operators." Lora Bold, "operators" italicized for
 *      rhythm with S4/S5 per VIS S2 weight+italic lock.
 *   3. Stat pills row (3 horizontal pills, centered):
 *        - F2: $1.5B Founder Exit
 *        - G1: $400K ARR in 16 Weeks
 *        - F3: 2M+ Users at Last Company
 *      Thin emerald-muted border, dark card bg, emerald-tinted glow.
 *   4. Growth trajectory chart (CQ-1 style glow line SVG):
 *        - G3 Jul 2025 -> $12K ARR
 *        - G2 Mar 2026 -> $350K ARR
 *        - G1 16 wks post-launch -> $400K ARR
 *      Hand-authored SVG hockey-stick curve. Emerald stroke + area fill + glow.
 *      Three labeled dots. Motion scroll-reveal is the only animation for W5 -- full
 *      pathLength draw-on deferred to polish pass.
 *   5. Two founder bio cards (2-col desktop, stack mobile):
 *        - Alim Charaniya (CEO): F1, F2, F3, F5 credentials + AC duotone placeholder
 *        - Taylor Martinez (COO): F7, F4, GTM lead credentials + TM duotone placeholder
 *
 * Surface transition: 80-100px gradient at the top edge from warm (#F5F0EB) into
 * cc-foundation (#0D0F14) to avoid a hard line after S5.
 *
 * Headshot placeholders: /public/images/founders/alim.svg + taylor.svg. Circular
 * frame, emerald ring, duotone gradient bg, initials "AC"/"TM" centered. Marked as
 * placeholder -- swap when real professional photos land (P0 per proof-inventory).
 *
 * WCAG AA on dark:
 *   - White (#F8FAFC) on #0D0F14 = 19.2:1 (headlines, primary text)
 *   - Text-secondary (#94A3B8) on #0D0F14 = 7.8:1 (body + muted labels)
 *   - Emerald #10B981 on #0D0F14 = 6.9:1 (stat numbers, links)
 *   - Emerald-muted (#10B981 40% alpha) is decorative only (borders/glow)
 *
 * Hydration safety: all initial props are stable. No client-branched state in
 * initial. Reduced-motion via useReducedMotion collapses transitions to 0s.
 *
 * Zero fabricated facts: F1 (PrizePicks #19), F2 ($1.5B exit), F3 (Ambitious Labs
 * 2M+ RapidDev acquisition), F4 ($250K/mo 4x ROAS), F5 (3x founder), F7 (Wharton),
 * G1 ($400K ARR 16wks), G2 ($350K Mar 2026), G3 ($12K Jul 2025) -- all V3P or V1P
 * verified per proof-inventory. No unverified founder claims. */

'use client'

import { useRef, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'

const EMERALD = '#10B981'
const EMERALD_BORDER = 'rgba(16,185,129,0.28)'

/* ── Shared reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactElement | ReactElement[]
	className?: string
	delay?: number
}

/**
 * @description Local scroll-reveal wrapper. Stable initial props so server and
 * client first-render match. Reduced motion collapses the transition to 0s.
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

/* ── Stat pill (F2, G1, F3) ── */

type StatPillProps = {
	value: string
	label: string
}

/**
 * @description Stat pill. Mono-weight number + Inter label inside a rounded-full
 * dark card with an emerald-muted border and a subtle emerald glow shadow. Reads
 * as a single horizontal credential.
 */
function StatPill({ value, label }: StatPillProps): ReactElement {
	return (
		<div
			className='flex items-center gap-3 rounded-full bg-cc-surface-card px-5 py-3 md:gap-4 md:px-6 md:py-3.5'
			style={{
				border: `1px solid ${EMERALD_BORDER}`,
				boxShadow: '0 0 0 1px rgba(16,185,129,0.06), 0 8px 24px -8px rgba(16,185,129,0.22)',
			}}
		>
			<span
				className='text-trim font-[family-name:var(--font-mono)]'
				style={{
					fontWeight: 500,
					fontSize: '1.125rem',
					lineHeight: 1,
					color: EMERALD,
					letterSpacing: '-0.01em',
				}}
			>
				{value}
			</span>
			<span className='text-[11px] font-medium uppercase tracking-[0.14em] text-cc-text-secondary md:text-xs'>
				{label}
			</span>
		</div>
	)
}

/* ── Growth trajectory chart (G3 -> G2 -> G1 hockey stick) ── */

type ChartPoint = {
	x: number
	y: number
	label: string
	date: string
	value: string
}

/**
 * @description Growth trajectory SVG. Hand-authored hockey-stick path through 3
 * verified points (G3 Jul 2025 $12K -> G2 Mar 2026 $350K -> G1 16wks $400K).
 * Emerald glow via SVG filter + 12% area fill + 3 labeled dots. ViewBox 800x320
 * for desktop, scales down responsively. The curve uses a smooth cubic Bezier
 * with flat-to-steep progression to read as hockey stick at any size.
 *
 * Data math (explicit so the chart stays honest):
 *   Y-axis range: $0 (bottom at y=280) -> $420K (top at y=40). 240px vertical span.
 *   G3 $12K    -> y = 280 - (12/420 * 240)  = 273.14  (nearly floor)
 *   G2 $350K   -> y = 280 - (350/420 * 240) = 80
 *   G1 $400K   -> y = 280 - (400/420 * 240) = 51.43   (near top)
 *   X positions evenly spaced across chart width 720 (with 40px margins).
 */
function GrowthChart(): ReactElement {
	const points: ReadonlyArray<ChartPoint> = [
		{ x: 100, y: 273, label: 'G3', date: 'Jul 2025', value: '$12K' },
		{ x: 400, y: 80, label: 'G2', date: 'Mar 2026', value: '$350K' },
		{ x: 700, y: 51, label: 'G1', date: '16 wks post-launch', value: '$400K' },
	]

	/* Cubic path: flat rise from G3, steep ramp up to G2, mild continuation to G1.
	   Control points are tuned to give a distinct hockey-stick shape. */
	const path = `M ${points[0].x} ${points[0].y}
		C ${points[0].x + 160} ${points[0].y + 10},
		  ${points[1].x - 140} ${points[1].y + 140},
		  ${points[1].x} ${points[1].y}
		C ${points[1].x + 120} ${points[1].y - 30},
		  ${points[2].x - 140} ${points[2].y + 10},
		  ${points[2].x} ${points[2].y}`

	const areaPath = `${path} L ${points[2].x} 280 L ${points[0].x} 280 Z`

	return (
		<div className='relative w-full'>
			<svg
				viewBox='0 0 800 320'
				width='100%'
				preserveAspectRatio='xMidYMid meet'
				role='img'
				aria-label='Growth trajectory: $12K ARR Jul 2025, $350K ARR Mar 2026, $400K ARR 16 weeks post-launch'
				className='h-auto w-full'
			>
				<defs>
					<linearGradient id='areaFill' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='0%' stopColor='#10B981' stopOpacity='0.22'/>
						<stop offset='100%' stopColor='#10B981' stopOpacity='0'/>
					</linearGradient>
					<filter id='lineGlow' x='-20%' y='-20%' width='140%' height='140%'>
						<feGaussianBlur stdDeviation='4' result='blur'/>
						<feMerge>
							<feMergeNode in='blur'/>
							<feMergeNode in='SourceGraphic'/>
						</feMerge>
					</filter>
				</defs>

				{/* Implicit baseline tick at y=280 (very faint, decorative) */}
				<line
					x1='40'
					y1='280'
					x2='760'
					y2='280'
					stroke='rgba(255,255,255,0.05)'
					strokeWidth='1'
				/>

				{/* Area fill under curve */}
				<path d={areaPath} fill='url(#areaFill)'/>

				{/* Curve with emerald glow */}
				<path
					d={path}
					fill='none'
					stroke={EMERALD}
					strokeWidth='2.5'
					strokeLinecap='round'
					strokeLinejoin='round'
					filter='url(#lineGlow)'
				/>

				{/* Labeled dots */}
				{points.map((p) => (
					<g key={p.label}>
						{/* Outer halo */}
						<circle cx={p.x} cy={p.y} r='10' fill='rgba(16,185,129,0.22)'/>
						{/* Inner dot */}
						<circle cx={p.x} cy={p.y} r='5' fill={EMERALD}/>
						{/* Value label above dot */}
						<text
							x={p.x}
							y={p.y - 18}
							textAnchor='middle'
							fontFamily='var(--font-mono)'
							fontSize='16'
							fontWeight='500'
							fill='#F8FAFC'
						>
							{p.value}
						</text>
						{/* Date label below baseline */}
						<text
							x={p.x}
							y='304'
							textAnchor='middle'
							fontFamily='var(--font-mono)'
							fontSize='11'
							fontWeight='500'
							fill='#94A3B8'
							letterSpacing='0.8'
						>
							{p.date.toUpperCase()}
						</text>
					</g>
				))}
			</svg>
		</div>
	)
}

/* ── Founder bio cards ── */

type Credential = string

type FounderCardProps = {
	name: string
	role: string
	initials: string
	imageSrc: string
	credentials: ReadonlyArray<Credential>
}

/**
 * @description Founder bio card. Duotone headshot placeholder (circular, 88px
 * desktop / 80px mobile) + name (Lora Bold) + role (Geist Mono muted) + bulleted
 * credentials with emerald dots. Card bg cc-surface-card with subtle emerald-tinted
 * border. All copy traced to F1-F7 verified.
 */
function FounderCard({ name, role, initials, imageSrc, credentials }: FounderCardProps): ReactElement {
	return (
		<article
			className='flex h-full flex-col gap-6 rounded-xl bg-cc-surface-card p-6 md:p-8'
			style={{
				border: '1px solid rgba(255,255,255,0.06)',
				boxShadow: '0 0 0 1px rgba(16,185,129,0.04), 0 16px 40px -16px rgba(0,0,0,0.6)',
			}}
		>
			<header className='flex items-center gap-4 md:gap-5'>
				<div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-full md:h-24 md:w-24'>
					<Image
						src={imageSrc}
						alt=''
						aria-hidden='true'
						fill
						sizes='(min-width: 768px) 96px, 80px'
						style={{ objectFit: 'cover' }}
					/>
					<span className='sr-only'>{initials} portrait placeholder</span>
				</div>
				<div className='flex flex-col gap-1.5'>
					<h3
						className='text-trim text-cc-text-primary'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: '1.5rem',
							lineHeight: 1.15,
							letterSpacing: '-0.01em',
						}}
					>
						{name}
					</h3>
					<p className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.16em] text-cc-text-secondary md:text-xs'>
						{role}
					</p>
				</div>
			</header>

			<ul className='flex flex-col gap-3'>
				{credentials.map((c) => (
					<li key={c} className='flex items-start gap-3'>
						<span
							className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full'
							style={{ backgroundColor: EMERALD }}
							aria-hidden='true'
						/>
						<span className='text-sm leading-relaxed text-cc-text-secondary md:text-base'>
							{c}
						</span>
					</li>
				))}
			</ul>
		</article>
	)
}

const ALIM_CREDENTIALS: ReadonlyArray<Credential> = [
	'PrizePicks Employee #19, Head of Mobile & Growth Engineering',
	'$1.5B PrizePicks exit (Allwyn)',
	'Ambitious Labs: 2M+ users, acquired by RapidDev (Oct 2025)',
	'3x founder',
] as const

const TAYLOR_CREDENTIALS: ReadonlyArray<Credential> = [
	'Wharton School, University of Pennsylvania',
	'Scaled Ambitious Labs to $250K/mo on 4x ROAS',
	'GTM strategy lead',
] as const

/* ── Section ── */

/**
 * @description Founder Credibility Strip. Dark surface institutional-trust anchor.
 * Overline + headline + 3 stat pills + growth trajectory chart + 2 founder bio
 * cards. Top edge gradient softens the transition from warm S5 into dark. All
 * founder claims + growth numbers verbatim from proof-inventory (F1-F7, G1-G3).
 */
export default function SectionFounderStrip(): ReactElement {
	return (
		<section
			id='founders'
			data-surface='dark'
			className='relative overflow-hidden bg-cc-foundation py-16 md:py-24'
		>
			{/* Top-edge gradient softens the warm->dark transition. ~80-100px band. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 top-0 h-20 md:h-24'
				style={{
					background:
						'linear-gradient(180deg, rgba(245,240,235,0.06) 0%, rgba(26,29,38,0) 100%)',
				}}
			/>

			{/* Ambient emerald radial glow (low intensity, decorative) */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0'
				style={{
					background:
						'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0) 60%)',
				}}
			/>

			<div className='relative mx-auto max-w-7xl px-6'>
				{/* Overline + headline */}
				<Reveal className='flex flex-col items-center text-center'>
					<p className='mb-5 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary md:text-xs'>
						Built by founders who&rsquo;ve done this before.
					</p>
					<h2
						className='text-trim text-balance text-cc-text-primary'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: 'clamp(2rem, 5.5vw, 3.75rem)',
							lineHeight: 1.05,
							letterSpacing: '-0.015em',
						}}
					>
						Built to last. Built by{' '}
						<span style={{ fontStyle: 'italic', color: EMERALD }}>operators</span>.
					</h2>
				</Reveal>

				{/* Stat pills row */}
				<Reveal
					className='mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-14 md:gap-4'
					delay={0.05}
				>
					<StatPill value='$1.5B' label='Founder exit' />
					<StatPill value='$400K' label='ARR in 16 weeks' />
					<StatPill value='2M+' label='Users at last company' />
				</Reveal>

				{/* Growth trajectory chart */}
				<Reveal className='mt-14 md:mt-20' delay={0.1}>
					<div className='mx-auto max-w-4xl'>
						<p className='mb-4 text-center font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.2em] text-cc-text-secondary md:mb-6 md:text-[11px]'>
							Growth trajectory
						</p>
						<GrowthChart />
					</div>
				</Reveal>

				{/* Founder bio cards */}
				<div className='mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 md:gap-6'>
					{/* Pexels placeholder portraits — swap to real Alim + Taylor headshots
					 * at launch (assets owed by Alim per F1-H2 + proof-inventory). */}
					<Reveal delay={0}>
						<FounderCard
							name='Alim Charaniya'
							role='Co-founder & CEO'
							initials='AC'
							imageSrc='/images/placeholders/founder-alim.jpg'
							credentials={ALIM_CREDENTIALS}
						/>
					</Reveal>
					<Reveal delay={0.08}>
						<FounderCard
							name='Taylor Martinez'
							role='Co-founder & COO'
							initials='TM'
							imageSrc='/images/placeholders/founder-taylor.jpg'
							credentials={TAYLOR_CREDENTIALS}
						/>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
