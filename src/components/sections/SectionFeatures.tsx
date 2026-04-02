/** @fileoverview S4 Feature Deep Dives section. Dark masonry grid with 5 feature cards,
 * each using SpotlightCard hover effect. Stripe vertical guide lines. Copy locked to v5 canvas. */

'use client'

import { Target, Phone, MagnifyingGlass, ChartLineUp, Lightning } from '@phosphor-icons/react'
import SpotlightCard from '@/components/ui/spotlight-card'
import MotionCTA from '@/components/shared/motion-cta'
import ScrollReveal from '@/components/shared/scroll-reveal'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { CTA } from '@/lib/constants'

const FEATURES = [
	{
		icon: Target,
		title: 'Daily Roleplay Drills',
		body: 'Three fresh sales scenarios every day so your skills never go cold.',
	},
	{
		icon: Phone,
		title: 'AI Dialer + Notetaker',
		body: 'Call directly from the app or hit record in the room -- either way, AI captures the conversation, scores the call, and writes your notes.',
	},
	{
		icon: MagnifyingGlass,
		title: 'Pre-Call Preparation',
		body: 'Know your prospect, your angles, and your talk track before you ever say hello.',
	},
	{
		icon: ChartLineUp,
		title: 'Skills Progression Tracking',
		body: 'See exactly how your discovery, objection handling, close rate, and more improve over time. Call by call, rep by rep.',
	},
	{
		icon: Lightning,
		title: 'Cash Cards',
		body: 'Flashcards built around real objections so you always know exactly what to say when it counts.',
	},
] as const

/**
 * @description Feature card with Phosphor icon, title, one-liner body.
 * Wrapped in SpotlightCard for mouse-tracked emerald gradient hover.
 */
function FeatureCard({ icon: Icon, title, body }: typeof FEATURES[number]) {
	return (
		<SpotlightCard
			className="rounded-xl border border-cc-surface-border bg-cc-surface-card transition-colors duration-300 hover:border-cc-surface-border-hover"
		>
			<div className="p-6 md:p-8">
				<Icon size={32} weight="duotone" className="mb-4 text-cc-accent" />
				<h3 className="display-sm mb-2 text-white">{title}</h3>
				<p className="text-sm text-cc-text-secondary">{body}</p>
			</div>
		</SpotlightCard>
	)
}

/**
 * @description S4 Feature Deep Dives. Transition zone heading + 5-card masonry grid (3+2 desktop,
 * single column mobile). Stripe vertical guide lines at 25/50/75%. Bottom CTA centered.
 */
export default function SectionFeatures() {
	return (
		<section
			id="features"
			data-surface="dark-features"
			className="relative overflow-hidden bg-cc-foundation py-24 md:py-32"
		>
			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.02} />

			{/* Stripe vertical guide lines */}
			<div className="pointer-events-none absolute inset-0" aria-hidden="true">
				<div className="absolute inset-y-0 left-1/4 w-px border-l border-white/[0.03]" />
				<div className="absolute inset-y-0 left-1/2 w-px border-l border-white/[0.03]" />
				<div className="absolute inset-y-0 left-3/4 w-px border-l border-white/[0.03]" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-7xl px-6">
				{/* Transition zone heading */}
				<ScrollReveal>
					<h2 className="display-lg mb-16 pt-10 text-center text-white md:mb-20">
						An AI Sales Operating System in Your Pocket
					</h2>
				</ScrollReveal>

				{/* Masonry grid: 3 top + 2 bottom centered */}
				<div className="flex flex-col gap-4">
					{/* Top row: 3 cards */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{FEATURES.slice(0, 3).map((feature, i) => (
							<ScrollReveal key={feature.title} delay={i * 0.1}>
								<FeatureCard {...feature} />
							</ScrollReveal>
						))}
					</div>

					{/* Bottom row: 2 cards centered */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:mx-auto md:max-w-[66.666%]">
						{FEATURES.slice(3).map((feature, i) => (
							<ScrollReveal key={feature.title} delay={(i + 3) * 0.1}>
								<FeatureCard {...feature} />
							</ScrollReveal>
						))}
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="flex justify-center pt-16">
					<MotionCTA variant="primary" size="lg" href={CTA.tryFree.href}>
						{CTA.tryFree.text}
					</MotionCTA>
				</div>
			</div>
		</section>
	)
}
