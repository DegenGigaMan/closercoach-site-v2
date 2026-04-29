/** @fileoverview Shared MotionCTA component with spring physics for hover/tap.
 * Styling ported from Figma node 85:15957 (Wave F.1 sitewide CTA spec, 2026-04-26):
 *   - Primary: pill (rounded-full), bg cc-mint (#34E18E), text cc-foundation,
 *     Plus Jakarta Sans Bold (700) 16px / leading-18, padding 16/24,
 *     always-on emerald glow `0 4px 12px rgba(29,184,104,0.4)`.
 *   - Secondary: pill, bg cc-foundation-deep (#0B1314) + border cc-accent
 *     (#10B981) + text cc-mint (#34E18E) + backdrop-blur-12, Plus Jakarta
 *     Sans Medium (500) 16px / leading-28.
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
	/** Marks this CTA as a primary purchase/conversion CTA. Used by the cookie
	 *  banner to suppress its own visibility while a primary CTA is in viewport
	 *  (Wave I FIX-01 — keep purchase CTAs unoccluded on first visit). */
	dataPrimaryCta?: boolean
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
 * hover only. Ghost keeps the underline treatment.
 *
 * Wave N (FIX-07): primary gets `border border-transparent` so its box-model
 * height matches secondary's `border border-cc-accent` outline contribution.
 * Without this the secondary's 1px border adds 2px total height vs primary,
 * breaking the dual-CTA pair height parity in Hero / Teams / Final rows. */
const variantStyles: Record<Variant, string> = {
	primary:
		'rounded-full border border-transparent bg-cc-mint text-cc-foundation shadow-[0_4px_12px_rgba(29,184,104,0.34)] hover:bg-cc-mint',
	secondary:
		'rounded-full border border-cc-accent bg-cc-foundation-deep text-cc-mint backdrop-blur-[12px] hover:border-cc-accent-hover hover:bg-cc-foundation-deep',
	ghost: 'rounded-lg text-cc-accent hover:text-cc-accent-hover hover:underline',
}

/* Per-variant typography for the sitewide spec. Primary = Bold (700),
 * Secondary = Medium (500), Ghost keeps Semibold for inline legibility.
 * Wave M-0 (Andy 2026-04-26): unified leading on primary + secondary at 18px
 * so text-trim collapses both pills to identical visible glyph height. The
 * prior secondary leading-[28px] left visible top/bottom whitespace inside
 * the pill that text-trim alone could not consolidate -- the line-box was
 * trimmed but rendered taller than primary, breaking the matched-pair
 * visual rhythm in Hero / Teams / Final CTA dual-CTA rows. */
const sitewideTypography: Record<Variant, string> = {
	primary: 'font-bold leading-[18px] [font-family:var(--font-cta)] text-trim',
	secondary: 'font-medium leading-[18px] [font-family:var(--font-cta)] text-trim',
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
	dataPrimaryCta = false,
}: MotionCTAProps) {
	const base =
		'inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cc-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'

	/* Wave C1 (Q17 A10): primary hover shadow alpha reduced from 0.55 -> 0.47
	 * (-15%) to match the new restraint after Wave X removed the hero rays.
	 * Resting glow alpha also dropped 0.4 -> 0.34 in variantStyles above. */
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
