/** @fileoverview Locked brand data, pricing, stats, and design tokens for CloserCoach site. */

export const STATS = {
	userCount: '20,000+',
	appStoreRating: '4.7',
	appStoreReviews: '378+',
	trialDays: 3,
	quotaHitRate: '76%',
	quotaWithout: '47%',
	closeRateImprovement: '7%',
	skillDimensions: 7,
} as const

export const PRICING = {
	individual: { monthly: 12.99, yearly: 69.99, effectiveMonthly: 5.83 },
	teams: { monthly: 49, annualDiscount: 0.20 },
	enterprise: { label: 'Custom' },
	yearlySavingsPercent: 55,
} as const

export const BRAND = {
	name: 'CloserCoach',
	tagline: 'The AI Sales Coach That Lives in Your Pocket',
	phone: null,
	email: 'hello@closercoach.ai',
	appStore: 'https://apps.apple.com/us/app/closercoach-ai-sales-trainer/id6742204639',
	googlePlay: 'https://play.google.com/store/apps/details?id=com.closercademy.app',
	calendly: 'https://calendly.com/taylor-closercoach/demo',
} as const

export const COLORS = {
	// Dark surfaces
	foundation: '#0D0F14',
	surfaceElevated: '#1A1D26',
	surfaceCard: '#1E2230',
	surfaceBorder: 'rgba(255, 255, 255, 0.06)',
	surfaceBorderHover: 'rgba(255, 255, 255, 0.12)',

	// Primary accent -- Emerald
	accent: '#10B981',
	accentHover: '#059669',
	accentGlow: 'rgba(16, 185, 129, 0.15)',
	accentMuted: 'rgba(16, 185, 129, 0.40)',
	accentAtmospheric: 'rgba(0, 212, 170, 0.10)',

	// Secondary accent -- Amber
	accentSecondary: '#F59E0B',
	accentSecondaryMuted: 'rgba(245, 158, 11, 0.40)',

	// Warm light surfaces
	warmLight: '#F5F0EB',
	warmLightSecondary: '#FAFAF8',
	warmBorder: 'rgba(0, 0, 0, 0.06)',

	// Text -- dark surfaces
	textPrimary: '#FFFFFF',
	textSecondary: '#94A3B8',
	textTertiary: '#64748B',

	// Text -- warm surfaces
	textPrimaryWarm: '#1A1D26',
	textSecondaryWarm: '#475569',
	textTertiaryWarm: '#94A3B8',

	// Semantic scoring
	scorePositive: '#22C55E',
	scoreNegative: '#EF4444',
	scoreNeutral: '#F59E0B',
} as const

export const SPACING = {
	sectionGap: { desktop: 120, mobile: 80 },
	sectionGapWarm: { desktop: 96, mobile: 64 },
	blockGap: { desktop: 64, mobile: 48 },
	elementGap: { desktop: 32, mobile: 24 },
	compactGap: { desktop: 16, mobile: 12 },
	contentMaxWidth: 1200,
	textMaxWidth: 640,
} as const

export const NAV_LINKS = [
	{ label: 'Product', href: '/#product' },
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'Download', href: '/download' },
] as const

export const FOOTER_LINKS = {
	resources: [
		{ label: 'Product', href: '/#product' },
		{ label: 'Pricing', href: '/pricing' },
		{ label: 'Teams', href: '/#teams' },
		{ label: 'Download', href: '/download' },
	],
	legal: [
		{ label: 'Privacy Policy', href: '/privacy' },
		{ label: 'Terms of Service', href: '/terms' },
		{ label: 'List of Subprocessors', href: '/subprocessors' },
		{ label: 'Cookie Policy', href: '/cookie-policy' },
	],
	support: [
		{ label: 'Support Email', href: 'mailto:hello@closercoach.ai', external: false },
		{ label: 'WhatsApp Community', href: 'https://chat.whatsapp.com/HkG7urngZAV4wV9Ufd02Z1', external: true },
		{ label: 'Live Chat', href: '#', external: false },
	],
	social: [
		{ label: 'LinkedIn', href: 'https://linkedin.com/company/closercoach', external: true },
		{ label: 'Instagram', href: 'https://instagram.com/closercoach', external: true },
	],
} as const

export const CTA = {
	tryFree: { text: 'Try for Free', href: '/download' },
	startFree: { text: 'Start For Free', href: '/download' },
	contactSales: { text: 'Contact Sales', href: BRAND.calendly },
	download: { text: 'Download', href: '/download' },
} as const

/**
 * @description Returns the appropriate store URL based on user's platform.
 * iOS -> App Store, Android -> Google Play, Desktop -> /download fallback.
 * Must be called client-side only (uses navigator.userAgent).
 */
export function getStoreUrl(): string {
	if (typeof navigator === 'undefined') return '/download'
	const ua = navigator.userAgent
	if (/iPhone|iPad|iPod/i.test(ua)) return BRAND.appStore
	if (/Android/i.test(ua)) return BRAND.googlePlay
	return '/download'
}
