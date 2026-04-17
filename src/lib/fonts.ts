/** @fileoverview Font configuration for CloserCoach site. Lora (headings) + Inter (body) + Geist Mono (stats). */

import { Lora, Geist_Mono, Inter } from 'next/font/google'

export const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
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
