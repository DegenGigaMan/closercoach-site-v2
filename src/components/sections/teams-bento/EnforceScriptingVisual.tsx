/** @fileoverview S6 Card 4 visual — "Enforce New Scripting Efficiently".
 *
 * Composition (per Figma 81-5069, equal col-span-1 row 2):
 *   ─ Vertical timeline: 5 steps connected by an emerald rail on the left.
 *   ─ Step icons (small dot rings) sit on the rail. Each step has a label.
 *   ─ Steps 1-2 are completed (dim emerald check ring + dim text).
 *   ─ Step 3 "Reps drill in roleplay" is ACTIVE (filled emerald sparkle ring
 *     + bold white label + emerald sub-label "AI runs every rep until fluent").
 *   ─ Step 4 "Mastery confirmed" carries an amber checkered icon (the
 *     measurement moment).
 *   ─ Step 5 "Manager sees it's done" is upcoming (dim).
 *
 * The emerald rail fades from solid (top, completed) through bright (active)
 * to dim (upcoming). */

'use client'

import type { ReactElement } from 'react'
import { Check, Sparkle } from '@phosphor-icons/react'

type StepStatus = 'done' | 'active' | 'mastery' | 'upcoming'

type Step = {
	label: string
	sub?: string
	status: StepStatus
}

const STEPS: readonly Step[] = [
	{ label: 'New talk track created', status: 'done' },
	{ label: 'Pushed to whole team', status: 'done' },
	{ label: 'Reps drill in roleplay', sub: 'AI runs every rep until fluent', status: 'active' },
	{ label: 'Mastery confirmed', status: 'mastery' },
	{ label: 'Manager sees it’s done', status: 'upcoming' },
] as const

function StepIcon({ status }: { status: StepStatus }): ReactElement {
	if (status === 'active') {
		return (
			<div className='relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cc-foundation-deep ring-2 ring-cc-accent shadow-[0_0_12px_rgba(16,185,129,0.5)]'>
				<Sparkle size={11} weight='fill' className='text-cc-accent' aria-hidden='true' />
			</div>
		)
	}
	if (status === 'mastery') {
		return (
			<div className='relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cc-foundation-deep ring-1 ring-[#F59E0B]/70'>
				<Check size={11} weight='bold' className='text-[#F59E0B]' aria-hidden='true' />
			</div>
		)
	}
	if (status === 'done') {
		return (
			<div className='relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cc-foundation-deep ring-1 ring-cc-accent/50'>
				<Check size={10} weight='bold' className='text-cc-accent/70' aria-hidden='true' />
			</div>
		)
	}
	return (
		<div className='relative z-10 h-6 w-6 rounded-full bg-cc-foundation-deep ring-1 ring-cc-surface-border' />
	)
}

export default function EnforceScriptingVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden bg-cc-foundation px-5 py-6 md:px-6 md:py-7'>
			<div className='relative pl-1'>
				{/* Vertical rail */}
				<span
					aria-hidden='true'
					className='absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-cc-accent/60 via-cc-accent/40 to-cc-accent/10'
				/>
				<ul className='relative flex flex-col gap-3'>
					{STEPS.map((step) => (
						<li key={step.label} className='relative flex items-start gap-3'>
							<StepIcon status={step.status} />
							<div className='flex min-w-0 flex-1 flex-col leading-none pt-1.5'>
								<span
									className={`text-trim text-[12px] ${
										step.status === 'active'
											? 'font-semibold text-white'
											: step.status === 'upcoming'
												? 'font-medium text-cc-text-secondary/55'
												: 'font-medium text-cc-text-secondary/85'
									}`}
								>
									{step.label}
								</span>
								{step.sub && (
									<span className='text-trim mt-1.5 text-[11px] text-cc-mint'>{step.sub}</span>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
