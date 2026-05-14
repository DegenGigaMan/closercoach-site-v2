'use client'

import { useRef, useSyncExternalStore } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

function subscribeNoop() { return () => {} }
function useMounted(): boolean {
	return useSyncExternalStore(subscribeNoop, () => true, () => false)
}

export interface StepMeta {
	number: string
	label: string
}

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
