/** @fileoverview Terms of Service page. Warm editorial surface, sticky TOC, plain-English summary, structured legal sections. */

import type { Metadata } from 'next'
import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { Section, BulletList, Strong } from '@/components/layout/LegalContent'
import { BRAND, PRICING, STATS } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'Terms of Service',
	description:
		'CloserCoach Terms of Service. Subscription terms, cancellation policy, recording consent, and usage rules.',
	alternates: { canonical: '/terms' },
	openGraph: {
		title: 'Terms of Service | CloserCoach',
		description:
			'CloserCoach Terms of Service. Subscription, cancellation, recording consent, and usage rules.',
		url: '/terms',
		type: 'website',
	},
}

const LAST_UPDATED = 'April 21, 2026'

const TOC = [
	{ id: 'acceptance', label: '1. Acceptance of Terms' },
	{ id: 'description', label: '2. Description of Service' },
	{ id: 'account', label: '3. Account Registration' },
	{ id: 'billing', label: '4. Subscription and Billing' },
	{ id: 'acceptable-use', label: '5. Acceptable Use' },
	{ id: 'recording-consent', label: '6. Call Recording Consent' },
	{ id: 'ai-content', label: '7. AI-Generated Content' },
	{ id: 'ip', label: '8. Intellectual Property' },
	{ id: 'data-privacy', label: '9. Data and Privacy' },
	{ id: 'liability', label: '10. Limitation of Liability' },
	{ id: 'indemnification', label: '11. Indemnification' },
	{ id: 'disputes', label: '12. Dispute Resolution' },
	{ id: 'modifications', label: '13. Modifications' },
	{ id: 'termination', label: '14. Termination' },
	{ id: 'contact', label: '15. Contact' },
] as const

