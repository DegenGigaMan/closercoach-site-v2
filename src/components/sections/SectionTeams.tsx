/** @fileoverview S6 Teams — Wave M bento rebuild per Figma 93-16838 (2026-04-26).
 *
 * Six-card bento, 3-row asymmetric composition per Andy's 2026-04-26 master
 * frame. Wave M replaces Wave F.4's PNG visuals with React-rendered
 * compositions (each card hand-designed per its Figma sub-node).
 *
 * Parent container: 1232x1159 desktop frame -> max-w-[1232px] at lg+.
 *
 *   ROW 1 (2/1 split, ~503px tall)
 *     01 Coach Reps At Scale (93:16849) -- col-span-2, calendar mockup
 *     02 Know Where Every Rep Stands (93:16986) -- col-span-1, rep score stack
 *
 *   ROW 2 (1/1/1 equal, ~340px tall)
 *     03 Onboard New Reps 10x Faster (81:5018) -- progress bar viz
 *     04 Enforce New Scripting Efficiently (81:5069) -- vertical timeline
 *     05 Hire Better, Faster (81:4739) -- candidate ranking list
 *
 *   ROW 3 (full, ~316px tall)
 *     06 Integrate Your Existing Sales Technology (81:4702) -- hub-and-spoke
 *
 * Card body (title + supporting copy) sits beneath each visual on the same
 * surface. Hover lifts the card and intensifies the emerald surround.
 *
 * Tablet (md, 768-1024px): single-column stack -- the cards are content-dense
 * and 2-col makes them cramped. Bento spans only activate at lg+ (1024px+).
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
 * (6.4:1), emerald #10B981 chapter (4.83:1). */

'use client'

import Image from 'next/image'
import { useRef, type ReactElement, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND } from '@/lib/constants'
import CoachRepsAtScaleVisual from './teams-bento/CoachRepsAtScaleVisual'
import KnowEveryRepVisual from './teams-bento/KnowEveryRepVisual'
import OnboardFasterVisual from './teams-bento/OnboardFasterVisual'
import EnforceScriptingVisual from './teams-bento/EnforceScriptingVisual'
import HireBetterFasterVisual from './teams-bento/HireBetterFasterVisual'
import IntegrateSalesTechVisual from './teams-bento/IntegrateSalesTechVisual'

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

/* Layout role drives both the lg+ column span and the visual area height per
 * Figma 93-16838 master frame. Each card's visual is a hand-coded React
 * composition imported from ./teams-bento/*Visual.
 *
 *  - 'hero'    : Card 1 (col-span-2, row 1). Tallest visual area.
 *  - 'narrow'  : Card 2 (col-span-1, row 1). Matches hero card height so
 *                row 1 reads as a balanced 2/1 split.
 *  - 'equal'   : Cards 3-5 (col-span-1, row 2). Equal mid-height.
 *  - 'full'    : Card 6 (col-span-3, row 3). Wide horizontal composition.
 */
type FeatureRole = 'hero' | 'narrow' | 'equal' | 'full'

type Feature = {
	chapter: string
	title: string
	body: string
	Visual: () => ReactElement
	role: FeatureRole
}

const FEATURES: readonly Feature[] = [
	{
		chapter: '[01]',
		title: 'Coach Reps At Scale',
		body: 'AI handles the repetitions so your coaching time goes to the moments that actually need you.',
		Visual: CoachRepsAtScaleVisual,
		role: 'hero',
	},
	{
		chapter: '[02]',
		title: 'Know Where Every Rep Stands',
		body: 'See every rep’s performance from one dashboard.',
		Visual: KnowEveryRepVisual,
		role: 'narrow',
	},
	{
		chapter: '[03]',
		title: 'Onboard New Reps 10x Faster',
		body: 'New reps practice before they ever talk to a customer.',
		Visual: OnboardFasterVisual,
		role: 'equal',
	},
	{
		chapter: '[04]',
		title: 'Enforce New Scripting Efficiently',
		body: 'Roll out a new talk track and push it as a structured practice.',
		Visual: EnforceScriptingVisual,
		role: 'equal',
	},
	{
		chapter: '[05]',
		title: 'Hire Better, Faster',
		body: 'Send candidates a roleplay challenge before they interview.',
		Visual: HireBetterFasterVisual,
		role: 'equal',
	},
	{
		chapter: '[06]',
		title: 'Integrate Your Existing Sales Technology',
		body: 'Salesforce. HubSpot. GoHighLevel. Request a connection to the tools your team already uses.',
		Visual: IntegrateSalesTechVisual,
		role: 'full',
	},
] as const

