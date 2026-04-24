/** @fileoverview Dark footer with 4-column link grid, trust badges, and copyright line.
 * Auto-switches to a minimal variant (logo + legal links + copyright only) on post-action
 * pages like /thank-you per site-map. Rendered in root layout. */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BRAND, FOOTER_LINKS } from '@/lib/constants'

const TRUST_BADGES = ['Featured in Hypepotamus', 'SOC2', 'GDPR'] as const

const columns = [
	{ heading: 'Resources', links: FOOTER_LINKS.resources },
	{ heading: 'Legal', links: FOOTER_LINKS.legal },
	{ heading: 'Support', links: FOOTER_LINKS.support },
	{ heading: 'Social', links: FOOTER_LINKS.social },
] as const

/** Routes that render the minimal footer (post-signup/post-action). */
const MINIMAL_FOOTER_ROUTES = ['/thank-you'] as const

/**
 * @description Site footer. Default: 4-column link grid + trust badges. Minimal: wordmark + legal links + copyright only.
 * Minimal variant used on /thank-you per site-map to reduce post-signup friction.
 */
export default function Footer() {
	const pathname = usePathname()
	const minimal = MINIMAL_FOOTER_ROUTES.some((r) => pathname === r)

	if (minimal) {
		return (
			<footer className='bg-cc-foundation border-t border-cc-surface-border'>
				<div className='mx-auto max-w-7xl px-6 py-10'>
					<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src='/cc-logo.svg' alt={BRAND.name} width={117} height={24} className='h-8 w-auto md:h-10' />
						<ul className='flex flex-wrap gap-x-6 gap-y-2'>
							{FOOTER_LINKS.legal.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className='text-sm text-cc-text-secondary transition-colors hover:text-white'
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						<p className='text-xs text-cc-text-muted'>
							&copy; 2026 {BRAND.name}.
						</p>
					</div>
				</div>
			</footer>
		)
	}

	return (
		<footer className='bg-cc-foundation border-t border-cc-surface-border'>
			<div className='mx-auto max-w-7xl px-6 py-16 md:py-20'>
				{/* Wordmark + tagline */}
				<div className='mb-12'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src='/cc-logo.svg' alt={BRAND.name} width={117} height={24} className='h-8 w-auto md:h-10' />
					<p className='mt-3 text-sm text-cc-text-secondary'>{BRAND.tagline}</p>
				</div>

				{/* 4-column link grid */}
				<div className='grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12'>
					{columns.map((col) => (
						<div key={col.heading}>
							<p className='mb-4 text-sm font-semibold text-white'>{col.heading}</p>
							<ul className='space-y-3'>
								{col.links.map((link) => {
									const isExternal = 'external' in link && link.external
									return (
										<li key={link.href}>
											{isExternal ? (
												<a
													href={link.href}
													target='_blank'
													rel='noopener noreferrer'
													className='text-sm text-cc-text-secondary transition-colors hover:text-white'
												>
													{link.label}
												</a>
											) : (
												<Link
													href={link.href}
													className='text-sm text-cc-text-secondary transition-colors hover:text-white'
												>
													{link.label}
												</Link>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					))}
				</div>

				{/* Trust badges */}
				<div className='mt-12 flex flex-wrap gap-3'>
					{TRUST_BADGES.map((badge) => (
						<span
							key={badge}
							className='rounded-full border border-cc-surface-border px-3 py-1 text-xs text-cc-text-secondary'
						>
							{badge}
						</span>
					))}
				</div>

				{/* Copyright */}
				<div className='mt-8 border-t border-cc-surface-border pt-8'>
					<p className='text-xs text-cc-text-muted'>
						&copy; 2026 {BRAND.name}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
