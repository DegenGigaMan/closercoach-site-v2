/** @fileoverview S6 Teams — Wave U bento per Figma 93-16838 (2026-04-27).
 *
 * Six-card bento, 3-row asymmetric composition per Andy's 2026-04-26 master
 * frame. Wave U corrects Wave M/S/T errors:
 *   ─ Chapter markers ([01]..[06]) removed — were never in Figma.
 *   ─ Gradient fade between visual + body removed — Figma cards are one fill.
 *   ─ Card 5 promoted from row-2 split to row-2+3 tall vertical column.
 *   ─ Card 6 narrowed from col-span-3 to col-span-2 (Card 5 owns col 3).
 *
 * Parent container: 1232x1159 desktop frame -> max-w-[1232px] at lg+.
 *
 *   ROW 1 (2/1 split, ~503px tall)
 *     01 Coach Reps At Scale (93:16849) -- col-span-2, calendar mockup
 *     02 Know Where Every Rep Stands (93:16986) -- col-span-1, rep score stack
 *
 *   ROW 2-3 (left two cols 1/1, right col tall col-span-1 row-span-2)
 *     03 Onboard New Reps 10x Faster (81:5018) -- progress bar viz
 *     04 Enforce New Scripting Efficiently (81:5069) -- vertical timeline
 *     05 Hire Better, Faster (81:4739) -- candidate ranking list (TALL)
 *
 *   ROW 3 (col-span-2 under cards 3+4)
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
import { CompliancePills } from './SectionCompliance'

/* ── Reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactNode
	className?: string
	delay?: number
}

/**
 * @description Fades + lifts children on scroll. Stable initial props so SSR
 * matches first client render. Collapses to 0s under reduced-motion per F42.
 *
 * Phase 8 (Andy 2026-05-01): bento was firing too late + cards were staggered
 * too far apart. Wave X.1's 0.9s duration + 0.18 stagger (then doubled by
 * Wave Y.8 to 1.8s + 0.36) meant Andy was scrolling past the section before
 * the last cards revealed. Tightened: duration 0.55s, stagger 0.08, margin
 * '-10% 0px' -> '0px' so cards reveal as the section enters viewport.
 */
