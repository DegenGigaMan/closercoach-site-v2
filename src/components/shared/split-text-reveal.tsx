'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

interface SplitTextRevealProps {
	children: string
	className?: string
	delay?: number
}

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
							duration: 1.4,
							delay: delay * 2 + i * 0.12,
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
