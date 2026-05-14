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

function Reveal({ children, className = '', delay = 0 }: RevealProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement | null>(null)
	const isInView = useInView(ref, { once: true, margin: '0px' })

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

type StatPillProps = {
	value: string
	label: string
}

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

/* ── Growth trajectory chart (hockey stick) ── */

type ChartPoint = {
	x: number
	y: number
	label: string
	date: string
	value: string
}

function GrowthChart(): ReactElement {
	const points: ReadonlyArray<ChartPoint> = [
		{ x: 100, y: 273, label: 'G3', date: 'Jul 2025', value: '$12K' },
		{ x: 400, y: 80, label: 'G2', date: 'Mar 2026', value: '$350K' },
		{ x: 700, y: 51, label: 'G1', date: '16 wks post-launch', value: '$400K' },
	]

	/* Cubic path: flat rise early, steep ramp mid-chart, mild continuation to end.
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
