/** @fileoverview Step 3 Sell mobile visual. Simplified composition for <lg viewports.
 *
 * Not desktop parity. NO phone frame at mobile scale (stripped per R7 v3 D3
 * pragmatic-mobile: the phone motif carries on desktop; mobile echoes via card).
 * Mode toggle pair above a compact "live call" card + 2 annotation chips beside
 * at mobile scale. No full signature-moment choreography.
 *
 * Authority:
 *   - Desktop reference: ../StepThreeVisual.tsx (vocabulary source, NOT replicated)
 *   - Shared vocab: ../_shared/step-visual-defaults.ts
 *   - R7 v3 D9: mobile is first-class, not a collapsed desktop
 *
 * Motion: entrance fade-up + staggered chip reveal. F38/F39 stable-initial pattern.
 * Reduced-motion collapses to the settled frame via transition.duration: 0.
 *
 * Replacement badge intentionally dropped from the mobile visual: left-column
 * body copy already renders it (single source of truth). */

'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { CheckCircle, Microphone, Phone as PhoneIcon, Warning } from '@phosphor-icons/react'
import { CARD_SHADOW, KICKER_MONO_EMERALD, KICKER_MONO_MUTED, THREAD_EASE } from '../_shared/step-visual-defaults'

const TRANSCRIPT_AI = 'We\u2019ve tried tools before. Integration always breaks.'
const TRANSCRIPT_USER = 'What specifically broke last time?'

export default function StepThreeMobileVisual() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.4, once: true })

	return (
		<div ref={ref} className="flex flex-col gap-2">
			{/* Mode toggle row (Phone Call active, Record muted). Static at mobile scale. */}
			<motion.div
				role="tablist"
				aria-label="Call mode"
				className="flex items-center gap-1.5"
				initial={{ opacity: 0, y: 8 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: THREAD_EASE }}
			>
				<span
					role="tab"
					aria-selected="true"
					className="inline-flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-accent/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.15em] text-cc-accent"
				>
					<PhoneIcon size={9} weight="fill" aria-hidden="true" />
					AI Phone Call
				</span>
				<span
					role="tab"
					aria-selected="false"
					className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.15em] text-cc-text-muted"
				>
					<Microphone size={9} weight="fill" aria-hidden="true" />
					Record
				</span>
			</motion.div>

			{/* Live call card. Replaces phone frame at mobile scale. */}
			<motion.div
				className={`flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-cc-surface-card/70 p-3 ${CARD_SHADOW}`}
				initial={{ opacity: 0, y: 12 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: THREAD_EASE, delay: 0.15 }}
			>
				{/* Header row: REC pulse + caller name + timer. */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5">
						<span className="flex h-1.5 w-1.5 items-center justify-center">
							<motion.span
								aria-hidden="true"
								className="block h-1.5 w-1.5 rounded-full bg-cc-score-red"
								initial={{ opacity: 1 }}
								animate={prefersReducedMotion ? { opacity: 1 } : inView ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
								transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
							/>
						</span>
						<span className={`${KICKER_MONO_EMERALD} text-[9px]`}>Live</span>
						<span className="text-[11px] font-medium text-white">Sarah Chen</span>
					</div>
					<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-text-secondary">
						02:38
					</span>
				</div>

				{/* Transcript stub: AI line + user line. */}
				<div className="flex flex-col gap-1 rounded-xl border border-white/[0.05] bg-cc-foundation/60 p-2">
					<p className="text-[11px] italic leading-[1.35] text-cc-text-secondary">
						<span className={`${KICKER_MONO_MUTED} text-[8px] mr-1 not-italic`}>SC</span>
						{TRANSCRIPT_AI}
					</p>
					<p className="text-[11px] italic leading-[1.35] text-white">
						<span className={`${KICKER_MONO_EMERALD} text-[8px] mr-1 not-italic`}>You</span>
						{TRANSCRIPT_USER}
					</p>
				</div>
			</motion.div>

			{/* 2 annotation chips (positive + negative). Compact row. */}
			<div className="flex flex-wrap gap-1.5">
				<motion.span
					className="inline-flex items-center gap-1 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium text-cc-accent"
					initial={{ opacity: 0, y: 4 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.5 }}
				>
					<CheckCircle size={10} weight="fill" aria-hidden="true" />
					Great discovery question
					<span className="font-[family-name:var(--font-mono)] text-[8px] tabular-nums text-cc-accent/70">02:13</span>
				</motion.span>
				<motion.span
					className="inline-flex items-center gap-1 rounded-full border border-cc-score-red/30 bg-cc-score-red/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium text-cc-score-red"
					initial={{ opacity: 0, y: 4 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.7 }}
				>
					<Warning size={10} weight="fill" aria-hidden="true" />
					Rushed the rebuttal
					<span className="font-[family-name:var(--font-mono)] text-[8px] tabular-nums text-cc-score-red/70">03:04</span>
				</motion.span>
			</div>
		</div>
	)
}
