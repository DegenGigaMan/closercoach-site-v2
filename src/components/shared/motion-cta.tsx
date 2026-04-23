/** @fileoverview Shared MotionCTA component with spring physics for hover/tap.
 * Styling ported from Figma node 62:3120 (CC Visual Assets):
 *   - Primary: pill (rounded-full), bg #34E18E, black text, bold 18px, always-on
 *     emerald glow `0 4px 24px rgba(29,184,104,0.4)`.
 *   - Secondary: pill, bg #0B1314 + border #10B981 + text #34E18E + backdrop-blur-12.
 *   - Ghost: inline emerald text link, no pill.
 * Font stack stays on the v2 lock (Inter body, no Plus Jakarta swap). */

'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

const MotionLink = motion.create(Link)

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'lg' | 'md' | 'sm'

interface MotionCTAProps {
	href: string
	variant?: Variant
	size?: Size
	children: React.ReactNode
	className?: string
	/** Reserved for warm-surface overrides. Figma pill renders identically on both
	 * surfaces (bright emerald + black text + glow stay legible on #F5F0EB). */
	warmSurface?: boolean
}

/* Figma button hits 50px tall at px-6 py-4 text-[18px] leading-[18px]. v2
 * keeps flexible sizes; lg matches Figma closely (~54px). md/sm scale down. */
const sizeStyles: Record<Size, string> = {
	lg: 'h-[54px] px-8 text-[18px] font-bold',
	md: 'h-[44px] px-6 text-base font-bold',
	sm: 'h-[36px] px-4 text-sm font-semibold',
}

/* Always-on glow for primary (Figma spec). Secondary gets a softer halo on
 * hover only. Ghost keeps the underline treatment. */
const variantStyles: Record<Variant, string> = {
	primary:
		'rounded-full bg-[#34E18E] text-cc-foundation shadow-[0_4px_24px_rgba(29,184,104,0.4)] hover:bg-[#34E18E]',
	secondary:
		'rounded-full border border-cc-accent bg-[#0B1314] text-[#34E18E] backdrop-blur-[12px] hover:border-cc-accent-hover hover:bg-[#0B1314]',
	ghost: 'rounded-lg text-cc-accent hover:text-cc-accent-hover hover:underline',
}

/**
 * @description Spring-animated CTA button using Motion whileHover/whileTap.
 * Hover: scale 1.02 + bloomed emerald glow. Tap: scale 0.98.
 */
export default function MotionCTA({
	href,
	variant = 'primary',
	size = 'md',
	children,
	className = '',
}: MotionCTAProps) {
	const base =
		'inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cc-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'

	const hoverShadow =
		variant === 'primary'
			? '0 6px 32px rgba(29,184,104,0.55)'
			: variant === 'secondary'
				? '0 4px 24px rgba(16,185,129,0.25)'
				: undefined

	return (
		<MotionLink
			href={href}
			className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
			whileHover={{
				scale: 1.02,
				boxShadow: hoverShadow,
				transition: { type: 'spring', stiffness: 400, damping: 17 },
			}}
			whileTap={{
				scale: 0.98,
				transition: { type: 'spring', stiffness: 600, damping: 20 },
			}}
		>
			{children}
		</MotionLink>
	)
}
