/** @fileoverview Next.js sitemap.ts file convention. Generates /sitemap.xml at build. */

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://closercoach.ai'

/**
 * @description Static sitemap for CC marketing site. URLs match the route tree
 * in src/app/. Priorities reflect commercial intent: home + commerce highest,
 * blog mid, legal lowest. Excludes /lab/* (internal) and /thank-you (post-conv).
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()
	return [
		{ url: `${BASE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
		{ url: `${BASE_URL}/pricing`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
		{ url: `${BASE_URL}/download`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
		{ url: `${BASE_URL}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
		{ url: `${BASE_URL}/blog/closercoach-raises-1m`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
		{ url: `${BASE_URL}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
		{ url: `${BASE_URL}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
		{ url: `${BASE_URL}/cookie-policy`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
		{ url: `${BASE_URL}/subprocessors`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
	]
}
