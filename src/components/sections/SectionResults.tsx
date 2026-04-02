/** @fileoverview S5 Results section. Warm surface with proof stats, performance gains,
 * skill radar dashboard, testimonials, and CTA. Copy locked to lp-copy-deck-v5. */

'use client'

import MotionCTA from '@/components/shared/motion-cta'
import ScrollReveal from '@/components/shared/scroll-reveal'
import { STATS, CTA } from '@/lib/constants'
import { Star } from '@phosphor-icons/react'

/* ---------- Data ---------- */

const PROOF_STATS = [
	{ value: STATS.userCount, label: 'Closers' },
	{ value: `${STATS.appStoreRating}/5`, label: 'App Store' },
	{ value: '3000+', label: 'Calls Analyzed Per Day' },
	{ value: '16+', label: 'Industries Served' },
] as const

const PERFORMANCE_GAINS = [
	{ value: STATS.closeRateImprovement, desc: 'increase in close rate' },
	{ value: '50%', desc: 'decrease in ramp time' },
	{ value: '30%', desc: 'increase in weekly talk time' },
] as const

const SKILL_DIMENSIONS = [
	{ label: 'Discovery', pct: 78 },
	{ label: 'Pitch', pct: 65 },
	{ label: 'Objection Handling', pct: 72 },
	{ label: 'Close Rate', pct: 60 },
	{ label: 'Tone', pct: 85 },
	{ label: 'Talk Time', pct: 70 },
] as const

const APP_REVIEWS = [
	{
		text: 'This app went from something that was a nice idea that needed some work to something that is super useful.',
		author: 'App Store Review',
		stars: 5,
	},
	{
		text: 'This app has helped me streamline my process. I am able to get in \u2018reps\u2019 while I learn. Really good with specific scenarios, and helping you with pace, tonality, and goals completed. Really glad I have this too!',
		author: 'DH8125, App Store',
		stars: 5,
	},
] as const

/* ---------- Sub-components ---------- */

/**
 * @description Horizontal proof strip with 4 key stats. Numbers in mono-stat amber,
 * labels in secondary warm text. Responsive: 2x2 grid on mobile, single row desktop.
 */
function ProofStrip() {
	return (
		<div className="grid grid-cols-2 gap-6 md:flex md:items-center md:justify-center md:gap-0">
			{PROOF_STATS.map((stat, i) => (
				<div
					key={stat.label}
					className={`flex flex-col items-center${
						i > 0 ? ' md:border-l md:border-cc-warm-border md:pl-8 md:ml-8' : ''
					}`}
				>
					<span className="mono-stat text-cc-amber">{stat.value}</span>
					<span className="text-sm text-cc-text-secondary-warm">{stat.label}</span>
				</div>
			))}
		</div>
	)
}

/**
 * @description 3-column performance gain cards. Each shows a large amber number
 * with a description below. Warm-secondary background with subtle border.
 */
function PerformanceGains() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
			{PERFORMANCE_GAINS.map((gain) => (
				<div
					key={gain.desc}
					className="rounded-xl border border-cc-warm-border bg-cc-warm-secondary p-6"
				>
					<span className="mono-stat text-cc-amber">{gain.value}</span>
					<p className="mt-1 text-sm text-cc-text-secondary-warm">{gain.desc}</p>
				</div>
			))}
		</div>
	)
}

/**
 * @description Skill radar dashboard using CSS progress bars. Shows 6 skill
 * dimensions with emerald fill bars on warm-secondary background.
 */
