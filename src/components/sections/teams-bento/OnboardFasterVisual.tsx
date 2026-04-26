/** @fileoverview S6 Card 3 visual — "Onboard New Reps 10x Faster".
 *
 * Composition (per Figma 81-5018, equal col-span-1 row 2):
 *   ─ Top row: "10x faster" emerald label (left) + checkered-flag mono "Quota
 *     Reached" pill (right).
 *   ─ Two horizontal progress tracks:
 *       Track 1: emerald sparkle orb (left bookmark) + emerald-filled bar at
 *                 100% + Sarah Chen portrait at right end (hits the flag).
 *       Track 2: dim "Avg" mono label + thin gray bar at ~20% + generic user
 *                 silhouette icon at far right (the average rep is still
 *                 plodding while the trained rep is done).
 *
 * Narrative: "trained reps hit quota in a fraction of the time average reps
 * take, because they got the reps in roleplay first." */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { Flag, Sparkle, User } from '@phosphor-icons/react'

const SARAH = '/images/step1/avatar-sarah-v2.png'

export default function OnboardFasterVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col justify-center gap-5 overflow-hidden bg-cc-foundation px-5 pt-6 pb-6 md:px-6 md:pt-7'>
			{/* Header row: 10x faster + Quota Reached */}
			<div className='flex items-center justify-between'>
				<span
					className='text-trim text-[20px] font-bold leading-none text-cc-mint'
					style={{ fontFamily: 'var(--font-heading)' }}
				>
					10x faster
				</span>
				<div className='flex items-center gap-1.5'>
					<Flag size={12} weight='fill' className='text-cc-text-secondary/70' aria-hidden='true' />
					<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-cc-text-secondary'>
						Quota Reached
					</span>
				</div>
			</div>

			{/* Track 1: rep at 100% */}
			<div className='flex items-center gap-2'>
				<div className='relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cc-foundation-deep ring-2 ring-cc-accent/80 shadow-[0_0_12px_rgba(16,185,129,0.4)]'>
					<Sparkle size={11} weight='fill' className='text-cc-accent' />
				</div>
				<div className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-cc-surface-card'>
					<div className='h-full w-full rounded-full bg-gradient-to-r from-cc-accent/80 via-cc-mint to-cc-accent shadow-[0_0_12px_rgba(52,225,142,0.4)]' />
				</div>
				<div className='relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
					<Image src={SARAH} alt='Sarah Chen' fill sizes='28px' className='object-cover' unoptimized />
				</div>
			</div>

			{/* Track 2: average rep at ~20% */}
			<div className='flex items-center gap-2'>
				<span className='text-trim w-6 shrink-0 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-cc-text-secondary/60'>
					Avg
				</span>
				<div className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-cc-surface-card'>
					<div className='h-full w-[22%] rounded-full bg-cc-text-secondary/30' />
				</div>
				<div className='relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cc-surface-card ring-1 ring-cc-surface-border'>
					<User size={13} weight='regular' className='text-cc-text-secondary/60' aria-hidden='true' />
				</div>
			</div>
		</div>
	)
}
