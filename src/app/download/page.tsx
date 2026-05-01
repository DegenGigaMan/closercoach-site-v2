/** @fileoverview /download page -- Beside-style single-action conversion destination.
 * Logo + headline + QR museum frame + App Store/Google Play badges + 3-pill proof row + trust strip.
 * Dark surface. Minimal. One screen, one action. W12. */

import type { Metadata } from 'next'
import DownloadContent from './download-content'

export const metadata: Metadata = {
	title: 'Download CloserCoach for iOS and Android',
	description:
		'Get CloserCoach on your phone. Available on the App Store and Google Play. Your first AI coaching session starts in 60 seconds.',
	openGraph: {
		title: 'Download CloserCoach for iOS and Android',
		description:
			'Get CloserCoach on your phone. Available on the App Store and Google Play. 3 days free. Full access.',
		type: 'website',
	},
	alternates: {
		canonical: '/download',
	},
}

export default function DownloadPage() {
	return <DownloadContent />
}
