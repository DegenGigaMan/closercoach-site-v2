/** @fileoverview S6 Card 4 visual — "Enforce New Scripting Efficiently".
 *
 * Composition (Figma node 81:5069 + 93:17386 timeline group):
 *   ─ Vertical timeline: 5 steps connected by a 1px white hairline rail
 *     anchored at x=13 (which is the horizontal center of the 26x26
 *     badges). Rail spans y=13 to y=206 inside the 171x219 group.
 *   ─ Each step row: 42px pitch (rows 1, 2, 4, 5). Active row (3): 51px
 *     pitch to fit the sub-label. Badge at row-relative (x=0, y=8),
 *     label container at (x=36, y=8) so the gap between badge right
 *     edge and label start is exactly 10px.
 *   ─ Each badge: 26x26 circle, tinted bg + tinted 1px border. The
 *     active step adds an emerald glow shadow (`Overlay+Border+Shadow`
 *     in Figma) and an emerald sub-label.
 *   ─ Per-step opacity tiers 0.3 / 0.55 / 1.0 / 0.55 / 0.3 so the
 *     active "Reps drill in roleplay" step is the unmistakable focal
 *     point and the trail of completed/upcoming steps fades from it.
 *   ─ Icon vocabulary per status (14px Phosphor inside 26x26 badge):
 *       Step 1 done-old   : blue tint, NotePencil   (script written)
 *       Step 2 done-recent: green tint, PaperPlane  (rolled out)
 *       Step 3 active     : emerald glow, Sparkle   (AI runs the reps)
 *       Step 4 upcoming   : amber tint, Flag        (mastery / quota)
 *       Step 5 last       : faded green, Eye        (manager visibility)
 *
 * Wave T fine-tune (2026-04-27): rail inset corrected to 13px (matches
 * Figma badge centerline anchor), active-step emerald glow layered to
 * match OnboardFasterVisual's emerald glow recipe, label/sub-label
 * colors switched from raw hex to CC tokens (cc-text-secondary muted,
 * white active, cc-mint emphasis sub-label), opacity tier doc updated
 * to the canonical 0.3/0.55/1/0.55/0.3 ladder. */

'use client'

import type { ReactElement } from 'react'
import { Eye, Flag, NotePencil, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react'

type StepTone = 'blue-faded' | 'green-faded' | 'emerald-active' | 'amber-faded' | 'green-last'

type Step = {
	label: string
	sub?: string
	tone: StepTone
	Icon: typeof Sparkle
}

const STEPS: readonly Step[] = [
	{ label: 'New talk track created', tone: 'blue-faded', Icon: NotePencil },
	{ label: 'Pushed to whole team', tone: 'green-faded', Icon: PaperPlaneTilt },
	{ label: 'Reps drill in roleplay', sub: 'AI runs every rep until fluent', tone: 'emerald-active', Icon: Sparkle },
	{ label: 'Mastery confirmed', tone: 'amber-faded', Icon: Flag },
	{ label: 'Manager sees it’s done', tone: 'green-last', Icon: Eye },
] as const

const TONE: Record<StepTone, { wrapperOpacity: string; badgeBg: string; badgeBorder: string; badgeGlow?: string; iconColor: string; labelColor: string; labelWeight: string }> = {
	'blue-faded': {
		wrapperOpacity: 'opacity-30',
		badgeBg: 'bg-[rgba(100,160,255,0.1)]',
		badgeBorder: 'border-[rgba(100,160,255,0.22)]',
		iconColor: 'text-[rgba(155,188,255,0.95)]',
		labelColor: 'text-cc-text-secondary',
		labelWeight: 'font-semibold',
	},
	'green-faded': {
		wrapperOpacity: 'opacity-55',
		badgeBg: 'bg-[rgba(16,208,120,0.1)]',
		badgeBorder: 'border-[rgba(16,208,120,0.22)]',
		iconColor: 'text-cc-mint',
		labelColor: 'text-cc-text-secondary',
		labelWeight: 'font-semibold',
	},
	'emerald-active': {
		wrapperOpacity: 'opacity-100',
		badgeBg: 'bg-[rgba(16,208,120,0.18)]',
		badgeBorder: 'border-[rgba(16,208,120,0.45)]',
		badgeGlow: 'shadow-[0_0_12px_rgba(16,208,120,0.45),0_0_28px_rgba(16,208,120,0.2)]',
		iconColor: 'text-cc-accent',
		labelColor: 'text-white',
		labelWeight: 'font-bold',
	},
	'amber-faded': {
		wrapperOpacity: 'opacity-55',
		badgeBg: 'bg-[rgba(245,197,24,0.1)]',
		badgeBorder: 'border-[rgba(245,197,24,0.22)]',
		iconColor: 'text-[rgba(245,197,24,0.95)]',
		labelColor: 'text-cc-text-secondary',
		labelWeight: 'font-semibold',
	},
	'green-last': {
		wrapperOpacity: 'opacity-30',
		badgeBg: 'bg-[rgba(16,208,120,0.07)]',
		badgeBorder: 'border-[rgba(16,208,120,0.15)]',
		iconColor: 'text-cc-mint',
		labelColor: 'text-cc-text-secondary',
		labelWeight: 'font-semibold',
	},
}

export default function EnforceScriptingVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden px-5 py-6 md:px-6 md:py-7'>
			<div className='relative'>
				{/* Vertical rail — neutral 1px hairline anchored at the badge
				 * centerline (left:13px == 26/2). Inset 13px top/bottom to
				 * match Figma 93:17387 (rail y=13, height=193 inside 219). */}
				<span
					aria-hidden='true'
					className='absolute left-[13px] top-[13px] bottom-[13px] w-px bg-white/[0.07]'
				/>
				<ul className='relative flex flex-col'>
					{STEPS.map((step) => {
						const tone = TONE[step.tone]
						const Icon = step.Icon
						return (
							<li key={step.label} className={`relative flex items-start gap-2.5 py-2 ${tone.wrapperOpacity}`}>
								<div
									className={`relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border ${tone.badgeBg} ${tone.badgeBorder} ${tone.badgeGlow ?? ''}`}
								>
									<Icon size={14} weight='fill' className={tone.iconColor} aria-hidden='true' />
								</div>
								<div className='flex min-w-0 flex-1 flex-col gap-0.5 leading-none pt-1.5'>
									<span className={`text-trim text-[11px] leading-[1.3] ${tone.labelWeight} ${tone.labelColor}`}>
										{step.label}
									</span>
									{step.sub && (
										<span className='text-trim text-[10px] leading-[1.3] font-medium text-cc-mint'>
											{step.sub}
										</span>
									)}
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
