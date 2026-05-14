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
	/** Reserved for warm-surface overrides. */
	warmSurface?: boolean
	/** Use for Header / chrome CTAs to retain the legacy Inter typography + size-scale. */
	chrome?: boolean
	/** Marks this CTA as a primary conversion CTA. Used by the cookie banner to suppress
	 *  its own visibility while a primary CTA is in viewport. */
	dataPrimaryCta?: boolean
}

/* Legacy size scale (preserved when chrome=true). */
const legacySizeStyles: Record<Size, string> = {
	lg: 'h-[54px] px-8 text-[18px] font-bold',
	md: 'h-[44px] px-6 text-base font-bold',
	sm: 'h-[36px] px-4 text-sm font-semibold',
}

const sitewidePadding = 'px-6 py-4 text-[16px]'

const variantStyles: Record<Variant, string> = {
	primary:
		'rounded-full border border-transparent bg-cc-mint text-cc-foundation shadow-[0_4px_12px_rgba(29,184,104,0.34)] hover:bg-cc-mint',
	secondary:
		'rounded-full border border-cc-accent bg-cc-foundation-deep text-cc-mint backdrop-blur-[12px] hover:border-cc-accent-hover hover:bg-cc-foundation-deep',
	ghost: 'rounded-lg text-cc-accent hover:text-cc-accent-hover hover:underline',
}

const sitewideTypography: Record<Variant, string> = {
	primary: 'font-bold leading-[18px] [font-family:var(--font-cta)] text-trim',
	secondary: 'font-medium leading-[18px] [font-family:var(--font-cta)] text-trim',
	ghost: 'font-semibold leading-[20px] text-trim',
}

export default function MotionCTA({
	href,
	variant = 'primary',
	size = 'md',
	children,
	className = '',
	chrome = false,
	dataPrimaryCta = false,
}: MotionCTAProps) {
	const base =
		'inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cc-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'

	const hoverShadow =
		variant === 'primary'
			? '0 6px 20px rgba(29,184,104,0.47)'
			: variant === 'secondary'
				? '0 4px 24px rgba(16,185,129,0.25)'
				: undefined

	/* Sizing path: ghost variant always keeps legacy sizing (it's an inline
	 * link, not a pill). Otherwise, chrome opts back into legacy size scale. */
	const sizing =
		variant === 'ghost' || chrome
			? legacySizeStyles[size]
			: `${sitewidePadding} ${sitewideTypography[variant]}`

	return (
		<MotionLink
			href={href}
			className={`${base} ${sizing} ${variantStyles[variant]} ${className}`}
			{...(dataPrimaryCta ? { 'data-primary-cta': '' } : {})}
			whileHover={{
				scale: 1.02,
				boxShadow: hoverShadow,
				transition: { type: 'spring', stiffness: 200, damping: 25 },
			}}
			whileTap={{
				scale: 0.98,
				transition: { type: 'spring', stiffness: 300, damping: 28 },
			}}
		>
			{children}
		</MotionLink>
	)
}
