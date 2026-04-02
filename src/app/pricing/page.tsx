/** @fileoverview /pricing page server component. Exports metadata, renders PricingContent client component. */

import type { Metadata } from 'next'
import PricingContent from './pricing-content'

export const metadata: Metadata = {
	title: 'Pricing',
	description: 'CloserCoach pricing: $12.99/mo for individuals, $49/mo per user for teams. 3-day free trial. No contracts.',
}

export default function PricingPage() {
	return <PricingContent />
}
