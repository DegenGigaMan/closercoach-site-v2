/** @fileoverview Font configuration for CloserCoach site. Young Serif (headings) + Inter (body) + Geist Mono (stats). */

import { Young_Serif, Geist_Mono, Inter } from 'next/font/google'

export const youngSerif = Young_Serif({
	variable: '--font-young-serif',
	subsets: ['latin'],
	weight: '400',
	display: 'swap',
})

export const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
})

export const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
})
