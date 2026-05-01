/** @fileoverview Proof Connector B. Surface shift strip between S4 Features (dark) and
 * S5 Results (warm). Carries A4 App Store pull quote as the bridge moment.
 *
 * Composition per Q17 Wave E (Andy 2026-04-29 #19) — Variant A locked from
 * /lab/transition-explorations:
 *   1. Solid dark foundation (#0D0F14) carrying the press quote — no gradient
 *      mid-section. Quote reads on a stable dark surface.
 *   2. Hard diagonal seam: SVG polygon transitions to warm (#F5F0EB) along an
 *      asymmetric diagonal (0,100 → 1440,40), producing a sharp editorial cut
 *      rather than a soft gradient mush.
 *   3. Emerald hairline (1px, #10B981 with edge fade) traces the diagonal seam
 *      as a brand-light moment.
 *   4. Centered A4 pull quote in Lora Bold Italic above the diagonal.
 *   5. Attribution line in Geist Mono muted: "App Store Review, 5 stars".
 *
 * Supersedes the prior multi-stop linear-gradient bridge (Andy: "god awful").
 * Lab reference: /lab/transition-explorations Variant A (preserved for record).
 *
 * Motion: single fade-in on viewport entry. Stable initial prop for hydration safety.
 * Reduced-motion collapses transition to 0s (no server/client mismatch). Diagonal
 * strip is 120px mobile / 140px desktop. Proof source: proof-inventory A4. */

'use client'

import { useRef, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/**
 * @description Surface shift strip. Multi-stop gradient from cc-foundation through a
 * mid-tone to cc-warm-light, carrying an A4 pull quote as the temperature bridge.
 * The quote is rendered in Lora Bold Italic (font-heading weight 700 + font-style
 * italic) for emphasis without color variation -- warm surface requires AA contrast
 * compliance and italic alone is sufficient typographic weight.
 */
export default function SectionProofConnectorB(): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement | null>(null)
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

	return (
		<>
			<section
				id='proof-connector-b'
				data-surface='dark-press-quote'
				aria-label='Proof connector bridge'
				className='relative flex items-center justify-center bg-cc-foundation py-20 md:py-24'
			>
				<motion.div
					ref={ref}
					className='mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center'
					initial={{ opacity: 0, y: 12 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
				>
					{/*
					 * PLACEHOLDER QUOTE -- Wave X.4 (2026-04-28)
					 *
					 * Alim 2026-04-28 Slack: 'This could be strong -- [Taylor] can
					 * you give us a better, stronger quote from a client'.
					 *
					 * The block below holds the current A4 App Store pull-quote
					 * (proof-inventory A4, permission-free). Replace this block
					 * with the upgraded client quote from Taylor when it lands.
					 * Source location: TBD with Taylor (likely vault/clients/closer-
					 * coach/copy/proof-inventory.md as a new entry, or a fresh
					 * docs/quotes.md). Update both the <p> body and the attribution
					 * line. Do NOT generate a fake stronger quote; preserve the
					 * current quote until Taylor ships the replacement.
					 */}
					<p
						className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary'
						data-quote-attribution='alim-2026-04-28-stronger-quote-pending'
						aria-label='App Store Review, five stars'
					>
						App Store Review &middot; 5 stars
					</p>

					{/* A4 pull quote. Lora Bold (weight 700) + italic emphasis. White text on
					    solid cc-foundation (#0D0F14) — clean ~16:1 contrast (Wave E). */}
					<p
						className='text-balance text-cc-text-primary'
						data-quote-placeholder='alim-2026-04-28-stronger-quote-pending'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontStyle: 'italic',
							fontSize: 'clamp(1.25rem, 2.8vw, 1.875rem)',
							lineHeight: 1.3,
							letterSpacing: '-0.005em',
						}}
					>
						&ldquo;This app went from something that was a nice idea that needed some work to something that is super useful.&rdquo;
					</p>
				</motion.div>
			</section>
			{/* Straight horizontal seam (Andy 2026-05-01): replaces prior diagonal
			    cut. Both top polygon points share Y=70 (band midpoint) so the warm
			    wedge bottom-half is a flat rectangle. Emerald hairline runs flat
			    across the seam at the same Y. */}
			<div
				aria-hidden='true'
				className='relative h-[120px] overflow-hidden md:h-[140px]'
				data-transition='straight-emerald-hairline'
			>
				{/* Top half: dark foundation */}
				<div className='absolute inset-x-0 top-0 h-full bg-cc-foundation' />
				{/* Bottom half: warm rectangle (flat top edge) */}
				<svg
					className='absolute inset-0 h-full w-full'
					viewBox='0 0 1440 140'
					preserveAspectRatio='none'
				>
					<polygon points='0,140 1440,140 1440,70 0,70' fill='#F5F0EB' />
				</svg>
				{/* Emerald hairline along the flat seam */}
				<svg
					className='pointer-events-none absolute inset-0 h-full w-full'
					viewBox='0 0 1440 140'
					preserveAspectRatio='none'
				>
					<defs>
						<linearGradient id='cc-proof-b-glow' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='#10B981' stopOpacity='0' />
							<stop offset='50%' stopColor='#10B981' stopOpacity='0.85' />
							<stop offset='100%' stopColor='#10B981' stopOpacity='0' />
						</linearGradient>
					</defs>
					<line x1='0' y1='70' x2='1440' y2='70' stroke='url(#cc-proof-b-glow)' strokeWidth='2' />
				</svg>
			</div>
		</>
	)
}
