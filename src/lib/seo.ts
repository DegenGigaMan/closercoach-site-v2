/**
 * @fileoverview Centralized page metadata builder. Sets default
 * Open Graph + Twitter card config so every page (current and future)
 * inherits the same social preview image, site name, and locale.
 *
 * @description
 * Why this exists: Next.js metadata inheritance does NOT deep-merge
 * the openGraph object across layout/page boundaries. When a page
 * exports `openGraph: { ... }` without an `images` array, the layout's
 * images do not auto-inherit — the page's openGraph object replaces
 * the parent's entirely on the openGraph slot. Same gotcha for twitter.
 *
 * The fix: every page calls `buildPageMetadata({ title, description, path })`,
 * and the helper bakes the OG image + Twitter handles + canonical into
 * a single Metadata object. Updating OG_IMAGE below propagates to every
 * page in the site without touching individual page files.
 *
 * Usage:
 *   import { buildPageMetadata } from '@/lib/seo'
 *   export const metadata = buildPageMetadata({
 *     title: 'Pricing',
 *     description: 'CloserCoach pricing: $12.99/mo for Closer...',
 *     path: '/pricing',
 *   })
 */

import type { Metadata } from 'next'

/**
 * Resolve the site origin so OG image + canonical URLs always point at
 * the domain that is actually serving the response. Self-healing across
 * the DNS cutover (see comment in src/app/layout.tsx for the cascade).
 */
export function resolveSiteUrl(): string {
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
	if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	}
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = 'CloserCoach'
export const TWITTER_HANDLE = '@closercoach'

/**
 * Single source of truth for the social preview image. Update this
 * constant + replace the asset at public/og-image.jpg to refresh
 * every route's social card in one shot.
 */
export const OG_IMAGE = {
	url: '/og-image.jpg',
	width: 1200,
	height: 630,
	alt: 'CloserCoach - The AI Sales Coach That Lives in Your Pocket',
	type: 'image/jpeg',
} as const

type BuildPageMetadataOptions = {
	/** Used for the <title> tag. layout.tsx's title.template wraps it as "<title> | CloserCoach". */
	title: string
	/** Meta description. Also used for OG + Twitter descriptions unless ogDescription overrides. */
	description: string
	/** Page path used for canonical + og:url (e.g. '/pricing', '/'). */
	path: string
	/** Optional override for the OG/Twitter card title when the templated form ("<title> | CloserCoach") is wrong (e.g. blog uses "CloserCoach Blog" instead of "Blog | CloserCoach"). */
	ogTitle?: string
	/** Optional override for OG/Twitter description when it should differ from the meta description (e.g. /download lists 60-sec hook in meta + 3-days-free hook in OG). */
	ogDescription?: string
	/** Defaults to 'website'. Use 'article' for blog post pages. */
	ogType?: 'website' | 'article'
	/** Set false to opt out of search indexing (e.g. /thank-you). Defaults to true. */
	indexable?: boolean
}

/**
 * Build a Metadata object for any page with the site-wide OG + Twitter
 * defaults baked in. Pages that need extra fields (article authors,
 * structured data) can spread this and add their own.
 */
export function buildPageMetadata(opts: BuildPageMetadataOptions): Metadata {
	const cardTitle = opts.ogTitle ?? `${opts.title} | ${SITE_NAME}`
	const cardDescription = opts.ogDescription ?? opts.description
	const meta: Metadata = {
		title: opts.title,
		description: opts.description,
		alternates: { canonical: opts.path },
		openGraph: {
			title: cardTitle,
			description: cardDescription,
			url: opts.path,
			type: opts.ogType ?? 'website',
			siteName: SITE_NAME,
			locale: 'en_US',
			images: [OG_IMAGE],
		},
		twitter: {
			card: 'summary_large_image',
			title: cardTitle,
			description: cardDescription,
			images: [OG_IMAGE.url],
			site: TWITTER_HANDLE,
			creator: TWITTER_HANDLE,
		},
	}
	if (opts.indexable === false) meta.robots = { index: false, follow: false }
	return meta
}