/* ── Bento card ── */

/* Per-role span class on lg+ (matches the 3-row asymmetric composition).
 * Below lg the grid is single-col so spans are inert. */
const roleSpanClass: Record<FeatureRole, string> = {
	hero: 'lg:col-span-2',
	narrow: 'lg:col-span-1',
	equal: 'lg:col-span-1',
	full: 'lg:col-span-3',
}

/* Per-role visual area height. Hero + narrow share the same height to keep
 * row 1 visually balanced. Equal cards (row 2) drop a touch shorter so the
 * three-up reads as its own beat. Full-width Card 6 carries the shortest
 * fixed visual so the hub-and-spoke composition sits centered without the
 * card stretching too tall horizontally. */
const roleVisualHeight: Record<FeatureRole, string> = {
	hero: 'h-[300px] md:h-[360px]',
	narrow: 'h-[280px] md:h-[360px]',
	equal: 'h-[300px]',
	full: 'h-[200px] md:h-[240px]',
}

/* Title display class. Hero + full carry the larger Lora display-sm
 * treatment; narrow + equal stay on the body-scale title. */
const roleUsesDisplayTitle: Record<FeatureRole, boolean> = {
	hero: true,
	narrow: false,
	equal: false,
	full: true,
}

function BentoCard({ feature, index }: { feature: Feature; index: number }): ReactElement {
	const { role, Visual } = feature
	const isFull = role === 'full'
	const displayTitle = roleUsesDisplayTitle[role]

	return (
		<Reveal delay={index * 0.05} className={roleSpanClass[role]}>
			<article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cc-surface-border bg-cc-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-cc-surface-border-hover hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]'>
				<span
					aria-hidden='true'
					className='absolute right-5 top-5 z-10 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wider text-cc-accent/70'
				>
					{feature.chapter}
				</span>
				{/* Visual plate -- React composition rendered into a foundation
				 * surface seat. Each card's visual is its own component file in
				 * ./teams-bento/. */}
				<div className={`relative w-full overflow-hidden ${roleVisualHeight[role]}`}>
					<Visual />
					{/* Soft top-down vignette to keep the visual seated against
					 * the card body below. */}
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-cc-surface-card/80'
					/>
				</div>
				{/* Body -- title + supporting copy. Full-width Card 6 uses an
				 * Option-A inner layout: title + body left-aligned in a left
				 * column on lg+ so the hub-and-spoke visual above breathes. */}
				<div className={`flex flex-1 flex-col gap-3 p-6 md:p-8 ${isFull ? 'lg:max-w-2xl' : ''}`}>
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

			{/* Wave M (2026-04-26): cap at Figma master-frame 1232px. Wave J.3's
			 * 2xl:max-w-[1440px] kept the rest of the page wide but the bento
			 * needs to land at the spec'd 1232 so the hand-coded card visuals
			 * read at their intended density. Heading + logo wall + CTAs sit
			 * inside the same 1232 rail for vertical alignment. */}
			<div className='relative z-10 mx-auto max-w-[1232px] px-6'>
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
						<em className='text-cc-accent'>Teams.</em>
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

				{/* ── Bento feature grid (3-row asymmetric per Andy reference 2026-04-26) ── */}
				{/* Mobile / tablet (<lg, ≤1023px): single-column stack, all 6 cards
				 * stack 1-up in source order (Coach → Know Where → Onboard →
				 * Enforce → Hire → Integrate). Desktop (lg+, 1024px+): 3-col grid
				 * where per-card lg:col-span-* drives the asymmetric layout. */}
				<div className='mt-20 grid grid-cols-1 gap-4 md:mt-24 md:gap-5 lg:grid-cols-3 lg:gap-6'>
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
						<MotionCTA variant='primary' size='lg' href={BRAND.calendly} dataPrimaryCta>
							Book a Demo
						</MotionCTA>
						<MotionCTA variant='secondary' size='lg' href='/download' dataPrimaryCta>
							Try for Free
						</MotionCTA>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
