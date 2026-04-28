/** @fileoverview S6 Card 4 visual — "Enforce New Scripting Efficiently".
 *
 * Composition (per Figma 95-18382, equal-inverted col-span-1 row 2):
 *   ─ Vertical timeline: 5 steps connected by a thin white hairline rail.
 *   ─ Each step: 26px tinted-bg badge with tinted border + label. The
 *     active step adds an emerald glow shadow and an emerald sub-label.
 *   ─ Per-step opacity tiers Figma 0.28 / 0.55 / 1.0 / 0.55 / 0.28 so the
 *     active "Reps drill in roleplay" step is the unmistakable focal
 *     point and the trail of completed/upcoming steps fades out from it.
 *   ─ Icon vocabulary per status:
 *       Step 1 done-old   : blue tint, NotePencil   (script written)
 *       Step 2 done-recent: green tint, PaperPlane  (rolled out)
 *       Step 3 active     : emerald glow, Sparkle   (AI runs the reps)
 *       Step 4 upcoming   : amber tint, Flag        (quota / mastery)
 *       Step 5 last       : faded green, Eye        (manager visibility)
 *
 * Wave T (Figma 95-18382 alignment, 2026-04-27): existing 5-step labels
 * preserved. Visual treatment refined to match Figma -- tinted icon
 * badges replace solid-ring orbs, opacity tiers replace text-color
 * fades, and the rail switches from emerald-gradient to neutral
 * hairline so the active-step emerald glow is the only emerald moment. */

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
		iconColor: 'text-[#9bbcff]',
		labelColor: 'text-[#808880]',
		labelWeight: 'font-semibold',
	},
	'green-faded': {
		wrapperOpacity: 'opacity-55',
		badgeBg: 'bg-[rgba(16,208,120,0.1)]',
		badgeBorder: 'border-[rgba(16,208,120,0.22)]',
		iconColor: 'text-[#10d078]',
		labelColor: 'text-[#808880]',
		labelWeight: 'font-semibold',
	},
	'emerald-active': {
		wrapperOpacity: 'opacity-100',
		badgeBg: 'bg-[rgba(16,208,120,0.15)]',
		badgeBorder: 'border-[rgba(16,208,120,0.4)]',
		badgeGlow: 'shadow-[0_0_8px_rgba(16,208,120,0.35)]',
		iconColor: 'text-cc-accent',
		labelColor: 'text-[#efefef]',
		labelWeight: 'font-bold',
	},
	'amber-faded': {
		wrapperOpacity: 'opacity-55',
		badgeBg: 'bg-[rgba(245,197,24,0.1)]',
		badgeBorder: 'border-[rgba(245,197,24,0.22)]',
		iconColor: 'text-[#f5c518]',
		labelColor: 'text-[#808880]',
		labelWeight: 'font-semibold',
	},
	'green-last': {
		wrapperOpacity: 'opacity-30',
		badgeBg: 'bg-[rgba(16,208,120,0.07)]',
		badgeBorder: 'border-[rgba(16,208,120,0.15)]',
		iconColor: 'text-[#10d078]',
		labelColor: 'text-[#808880]',
		labelWeight: 'font-semibold',
	},
}

export default function EnforceScriptingVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden bg-cc-foundation px-5 py-6 md:px-6 md:py-7'>
			<div className='relative'>
				{/* Vertical rail — neutral hairline aligned with icon-badge
				 * center (13px from left). Active step's emerald glow on its
				 * badge is the only color moment so the eye lands there. */}
				<span
					aria-hidden='true'
					className='absolute left-[13px] top-3 bottom-3 w-px bg-white/[0.07]'
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
										<span className='text-trim text-[10px] leading-[1.3] font-medium text-[#10d078]'>
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
