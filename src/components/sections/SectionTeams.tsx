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
 *  - 'hero'           : Card 1 (col-span-2, row 1). Tallest visual area.
 *  - 'narrow'         : Card 2 (col-span-1, row 1). Matches hero height so row
 *                       1 reads as a balanced 2/1 split.
 *  - 'equal'          : Card 3 (col-span-1, row 2). Title+body top, visual
 *                       bottom (default vertical stack).
 *  - 'equal-inverted' : Card 4 (col-span-1, row 2). INVERTED — visual TOP
 *                       (~60%), title+body BOTTOM (~40%) per Figma 81-5069.
 *                       Wave S 2026-04-27.
 *  - 'split-equal'    : Card 5 (col-span-1, row 2). HORIZONTAL split at lg+ —
 *                       title+body LEFT (~40%), visual RIGHT (~60%) per Figma
 *                       81-4739. Collapses to vertical at <lg. Wave S 2026-04-27.
 *  - 'split-full'     : Card 6 (col-span-3, row 3). HORIZONTAL split at lg+ —
 *                       title+body LEFT (~40%), hub-spoke RIGHT (~60%) per
 *                       Figma 81-4702. Collapses to vertical at <lg. Wave S
 *                       2026-04-27 (replaces former 'full' with vertical
 *                       stack + lg:max-w-2xl text constraint).
 */
type FeatureRole = 'hero' | 'narrow' | 'equal' | 'equal-inverted' | 'split-equal' | 'split-full'

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
		role: 'equal-inverted',
	},
	{
		chapter: '[05]',
		title: 'Hire Better, Faster',
		body: 'Send candidates a roleplay challenge before they interview.',
		Visual: HireBetterFasterVisual,
		role: 'split-equal',
	},
	{
		chapter: '[06]',
		title: 'Integrate Your Existing Sales Technology',
		body: 'Salesforce. HubSpot. GoHighLevel. Request a connection to the tools your team already uses.',
		Visual: IntegrateSalesTechVisual,
		role: 'split-full',
	},
] as const

/* ── Bento card ── */

/* Per-role span class on lg+ (matches the 3-row asymmetric composition).
 * Below lg the grid is single-col so spans are inert. */
const roleSpanClass: Record<FeatureRole, string> = {
	hero: 'lg:col-span-2',
	narrow: 'lg:col-span-1',
	equal: 'lg:col-span-1',
	'equal-inverted': 'lg:col-span-1',
	'split-equal': 'lg:col-span-1',
	'split-full': 'lg:col-span-3',
}

/* Per-role visual area height. Hero + narrow share the same height to keep
 * row 1 visually balanced. Equal cards (row 2) drop a touch shorter so the
 * three-up reads as its own beat. equal-inverted reuses equal so row 2
 * cards line up vertically. split-equal + split-full ignore this map and
 * size the visual via flex-basis on the right column instead. */
const roleVisualHeight: Record<FeatureRole, string> = {
	hero: 'h-[300px] md:h-[360px]',
	narrow: 'h-[280px] md:h-[360px]',
	equal: 'h-[300px]',
	'equal-inverted': 'h-[300px]',
	'split-equal': 'h-[300px]',
	'split-full': 'h-[280px] md:h-[300px]',
}

/* Title display class. Hero + split-full carry the larger Lora display-sm
 * treatment; narrow + equal + equal-inverted + split-equal stay on the
 * body-scale title. */
const roleUsesDisplayTitle: Record<FeatureRole, boolean> = {
	hero: true,
	narrow: false,
	equal: false,
	'equal-inverted': false,
	'split-equal': false,
	'split-full': true,
}

