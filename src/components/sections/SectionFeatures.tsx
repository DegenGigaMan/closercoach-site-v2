/** @fileoverview S4 Feature Deep Dives — scope-reduced bonus-features section
 * (Decision #7, launch lock 2026-05-15).
 *
 * Composition:
 *   1. Billboard section headline (Lora Bold, clamp 2.5rem to 10rem at 10vw)
 *      with italic-emerald emphasis.
 *   2. Scale callout beneath -- "100+ scenarios across 16+ industries."
 *   3. 2-card bento covering the supplementary product surfaces not already
 *      covered by Hero + How It Works + Teams:
 *        Row 1 desktop: [01] Cash Cards (cols 1-6) | [02] 10+ Languages (cols 7-12)
 *        Mobile: 1-col stack.
 *      Cards Practice Against Realistic AI Customer Clones, AI Dialer +
 *      Notetaker, and Skills Progression Tracking removed per launch decision
 *      (covered earlier on the LP via Hero State 5 mic bar + How It Works
 *      Steps 2-4 + Step 3 dialer flow). Surviving cards positioned as
 *      "bonus features" supporting the core narrative.
 *   4. Each card renders chapter marker top-right (Geist Mono, emerald),
 *      Phosphor icon, title, one-liner body, and a per-card animated visual.
 *   5. CTA below the bento.
 *
 * Hydration safety: no Math.random, Date.now, or window checks in render.
 * All props stable across server + first client render. */

'use client'

import type { ComponentType, ReactElement, ReactNode } from 'react'
import {
	Lightning,
	GlobeHemisphereWest,
} from '@phosphor-icons/react'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA } from '@/lib/constants'
import FlashcardStackVisual from './features/FlashcardStackVisual'
import LanguageOrbitVisual from './features/LanguageOrbitVisual'

/* ── Data ── */

type PhosphorIcon = ComponentType<{
	size?: number | string
	weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
	className?: string
	'aria-hidden'?: boolean | 'true' | 'false'
}>

type CardLayout = 'stack' | 'split-visual-left' | 'split-visual-right'

type Feature = {
	title: string
	body: string
	Icon: PhosphorIcon
	/** Internal composition of the card.
	 *  - 'stack': icon + title + body top, visual below. All breakpoints.
	 *  - 'split-visual-left': visual LEFT / text RIGHT on md+, collapses to
	 *    vertical stack (text top, visual below) at <md.
	 *  - 'split-visual-right': text LEFT / visual RIGHT on md+, collapses to
	 *    vertical stack (text top, visual below) at <md.
	 *  Per Image #24/#25/#26 reference confirmed by Andy 2026-04-21. */
	layout: CardLayout
}

const FEATURES: readonly Feature[] = [
	{
		title: 'Cash Cards',
		body: 'Flashcards built around real objections so you always know exactly what to say when it counts.',
		Icon: Lightning,
		layout: 'split-visual-left',
	},
	{
		title: '10+ Languages',
		body: 'Practice Spanish cold calls, French closings, Portuguese discovery. All from the same app.',
		Icon: GlobeHemisphereWest,
		layout: 'split-visual-right',
	},
] as const

/* ── Card shell ── */

type CardShellProps = {
	feature: Feature
	/** Per-card visual slot. Each card in this section supplies its own visual
	 *  sub-component (see `./features/*Visual.tsx`). The shell only handles
	 *  layout, text, and motion-ready scaffolding. */
	motionSlot: ReactNode
	className?: string
	slotWrapperClassName?: string
}

/**
 * @description S4 bento card shell. Branches on `feature.layout` to render
 * either a vertical stack (icon + title + body above, visual below) or a
 * horizontal split that collapses to a vertical stack under md. In the split
 * variant, DOM order is always text-first so mobile stacks text-then-visual;
 * on md+ we use `flex-row-reverse` for 'split-visual-left' to put the visual
 * on the left without reordering the DOM. A future wave replaces DashedSlot
 * with the real motionSlot without restructuring layout.
 */
function CardShell({ feature, motionSlot, className = '', slotWrapperClassName = '' }: CardShellProps): ReactElement {
	const { title, body, Icon, layout } = feature

	const cardBase = `group relative flex h-full flex-col gap-5 rounded-2xl border border-cc-surface-border bg-[#0C0E13] p-6 md:p-8 ${className}`

	const textBlock = (
		<>
			<Icon className='text-cc-accent' size={28} weight='duotone' aria-hidden='true' />
			<h3 className='display-sm text-cc-text-primary'>{title}</h3>
			<p className='max-w-md text-base leading-relaxed text-cc-text-secondary' style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 400 }}>{body}</p>
		</>
	)

	const visualBlock = motionSlot

	if (layout === 'stack') {
		return (
			<div className={cardBase}>
				{textBlock}
				<div className={`mt-auto flex w-full flex-1 ${slotWrapperClassName}`}>
					{visualBlock}
				</div>
			</div>
		)
	}

	// Horizontal split on md+. DOM-first text so mobile stacks text-over-visual.
	// Use flex-row-reverse to place visual on the LEFT without DOM reordering.
	const mdDirection = layout === 'split-visual-left' ? 'md:flex-row-reverse' : 'md:flex-row'

	return (
		<div className={cardBase}>
			<div className={`flex flex-1 flex-col gap-6 ${mdDirection} md:items-stretch md:gap-8`}>
				<div className='flex flex-col gap-5 md:basis-[45%] md:justify-center'>
					{textBlock}
				</div>
				<div className={`flex min-h-[200px] flex-1 md:basis-[55%] md:min-h-0 ${slotWrapperClassName}`}>
					{visualBlock}
				</div>
			</div>
		</div>
	)
}

