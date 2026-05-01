/** @fileoverview Root layout with fonts, metadata, viewport, JSON-LD,
 *  skip-nav, analytics provider, and body wrapper. */

import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { lora, geistMono, inter, plusJakarta } from '@/lib/fonts'
import { BRAND, FOOTER_LINKS, STATS, PRICING } from '@/lib/constants'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { ScrollDepthTracker } from '@/components/providers/ScrollDepthTracker'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import ScrollToTop from '@/components/layout/ScrollToTop'
import CookieConsent from '@/components/layout/CookieConsent'
import AnnouncementBanner from '@/components/layout/AnnouncementBanner'
import './globals.css'

export const metadata: Metadata = {
	title: {
		default: 'CloserCoach - AI Sales Coach for Your Phone',
		template: '%s | CloserCoach',
	},
	description: 'Practice before every meeting, record real calls, and get scored by AI. 20,000+ closers train with CloserCoach. Try free for 3 days.',
	metadataBase: new URL('https://closercoach.ai'),
	openGraph: {
		title: 'CloserCoach - AI Sales Coach for Your Phone',
		description: 'Practice before every meeting, record real calls, and get scored by AI. 20,000+ closers train with CloserCoach. Try free for 3 days.',
		siteName: 'CloserCoach',
		type: 'website',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'CloserCoach - The AI Sales Coach That Lives in Your Pocket',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'CloserCoach - AI Sales Coach for Your Phone',
		description: 'Practice before every meeting, record real calls, and get scored by AI. 20,000+ closers train with CloserCoach. Try free for 3 days.',
		images: ['/og-image.png'],
	},
	robots: {
		index: true,
		follow: true,
	},
}

export const viewport: Viewport = {
	themeColor: '#0D0F14',
}

/* JSON-LD Organization schema. sameAs pulled from FOOTER_LINKS.social so the
 * single source of truth (constants.ts) drives both UI and structured data.
 * Content is fully static, internally controlled — no user input flows here. */
const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: BRAND.name,
	url: 'https://closercoach.ai',
	logo: 'https://closercoach.ai/cc-logo.svg',
	sameAs: FOOTER_LINKS.social.map((s) => s.href),
}

/* JSON-LD SoftwareApplication schema. Numeric strings per schema.org spec.
 * All fields sourced from constants.ts — fully static, internally controlled. */
const softwareApplicationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: BRAND.name,
	operatingSystem: 'iOS, Android',
	applicationCategory: 'BusinessApplication',
	aggregateRating: {
		'@type': 'AggregateRating',
		ratingValue: STATS.appStoreRating,
		ratingCount: '378',
	},
	offers: {
		'@type': 'Offer',
		price: String(PRICING.individual.monthly),
		priceCurrency: 'USD',
	},
	downloadUrl: [BRAND.appStore, BRAND.googlePlay],
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
				{/* JSON-LD: content is statically composed from typed constants — safe to inline. */}
				<script
					type='application/ld+json'
					// eslint-disable-next-line react/no-danger -- static, internally controlled JSON-LD
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
				/>
				<script
					type='application/ld+json'
					// eslint-disable-next-line react/no-danger -- static, internally controlled JSON-LD
					dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
				/>
			</head>
			<body className='flex min-h-full flex-col'>
				<a
					href='#main'
					className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-cc-foundation focus:px-4 focus:py-2 focus:text-cc-text-primary focus:outline focus:outline-2 focus:outline-cc-accent'
				>
					Skip to main content
				</a>
				<PostHogProvider>
					<ScrollDepthTracker />
					<SmoothScroll />
					<ScrollToTop />
					<AnnouncementBanner />
					<Header />
					<main
						id='main'
						className='flex-1 [padding-top:calc(var(--cc-banner-h,0px)+3.5rem)] md:[padding-top:calc(var(--cc-banner-h,0px)+4rem)]'
					>
						{children}
					</main>
					<Footer />
					<CookieConsent />
				</PostHogProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
