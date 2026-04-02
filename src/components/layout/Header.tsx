/** @fileoverview Sticky header with transparent-to-solid scroll behavior, desktop nav + mobile hamburger overlay. */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X } from '@phosphor-icons/react'
import { BRAND, NAV_LINKS, CTA } from '@/lib/constants'

export default function Header() {
	const pathname = usePathname()
	const [scrolled, setScrolled] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const closeMenu = useCallback(() => setMenuOpen(false), [])

	// Lock body scroll when menu is open
	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => { document.body.style.overflow = '' }
	}, [menuOpen])

	const isActive = (href: string) => {
		if (href.startsWith('/#')) return pathname === '/'
		return pathname === href
	}

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
					scrolled
						? 'bg-cc-foundation/95 backdrop-blur-md border-b border-cc-surface-border'
						: 'bg-transparent'
				}`}
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14 md:h-16">
					{/* Wordmark */}
					<Link href="/" className="font-heading text-xl text-white tracking-tight">
						{BRAND.name}
					</Link>

					{/* Desktop nav */}
					<nav className="hidden md:flex items-center gap-8">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`text-sm transition-opacity ${
									isActive(link.href)
										? 'text-white opacity-100'
										: 'text-cc-text-secondary opacity-70 hover:opacity-100'
								}`}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Right side: CTA + hamburger */}
					<div className="flex items-center gap-3">
						<Link
							href={CTA.tryFree.href}
							className="rounded-lg bg-cc-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cc-accent-hover"
						>
							{CTA.tryFree.text}
						</Link>
						<button
							type="button"
							onClick={() => setMenuOpen(!menuOpen)}
							className="md:hidden flex items-center justify-center w-10 h-10 text-white"
							aria-label={menuOpen ? 'Close menu' : 'Open menu'}
						>
							{menuOpen ? <X size={24} /> : <List size={24} />}
						</button>
					</div>
				</div>
			</header>

			{/* Mobile overlay */}
			{menuOpen && (
				<div className="fixed inset-0 z-40 bg-cc-foundation/98 backdrop-blur-lg md:hidden">
					<div className="flex flex-col pt-20 px-6">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={closeMenu}
								className={`py-3 text-lg border-b border-cc-surface-border ${
									isActive(link.href)
										? 'text-white'
										: 'text-cc-text-secondary'
								}`}
								style={{ minHeight: 48 }}
							>
								{link.label}
							</Link>
						))}
						<div className="my-2 border-b border-cc-surface-border" />
						<Link
							href={BRAND.calendly}
							onClick={closeMenu}
							className="py-3 text-lg text-cc-text-secondary"
							style={{ minHeight: 48 }}
						>
							Contact Sales
						</Link>
					</div>
				</div>
			)}
		</>
	)
}
