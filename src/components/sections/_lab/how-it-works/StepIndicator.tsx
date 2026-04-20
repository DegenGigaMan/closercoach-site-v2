/** @fileoverview S3 Step Indicator: vertical emerald thread + 4 numbered markers + scroll-linked traveling pulse.
 * - Spine = 1px vertical line. Color states: unvisited 20% / passed 80% / active 100%.
 * - Markers = 40x40 circles at [01] [02] [03] [04]. Inactive bordered / active filled with glow / passed filled solid.
 * - Pulse = small emerald dot that maps scroll progress to vertical position along the spine.
 * - Respects prefers-reduced-motion: pulse pins to active marker, no travel. */

'use client'

import { useSyncExternalStore, type RefObject } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

/* SSR-safe mount flag. SSR snapshot is false; client snapshot flips true only
 * AFTER hydration completes. Used to gate any conditional render that depends
 * on browser-only state (media queries, useReducedMotion) so first client
 * paint matches the server HTML exactly. F33 StepIndicator hydration fix. */
function subscribeNoop() { return () => {} }
function useMounted(): boolean {
	return useSyncExternalStore(subscribeNoop, () => true, () => false)
}

export interface StepMeta {
	number: string
	label: string
}

interface StepIndicatorProps {
	steps: readonly StepMeta[]
	activeStep: number
	containerRef: RefObject<HTMLElement | null>
}

/**
 * @description Emerald thread spine with numbered markers and scroll-linked pulse.
 * Renders absolutely inside the parent split container. The markers align vertically
 * with each step room's visual anchor via equal flex distribution.
 */
export default function StepIndicator({ steps, activeStep, containerRef }: StepIndicatorProps) {
	/* Normalize to boolean: useReducedMotion returns null on SSR and true/false
	 * on client. `?? false` picks the motion branch as the shared default. */
	const prefersReducedMotion = useReducedMotion() ?? false
	/* Gate the conditional pulse-dot render behind mount so SSR and first client
	 * paint produce identical DOM. Only after hydration can prefersReducedMotion
	 * flip the pulse dot off. F33 fix. */
	const mounted = useMounted()
	const showPulseDot = mounted && !prefersReducedMotion

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start center', 'end center'],
	})

	const pulseY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

	return (
		<div className="pointer-events-none absolute inset-y-0 left-5 z-10 hidden lg:block" aria-hidden="true">
			<div className="relative flex h-full flex-col items-center">
				<div className="absolute inset-y-0 w-px bg-cc-accent/20" />
				<motion.div
					className="absolute top-0 w-px bg-cc-accent/80"
					style={{ height: pulseY }}
				/>
				{showPulseDot && (
					<motion.div
						className="absolute left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-cc-accent"
						style={{
							top: pulseY,
							boxShadow: '0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.35)',
						}}
					/>
				)}
				<div className="relative flex h-full flex-col justify-around py-[10vh]">
					{steps.map((step, i) => {
						const stepNum = i + 1
						const isActive = activeStep === stepNum
						const isPassed = activeStep > stepNum
						return (
							<Marker
								key={step.number}
								number={step.number}
								isActive={isActive}
								isPassed={isPassed}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

function Marker({
	number,
	isActive,
	isPassed,
}: {
	number: string
	isActive: boolean
	isPassed: boolean
}) {
	const filled = isActive || isPassed
	return (
		<div
			className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-[family-name:var(--font-mono)] text-[13px] font-medium"
			style={{
				backgroundColor: filled ? 'var(--color-cc-accent)' : 'var(--color-cc-foundation)',
				borderColor: filled ? 'var(--color-cc-accent)' : 'rgba(16,185,129,0.5)',
				color: filled ? 'var(--color-cc-foundation)' : 'rgba(16,185,129,0.85)',
				boxShadow: isActive
					? '0 0 16px rgba(16,185,129,0.45), 0 0 32px rgba(16,185,129,0.2)'
					: undefined,
				transition: 'background-color 0.4s ease-out, border-color 0.4s ease-out, color 0.4s ease-out, box-shadow 0.4s ease-out',
			}}
		>
			{number}
		</div>
	)
}
