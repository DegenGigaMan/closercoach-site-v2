/** @fileoverview Privacy Policy page with structured legal sections. */

import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'Privacy Policy',
}

const SECTIONS = [
	{
		id: 'introduction',
		title: '1. Introduction',
		content: `This Privacy Policy describes how ${BRAND.name} ("we", "us", or "our") collects, uses, and protects your personal information when you use our mobile application and website. By using ${BRAND.name}, you agree to the practices described in this policy.`,
	},
	{
		id: 'information-we-collect',
		title: '2. Information We Collect',
		content: `We collect information you provide directly, including your name, email address, industry, and company information when you create an account. We also collect usage data such as app activity, feature usage, and session duration. If you use the Ridealong feature, we process call recordings. Device information including device type, OS version, and app version is collected automatically. Payment information is processed through Apple App Store and Google Play and is not stored directly by ${BRAND.name}.`,
	},
	{
		id: 'how-we-use',
		title: '3. How We Use Your Information',
		content: `We use your information to provide and improve the ${BRAND.name} service, generate AI coaching feedback and scoring, personalize roleplay scenarios and training content, send account-related communications, and analyze aggregate usage patterns. We do not share individual user data.`,
	},
	{
		id: 'call-recording',
		title: '4. Call Recording Data',
		content: `Your calls and recordings are encrypted in transit and at rest. On individual plans, only you can access your recordings. On Teams plans, designated managers may view recordings for coaching purposes. You can delete your recordings at any time from your account settings. Recordings are not used to train AI models for other customers.`,
	},
	{
		id: 'ai-ml',
		title: '5. AI and Machine Learning',
		content: `${BRAND.name} uses AI to process your roleplay sessions, generate scoring, and deliver coaching feedback. Your data is isolated from other users. We do not use your data to train AI models that serve other customers.`,
	},
	{
		id: 'data-sharing',
		title: '6. Data Sharing and Disclosure',
		content: `We do not sell your personal data. We may share data with third-party service providers who assist in delivering the ${BRAND.name} platform, each bound by data processing agreements. We may disclose data when required by law, such as in response to a subpoena or court order, or in connection with a business transfer such as a merger or acquisition.`,
	},
	{
		id: 'data-retention',
		title: '7. Data Retention',
		content: `We retain your data while your account is active. If you delete your account, your data will be purged in accordance with our retention schedule. You can delete your call recordings at any time from your account settings.`,
	},
	{
		id: 'your-rights',
		title: '8. Your Rights',
		content: `You have the right to access, delete, and export your data, and to opt out of marketing communications. If you are in the EU, you have additional rights under GDPR including data portability, the right to erasure, and the right to restrict processing. If you are in California, you have rights under CCPA including the right to know, the right to delete, and the right to opt out of the sale of personal information.`,
	},
	{
		id: 'security',
		title: '9. Security',
		content: `We use encryption in transit (TLS) and at rest to protect your data. We conduct regular security audits and maintain incident response procedures to address potential security events.`,
	},
	{
		id: 'children',
		title: "10. Children's Privacy",
		content: `${BRAND.name} is not intended for users under the age of 16. We do not knowingly collect personal information from children under 16. If we learn that we have collected data from a child under 16, we will delete that information promptly.`,
	},
	{
		id: 'changes',
		title: '11. Changes to This Policy',
		content: `We may update this Privacy Policy from time to time. Material changes will be communicated via email to registered users. The "Last updated" date at the top of this page reflects the most recent revision.`,
	},
	{
		id: 'contact',
		title: '12. Contact',
		content: `If you have questions about this Privacy Policy or your data, contact us at privacy@closercoach.ai or through the live chat widget on any page.`,
	},
] as const

export default function PrivacyPage() {
	return (
		<div className="bg-cc-foundation">
			<div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
				<h1 className="display-lg text-white">Privacy Policy</h1>
				<p className="mt-3 text-sm text-cc-text-muted">
					Last updated: April 2026
				</p>

				<div className="mt-12 space-y-10">
					{SECTIONS.map((section) => (
						<section key={section.id} id={section.id}>
							<h2 className="display-sm text-white">{section.title}</h2>
							<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
								{section.content}
							</p>
						</section>
					))}
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
