/** @fileoverview S6 Card 3 visual — "Onboard New Reps 10x Faster".
 *
 * Composition (per Figma 93-17247, equal col-span-1 row 2):
 *   ─ Header row: "10x faster" emerald label (left) + 🏁 emoji + "Quota
 *     Reached" mono caption (right).
 *   ─ Two horizontal progress tracks:
 *       Track 1: square emerald CC chip (left bookmark) + emerald-filled bar
 *                 at ~91% + Sarah portrait at right end (hits the flag).
 *       Track 2: dim "Avg" mono label (right-aligned) + thin gray bar at
 *                 ~44% + generic user silhouette icon at far right (the
 *                 average rep is still plodding while the trained rep is
 *                 done).
 *
 * Narrative: "trained reps hit quota in a fraction of the time average reps
 * take, because they got the reps in roleplay first."
 *
 * Wave T (Figma 93-17247 alignment, 2026-04-27):
 *   ─ Trained avatar now Sarah (was Priya per Wave N distinct roster).
 *   ─ "10x faster" reduced 20px -> 15px to match Figma scale.
 *   ─ Phosphor Flag icon swapped for 🏁 emoji per Figma copy.
 *   ─ Bar fills tuned to Figma: trained 91% (was 100%), avg 44%
 *     (was 22%) — the avg rep visibly making progress changes the
 *     read from "stalled" to "still slogging behind."
 *   ─ Sparkle orb swapped for a square emerald CC chip with radial
 *     gradient + emerald glow, matching Figma's logomark tile. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { Sparkle, User } from '@phosphor-icons/react'

export default function OnboardFasterVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col justify-center gap-5 overflow-hidden bg-cc-foundation px-5 pt-6 pb-6 md:px-6 md:pt-7'>
			{/* Header row: 10x faster + Quota Reached */}
			<div className='flex items-center justify-between'>
				<span
					className='text-trim text-[15px] font-bold leading-none text-cc-mint'
					style={{ fontFamily: 'var(--font-heading)' }}
				>
					10x faster
				</span>
				<div className='flex items-end gap-1.5'>
					<span aria-hidden='true' className='text-[13px] leading-none'>🏁</span>
					<span className='text-trim text-[12px] font-bold text-white/70'>
						Quota Reached
					</span>
				</div>
			</div>

			{/* Track 1: trained rep at ~91% */}
			<div className='flex items-center gap-2.5'>
				{/* Square CC chip — radial-gradient tile + emerald glow per Figma 95:18078 */}
				<div
					className='relative flex h-[18px] w-[19px] shrink-0 items-center justify-center rounded-[3px] shadow-[0_0_24px_rgba(16,208,120,0.4),0_0_60px_rgba(16,208,120,0.18)]'
					style={{
						background: 'radial-gradient(circle at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
					}}
				>
					<Sparkle size={12} weight='fill' className='text-cc-accent' />
				</div>
				<div className='relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5'>
					<div className='h-full w-[91%] rounded-full bg-gradient-to-r from-[#2dc87e] to-[#3ae09b] shadow-[0_0_10px_rgba(52,225,142,0.45)]' />
				</div>
				<div className='relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15'>
					<Image src='/images/avatars/closer-1.png' alt='Priya Patel' fill sizes='24px' className='object-cover' unoptimized />
				</div>
			</div>

			{/* Track 2: average rep at ~44% */}
			<div className='flex items-center gap-2.5'>
				<span className='text-trim w-[19px] shrink-0 text-right text-[9px] font-bold uppercase tracking-wider text-white/20'>
					Avg
				</span>
				<div className='relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5'>
					<div className='h-full w-[44%] rounded-full bg-white/15' />
				</div>
				<div className='relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10'>
					<User size={12} weight='regular' className='text-white/40' aria-hidden='true' />
				</div>
			</div>
		</div>
	)
}
