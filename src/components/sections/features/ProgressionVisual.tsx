'use client'

import type { ReactElement } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Avatar ring ── */
function AvatarRing({ revealed, reduced }: { revealed: boolean; reduced: boolean }): ReactElement {
	const size = 100
	const stroke = 4
	const radius = (size - stroke) / 2
	const circumference = 2 * Math.PI * radius
	const pct = 0.82
	const dashOffset = circumference * (1 - pct)

	return (
		<div className='relative' style={{ width: size, height: size }}>
			<svg width={size} height={size} className='-rotate-90'>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='rgba(255,255,255,0.08)'
					strokeWidth={stroke}
				/>
				<motion.circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='#10B981'
					strokeWidth={stroke}
					strokeLinecap='round'
					strokeDasharray={circumference}
					initial={{ strokeDashoffset: circumference }}
					animate={{ strokeDashoffset: revealed ? dashOffset : circumference }}
					transition={reduced ? { duration: 0 } : { duration: 1.2, ease: EASE, delay: 0.2 }}
				/>
			</svg>
			<div className='absolute inset-[14%] overflow-hidden rounded-full border border-white/[0.05]'>
				<Image
					src='/images/features/card3-avatar-alim.png'
					alt=''
					fill
					sizes='80px'
					className='object-cover'
					aria-hidden='true'
				/>
			</div>
		</div>
	)
}

/* ── Counting stat value ── */
function CountUp({ to, revealed, reduced, duration = 1000 }: { to: number; revealed: boolean; reduced: boolean; duration?: number }) {
	const [val, setVal] = useState(reduced ? to : 0)
	const raf = useRef<number | null>(null)
	const start = useRef<number | null>(null)

	useEffect(() => {
		if (!revealed || reduced) { setVal(to); return }
		start.current = null
		const step = (ts: number) => {
			if (!start.current) start.current = ts
			const p = Math.min((ts - start.current) / duration, 1)
			setVal(Math.round(p * to))
			if (p < 1) raf.current = requestAnimationFrame(step)
		}
		raf.current = requestAnimationFrame(step)
		return () => { if (raf.current) cancelAnimationFrame(raf.current) }
	}, [revealed, reduced, to, duration])

	return <>{val}</>
}

/* ── Stat cells ── */
function StatCell({
	value,
	label,
	valueColor,
	icon,
	delay,
	revealed,
	reduced,
}: {
	value: string | number | React.ReactNode
	label: string
	valueColor: string
	icon?: ReactElement
	delay: number
	revealed: boolean
	reduced: boolean
}): ReactElement {
	return (
		<motion.div
			className='flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/[0.05] px-2 py-2 bg-white/[0.03]'
			style={{ boxShadow: '0px 4px 8px 0px rgba(17,17,17,0.2)' }}
			initial={{ opacity: 0, y: 8 }}
			animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE, delay }}
		>
			<div className='flex items-center gap-0.5'>
				<span
					className='font-[family-name:var(--font-heading)] text-[15px] font-bold leading-none'
					style={{ color: valueColor }}
				>
					{value}
				</span>
				{icon}
			</div>
			<span className='text-[8px] uppercase leading-none text-[#B3BECE]'>{label}</span>
		</motion.div>
	)
}

function StatsRow({ revealed, reduced }: { revealed: boolean; reduced: boolean }): ReactElement {
	return (
		<div className='flex w-full items-stretch gap-2 pt-2'>
			<StatCell value='Top 15%' label='Percentile' valueColor='#10B981' delay={0.55} revealed={revealed} reduced={reduced} />
			<StatCell
				value={<CountUp to={34} revealed={revealed} reduced={reduced} duration={900} />}
				label='Calls taken'
				valueColor='#FFFFFF'
				delay={0.65}
				revealed={revealed}
				reduced={reduced}
			/>
			<StatCell
				value={<><CountUp to={27} revealed={revealed} reduced={reduced} duration={1000} /></>}
				label='Deals won'
				valueColor='#10B981'
				icon={<ArrowUp size={9} weight='bold' className='text-[#10B981]' aria-hidden='true' />}
				delay={0.72}
				revealed={revealed}
				reduced={reduced}
			/>
			<StatCell
				value={<><CountUp to={5} revealed={revealed} reduced={reduced} duration={700} /></>}
				label='Deals lost'
				valueColor='#FF5A5A'
				icon={<ArrowDown size={9} weight='bold' className='text-[#FF5A5A]' aria-hidden='true' />}
				delay={0.80}
				revealed={revealed}
				reduced={reduced}
			/>
		</div>
	)
}

