/** @fileoverview Font configuration for CloserCoach site. Lora (headings) +
 * Plus Jakarta Sans (body, swapped in via 2a8c39e launch typography lock) +
 * Inter Tight (CTAs, swapped in via 2a8c39e) + Geist Mono (stats) + Inter
 * (legacy body face, retained for any unmigrated surfaces).
 *
 * Performance posture (launch lock 2026-05-15):
 *   ─ display: 'swap' on every face so text never blocks render (FCP wins).
 *   ─ preload: Lora (above-the-fold display), Plus Jakarta (above-the-fold
 *     body since the 2a8c39e swap), and Inter Tight (primary CTA face,
 *     above the fold). Inter + Geist Mono lazy-load — Inter is no longer
 *     the primary body face; Geist Mono is for stat strips below the fold.
 *   ─ fallback: locally-installed system stacks so the swap moment never
 *     drops to an unstyled monospace.
 *   ─ adjustFontFallback (Next default): the metrics fallback font is auto-
 *     adjusted to minimize layout shift when the web font swaps in.
 *   ─ weight allowlist: trimmed to weights actually used in the codebase
 *     (font-light/medium/normal/semibold/bold).
 */

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
	preload: false,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-jakarta',
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	display: 'swap',
	preload: true,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const interTight = Inter_Tight({
	variable: '--font-inter-tight',
	subsets: ['latin'],
	weight: ['500', '600', '700'],
	display: 'swap',
	preload: true,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})
