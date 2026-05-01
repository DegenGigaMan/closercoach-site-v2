/** @fileoverview Next.js robots.ts file convention. Generates /robots.txt at build. */

import type { MetadataRoute } from 'next'

/**
 * @description Allow all crawlers root access; block /lab/ (internal previews),
 * /thank-you (post-conversion noise), and /api/ (no public APIs to index).
 * Sitemap pointer matches sitemap.ts output.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/lab/', '/thank-you', '/api/'],
			},
		],
		sitemap: 'https://closercoach.ai/sitemap.xml',
	}
}
