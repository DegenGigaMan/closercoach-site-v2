/** @fileoverview List of Subprocessors page with table of third-party service providers. */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'List of Subprocessors',
}

const SUBPROCESSORS = [
	{
		name: 'Apple (App Store)',
		purpose: 'App distribution, subscription billing',
		data: 'Account info, payment processing',
		location: 'United States',
	},
	{
		name: 'Google (Play Store)',
		purpose: 'App distribution, subscription billing',
		data: 'Account info, payment processing',
		location: 'United States',
	},
	{
		name: 'Intercom',
		purpose: 'Customer support, live chat',
		data: 'Name, email, support conversations',
		location: 'United States',
	},
] as const

export default function SubprocessorsPage() {
	return (
		<div className="bg-cc-foundation">
			<div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
				<h1 className="display-lg text-white">List of Subprocessors</h1>
				<p className="mt-3 text-sm text-cc-text-muted">
					Last updated: April 2026
				</p>

				{/* Introduction */}
				<p className="mt-8 text-sm leading-relaxed text-cc-text-secondary">
					CloserCoach uses a limited number of third-party service providers
					("subprocessors") to assist in delivering the platform. Each
					subprocessor has been evaluated for its data handling practices and is
					bound by data processing agreements. This page lists the subprocessors
					that may process customer data on behalf of CloserCoach.
				</p>

				{/* Subprocessor table */}
				<div className="mt-10 overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-cc-surface-border">
								<th className="pb-3 pr-6 font-semibold text-white">Subprocessor</th>
								<th className="pb-3 pr-6 font-semibold text-white">Purpose</th>
								<th className="pb-3 pr-6 font-semibold text-white">Data Processed</th>
								<th className="pb-3 font-semibold text-white">Location</th>
							</tr>
						</thead>
						<tbody>
							{SUBPROCESSORS.map((sp) => (
								<tr key={sp.name} className="border-b border-cc-surface-border/50">
									<td className="py-4 pr-6 text-cc-text-secondary">{sp.name}</td>
									<td className="py-4 pr-6 text-cc-text-secondary">{sp.purpose}</td>
									<td className="py-4 pr-6 text-cc-text-secondary">{sp.data}</td>
									<td className="py-4 text-cc-text-secondary">{sp.location}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Change notification */}
				<div className="mt-12">
					<h2 className="display-sm text-white">Change Notification</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						CloserCoach will update this page when subprocessors are added or
						removed. For Teams and Enterprise customers, material changes to
						this list will be communicated via email at least 30 days before the
						change takes effect.
					</p>
				</div>

				{/* Contact */}
				<div className="mt-10">
					<h2 className="display-sm text-white">Contact</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						Questions about our subprocessors or data processing practices can
						be directed to{' '}
						<a
							href="mailto:privacy@closercoach.ai"
							className="text-cc-accent transition-colors hover:text-cc-accent-hover"
						>
							privacy@closercoach.ai
						</a>{' '}
						or through the live chat widget on any page.
					</p>
				</div>

				<div className="mt-16 text-center">
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
