/** @fileoverview Pricing page client component with billing toggle, 3 tier cards
 * (Closer / Teams / Enterprise), feature comparison table, competitor context anchor,
 * trust signals, FAQ accordion, and bottom CTA with store badges.
 * Tier naming per section-blueprint v2 /pricing section + site-map.md.
 * Copy reconciled from vault/clients/closer-coach/copy/pages/pricing.md + section-blueprint.md.
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Minus, CaretDown } from '@phosphor-icons/react'
import MotionCTA from '@/components/shared/motion-cta'
import ScrollReveal from '@/components/shared/scroll-reveal'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND, CTA, PRICING, STATS } from '@/lib/constants'
import { track } from '@/lib/analytics'

/* ---------- Tier data ---------- */

const TIERS = [
	{
		key: 'closer',
		label: 'CLOSER',
		labelTone: 'emerald' as const,
		badge: 'Most Popular',
		subtitle: 'For individual closers',
		highlighted: true,
		getPrice: (yearly: boolean) => yearly
			? { amount: `$${PRICING.individual.effectiveMonthly}`, period: '/mo', note: `Billed $${PRICING.individual.yearly}/yr` }
			: { amount: `$${PRICING.individual.monthly}`, period: '/mo', note: 'Billed monthly' },
		trial: `${STATS.trialDays} days free. Full access. No credit card required.`,
		cta: { text: CTA.startFree.text, href: CTA.startFree.href },
		ctaVariant: 'primary' as const,
		features: [
			'Unlimited AI roleplays',
			'AI Suggested Roleplays (personalized daily)',
			'Create custom roleplays from your product catalog',
			'Practice any custom objection',
			'In-depth call feedback (pages of coaching per session)',
			'In-call AI annotations',
			'Ridealong recording and AI scoring',
			'Built-in dialer (your number on caller ID)',
			'Skill progression tracking (7 dimensions)',
			'Community leaderboard and daily challenges',
			'All industries, 100+ scenarios',
		],
	},
	{
		key: 'teams',
		label: 'TEAMS',
		labelTone: 'amber' as const,
		badge: 'Best for Teams',
		subtitle: 'For sales teams of 5+',
		highlighted: false,
		getPrice: (yearly: boolean) => yearly
			? { amount: `$${Math.round(PRICING.teams.monthly * (1 - PRICING.teams.annualDiscount))}`, period: '/user/mo', note: `${PRICING.teams.annualDiscount * 100}% off annual` }
			: { amount: `$${PRICING.teams.monthly}`, period: '/user/mo', note: 'Billed monthly' },
		trial: null,
		cta: { text: CTA.contactSales.text, href: CTA.contactSales.href },
		ctaVariant: 'secondary' as const,
		features: [
			'Everything in Closer, plus:',
			'Manager web dashboard',
			'Team analytics and performance tracking',
			'Custom scorecards and talk tracks',
			'AI-powered team onboarding (enter your website, AI builds training)',
			'CRM connections (Salesforce, HubSpot, GoHighLevel)',
			'Priority support',
			'1:1 white-glove setup call',
		],
	},
	{
		key: 'enterprise',
		label: 'ENTERPRISE',
		labelTone: 'slate' as const,
		badge: 'For Large Organizations',
		subtitle: 'For large organizations',
		highlighted: false,
		getPrice: () => ({ amount: PRICING.enterprise.label, period: '', note: 'Volume pricing · SSO · custom integrations' }),
		trial: null,
		cta: { text: CTA.contactSales.text, href: CTA.contactSales.href },
		/* Wave R FIX-04 (2026-04-27): swap ghost → secondary so Enterprise gets
		 * the same bordered-outline emerald CTA as Teams (was bare-text "Book a
		 * Demo" with no padding/styling, looked orphaned next to bordered Closer
		 * + Teams cards). */
		ctaVariant: 'secondary' as const,
		features: [
			'Everything in Teams, plus:',
			'Single sign-on (SSO / SAML)',
			'Admin controls and role-based permissions',
			'Custom API access',
			'Dedicated account manager',
			'Custom integrations',
			'Advanced reporting and analytics exports',
			'Compliance and audit logging',
			'Custom SLA',
			'Enterprise-grade security',
			'Volume pricing',
		],
	},
] as const

/* ---------- Comparison table ---------- */

type TierIncluded = [boolean, boolean, boolean]