function Reveal({ children, className = '', delay = 0 }: RevealProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement | null>(null)
	const isInView = useInView(ref, { once: true, margin: '0px' })

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
 *  - 'tall'           : Card 5 (col-span-1, ROW-SPAN-2 covering rows 2+3).
 *                       Vertical stack — title+body TOP, visual fills the
 *                       remaining tall column with flex-1 per Figma 81-4739.
 *                       Wave U 2026-04-27 (replaces prior 'split-equal').
 *  - 'split-full'     : Card 6 (col-span-2, row 3). HORIZONTAL split at lg+ —
 *                       title+body LEFT (~40%), hub-spoke RIGHT (~60%) per
 *                       Figma 81-4702. Collapses to vertical at <lg. Wave U
 *                       narrows from col-span-3 to col-span-2 since Card 5
 *                       now owns the third column for both rows 2 and 3.
 */
type FeatureRole = 'hero' | 'narrow' | 'equal' | 'equal-inverted' | 'equal-flow' | 'tall' | 'split-full'

type Feature = {
	title: string
	body: string
	Visual: () => ReactElement
	role: FeatureRole
}

const FEATURES: readonly Feature[] = [
	{
		title: 'Coach Reps At Scale',
		body: 'AI handles the repetitions so your coaching time goes to the moments that actually need you.',
		Visual: CoachRepsAtScaleVisual,
		role: 'hero',
	},
	{
		title: 'Know Where Every Rep Stands',
		body: 'See every rep’s performance from one dashboard.',
		Visual: KnowEveryRepVisual,
		role: 'narrow',
	},
	{
		title: 'Onboard New Reps 10x Faster',
		body: 'New reps practice before they ever talk to a customer.',
		Visual: OnboardFasterVisual,
		role: 'equal',
	},
	{
		title: 'Enforce New Scripting Efficiently',
		body: 'Roll out a new talk track and push it as a structured practice.',
		Visual: EnforceScriptingVisual,
		/* Andy 2026-05-01: flipped from 'equal-inverted' → 'equal-flow' to
		 * match the assignment-flow visual reference (title+body TOP, visual
		 * BOTTOM, ~420px tall). 'equal-flow' is a dedicated tier — the 4-node
		 * Manager → Task → App → Reps stack needs taller breathing room than
		 * the standard 250px 'equal' tier so the emerald rails read cleanly. */
		role: 'equal-flow',
	},
	{
		title: 'Hire Better, Faster',
		body: 'Send candidates a roleplay challenge before they interview.',
		Visual: HireBetterFasterVisual,
		role: 'tall',
	},
	{
		title: 'Integrate Your Existing Sales Technology',
		body: 'Salesforce. HubSpot. GoHighLevel. Request a connection to the tools your team already uses.',
		Visual: IntegrateSalesTechVisual,
		role: 'split-full',
	},
] as const

/* ── Bento card ── */

/* Per-role span class on lg+ (matches the 3-row asymmetric composition).
 * Below lg the grid is single-col so spans are inert. Card 5 (tall) uses
 * lg:row-span-2 so it claims col 3 across rows 2 and 3; Card 6 narrows to
 * col-span-2 so it sits under cards 3+4 only. */
const roleSpanClass: Record<FeatureRole, string> = {
	hero: 'lg:col-span-2',
	narrow: 'lg:col-span-1',
	equal: 'lg:col-span-1',
	'equal-inverted': 'lg:col-span-1',
	'equal-flow': 'lg:col-span-1',
	tall: 'lg:col-span-1 lg:row-span-2',
	'split-full': 'lg:col-span-2',
}

/* Per-role visual area height. Hero + narrow share the same height to keep
 * row 1 visually balanced. Equal cards (row 2) drop a touch shorter so the
 * three-up reads as its own beat. equal-inverted reuses equal so row 2
 * cards line up vertically. tall + split-full ignore this map — tall lets
 * the visual fill remaining flex space, split-full sizes via flex-basis on
 * its right column. */
const roleVisualHeight: Record<FeatureRole, string> = {
	hero: 'h-[300px] md:h-[360px]',
	narrow: 'h-[280px] md:h-[360px]',
	equal: 'h-[230px] md:h-[250px]',
	'equal-inverted': 'h-[230px] md:h-[250px]',
	/* Andy 2026-05-01: 'equal-flow' is for the Enforce New Scripting card.
	 * Matches the 'equal' tier (230/250px) so the row-2 grid lockstep keeps
	 * both Onboard and Enforce cards at the same total height (~412px).
	 * The flow-visual elements are tuned compact (sm rails, 24px manager
	 * badge, 36px app icon, 32px avatars) so the assignment flow still
	 * reads cleanly inside the 250px visual area. */
	'equal-flow': 'h-[230px] md:h-[250px]',
	tall: 'flex-1',
	'split-full': 'h-[280px] md:h-[300px]',
}

function BentoCard({ feature, index }: { feature: Feature; index: number }): ReactElement {
	const { role, Visual } = feature
	const isInverted = role === 'equal-inverted'
	const isSplit = role === 'split-full'
	const isTall = role === 'tall'

	/* Title typography per Figma 93:16840: Lora Bold 24px white, line-height
	 * 1.2 — same on every card (no hero / body split). */
	const titleNode = (
		<h3
			className='text-trim text-white text-[24px] font-bold'
			style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}
		>
			{feature.title}
		</h3>
	)
	/* Subhead per Figma 93:16847: Inter Light 14px #94a3b8, line-height 1.6 —
	 * same on every card. */
	const bodyNode = (
		<p
			className='text-trim font-light text-[14px] text-[#94a3b8]'
			style={{ lineHeight: 1.6 }}
		>
			{feature.body}
		</p>
	)

	/* Shared article shell per Figma 93:16840:
	 *   ─ Background: rgba(30,34,48,0.2) — translucent surface, NOT solid card.
	 *   ─ Border: 1px rgba(255,255,255,0.06) — subtler than cc-surface-border.
	 *   ─ Radius: 24px (was rounded-2xl 16px).
	 *   ─ Padding: 32px on the title/body block (was p-6 md:p-8).
	 *   ─ Heading→visual gap: 40px (was mt-auto). */
	const articleClass =
		'group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[rgba(30,34,48,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]'

	/* ── Card 6: horizontal split at lg+ ──
	 * Title+body left (~42%), hub-spoke right (~58%). Collapses to vertical
	 * stack at <lg. */
	if (isSplit) {
		return (
			<Reveal delay={index * 0.08} className={roleSpanClass[role]}>
				<article className={`${articleClass} lg:flex-row`}>
					<div className='flex flex-1 flex-col justify-center gap-4 p-8 lg:basis-[42%] lg:pr-4'>
						{titleNode}
						{bodyNode}
					</div>
					<div className={`relative w-full overflow-hidden ${roleVisualHeight[role]} lg:h-auto lg:basis-[58%] lg:self-stretch`}>
						<Visual />
					</div>
				</article>
			</Reveal>
		)
	}

	/* ── Card 4: visual on top, body on bottom ──
	 * Inverted vertical stack — timeline visual is the hook so it leads. */
	if (isInverted) {
		return (
			<Reveal delay={index * 0.08} className={roleSpanClass[role]}>
				<article className={articleClass}>
					<div className={`relative w-full overflow-hidden ${roleVisualHeight[role]}`}>
						<Visual />
					</div>
					<div className='flex flex-1 flex-col gap-4 p-8'>
						{titleNode}
						{bodyNode}
					</div>
				</article>
			</Reveal>
		)
	}

	/* ── Card 5: tall vertical (col-span-1, row-span-2) ──
	 * Title+body TOP, visual fills the remaining tall column with flex-1.
	 * Spans rows 2 and 3 at lg+, single-row stack on mobile/tablet. */
	if (isTall) {
		return (
			<Reveal delay={index * 0.08} className={roleSpanClass[role]}>
				<article className={articleClass}>
					<div className='flex flex-col gap-4 px-8 pt-8 pb-3'>
						{titleNode}
						{bodyNode}
					</div>
					<div className='relative flex-1 w-full overflow-hidden min-h-[420px]'>
						<Visual />
					</div>
				</article>
			</Reveal>
		)
	}

	/* ── Default (Cards 1, 2, 3): title+body top, visual bottom ──
	 * mt-auto on the visual keeps row-1 / row-2 baselines aligned even when
	 * body copy lengths differ. */
	return (
		<Reveal delay={index * 0.08} className={roleSpanClass[role]}>
			<article className={articleClass}>
				<div className='flex flex-col gap-4 px-8 pt-8 pb-3'>
					{titleNode}
					{bodyNode}
				</div>
				<div className={`relative mt-auto w-full overflow-hidden ${roleVisualHeight[role]}`}>
					<Visual />
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
			{/* Andy 2026-05-01: prior 4-stop warm→mid→grey→dark gradient bridge
			 * (Wave Y.10 / Z.4 P2-C) read muddy. Removed in favor of a normal
			 * clean section seam — warm Results terminates at its bottom edge,
			 * dark Teams begins at its top edge, no gradient mush in between. */}

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
				<Reveal delay={0.16} className='mt-10 flex flex-col items-center gap-6'>
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

				{/* ── Compliance pill strip — moved here from its own section per
				 * Andy 2026-04-27 so the trust anchor sits directly under the
				 * bento and above the closing CTAs. */}
				<Reveal delay={0.1} className='mt-10 md:mt-12'>
					<CompliancePills />
				</Reveal>

				{/* ── CTAs ── */}
				<Reveal delay={0.2} className='mt-10 flex flex-col items-center gap-5 sm:gap-6 md:mt-12'>
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
