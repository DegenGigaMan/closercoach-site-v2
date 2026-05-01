/** @fileoverview Reusable scroll-reveal wrapper. Fades and slides children into view
 * on scroll. Configurable direction (up/down/left/right/none) and delay.
 * Uses Motion useInView. Respects prefers-reduced-motion via Motion defaults. */

'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface ScrollRevealProps {
	children: ReactNode
	className?: string
	delay?: number
	direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const directionOffset = {
	up: { y: 24 },
	down: { y: -24 },
	left: { x: 24 },
	right: { x: -24 },
	none: {},
}

/**
 * @description Wraps children in a motion.div that fades/slides in when scrolled
 * into view. Direction controls initial offset. Triggers once at -10% margin.
 */
export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: ScrollRevealProps) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, ...directionOffset[direction] }}
			animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
			/* Phase 8 (Andy 2026-05-01): entrance reveals were too slow and
			 * fired too late ("scrolling halfway through section before the
			 * animations appear"). Cut duration 1.44 -> 0.55 and dropped the
			 * x2 delay multiplier so cascades feel snappy. Tightened margin
			 * '-10% 0px' -> '0px' so reveals fire as the section enters
			 * viewport, not 10% past. In-asset choreography (Step 1 cloning
			 * lab, Step 3 live-call panel, hero phone state cycling, scoring
			 * widgets) untouched. */
			transition={{ duration: 0.55, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	)
}
