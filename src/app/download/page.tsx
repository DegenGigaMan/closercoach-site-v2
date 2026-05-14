import { buildPageMetadata } from '@/lib/seo'
import DownloadContent from './download-content'

export const metadata = buildPageMetadata({
	title: 'Download CloserCoach for iOS and Android',
	description: 'Get CloserCoach on your phone. Available on the App Store and Google Play. Your first AI coaching session starts in 60 seconds.',
	ogTitle: 'Download CloserCoach for iOS and Android',
	ogDescription: 'Get CloserCoach on your phone. Available on the App Store and Google Play. 3 days free. Full access.',
	path: '/download',
})

export default function DownloadPage() {
	return <DownloadContent />
}
