/** @fileoverview Root layout with fonts, metadata, viewport, JSON-LD structured
 * data, and body wrapper.
 *
 * Metadata strategy (2026-05-01):
 *   ─ Title template ensures every subpage reads "Page | CloserCoach".
 *   ─ Open Graph + Twitter cards mirror the same hero copy + 1200x630 og-image
 *     so link unfurls (LinkedIn, Slack, iMessage, Twitter) all render the same
 *     branded preview.
 *   ─ canonical via `alternates.canonical` (root) + per-page metadata where
 *     each subpage extends the template.
 *   ─ Web App Manifest, sitemap, robots, and themeColor wired here so search
 *     engines and PWA installs see a consistent identity.
 *   ─ JSON-LD Organization + SoftwareApplication injected so Google rich
 *     results can surface app rating / pricing in search SERPs.
 */

import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { lora, geistMono, inter, plusJakarta } from '@/lib/fonts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import ScrollToTop from '@/components/layout/ScrollToTop'
import CookieConsent from '@/components/layout/CookieConsent'
import AnnouncementBanner from '@/components/layout/AnnouncementBanner'
import { BRAND, STATS, PRICING } from '@/lib/constants'
import './globals.css'

const SITE_URL = 'https://closercoach.ai'
const SITE_NAME = 'CloserCoach'
const SITE_TITLE = 'CloserCoach - AI Sales Coach for B2B Sales Rep'
const SITE_DESCRIPTION =
	'Practice before every meeting, record real calls, and get scored by AI. 20,000+ closers train with CloserCoach. Try free for 3 days.'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_TITLE,
		template: '%s | CloserCoach',
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	generator: 'Next.js',
	keywords: [
		'AI sales coach',
		'sales training app',
		'sales coaching software',
		'roleplay practice',
		'cold call coaching',
		'objection handling training',
		'sales enablement',
		'call recording analysis',
		'sales rep onboarding',
		'closer training',
	],
	authors: [{ name: 'CloserCoach', url: SITE_URL }],
	creator: 'CloserCoach',
	publisher: 'CloserCoach',
	referrer: 'origin-when-cross-origin',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		siteName: SITE_NAME,
		url: SITE_URL,
		type: 'website',
		locale: 'en_US',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'CloserCoach — The AI Sales Coach That Lives in Your Pocket',
				type: 'image/png',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		images: ['/og-image.png'],
		site: '@closercoach',
		creator: '@closercoach',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	icons: {
		icon: [
			{ url: '/icon.png', type: 'image/png' },
		],
		apple: [
			{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
		],
	},
	manifest: '/manifest.webmanifest',
	category: 'business',
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#F5F0EB' },
		{ media: '(prefers-color-scheme: dark)', color: '#0D0F14' },
	],
	colorScheme: 'dark light',
}

/* JSON-LD: Organization + SoftwareApplication.
 * Indexed by Google for richer SERP cards (logo, rating, pricing). The
 * SoftwareApplication entry uses the live App Store rating + review counts
 * surfaced in src/lib/constants STATS so updates flow through one source. */
const ORGANIZATION_LD = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': `${SITE_URL}#organization`,
	name: SITE_NAME,
	url: SITE_URL,
	/* ImageObject (instead of bare URL) so Google's Knowledge Graph can use
	 * the logomark with explicit dimensions. 512×512 PNG is the canonical
	 * favicon-grade asset extracted from the brand logomark.svg. */
	logo: {
		'@type': 'ImageObject',
		url: `${SITE_URL}/cc-logomark-512.png`,
		width: 512,
		height: 512,
	},
	email: BRAND.email,
	sameAs: [
		'https://linkedin.com/company/closercoach',
		'https://instagram.com/closercoach',
		BRAND.appStore,
		BRAND.googlePlay,
	],
}

const SOFTWARE_APP_LD = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	'@id': `${SITE_URL}#app`,
	name: SITE_NAME,
	operatingSystem: 'iOS, Android',
	applicationCategory: 'BusinessApplication',
	description: SITE_DESCRIPTION,
	image: `${SITE_URL}/og-image.png`,
	url: SITE_URL,
	offers: {
		'@type': 'Offer',
		price: PRICING.individual.monthly,
		priceCurrency: 'USD',
	},
	aggregateRating: {
		'@type': 'AggregateRating',
		ratingValue: STATS.appStoreRating,
		reviewCount: '378',
		bestRating: '5',
		worstRating: '1',
	},
	publisher: { '@id': `${SITE_URL}#organization` },
}

const WEBSITE_LD = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': `${SITE_URL}#website`,
	url: SITE_URL,
	name: SITE_NAME,
	description: SITE_DESCRIPTION,
	publisher: { '@id': `${SITE_URL}#organization` },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={`${lora.variable} ${geistMono.variable} ${inter.variable} ${plusJakarta.variable} h-full antialiased`}
		>
			<head>
				<link rel='preload' href='/cc-logo.svg' as='image' type='image/svg+xml' />
				{/* DNS prefetch + preconnect for third-parties used above-the-fold or
				 * shortly after — Calendly (book demo CTA), App Store/Play Store badge
				 * destinations. preconnect opens the TCP+TLS handshake early. */}
				<link rel='dns-prefetch' href='https://calendly.com' />
				<link rel='preconnect' href='https://calendly.com' crossOrigin='anonymous' />
			</head>
			<body className='flex min-h-full flex-col'>
				<Script
					id='ld-organization'
					type='application/ld+json'
					strategy='beforeInteractive'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
				/>
				<Script
					id='ld-software-app'
					type='application/ld+json'
					strategy='beforeInteractive'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_LD) }}
				/>
				<Script
					id='ld-website'
					type='application/ld+json'
					strategy='beforeInteractive'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_LD) }}
				/>
				<SmoothScroll />
				<ScrollToTop />
				<AnnouncementBanner />
				<Header />
				<main
					className='flex-1 [padding-top:calc(var(--cc-banner-h,0px)+3.5rem)] md:[padding-top:calc(var(--cc-banner-h,0px)+4rem)]'
				>
					{children}
				</main>
				<Footer />
				<CookieConsent />
			</body>
		</html>
	)
}
