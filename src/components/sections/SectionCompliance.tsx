/** @fileoverview F3-J1 Compliance badge strip. Sits between FAQ and the Final
 * CTA as a trust anchor before conversion. Horizontal strip on a dark foundation
 * surface carrying: ShieldCheck emerald icon, three visual compliance badges
 * (SOC2, GDPR, HIPAA) rendered monochrome so the strip stays subtle, and six
 * dot-separated monospace labels (SOC2, GDPR, SSO, SAML, AUDIT LOGGING, DATA
 * RESIDENCY). Every label wraps in a href='#trust' placeholder link that Andy
 * swaps for the real external trust-center URL later. Mobile wraps labels.
 *
 * Scope per Wave F3 brief. Do NOT swap the #trust placeholder -- Andy owns
 * that decision. */

'use client'

import Link from 'next/link'
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import ScrollReveal from '@/components/shared/scroll-reveal'

const COMPLIANCE_LABELS = [
	'SOC2',
	'GDPR',
	'SSO',
	'SAML',
	'AUDIT LOGGING',
	'DATA RESIDENCY',
] as const

const TRUST_HREF = '#trust' as const

/* Visual compliance badges. Monochrome neutral-grey (#94A3B8 ~ cc-text-muted)
 * so the strip reads as subtle trust anchor, not full-brand enterprise pitch. */
interface BadgeMarkProps {
	label: string
	children: React.ReactNode
}

function BadgeMark({ label, children }: BadgeMarkProps) {
	return (
		<span
			role='img'
			aria-label={label}
			className='inline-flex h-6 w-6 shrink-0 items-center justify-center text-cc-text-secondary'
		>
			{children}
		</span>
	)
}

/**
 * @description Compliance trust strip between FAQ and Final CTA. All labels
 * link to placeholder `#trust` anchor; Andy wires the real external trust
 * center URL when ready.
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
					<div className='flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-8'>
						{/* Emerald shield */}
						<ShieldCheck
							size={20}
							weight='bold'
							className='shrink-0 text-cc-accent'
							aria-hidden='true'
						/>

						{/* Visual badges (monochrome) */}
						<div className='flex items-center gap-4'>
							<BadgeMark label='SOC 2 certified'>
								{/* SOC 2 shield */}
								<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='h-5 w-5'>
									<path
										d='M12 2L4 5v6c0 5 3.5 9.4 8 11 4.5-1.6 8-6 8-11V5l-8-3z'
										stroke='currentColor'
										strokeWidth='1.6'
										strokeLinejoin='round'
									/>
									<path
										d='M9 12l2 2 4-4'
										stroke='currentColor'
										strokeWidth='1.6'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</BadgeMark>
							<BadgeMark label='GDPR compliant'>
								{/* GDPR ring */}
								<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='h-5 w-5'>
									<circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='1.6' />
									<path
										d='M7.5 12h9M12 7.5v9'
										stroke='currentColor'
										strokeWidth='1.6'
										strokeLinecap='round'
									/>
								</svg>
							</BadgeMark>
							<BadgeMark label='HIPAA compliant'>
								{/* HIPAA cross */}
								<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='h-5 w-5'>
									<rect
										x='3.5'
										y='3.5'
										width='17'
										height='17'
										rx='3'
										stroke='currentColor'
										strokeWidth='1.6'
									/>
									<path
										d='M12 8v8M8 12h8'
										stroke='currentColor'
										strokeWidth='1.8'
										strokeLinecap='round'
									/>
								</svg>
							</BadgeMark>
						</div>

						{/* Vertical hairline (desktop) */}
						<span
							className='hidden h-5 w-px bg-cc-surface-border md:block'
							aria-hidden='true'
						/>

						{/* Dot-separated linkable labels */}
						<div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:flex-nowrap md:gap-x-3'>
							{COMPLIANCE_LABELS.map((label, i) => (
								<span key={label} className='inline-flex items-center gap-2 md:gap-3'>
									<Link
										href={TRUST_HREF}
										className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.12em] text-cc-text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation md:text-[12px]'
									>
										{label}
									</Link>
									{i < COMPLIANCE_LABELS.length - 1 && (
										<span className='text-cc-text-muted/40' aria-hidden='true'>
											·
										</span>
									)}
								</span>
							))}
						</div>
					</div>
				</ScrollReveal>
			</div>
		</section>
	)
}
