/** @fileoverview Root layout with fonts, metadata, and body wrapper. */

import type { Metadata } from 'next'
import { youngSerif, geistMono, inter } from '@/lib/fonts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import CookieConsent from '@/components/layout/CookieConsent'
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
	},
	twitter: {
		card: 'summary_large_image',
		title: 'CloserCoach - AI Sales Coach for Your Phone',
		description: 'Practice before every meeting, record real calls, and get scored by AI. 20,000+ closers train with CloserCoach. Try free for 3 days.',
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
			className={`${youngSerif.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				<SmoothScroll />
				<Header />
				<main className="flex-1 pt-14 md:pt-16">
					{children}
				</main>
				<Footer />
				<CookieConsent />
			</body>
		</html>
	)
}
