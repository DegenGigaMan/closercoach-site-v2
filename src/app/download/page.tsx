/** @fileoverview /download page -- Beside-style single-action conversion destination.
 * Logo + headline + QR museum frame + App Store/Google Play badges + 3-pill proof row + trust strip.
 * Dark surface. Minimal. One screen, one action. W12. */

import type { Metadata } from 'next'
import DownloadContent from './download-content'

const TITLE = 'Download CloserCoach for iOS and Android'
const DESCRIPTION =
	'Get CloserCoach on your phone. Available on the App Store and Google Play. Your first AI coaching session starts in 60 seconds.'

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: '/download' },
	openGraph: {
		title: TITLE,
		description:
			'Get CloserCoach on your phone. Available on the App Store and Google Play. 3 days free. Full access.',
		url: '/download',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: TITLE,
		description: DESCRIPTION,
	},
}

export default function DownloadPage() {
	return <DownloadContent />
}