/* ── Methodology strip (DB-1) ── */

/* ── Section ── */

/**
 * @description S4 Feature Deep Dives. Billboard headline + scale callout +
 * 5-card bento (7/5 top row, 4/4/4 bottom row on desktop) + DB-1 methodology
 * strip + CTA. Dark surface. Static at rest; per-card motion hooks reserved
 * for a future wave via the motionSlot prop on CardShell.
 */
export default function SectionFeatures(): ReactElement {
	return (
		<section
			id='features'
			data-surface='dark-features'
			/* Wave C1 (Alim batch #5): increased vertical padding for desktop
			 * SELL billboard breathing room. H-35 (2026-05-04): tightened mobile
			 * padding from py-32 to py-20 because the gap between SectionHowItWorks
			 * end + ProofConnectorA + SectionFeatures top read as a layout dead-zone
			 * on mobile (336px combined). Mobile now 80+48+80 = 208px (still
			 * generous, no longer disorienting). Desktop md:py-40 preserved. */
			className='relative overflow-hidden bg-cc-foundation py-20 sm:py-24 md:py-40'
		>
			{/* Wave J.3 (FIX-04 P1, 2026-04-26): 2xl bump 1400 -> 1440 reclaims
			 * the 320px-per-side rails at 1920 viewport. Mercury / Linear push
			 * to 1440-1536 at 2xl. */}
			<div className='relative z-10 mx-auto max-w-[1400px] px-6 2xl:max-w-[1440px]'>
				{/* Billboard headline. Rewritten Wave P (2026-04-27), then again
				    Wave Y.9 (Alim 2026-04-28: '"built for..." -> outcome-driven
				    copy. built to win more deals'). The Wave P rewrite framed
				    the audience surface ('Built for every kind of close.'); the
				    Wave Y rewrite re-centers on the outcome ('win more deals')
				    so the S4 bento + 5-card breadth read as a means-to-an-end
				    rather than as capability marketing. Audience breadth is
				    still implied by the eyebrow '100+ scenarios across 16+
				    industries.' Lora Bold with italic emerald emphasis on
				    'win more deals.' per VIS lock 2026-04-21. */}
				{/* Wave I FIX-02: wrap billboard + callout in max-w-6xl mx-auto so the
				    headline doesn't bleed to the viewport edges at 1440+. The parent
				    max-w-[1400px] container is too wide for a centered editorial
				    rhythm; Linear / Mercury both keep billboard text in a tighter
				    centered column. */}
				<div className='mx-auto max-w-6xl'>
					{/* Q17 Wave D1-7 (Andy 2026-04-29 #18): heading was left-
					    aligned (per F0B0VUURF89.png ref). Andy locked centered
					    alignment to match the centered subhead below it.
					    text-left → text-center. */}
					<h2
						className='text-trim mb-6 text-cc-text-primary text-balance text-center md:mb-8'
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(2.5rem, 10vw, 10rem)',
							lineHeight: 0.95,
							letterSpacing: '-0.015em',
							fontWeight: 700,
						}}
					>
						Built to{' '}
						<em className='italic font-bold text-cc-accent'>
							win more deals. 
						</em>
					</h2>

					{/* Scale callout (E4). Single line, muted, sits directly under billboard. */}
					<p className='mb-16 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.22em] text-cc-text-muted md:mb-20 md:text-sm'>
						100+ scenarios across 16+ industries
					</p>
				</div>

				{/* Bento grid (Decision #7, launch lock 2026-05-15).
				    Desktop (lg+): 2-col 12-grid with each card spanning 6 cols.
				    Tablet (md): 2-col. Mobile: 1-col stack. */}
				<div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-12'>
					{/* [01] Cash Cards */}
					<CardShell
						feature={FEATURES[0]}
						motionSlot={<FlashcardStackVisual />}
						className='md:col-span-1 lg:col-span-6 lg:min-h-[420px]'
					/>

					{/* [02] 10+ Languages */}
					<CardShell
						feature={FEATURES[1]}
						motionSlot={<LanguageOrbitVisual />}
						className='md:col-span-1 lg:col-span-6 lg:min-h-[420px]'
					/>
				</div>

				{/* CTA */}
				<div className='mt-12 flex items-center justify-center w-full flex-col gap-3 sm:flex-row sm:w-auto md:mt-16'>
					<MotionCTA href={CTA.contactSales.href} variant='secondary' size='lg' className='w-full sm:w-auto'>
						{CTA.contactSales.text}
					</MotionCTA>
					<MotionCTA href={CTA.tryFree.href} variant='primary' size='lg' className='w-full sm:w-auto'>
						{CTA.tryFree.text}
					</MotionCTA>
				</div>
			</div>
		</section>
	)
}
