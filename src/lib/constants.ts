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
	{ label: 'Book a Demo', href: '/sales' },
	{ label: 'Download', href: '/download' },
] as const

export const FOOTER_LINKS = {
	resources: [
		{ label: 'Product', href: '/#product' },
		{ label: 'Pricing', href: '/pricing' },
		{ label: 'Teams', href: '/#teams' },
		{ label: 'Download', href: '/download' },
		{ label: 'Book a Demo', href: '/sales' },
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
	contactSales: { text: 'Book a Demo', href: '/sales' },
	download: { text: 'Download', href: '/download' },
} as const

/* S3 Step 4 Review -- industry/dimension scoring matrix.
 * Ported from closercoach-site legacy (HOW_IT_WORKS.steps[2]). Drives the
 * tab-structured scorecard composite: industry tabs across the top,
 * dimension list on the left, "What you said / What you should have said"
 * panel on the right. 4 industries x 5 dimensions = 20 examples.
 * Copy is canvas-locked; ASCII hyphens preserved (no em dashes). */
export const SCORING_DATA = {
	industries: ['Insurance', 'Automotive', 'Financial', 'SaaS'],
	dimensions: ['Discovery', 'Pitch', 'Objection Handling', 'Closing', 'Tonality'],
	examples: {
		Insurance: {
			Discovery: {
				title: 'Life Event Anchoring',
				grade: 'C+',
				said: 'So are you looking for life insurance today?',
				shouldHaveSaid: 'Walk me through what changed recently. Is it a new baby, a mortgage, or something with your parents that put this on your radar?',
				page: 'Page 1 of 20',
			},
			Pitch: {
				title: 'Protection Narrative',
				grade: 'D',
				said: 'This is our Whole Life Plus plan. It has cash value, living benefits, and a guaranteed death benefit of 500k with no medical exam.',
				shouldHaveSaid: 'You told me your biggest worry is your kids having to sell the house if something happens. This policy keeps that house in the family for 200 a month.',
				page: 'Page 2 of 20',
			},
			'Objection Handling': {
				title: 'Premium Reframe',
				grade: 'C',
				said: 'I can look into a cheaper plan if the premium is a concern.',
				shouldHaveSaid: 'I hear you. One question. If something happened tomorrow and the family got nothing, would 150 a month have felt expensive?',
				page: 'Page 3 of 20',
			},
			Closing: {
				title: 'Urgency Anchor',
				grade: 'B-',
				said: 'Let me know when you want to get started.',
				shouldHaveSaid: "Underwriting takes 48 hours and today is Tuesday. If we run the application now, you're covered by Thursday. Let's get you into the system.",
				page: 'Page 4 of 20',
			},
			Tonality: {
				title: 'Composed Pace',
				grade: 'C-',
				said: 'Umm so yeah this plan has a lot of things that I think you might want to look at.',
				shouldHaveSaid: 'This is simple. Three pieces. Coverage amount, monthly cost, payout structure. Take as long as you need.',
				page: 'Page 5 of 20',
			},
		},
		Automotive: {
			Discovery: {
				title: 'Lifestyle Discovery',
				grade: 'C',
				said: 'What kind of car are you shopping for today?',
				shouldHaveSaid: 'Tell me about your week. How far is your commute, who rides with you, and what does your current car get wrong?',
				page: 'Page 6 of 20',
			},
			Pitch: {
				title: 'Daily Life Connection',
				grade: 'D+',
				said: 'The package comes with heated seats, lane assist, a sunroof, Apple CarPlay, and the 2.5 liter engine.',
				shouldHaveSaid: 'You said your knees ache after the morning commute. This model has memory seats for both drivers in your house, set to whatever position keeps your back happy.',
				page: 'Page 7 of 20',
			},
			'Objection Handling': {
				title: 'Total Cost Reframe',
				grade: 'B',
				said: 'I can try to knock another 500 off the sticker.',
				shouldHaveSaid: 'Price is worth digging into. Your current car burns 40 a week in gas. This one runs 18. That is 1100 a year in your pocket before we touch sticker.',
				page: 'Page 8 of 20',
			},
			Closing: {
				title: 'Calendar Urgency',
				grade: 'C+',
				said: 'Alright so I just need you to sign here and here and then we are done.',
				shouldHaveSaid: 'Your trade appraisal expires Friday. If we lock paperwork today, you drive home tonight in this car with the trade credit applied. That work?',
				page: 'Page 9 of 20',
			},
			Tonality: {
				title: 'Buyer Tempo Match',
				grade: 'D',
				said: 'Okay so do you want it do you want it lets do it lets get you in this car right now.',
				shouldHaveSaid: 'Take your time. Walk around it. Sit in the back seat. Check the trunk with a stroller in your head. When you are ready, I am right here.',
				page: 'Page 10 of 20',
			},
		},
		Financial: {
			Discovery: {
				title: 'Vision Before Numbers',
				grade: 'C',
				said: 'Can I get your age, income, and risk tolerance for the paperwork?',
				shouldHaveSaid: 'Before we touch any numbers, tell me what you want life to look like at 65. That shapes everything we build today.',
				page: 'Page 11 of 20',
			},
			Pitch: {
				title: 'Plan Over Products',
				grade: 'D+',
				said: 'We offer mutual funds, annuities, 401k rollovers, brokerage accounts, and managed portfolios with three risk profiles.',
				shouldHaveSaid: 'You said you want to retire at 62 and never touch principal. Here is a two account setup that pays you 4000 a month forever without ever selling a share.',
				page: 'Page 12 of 20',
			},
			'Objection Handling': {
				title: 'Performance Math',
				grade: 'B-',
				said: 'Our fees are industry standard. One percent is very competitive.',
				shouldHaveSaid: "Let me show you what that one percent bought last year. Your portfolio grew 11 percent net of fees. Your old broker charged 0.6 and delivered 4. You're 6000 ahead.",
				page: 'Page 13 of 20',
			},
			Closing: {
				title: 'Decision Maker Inclusion',
				grade: 'B',
				said: 'I will send over the new account paperwork tonight.',
				shouldHaveSaid: 'Two things this week. I open the Roth and you bring your spouse to Thursday at 4 so we walk the full plan together. Does 4 work?',
				page: 'Page 14 of 20',
			},
			Tonality: {
				title: 'Plain English Translation',
				grade: 'C-',
				said: 'We rebalance quarterly using a modified Sharpe ratio optimization across your allocation sleeves within the glide path.',
				shouldHaveSaid: 'Every three months we check if your mix is still on track. If stocks got too big, we trim them. Simple.',
				page: 'Page 15 of 20',
			},
		},
		SaaS: {
			Discovery: {
				title: 'Pain Before Demo',
				grade: 'D+',
				said: 'Great, I can get a demo booked for next week. What day works?',
				shouldHaveSaid: 'Before the demo, help me understand the part of your revenue ops that is bleeding. Lead routing, forecast accuracy, or the handoff from sales to CS?',
				page: 'Page 16 of 20',
			},
			Pitch: {
				title: 'Outcome First Framing',
				grade: 'C',
				said: 'Let me share my screen. Here is the dashboard. Filters on the left, reporting module up here, forecasting in this tab.',
				shouldHaveSaid: 'You told me you lose 3 deals a quarter to bad handoffs. Here is the one screen that eliminates that handoff. Nothing else matters until you see this.',
				page: 'Page 17 of 20',
			},
			'Objection Handling': {
				title: 'Value Re-anchor',
				grade: 'D',
				said: 'I can probably get you 15 percent off if that helps.',
				shouldHaveSaid: "Price wasn't the question you asked last week. You asked if this hits ARR before Q3. Let's go back to that. If pilot starts Monday, you see pipeline impact by June.",
				page: 'Page 18 of 20',
			},
			Closing: {
				title: 'Buying Committee Map',
				grade: 'C+',
				said: 'Cool, I will send over the contract and loop back next week.',
				shouldHaveSaid: "Before any contract, walk me through who else signs this. CFO, IT, security review? Let's get them on a 20 minute call Thursday so we don't end up in a redline loop for a month.",
				page: 'Page 19 of 20',
			},
			Tonality: {
				title: 'Peer Consultant Voice',
				grade: 'B-',
				said: 'Sure absolutely I can definitely help with that great question let me pull that up for you right now.',
				shouldHaveSaid: 'Honest answer. We do that better than anyone in the market. Most tools bolt it on. We were built for it.',
				page: 'Page 20 of 20',
			},
		},
	},
} as const

/**
 * @description Step 1 Clone Card B2C field schema (R-11). Replaces the prior
 * B2B field set (Name/Role/Company/Industry/Objection/Talk Track/Pain 1/Pain 2)
 * with 7 personalization layers tailored to CC's actual ICP (B2C closers in
 * insurance, mortgage, real estate, solar). Persona: Sarah Chen, mortgage
 * refinance lead. Locked Andy 2026-04-25 per
 * `vault/clients/closer-coach/feedback/clone-card-b2c-schema-proposal-2026-04-25.md`.
 *
 * `span: 'short'` -> 2-col grid placement (4 short fields share 2 columns).
 * `span: 'long'`  -> single-column full-width row (sentence-length values).
 */
export const CLONE_CARD = {
	name: 'Sarah Chen',
	fields: [
		{ label: 'JOB', value: 'Marketing Director', span: 'short' as const },
		{ label: 'CREDIT SCORE', value: '762', span: 'short' as const },
		{ label: 'HHI', value: '$187K combined', span: 'short' as const },
		{ label: 'DECISION MAKER', value: 'David (husband)', span: 'short' as const },
		{ label: 'LIKELY OBJECTION', value: '“We refinanced 2 years ago.”', span: 'long' as const },
		{ label: 'HOW TO HANDLE', value: 'Break-even math + cash-out angle.', span: 'long' as const },
		{ label: 'BUYER SIGNAL', value: 'Visited 3 lender sites this week.', span: 'long' as const },
	],
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
