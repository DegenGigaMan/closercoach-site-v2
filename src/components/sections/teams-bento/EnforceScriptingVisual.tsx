/** @fileoverview S6 Card 4 visual — "Enforce New Scripting Efficiently".
 *
 * Andy 2026-05-01 redesign. Replaces the prior 5-step vertical timeline (Wave
 * T) with a four-node assignment flow lifted directly from the Figma export
 * Group 2147224631 (261×257 viewBox):
 *
 *   ┌────┐
 *   │ 👤 │   Manager (origin of the assignment)
 *   └─┬──┘
 *     │     ── 1px emerald hairline rail
 *   ┌─┴──────────────────────────────────┬───────────────┐
 *   │ Objection Reframe Script           │ ▢ In Progress │   Task pill
 *   │ All 8 reps · Due Friday            │               │
 *   └─┬──────────────────────────────────┴───────────────┘
 *     │
 *   ┌─┴──┐
 *   │ CC │   CloserCoach app icon (emerald square + glow)
 *   └─┬──┘
 *     │
 *   ◯◯◯       Three rep avatars (overlapped, ringed)
 *
 * The reference SVG ships embedded raster avatars (4.2MB), so we rebuild the
 * composition in React with the live /images/avatars/closer-{1,2,3}.png assets
 * to keep the DOM lightweight + theme-aware.
 *
 * Sizing posture: this visual lives inside the 'equal-flow' tier (230/250px
 * tall, matching 'equal' so row-2 cards lock to the same ~412px total card
 * height as Onboard 10x). Element sizes are deliberately compact (24px
 * Manager badge, 36px app icon, 32px avatars) and the four rails use flex-1
 * so they evenly absorb whatever vertical slack the card surface gives them. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { User } from '@phosphor-icons/react'

const AVATARS = [
	{ src: '/images/avatars/closer-1.png', alt: 'Rep avatar 1' },
	{ src: '/images/avatars/closer-2.png', alt: 'Rep avatar 2' },
	{ src: '/images/avatars/closer-3.png', alt: 'Rep avatar 3' },
] as const

/* Emerald rail — 1px vertical line, faded at each end so it doesn't clip
 * harshly into the surrounding badges. Brand emerald (#10B981) at variable
 * mid-opacity reads as a soft connector, not a structural border. flex-1
 * inside a flex-col column lets adjacent rails share the leftover vertical
 * space evenly so the four nodes stay distributed regardless of card height. */
function Rail(): ReactElement {
	return (
		<span
			aria-hidden='true'
			className='block w-px flex-1 min-h-[8px] bg-gradient-to-b from-cc-accent/0 via-cc-accent/55 to-cc-accent/0'
		/>
	)
}

export default function EnforceScriptingVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full items-stretch justify-center px-6 py-4 md:px-8 md:py-5'>
			<div className='flex w-full max-w-[300px] flex-col items-center'>
				{/* 1. Manager origin badge */}
				<div
					className='relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#141814]/85'
					aria-label='Manager'
				>
					<User size={12} weight='bold' className='text-white/90' aria-hidden='true' />
				</div>

				<Rail />

				{/* 2. Task pill — dark surface, rounded, with In Progress chip */}
				<div className='relative z-10 flex w-full shrink-0 items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-[#1E2230] px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.25)]'>
					<div className='flex min-w-0 flex-col'>
						<span className='text-[12px] font-bold leading-tight text-white'>
							Objection Reframe Script
						</span>
						<span className='text-trim mt-0.5 text-[10px] font-medium leading-tight text-cc-text-secondary'>
							All 8 reps · Due Friday
						</span>
					</div>
					<span className='shrink-0 rounded-full border border-[#10D078]/25 bg-[#10D078]/10 px-2 py-0.5 text-[9px] font-semibold leading-none text-cc-mint'>
						In Progress
					</span>
				</div>

				<Rail />

				{/* 3. CloserCoach app icon — emerald rounded square with brand glow */}
				<div
					aria-label='CloserCoach app'
					className='relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
					style={{
						background: 'radial-gradient(circle at 30% 25%, #1FB174 0%, #0F7044 70%, #08482C 100%)',
					}}
				>
					<Image
						src='/images/cc-logomark.png'
						alt=''
						width={24}
						height={24}
						className='h-6 w-6 object-contain'
					/>
				</div>

				<Rail />

				{/* 4. Three rep avatars — overlapped, ringed for separation */}
				<div className='relative z-10 flex shrink-0 -space-x-2'>
					{AVATARS.map((avatar) => (
						<span
							key={avatar.src}
							className='relative inline-flex h-8 w-8 overflow-hidden rounded-full border-2 border-cc-foundation ring-1 ring-white/10'
						>
							<Image
								src={avatar.src}
								alt={avatar.alt}
								width={64}
								height={64}
								className='h-full w-full object-cover'
							/>
						</span>
					))}
				</div>
			</div>
		</div>
	)
}
