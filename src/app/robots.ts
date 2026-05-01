/** @fileoverview robots.txt exposed at /robots.txt. Allows indexing of public
 * marketing surface, blocks /lab (internal explorations), /thank-you (no SEO
 * value, also marked noindex per-page), and /book-demo (server redirect). */

import type { MetadataRoute } from 'next'

const SITE_URL = 'https://closercoach.ai'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/lab', '/lab/', '/thank-you', '/api'],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	}
}
