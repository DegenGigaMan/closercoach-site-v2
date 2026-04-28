/** @fileoverview Proof Connector B. Surface shift strip between S4 Features (dark) and
 * S5 Results (warm). Carries A4 App Store pull quote as the bridge moment.
 *
 * Composition per section-blueprint v2 Proof Connector B:
 *   1. Multi-stop dark-to-warm vertical gradient (architectural shift, Stripe-style).
 *   2. Centered A4 pull quote in Lora Bold Italic, large readable size.
 *   3. Attribution line in Geist Mono muted: "App Store Review, 5 stars".
 *
 * Motion: single fade-in on viewport entry. Stable initial prop for hydration safety.
 * Reduced-motion collapses transition to 0s (no server/client mismatch). Height ~140px
 * mobile / ~160px desktop. Proof source: proof-inventory A4 (permission-free). */

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
		<section
			id='proof-connector-b'
			data-surface='shift-dark-warm'
			aria-label='Proof connector bridge'
			className='relative flex items-center justify-center py-12 md:py-16'
			style={{
				background:
					'linear-gradient(180deg, #0D0F14 0%, #0D0F14 18%, #1A1D26 42%, #4A443E 62%, #D8CFC2 82%, #F5F0EB 100%)',
			}}
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

				{/* Attribution moved ABOVE the quote (Wave X.7 / DD R1 M1, 2026-04-28).
				    Previously sat below the quote where the gradient transitions from
				    cc-surface (#1A1D26) into the warm mid-tone (#4A443E) -- mid-grey
				    text on that brown band failed WCAG AA (~3.7:1). Above the quote
				    the attribution sits on solid cc-surface, giving cc-text-secondary
				    (#94A3B8) on #1A1D26 a clean ~6.4:1 ratio. Standard tombstone-
				    quote ordering (source then quote body). */}
				<p
					className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary'
					data-quote-attribution='alim-2026-04-28-stronger-quote-pending'
					aria-label='App Store Review, five stars'
				>
					App Store Review &middot; 5 stars
				</p>

				{/* A4 pull quote. Lora Bold (weight 700) + italic emphasis. White text for
				    contrast against the dark-to-mid gradient mid-range where the quote sits. */}
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
	)
}