const COMPARISON_ROWS: { feature: string; tiers: TierIncluded }[] = [
	{ feature: 'Unlimited AI roleplays', tiers: [true, true, true] },
	{ feature: 'Custom roleplays from your product catalog', tiers: [true, true, true] },
	{ feature: 'In-call AI coaching annotations', tiers: [true, true, true] },
	{ feature: 'Ridealong recording + AI scoring', tiers: [true, true, true] },
	{ feature: 'Built-in dialer', tiers: [true, true, true] },
	{ feature: 'Pages of coaching per call', tiers: [true, true, true] },
	{ feature: 'Skill progression tracking', tiers: [true, true, true] },
	{ feature: 'Community leaderboard', tiers: [true, true, true] },
	{ feature: 'Daily challenges and streaks', tiers: [true, true, true] },
	{ feature: '100+ scenarios, all industries', tiers: [true, true, true] },
	{ feature: 'Manager dashboard', tiers: [false, true, true] },
	{ feature: 'Team performance analytics', tiers: [false, true, true] },
	{ feature: 'Custom scorecards', tiers: [false, true, true] },
	{ feature: 'AI team onboarding (from your website)', tiers: [false, true, true] },
	{ feature: 'CRM connections', tiers: [false, true, true] },
	{ feature: 'Priority support', tiers: [false, true, true] },
	{ feature: 'White-glove setup', tiers: [false, true, true] },
	{ feature: 'SSO / SAML', tiers: [false, false, true] },
	{ feature: 'Admin controls and role-based permissions', tiers: [false, false, true] },
	{ feature: 'Custom API access', tiers: [false, false, true] },
	{ feature: 'Dedicated account manager', tiers: [false, false, true] },
	{ feature: 'Custom integrations', tiers: [false, false, true] },
	{ feature: 'Compliance and audit logging', tiers: [false, false, true] },
	{ feature: 'Custom SLA', tiers: [false, false, true] },
]

/* ---------- FAQ data (pricing-specific, 8 questions per brief) ---------- */

const FAQ_ITEMS = [
	{
		question: 'What happens after the 3-day trial?',
		answer: `Your subscription starts at $${PRICING.individual.monthly}/mo unless you cancel. You keep all your scores, progress, and skill data.`,
	},
	{
		question: 'Can I cancel anytime?',
		answer: 'Yes. No contracts. No cancellation fees. Monthly billing, cancel whenever you want.',
	},
	{
		question: "What's included in the 3-day trial?",
		answer: 'Everything. Full access to all Closer features: create your own roleplays, full coaching breakdowns for every call, every industry, every scenario. No features locked during the trial.',
	},
	{
		question: 'How does team pricing work?',
		answer: `$${PRICING.teams.monthly}/mo per user billed monthly. ${PRICING.teams.annualDiscount * 100}% off when you pay annually. Add or remove reps anytime. Your team gets everything in Closer plus the manager dashboard and analytics.`,
	},
	{
		question: 'Is there a minimum for Teams?',
		answer: 'No minimums. Start with 2 reps or 200. No annual contracts required.',
	},
	{
		question: 'Does Enterprise include SSO and audit logs?',
		answer: 'Yes. Enterprise adds single sign-on (SSO / SAML), role-based admin controls, compliance and audit logging, custom SLA, and enterprise-grade security on top of everything in Teams. Book a demo for volume pricing and a custom integration scope.',
	},
	{
		question: 'How is the yearly discount calculated?',
		answer: `Closer yearly billing is $${PRICING.individual.yearly}/yr, which works out to $${PRICING.individual.effectiveMonthly}/mo -- a ${PRICING.yearlySavingsPercent}% savings vs monthly billing. Teams annual is ${PRICING.teams.annualDiscount * 100}% off the $${PRICING.teams.monthly}/user/mo rate.`,
	},
	{
		question: 'How is this different from Rilla, Siro, and Hyperbound?',
		answer: `Enterprise AI coaching platforms charge $200+ per rep per month with annual contracts and 5-user minimums. CloserCoach gives you the same AI scoring and call analysis plus roleplay training for $${PRICING.individual.monthly}/mo with no contracts and no minimums. Same coaching, 15-27x cheaper.`,
	},
]

/* ---------- Trust signal logos ---------- */

/* F3-L1 (2026-04-24): width/height set to native SVG viewBox proportions so
 * Next Image keeps intrinsic aspect ratio. CSS `h-6 w-auto` caps the row to
 * uniform height; width scales from the native ratio. Prior 64-72 × 28
 * dimensions forced 2.3-2.6:1 on logos whose native ratios range 1:1 to 7:1,
 * visibly squishing Toyota, State Farm, and RE/MAX. */
