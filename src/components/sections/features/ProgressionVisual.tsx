/** @fileoverview Card 3 visual -- Skills Progression Tracking.
 *
 * Composition: tall stat card containing
 *   - Avatar with emerald progress ring + "Lvl 21" pill beneath
 *   - Name + role
 *   - 4 stat cells: Top 15% / 34 / 27 up / 5 down
 *   - Discovery 12-weeks header + B+ badge top-right
 *   - 4-grade-line chart with C, C+, B, B+ dots progressing upward
 *
 * Mapped from Figma node 1:11325. */

'use client'

import type { ReactElement } from 'react'
import Image from 'next/image'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'

function AvatarRing(): ReactElement {
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
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='#10B981'
					strokeWidth={stroke}
					strokeLinecap='round'
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
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

function StatCell({
	value,
	label,
	valueColor,
	icon,
}: {
	value: string
	label: string
	valueColor: string
	icon?: ReactElement
}): ReactElement {
	return (
		<div
			className='flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/[0.05] px-2 py-2 bg-white/[0.03]'
			style={{ boxShadow: '0px 4px 8px 0px rgba(17,17,17,0.2)' }}
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
		</div>
	)
}

function StatsRow(): ReactElement {
	return (
		<div className='flex w-full items-stretch gap-2 pt-2'>
			<StatCell value='Top 15%' label='Percentile' valueColor='#10B981' />
			<StatCell value='34' label='Calls taken' valueColor='#FFFFFF' />
			<StatCell
				value='27'
				label='Deals won'
				valueColor='#10B981'
				icon={<ArrowUp size={9} weight='bold' className='text-[#10B981]' aria-hidden='true' />}
			/>
			<StatCell
				value='5'
				label='Deals lost'
				valueColor='#FF5A5A'
				icon={<ArrowDown size={9} weight='bold' className='text-[#FF5A5A]' aria-hidden='true' />}
			/>
		</div>
	)
}

/**
 * @description SVG progression chart: 4 grade rungs (C at bottom, B+ at top)
 * with emerald polyline through 4 dots. ViewBox 220x96. Grid lines at 20%, 50%, 80% of
 * height. Dots labeled C, C+, B, B+ are drawn with text inline.
 */
function GradeChart(): ReactElement {
	// 4 dots along the 220-wide chart at weeks 3, 6, 9, 12
	// Grades: C (bottom), C+, B, B+ (top) => y positions
	const W = 220
	const H = 96
	const dots = [
		{ x: 18, y: 74, label: 'C', color: '#F59E0B' },
		{ x: 84, y: 54, label: 'C+', color: '#F59E0B' },
		{ x: 150, y: 34, label: 'B', color: '#10B981' },
		{ x: 212, y: 18, label: 'B+', color: '#10B981' },
	]
	const pathD = dots.map((d, i) => `${i === 0 ? 'M' : 'L'}${d.x},${d.y}`).join(' ')
	// area fill
	const areaD = `${pathD} L${W},${H} L0,${H} Z`

	return (
		<div className='relative h-[108px] w-full'>
			<svg
				width='100%'
				height='100%'
				viewBox={`0 0 ${W} ${H}`}
				preserveAspectRatio='none'
				aria-hidden='true'
			>
				{/* Gridlines */}
				<line x1={0} x2={W} y1={H * 0.25} y2={H * 0.25} stroke='rgba(255,255,255,0.06)' strokeWidth='0.5' />
				<line x1={0} x2={W} y1={H * 0.5} y2={H * 0.5} stroke='rgba(255,255,255,0.06)' strokeWidth='0.5' />
				<line x1={0} x2={W} y1={H * 0.75} y2={H * 0.75} stroke='rgba(255,255,255,0.06)' strokeWidth='0.5' />

				{/* Area gradient fill under line */}
				<defs>
					<linearGradient id='progressArea' x1='0' x2='0' y1='0' y2='1'>
						<stop offset='0%' stopColor='#10B981' stopOpacity='0.25' />
						<stop offset='100%' stopColor='#10B981' stopOpacity='0' />
					</linearGradient>
				</defs>
				<path d={areaD} fill='url(#progressArea)' />
				<path d={pathD} fill='none' stroke='#10B981' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />

				{/* Dots */}
				{dots.map((d, i) => (
					<g key={i}>
						<circle cx={d.x} cy={d.y} r={3.5} fill={d.color} />
					</g>
				))}
			</svg>
			{/* Grade labels positioned in absolute coords */}
			{dots.map((d, i) => (
				<span
					key={i}
					className='absolute font-[family-name:var(--font-heading)] text-[14px] font-bold leading-none'
					style={{
						color: d.color,
						left: `calc(${(d.x / W) * 100}% - 6px)`,
						top: `calc(${(d.y / H) * 100}% - 22px)`,
					}}
				>
					{d.label}
				</span>
			))}
		</div>
	)
}

function ProgressPanel(): ReactElement {
	return (
		<div className='relative w-full rounded-2xl border border-white/[0.03] p-3'>
			<div className='mb-2 flex items-start justify-between'>
				<div className='flex flex-col gap-1'>
					<span className='text-[12px] font-medium leading-none text-white'>Discovery</span>
					<span className='text-[11px] leading-none text-[#64748B]'>12 weeks</span>
				</div>
				<div
					className='flex items-center gap-0.5 rounded-lg border border-cc-accent/10 px-1.5 py-1'
					style={{ backgroundColor: 'rgba(16,185,129,0.3)' }}
				>
					<span className='font-[family-name:var(--font-heading)] text-[18px] font-bold leading-none text-cc-accent'>
						B
					</span>
					<span className='text-[12px] font-black leading-none text-cc-accent'>+</span>
				</div>
			</div>
			<GradeChart />
		</div>
	)
}

export default function ProgressionVisual(): ReactElement {
	return (
		<div
			className='flex w-full flex-1 flex-col gap-4 rounded-2xl border border-white/[0.08] p-4 pt-6'
			style={{
				backgroundColor: 'rgba(26,29,38,0.7)',
				boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
			}}
			role='img'
			aria-label='Alim Charaniya, Lead Tech SaaS Closer, level 21. Top 15% percentile, 34 calls taken, 27 deals won, 5 deals lost. Discovery grade progressed from C to B plus over 12 weeks.'
		>
			{/* Avatar + level */}
			<div className='relative flex flex-col items-center gap-3'>
				<AvatarRing />
				<div
					className='absolute top-[75px] rounded-full border border-cc-accent/10 px-3 py-1 backdrop-blur-sm'
					style={{ backgroundColor: 'rgba(3,67,16,0.85)' }}
				>
					<span className='text-[11px] font-semibold leading-5 tracking-[0.24px] text-cc-accent'>
						Lvl 21
					</span>
				</div>
				<div className='mt-4 flex flex-col items-center gap-1.5 text-center'>
					<span className='text-[18px] leading-[1.4] text-white'>Alim Charaniya</span>
					<span className='text-[12px] leading-[15px] text-[#94A3B8]'>Lead Tech SaaS Closer</span>
				</div>
			</div>

			<StatsRow />

			<ProgressPanel />
		</div>
	)
}
