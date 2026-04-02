/** @fileoverview S8 Final CTA section. Dark surface with emerald convergence atmosphere.
 * Centered layout: headline, subheadline, body, store badges, QR code, sales link.
 * Copy locked to lp-copy-deck-v5. */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import ParticleCanvas from '@/components/atmosphere/particle-canvas'
import { BRAND, CTA } from '@/lib/constants'

/**
 * @description S8 Final CTA with emerald convergence atmosphere.
 * L1: tighter radial gradient with cta-breathe animation.
 * L2: noise texture at 0.03 opacity.
 * L3: ParticleCanvas converge mode (desktop only).
 * Content: headline, subheadline, body, store badges, QR code, sales link.
 */
export default function SectionCTA() {
	return (
		<section
			id="cta"
			data-surface="dark-cta"
			className="relative overflow-hidden bg-cc-foundation py-32 md:py-40"
		>
			{/* L1: Emerald convergence gradient */}
			<div
				className="pointer-events-none absolute inset-0 z-[0]"
				aria-hidden="true"
				style={{
					background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.10) 0%, transparent 60%)',
					animation: 'cta-breathe 8s ease-in-out infinite',
				}}
			/>

			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.03} />

			{/* L3: Particles converge (desktop only) */}
			<div className="hidden md:block">
				<ParticleCanvas mode="converge" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
					{/* Headline */}
					<h2 className="display-lg text-white">
						Find out what's actually losing you deals.
					</h2>

					{/* Subheadline */}
					<p className="text-lg text-cc-text-secondary">
						Download. Pick your industry. Start your first roleplay. Get your score. Done.
					</p>

					{/* Body */}
					<p className="text-base text-cc-text-secondary">
						3 days is plenty. Most closers know after one session.
					</p>

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

					{/* QR code */}
					<div className="rounded-xl bg-white p-3">
						<QRCodeSVG
							value={BRAND.appStore}
							size={120}
							bgColor="#FFFFFF"
							fgColor="#0D0F14"
							level="M"
							className="rounded-lg"
						/>
					</div>

					{/* Secondary CTA */}
					<MotionCTA variant="ghost" size="sm" href={CTA.contactSales.href}>
						{CTA.contactSales.text}
					</MotionCTA>
				</div>
			</div>
		</section>
	)
}
