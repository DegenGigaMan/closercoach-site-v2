/** @fileoverview Root layout with fonts, metadata, and body wrapper. */

import type { Metadata } from 'next'
import { lora, geistMono, inter, plusJakarta } from '@/lib/fonts'
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${lora.variable} ${geistMono.variable} ${inter.variable} ${plusJakarta.variable} h-full antialiased`}
		>
			<head>
				<link rel='preload' href='/cc-logo.svg' as='image' type='image/svg+xml' />
			</head>
			<body className='flex min-h-full flex-col'>
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
