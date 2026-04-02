/** @fileoverview Pricing page client component with billing toggle, 3 tier cards,
 * feature comparison table, competitor context, trust signals, FAQ accordion, and bottom CTA.
 * Copy locked to vault/clients/closer-coach/copy/pages/pricing.md. */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Minus, CaretDown } from '@phosphor-icons/react'
import MotionCTA from '@/components/shared/motion-cta'
import ScrollReveal from '@/components/shared/scroll-reveal'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND, CTA, PRICING, STATS } from '@/lib/constants'

/* ---------- Tier data ---------- */

const TIERS = [
	{
		name: 'Sales Rep',
		badge: 'Most Popular',
		highlighted: true,
		getPrice: (yearly: boolean) => yearly
			? { amount: `$${PRICING.individual.effectiveMonthly}`, period: '/mo', note: `Billed $${PRICING.individual.yearly}/yr` }
			: { amount: `$${PRICING.individual.monthly}`, period: '/mo', note: null },
		trial: `${STATS.trialDays} days free. Full access. No credit card required.`,
		cta: { text: CTA.tryFree.text, href: CTA.tryFree.href },
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
			'Surprise Me (random AI-generated scenarios)',
		],
	},
	{
		name: 'Teams',
		badge: 'Best for Teams',
		highlighted: false,
		getPrice: (yearly: boolean) => yearly
			? { amount: `$${PRICING.teams.monthly}`, period: '/user/mo', note: `${PRICING.teams.annualDiscount * 100}% off annual` }
			: { amount: `$${PRICING.teams.monthly}`, period: '/user/mo', note: null },
		trial: null,
		cta: { text: CTA.contactSales.text, href: CTA.contactSales.href },
		ctaVariant: 'secondary' as const,
		features: [
			'Everything in Sales Rep, plus:',
			'Manager web dashboard',
			'Team analytics and performance tracking',
			'Custom scorecards and talk tracks',
			'AI-powered team onboarding (enter your website, AI builds training)',
			'CRM connections (Salesforce, HubSpot, GoHighLevel)',
			'Priority support',
			'1:1 white-glove setup call',
		],
		footerNote: 'No minimums. No annual contracts. Add or remove reps anytime.',
	},
	{
		name: 'Enterprise',
		badge: 'For Large Organizations',
		highlighted: false,
		getPrice: () => ({ amount: PRICING.enterprise.label, period: '', note: null }),
		trial: null,
		cta: { text: CTA.contactSales.text, href: CTA.contactSales.href },
		ctaVariant: 'ghost' as const,
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

/* ---------- FAQ data ---------- */

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
		answer: 'Everything. Full access to all Sales Rep features: create your own roleplays, full coaching breakdowns for every call, every industry, every scenario. No features locked during the trial.',
	},
	{
		question: 'How does team pricing work?',
		answer: `$${PRICING.teams.monthly}/mo per user. ${PRICING.teams.annualDiscount * 100}% off annual. Add or remove reps anytime. Your team gets everything in the Sales Rep plan plus the manager dashboard and analytics.`,
	},
	{
		question: 'Is there a minimum for Teams?',
		answer: 'No minimums. Start with 2 reps or 200.',
	},
	{
		question: 'Who is CloserCoach for?',
		answer: 'CloserCoach is built for sales reps and closers who make calls for a living -- door-to-door, cold calling, field sales, inside sales, and everything in between. If you are on the phone selling, CloserCoach will make you better at it.',
	},
	{
		question: 'How is this different from other sales tools?',
		answer: `Free YouTube videos and podcasts are passive -- you watch, you forget. Enterprise coaching platforms charge $200+ per rep per month and lock you into annual contracts. A one-time sales course gives you theory for $2,000 and no follow-through. CloserCoach scores you on every conversation, coaches you on exactly what went wrong, and serves daily practice scenarios built from your real calls. Active reps, not passive content.`,
	},
	{
		question: 'Can I train CloserCoach on my scripts and sales techniques?',
		answer: "Yes. Upload your scripts, objection handlers, and sales methodology so CloserCoach scores and coaches you against the way your business actually sells. The more calls you log, the more it adapts to your style, your market, and your buyers.",
	},
	{
		question: 'Does it actually help me close more deals?',
		answer: `CloserCoach scores you across ${STATS.skillDimensions} dimensions on every call -- objection handling, tonality, discovery depth, closing technique, rapport, pacing, and product knowledge. Run 15 AI roleplays a month, record your real calls through the built-in dialer, and watch the scorecard show you exactly which dimension is costing you deals. Closers who practice daily see their weak dimensions climb within weeks.`,
	},
	{
		question: 'How secure is my data and call recordings?',
		answer: 'Calls and recordings are encrypted in transit and at rest. Your data is yours. We do not sell it, share it, or use it to train models for other customers. You can delete your recordings at any time from your account settings.',
	},
	{
		question: 'Is my coaching session recorded?',
		answer: "AI roleplays are processed in real time and not stored as audio files. Ridealong records real sales calls through the built-in dialer so the AI can score them -- those recordings are encrypted, stored in your account, and deletable at any time. If you are in a two-party consent state, you are responsible for informing the other party before using Ridealong on a live call. The built-in dialer supports adding a consent notice to the start of recorded calls. Check your state's recording laws before using Ridealong in meetings.",
	},
	{
		question: 'What languages are supported?',
		answer: 'AI roleplays are available in English. Spanish is available upon request. Teams of 10+ reps with other language needs can contact support.',
	},
	{
		question: 'Can this integrate with my CRM and/or dialer?',
		answer: 'CloserCoach connects with popular CRMs and dialers on request. Teams of 10+ reps can request custom integrations.',
	},
	{
		question: 'I have a large team. Do you have volume pricing?',
		answer: 'The Teams plan includes everything in Sales Rep plus manager dashboards, rep-level performance tracking, shared scorecards, and the ability to upload team-wide scripts and playbooks. Reach out to our sales team for pricing based on team size.',
	},
	{
		question: 'Are there seat minimums or contracts?',
		answer: 'No minimums. No contracts. No cancellation fees. Monthly billing, cancel whenever you want.',
	},
	{
		question: 'How do I contact you?',
		answer: `Use the Intercom live widget at the bottom right of this page. We read and respond to every message within 1 hour during business hours. You can also email ${BRAND.email}.`,
	},
]

