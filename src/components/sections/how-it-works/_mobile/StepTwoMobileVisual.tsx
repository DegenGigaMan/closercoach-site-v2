/** @fileoverview Step 2 Practice mobile visual. Simplified composition for <lg viewports.
 *
 * Not desktop parity. One compact card that sells the practice moment: one AI
 * objection bubble + one user response bubble + horizontal interest-meter bar +
 * inline readiness gauge number. Vertical interest meter is rotated to horizontal
 * per W5 agent's mobile scoping note.
 *
 * Authority:
 *   - Desktop reference: ../StepTwoVisual.tsx (vocabulary source, NOT replicated)
 *   - Shared vocab: ../_shared/step-visual-defaults.ts
 *   - R7 v3 D9: mobile is first-class, not a collapsed desktop
 *
 * Motion: entrance fade-up + bubble cascade. F38/F39 stable-initial pattern.
 * Reduced-motion collapses to the settled frame via transition.duration: 0. */

'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { CARD_SHADOW, KICKER_MONO_EMERALD, KICKER_MONO_MUTED, THREAD_EASE } from '../_shared/step-visual-defaults'

const AI_LINE = 'We\u2019ve tried tools before. Integration always breaks.'
const USER_LINE = 'What specifically broke last time?'
const INTEREST_PCT = 72
const READY_PCT = 72

export default function StepTwoMobileVisual() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.4, once: true })

	return (
		<motion.div
			ref={ref}
			className={`flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-cc-surface-card/70 p-3 ${CARD_SHADOW}`}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: THREAD_EASE }}
		>
			{/* AI objection bubble + user response bubble (stacked). */}
			<div className="flex flex-col gap-1.5">
				<div className="flex items-start gap-1.5">
					<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cc-accent/20 font-[family-name:var(--font-mono)] text-[9px] font-semibold text-cc-accent">
						SC
					</span>
					<motion.div
						className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/[0.08] bg-cc-surface/60 px-2.5 py-1.5"
						initial={{ opacity: 0, x: -6 }}
						animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: THREAD_EASE, delay: 0.2 }}
					>
						<p className="text-[11.5px] leading-[1.35] text-white">{AI_LINE}</p>
					</motion.div>
				</div>
				<motion.div
					className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm border border-cc-accent/20 bg-cc-accent/[0.06] px-2.5 py-1.5"
					initial={{ opacity: 0, x: 6 }}
					animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 6 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: THREAD_EASE, delay: 0.55 }}
				>
					<p className="text-[11.5px] leading-[1.35] text-white">{USER_LINE}</p>
				</motion.div>
			</div>

			{/* Horizontal interest meter bar (rotated from vertical desktop version). */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<span className={`${KICKER_MONO_MUTED} text-[9px]`}>Buyer Interest</span>
					<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-accent">
						{INTEREST_PCT}%
					</span>
				</div>
				<div className="h-[4px] w-full overflow-hidden rounded-full bg-cc-surface-border">
					<motion.span
						aria-hidden="true"
						className="block h-full rounded-full bg-cc-accent"
						style={{ boxShadow: '0 0 6px rgba(16,185,129,0.45)' }}
						initial={{ width: '50%' }}
						animate={inView ? { width: `${INTEREST_PCT}%` } : { width: '50%' }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, ease: THREAD_EASE, delay: 0.7 }}
					/>
				</div>
			</div>

			{/* Readiness inline: small gauge dot + "READY" label + stat. */}
			<div className="flex items-center gap-2 rounded-full border border-cc-accent/20 bg-cc-foundation/60 px-2.5 py-1.5">
				<span className="relative flex h-3.5 w-3.5 items-center justify-center">
					<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
						<circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
						<motion.circle
							cx="7"
							cy="7"
							r="5.5"
							fill="none"
							stroke="#10B981"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeDasharray={2 * Math.PI * 5.5}
							initial={{ strokeDashoffset: 2 * Math.PI * 5.5 }}
							animate={inView ? { strokeDashoffset: 2 * Math.PI * 5.5 * (1 - READY_PCT / 100) } : { strokeDashoffset: 2 * Math.PI * 5.5 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: THREAD_EASE, delay: 0.9 }}
							style={{ transformOrigin: '7px 7px', transform: 'rotate(-90deg)' }}
						/>
					</svg>
				</span>
				<span className={`${KICKER_MONO_EMERALD} text-[9px]`}>Ready For The Real Call</span>
			</div>
		</motion.div>
	)
}
