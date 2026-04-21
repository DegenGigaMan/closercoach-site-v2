import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// URL preservation from legacy site (Alim mandate 2026-04-16)
			{ source: '/privacy-policy', destination: '/privacy', permanent: true },
			{ source: '/terms-of-service', destination: '/terms', permanent: true },
		]
	},
}

export default nextConfig
