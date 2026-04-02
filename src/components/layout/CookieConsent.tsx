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
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4">
			<div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-xl border border-cc-surface-border bg-cc-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
				<p className="text-sm text-cc-text-secondary">
					We use cookies to improve your experience.{' '}
					<Link
						href="/cookie-policy"
						className="text-cc-accent underline-offset-2 hover:underline"
					>
						Learn more
					</Link>
				</p>
				<div className="flex shrink-0 items-center gap-2">
					<button
						type="button"
						onClick={() => handleChoice('declined')}
						className="rounded-lg px-3 py-1.5 text-sm text-cc-text-secondary transition-colors hover:text-white"
					>
						Decline
					</button>
					<button
						type="button"
						onClick={() => handleChoice('accepted')}
						className="rounded-lg bg-cc-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-cc-accent-hover"
					>
						Accept
					</button>
				</div>
			</div>
		</div>
	)
}
