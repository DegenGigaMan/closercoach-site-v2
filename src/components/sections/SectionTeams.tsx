/** @fileoverview S6 Teams — Wave F.4 bento rebuild 2026-04-26.
 *
 * Six-card bento with Figma-derived card visuals:
 *   01 Coach reps at scale (93:16849) -- col-span-2 hero, calendar/before
 *   02 Know where every rep stands (93:16986) -- single col, leaderboard
 *   03 Onboard reps 1-x faster (81:5018) -- single col, progress bars
 *   04 Enforce New Scripting Efficiently (81:5069) -- single col, vertical timeline
 *   05 Hire Better, Faster (81:4739) -- single col, candidate pill list
 *   06 Integrate Your Existing Sales Technology (81:4702) -- col-span-3 full, hub-and-spoke
 *
 * Visuals are 1:1 Figma exports rendered at the top of each card
 * (rounded, with a soft inner gradient to seat the visual against the
 * cc-surface-card background). Title + body sit beneath the visual on a
 * darker plate. Hover state lifts the card and intensifies the emerald
 * surround (shared treatment with prior bento for continuity).
 *
 * PRIOR constellation hero (stat pills + growth chart + 3 inline features)
 * KILLED 2026-04-20. Center-aligned heading + 6-logo manager wall (SP2)
 * preserved. Cost-of-Inaction + Competitive Pricing rows hidden 2026-04-23.
 *
 * Surface: dark (cc-foundation #0D0F14). Returns from S5.5 warm.
 * Copy locked to lp-copy-deck-v5 § Section 6.
 *
 * Hydration safety: Reveal uses stable initial props; useReducedMotion
 * handled by the shared wrapper. F42 safe.
 *
 * WCAG AA on dark: white headings (21:1), cc-text-secondary #94A3B8 body
 * (6.4:1), emerald #10B981 chapter (4.83:1). Card visuals carry alt text
 * tied to the card title for screen-reader context. */

'use client'

import Image from 'next/image'
import { useRef, type ReactElement, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND } from '@/lib/constants'

/* ── Reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactNode
	className?: string
	delay?: number
}

/**
 * @description Fades + lifts children on scroll. Stable initial props so SSR
 * matches first client render. Collapses to 0s under reduced-motion per F42.
 */
function Reveal({ children, className = '', delay = 0 }: RevealProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement | null>(null)
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 18 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
			transition={
				prefersReducedMotion
					? { duration: 0 }
					: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }
			}
		>
			{children}
		</motion.div>
	)
}

/* ── Manager logo wall (SP2) ── */

/* Figma-locked logo set + order per node 63:3441. Sunrun is a pre-white
 * variant so it opts out of the brightness-0 invert filter. Per-logo
 * heightClass mirrors the Figma optical weight band (20-32px tall). */
const MANAGER_LOGOS = [
	{ src: '/logos/toyota.svg', alt: 'Toyota', w: 168, h: 24, heightClass: 'h-6', preWhite: false },
	{ src: '/logos/state-farm.svg', alt: 'State Farm', w: 171, h: 24, heightClass: 'h-6', preWhite: false },
	{ src: '/logos/sunrun-white.svg', alt: 'Sunrun', w: 105, h: 20, heightClass: 'h-5', preWhite: true },
	{ src: '/logos/land-rover.svg', alt: 'Land Rover', w: 61, h: 32, heightClass: 'h-8', preWhite: false },
	{ src: '/logos/remax.svg', alt: 'RE/MAX', w: 152, h: 28, heightClass: 'h-7', preWhite: false },
	{ src: '/logos/fidelity.svg', alt: 'Fidelity', w: 92, h: 28, heightClass: 'h-7', preWhite: false },
] as const

/* ── Bento feature cards (6) ── */

type FeatureSpan = 'hero' | 'full' | 'default'

type Feature = {
	chapter: string
	title: string
	body: string
	visualSrc: string
	visualWidth: number
	visualHeight: number
	span?: FeatureSpan
}

const FEATURES: readonly Feature[] = [
	{
		chapter: '[01]',
		title: 'Coach Reps At Scale',
		body: 'AI handles the repetitions so your coaching time goes to the moments that actually need you.',
		visualSrc: '/images/teams-bento/coach-reps-at-scale.png',
		visualWidth: 744,
		visualHeight: 424,
		span: 'hero',
	},
	{
		chapter: '[02]',
		title: 'Know Where Every Rep Stands',
		body: 'See every rep’s performance from one dashboard.',
		visualSrc: '/images/teams-bento/know-where-every-rep-stands.png',
		visualWidth: 332,
		visualHeight: 194,
	},
	{
		chapter: '[03]',
		title: 'Onboard New Reps 10x Faster',
		body: 'New reps practice before they ever talk to a customer.',
		visualSrc: '/images/teams-bento/onboard-reps-faster.png',
		visualWidth: 470,
		visualHeight: 201,
	},
	{
		chapter: '[04]',
		title: 'Enforce New Scripting Efficiently',
		body: 'Roll out a new talk track and push it as a structured practice.',
		visualSrc: '/images/teams-bento/enforce-new-scripting.png',
		visualWidth: 181,
		visualHeight: 219,
	},
	{
		chapter: '[05]',
		title: 'Hire Better, Faster',
		body: 'Send candidates a roleplay challenge before they interview.',
		visualSrc: '/images/teams-bento/hire-better-faster.png',
		visualWidth: 355,
		visualHeight: 381,
	},
	{
		chapter: '[06]',
		title: 'Integrate Your Sales Stack',
		body: 'Salesforce. HubSpot. GoHighLevel. Request a connection to the tools your team already uses.',
		visualSrc: '/images/teams-bento/integrate-sales-tech.png',
		visualWidth: 460,
		visualHeight: 228,
		span: 'full',
	},
] as const

