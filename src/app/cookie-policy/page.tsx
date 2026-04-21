/** @fileoverview Cookie Policy page. Warm editorial surface, cookie types tables, third-party disclosures, preference management. */

import type { Metadata } from 'next'
import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { Section, BulletList, Strong } from '@/components/layout/LegalContent'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
	title: 'Cookie Policy',
	description:
		'How CloserCoach uses cookies, the types of cookies we use, and how to manage your preferences.',
}

const LAST_UPDATED = 'April 21, 2026'

const TOC = [
	{ id: 'what-are-cookies', label: '1. What Are Cookies' },
	{ id: 'how-we-use', label: '2. How We Use Cookies' },
	{ id: 'essential', label: '3. Essential Cookies' },
	{ id: 'analytics', label: '4. Analytics Cookies' },
	{ id: 'marketing', label: '5. Marketing Cookies' },
	{ id: 'third-party', label: '6. Third-Party Cookies' },
	{ id: 'preferences', label: '7. Managing Your Preferences' },
	{ id: 'changes', label: '8. Changes to This Policy' },
	{ id: 'contact', label: '9. Contact' },
] as const

export default function CookiePolicyPage() {
	return (
		<LegalPageLayout
			title="Cookie Policy"
			lastUpdated={LAST_UPDATED}
			summary={
				<>
					<p>
						{BRAND.name} uses cookies and similar technologies to keep you
						signed in, remember your preferences, and understand how the site
						is used.
					</p>
					<p>
						We do not use cookies to track you across other websites, and we do
						not sell cookie data to third parties. You can decline non-essential
						cookies from the banner on your first visit, and change your choice
						any time through your browser settings.
					</p>
				</>
			}
			toc={TOC}
			currentPath="/cookie-policy"
		>
			<div className="space-y-12">
				<Section id="what-are-cookies" title="1. What Are Cookies">
					<p>
						Cookies are small text files stored on your device when you visit a
						website. They help the site remember your preferences, understand
						how you interact with it, and improve your experience on future
						visits.
					</p>
				</Section>

				<Section id="how-we-use" title="2. How CloserCoach Uses Cookies">
					<p>{BRAND.name} uses cookies to:</p>
					<BulletList
						items={[
							<>
								<Strong>Keep you signed in</Strong> during your browsing
								session.
							</>,
							<>
								<Strong>Remember your preferences</Strong> (cookie consent
								choice, display settings).
							</>,
							<>
								<Strong>Understand how visitors use the site</Strong> so we can
								improve it.
							</>,
							<>
								<Strong>Measure marketing effectiveness</Strong> so we know what
								works.
							</>,
						]}
					/>
					<p>
						We do not use cookies to track you across other websites. We do not
						sell cookie data to third parties.
					</p>
				</Section>

				<Section id="essential" title="3. Essential Cookies">
					<p>Required for the website to function. These cannot be disabled.</p>
					<CookieTable
						headers={['Cookie', 'Purpose', 'Duration']}
						rows={[
							[
								<code
									key="code"
									className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs text-cc-accent-hover"
								>
									cookie-consent
								</code>,
								'Stores your cookie preference',
								'Persistent',
							],
							['Session cookies', 'Maintain your browsing session', 'Session'],
						]}
					/>
				</Section>

				<Section id="analytics" title="4. Analytics Cookies">
					<p>
						Help us understand how visitors interact with the site. Can be
						declined via the cookie banner.
					</p>
					<CookieTable
						headers={['Cookie', 'Purpose', 'Duration', 'Provider']}
						rows={[
							[
								'Google Analytics',
								'Page views, traffic sources, user behavior',
								'Up to 2 years',
								'Google',
							],
						]}
					/>
				</Section>

				<Section id="marketing" title="5. Marketing Cookies">
					<p>
						Used to measure campaign effectiveness. Only set if you accept
						cookies via the banner. Marketing cookies are only present when{' '}
						{BRAND.name} runs paid acquisition campaigns with tracking pixels.
						Specific ad-platform cookies are <em>(to be confirmed)</em>.
					</p>
				</Section>

				<Section id="third-party" title="6. Third-Party Cookies">
					<p>
						Some features on this site are provided by third parties that may
						set their own cookies:
					</p>
					<BulletList
						items={[
							<>
								<Strong>Intercom</Strong> (live chat widget): sets cookies to
								maintain your chat session and remember your identity across
								visits. See{' '}
								<a
									href="https://www.intercom.com/legal/cookie-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="text-cc-accent-hover underline-offset-2 hover:underline"
								>
									Intercom&apos;s cookie policy
								</a>
								.
							</>,
							<>
								<Strong>Google Analytics</Strong> (if accepted): sets cookies to
								track anonymous usage patterns. See{' '}
								<a
									href="https://policies.google.com/privacy"
									target="_blank"
									rel="noopener noreferrer"
									className="text-cc-accent-hover underline-offset-2 hover:underline"
								>
									Google&apos;s privacy policy
								</a>
								.
							</>,
						]}
					/>
				</Section>

				<Section id="preferences" title="7. Managing Your Preferences">
					<p>
						<Strong>Cookie banner:</Strong> when you first visit the site, a
						banner at the bottom of the page lets you accept or decline
						non-essential cookies. Your choice is stored locally and remembered
						on future visits.
					</p>
					<p>
						<Strong>Browser settings:</Strong> you can also manage cookies
						through your browser settings. Most browsers let you block or delete
						cookies. Blocking essential cookies may affect site functionality.
					</p>
					<p>
						<Strong>Clearing your choice:</Strong> to change your cookie
						preference, clear your browser&apos;s localStorage for this site.
						The cookie banner will reappear on your next visit.
					</p>
				</Section>

				<Section id="changes" title="8. Changes to This Policy">
					<p>
						We may update this cookie policy to reflect changes in our practices
						or for legal, regulatory, or operational reasons. Material changes
						will be reflected in the &quot;Last updated&quot; date at the top of
						this page.
					</p>
				</Section>

				<Section id="contact" title="9. Contact">
					<p>
						Questions about our cookie practices can be directed to{' '}
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

function CookieTable({
	headers,
	rows,
}: {
	headers: string[]
	rows: React.ReactNode[][]
}) {
	return (
		<div className="mt-2 overflow-x-auto rounded-xl border border-black/10 bg-white/60">
			<table className="w-full text-left text-sm">
				<thead>
					<tr className="border-b border-black/10">
						{headers.map((h) => (
							<th
								key={h}
								className="px-4 py-3 font-semibold text-cc-text-primary-warm"
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i} className="border-b border-black/5 last:border-b-0">
							{row.map((cell, j) => (
								<td
									key={j}
									className="px-4 py-3 align-top text-cc-text-secondary-warm"
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
