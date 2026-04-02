/** @fileoverview Dark footer with 4-column link grid, trust badges, and copyright line. */

import Link from 'next/link'
import { BRAND, FOOTER_LINKS } from '@/lib/constants'

const TRUST_BADGES = ['Featured in Hypepotamus', 'SOC2', 'GDPR'] as const

const columns = [
	{ heading: 'Resources', links: FOOTER_LINKS.resources },
	{ heading: 'Legal', links: FOOTER_LINKS.legal },
	{ heading: 'Support', links: FOOTER_LINKS.support },
	{ heading: 'Social', links: FOOTER_LINKS.social },
] as const

export default function Footer() {
	return (
		<footer className="bg-cc-foundation border-t border-cc-surface-border">
			<div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
				{/* Wordmark + tagline */}
				<div className="mb-12">
					<p className="font-heading text-xl text-white">{BRAND.name}</p>
					<p className="mt-2 text-sm text-cc-text-secondary">{BRAND.tagline}</p>
				</div>

				{/* 4-column link grid */}
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
					{columns.map((col) => (
						<div key={col.heading}>
							<p className="mb-4 text-sm font-semibold text-white">{col.heading}</p>
							<ul className="space-y-3">
								{col.links.map((link) => {
									const isExternal = 'external' in link && link.external
									return (
										<li key={link.href}>
											{isExternal ? (
												<a
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-cc-text-secondary transition-colors hover:text-white"
												>
													{link.label}
												</a>
											) : (
												<Link
													href={link.href}
													className="text-sm text-cc-text-secondary transition-colors hover:text-white"
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
				<div className="mt-12 flex flex-wrap gap-3 opacity-60">
					{TRUST_BADGES.map((badge) => (
						<span
							key={badge}
							className="rounded-full border border-cc-surface-border px-3 py-1 text-xs text-cc-text-muted"
						>
							{badge}
						</span>
					))}
				</div>

				{/* Copyright */}
				<div className="mt-8 border-t border-cc-surface-border pt-8">
					<p className="text-xs text-cc-text-muted">
						&copy; 2026 {BRAND.name}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
