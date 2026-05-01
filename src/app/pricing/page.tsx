/** @fileoverview /pricing page server component. Exports metadata, renders PricingContent client component. */

import type { Metadata } from 'next'
import PricingContent from './pricing-content'

const TITLE = 'Pricing'
const DESCRIPTION =
	'CloserCoach pricing: $12.99/mo for Closer, $49/user/mo for Teams, Custom for Enterprise. 3-day free trial. No contracts. 15-27x cheaper than Rilla, Siro, Hyperbound.'

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: '/pricing' },
	openGraph: {
		title: `${TITLE} | CloserCoach`,
		description: DESCRIPTION,
		url: '/pricing',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: `${TITLE} | CloserCoach`,
		description: DESCRIPTION,
	},
}

export default function PricingPage() {
	return <PricingContent />
}