/* ── Bento card ── */

function BentoCard({ feature, index }: { feature: Feature; index: number }): ReactElement {
	const heroSpan = feature.span === 'hero'
	const fullSpan = feature.span === 'full'
	const displayTitle = heroSpan || fullSpan
	const spanClass = heroSpan ? 'md:col-span-2' : fullSpan ? 'md:col-span-3' : ''

	/* Visual container height. Hero card gets the most room (260px), full
	 * span lands shorter (200px) since its composition is wider, and the
	 * default cards get a fixed 200px so the leaderboard / progress / list
	 * compositions read cleanly without forcing the card too tall. */
	const visualHeightClass = heroSpan
		? 'h-[260px] md:h-[300px]'
		: fullSpan
			? 'h-[200px] md:h-[220px]'
			: 'h-[200px]'

	return (
		<Reveal delay={index * 0.05} className={spanClass}>
			<article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cc-surface-border bg-cc-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-cc-surface-border-hover hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]'>
				<span
					aria-hidden='true'
					className='absolute right-5 top-5 z-10 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wider text-cc-accent/70'
				>
					{feature.chapter}
				</span>
				{/* Visual plate -- darker than the card body to seat the rendered
				 * mini-illustration. Inner emerald glow on hover lifts the
				 * composition without pulling focus from the title beneath. */}
				<div className={`relative w-full overflow-hidden bg-cc-foundation ${visualHeightClass}`}>
					<Image
						src={feature.visualSrc}
						alt={`${feature.title} visual`}
						fill
						sizes={
							heroSpan
								? '(min-width: 768px) 66vw, 100vw'
								: fullSpan
									? '100vw'
									: '(min-width: 768px) 33vw, 100vw'
						}
						className='object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]'
						priority={index < 2}
					/>
					{/* Soft top-down vignette to keep the visual seated against
					 * the card body below. */}
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-cc-surface-card/80'
					/>
				</div>
				{/* Body -- title + supporting copy. */}
				<div className={`flex flex-1 flex-col gap-3 p-6 md:p-8 ${fullSpan ? 'md:flex-row md:items-center md:gap-8' : ''}`}>
					<h3
						className={`text-trim text-white ${displayTitle ? 'display-sm' : 'text-xl font-semibold'}`}
						style={{ fontFamily: displayTitle ? 'var(--font-heading)' : undefined, lineHeight: 1.2 }}
					>
						{feature.title}
					</h3>
					<p className={`text-trim text-cc-text-secondary ${displayTitle ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
						{feature.body}
					</p>
				</div>
			</article>
		</Reveal>
	)
}

/* ── Main section ── */

/**
 * @description S6 Teams section. Center-aligned hero block (heading +
 * subhead + "Join 35+" social proof line + logo wall) over a 6-card bento
 * grid with Figma-derived per-card visuals, and dual CTAs.
 */
export default function SectionTeams(): ReactElement {
	return (
		<section
			id='teams'
			data-surface='dark-teams'
			className='relative overflow-hidden bg-cc-foundation py-24 md:py-32'
		>
			<AtmosphereNoise opacity={0.02} />

			<div className='relative z-10 mx-auto max-w-7xl px-6'>
				{/* ── Top block (center-aligned) ── */}
				<Reveal className='flex flex-col items-center gap-5 text-center'>
					<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-cc-accent'>
						For Sales Managers
					</span>
					<h2
						className='text-trim display-lg max-w-3xl text-white md:text-[3.5rem]'
						style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.08 }}
					>
						CloserCoach for{' '}
						<em className='not-italic'>
							<span className='italic text-cc-accent'>Teams.</span>
						</em>
					</h2>
					<p className='max-w-2xl text-lg text-cc-text-secondary md:text-xl'>
						Over 20,000 closers already use CloserCoach individually. Now give your
						whole team the same edge.
					</p>
				</Reveal>

				{/* ── Social proof line + manager logo wall ── */}
				<Reveal delay={0.08} className='mt-10 flex flex-col items-center gap-6'>
					<p
						className='text-center text-base text-white/90 md:text-lg'
						style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
					>
						Join 35+ sales teams scaling with CloserCoach.
					</p>
					<div className='flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6 md:flex-nowrap md:justify-between md:gap-x-8'>
						{MANAGER_LOGOS.map((logo) => (
							<Image
								key={logo.alt}
								src={logo.src}
								alt={logo.alt}
								width={logo.w}
								height={logo.h}
								className={`${logo.heightClass} w-auto opacity-60 transition-opacity duration-300 hover:opacity-95${logo.preWhite ? '' : ' brightness-0 invert'}`}
							/>
						))}
					</div>
				</Reveal>

				{/* ── Bento feature grid (6 cards, Figma-derived visuals) ── */}
				<div className='mt-20 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-3 md:gap-5'>
					{FEATURES.map((feature, i) => (
						<BentoCard key={feature.title} feature={feature} index={i} />
					))}
				</div>

				{/* ── CTAs ── */}
				<Reveal delay={0.1} className='mt-12 flex flex-col items-center gap-5 sm:gap-6'>
					<p className='text-center text-base text-cc-text-secondary md:text-lg'>
						Want to scale your sales team training?
					</p>
					<div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
						<MotionCTA variant='primary' size='lg' href={BRAND.calendly}>
							Book a Demo
						</MotionCTA>
						<MotionCTA variant='secondary' size='lg' href='/download'>
							Try for Free
						</MotionCTA>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