function BentoCard({ feature, index }: { feature: Feature; index: number }): ReactElement {
	const { role, Visual } = feature
	const displayTitle = roleUsesDisplayTitle[role]
	const isInverted = role === 'equal-inverted'
	const isSplit = role === 'split-equal' || role === 'split-full'

	const titleNode = (
		<h3
			className={`text-trim text-white ${displayTitle ? 'display-sm' : 'text-xl font-semibold'}`}
			style={{ fontFamily: displayTitle ? 'var(--font-heading)' : undefined, lineHeight: 1.2 }}
		>
			{feature.title}
		</h3>
	)
	const bodyNode = (
		<p className={`text-trim text-cc-text-secondary ${displayTitle ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
			{feature.body}
		</p>
	)
	const chapterNode = (
		<span
			aria-hidden='true'
			className='absolute right-5 top-5 z-10 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wider text-cc-accent/70'
		>
			{feature.chapter}
		</span>
	)

	/* ── Horizontal split layout (Cards 5 + 6 at lg+) ──
	 * At <lg the flex-row collapses to flex-col so the title sits ABOVE the
	 * visual (mobile vertical stack). At lg+ the title+body claim ~40-45% on
	 * the left and the visual claims ~55-60% on the right. The visual gets a
	 * fixed height to anchor the row. */
	if (isSplit) {
		return (
			<Reveal delay={index * 0.05} className={roleSpanClass[role]}>
				<article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cc-surface-border bg-cc-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-cc-surface-border-hover hover:shadow-[0_0_32px_rgba(16,185,129,0.12)] lg:flex-row'>
					{chapterNode}
					{/* Text column — top on mobile, left on lg+ */}
					<div className='flex flex-1 flex-col justify-center gap-3 p-6 md:p-8 lg:basis-[42%] lg:pr-4'>
						{titleNode}
						{bodyNode}
					</div>
					{/* Visual column — bottom on mobile, right on lg+ */}
					<div
						className={`relative w-full overflow-hidden ${roleVisualHeight[role]} lg:h-auto lg:basis-[58%] lg:self-stretch`}
					>
						<Visual />
						{/* Mobile vignette only — at lg+ the visual sits on its own
						 * column edge so the bottom fade would clip the right side
						 * of the card oddly. */}
						<div
							aria-hidden='true'
							className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-cc-surface-card/80 lg:hidden'
						/>
					</div>
				</article>
			</Reveal>
		)
	}

	/* ── Vertical stack — inverted (Card 4 at all breakpoints) ──
	 * Visual TOP (~60%), title+body BOTTOM (~40%). Inverted layout is kept
	 * on mobile too for narrative consistency (the timeline is the hook). */
	if (isInverted) {
		return (
			<Reveal delay={index * 0.05} className={roleSpanClass[role]}>
				<article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cc-surface-border bg-cc-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-cc-surface-border-hover hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]'>
					{chapterNode}
					{/* Visual on TOP */}
					<div className={`relative w-full overflow-hidden ${roleVisualHeight[role]}`}>
						<Visual />
						{/* Soft bottom vignette into the body block below */}
						<div
							aria-hidden='true'
							className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-cc-surface-card/80'
						/>
					</div>
					{/* Body on BOTTOM */}
					<div className='flex flex-1 flex-col gap-3 p-6 md:p-8'>
						{titleNode}
						{bodyNode}
					</div>
				</article>
			</Reveal>
		)
	}

	/* ── Default vertical stack — title+body TOP, visual BOTTOM (Cards 1, 2, 3) ──
	 * Per Figma 93-16838: title block sits at the top of the card, visual
	 * anchors the bottom. Wave M shipped this reversed (visual-top, body-
	 * bottom for all cards). Wave S corrects the default role to title-first
	 * so cards 1/2/3 read as the master frame intends. */
	return (
		<Reveal delay={index * 0.05} className={roleSpanClass[role]}>
			<article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cc-surface-border bg-cc-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-cc-surface-border-hover hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]'>
				{chapterNode}
				{/* Body on TOP */}
				<div className='flex flex-col gap-3 p-6 md:p-8'>
					{titleNode}
					{bodyNode}
				</div>
				{/* Visual on BOTTOM — mt-auto pushes it to the card's bottom edge so
				 * cards in the same row keep aligned visual baselines even when
				 * body copy lengths differ. */}
				<div className={`relative mt-auto w-full overflow-hidden ${roleVisualHeight[role]}`}>
					<Visual />
					{/* Soft top vignette so the visual seats against the body block above */}
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-t from-transparent to-cc-surface-card/80'
					/>
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