/* ── Grade chart ── */
const CHART_W = 220
const CHART_H = 96
const DOTS = [
	{ x: 18,  y: 74, label: 'C',  color: '#F59E0B' },
	{ x: 84,  y: 54, label: 'C+', color: '#F59E0B' },
	{ x: 150, y: 34, label: 'B',  color: '#10B981' },
	{ x: 212, y: 18, label: 'B+', color: '#10B981' },
]
const PATH_D = DOTS.map((d, i) => `${i === 0 ? 'M' : 'L'}${d.x},${d.y}`).join(' ')
const AREA_D = `${PATH_D} L${CHART_W},${CHART_H} L0,${CHART_H} Z`
/* Approximate path length for stroke-dashoffset animation */
const PATH_LENGTH = 205

function GradeChart({ revealed, reduced }: { revealed: boolean; reduced: boolean }): ReactElement {
	return (
		<div className='relative h-[108px] w-full'>
			<svg
				width='100%'
				height='100%'
				viewBox={`0 0 ${CHART_W} ${CHART_H}`}
				preserveAspectRatio='none'
				aria-hidden='true'
			>
				{/* Gridlines */}
				<line x1={0} x2={CHART_W} y1={CHART_H * 0.25} y2={CHART_H * 0.25} stroke='rgba(255,255,255,0.06)' strokeWidth='0.5' />
				<line x1={0} x2={CHART_W} y1={CHART_H * 0.5}  y2={CHART_H * 0.5}  stroke='rgba(255,255,255,0.06)' strokeWidth='0.5' />
				<line x1={0} x2={CHART_W} y1={CHART_H * 0.75} y2={CHART_H * 0.75} stroke='rgba(255,255,255,0.06)' strokeWidth='0.5' />

				<defs>
					<linearGradient id='progressArea' x1='0' x2='0' y1='0' y2='1'>
						<stop offset='0%'   stopColor='#10B981' stopOpacity='0.25' />
						<stop offset='100%' stopColor='#10B981' stopOpacity='0' />
					</linearGradient>
				</defs>

				{/* Area fill — fades in after line draws */}
				<motion.path
					d={AREA_D}
					fill='url(#progressArea)'
					initial={{ opacity: 0 }}
					animate={{ opacity: revealed ? 1 : 0 }}
					transition={reduced ? { duration: 0 } : { duration: 0.6, ease: 'easeOut', delay: 1.7 }}
				/>

				{/* Line draw */}
				<motion.path
					d={PATH_D}
					fill='none'
					stroke='#10B981'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeDasharray={PATH_LENGTH}
					initial={{ strokeDashoffset: PATH_LENGTH }}
					animate={{ strokeDashoffset: revealed ? 0 : PATH_LENGTH }}
					transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE, delay: 1.0 }}
				/>

				{/* Dots staggered after line */}
				{DOTS.map((d, i) => (
					<motion.circle
						key={i}
						cx={d.x}
						cy={d.y}
						r={3.5}
						fill={d.color}
						initial={{ scale: 0, opacity: 0 }}
						animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
						style={{ transformOrigin: `${d.x}px ${d.y}px` }}
						transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 18, delay: 1.1 + i * 0.18 }}
					/>
				))}
			</svg>

			{/* Grade labels staggered */}
			{DOTS.map((d, i) => (
				<motion.span
					key={i}
					className='absolute font-[family-name:var(--font-heading)] text-[14px] font-bold leading-none'
					style={{
						color: d.color,
						left: `calc(${(d.x / CHART_W) * 100}% - 6px)`,
						top: `calc(${(d.y / CHART_H) * 100}% - 22px)`,
					}}
					initial={{ opacity: 0, y: 4 }}
					animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE, delay: 1.15 + i * 0.18 }}
				>
					{d.label}
				</motion.span>
			))}
		</div>
	)
}

