/** @fileoverview Shared layout for legal pages. Warm editorial surface, breadcrumb, plain-English summary, sticky TOC, cross-page navigation. */

import Link from 'next/link'
import LegalTOC from './LegalTOC'

type TOCItem = { id: string, label: string }

type Props = {
	title: string
	lastUpdated: string
	summaryTitle?: string
	summary: React.ReactNode
	toc: readonly TOCItem[]
	currentPath: '/privacy' | '/terms' | '/subprocessors' | '/cookie-policy'
	children: React.ReactNode
}

const LEGAL_LINKS = [
	{ label: 'Privacy Policy', href: '/privacy' },
	{ label: 'Terms of Service', href: '/terms' },
	{ label: 'List of Subprocessors', href: '/subprocessors' },
	{ label: 'Cookie Policy', href: '/cookie-policy' },
] as const

/**
 * @description Shared layout for all legal pages. Header with breadcrumb + title + last-updated date,
 * plain-English summary block, sticky TOC sidebar (desktop) / mobile accordion, main content area
 * with max-w-prose for readability, and footer with contact + cross-navigation.
 */
export default function LegalPageLayout({
	title,
	lastUpdated,
	summaryTitle = 'The short version.',
	summary,
	toc,
	currentPath,
	children,
}: Props) {
	return (
		<div className="bg-cc-warm">
			<div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
				{/* Breadcrumb */}
				<nav aria-label="Breadcrumb" className="mb-8">
					<ol className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cc-text-secondary-warm">
						<li>
							<Link
								href="/"
								className="transition-colors hover:text-cc-text-primary-warm"
							>
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>Legal</li>
						<li aria-hidden="true">/</li>
						<li className="text-cc-text-primary-warm">{title}</li>
					</ol>
				</nav>

				{/* Header */}
				<header className="max-w-3xl">
					<h1 className="display-lg text-cc-text-primary-warm">{title}</h1>
					<p className="mt-3 font-mono text-xs uppercase tracking-wider text-cc-text-secondary-warm">
						Last updated: {lastUpdated}
					</p>
				</header>

				{/* Summary */}
				<section
					aria-labelledby="summary-heading"
					className="mt-10 max-w-3xl rounded-2xl border border-black/10 bg-white/60 p-6 md:p-8"
				>
					<h2
						id="summary-heading"
						className="display-sm text-cc-text-primary-warm"
					>
						{summaryTitle}
					</h2>
					<div className="mt-4 space-y-4 text-base leading-[1.7] text-cc-text-secondary-warm">
						{summary}
					</div>
				</section>

				{/* Body: TOC + content */}
				<div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
					{/* TOC (mobile accordion first, desktop sidebar via CSS) */}
					<aside className="lg:order-1">
						<LegalTOC items={toc} />
					</aside>

					{/* Main content */}
					<article
						className="order-2 max-w-[65ch] text-cc-text-primary-warm"
					>
						{children}

						{/* In-page footer: contact + cross-nav + last-updated */}
						<footer className="mt-20 border-t border-black/10 pt-10">
							<p className="text-base leading-[1.7] text-cc-text-secondary-warm">
								Questions?{' '}
								<a
									href="mailto:support@closercoach.ai"
									className="text-cc-accent-hover underline-offset-2 hover:underline"
								>
									support@closercoach.ai
								</a>
							</p>
							<p className="mt-2 font-mono text-xs uppercase tracking-wider text-cc-text-secondary-warm">
								Last updated: {lastUpdated}
							</p>

							<div className="mt-8">
								<p className="font-mono text-xs uppercase tracking-wider text-cc-text-secondary-warm">
									Other Legal Pages
								</p>
								<ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
									{LEGAL_LINKS.filter((l) => l.href !== currentPath).map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="text-sm text-cc-accent-hover underline-offset-2 hover:underline"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>

							<div className="mt-10">
								<Link
									href="/"
									className="text-sm text-cc-text-secondary-warm transition-colors hover:text-cc-text-primary-warm"
								>
									&larr; Back to homepage
								</Link>
							</div>
						</footer>
					</article>
				</div>
			</div>
		</div>
	)
}
