/** @fileoverview Cookie consent banner with Accept/Decline, persisted to localStorage. */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-consent'

export default function CookieConsent() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (!stored) {
			const timer = setTimeout(() => setVisible(true), 500)
			return () => clearTimeout(timer)
		}
	}, [])

	const handleChoice = (choice: 'accepted' | 'declined') => {
		localStorage.setItem(STORAGE_KEY, choice)
		setVisible(false)
	}

	if (!visible) return null

	return (
		<aside
			role="complementary"
			aria-label="Cookie notice"
			className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-[360px]"
		>
			<div className="flex flex-col gap-3 rounded-2xl border border-cc-surface-border bg-cc-surface/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
				<p className="text-sm leading-relaxed text-cc-text-secondary">
					We use cookies to improve your experience.{' '}
					<Link
						href="/cookie-policy"
						className="text-cc-accent underline-offset-2 hover:underline"
					>
						Learn more
					</Link>
				</p>
				<div className="flex items-center justify-end gap-2">
					<button
						type="button"
						onClick={() => handleChoice('declined')}
						className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-sm text-cc-text-secondary transition-colors hover:text-white"
					>
						Decline
					</button>
					<button
						type="button"
						onClick={() => handleChoice('accepted')}
						className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-cc-accent px-4 py-2 text-sm font-medium text-cc-foundation transition-colors hover:bg-cc-accent-hover"
					>
						Accept
					</button>
				</div>
			</div>
		</aside>
	)
}
