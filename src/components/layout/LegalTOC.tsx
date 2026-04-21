/** @fileoverview Sticky Table of Contents for legal pages with IntersectionObserver scroll-spy and mobile accordion. */

'use client'

import { useEffect, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

type TOCItem = { id: string, label: string }

/**
 * @description Renders a sticky (desktop) / collapsible accordion (mobile) TOC for legal pages.
 * Uses IntersectionObserver to highlight the currently visible section.
 */
export default function LegalTOC({ items }: { items: readonly TOCItem[] }) {
	const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
	const [mobileOpen, setMobileOpen] = useState(false)

	useEffect(() => {
		if (items.length === 0) return
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
				if (visible[0]) setActiveId(visible[0].target.id)
			},
			{ rootMargin: '-20% 0px -70% 0px', threshold: 0 }
		)
		items.forEach((item) => {
			const el = document.getElementById(item.id)
			if (el) observer.observe(el)
		})
		return () => observer.disconnect()
	}, [items])

	const handleClick = (id: string) => (e: React.MouseEvent) => {
		e.preventDefault()
		const el = document.getElementById(id)
		if (el) {
			const top = el.getBoundingClientRect().top + window.scrollY - 96
			window.scrollTo({ top, behavior: 'smooth' })
			setMobileOpen(false)
		}
	}

	return (
		<>
			{/* Mobile: top-of-page accordion */}
			<div className="lg:hidden">
				<button
					type="button"
					onClick={() => setMobileOpen((v) => !v)}
					aria-expanded={mobileOpen}
					aria-controls="legal-toc-mobile"
					className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-white/60 px-4 py-3 text-left text-sm font-medium text-cc-text-primary-warm transition-colors hover:bg-white/80"
				>
					<span className="font-mono text-xs uppercase tracking-wider text-cc-text-secondary-warm">
						Contents
					</span>
					<CaretDown
						size={16}
						weight="bold"
						className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
					/>
				</button>
				{mobileOpen && (
					<nav
						id="legal-toc-mobile"
						aria-label="Table of contents"
						className="mt-2 rounded-xl border border-black/10 bg-white/60 p-3"
					>
						<ul className="space-y-1">
							{items.map((item) => (
								<li key={item.id}>
									<a
										href={`#${item.id}`}
										onClick={handleClick(item.id)}
										className={`block rounded-md px-3 py-2 text-sm transition-colors ${
											activeId === item.id
												? 'bg-cc-accent/10 text-cc-accent-hover'
												: 'text-cc-text-secondary-warm hover:bg-black/5 hover:text-cc-text-primary-warm'
										}`}
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				)}
			</div>

			{/* Desktop: sticky sidebar */}
			<nav
				aria-label="Table of contents"
				className="hidden lg:block"
			>
				<div className="sticky top-32 max-w-xs">
					<p className="font-mono text-xs uppercase tracking-wider text-cc-text-secondary-warm">
						Contents
					</p>
					<ul className="mt-4 space-y-1 border-l border-black/10">
						{items.map((item) => (
							<li key={item.id}>
								<a
									href={`#${item.id}`}
									onClick={handleClick(item.id)}
									className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
										activeId === item.id
											? 'border-cc-accent text-cc-accent-hover font-medium'
											: 'border-transparent text-cc-text-secondary-warm hover:border-black/20 hover:text-cc-text-primary-warm'
									}`}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</nav>
		</>
	)
}
