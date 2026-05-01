/** @fileoverview List of Subprocessors page. Warm editorial surface, table of confirmed + placeholder third-party service providers. */

import type { Metadata } from 'next'
import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { Section } from '@/components/layout/LegalContent'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'List of Subprocessors',
	description:
		'Third-party service providers that may process customer data on behalf of CloserCoach.',
	alternates: { canonical: '/subprocessors' },
	openGraph: {
		title: 'List of Subprocessors | CloserCoach',
		description:
			'Third-party service providers that may process customer data on behalf of CloserCoach.',
		url: '/subprocessors',
		type: 'website',
	},
}

const LAST_UPDATED = 'April 21, 2026'

const TOC = [
	{ id: 'introduction', label: '1. Introduction' },
	{ id: 'providers', label: '2. Subprocessor List' },
	{ id: 'change-notification', label: '3. Change Notification' },
	{ id: 'contact', label: '4. Contact' },
] as const

type Subprocessor = {
	name: string
	purpose: string
	data: string
	location: string
	pending?: boolean
}

const SUBPROCESSORS: readonly Subprocessor[] = [
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
	{
		name: 'Cloud hosting provider',
		purpose: 'Infrastructure hosting, data storage',
		data: 'All customer data (encrypted at rest)',
		location: 'United States',
		pending: true,
	},
	{
		name: 'AI model provider',
		purpose: 'AI roleplay, call scoring, coaching feedback',
		data: 'Roleplay transcripts, call recordings, scoring data',
		location: 'United States',
		pending: true,
	},
	{
		name: 'Product analytics provider',
		purpose: 'Product analytics, usage metrics',
		data: 'Anonymized usage data, session data',
		location: 'United States',
		pending: true,
	},
	{
		name: 'Transactional email provider',
		purpose: 'Account notifications and emails',
		data: 'Email address, name',
		location: 'United States',
		pending: true,
	},
] as const

export default function SubprocessorsPage() {
	return (
		<LegalPageLayout
			title="List of Subprocessors"
			lastUpdated={LAST_UPDATED}
			summary={
				<>
					<p>
						{BRAND.name} uses a small set of trusted third-party providers to
						help deliver the platform. Each provider has been reviewed for
						security and is bound by a data processing agreement.
					</p>
					<p>
						This page lists every subprocessor that may handle customer data on
						our behalf. The list is subject to update as our infrastructure
						evolves. Entries marked <em>(to be confirmed)</em> are being
						finalized and will be named in a future revision.
					</p>
				</>
			}
			toc={TOC}
			currentPath="/subprocessors"
		>
			<div className="space-y-12">
				<Section id="introduction" title="1. Introduction">
					<p>
						{BRAND.name} uses a limited number of third-party service providers
						(&quot;subprocessors&quot;) to assist in delivering the platform.
						Each subprocessor has been evaluated for its data handling practices
						and is bound by data processing agreements.
					</p>
					<p>
						This page lists the subprocessors that may process customer data on
						behalf of {BRAND.name}.
					</p>
				</Section>

				<Section id="providers" title="2. Subprocessor List">
					<div className="mt-2 overflow-x-auto rounded-xl border border-black/10 bg-white/60">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-black/10">
									<th className="px-4 py-3 font-semibold text-cc-text-primary-warm">
										Subprocessor
									</th>
									<th className="px-4 py-3 font-semibold text-cc-text-primary-warm">
										Purpose
									</th>
									<th className="px-4 py-3 font-semibold text-cc-text-primary-warm">
										Data Processed
									</th>
									<th className="px-4 py-3 font-semibold text-cc-text-primary-warm">
										Location
									</th>
								</tr>
							</thead>
							<tbody>
								{SUBPROCESSORS.map((sp) => (
									<tr
										key={sp.name}
										className="border-b border-black/5 last:border-b-0"
									>
										<td className="px-4 py-4 align-top text-cc-text-primary-warm">
											{sp.name}
											{sp.pending && (
												<span className="ml-2 rounded-full bg-cc-amber/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cc-amber">
													To be confirmed
												</span>
											)}
										</td>
										<td className="px-4 py-4 align-top text-cc-text-secondary-warm">
											{sp.purpose}
										</td>
										<td className="px-4 py-4 align-top text-cc-text-secondary-warm">
											{sp.data}
										</td>
										<td className="px-4 py-4 align-top text-cc-text-secondary-warm">
											{sp.location}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Section>

				<Section id="change-notification" title="3. Change Notification">
					<p>
						{BRAND.name} will update this page when subprocessors are added or
						removed. For Teams and Enterprise customers, material changes to
						this list will be communicated via email at least 30 days before the
						change takes effect.
					</p>
				</Section>

				<Section id="contact" title="4. Contact">
					<p>
						Questions about our subprocessors or data processing practices can
						be directed to{' '}
						<a
							href="mailto:privacy@closercoach.ai"
							className="text-cc-accent-hover underline-offset-2 hover:underline"
						>
							privacy@closercoach.ai
						</a>{' '}
						or through the live chat widget on any page.
					</p>
				</Section>
			</div>
		</LegalPageLayout>
	)
}
