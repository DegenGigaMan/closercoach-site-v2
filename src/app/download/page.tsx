/** @fileoverview Download page with platform badges, QR code placeholder, and social proof. */

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BRAND, STATS, getStoreUrl } from '@/lib/constants'

export default function DownloadPage() {
	const [storeUrl, setStoreUrl] = useState('/download')

	useEffect(() => {
		setStoreUrl(getStoreUrl())
	}, [])

	return (
		<div className="bg-cc-foundation">
			<div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-xl flex-col items-center justify-center px-6 py-24 text-center md:min-h-[calc(100vh-4rem)]">
				{/* Headline + value prop */}
				<h1 className="display-lg text-white">
					Get CloserCoach on your phone
				</h1>
				<p className="mt-4 text-lg text-cc-text-secondary">
					Your first AI coaching session starts in 60 seconds. Pick your industry, run a roleplay, get scored.
				</p>
				<p className="mt-3 text-sm font-medium text-cc-accent">
					{STATS.trialDays} days free. Full access.
				</p>

				{/* Platform badges */}
				<div className="mt-10 flex items-center justify-center gap-4">
					<a
						href={BRAND.appStore}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-opacity hover:opacity-80"
					>
						<Image
							src="/badges/app-store.svg"
							alt="Download on the App Store"
							width={150}
							height={50}
							className="h-[48px] w-auto"
						/>
					</a>
					<a
						href={BRAND.googlePlay}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-opacity hover:opacity-80"
					>
						<Image
							src="/badges/google-play.svg"
							alt="Get it on Google Play"
							width={168}
							height={50}
							className="h-[48px] w-auto"
						/>
					</a>
				</div>

				{/* QR code placeholder (desktop) */}
				<div className="mt-8 hidden md:block">
					<div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-xl border border-cc-surface-border bg-white">
						<span className="text-xs text-cc-text-muted-warm">QR Code</span>
					</div>
					<p className="mt-2 text-xs text-cc-text-muted">
						Scan to download
					</p>
				</div>

				{/* Social proof strip */}
				<p className="mt-10 text-sm text-cc-text-muted">
					{STATS.userCount} closers. {STATS.appStoreRating} stars on the App Store. {STATS.appStoreReviews} ratings.
				</p>

				{/* Back link */}
				<Link
					href="/"
					className="mt-12 text-sm text-cc-text-secondary transition-colors hover:text-white"
				>
					&larr; Back to homepage
				</Link>
			</div>
		</div>
	)
}
