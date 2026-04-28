/** @fileoverview S6 Card 2 visual — "Know Where Every Rep Stands".
 *
 * Composition (per Figma 93-16986, Wave V tokens 2026-04-27):
 *   ─ 6 receding rep score cards stacked vertically. Each card is solid
 *     #1e2230 bg + 1px white/10 border + rounded-12. Each lower card sits
 *     in a wrapper with progressively LESS horizontal padding so it appears
 *     wider than the card above it: 40 / 32 / 24 / 16 / 8 / 0 px.
 *   ─ Cards overlap by 28px via mb-[-28px] so the stack reads as cards
 *     receding into depth.
 *   ─ Cards 4-6 carry an upward 4px shadow at top edge (overlap depth cue);
 *     card 6 (focal, bottom) ALSO carries a grounding 8px bottom shadow.
 *   ─ Card 6 is the focal point: typography stepped up — meta line 12px
 *     (was 10px), close-rate label 12px, percentage 18px (was 16px),
 *     vertical content gap 10px (was 8px), padding py-17 (was pt-9 pb-17).
 *   ─ 90px top blur fade bleeds the top of card 1 into the card body above.
 *   ─ Footer: 12px ChartBar icon + "Your team rankings" Inter Medium 12px
 *     white/50 — gap-1 between icon and label.
 *
 * Rank typography: Lora Bold 14px white/50 leading 16.5.
 * Name typography: Inter Regular 16px #ebebeb leading 20.
 * Meta line typography: Inter Regular 10/12px rgba(251,251,251,0.6).
 * Percentage typography: Lora Bold 16/18px #ff5a5a.
 * Avatar: 32×32 rounded-100, white/5 border. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { ArrowDown, ChartBar } from '@phosphor-icons/react'

type Rep = { rank: number; deltaPct: number; name: string; avatar: string; insetPx: number; isFocal?: boolean; hasTopShadow?: boolean }

/* Inset progression per Figma: card 1 (top) wrapper px-40 = narrowest inner;
 * card 6 (focal, bottom) wrapper px-0 = widest. Gives the receding-stack feel. */
const REPS: readonly Rep[] = [
	{ rank: 22, deltaPct: 9, name: 'Sarah Chen', avatar: '/images/step1/avatar-sarah-v2.png', insetPx: 40 },
	{ rank: 22, deltaPct: 9, name: 'Jordan Kim', avatar: '/images/avatars/closer-3.png', insetPx: 32 },
	{ rank: 22, deltaPct: 9, name: 'Tom Walsh', avatar: '/images/avatars/closer-2.png', insetPx: 24 },
	{ rank: 23, deltaPct: 13, name: 'Mikayla Brown', avatar: '/images/avatars/closer-1.png', insetPx: 16, hasTopShadow: true },
	{ rank: 24, deltaPct: 18, name: 'Marcus Rivera', avatar: '/images/step1/avatar-marcus-face.png', insetPx: 8, hasTopShadow: true },
	{ rank: 25, deltaPct: 22, name: 'Priya Patel', avatar: '/images/avatars/closer-1.png', insetPx: 0, isFocal: true, hasTopShadow: true },
] as const

function StackCard({ rank, deltaPct, name, avatar, insetPx, isFocal, hasTopShadow }: Rep): ReactElement {
	const padY = isFocal ? 'py-[17px]' : 'pt-[9px] pb-[17px]'
	const metaSize = isFocal ? 'text-[12px]' : 'text-[10px]'
	const labelSize = isFocal ? 'text-[12px]' : 'text-[10px]'
	const pctSize = isFocal ? 'text-[18px]' : 'text-[16px]'
	const innerGap = isFocal ? 'gap-[10px]' : 'gap-[8px]'
	const shadow = isFocal
		? 'shadow-[0_-4px_8px_rgba(0,0,0,0.2),0_8px_6px_rgba(0,0,0,0.6)]'
		: hasTopShadow
			? 'shadow-[0_-4px_8px_rgba(0,0,0,0.2)]'
			: ''

	return (
		<div
			className='relative w-full'
			style={{ paddingLeft: insetPx, paddingRight: insetPx, marginBottom: -28 }}
		>
			<div
				className={`flex items-center gap-2 rounded-[12px] border border-white/10 bg-[#1e2230] px-[9px] ${padY} ${shadow}`}
			>
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
		<div className='relative flex h-full w-full flex-col overflow-hidden px-5 pt-6 pb-5 md:px-6 md:pt-8 md:pb-6'>
			{/* Pushes the receding stack toward the bottom of the visual area. */}
			<div className='flex-1 min-h-2' />

			<div className='relative flex w-full max-w-[300px] flex-col self-center pb-[28px]'>
				{/* Top blur fade — Figma 93:17037, 90px tall gradient fading from
				 * the bento card's effective fill color down to transparent. The
				 * card overlay rgba(30,34,48,0.2) blended over cc-foundation
				 * #0D0F14 produces ~#101219, which is exactly Figma's stop color.
				 * Using #101219 here means the fade visually melts into the card
				 * surface around it, hiding the top-card edges. */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-x-0 top-0 z-10 h-[90px]'
					style={{
						background: 'linear-gradient(to bottom, #101219 0%, rgba(16,18,25,0) 100%)',
					}}
				/>
				{REPS.map((rep, i) => (
					<StackCard key={`${rep.rank}-${i}`} {...rep} />
				))}
			</div>

			{/* Footer — Figma 93:16987. ChartBar icon 12px + label 12px white/50. */}
			<div className='mt-6 flex items-center justify-center gap-1'>
				<ChartBar size={12} weight='fill' className='text-white/50' aria-hidden='true' />
				<span className='text-trim text-[12px] font-medium text-white/50'>
					Your team rankings
				</span>
			</div>
		</div>
	)
}
