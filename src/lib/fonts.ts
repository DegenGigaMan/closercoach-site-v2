/** @fileoverview Font configuration for CloserCoach site. Lora (headings) +
 * Inter (body) + Geist Mono (stats) + Plus Jakarta Sans (CTAs, Wave F.1
 * sitewide CTA spec — Bold for primary, Medium for secondary).
 *
 * Performance posture (2026-05-01):
 *   ─ display: 'swap' on every face so text never blocks render (FCP wins).
 *   ─ preload: only Lora + Inter (above-the-fold typography). Geist Mono +
 *     Plus Jakarta load lazily — they're used for stat strips and CTA labels
 *     that aren't on the critical render path of the hero.
 *   ─ fallback: locally-installed system stacks so the swap moment never
 *     drops to an unstyled monospace.
 *   ─ adjustFontFallback (Next default): the metrics fallback font is auto-
 *     adjusted to minimize layout shift when the web font swaps in.
 *   ─ weight allowlist: trimmed to weights actually used in the codebase
 *     (font-light/medium/normal/semibold/bold). Inter previously requested
 *     the full variable axis — now scoped to 300/400/500/600/700.
 */

import { Lora, Geist_Mono, Inter, Plus_Jakarta_Sans } from 'next/font/google'

export const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
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
	weight: ['500', '700'],
	display: 'swap',
	preload: false,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
})
