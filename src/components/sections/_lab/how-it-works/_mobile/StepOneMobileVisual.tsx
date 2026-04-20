/** @fileoverview Step 1 Plan mobile visual. Simplified composition for <lg viewports.
 *
 * Not desktop parity. One compact card that sells the plan moment: a small calendar
 * meeting row → emerald enrichment arrow → condensed clone chip with PC1 badge.
 * Single horizontal row grammar, fits within 358px width (390 viewport minus 16*2 padding).
 *
 * Authority:
 *   - Desktop reference: ../StepOneVisual.tsx (vocabulary source, NOT replicated)
 *   - Shared vocab: ../_shared/step-visual-defaults.ts
 *   - R7 v3 D9: mobile is first-class, not a collapsed desktop
 *
 * Motion: entrance fade-up only (no sub-state chain). F38/F39 stable-initial pattern.
 * Reduced-motion collapses to the settled frame via transition.duration: 0. */

'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { CalendarBlank } from '@phosphor-icons/react'
import { CARD_SHADOW, KICKER_MONO_EMERALD, THREAD_EASE } from '../_shared/step-visual-defaults'

export default function StepOneMobileVisual() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.4, once: true })

	return (
		<motion.div
			ref={ref}
			aria-hidden="true"
			className={`flex items-stretch gap-1.5 rounded-2xl border border-white/[0.08] bg-cc-surface-card/70 p-2.5 ${CARD_SHADOW}`}
			/* F39: stable initial across SSR. Reduced-motion collapses via duration 0. */
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: THREAD_EASE }}
		>
			{/* Meeting row: mini calendar glyph + Sarah Chen label. */}
			<div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-cc-accent/[0.08] px-2 py-2">
				<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cc-accent/30 bg-cc-foundation">
					<CalendarBlank size={12} weight="regular" className="text-cc-accent" />
				</span>
				<div className="min-w-0 flex-1">
					<span className="block truncate font-[family-name:var(--font-mono)] text-[8.5px] uppercase tracking-[0.1em] text-cc-text-muted">
						Today 2pm
					</span>
					<span className="block truncate text-[11px] font-medium text-white">
						Sarah Chen
					</span>
				</div>
			</div>

			{/* Enrichment arrow glyph. Compact vertical glyph + kicker. */}
			<div className="flex shrink-0 flex-col items-center justify-center gap-0.5 px-0.5">
				<svg width="18" height="10" viewBox="0 0 18 10" className="overflow-visible">
					<motion.path
						d="M 1 5 Q 9 1 16 5"
						fill="none"
						stroke="#10B981"
						strokeWidth="1.5"
						strokeLinecap="round"
						/* F39: stable initial. Path draw tied to in-view reveal. */
						initial={{ pathLength: 0 }}
						animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: THREAD_EASE, delay: 0.25 }}
					/>
					<motion.path
						d="M 13 2 L 16 5 L 13 8"
						fill="none"
						stroke="#10B981"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : { opacity: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, delay: 0.9 }}
					/>
				</svg>
				<span className={`${KICKER_MONO_EMERALD} text-[7.5px] tracking-[0.1em]`}>Enriched</span>
			</div>

			{/* Clone chip: avatar disc + label + PC1 badge. */}
			<div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border border-cc-accent/20 bg-cc-surface/60 px-2 py-2">
				<div className="flex items-center gap-1.5">
					<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cc-accent/20 font-[family-name:var(--font-mono)] text-[8.5px] font-semibold text-cc-accent">
						SC
					</span>
					<span className="truncate text-[11px] font-medium text-white">AI Clone</span>
				</div>
				<span className="inline-flex w-fit items-center gap-1 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[7.5px] font-medium uppercase tracking-[0.1em] text-cc-accent">
					<span className="flex gap-[1px]">
						<span className="h-[3px] w-[3px] rounded-full bg-cc-accent" />
						<span className="h-[3px] w-[3px] rounded-full bg-cc-accent" />
						<span className="h-[3px] w-[3px] rounded-full bg-cc-accent" />
					</span>
					7 Layers
				</span>
			</div>
		</motion.div>
	)
}
