/** @fileoverview /pricing page server component. Exports metadata, renders PricingContent client component. */

import type { Metadata } from 'next'
import PricingContent from './pricing-content'

export const metadata: Metadata = {
	title: 'Pricing',
	description: 'CloserCoach pricing: $12.99/mo for Closer, $49/user/mo for Teams, Custom for Enterprise. 3-day free trial. No contracts. 15-27x cheaper than Rilla, Siro, Hyperbound.',
}

export default function PricingPage() {
	return <PricingContent />
}
