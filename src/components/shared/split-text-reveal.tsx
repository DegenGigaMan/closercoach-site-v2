/** @fileoverview Reusable split-text reveal animation. Splits text into words and
 * animates each in on scroll with staggered timing. Uses Motion useInView for
 * scroll-triggered entry. Respects prefers-reduced-motion via Motion defaults. */

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface SplitTextRevealProps {
	children: string
	className?: string
	delay?: number
}

/**
 * @description Splits children string into words, each wrapped in an overflow-hidden
 * container. Words animate in from below with staggered 0.03s delay per word.
 * Triggers once when 90% of element enters viewport.
 */
export default function SplitTextReveal({ children, className = '', delay = 0 }: SplitTextRevealProps) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
	const words = children.split(' ')

	return (
		<span ref={ref} className={`inline-block ${className}`}>
			{words.map((word, i) => (
				<span key={i} className="inline-block overflow-hidden">
					<motion.span
						className="inline-block"
						initial={{ y: '100%', opacity: 0 }}
						animate={isInView ? { y: 0, opacity: 1 } : {}}
						transition={{
							duration: 0.7,
							delay: delay + i * 0.06,
							ease: EASE,
						}}
					>
						{word}&nbsp;
					</motion.span>
				</span>
			))}
		</span>
	)
}
