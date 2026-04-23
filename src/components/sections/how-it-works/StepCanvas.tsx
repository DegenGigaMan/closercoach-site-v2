/** @fileoverview Shared visual anchor container for Section 3 "How It Works" step visuals (Steps 1-4).
 *
 * All four right-column step visuals (StepOneVisual through StepFourVisual) render
 * INSIDE a single StepCanvas in SectionHowItWorks. The canvas provides:
 *   - Rounded container (rounded-3xl) that clips internal visuals at its edges
 *   - Subtle border (border-white/10) consistent across all 4 steps
 *   - Radial-gradient background matching Figma node 1:10313 S3 Step 1 desktop:
 *     darker at edges (#0C0E13), slightly lifted in the center (#1E2230 -> #151822 -> #0C0E13).
 *   - Desktop aspect ratio anchored to the Figma design (714x600, ratio 1.19:1).
 *     Height is constrained to h-[600px] when the outer sticky slot provides room.
 *
 * Children render with ZERO padding from this container; each step visual handles
 * its own internal padding. `overflow-hidden` ensures inner visuals clip cleanly
 * at the rounded edges (e.g., the clone card drop shadow, the connector SVG).
 *
 * Authority:
 *   - Figma reference: file fLZECQP0aetUwhj9ZHLJ6S, node 1:10313 (S3 Step 1 Desktop)
 *   - Visual direction: vault/clients/closer-coach/research/r7-visual-direction.md
 *
 * @description Shared canvas anchor for all 4 step visuals.
 * @param children - The step visual to render inside the canvas.
 * @param className - Optional Tailwind class override (e.g., to adjust desktop height).
 */

import type { ReactNode } from 'react'

type Props = {
	children: ReactNode
	className?: string
}

const BASE = [
	'relative w-full overflow-hidden rounded-3xl border border-white/10',
	'h-full max-h-[600px]',
	/* Radial-gradient emulating Figma fill on node 1:10313. Center is the lifted
	 * #1E2230 card-surface tone, transitioning through a mid #151822, then
	 * settling into the darker #0C0E13 at the edges. The gradient is anchored at
	 * 50% 45% so the "pool of light" sits slightly above geometric center,
	 * matching the composition's upper-heavy weight (calendar card + clone card
	 * top-aligned). */
	'bg-[radial-gradient(ellipse_at_50%_45%,#1E2230_0%,#151822_45%,#0C0E13_100%)]',
].join(' ')

export default function StepCanvas({ children, className = '' }: Props) {
	return (
		<div className={`${BASE} ${className}`.trim()} data-cc-step-canvas="true">
			{children}
		</div>
	)
}
