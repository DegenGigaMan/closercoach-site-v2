/** @fileoverview S3 Step Indicator: vertical emerald spine + scroll-linked traveling pulse.
 *
 * Geometry: the spine is absolutely positioned inside the split container
 * between `top: var(--cc-rail-top)` (first step dot center) and
 * `bottom: var(--cc-rail-bottom)` (last step dot center). The scroll-linked
 * pulse uses the SPINE itself as its useScroll target with
 * `['start center', 'end center']`. Mathematical consequence: the pulse's
 * absolute viewport position stays pinned at viewport center as the user
 * scrolls, while each step dot passes THROUGH that pinned pulse position as
 * the corresponding step arrives at viewport center. Using the outer split
 * container as the scroll target (prior implementation) caused the pulse to
 * drift off the top of the viewport around Step 3 because the container's
 * total scroll range exceeds the rail's own range.
 *
 * Per-step numbered dots are rendered inside each StepKicker (not here) so
 * they anchor to each step room's kicker position. Respects
 * prefers-reduced-motion: pulse pins at 0%, no travel. */

'use client'

import { useRef, useSyncExternalStore } from 'react'
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

/**
 * @description Emerald spine + scroll-linked pulse. Renders absolutely inside the
 * split container, cropped vertically so it starts/ends at the first and last
 * step kicker dot centers. Pulse target is the spine itself so the pulse pins
 * at viewport center while step dots travel through it.
 */
export default function StepIndicator() {
	const railRef = useRef<HTMLDivElement>(null)

	/* Normalize to boolean: useReducedMotion returns null on SSR and true/false
	 * on client. `?? false` picks the motion branch as the shared default. */
	const prefersReducedMotion = useReducedMotion() ?? false
	const mounted = useMounted()
	const showPulseDot = mounted && !prefersReducedMotion

	const { scrollYProgress } = useScroll({
		target: railRef,
		offset: ['start center', 'end center'],
	})

	const pulseY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

	return (
		<div
			ref={railRef}
			className='pointer-events-none absolute left-5 top-[var(--cc-rail-top)] z-10 hidden lg:block'
			style={{ bottom: 'var(--cc-rail-bottom)' }}
			aria-hidden='true'
		>
			<div className='relative h-full w-px'>
				<div className='absolute inset-y-0 w-px bg-cc-accent/20' />
				<motion.div
					className='absolute top-0 w-px bg-cc-accent/80'
					style={{ height: pulseY }}
				/>
				{showPulseDot && (
					<motion.div
						className='absolute left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-cc-accent'
						style={{
							top: pulseY,
							boxShadow: '0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.35)',
						}}
					/>
				)}
			</div>
		</div>
	)
}
