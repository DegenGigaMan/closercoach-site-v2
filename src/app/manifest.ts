/** @fileoverview Web App Manifest exposed at /manifest.webmanifest. Powers
 * the "Add to Home Screen" install prompt on mobile browsers and tells iOS
 * Safari which icon + theme to use when the marketing site is bookmarked.
 *
 * Icons reference the cleaned brand logomark PNGs under /public extracted
 * from the Figma logomark.svg export (the original SVG ships a 1.16MB
 * embedded raster — the 192/512 resampled PNGs are the same image at the
 * sizes Android + iOS install prompts actually consume). */

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'CloserCoach - AI Sales Coach for B2B Sales Rep',
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
				src: '/cc-logomark-192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/cc-logomark-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/cc-logomark-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
}
