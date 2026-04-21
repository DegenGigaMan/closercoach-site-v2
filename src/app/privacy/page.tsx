/** @fileoverview Privacy Policy page. Warm editorial surface, sticky TOC, SOC2 plain-English summary, structured legal sections. */

import type { Metadata } from 'next'
import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { Section, BulletList, Strong } from '@/components/layout/LegalContent'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description:
		'How CloserCoach collects, uses, and protects your data and call recordings. End-to-end encryption, isolated data, RBAC, and SOC2-aligned security.',
}

const LAST_UPDATED = 'April 21, 2026'

const TOC = [
	{ id: 'introduction', label: '1. Introduction' },
	{ id: 'information-we-collect', label: '2. Information We Collect' },
	{ id: 'how-we-use', label: '3. How We Use Your Information' },
	{ id: 'call-recording', label: '4. Call Recording Data' },
	{ id: 'ai-ml', label: '5. AI and Machine Learning' },
	{ id: 'data-sharing', label: '6. Data Sharing' },
	{ id: 'data-retention', label: '7. Data Retention' },
	{ id: 'your-rights', label: '8. Your Rights' },
	{ id: 'security', label: '9. Security' },
	{ id: 'children', label: "10. Children's Privacy" },
	{ id: 'changes', label: '11. Changes' },
	{ id: 'contact', label: '12. Contact' },
] as const

export default function PrivacyPage() {
	return (
		<LegalPageLayout
			title="Privacy Policy"
			lastUpdated={LAST_UPDATED}
			summary={
				<>
					<p>
						Your data is safe with {BRAND.name}. End-to-end encryption, isolated
						data, role-based access controls, and industry-leading security
						standards protect your information.
					</p>
					<p>
						We collect only what we need to provide coaching (account details,
						app activity, and recordings you create with Ridealong). Your calls
						and recordings stay yours. We do not sell personal data, and we do
						not use your data to train AI models that serve other customers.
					</p>
					<p>
						You can delete your recordings and your account at any time. This
						page explains the details.
					</p>
				</>
			}
			toc={TOC}
			currentPath="/privacy"
		>
			<div className="space-y-12">
				<Section id="introduction" title="1. Introduction">
					<p>
						This Privacy Policy describes how {BRAND.name} (&quot;we&quot;,
						&quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your
						personal information when you use our mobile application and website.
						By using {BRAND.name}, you agree to the practices described in this
						policy.
					</p>
				</Section>

				<Section id="information-we-collect" title="2. Information We Collect">
					<p>We collect the following categories of information:</p>
					<BulletList
						items={[
							<>
								<Strong>Account information</Strong> you provide directly: name,
								email address, industry, and company information when you create
								an account.
							</>,
							<>
								<Strong>Usage data</Strong>: app activity, feature usage, and
								session duration.
							</>,
							<>
								<Strong>Call recordings</Strong>: when you use the Ridealong
								feature or practice with AI roleplay, we process audio and
								transcripts.
							</>,
							<>
								<Strong>Device information</Strong>: device type, operating
								system version, and app version, collected automatically.
							</>,
							<>
								<Strong>Payment information</Strong>: processed through Apple
								App Store and Google Play. {BRAND.name} does not store card
								details directly.
							</>,
						]}
					/>
				</Section>

				<Section id="how-we-use" title="3. How We Use Your Information">
					<p>We use your information to:</p>
					<BulletList
						items={[
							<>Provide and improve the {BRAND.name} service.</>,
							<>Generate AI coaching feedback, scoring, and practice scenarios.</>,
							<>Personalize roleplay scenarios and training content.</>,
							<>Send account-related communications.</>,
							<>Analyze aggregate usage patterns. Individual data is never shared.</>,
						]}
					/>
				</Section>

				<Section id="call-recording" title="4. Call Recording Data">
					<p>
						This section applies to all audio captured via Ridealong, roleplay
						sessions, and any in-app recording feature.
					</p>
					<BulletList
						items={[
							<>
								<Strong>Encryption:</Strong> Recordings are encrypted in transit
								(TLS) and at rest (AES-256).
							</>,
							<>
								<Strong>Access:</Strong> On individual plans, only you can access
								your recordings. On Teams plans, designated managers may view
								recordings for coaching purposes based on role-based access
								controls.
							</>,
							<>
								<Strong>Retention:</Strong> Recordings remain in your account
								until you delete them. You can delete individual recordings at
								any time from your account settings.
							</>,
							<>
								<Strong>Model training:</Strong> Recordings are not used to train
								AI models for other customers.
							</>,
						]}
					/>
				</Section>

				<Section id="ai-ml" title="5. AI and Machine Learning">
					<p>
						{BRAND.name} uses AI to process your roleplay sessions, generate
						scoring, and deliver coaching feedback. Your data is isolated from
						other users. We do not use your data to train AI models that serve
						other customers.
					</p>
				</Section>

				<Section id="data-sharing" title="6. Data Sharing and Disclosure">
					<p>We do not sell your personal data. We may share data with:</p>
					<BulletList
						items={[
							<>
								<Strong>Third-party service providers</Strong> who assist in
								delivering the {BRAND.name} platform, each bound by data
								processing agreements. See our{' '}
								<a
									href="/subprocessors"
									className="text-cc-accent-hover underline-offset-2 hover:underline"
								>
									List of Subprocessors
								</a>
								.
							</>,
							<>
								<Strong>Law enforcement or regulators</Strong> when required by
								law, such as in response to a subpoena or court order.
							</>,
							<>
								<Strong>A successor entity</Strong> in connection with a merger,
								acquisition, or sale of assets.
							</>,
						]}
					/>
				</Section>

				<Section id="data-retention" title="7. Data Retention">
					<p>
						We retain your data while your account is active. If you delete your
						account, we purge your data in accordance with our retention
						schedule. You can delete your call recordings at any time from your
						account settings.
					</p>
				</Section>

				<Section id="your-rights" title="8. Your Rights">
					<p>You have the right to:</p>
					<BulletList
						items={[
							<>Access, export, and delete your data.</>,
							<>Opt out of marketing communications at any time.</>,
							<>
								<Strong>EU / UK residents (GDPR):</Strong> data portability, the
								right to erasure, and the right to restrict processing.
							</>,
							<>
								<Strong>California residents (CCPA):</Strong> the right to know,
								the right to delete, and the right to opt out of the sale of
								personal information.
							</>,
						]}
					/>
				</Section>

				<Section id="security" title="9. Security">
					<p>
						We protect your data with encryption in transit (TLS), encryption at
						rest (AES-256), role-based access controls, regular security audits,
						and a documented incident response program. Our security practices
						are aligned with SOC 2 standards.
					</p>
				</Section>

				<Section id="children" title="10. Children's Privacy">
					<p>
						{BRAND.name} is not intended for users under the age of 16. We do
						not knowingly collect personal information from children under 16.
						If we learn that we have collected data from a child under 16, we
						will delete that information promptly.
					</p>
				</Section>

				<Section id="changes" title="11. Changes to This Policy">
					<p>
						We may update this Privacy Policy from time to time. Material
						changes will be communicated via email to registered users. The
						&quot;Last updated&quot; date at the top of this page reflects the
						most recent revision.
					</p>
				</Section>

				<Section id="contact" title="12. Contact">
					<p>
						If you have questions about this Privacy Policy or your data,
						contact us at{' '}
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

