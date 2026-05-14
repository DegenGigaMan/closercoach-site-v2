import { buildPageMetadata } from '@/lib/seo'
import PricingContent from './pricing-content'

export const metadata = buildPageMetadata({
	title: 'Pricing',
	description: 'CloserCoach pricing: $12.99/mo for Closer, $49.99/mo flat for Business, Custom for Enterprise. 3-day free trial. No contracts. 15-27x cheaper than Rilla, Siro, Hyperbound.',
	path: '/pricing',
})

export default function PricingPage() {
	return <PricingContent />
}
