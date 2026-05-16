/** @fileoverview Compliance pill strip — Figma 111:557, Wave V (2026-04-27).
 *
 * Sits between FAQ and the Final CTA as a trust anchor before conversion.
 * Each compliance label renders as a pill: 1px white/6 border, px-[13px]
 * py-[7px], rounded-full, gap-1 between icon (16px) and Geist Mono Medium
 * 14px uppercase text (tracking 1.44px, line-height 18px, color #94a3b8).
 *
 * Distinct Phosphor icons per badge per Andy 2026-04-27 (his Figma reused
 * a single shield icon as a placeholder):
 *   ─ SOC2            : ShieldCheck (security audit framework)
 *   ─ GDPR            : Scales (legal/regulatory privacy framework)
 *   ─ SSO             : SignIn (single sign-on flow)
 *   ─ SAML            : Key (assertion-based auth)
 *   ─ AUDIT LOGGING   : ClipboardText (record-keeping)
 *   ─ DATA RESIDENCY  : Globe (regional data location)
 *
 * Each pill links to TRUST_HREF placeholder; Andy swaps for the real
 * external trust-center URL when ready. */

'use client'

import Link from 'next/link'
import {
	ShieldCheck,
	Scales,
	SignIn,
	Key,
	ClipboardText,
	Globe,
} from '@phosphor-icons/react/dist/ssr'
import type { IconProps } from '@phosphor-icons/react'
import type { ComponentType } from 'react'
import ScrollReveal from '@/components/shared/scroll-reveal'

type Badge = {
	label: string
	Icon: ComponentType<IconProps>
}

const BADGES: readonly Badge[] = [
	{ label: 'SOC2', Icon: ShieldCheck },
	{ label: 'GDPR', Icon: Scales },
	{ label: 'SSO', Icon: SignIn },
	{ label: 'SAML', Icon: Key },
	{ label: 'AUDIT LOGGING', Icon: ClipboardText },
	{ label: 'DATA RESIDENCY', Icon: Globe },
] as const

const TRUST_HREF = '#trust' as const

/**
 * @description Reusable pill strip — flex-wrap row of compliance badges.
 * Embed inside any section that needs a trust anchor. Format per Figma
 * 111:557.
 */
export function CompliancePills() {
	return (
		<ul className='flex flex-wrap items-center justify-center gap-3'>
			{BADGES.map(({ label, Icon }) => (
				<li key={label}>
					<Link
						href={TRUST_HREF}
						className='inline-flex items-center gap-1 rounded-full border border-white/[0.06] px-[13px] py-[7px] text-cc-text-secondary transition-colors hover:border-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
					>
						<span
							aria-hidden='true'
							className='flex h-4 w-4 shrink-0 items-center justify-center'
						>
							<Icon size={13.333} weight='regular' />
						</span>
						<span
							className='uppercase'
							style={{
								fontFamily: 'var(--font-mono)',
								fontWeight: 500,
								fontSize: '14px',
								lineHeight: '18px',
								letterSpacing: '1.44px',
							}}
						>
							{label}
						</span>
					</Link>
				</li>
			))}
		</ul>
	)
}

/**
 * @description Standalone section wrapper around the pill strip. Kept for
 * any future page that wants the strip as its own section. The home page
 * embeds CompliancePills directly inside SectionTeams (between bento and
 * CTAs) per Andy 2026-04-27, so this default export is currently unused.
 */
export default function SectionCompliance() {
	return (
		<section
			data-surface='dark-compliance'
			className='relative bg-cc-foundation'
			aria-label='Compliance and security'
		>
			<div className='mx-auto max-w-5xl px-6 py-10 md:py-12'>
				<ScrollReveal>
					<CompliancePills />
				</ScrollReveal>
			</div>
		</section>
	)
}