const TRUST_LOGOS = [
	{ src: '/logos/toyota.svg', alt: 'Toyota', w: 168, h: 24 },
	{ src: '/logos/state-farm.svg', alt: 'State Farm', w: 171, h: 24 },
	{ src: '/logos/vivint.svg', alt: 'Vivint', w: 24, h: 24 },
	{ src: '/logos/fidelity.svg', alt: 'Fidelity', w: 92, h: 28 },
	{ src: '/logos/remax.svg', alt: 'RE/MAX', w: 152, h: 28 },
] as const

/* ---------- Label tone map ---------- */

const labelToneClass: Record<'emerald' | 'amber' | 'slate', string> = {
	emerald: 'text-cc-accent',
	amber: 'text-cc-amber',
	slate: 'text-cc-text-secondary',
}

/* ---------- FAQ accordion item ---------- */

function FAQItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[number]; isOpen: boolean; onToggle: () => void }) {
	return (
		<div className='border-b border-cc-surface-border'>
			<button
				type='button'
				onClick={onToggle}
				className='flex w-full items-center justify-between py-5 text-left'
				aria-expanded={isOpen}
			>
				<span className='pr-4 text-base font-medium text-white'>{item.question}</span>
				<CaretDown
					size={20}
					weight='bold'
					className={`shrink-0 text-cc-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>
			<div
				className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
			>
				<div className='overflow-hidden'>
					<p className='pb-5 text-sm leading-relaxed text-cc-text-secondary'>
						{item.answer}
					</p>
				</div>
			</div>
		</div>
	)
}

/* ---------- Main content ---------- */

/**
 * @description Full pricing page content with Closer/Teams/Enterprise tier cards,
 * monthly/yearly toggle, feature comparison, competitor context, trust strip,
 * FAQ accordion, and bottom CTA with store badges.
 */
export default function PricingContent() {
	const [yearly, setYearly] = useState(false)
	const [openFaq, setOpenFaq] = useState(0)
	/* Wave J.2 (FIX-02 P1): mobile compare tier switcher. Defaults to 'teams'
	 * (the highlighted tier in the cards above) so the most relevant tier loads
	 * first. Index maps to TIERS order: 0=closer, 1=teams, 2=enterprise. */
	const [compareTier, setCompareTier] = useState<0 | 1 | 2>(1)

	return (
		<div className='bg-cc-foundation'>
			{/* ---- Section 1: Header + Toggle ---- */}
			<section className='relative overflow-hidden py-24 md:py-32'>
				<AtmosphereNoise opacity={0.02} />

				<div className='relative z-10 mx-auto max-w-7xl px-6 2xl:max-w-[1440px]'>
					<ScrollReveal className='mx-auto flex max-w-2xl flex-col items-center gap-4 text-center'>
						<span className='font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-cc-accent/70'>
							Pricing
						</span>
						<h1 className='display-lg text-white'>
							Pick your plan
						</h1>
						<p className='text-lg text-cc-text-secondary'>
							Less than a lunch. More reps closed.
						</p>

						{/* Billing toggle. Verified working 2026-05-01 LS-005 — `yearly`
						 * state flips on click, all 3 tier cards derive prices from
						 * `tier.getPrice(yearly)`. */}
						<div className='mt-6 flex items-center gap-3'>
							<span className={`text-sm ${!yearly ? 'text-white' : 'text-cc-text-secondary'}`}>
								Monthly
							</span>
							<button
								type='button'
								onClick={() => {
									const next = !yearly
									setYearly(next)
									track('pricing_tier_select', {
										interaction: 'billing_toggle',
										billing: next ? 'yearly' : 'monthly',
									})
								}}
								className={`relative h-7 w-12 rounded-full transition-colors ${yearly ? 'bg-cc-accent' : 'bg-cc-surface-card'}`}
								role='switch'
								aria-checked={yearly}
								aria-label='Toggle annual billing'
							>
								<span
									className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${yearly ? 'translate-x-5' : 'translate-x-0'}`}
								/>
							</button>
							<span className={`text-sm ${yearly ? 'text-white' : 'text-cc-text-secondary'}`}>
								Yearly
							</span>
							{yearly && (
								<span className='rounded-full bg-cc-accent/10 px-2.5 py-0.5 text-xs font-medium text-cc-accent'>
									Save {PRICING.yearlySavingsPercent}%
								</span>
							)}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 2: Tier Cards ---- */}
			<section className='pb-24 md:pb-32'>
				<div className='mx-auto max-w-7xl px-6 2xl:max-w-[1440px]'>
					<div className='grid grid-cols-1 gap-6 lg:grid-cols-3 2xl:gap-8'>
						{TIERS.map((tier, i) => {
							const price = tier.getPrice(yearly)
							return (
								<ScrollReveal key={tier.key} delay={i * 0.1}>
									<div
										{...(tier.highlighted ? { 'data-primary-cta': '' } : {})}
										/* Wave R FIX-04 (2026-04-27): Enterprise (i===2) bg flipped
										 * from bg-cc-foundation (which matched the section behind
										 * it, making the border invisible and the card look
										 * bottomless) to bg-cc-surface-card so the bordered frame
										 * reads with the same visual weight as Teams. */
										className={`relative flex h-full flex-col rounded-xl border p-8 ${
											tier.highlighted
												? 'border-cc-accent bg-cc-surface-card shadow-[0_0_64px_-24px_rgba(16,185,129,0.35)] ring-1 ring-cc-accent/25'
												: 'border-cc-surface-border bg-cc-surface-card'
										}`}
									>
										{/* Most Popular badge (top-right absolute, Closer only) */}
										{/* F3-M4 (2026-04-24): text-cc-foundation (~11:1) replaces
										 * text-white (2.85:1) on emerald bg. WCAG AA for small text
										 * requires 4.5:1. */}
										{tier.highlighted && (
											<span className='absolute -top-3 right-6 rounded-full bg-cc-accent px-3 py-1 text-xs font-semibold text-cc-foundation'>
												{tier.badge}
											</span>
										)}

										{/* Tier label (Geist Mono overline) */}
										<span className={`font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] ${labelToneClass[tier.labelTone]}`}>
											{tier.label}
										</span>

										{/* Tier subtitle */}
										<p className='mt-2 text-sm text-cc-text-secondary'>{tier.subtitle}</p>

										{/* Price — Lora Bold for the headline amount + the
										 * "Custom" enterprise label, per Andy 2026-04-27. */}
										<div className='mt-6 flex items-baseline gap-1'>
											<span
												className='text-5xl font-bold text-white'
												style={{ fontFamily: 'var(--font-heading)' }}
											>
												{price.amount}
											</span>
											{price.period && (
												<span className='text-base text-cc-text-secondary'>{price.period}</span>
											)}
										</div>
										{price.note && (
											<p className='mt-1 text-xs text-cc-text-muted'>{price.note}</p>
										)}

										{/* Trial line */}
										{tier.trial && (
											<p className='mt-3 text-sm text-cc-accent'>{tier.trial}</p>
										)}

										{/* CTA. Wrapped in span+onClickCapture to instrument
										 * pricing_tier_select without modifying MotionCTA. */}
										<div
											className='mt-6'
											onClickCapture={() => track('pricing_tier_select', {
												tier: tier.key,
												billing: yearly ? 'yearly' : 'monthly',
												cta_text: tier.cta.text,
												destination: tier.cta.href,
											})}
										>
											<MotionCTA
												href={tier.cta.href}
												variant={tier.ctaVariant}
												size='md'
												className='w-full'
											>
												{tier.cta.text}
											</MotionCTA>
										</div>

										{/* Features */}
										<ul className='mt-8 flex flex-1 flex-col gap-3'>
											{tier.features.map((feat) => (
												<li key={feat} className='flex items-start gap-2.5 text-sm text-cc-text-secondary'>
													<Check size={16} weight='bold' className='mt-0.5 shrink-0 text-cc-accent' />
													<span>{feat}</span>
												</li>
											))}
										</ul>
									</div>
								</ScrollReveal>
							)
						})}
					</div>

					{/* Wave I FIX-04: unified disclaimer below all 3 cards. The
					    no-minimums copy applies to every tier semantically and was
					    previously trapped in the Teams card, creating ~150px dead
					    space and uneven card bottom edges at 1280-1440. */}
					<p className='mt-8 text-center text-xs text-cc-text-muted'>
						No minimums. No annual contracts. Add or remove reps anytime.
					</p>
				</div>
			</section>

			{/* ---- Section 3: Feature Comparison Table ---- */}
			<section className='pb-24 md:pb-32'>
				<div className='mx-auto max-w-7xl px-6 2xl:max-w-[1440px]'>
					<ScrollReveal>
						<h2 className='display-md mb-12 text-center text-white'>
							Compare plans
						</h2>
					</ScrollReveal>

					{/* Desktop table. Wave C1 (Q17 A30): sticky thead so column tier
					 * names (Closer / Teams / Enterprise) stay visible while scrolling
					 * the long row list. Top offset = banner height + header height
					 * (~64px) so the row stays clear of the announcement bar + main
					 * sticky header. Background painted on the inner cell wrappers
					 * to opaque-mask the rows scrolling underneath. */}
					<ScrollReveal>
						{/* Wave C1 (Q17 A30): drop `overflow-x-auto` so the thead's
						 * sticky offset is computed against the viewport rather than
						 * the wrapper's scroll container (overflow:auto on either
						 * axis creates a scroll container that traps sticky). 4 cols
						 * fit easily at lg+ (1024+). */}
						<div className='hidden lg:block'>
							<table className='w-full text-left'>
								<thead
									className='sticky z-10'
									style={{ top: 'calc(var(--cc-banner-h, 0px) + 64px)' }}
								>
									<tr className='border-b border-cc-surface-border bg-cc-foundation'>
										<th className='bg-cc-foundation pb-4 pr-4 pt-4 text-sm font-medium text-cc-text-secondary'>Feature</th>
										<th className='bg-cc-foundation pb-4 pt-4 text-center text-sm font-medium text-cc-accent'>Closer</th>
										<th className='bg-cc-foundation pb-4 pt-4 text-center text-sm font-medium text-cc-text-secondary'>Teams</th>
										<th className='bg-cc-foundation pb-4 pt-4 text-center text-sm font-medium text-cc-text-secondary'>Enterprise</th>
									</tr>
								</thead>
								<tbody>
									{COMPARISON_ROWS.map((row) => (
										<tr key={row.feature} className='border-b border-cc-surface-border/50'>
											<td className='py-3.5 pr-4 text-sm text-cc-text-secondary'>{row.feature}</td>
											{row.tiers.map((included, j) => (
												<td key={j} className='py-3.5 text-center'>
													{included
														? <Check size={18} weight='bold' className='mx-auto text-cc-accent' />
														: <Minus size={18} className='mx-auto text-cc-text-muted' />
													}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</ScrollReveal>

					{/* Wave J.2 (FIX-02 P1) — Mobile + tablet: tier-tab switcher.
					    Replaces the prior 3x details-accordion pattern that produced
					    ~800-1000px of mostly-empty space at <md (em-dash placeholders
					    for unavailable features looked like broken layout).
					    Linear / Resend pricing mobile uses this segmented-control
					    pattern: 3 tier pills at top + vertical feature checklist for
					    the selected tier only. */}
					<div className='flex flex-col gap-6 lg:hidden'>
						<ScrollReveal>
							<div
								role='tablist'
								aria-label='Compare plan features by tier'
								className='grid grid-cols-3 gap-1.5 rounded-full border border-cc-surface-border bg-cc-surface-card p-1.5'
							>
								{(['Closer', 'Teams', 'Enterprise'] as const).map((tierName, tierIdx) => {
									const idx = tierIdx as 0 | 1 | 2
									const active = compareTier === idx
									return (
										<button
											key={tierName}
											type='button'
											role='tab'
											aria-selected={active}
											aria-controls={`compare-panel-${idx}`}
											id={`compare-tab-${idx}`}
											onClick={() => setCompareTier(idx)}
											className={`inline-flex h-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
												active
													? 'bg-cc-accent text-cc-foundation'
													: 'text-cc-text-secondary hover:text-white'
											}`}
										>
											{tierName}
										</button>
									)
								})}
							</div>
						</ScrollReveal>
						<ScrollReveal>
							<div
								role='tabpanel'
								id={`compare-panel-${compareTier}`}
								aria-labelledby={`compare-tab-${compareTier}`}
								className='rounded-xl border border-cc-surface-border bg-cc-surface-card p-5'
							>
								<ul className='flex flex-col gap-3'>
									{COMPARISON_ROWS.map((row) => {
										const included = row.tiers[compareTier]
										return (
											<li key={row.feature} className='flex items-center gap-2.5 text-sm'>
												{included ? (
													<Check size={16} weight='bold' className='shrink-0 text-cc-accent' />
												) : (
													<Minus size={16} className='shrink-0 text-cc-text-muted' />
												)}
												<span className={included ? 'text-cc-text-secondary' : 'text-cc-text-muted line-through decoration-cc-text-muted/40'}>
													{row.feature}
												</span>
											</li>
										)
									})}
								</ul>
							</div>
						</ScrollReveal>
					</div>
				</div>
			</section>

			{/* ---- Section 4: Competitor Context Anchor ---- */}
			<section className='pb-24 md:pb-32'>
				<div className='mx-auto max-w-7xl px-6 2xl:max-w-[1440px]'>
					<ScrollReveal>
						<div className='rounded-xl border border-cc-surface-border bg-cc-surface-card p-8 md:p-12'>
							<div className='flex flex-col items-center gap-4 text-center'>
								<div className='flex items-baseline gap-4'>
									<span
										className='text-5xl font-bold text-cc-amber md:text-6xl'
										style={{ fontFamily: 'var(--font-heading)' }}
									>
										${PRICING.individual.monthly}
									</span>
									<span
										className='text-xl font-bold text-cc-text-muted line-through md:text-2xl'
										style={{ fontFamily: 'var(--font-heading)' }}
									>
										$200+
									</span>
								</div>
								<p className='max-w-2xl text-lg text-cc-text-secondary'>
									15-27x cheaper than Rilla, Siro, Hyperbound. No minimums. No annual lock-in.
								</p>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 5: Trust Signals ---- */}
			<section className='pb-24 md:pb-32'>
				<div className='mx-auto max-w-7xl px-6 2xl:max-w-[1440px]'>
					<ScrollReveal className='flex flex-col items-center gap-6'>
						<p className='text-center text-sm text-cc-text-secondary'>
							<span className='font-[family-name:var(--font-mono)] font-medium text-white'>{STATS.userCount}</span>{' '}
							closers.{' '}
							<span className='font-[family-name:var(--font-mono)] font-medium text-white'>{STATS.appStoreRating}</span>
							<span className='text-cc-amber'>★</span>{' '}
							App Store.{' '}
							<span className='font-[family-name:var(--font-mono)] font-medium text-white'>{STATS.appStoreReviews}</span>{' '}
							reviews.
						</p>
						<div className='flex flex-wrap items-center justify-center gap-8'>
							{TRUST_LOGOS.map((logo) => (
								<Image
									key={logo.alt}
									src={logo.src}
									alt={logo.alt}
									width={logo.w}
									height={logo.h}
									className='h-6 w-auto opacity-40 grayscale'
								/>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 6: FAQ Accordion ---- */}
			<section className='pb-24 md:pb-32'>
				<div className='mx-auto max-w-3xl px-6'>
					<ScrollReveal>
						<h2 className='display-md mb-10 text-center text-white'>
							Frequently asked questions
						</h2>
					</ScrollReveal>
					<ScrollReveal>
						<div>
							{FAQ_ITEMS.map((item, i) => (
								<FAQItem
									key={item.question}
									item={item}
									isOpen={openFaq === i}
									onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
								/>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 7: Bottom CTA ---- */}
			<section className='relative overflow-hidden py-24 md:py-32'>
				<AtmosphereNoise opacity={0.02} />

				<div className='relative z-10 mx-auto max-w-7xl px-6 2xl:max-w-[1440px]'>
					<ScrollReveal className='mx-auto flex max-w-2xl flex-col items-center gap-6 text-center'>
						<h2 className='display-lg text-white'>
							Your first AI coaching session takes 60 seconds.
						</h2>

						{/* Store badges */}
						<div className='flex flex-row items-center justify-center gap-3 pt-2'>
							<Link href={BRAND.appStore} aria-label='Download on the App Store'>
								<Image
									src='/images/app-store-badge.svg'
									alt='Download on the App Store'
									width={120}
									height={40}
								/>
							</Link>
							<Link href={BRAND.googlePlay} aria-label='Get it on Google Play'>
								<Image
									src='/images/google-play-badge.svg'
									alt='Get it on Google Play'
									width={135}
									height={40}
								/>
							</Link>
						</div>

						{/* Dual CTA */}
						<div className='flex flex-col items-center gap-3 sm:flex-row'>
							<MotionCTA variant='primary' size='md' href={CTA.startFree.href}>
								{CTA.startFree.text}
							</MotionCTA>
							<MotionCTA variant='secondary' size='md' href={CTA.contactSales.href}>
								{CTA.contactSales.text}
							</MotionCTA>
						</div>
					</ScrollReveal>
				</div>
			</section>
		</div>
	)
}
