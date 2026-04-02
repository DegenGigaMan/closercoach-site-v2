/** @fileoverview S2 Social Proof strip. Warm surface with trust label, infinite
 * logo marquee (CSS-only), and stat counters sourced from constants. */

import Image from 'next/image'
import { STATS } from '@/lib/constants'

const LOGOS = [
	{ src: '/logos/toyota.svg', alt: 'Toyota', w: 80, h: 32 },
	{ src: '/logos/state-farm.svg', alt: 'State Farm', w: 80, h: 32 },
	{ src: '/logos/mercedes-benz.svg', alt: 'Mercedes Benz', w: 80, h: 32 },
	{ src: '/logos/morgan-stanley.svg', alt: 'Morgan Stanley', w: 100, h: 32 },
	{ src: '/logos/liberty-mutual.svg', alt: 'Liberty Mutual', w: 100, h: 32 },
	{ src: '/logos/vivint-solar.svg', alt: 'Vivint Solar', w: 80, h: 32 },
	{ src: '/logos/family-first-life.png', alt: 'Family First Life', w: 80, h: 32 },
	{ src: '/logos/aroma360.svg', alt: 'Aroma360', w: 80, h: 32 },
	{ src: '/logos/cardone-capital.webp', alt: 'Cardone Capital', w: 80, h: 32 },
	{ src: '/logos/sysco.svg', alt: 'Sysco', w: 80, h: 32 },
] as const

const STAT_ITEMS = [
	{ value: STATS.userCount, label: 'Closers' },
	{ value: `${STATS.appStoreRating}/5`, label: 'App Store' },
	{ value: STATS.appStoreReviews, label: 'Ratings' },
] as const

/**
 * @description Renders a single pass of logos for the marquee. Duplicated to create
 * seamless infinite scroll via translateX(-50%) keyframe.
 */
function LogoStrip() {
	return (
		<div className="flex shrink-0 items-center gap-12">
			{LOGOS.map((logo) => (
				<Image
					key={logo.alt}
					src={logo.src}
					alt={logo.alt}
					width={logo.w}
					height={logo.h}
					className="h-8 w-auto opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
				/>
			))}
		</div>
	)
}

/**
 * @description S2 Social Proof section. Narrow warm strip with trust label,
 * infinite CSS marquee of 10 client logos, and three stat counters from constants.
 */
export default function SectionSocialProof() {
	return (
		<section id="social-proof" data-surface="warm" className="bg-cc-warm py-12 md:py-16">
			<div className="mx-auto max-w-7xl px-6">
				{/* Trust label */}
				<p className="mb-8 text-center text-xs uppercase tracking-wider text-cc-text-secondary-warm">
					Trusted by closers across Insurance, Financial, Real Estate, Automotive, and Home Services.
				</p>

				{/* Logo marquee */}
				<div className="relative mb-12 overflow-hidden">
					{/* Fade edges */}
					<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cc-warm to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cc-warm to-transparent" />

					<div
						className="flex w-max gap-12"
						style={{ animation: 'marquee-scroll 40s linear infinite' }}
					>
						<LogoStrip />
						<LogoStrip />
					</div>
				</div>

				{/* Stat counters */}
				<div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-0">
					{STAT_ITEMS.map((stat, i) => (
						<div
							key={stat.label}
							className={`flex flex-col items-center${
								i > 0 ? ' md:border-l md:border-cc-warm-border md:px-8' : ' md:px-8'
							}`}
						>
							<span className="mono-stat text-cc-amber">{stat.value}</span>
							<span className="text-sm text-cc-text-secondary-warm">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
