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
