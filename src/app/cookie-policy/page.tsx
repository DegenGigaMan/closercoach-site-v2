/** @fileoverview Cookie Policy page with cookie types, third-party cookies, and preference management. */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Cookie Policy',
}

export default function CookiePolicyPage() {
	return (
		<div className="bg-cc-foundation">
			<div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
				<h1 className="display-lg text-white">Cookie Policy</h1>
				<p className="mt-3 text-sm text-cc-text-muted">
					Last updated: April 2026
				</p>

				{/* What are cookies */}
				<section className="mt-12">
					<h2 className="display-sm text-white">What Are Cookies</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						Cookies are small text files stored on your device when you visit a
						website. They help the site remember your preferences, understand how
						you interact with it, and improve your experience on future visits.
					</p>
				</section>

				{/* How we use cookies */}
				<section className="mt-10">
					<h2 className="display-sm text-white">How CloserCoach Uses Cookies</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						CloserCoach uses cookies to:
					</p>
					<ul className="mt-3 space-y-2 text-sm text-cc-text-secondary">
						<li className="flex gap-2">
							<span className="text-cc-accent">-</span>
							<span><strong className="text-white">Keep you logged in</strong> during your browsing session</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cc-accent">-</span>
							<span><strong className="text-white">Remember your preferences</strong> (cookie consent choice, display settings)</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cc-accent">-</span>
							<span><strong className="text-white">Understand how visitors use the site</strong> so we can improve it</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cc-accent">-</span>
							<span><strong className="text-white">Measure the effectiveness of our marketing</strong> so we know what works</span>
						</li>
					</ul>
					<p className="mt-4 text-sm leading-relaxed text-cc-text-secondary">
						We do not use cookies to track you across other websites. We do not
						sell cookie data to third parties.
					</p>
				</section>

				{/* Essential cookies */}
				<section className="mt-10">
					<h2 className="display-sm text-white">Essential Cookies</h2>
					<p className="mt-3 text-sm text-cc-text-secondary">
						Required for the website to function. These cannot be disabled.
					</p>
					<div className="mt-4 overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-cc-surface-border">
									<th className="pb-3 pr-6 font-semibold text-white">Cookie</th>
									<th className="pb-3 pr-6 font-semibold text-white">Purpose</th>
									<th className="pb-3 font-semibold text-white">Duration</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b border-cc-surface-border/50">
									<td className="py-3 pr-6 font-mono text-xs text-cc-accent">cookie-consent</td>
									<td className="py-3 pr-6 text-cc-text-secondary">Stores your cookie preference</td>
									<td className="py-3 text-cc-text-secondary">Persistent</td>
								</tr>
								<tr className="border-b border-cc-surface-border/50">
									<td className="py-3 pr-6 font-mono text-xs text-cc-accent">Session cookies</td>
									<td className="py-3 pr-6 text-cc-text-secondary">Maintain your browsing session</td>
									<td className="py-3 text-cc-text-secondary">Session</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* Analytics cookies */}
				<section className="mt-10">
					<h2 className="display-sm text-white">Analytics Cookies</h2>
					<p className="mt-3 text-sm text-cc-text-secondary">
						Help us understand how visitors interact with the site. Can be
						declined via the cookie banner.
					</p>
					<div className="mt-4 overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-cc-surface-border">
									<th className="pb-3 pr-6 font-semibold text-white">Cookie</th>
									<th className="pb-3 pr-6 font-semibold text-white">Purpose</th>
									<th className="pb-3 pr-6 font-semibold text-white">Duration</th>
									<th className="pb-3 font-semibold text-white">Provider</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b border-cc-surface-border/50">
									<td className="py-3 pr-6 font-mono text-xs text-cc-accent">Google Analytics</td>
									<td className="py-3 pr-6 text-cc-text-secondary">Page views, traffic sources, user behavior</td>
									<td className="py-3 pr-6 text-cc-text-secondary">2 years</td>
									<td className="py-3 text-cc-text-secondary">Google</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* Third-party cookies */}
				<section className="mt-10">
					<h2 className="display-sm text-white">Third-Party Cookies</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						Some features on this site are provided by third parties that may set
						their own cookies:
					</p>
					<ul className="mt-3 space-y-2 text-sm text-cc-text-secondary">
						<li className="flex gap-2">
							<span className="text-cc-accent">-</span>
							<span>
								<strong className="text-white">Intercom</strong> (live chat widget):
								Sets cookies to maintain your chat session and remember your
								identity across visits.
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-cc-accent">-</span>
							<span>
								<strong className="text-white">Google Analytics</strong> (if accepted):
								Sets cookies to track anonymous usage patterns.
							</span>
						</li>
					</ul>
				</section>

				{/* Managing preferences */}
				<section className="mt-10">
					<h2 className="display-sm text-white">Managing Your Preferences</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						When you first visit the site, a banner at the bottom of the page
						lets you accept or decline non-essential cookies. Your choice is
						stored locally and remembered on future visits.
					</p>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						You can also manage cookies through your browser settings. Most
						browsers let you block or delete cookies. Blocking essential cookies
						may affect site functionality.
					</p>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						To change your cookie preference, clear your browser's localStorage
						for this site. The cookie banner will reappear on your next visit.
					</p>
				</section>

				{/* Changes */}
				<section className="mt-10">
					<h2 className="display-sm text-white">Changes to This Policy</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						We may update this cookie policy to reflect changes in our practices
						or for legal, regulatory, or operational reasons. Material changes
						will be reflected in the "Last updated" date at the top of this
						page.
					</p>
				</section>

				{/* Contact */}
				<section className="mt-10">
					<h2 className="display-sm text-white">Contact</h2>
					<p className="mt-3 text-sm leading-relaxed text-cc-text-secondary">
						Questions about our cookie practices can be directed to{' '}
						<a
							href="mailto:privacy@closercoach.ai"
							className="text-cc-accent transition-colors hover:text-cc-accent-hover"
						>
							privacy@closercoach.ai
						</a>{' '}
						or through the live chat widget on any page.
					</p>
				</section>

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