function ProgressPanel({ revealed, reduced }: { revealed: boolean; reduced: boolean }): ReactElement {
	return (
		<div className='relative w-full rounded-2xl border border-white/[0.03] p-3'>
			<div className='mb-2 flex items-start justify-between'>
				<motion.div
					className='flex flex-col gap-1'
					initial={{ opacity: 0, x: -6 }}
					animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
					transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: 0.9 }}
				>
					<span className='text-[12px] font-medium leading-none text-white'>Discovery</span>
					<span className='text-[11px] leading-none text-[#64748B]'>12 weeks</span>
				</motion.div>
				<motion.div
					className='flex items-center gap-0.5 rounded-lg border border-cc-accent/10 px-1.5 py-1'
					style={{ backgroundColor: 'rgba(16,185,129,0.3)' }}
					initial={{ opacity: 0, scale: 0.6 }}
					animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
					transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 20, delay: 1.9 }}
				>
					<span className='font-[family-name:var(--font-heading)] text-[18px] font-bold leading-none text-cc-accent'>B</span>
					<span className='text-[12px] font-black leading-none text-cc-accent'>+</span>
				</motion.div>
			</div>
			<GradeChart revealed={revealed} reduced={reduced} />
		</div>
	)
}

export default function ProgressionVisual(): ReactElement {
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.3, once: true })
	const reduced = useReducedMotion() ?? false
	const revealed = reduced || inView

	return (
		<motion.div
			ref={ref}
			className='flex w-full flex-1 flex-col gap-4 rounded-2xl border border-white/[0.08] p-4 pt-6'
			style={{
				backgroundColor: 'rgba(26,29,38,0.7)',
				boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
			}}
			role='img'
			aria-label='Alim Charaniya, Lead Tech SaaS Closer, level 21. Top 15% percentile, 34 calls taken, 27 deals won, 5 deals lost. Discovery grade progressed from C to B plus over 12 weeks.'
			initial={{ opacity: 0, y: 16 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
			transition={reduced ? { duration: 0 } : { duration: 0.55, ease: EASE }}
		>
			{/* Avatar + level */}
			<div className='relative flex flex-col items-center gap-3'>
				<AvatarRing revealed={revealed} reduced={reduced} />
				<motion.div
					className='absolute top-[75px] rounded-full border border-cc-accent/10 px-3 py-1 backdrop-blur-sm'
					style={{ backgroundColor: 'rgba(3,67,16,0.85)' }}
					initial={{ opacity: 0, scale: 0.7 }}
					animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
					transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 22, delay: 0.35 }}
				>
					<span className='text-[11px] font-semibold leading-5 tracking-[0.24px] text-cc-accent'>Lvl 21</span>
				</motion.div>
				<motion.div
					className='mt-4 flex flex-col items-center gap-1.5 text-center'
					initial={{ opacity: 0, y: 6 }}
					animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
					transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: 0.45 }}
				>
					<span className='text-[18px] leading-[1.4] text-white'>Alim Charaniya</span>
					<span className='text-[12px] leading-[15px] text-[#94A3B8]'>Lead Tech SaaS Closer</span>
				</motion.div>
			</div>

			<StatsRow revealed={revealed} reduced={reduced} />
			<ProgressPanel revealed={revealed} reduced={reduced} />
		</motion.div>
	)
}
