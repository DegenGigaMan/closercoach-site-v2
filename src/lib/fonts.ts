import { Lora, Geist_Mono, Inter, Inter_Tight, Plus_Jakarta_Sans } from 'next/font/google'

export const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
	weight: ['700'],
	style: ['normal', 'italic'],
	display: 'swap',
	preload: true,
	fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
})

export const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	display: 'swap',
	preload: false,
	fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
})

export const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	preload: true,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-jakarta',
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	display: 'swap',
	preload: false,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const interTight = Inter_Tight({
	variable: '--font-inter-tight',
	subsets: ['latin'],
	weight: ['500', '600', '700'],
	display: 'swap',
	preload: false,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})
