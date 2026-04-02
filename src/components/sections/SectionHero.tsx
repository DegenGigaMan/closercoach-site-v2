/** @fileoverview S1 Hero section. Split layout: text left, phone mockup right.
 * Atmosphere: L1 radial gradient, L2 noise, L3 particles.
 * Copy locked to lp-copy-deck-v5. */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import ParticleCanvas from '@/components/atmosphere/particle-canvas'
import PhoneMockup from '@/components/ui/phone-mockup'
import { BRAND, STATS, CTA } from '@/lib/constants'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

const fadeUp = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, delay, ease: EASE },
})

/**
 * @description S1 Hero with two-column split (55/45). Left: headline, subheadline,
 * body, proof anchor, CTAs, store badges. Right: animated phone mockup with
 * 4-state product flow. Atmosphere layers behind content.
 */
export default function SectionHero() {
	return (
		<section
			id="hero"
			data-surface="dark-hero"
			className="relative min-h-screen overflow-hidden bg-cc-foundation"
		>
			{/* L1: Radial gradient atmosphere */}
			<div
				className="pointer-events-none absolute inset-0 z-[0]"
				aria-hidden="true"
				style={{
					background: 'radial-gradient(ellipse 80% 80% at 70% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)',
				}}
			/>

			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.03} />

			{/* L3: Particles (desktop only) */}
			<div className="hidden md:block">
				<ParticleCanvas mode="ambient" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
				<div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-[55%_45%] md:gap-8">
					{/* Left column: text */}
					<div className="flex flex-col gap-6">
						{/* H1 */}
						<motion.div {...fadeUp(0)}>
							<h1 className="display-xl">
								<span className="text-white">The AI Sales Coach That Lives </span>
								<motion.span
									className="text-[#10B981]"
									initial={{ color: '#FFFFFF' }}
									animate={{ color: '#10B981' }}
									transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
								>
									in Your Pocket
								</motion.span>
							</h1>
						</motion.div>

						{/* Subheadline */}
						<motion.div {...fadeUp(0.1)}>
							<p className="text-lg text-cc-text-secondary">
								Practice closing deals. Record your meetings. Know exactly why you suck. All from your phone.
							</p>
						</motion.div>

						{/* Body copy */}
						<motion.div {...fadeUp(0.2)}>
							<p className="max-w-xl text-base text-cc-text-secondary">
								Load your website, train the AI, and have normal sales conversations. Pick your industry, run a roleplay, and get scored on what matters. No desktop. No setup. No annual contracts. Just open the app and start closing. 60 seconds to start increasing your close rate.
							</p>
						</motion.div>

						{/* Proof anchor */}
						<motion.div {...fadeUp(0.3)}>
							<p className="text-sm text-cc-text-secondary">
								Join{' '}
								<span className="font-semibold text-[#10B981]">{STATS.userCount}</span>
								{' '}Sales Closers getting better.{' '}
								{STATS.appStoreRating} stars, App Store.
							</p>
						</motion.div>

						{/* CTAs */}
						<motion.div {...fadeUp(0.4)} className="flex flex-row flex-wrap gap-4">
							<MotionCTA variant="primary" size="lg" href={CTA.tryFree.href}>
								{CTA.tryFree.text}
							</MotionCTA>
							<MotionCTA variant="secondary" size="lg" href={BRAND.calendly}>
								{CTA.contactSales.text}
							</MotionCTA>
						</motion.div>

						{/* Store badges */}
						<motion.div {...fadeUp(0.5)} className="flex flex-row gap-3">
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
						</motion.div>
					</div>

					{/* Right column: phone mockup (desktop only) */}
					<div className="hidden md:flex md:items-center md:justify-center">
						<PhoneMockup />
					</div>
				</div>
			</div>
		</section>
	)
}
