/** @fileoverview Shared MotionCTA component with spring physics for hover/tap.
 * Replaces CSS transition-all hover:scale on all CTA buttons.
 * Physics: whileHover spring 400/17, whileTap spring 600/20 (per component-variant-matrix). */

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
	/** Override bg for warm surfaces (e.g. accent-hover for WCAG) */
	warmSurface?: boolean
}

const sizeStyles: Record<Size, string> = {
	lg: 'h-[54px] px-8 text-lg font-semibold',
	md: 'h-[44px] px-8 text-base font-semibold',
	sm: 'h-[36px] px-4 text-sm font-medium',
}

const variantStyles: Record<Variant, string> = {
	primary: 'bg-cc-accent text-white hover:bg-cc-accent-hover',
	secondary: 'border border-cc-accent text-cc-accent hover:border-cc-accent-hover hover:bg-cc-accent/5',
	ghost: 'text-cc-accent hover:text-cc-accent-hover hover:underline',
}

/**
 * @description Spring-animated CTA button using Motion whileHover/whileTap.
 * Hover: scale 1.02, spring 400/17 (responsive). Tap: scale 0.98, spring 600/20 (snappy).
 * Glow shadow on hover for primary/secondary. Focus-visible ring for accessibility.
 */
export default function MotionCTA({
	href,
	variant = 'primary',
	size = 'md',
	children,
	className = '',
	warmSurface = false,
}: MotionCTAProps) {
	const base = 'inline-flex items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-cc-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'

	const warmOverride = warmSurface && variant === 'primary'
		? 'bg-cc-accent-hover text-white hover:bg-cc-accent-hover'
		: ''

	return (
		<MotionLink
			href={href}
			className={`${base} ${sizeStyles[size]} ${warmOverride || variantStyles[variant]} ${className}`}
			whileHover={{
				scale: 1.02,
				boxShadow: variant !== 'ghost' ? '0 0 32px rgba(16,185,129,0.15)' : undefined,
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
