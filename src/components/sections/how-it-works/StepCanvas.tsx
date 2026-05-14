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
