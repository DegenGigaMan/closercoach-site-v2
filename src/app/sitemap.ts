/** @fileoverview XML sitemap exposed at /sitemap.xml. Lists all public pages
 * with priority + change frequency hints so search engines crawl the high-value
 * marketing surface (home, pricing, download) more aggressively than legal. */

import type { MetadataRoute } from 'next'

const SITE_URL = 'https://closercoach.ai'

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()

	return [
		{
			url: `${SITE_URL}/`,
			lastModified,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${SITE_URL}/pricing`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/download`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/blog`,
			lastModified,
			changeFrequency: 'weekly',
			priority: 0.7,
		},
		{
			url: `${SITE_URL}/blog/closercoach-raises-1m`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.6,
		},
		{
			url: `${SITE_URL}/privacy`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${SITE_URL}/terms`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${SITE_URL}/cookie-policy`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${SITE_URL}/subprocessors`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
	]
}