function SkillDashboard() {
	return (
		<div className="rounded-xl border border-cc-warm-border bg-cc-warm-secondary p-6 md:p-8">
			<h3 className="display-sm text-cc-text-primary-warm">Your Closer Score Dashboard</h3>
			<div className="mt-2 flex flex-col gap-1">
				<p className="text-sm text-cc-text-secondary-warm">
					Adaptive AI Skill tracking engine learns your sales patterns as you take more calls
				</p>
				<p className="text-sm text-cc-text-secondary-warm">
					Watch your skills improve across discovery, pitching, objection handling.
				</p>
				<p className="text-sm text-cc-text-secondary-warm">
					One click to practice where you&rsquo;re weak.
				</p>
			</div>

			{/* Skill bars */}
			<div className="mt-8 flex flex-col gap-4">
				{SKILL_DIMENSIONS.map((dim) => (
					<div key={dim.label} className="flex items-center gap-4">
						<span className="w-36 shrink-0 text-sm font-medium text-cc-text-primary-warm">
							{dim.label}
						</span>
						<div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cc-warm-border">
							<div
								className="h-full rounded-full bg-cc-accent-hover"
								style={{ width: `${dim.pct}%` }}
							/>
						</div>
						<span className="mono-label w-10 text-right text-cc-accent-hover">
							{dim.pct}%
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

/**
 * @description Star rating display using Phosphor Star icons in amber.
 */
function StarRating({ count }: { count: number }) {
	return (
		<div className="flex gap-0.5">
			{Array.from({ length: count }, (_, i) => (
				<Star key={i} size={16} weight="fill" className="text-cc-amber" />
			))}
		</div>
	)
}

/**
 * @description Dimitriy testimonial card with warm-secondary styling.
 */
function TestimonialDimitriy() {
	return (
		<div className="rounded-xl border border-cc-warm-border bg-cc-warm-secondary p-6">
			<p className="text-base text-cc-text-primary-warm">
				&ldquo;Honestly a great app and a surprisingly well thought out and detail-oriented use of AI. I&rsquo;ve been using CloserCoach to sharpen my skills and get back into sales after being out of the game, it&rsquo;s the most valuable resource I have.&rdquo;
			</p>
			<p className="mt-4 text-sm font-medium text-cc-text-secondary-warm">
				Dimitriy, Insurance Sales
			</p>
		</div>
	)
}

/**
 * @description App Store review card with star rating.
 */
function ReviewCard({ text, author, stars }: { text: string; author: string; stars: number }) {
	return (
		<div className="rounded-xl border border-cc-warm-border bg-cc-warm-secondary p-6">
			<StarRating count={stars} />
			<p className="mt-3 text-base text-cc-text-primary-warm">
				&ldquo;{text}&rdquo;
			</p>
			<p className="mt-4 text-sm font-medium text-cc-text-secondary-warm">
				{author}
			</p>
		</div>
	)
}

/* ---------- Main section ---------- */

/**
 * @description S5 Results section. Warm surface (#F5F0EB) with proof stats,
 * performance gains, skill dashboard, testimonials, and CTA. Content stacks
 * vertically with responsive grids for stats and testimonials.
 */
export default function SectionResults() {
	return (
		<section id="results" data-surface="warm" className="bg-cc-warm py-24 md:py-32">
			<div className="mx-auto max-w-7xl px-6">
				{/* Headline + subheadline */}
				<ScrollReveal className="mb-16 text-center">
					<h2 className="display-lg text-cc-text-primary-warm">
						The Undisputed Leader In Mobile-First Sales Training
					</h2>
					<p className="mt-4 text-lg text-cc-text-secondary-warm">
						{STATS.userCount} closers. Real results.
					</p>
				</ScrollReveal>

				{/* Proof strip */}
				<ScrollReveal delay={0.1}>
					<ProofStrip />
				</ScrollReveal>

				{/* Performance gains */}
				<ScrollReveal className="mt-16" delay={0.15}>
					<PerformanceGains />
				</ScrollReveal>

				{/* Industry benchmark callout */}
				<ScrollReveal delay={0.1}>
					<p className="mt-10 text-center text-sm italic text-cc-text-secondary-warm">
						Coached weekly: {STATS.quotaHitRate} quota hit. Coached quarterly: {STATS.quotaWithout}. CloserCoach coaches you every day.
					</p>
				</ScrollReveal>

				{/* Skill dashboard */}
				<ScrollReveal className="mt-16" delay={0.1}>
					<SkillDashboard />
				</ScrollReveal>

				{/* Data callout */}
				<ScrollReveal delay={0.1}>
					<p className="mt-10 text-center text-sm font-medium text-cc-text-secondary-warm">
						WPM. Clarity. Pace. Tonality. Every session. Every score. Your career in numbers.
					</p>
				</ScrollReveal>

				{/* Ego appeal */}
				<ScrollReveal delay={0.1}>
					<p className="mx-auto mt-10 max-w-3xl text-center text-base text-cc-text-primary-warm">
						After one roleplay you will know: B grade, Top 15%, 211 WPM, 64/36 talk-listen. Every number gets better.
					</p>
				</ScrollReveal>

				{/* Testimonials */}
				<div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
					<ScrollReveal delay={0}>
						<TestimonialDimitriy />
					</ScrollReveal>
					{APP_REVIEWS.map((review, i) => (
						<ScrollReveal key={review.author} delay={(i + 1) * 0.1}>
							<ReviewCard
								text={review.text}
								author={review.author}
								stars={review.stars}
							/>
						</ScrollReveal>
					))}
				</div>

				{/* CTA */}
				<ScrollReveal className="mt-16 flex justify-center" delay={0.1}>
					<MotionCTA variant="primary" size="lg" href={CTA.tryFree.href} warmSurface>
						{CTA.tryFree.text}
					</MotionCTA>
				</ScrollReveal>
			</div>
		</section>
	)
}
