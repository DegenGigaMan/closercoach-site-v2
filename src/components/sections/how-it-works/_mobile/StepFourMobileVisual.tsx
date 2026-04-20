/** @fileoverview Step 4 Review mobile visual. Simplified composition for <lg viewports.
 *
 * Applies W5 agent's 6-decision mobile scoping:
 *   1. Stacked scorecards (Practice above Real Call, not side-by-side)
 *   2. Horizontal metric pills above (tabs collapsed from vertical desktop stack)
 *   3. Uncoupled transcript + deep-drill (stacked vertical, not grid-3-col)
 *   4. Wrapped stats row in AI Coach summary
 *   5. Delta arrow rotates vertical (between stacked cards, not horizontal)
 *   6. Gentler pacing via shorter cascade delays appropriate for mobile reading
 *
 * Authority:
 *   - Desktop reference: ../StepFourVisual.tsx (vocabulary source, NOT replicated)
 *   - W5 DD: vault/clients/closer-coach/reviews/dd-s3-w5-2026-04-19.md (mobile scoping)
 *   - Shared vocab: ../_shared/step-visual-defaults.ts
 *   - R7 v3 D9: mobile is first-class, not a collapsed desktop
 *
 * Motion: entrance fade-up + vertical delta-arrow draw + card cascade.
 * F38/F39 stable-initial pattern. Reduced-motion collapses via transition.duration: 0.
 *
 * F59 body-white + F58 opacity-gated arrow patterns carry forward from desktop
 * W5.1 (viewport-agnostic). */

'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { CARD_SHADOW, KICKER_MONO_EMERALD, KICKER_MONO_MUTED, THREAD_EASE } from '../_shared/step-visual-defaults'

const ACTIVE_METRIC = 'Objection Handling'
const METRIC_PILLS = ['Discovery', 'Pitch', 'Objection Handling', 'Closing'] as const

const TRANSCRIPT_YOU = 'We have integrations with everyone. I can send you docs.'
const TRANSCRIPT_COACHED = 'Which integration broke first when you tried it before?'

export default function StepFourMobileVisual() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.4, once: true })

	return (
		<motion.div
			ref={ref}
			className={`flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-cc-surface-card/80 p-3 ${CARD_SHADOW}`}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: THREAD_EASE }}
		>
			{/* Horizontal metric pills (collapsed from vertical desktop tab stack). */}
			<div
				role="tablist"
				aria-label="Scorecard metric"
				className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-0.5"
			>
				{METRIC_PILLS.map((pill) => {
					const isActive = pill === ACTIVE_METRIC
					return (
						<button
							key={pill}
							type="button"
							role="tab"
							aria-selected={isActive}
							tabIndex={isActive ? 0 : -1}
							className={`shrink-0 rounded-full border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.1em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60 ${
								isActive
									? 'border-cc-accent/40 bg-cc-accent/10 text-cc-accent'
									: 'border-white/[0.08] bg-white/[0.02] text-cc-text-muted'
							}`}
						>
							{pill}
						</button>
					)
				})}
			</div>

			{/* Stacked scorecards (Practice above Real Call) + vertical delta arrow between. */}
			<div className="flex flex-col items-center gap-1">
				<ScorecardRow
					label="Practice"
					grade="C+"
					subLabel="Oct 14"
					variant="practice"
					revealed={inView}
					prefersReducedMotion={prefersReducedMotion}
				/>
				<VerticalDeltaArrow drawn={inView} prefersReducedMotion={prefersReducedMotion} />
				<ScorecardRow
					label="Real Call"
					grade="A-"
					subLabel="Apex, Oct 21"
					variant="real"
					revealed={inView}
					prefersReducedMotion={prefersReducedMotion}
				/>
			</div>

			{/* Transcript pair stacked (YOU SAID above COACHED RESPONSE). */}
			<div className="flex flex-col gap-1.5">
				<motion.div
					className="flex flex-col gap-0.5 rounded-lg border border-white/[0.08] bg-cc-surface/60 p-2"
					initial={{ opacity: 0, y: 4 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.5 }}
				>
					<span className={`${KICKER_MONO_MUTED} text-[8.5px]`}>You Said</span>
					<p className="text-[11px] leading-[1.4] text-white">{TRANSCRIPT_YOU}</p>
				</motion.div>
				<motion.div
					className="flex flex-col gap-0.5 rounded-lg border border-cc-accent/20 bg-cc-accent/[0.06] p-2"
					initial={{ opacity: 0, y: 4 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.65 }}
				>
					<span className={`${KICKER_MONO_EMERALD} text-[8.5px]`}>Coached Response</span>
					<p className="text-[11px] leading-[1.4] text-white">{TRANSCRIPT_COACHED}</p>
				</motion.div>
			</div>

			{/* AI Coach summary with wrapped stats row. */}
			<motion.div
				className="flex flex-col gap-1 rounded-lg border border-white/[0.08] bg-cc-foundation/60 p-2"
				initial={{ opacity: 0, y: 6 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: THREAD_EASE, delay: 0.85 }}
			>
				<div className="flex items-center gap-1.5">
					<span className="flex h-4 w-4 items-center justify-center rounded-full border border-cc-accent/30 bg-cc-accent/10 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-cc-accent">
						AI
					</span>
					<span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-text-muted">
						AI Coach Summary
					</span>
				</div>
				<p className="text-[11px] leading-[1.35] text-white">
					<span className="font-semibold text-cc-accent">B grade.</span>
					{' Top 15% this week.'}
				</p>
				{/* Stats: explicit flex-wrap for narrow viewports.
				 * F60 (W6): aria-labels parity with desktop StepFourVisual so the
				 * stats row announces full semantic content to screen readers.
				 * F64-extended (W6): stats row 9.5px -> 10px for readability floor. */}
				<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-text-secondary">
					<span aria-label="211 words per minute">211 WPM</span>
					<span aria-hidden="true" className="text-cc-text-muted">/</span>
					<span aria-label="64 percent talk, 36 percent listen ratio">
						<span aria-hidden="true">
							64 / 36
							<span className="text-cc-text-muted"> talk-listen</span>
						</span>
					</span>
				</div>
			</motion.div>
		</motion.div>
	)
}

