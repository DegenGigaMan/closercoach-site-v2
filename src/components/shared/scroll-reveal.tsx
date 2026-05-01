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
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, ...directionOffset[direction] }}
			animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
			/* Wave Y.8 (Alim 2026-04-28): duration 0.6 -> 0.72 (+20%). Wave
			 * X.1 paced Hero (0.5 -> 0.85); Wave Y.8 brings the rest of the
			 * site's section-level scroll reveals into the same one-thing-at-
			 * a-time rhythm without overshooting Hero's envelope. */
			transition={{ duration: 1.44, delay: delay * 2, ease: EASE }}
		>
			{children}
		</motion.div>
	)
}
