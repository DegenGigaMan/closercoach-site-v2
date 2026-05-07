/** @fileoverview S6 Card 3 visual — "Onboard New Reps 10x Faster".
 *
 * Composition (per Figma 81-5018, equal col-span-1 row 2):
 *   ─ Header row: "10x faster" emerald headline (left) + 🏁 emoji + "Quota
 *     Reached" mono caption (right).
 *   ─ Two horizontal progress tracks stacked tight (12px gap) so they read
 *     as a paired comparison, separated from the header by a wider 20px
 *     breathing gap:
 *       Track 1: square emerald CC chip (left bookmark) + emerald-filled bar
 *                 at ~91% + trained-rep portrait at right end (hits the flag).
 *       Track 2: dim "Avg" mono kicker (right-aligned) + thin neutral bar at
 *                 ~44% + generic user silhouette icon at far right (the
 *                 average rep is still plodding while the trained rep is
 *                 done).
 *
 * Narrative: "trained reps hit quota in a fraction of the time average reps
 * take, because they got the reps in roleplay first."
 *
 * Wave T -> Wave U (Figma 81-5018 design-system refinements, 2026-04-27):
 *   ─ Outer flex gap split: header→tracks 20px, track→track 12px (was a
 *     uniform gap-5 that flattened the rhythm).
 *   ─ Quota Reached + Avg switched to mono per Figma caption styling and
 *     to harmonize with Geist Mono kickers used in sibling cards.
 *   ─ CC chip interior shifted from pure-black radial to emerald-tinted
 *     deep-green so it reads as a CC logomark tile (not a hole punched
 *     into the card). 1px emerald-tinted border replaces the bare edge.
 *   ─ Avg track: bar opacities lifted (track /[0.06], fill /25) so the
 *     44% read stays legible at 768/390 without competing with the
 *     emerald primary track.
 *   ─ Trained avatar ring: 2px cc-foundation halo + 1px emerald hint so
 *     the portrait pops off the chip→bar→avatar rail (matches calendar
 *     avatar ring grammar in CoachRepsAtScaleVisual).
 *   ─ Header emoji + caption realigned to items-center with gap-1 so the
 *     flag baseline trims with the mono cap line. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { User } from '@phosphor-icons/react'

export default function OnboardFasterVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col justify-center overflow-hidden px-5 py-6 md:px-6 md:py-7'>
			{/* Header row: 10x faster + Quota Reached. mb-5 sets the
			 * generous header→tracks breathing gap (20px) while the track
			 * stack below uses a tighter gap-3 (12px) so the two bars read
			 * as paired siblings. */}
			<div className='mb-5 flex items-center justify-between'>
				<span
					className='text-trim text-[15px] font-bold leading-none text-cc-mint'
					style={{ fontFamily: 'var(--font-heading)' }}
				>
					10x faster
				</span>
				<div className='flex items-center gap-1'>
					<span aria-hidden='true' className='text-[13px] leading-none'>🏁</span>
					<span
						className='text-trim text-[11px] font-medium uppercase tracking-[0.08em] text-white/70'
						style={{ fontFamily: 'var(--font-mono)' }}
					>
						Quota Reached
					</span>
				</div>
			</div>

			{/* Two-track stack — 12px between rails so the 91%/44% pair
			 * reads as a comparison, not two unrelated rows. */}
			<div className='flex flex-col gap-3'>
				{/* Track 1: trained rep at ~91% */}
				<div className='flex items-center gap-2.5'>
					{/* CC logomark chip — emerald-glow tile per Figma 95:18331 vocab. */}
					<div
						className='relative flex h-[34px] w-[36px] shrink-0 items-center justify-center rounded-[8px] shadow-[0_0_18px_rgba(16,208,120,0.45),0_0_44px_rgba(16,208,120,0.18)]'
						style={{
							background: 'radial-gradient(ellipse at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
						}}
					>
						<Image
							src='/images/cc-logomark.png'
							alt=''
							width={17}
							height={17}
							sizes='17px'
							className='h-[17px] w-[17px] object-contain'
							unoptimized
						/>
					</div>
					<div className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]'>
						<div className='h-full w-[91%] rounded-full bg-gradient-to-r from-[#2dc87e] to-[#3ae09b] shadow-[0_0_10px_rgba(52,225,142,0.45)]' />
					</div>
					<div className='relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-2 ring-cc-foundation shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'>
						<Image src='/images/avatars/closer-1.png' alt='Priya Patel' fill sizes='24px' className='object-cover' unoptimized />
					</div>
				</div>

				{/* Track 2: average rep at ~44% */}
				<div className='flex items-center gap-2.5'>
					<span
						className='text-trim w-[33px] shrink-0 text-right text-[9px] font-medium uppercase tracking-[0.18em] text-white/35'
						style={{ fontFamily: 'var(--font-mono)' }}
					>
						Avg
					</span>
					<div className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]'>
						<div className='h-full w-[44%] rounded-full bg-white/25' />
					</div>
					<div className='relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10'>
						<User size={12} weight='regular' className='text-white/45' aria-hidden='true' />
					</div>
				</div>
			</div>
		</div>
	)
}