/* Scorecard row: grade-ring circle + label column. Ring draw + letter-spring
 * reveal echo the desktop ScorecardPanel vocabulary at mobile scale. */
function ScorecardRow({ label, grade, subLabel, variant, revealed, prefersReducedMotion }: {
	label: string
	grade: string
	subLabel: string
	variant: 'practice' | 'real'
	revealed: boolean
	prefersReducedMotion: boolean
}) {
	const isReal = variant === 'real'
	const ringColor = isReal ? '#10B981' : '#F59E0B'
	const letterColor = isReal ? 'text-cc-accent' : 'text-cc-amber'
	const kickerClass = isReal ? KICKER_MONO_EMERALD : KICKER_MONO_MUTED
	const fill = isReal ? 0.88 : 0.52
	const C = 2 * Math.PI * 20
	return (
		<motion.div
			data-scorecard-variant={variant}
			className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-cc-surface/70 px-3 py-2"
			initial={{ opacity: 0, y: 6 }}
			animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24, delay: isReal ? 0.3 : 0.1 }}
		>
			<div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
				<svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
					<circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
					<motion.circle
						cx="22" cy="22" r="20" fill="none"
						stroke={ringColor} strokeWidth="2.5" strokeLinecap="round"
						strokeDasharray={C}
						initial={{ strokeDashoffset: C }}
						animate={{ strokeDashoffset: revealed ? C * (1 - fill) : C }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: THREAD_EASE, delay: isReal ? 0.5 : 0.25 }}
						style={{ transformOrigin: '22px 22px', transform: 'rotate(-90deg)' }}
					/>
				</svg>
				<motion.span
					className={`absolute font-[family-name:var(--font-heading)] text-[18px] leading-none ${letterColor}`}
					aria-label={`${label} grade ${grade}`}
					initial={{ opacity: 0, scale: 0.5 }}
					animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
					transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18, delay: isReal ? 0.75 : 0.5 }}
				>
					{grade}
				</motion.span>
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className={`${kickerClass} text-[9px]`}>{label}</span>
				<span className="truncate font-[family-name:var(--font-mono)] text-[9px] text-cc-text-muted tabular-nums">{subLabel}</span>
			</div>
		</motion.div>
	)
}

/* Vertical delta arrow (rotated 90deg from desktop horizontal). F58 opacity
 * gate prevents stroke-linecap dot artifacts pre-draw; carries forward from W5.1. */
function VerticalDeltaArrow({ drawn, prefersReducedMotion }: { drawn: boolean; prefersReducedMotion: boolean }) {
	return (
		<motion.div
			aria-hidden="true" data-arrow-drawn={drawn}
			className="pointer-events-none flex flex-col items-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: drawn ? 1 : 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut', delay: 0.4 }}
		>
			<svg width="24" height="20" viewBox="0 0 24 20" className="overflow-visible">
				<motion.path d="M 12 2 L 12 16" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"
					initial={{ pathLength: 0 }} animate={{ pathLength: drawn ? 1 : 0 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: THREAD_EASE, delay: 0.45 }} />
				<motion.path d="M 7 12 L 12 17 L 17 12" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
					initial={{ opacity: 0 }} animate={{ opacity: drawn ? 1 : 0 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, delay: 1.0 }} />
			</svg>
			<span className="inline-flex items-center gap-0.5 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-1.5 py-0 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.1em] text-cc-accent tabular-nums">
				+2 grades
			</span>
		</motion.div>
	)
}
