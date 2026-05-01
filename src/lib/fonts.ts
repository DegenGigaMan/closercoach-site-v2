/** @fileoverview Font configuration for CloserCoach site. Lora (headings) +
 * Inter (body) + Geist Mono (stats) + Plus Jakarta Sans (CTAs, Wave F.1
 * sitewide CTA spec — Bold for primary, Medium for secondary). */

import { Lora, Geist_Mono, Inter, Plus_Jakarta_Sans } from 'next/font/google'

export const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
	weight: ['600', '700'],
	style: ['normal', 'italic'],
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

export const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-jakarta',
	subsets: ['latin'],
	weight: ['500', '700'],
	display: 'swap',
})
