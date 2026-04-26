/** @fileoverview Shared MotionCTA component with spring physics for hover/tap.
 * Styling ported from Figma node 85:15957 (Wave F.1 sitewide CTA spec, 2026-04-26):
 *   - Primary: pill (rounded-full), bg #34E18E, black text, Plus Jakarta Sans
 *     Bold (700) 16px / leading-18, padding 16/24, always-on emerald glow
 *     `0 4px 12px rgba(29,184,104,0.4)`.
 *   - Secondary: pill, bg #0B1314 + border #10B981 + text #34E18E +
 *     backdrop-blur-12, Plus Jakarta Sans Medium (500) 16px / leading-28.
 *   - Ghost: inline emerald text link, no pill (unchanged from prior spec).
 * Header CTAs do NOT use this component (raw <Link> in Header.tsx) so they're
 * unaffected by this default. The `chrome` boolean opt-out is provided
 * defensively for any future Header MotionCTA adoption to keep the legacy
 * Inter / size-scale styling intact. */

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
	/** Opt-out for the new sitewide CTA spec. Use for Header / chrome CTAs that
	 * should retain the legacy Inter typography + size-scale. Body CTAs (Hero,
	 * Teams, Final, Pricing, Download, Thank You) leave this off so they pick
	 * up the Wave F.1 Plus Jakarta Sans + 16/24 / bold-medium spec. */
	chrome?: boolean
}

/* Legacy size scale (preserved when chrome=true). */
const legacySizeStyles: Record<Size, string> = {
	lg: 'h-[54px] px-8 text-[18px] font-bold',
	md: 'h-[44px] px-6 text-base font-bold',
	sm: 'h-[36px] px-4 text-sm font-semibold',
}

/* Wave F.1 sitewide spec (Figma 85:15957). 16/24 padding, 16px text.
 * Weight is variant-driven (Bold for primary, Medium for secondary, kept
 * Semibold for ghost legibility). Vertical sizing is intrinsic from py-4 +
 * leading-[18px] / leading-[28px] so the button height stays consistent
 * with the Figma spec across all sizes. The `size` prop is preserved for
 * API compatibility but only the legacy code path branches on it. */
const sitewidePadding = 'px-6 py-4 text-[16px]'

/* Always-on glow for primary (Figma spec). Secondary gets a softer halo on
 * hover only. Ghost keeps the underline treatment. */
const variantStyles: Record<Variant, string> = {
	primary:
		'rounded-full bg-[#34E18E] text-cc-foundation shadow-[0_4px_12px_rgba(29,184,104,0.4)] hover:bg-[#34E18E]',
	secondary:
		'rounded-full border border-cc-accent bg-[#0B1314] text-[#34E18E] backdrop-blur-[12px] hover:border-cc-accent-hover hover:bg-[#0B1314]',
	ghost: 'rounded-lg text-cc-accent hover:text-cc-accent-hover hover:underline',
}

/* Per-variant typography for the sitewide spec. Primary = Bold (700),
 * Secondary = Medium (500), Ghost keeps Semibold for inline legibility. */
const sitewideTypography: Record<Variant, string> = {
	primary: 'font-bold leading-[18px] [font-family:var(--font-cta)] text-trim',
	secondary: 'font-medium leading-[28px] [font-family:var(--font-cta)] text-trim',
	ghost: 'font-semibold leading-[20px] text-trim',
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
	chrome = false,
}: MotionCTAProps) {
	const base =
		'inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cc-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'

	const hoverShadow =
		variant === 'primary'
			? '0 6px 20px rgba(29,184,104,0.55)'
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
