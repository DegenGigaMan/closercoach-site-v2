/** @fileoverview S6 Card 2 visual — "Know Where Every Rep Stands".
 *
 * Composition (per Figma 93-16963, narrow col-span-1 row 1):
 *   ─ Vertical stack of 4 rep score cards stepping wider as they descend
 *     toward the viewer (progressive horizontal inset 24px → 16px → 8px → 0).
 *   ─ Cards overlap each other by ~28px via negative bottom margin so the
 *     stack reads as cards stacked in depth, not a list. Each lower card
 *     carries a small upward inner shadow at its top edge so the overlap
 *     reads physically (the bottom card adds a grounding bottom shadow).
 *   ─ Top of stack fades into the card body via a 60px gradient overlay
 *     so the top edge of card 22 doesn't terminate hard against the title.
 *   ─ Each card is identical structurally: rank + 32px portrait + name +
 *     "39 calls · 180 mins" subline + red ↓X% delta + "Close Rate" label.
 *     Deltas progress 9% → 13% → 18% → 22% so the stack reads as
 *     rep performance trending downward across the team.
 *   ─ Footer: bar-chart icon + "Your team rankings" mono label.
 *
 * Wave T (Figma 93-16963 alignment, 2026-04-27):
 *   ─ All 4 rows now "Sarah Chen" per Figma (was: Tom / Jordan / Marcus
 *     / Priya distinct roster from Wave N).
 *   ─ Top 3 rows promoted from compact "rank + name + delta" layout to
 *     the full layout (rank + portrait + name + meta + delta + Close
 *     Rate label) per Figma. The "front card emphasized" treatment is
 *     retired — the receding-stack composition carries the focal point. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { ArrowDown, ChartBar } from '@phosphor-icons/react'

type Card = { rank: number; deltaPct: number; indent: string; name: string; avatar: string; isLast?: boolean; isFirst?: boolean }

/* px-6 = 24px, px-4 = 16px, px-2 = 8px, px-0 = 0px — matches Figma's
 * progressive 24/16/8/0 inset on the per-card containers. */
const CARDS: readonly Card[] = [
	{ rank: 22, deltaPct: 9, indent: 'px-6', name: 'Tom Walsh', avatar: '/images/avatars/closer-2.png', isFirst: true },
	{ rank: 23, deltaPct: 13, indent: 'px-4', name: 'Jordan Kim', avatar: '/images/avatars/closer-3.png' },
	{ rank: 24, deltaPct: 18, indent: 'px-2', name: 'Marcus Rivera', avatar: '/images/step1/avatar-marcus-face.png' },
	{ rank: 25, deltaPct: 22, indent: 'px-0', name: 'Priya Patel', avatar: '/images/avatars/closer-1.png', isLast: true },
] as const

function StackCard({ rank, deltaPct, indent, name, avatar, isLast, isFirst }: Card): ReactElement {
	/* Per Figma: card 22 (top) has no shadow. Cards 23, 24, 25 carry an upward
	 * 4px shadow at their top edge so the overlap reads as cards stacking. The
	 * bottom card (25) adds a grounding 8px bottom shadow. */
	const shadowClass = isLast
		? 'shadow-[0_-4px_8px_rgba(0,0,0,0.2),0_8px_8px_rgba(0,0,0,0.5)]'
		: isFirst
			? ''
			: 'shadow-[0_-4px_8px_rgba(0,0,0,0.2)]'

	return (
		<div className={`relative w-full ${indent}`} style={isLast ? undefined : { marginBottom: -28 }}>
			<div
				className={`flex items-center gap-2 rounded-xl border border-cc-surface-border bg-cc-surface-card ${isLast ? 'px-2.5 py-3.5' : 'pb-4 pt-2 px-2.5'} ${shadowClass}`}
			>
				<span className='text-trim w-5 shrink-0 text-center font-[family-name:var(--font-heading)] text-[13px] font-bold text-white/50'>
					{rank}
				</span>
				<div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
					<Image src={avatar} alt={name} fill sizes='32px' className='object-cover' unoptimized />
				</div>
				<div className='flex min-w-0 flex-1 flex-col gap-1.5 leading-none'>
					<span className='text-trim text-[14px] text-white/95'>{name}</span>
					<span className='text-trim flex items-center gap-1 text-[10px] text-white/60'>
						<span>39 calls</span>
						<span aria-hidden='true' className='inline-block h-[2px] w-[2px] rounded-full bg-white/60' />
						<span>180 mins</span>
					</span>
				</div>
				<div className='flex shrink-0 flex-col items-end gap-1.5 leading-none'>
					<span className={`text-trim flex items-center gap-0.5 font-[family-name:var(--font-heading)] font-bold text-cc-error ${isLast ? 'text-[16px]' : 'text-[14px]'}`}>
						<ArrowDown size={isLast ? 12 : 11} weight='bold' aria-hidden='true' />
						{deltaPct}%
					</span>
					<span className={`text-trim text-white/60 ${isLast ? 'text-[10px]' : 'text-[9px]'}`}>Close Rate</span>
				</div>
			</div>
		</div>
	)
}

export default function KnowEveryRepVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col overflow-hidden bg-cc-foundation px-5 pt-6 pb-5 md:px-6 md:pt-8 md:pb-6'>
			{/* Stack cap — pushes the receding card stack toward the bottom of
			 * the visual area so the title block (above this visual) breathes. */}
			<div className='flex-1 min-h-2' />

			<div className='relative flex w-full max-w-[320px] flex-col self-center'>
				{/* Top blur fade — Figma node 93:17037, 60px tall gradient that
				 * bleeds the top of card 22 into the card body above. */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-cc-foundation via-cc-foundation/60 to-transparent'
				/>
				{CARDS.map((c) => (
					<StackCard key={c.rank} {...c} />
				))}
			</div>

			{/* Footer */}
			<div className='mt-5 flex items-center justify-center gap-1.5'>
				<ChartBar size={12} weight='fill' className='text-cc-text-secondary/70' aria-hidden='true' />
				<span className='text-trim text-[12px] font-medium text-cc-text-secondary/70'>
					Your team rankings
				</span>
			</div>
		</div>
	)
}
