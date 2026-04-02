/** @fileoverview Post-signup thank-you page with trial onboarding steps. */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BRAND, STATS } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'Welcome to CloserCoach',
	robots: { index: false, follow: false },
}

const STEPS = [
	{
		number: '1',
		title: 'Open the app and pick your industry.',
		body: 'CloserCoach covers 16 industries. Find yours and start with a pre-built scenario, or add what you sell and let AI build one for you.',
	},
	{
		number: '2',
		title: 'Run your first roleplay.',
		body: 'It takes 60 seconds. You will talk through a real sales scenario with an AI buyer who pushes back the way your actual prospects do. When you are done, you get scored.',
	},
	{
		number: '3',
		title: 'Read your scorecard.',
		body: 'A-F grades. Where you were strong. Where you lost the deal. Word-for-word coaching on what to say next time. That is your baseline. Every session after this one makes it better.',
	},
] as const

export default function ThankYouPage() {
	return (
		<div className="bg-cc-foundation">
			<div className="mx-auto max-w-2xl px-6 py-24 md:py-32">
				{/* Confirmation */}
				<h1 className="display-lg text-white">
					You are in. Your {STATS.trialDays}-day trial is live.
				</h1>
				<p className="mt-4 text-lg text-cc-text-secondary">
					Full access to every feature. No restrictions. Here is how to get the most out of it.
				</p>

				{/* Next steps */}
				<div className="mt-12 space-y-8">
					{STEPS.map((step) => (
						<div key={step.number} className="flex gap-4">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cc-accent/10 font-mono text-sm text-cc-accent">
								{step.number}
							</div>
							<div>
								<p className="font-semibold text-white">{step.title}</p>
								<p className="mt-1 text-sm leading-relaxed text-cc-text-secondary">
									{step.body}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Trial expectation */}
				<div className="mt-12 rounded-xl border border-cc-surface-border bg-cc-surface/50 p-6">
					<p className="text-sm leading-relaxed text-cc-text-secondary">
						You have {STATS.trialDays} days to use everything. Most closers know after one session whether this is worth ${BRAND.name === 'CloserCoach' ? '12.99' : '12.99'}/mo. After the trial, your subscription starts automatically unless you cancel. All your scores, progress, and skill data stay with you.
					</p>
				</div>

				{/* App link + badges */}
				<div className="mt-10 flex flex-col items-center gap-4">
					<a
						href={BRAND.appStore}
						className="inline-flex rounded-lg bg-cc-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cc-accent-hover"
					>
						Open CloserCoach
					</a>
					<div className="flex items-center gap-4">
						<a
							href={BRAND.appStore}
							target="_blank"
							rel="noopener noreferrer"
							className="transition-opacity hover:opacity-80"
						>
							<Image
								src="/badges/app-store.svg"
								alt="Download on the App Store"
								width={120}
								height={40}
								className="h-[40px] w-auto"
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
								width={135}
								height={40}
								className="h-[40px] w-auto"
							/>
						</a>
					</div>
				</div>

				{/* Back link */}
				<div className="mt-12 text-center">
					<Link
						href="/"
						className="text-sm text-cc-text-secondary transition-colors hover:text-white"
					>
						&larr; Back to homepage
					</Link>
				</div>
			</div>
		</div>
	)
}
