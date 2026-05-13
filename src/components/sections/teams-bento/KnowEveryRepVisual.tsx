/** @fileoverview S6 Card 2 visual — "Know Where Every Rep Stands".
 *
 * Mobile inset fix: with only 3 cards visible on mobile (Sarah, Marcus, Priya),
 * the desktop inset of 40px for Sarah breaks the proportional feel (0→8→40).
 * mobileInsetPx=16 gives even 8px steps: 0, 8, 16. CSS custom properties
 * switch the inset at the md breakpoint. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { ArrowDown, ChartBar } from '@phosphor-icons/react'

type Rep = {
	rank: number
	deltaPct: number
	name: string
	avatar: string
	insetPx: number
	mobileInsetPx?: number
	isFocal?: boolean
	hasTopShadow?: boolean
	mobileHidden?: boolean
	desktopHidden?: boolean
}

const REPS: readonly Rep[] = [
	{ rank: 22, deltaPct: 9,  name: 'Sarah Chen',    avatar: '/images/step1/avatar-sarah-v2.webp',     insetPx: 40, desktopHidden: true },
	{ rank: 22, deltaPct: 9,  name: 'Jordan Kim',    avatar: '/images/avatars/closer-3.webp',           insetPx: 32, desktopHidden: true },
	{ rank: 22, deltaPct: 9,  name: 'Tom Walsh',     avatar: '/images/avatars/closer-2.webp',           insetPx: 24 },
	{ rank: 23, deltaPct: 13, name: 'Mikayla Brown', avatar: '/images/avatars/closer-1.png',            insetPx: 16, hasTopShadow: true },
	{ rank: 24, deltaPct: 18, name: 'Marcus Rivera', avatar: '/images/step1/avatar-marcus-face.png',    insetPx: 8,  hasTopShadow: true },
	{ rank: 25, deltaPct: 22, name: 'Priya Patel',   avatar: '/images/avatars/closer-1.png',            insetPx: 0,  isFocal: true, hasTopShadow: true },
] as const

function StackCard({ rank, deltaPct, name, avatar, insetPx, mobileInsetPx, isFocal, hasTopShadow, mobileHidden, desktopHidden }: Rep): ReactElement {
	const padY      = isFocal ? 'py-[17px]' : 'pt-[9px] pb-[17px]'
	const metaSize  = isFocal ? 'text-[12px]' : 'text-[10px]'
	const labelSize = isFocal ? 'text-[12px]' : 'text-[10px]'
	const pctSize   = isFocal ? 'text-[18px]' : 'text-[16px]'
	const innerGap  = isFocal ? 'gap-[10px]' : 'gap-[8px]'
	const shadow    = isFocal
		? 'shadow-[0_-4px_8px_rgba(0,0,0,0.2),0_8px_6px_rgba(0,0,0,0.6)]'
		: hasTopShadow
			? 'shadow-[0_-4px_8px_rgba(0,0,0,0.2)]'
			: ''

	/* CSS custom properties let us switch inset at the md breakpoint without
	 * duplicating DOM. --i-m = mobile inset, --i-d = desktop inset. */
	const mInset = mobileInsetPx ?? insetPx
	const cssVars = {
		'--i-m': `${mInset}px`,
		'--i-d': `${insetPx}px`,
		paddingLeft:  'var(--i-m)',
		paddingRight: 'var(--i-m)',
		marginBottom: -28,
	} as React.CSSProperties

	return (
		<div
			className={`relative w-full rep-inset-card${mobileHidden ? ' hidden md:block' : ''}${desktopHidden ? ' md:hidden' : ''}`}
			style={cssVars}
		>
			<div className={`flex items-center gap-2 rounded-[12px] border border-white/10 bg-[#1e2230] px-[9px] ${padY} ${shadow}`}>
				<span
					className='shrink-0 text-trim text-[14px] font-bold text-white/50'
					style={{ fontFamily: 'var(--font-heading)', lineHeight: '16.5px' }}
				>
					{rank}
				</span>
				<div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
					<Image src={avatar} alt={name} fill sizes='32px' className='object-cover' unoptimized />
				</div>
				<div className={`flex min-w-0 flex-1 flex-col leading-none ${innerGap}`}>
					<span className='text-trim text-[16px] leading-[20px] text-[#ebebeb]'>{name}</span>
					<span className={`text-trim text-[rgba(251,251,251,0.6)] whitespace-nowrap ${metaSize}`}>
						39 calls &middot; 180 mins
					</span>
				</div>
				<div className={`flex shrink-0 flex-col items-end leading-none ${innerGap}`}>
					<span
						className={`text-trim flex items-center gap-0.5 font-bold text-[#ff5a5a] ${pctSize}`}
						style={{ fontFamily: 'var(--font-heading)' }}
					>
						<ArrowDown size={12} weight='bold' aria-hidden='true' />
						{deltaPct}%
					</span>
					<span className={`text-trim text-white/60 ${labelSize}`}>Close Rate</span>
				</div>
			</div>
		</div>
	)
}

export default function KnowEveryRepVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-6 md:px-6 md:py-8'>
			{/* Switch inset CSS var at md breakpoint */}
			<style>{`@media (min-width: 768px) { .rep-inset-card { padding-left: var(--i-d) !important; padding-right: var(--i-d) !important; } }`}</style>

			<div className='relative flex w-full max-w-[300px] flex-col self-center pb-[28px]'>
				{/* Top blur fade */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-x-0 top-0 z-10 h-[90px]'
					style={{ background: 'linear-gradient(to bottom, #0C0E13 0%, rgba(12,14,19,0) 100%)' }}
				/>
				{REPS.map((rep, i) => (
					<StackCard key={`${rep.rank}-${i}`} {...rep} />
				))}
			</div>

			{/* Footer */}
			<div className='mt-4 flex items-center justify-center gap-1'>
				<ChartBar size={12} weight='fill' className='text-white/50' aria-hidden='true' />
				<span className='text-trim text-[12px] font-medium text-white/50'>Your team rankings</span>
			</div>
		</div>
	)
}