export default function TermsPage() {
	const annualDiscountPct = Math.round(PRICING.teams.annualDiscount * 100)

	return (
		<LegalPageLayout
			title="Terms of Service"
			lastUpdated={LAST_UPDATED}
			summary={
				<>
					<p>
						These terms cover how you use {BRAND.name}, our AI sales coaching
						platform. Using the app means you agree to them.
					</p>
					<p>
						Highlights: you can try free for {STATS.trialDays} days without a
						credit card. Subscriptions auto-renew but you can cancel anytime
						with no fees. You keep ownership of your recordings and inputs, and
						you are responsible for following recording consent laws in your
						area.
					</p>
					<p>
						The full terms below cover billing, acceptable use, dispute
						resolution, and how we handle changes to the service.
					</p>
				</>
			}
			toc={TOC}
			currentPath="/terms"
		>
			<div className="space-y-12">
				<Section id="acceptance" title="1. Acceptance of Terms">
					<p>
						By accessing or using {BRAND.name}, you agree to be bound by these
						Terms of Service. You must be at least 16 years old to use the
						service.
					</p>
				</Section>

				<Section id="description" title="2. Description of Service">
					<p>
						{BRAND.name} is an AI-powered sales coaching platform available as a
						mobile application on iOS and Android. Features include AI roleplay
						practice, call recording and scoring, feedback and coaching, skill
						tracking, and team management tools.
					</p>
				</Section>

				<Section id="account" title="3. Account Registration">
					<p>
						You must provide accurate information when creating an account. Each
						person may maintain one account. You are responsible for maintaining
						the security of your account credentials. {BRAND.name} reserves the
						right to terminate accounts that violate these terms.
					</p>
				</Section>

				<Section id="billing" title="4. Subscription and Billing">
					<BulletList
						items={[
							<>
								<Strong>Closer plan:</Strong> ${PRICING.individual.monthly}
								/month or ${PRICING.individual.yearly}/year.
							</>,
							<>
								<Strong>Teams plan:</Strong> ${PRICING.teams.monthly}/month per
								user, with {annualDiscountPct}% off when billed annually.
							</>,
							<>
								<Strong>Free trial:</Strong> a {STATS.trialDays}-day trial is
								available for the Closer plan with full access and no credit
								card required.
							</>,
							<>
								<Strong>Auto-renewal:</Strong> subscriptions auto-renew unless
								cancelled before the renewal date.
							</>,
							<>
								<Strong>Cancellation:</Strong> cancel anytime with no
								cancellation fees. Monthly billing stops at the end of the
								current period.
							</>,
							<>
								<Strong>Refunds:</Strong> subject to Apple App Store and Google
								Play refund policies.
							</>,
							<>
								<Strong>Price changes:</Strong> existing subscribers receive 30
								days notice before any price change takes effect.
							</>,
						]}
					/>
				</Section>

				<Section id="acceptable-use" title="5. Acceptable Use">
					<p>You may not use {BRAND.name} for:</p>
					<BulletList
						items={[
							<>Illegal activity or harassment.</>,
							<>Uploading abusive or harmful content into roleplay sessions.</>,
							<>Reverse engineering or scraping the platform.</>,
							<>Sharing account credentials with others.</>,
							<>
								Commercial redistribution of {BRAND.name} content or AI outputs.
							</>,
						]}
					/>
				</Section>

				<Section id="recording-consent" title="6. Call Recording Consent">
					<p>
						If you use the Ridealong recording feature, you are responsible for
						complying with applicable recording consent laws in your
						jurisdiction, including one-party and two-party consent
						requirements. {BRAND.name} provides the recording tool but does not
						determine the legality of specific recordings. You must obtain
						consent from all parties as required by your jurisdiction. See our{' '}
						<a
							href="/privacy"
							className="text-cc-accent-hover underline-offset-2 hover:underline"
						>
							Privacy Policy
						</a>{' '}
						for details on how recording data is handled.
					</p>
				</Section>

				<Section id="ai-content" title="7. AI-Generated Content">
					<p>
						AI coaching feedback, scores, and roleplay scenarios are generated
						by artificial intelligence. AI outputs are not a substitute for
						professional training, legal advice, or employment guidance.{' '}
						{BRAND.name} does not guarantee specific sales performance
						outcomes. You retain ownership of your call recordings and data
						inputs.
					</p>
				</Section>

				<Section id="ip" title="8. Intellectual Property">
					<p>
						{BRAND.name} retains intellectual property rights to the platform,
						AI models, and generated content. You retain ownership of content
						you upload, including scripts, product descriptions, and call
						recordings. A limited license is granted for personal and business
						use of AI-generated coaching content.
					</p>
				</Section>

				<Section id="data-privacy" title="9. Data and Privacy">
					<p>
						Your data is encrypted in transit and at rest. We do not sell user
						data. We do not use your data to train AI models for other
						customers. You can delete your data at any time. See our full{' '}
						<a
							href="/privacy"
							className="text-cc-accent-hover underline-offset-2 hover:underline"
						>
							Privacy Policy
						</a>
						.
					</p>
				</Section>

				<Section id="liability" title="10. Limitation of Liability">
					<p>
						{BRAND.name} is not responsible for sales performance outcomes,
						legal compliance of call recordings in your jurisdiction, or
						third-party service outages (including Apple App Store, Google Play,
						and payment processor disruptions).
					</p>
				</Section>

				<Section id="indemnification" title="11. Indemnification">
					<p>
						You agree to indemnify {BRAND.name} against claims arising from
						your violation of these terms or applicable laws, including
						recording consent requirements.
					</p>
				</Section>

				<Section id="disputes" title="12. Dispute Resolution">
					<p>
						Any disputes will be resolved through binding arbitration. You
						waive the right to participate in class action lawsuits. The
						governing state and jurisdiction for these terms is subject to
						confirmation by {BRAND.name}.
					</p>
				</Section>

				<Section id="modifications" title="13. Modifications to Terms">
					<p>
						We reserve the right to modify these terms. Material changes will
						be communicated with 30 days notice. Continued use of the service
						after changes take effect constitutes acceptance of the revised
						terms.
					</p>
				</Section>

				<Section id="termination" title="14. Termination">
					<p>
						Either party may terminate the agreement at any time. Upon
						termination, your data will be retained for a reasonable period to
						allow for export, after which it will be deleted in accordance with
						our{' '}
						<a
							href="/privacy"
							className="text-cc-accent-hover underline-offset-2 hover:underline"
						>
							Privacy Policy
						</a>
						.
					</p>
				</Section>

				<Section id="contact" title="15. Contact">
					<p>
						If you have questions about these Terms of Service, contact us at{' '}
						<a
							href={`mailto:${BRAND.email}`}
							className="text-cc-accent-hover underline-offset-2 hover:underline"
						>
							{BRAND.email}
						</a>{' '}
						or through the live chat widget on any page.
					</p>
				</Section>
			</div>
		</LegalPageLayout>
	)
}
