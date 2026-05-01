/** @fileoverview Web App Manifest exposed at /manifest.webmanifest. Powers
 * the "Add to Home Screen" install prompt on mobile browsers and tells iOS
 * Safari which icon + theme to use when the marketing site is bookmarked. */

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'CloserCoach — AI Sales Coach',
		short_name: 'CloserCoach',
		description:
			'Practice before every meeting, record real calls, and get scored by AI.',
		start_url: '/',
		display: 'standalone',
		background_color: '#0D0F14',
		theme_color: '#0D0F14',
		orientation: 'portrait',
		categories: ['business', 'productivity', 'education'],
		icons: [
			{
				src: '/icon.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/apple-icon.png',
				sizes: '180x180',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
}
