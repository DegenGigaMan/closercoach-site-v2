import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	turbopack: {
		root: __dirname,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
	},
	async redirects() {
		return [
			// URL preservation from legacy site (Alim mandate 2026-04-16)
			{ source: '/privacy-policy', destination: '/privacy', permanent: true },
			{ source: '/terms-of-service', destination: '/terms', permanent: true },
		]
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
				],
			},
		]
	},
}

export default nextConfig