/* ---------- Trust signal logos ---------- */

const TRUST_LOGOS = [
	{ src: '/logos/toyota.svg', alt: 'Toyota', w: 64, h: 28 },
	{ src: '/logos/state-farm.svg', alt: 'State Farm', w: 72, h: 28 },
	{ src: '/logos/vivint.svg', alt: 'Vivint', w: 64, h: 28 },
	{ src: '/logos/fidelity.svg', alt: 'Fidelity', w: 72, h: 28 },
	{ src: '/logos/remax.svg', alt: 'RE/MAX', w: 64, h: 28 },
] as const

/* ---------- FAQ accordion item ---------- */

function FAQItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[number]; isOpen: boolean; onToggle: () => void }) {
	return (
		<div className="border-b border-cc-surface-border">
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between py-5 text-left"
				aria-expanded={isOpen}
			>
				<span className="pr-4 text-base font-medium text-white">{item.question}</span>
				<CaretDown
					size={20}
					weight="bold"
					className={`shrink-0 text-cc-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>
			<div
				className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
			>
				<div className="overflow-hidden">
					<p className="pb-5 text-sm leading-relaxed text-cc-text-secondary">
						{item.answer}
					</p>
				</div>
			</div>
		</div>
	)
}

/* ---------- Main content ---------- */

/**
 * @description Full pricing page content with billing toggle, 3 tier cards,
 * feature comparison table, competitor context anchor, trust signals,
 * FAQ accordion, and bottom CTA with store badges.
 */
export default function PricingContent() {
	const [yearly, setYearly] = useState(false)
	const [openFaq, setOpenFaq] = useState(0)

	return (
		<div className="bg-cc-foundation">
			{/* ---- Section 1: Headline + Toggle ---- */}
			<section className="relative overflow-hidden py-24 md:py-32">
				<AtmosphereNoise opacity={0.02} />

				<div className="relative z-10 mx-auto max-w-7xl px-6">
					<ScrollReveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
						<h1 className="display-lg text-white">
							Pick your plan
						</h1>
						<p className="text-lg text-cc-text-secondary">
							Less than a lunch. More reps closed.
						</p>

						{/* Billing toggle */}
						<div className="mt-4 flex items-center gap-3">
							<span className={`text-sm ${!yearly ? 'text-white' : 'text-cc-text-secondary'}`}>
								Monthly
							</span>
							<button
								type="button"
								onClick={() => setYearly(!yearly)}
								className={`relative h-7 w-12 rounded-full transition-colors ${yearly ? 'bg-cc-accent' : 'bg-cc-surface-card'}`}
								role="switch"
								aria-checked={yearly}
								aria-label="Toggle annual billing"
							>
								<span
									className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${yearly ? 'translate-x-5' : 'translate-x-0'}`}
								/>
							</button>
							<span className={`text-sm ${yearly ? 'text-white' : 'text-cc-text-secondary'}`}>
								Yearly
							</span>
							{yearly && (
								<span className="rounded-full bg-cc-accent/10 px-2.5 py-0.5 text-xs font-medium text-cc-accent">
									Save {PRICING.yearlySavingsPercent}%
								</span>
							)}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 2: Tier Cards ---- */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{TIERS.map((tier, i) => {
							const price = tier.getPrice(yearly)
							return (
								<ScrollReveal key={tier.name} delay={i * 0.1}>
									<div
										className={`flex h-full flex-col rounded-xl border p-8 ${
											tier.highlighted
												? 'border-cc-accent bg-cc-surface-card ring-1 ring-cc-accent/20'
												: i === 2
													? 'border-cc-surface-border bg-cc-foundation'
													: 'border-cc-surface-border bg-cc-surface-card'
										}`}
									>
										{/* Badge */}
										<span className={`mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${
											tier.highlighted
												? 'bg-cc-accent/10 text-cc-accent'
												: 'bg-cc-surface-border text-cc-text-secondary'
										}`}>
											{tier.badge}
										</span>

										{/* Tier name */}
										<h3 className="display-sm text-white">{tier.name}</h3>

										{/* Price */}
										<div className="mt-4 flex items-baseline gap-1">
											<span className="font-[family-name:var(--font-mono)] text-4xl font-medium text-white">
												{price.amount}
											</span>
											{price.period && (
												<span className="text-sm text-cc-text-secondary">{price.period}</span>
											)}
										</div>
										{price.note && (
											<p className="mt-1 text-xs text-cc-text-muted">{price.note}</p>
										)}

										{/* Trial line */}
										{tier.trial && (
											<p className="mt-3 text-sm text-cc-accent">{tier.trial}</p>
										)}

										{/* CTA */}
										<div className="mt-6">
											<MotionCTA
												href={tier.cta.href}
												variant={tier.ctaVariant}
												size="md"
												className="w-full"
											>
												{tier.cta.text}
											</MotionCTA>
										</div>

										{/* Features */}
										<ul className="mt-8 flex flex-1 flex-col gap-3">
											{tier.features.map((feat) => (
												<li key={feat} className="flex items-start gap-2.5 text-sm text-cc-text-secondary">
													<Check size={16} weight="bold" className="mt-0.5 shrink-0 text-cc-accent" />
													<span>{feat}</span>
												</li>
											))}
										</ul>

										{/* Footer note (Teams) */}
										{'footerNote' in tier && tier.footerNote && (
											<p className="mt-6 border-t border-cc-surface-border pt-4 text-xs text-cc-text-muted">
												{tier.footerNote}
											</p>
										)}
									</div>
								</ScrollReveal>
							)
						})}
					</div>
				</div>
			</section>

			{/* ---- Section 3: Feature Comparison Table ---- */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6">
					<ScrollReveal>
						<h2 className="display-md mb-12 text-center text-white">
							Compare plans
						</h2>
					</ScrollReveal>

					{/* Desktop table */}
					<ScrollReveal>
						<div className="hidden overflow-x-auto md:block">
							<table className="w-full text-left">
								<thead>
									<tr className="border-b border-cc-surface-border">
										<th className="pb-4 pr-4 text-sm font-medium text-cc-text-secondary">Feature</th>
										<th className="pb-4 text-center text-sm font-medium text-cc-text-secondary">Sales Rep</th>
										<th className="pb-4 text-center text-sm font-medium text-cc-accent">Teams</th>
										<th className="pb-4 text-center text-sm font-medium text-cc-text-secondary">Enterprise</th>
									</tr>
								</thead>
								<tbody>
									{COMPARISON_ROWS.map((row) => (
										<tr key={row.feature} className="border-b border-cc-surface-border/50">
											<td className="py-3.5 pr-4 text-sm text-cc-text-secondary">{row.feature}</td>
											{row.tiers.map((included, j) => (
												<td key={j} className="py-3.5 text-center">
													{included
														? <Check size={18} weight="bold" className="mx-auto text-cc-accent" />
														: <Minus size={18} className="mx-auto text-cc-text-muted" />
													}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</ScrollReveal>

					{/* Mobile: accordion per tier */}
					<div className="flex flex-col gap-6 md:hidden">
						{['Sales Rep', 'Teams', 'Enterprise'].map((tierName, tierIdx) => (
							<ScrollReveal key={tierName} delay={tierIdx * 0.1}>
								<details className="group rounded-xl border border-cc-surface-border bg-cc-surface-card">
									<summary className={`flex cursor-pointer items-center justify-between p-5 text-base font-medium ${
										tierIdx === 1 ? 'text-cc-accent' : 'text-white'
									}`}>
										{tierName}
										<CaretDown
											size={18}
											weight="bold"
											className="text-cc-text-secondary transition-transform duration-200 group-open:rotate-180"
										/>
									</summary>
									<ul className="flex flex-col gap-2.5 px-5 pb-5">
										{COMPARISON_ROWS.map((row) => (
											<li key={row.feature} className="flex items-center gap-2.5 text-sm">
												{row.tiers[tierIdx]
													? <Check size={16} weight="bold" className="shrink-0 text-cc-accent" />
													: <Minus size={16} className="shrink-0 text-cc-text-muted" />
												}
												<span className={row.tiers[tierIdx] ? 'text-cc-text-secondary' : 'text-cc-text-muted'}>
													{row.feature}
												</span>
											</li>
										))}
									</ul>
								</details>
							</ScrollReveal>
						))}
					</div>
				</div>
			</section>

			{/* ---- Section 4: Competitor Context Anchor ---- */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6">
					<ScrollReveal>
						<div className="rounded-xl border border-cc-surface-border bg-cc-surface-card p-8 md:p-10">
							<p className="mx-auto max-w-3xl text-center text-lg text-cc-text-secondary">
								Enterprise AI coaching runs{' '}
								<span className="font-[family-name:var(--font-mono)] font-medium text-cc-amber">$200+</span>{' '}
								per rep per month with annual contracts and 5-user minimums. CloserCoach gives you the same AI scoring, the same call analysis, and roleplay training on top of it. For{' '}
								<span className="font-[family-name:var(--font-mono)] font-medium text-cc-amber">${PRICING.individual.monthly}</span>.
							</p>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 5: Trust Signals ---- */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-7xl px-6">
					<ScrollReveal className="flex flex-col items-center gap-6">
						<p className="text-center text-sm text-cc-text-secondary">
							<span className="font-[family-name:var(--font-mono)] font-medium text-white">{STATS.userCount}</span>{' '}
							closers.{' '}
							<span className="font-[family-name:var(--font-mono)] font-medium text-white">{STATS.appStoreRating}</span>{' '}
							stars.{' '}
							<span className="font-[family-name:var(--font-mono)] font-medium text-white">{STATS.appStoreReviews}</span>{' '}
							App Store ratings.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-8">
							{TRUST_LOGOS.map((logo) => (
								<Image
									key={logo.alt}
									src={logo.src}
									alt={logo.alt}
									width={logo.w}
									height={logo.h}
									className="h-6 w-auto opacity-40 grayscale"
								/>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ---- Section 6: FAQ Accordion ---- */}
			<section className="pb-24 md:pb-32">
				<div className="mx-auto max-w-3xl px-6">
					<ScrollReveal>
						<h2 className="display-md mb-10 text-center text-white">
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
			<section className="relative overflow-hidden py-24 md:py-32">
				<AtmosphereNoise opacity={0.02} />

				<div className="relative z-10 mx-auto max-w-7xl px-6">
					<ScrollReveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
						<h2 className="display-lg text-white">
							Your first AI coaching session takes 60 seconds.
						</h2>

						{/* Store badges */}
						<div className="flex flex-row items-center justify-center gap-3 pt-2">
							<Link href={BRAND.appStore}>
								<Image
									src="/images/app-store-badge.svg"
									alt="Download on the App Store"
									width={135}
									height={40}
								/>
							</Link>
							<Link href={BRAND.googlePlay}>
								<Image
									src="/images/google-play-badge.svg"
									alt="Get it on Google Play"
									width={135}
									height={40}
								/>
							</Link>
						</div>

						{/* Contact Sales */}
						<MotionCTA variant="ghost" size="sm" href={CTA.contactSales.href}>
							{CTA.contactSales.text}
						</MotionCTA>
					</ScrollReveal>
				</div>
			</section>
		</div>
	)
}
