/** @fileoverview S6 Card 2 visual — "Know Where Every Rep Stands".
 *
 * Composition (per Figma 93-16986, narrow col-span-1 row 1):
 *   ─ Vertical stack of 5 rep score cards stepping toward the viewer.
 *   ─ Top 4 cards: rank number + portrait + name + declining % delta in red.
 *     Stack opacity fades from 0.35 (top) to 1.0 (front) so the bottom card
 *     reads as the focal point.
 *   ─ Front card (rank 25): rank + portrait + name + body line "39 calls · 180
 *     mins" + "Close Rate" amber/red label as right-side metric.
 *   ─ Footer: bar-chart icon + "Your team rankings" mono label.
 *
 * Narrative: "see every rep, ranked, with the trend that matters". */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { ChartBar } from '@phosphor-icons/react'

const SARAH = '/images/step1/avatar-sarah-v2.png'

type Row = { rank: number; delta: string; opacity: number }

const STACK_TOP: readonly Row[] = [
	{ rank: 22, delta: '↓ 9%', opacity: 0.35 },
	{ rank: 23, delta: '↓ 13%', opacity: 0.55 },
	{ rank: 24, delta: '↓ 18%', opacity: 0.75 },
] as const

function StackRow({ rank, delta, opacity }: Row): ReactElement {
	return (
		<div
			className='relative flex items-center gap-3 rounded-xl border border-cc-surface-border bg-cc-surface-card/80 px-3 py-2.5 backdrop-blur-sm'
			style={{ opacity }}
		>
			<span className='text-trim w-5 shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-medium text-cc-text-secondary'>{rank}</span>
			<div className='relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
				<Image src={SARAH} alt='' fill sizes='24px' className='object-cover' unoptimized />
			</div>
			<span className='text-trim flex-1 text-[12px] font-medium text-white/85'>Sarah Chen</span>
			<span className='text-trim shrink-0 text-[11px] font-semibold text-cc-error'>{delta}</span>
		</div>
	)
}

export default function KnowEveryRepVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col justify-end overflow-hidden bg-cc-foundation px-5 pt-6 pb-5 md:px-6 md:pt-8 md:pb-6'>
			<div className='relative flex flex-col gap-2'>
				{STACK_TOP.map((row) => (
					<StackRow key={row.rank} {...row} />
				))}

				{/* Front card (rank 25): emphasized */}
				<div className='relative flex items-center gap-3 rounded-xl border border-cc-accent/30 bg-cc-surface-card px-3 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)]'>
					<span className='text-trim w-5 shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-white'>25</span>
					<div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
						<Image src={SARAH} alt='Sarah Chen' fill sizes='36px' className='object-cover' unoptimized />
					</div>
					<div className='flex min-w-0 flex-1 flex-col leading-none'>
						<span className='text-trim text-[13px] font-semibold text-white'>Sarah Chen</span>
						<span className='text-trim mt-1 text-[11px] text-cc-text-secondary'>39 calls · 180 mins</span>
					</div>
					<div className='flex shrink-0 flex-col items-end leading-none'>
						<span className='text-trim text-[12px] font-bold text-cc-error'>↓ 22%</span>
						<span className='text-trim mt-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-cc-text-secondary/80'>Close Rate</span>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className='mt-4 flex items-center gap-1.5'>
				<ChartBar size={12} weight='fill' className='text-cc-text-secondary/70' aria-hidden='true' />
				<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-cc-text-secondary/80'>
					Your team rankings
				</span>
			</div>
		</div>
	)
}
