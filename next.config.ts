import type { NextConfig } from 'next'

/**
 * Next.js config — performance, security, and URL preservation.
 *
 * Performance levers (2026-05-01):
 *   - compress: gzip responses at the edge.
 *   - poweredByHeader: false drops the X-Powered-By header (smaller, less
 *     fingerprintable).
 *   - productionBrowserSourceMaps: false keeps client bundles slim.
 *   - images.formats: serve AVIF first, then WebP, falling back to the source
 *     format. Cuts image bytes 30-50% vs PNG/JPEG on supporting browsers.
 *   - images.minimumCacheTTL: 1 year for the optimized image cache so repeat
 *     visitors hit the CDN edge instead of re-encoding.
 *   - experimental.optimizePackageImports: tree-shakes the icon + animation
 *     libs at build time so we ship only the icons we actually import (the
 *     site uses ~30 of @phosphor-icons/react's ~9000 glyphs).
 *
 * Security headers (2026-05-01):
 *   - X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
 *     Permissions-Policy applied to every route.
 */
const nextConfig: NextConfig = {
	compress: true,
	poweredByHeader: false,
	productionBrowserSourceMaps: false,
	reactStrictMode: true,

	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60 * 60 * 24 * 365,
		deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1440, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},

	experimental: {
		optimizePackageImports: [
			'@phosphor-icons/react',
			'motion',
			'simple-icons',
			'@number-flow/react',
		],
	},

	async redirects() {
		return [
			// URL preservation from legacy site (Alim mandate 2026-04-16)
			{ source: '/privacy-policy', destination: '/privacy', permanent: true },
			{ source: '/terms-of-service', destination: '/terms', permanent: true },
		]
	},

	/* PostHog reverse proxy (renamed /ingest -> /d4 on 2026-05-16). Routes
	 * /d4/* on our origin to PostHog's US ingest cluster so direct calls to
	 * posthog.com are not blocked by ad blockers (uBlock Origin, Brave,
	 * Firefox ETP, etc.) — the primary cause of "no data captured" in
	 * PostHog Next.js setups. The semantic /ingest prefix used to be enough
	 * but modern blocklists now pattern-match it; /d4 is intentionally
	 * non-semantic to slip blocklist heuristics.
	 *
	 * Pattern from posthog.com/docs/advice/proxy/nextjs. /static routes the
	 * array.js + recorder bundles to us-assets; /flags supports the new flag
	 * endpoint in posthog-js 1.227+. PostHogProvider sets api_host: '/d4' so
	 * the SDK targets these rewrites, not the public ingest URL.
	 *
	 * Note: PostHog dashboard's "improve your setup" panel pattern-matches
	 * /ingest and may flag this proxy as misconfigured. False positive —
	 * the rewrite still works; ingest is verified via Activity feed. */
	async rewrites() {
		return [
			{
				source: '/d4/static/:path*',
				destination: 'https://us-assets.i.posthog.com/static/:path*',
			},
			{
				source: '/d4/flags',
				destination: 'https://us.i.posthog.com/flags',
			},
			{
				source: '/d4/:path*',
				destination: 'https://us.i.posthog.com/:path*',
			},
		]
	},

	/* Required when using rewrites that target external hosts: prevents
	 * Next.js from auto-redirecting trailing slash variants and breaking the
	 * proxy path. Per posthog.com/docs/advice/proxy/nextjs. */
	skipTrailingSlashRedirect: true,

	async headers() {
		// Security headers apply to every route. Long-cache static images and
		// fonts under /public are emitted via a separate matcher. Next.js
		// already emits immutable Cache-Control for /_next/static hashed
		// assets, so only the user-facing /public paths need an override.
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
			{
				source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2|ico)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

export default nextConfig
