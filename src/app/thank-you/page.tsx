/** @fileoverview /thank-you -- post-signup confirmation with 3-step next-actions.
 * Celebration header + Download/WhatsApp/Social step cards + minimal footer (triggered via pathname in Footer.tsx).
 * Copy from vault/clients/closer-coach/copy/pages/thank-you.md (Variant A). Dark surface. noindex. */

import type { Metadata } from 'next'
import ThankYouContent from './thank-you-content'

export const metadata: Metadata = {
	title: 'Welcome to CloserCoach',
	description: 'Your 3-day free trial just started. Here is how to get the most out of it.',
	robots: { index: false, follow: false },
}

export default function ThankYouPage() {
	return <ThankYouContent />
}
