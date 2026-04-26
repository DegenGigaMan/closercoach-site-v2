/** @fileoverview S4 Feature Deep Dives (W15 + W16 bento per Image #22).
 *
 * Composition:
 *   1. Billboard section headline (Lora Bold, clamp 2.5rem to 10rem at 10vw) with
 *      Lora Bold ITALIC emerald span on "Operating System".
 *   2. Scale callout beneath -- E4 "100+ scenarios across 16+ industries."
 *   3. 5-card asymmetric bento (12-col desktop grid, 3 implicit rows):
 *        Row 1: [01] cols 1-7 (wide hook card) | [02] cols 8-12
 *        Row 2: [03] cols 1-4 row-span 2       | [04] cols 5-12 (compact)
 *        Row 3: [03 continues]                 | [05] cols 5-12 (taller than 04)
 *      Card heights vary: [03] is the tall left column; [04] is the compact
 *      middle-right card; [05] is the wider bottom-right card. The grid's row
 *      assignment drives each card's footprint, which matches the reference.
 *      Mobile: independent single-column stack (not a shrunk desktop), natural
 *      card heights.
 *      Tablet: 2-col grid, card 1 spans both cols row 1.
 *   4. Each card renders chapter marker [01]-[05] top-right (Geist Mono, emerald),
 *      Phosphor icon (emerald, duotone where available), title, one-liner body,
 *      and a DASHED-BOX placeholder reserving space for a per-card visual asset
 *      that lands in a later wave.
 *   5. Expert Methodology Strip (DB-1) below the grid -- PC7 expert names inline
 *      with emerald hairline separators.
 *   6. CTA below everything.
 *
 * Copy DEVIATES from lp-copy-deck-v5 §S4 (logged in build-deviations.md W15 entry).
 * Card 1 title shifts from "Daily Roleplay Drills" to "Practice Against Realistic
 * AI Customer Clones"; Card 3 replaces "Pre-Call Preparation" with "40+ Languages".
 * Layout shifts from masonry to 7/5 + 4/4/4 bento. Source of truth for this wave
 * is Image #20 reference; copy deck reconciliation deferred.
 *
 * Motion hooks (TODO only, no implementation this wave):
 *   - Card 1: fan-out 3-card persona stack on hover
 *   - Card 2: live waveform animation + session complete reveal on scroll
 *   - Card 3: stat counter + chart draw-in on scroll
 *   - Card 4: stacked flashcard hover fan
 *   - Card 5: microphone pulse + flag orbit rotation
 * Cards expose a `motionSlot` prop so a future wave can replace the dashed-box
 * placeholder with the animated visual without restructuring layout.
 *
 * Hydration safety: no Math.random, Date.now, or window checks in render.
 * All props stable across server + first client render. Section is static
 * at rest -- no ambient animation yet. */

'use client'

import type { ComponentType, ReactElement, ReactNode } from 'react'
import {
	SealCheck,
	Phone,
	ChartLineUp,
	Lightning,
	GlobeHemisphereWest,
} from '@phosphor-icons/react'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA } from '@/lib/constants'
import PracticeFanVisual from './features/PracticeFanVisual'
import SessionCompleteVisual from './features/SessionCompleteVisual'
import ProgressionVisual from './features/ProgressionVisual'
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
		title: 'Practice Against Realistic AI Customer Clones',
		body: 'Three fresh sales scenarios every day so your skills never go cold.',
		Icon: SealCheck,
		layout: 'stack',
	},
	{
		title: 'AI Dialer + Notetaker',
		body: 'Call directly from the app or hit record in the room. Either way, AI captures the conversation, scores the call, and writes your notes.',
		Icon: Phone,
		layout: 'stack',
	},
	{
		title: 'Skills Progression Tracking',
		body: 'See exactly how your discovery, objection handling, close rate, and more improve over time. Call by call, rep by rep.',
		Icon: ChartLineUp,
		layout: 'stack',
	},
	{
		title: 'Cash Cards',
		body: 'Flashcards built around real objections so you always know exactly what to say when it counts.',
		Icon: Lightning,
		layout: 'split-visual-left',
	},
	{
		title: '40+ Languages',
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

	const cardBase = `group relative flex h-full flex-col gap-5 rounded-2xl border border-cc-surface-border bg-cc-surface-card/40 p-6 md:p-8 ${className}`

	const textBlock = (
		<>
			<Icon className='text-cc-accent' size={28} weight='duotone' aria-hidden='true' />
			<h3 className='display-sm text-cc-text-primary'>{title}</h3>
			<p className='max-w-md text-base leading-relaxed text-cc-text-secondary'>{body}</p>
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
			className='relative overflow-hidden bg-cc-foundation py-24 md:py-32'
		>
			<div className='relative z-10 mx-auto max-w-[1400px] px-6'>
				{/* Billboard headline. 4-verb capability rhythm mirrors the Step 1-4
				    flow (Plan / Practice / Sell / Review). Lora Bold with italic emerald
				    emphasis on the closing verb per VIS lock 2026-04-21. Fluid clamp so
				    the headline owns the viewport on desktop and scales down cleanly.
				    Rewritten 2026-04-24 (Wave F2 K1) to de-repeat "in Your Pocket"
				    framing against hero. */}
				{/* Wave I FIX-02: wrap billboard + callout in max-w-6xl mx-auto so the
				    headline doesn't bleed to the viewport edges at 1440+. The parent
				    max-w-[1400px] container is too wide for a centered editorial
				    rhythm; Linear / Mercury both keep billboard text in a tighter
				    centered column. */}
				<div className='mx-auto max-w-6xl'>
					<h2
						className='text-trim mb-6 text-cc-text-primary text-balance text-left md:mb-8'
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(2.5rem, 10vw, 10rem)',
							lineHeight: 0.95,
							letterSpacing: '-0.015em',
							fontWeight: 700,
						}}
					>
						Practice. Record. Review.{' '}
						<em
							className='not-italic text-cc-accent'
							style={{ fontWeight: 700, fontStyle: 'italic' }}
						>
							Improve.
						</em>
					</h2>

					{/* Scale callout (E4). Single line, muted, sits directly under billboard. */}
					<p className='mb-16 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.22em] text-cc-text-muted md:mb-20 md:text-sm'>
						100+ scenarios across 16+ industries
					</p>
				</div>

				{/* Bento grid.
				    Desktop (lg+): 12-col grid with a tall left column for card 03.
				      Row 1: [01] col-span-7 | [02] col-span-5
				      Row 2: [03] col-span-4 row-span-2 | [04] col-span-8
				      Row 3: [03 continues]               | [05] col-span-8
				      Row 2 is shorter than row 3 so [04] reads as the compact card and
				      [05] reads wider/taller, matching the reference composition.
				    Tablet (md): 2-col. Row 1 [01] col-span-2. Rows 2-3 pair the rest.
				    Mobile: 1-col stack in reading order. */}
				<div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-12'>
					{/* [01] Practice Against Realistic AI Customer Clones
					    TODO(motion): fan-out 3-card persona stack on hover */}
					<CardShell
						feature={FEATURES[0]}
						motionSlot={<PracticeFanVisual />}
						className='md:col-span-2 lg:col-span-7 lg:min-h-[520px]'
					/>

					{/* [02] AI Dialer + Notetaker
					    TODO(motion): live waveform animation + session complete reveal on scroll */}
					<CardShell
						feature={FEATURES[1]}
						motionSlot={<SessionCompleteVisual />}
						className='md:col-span-1 lg:col-span-5 lg:min-h-[520px]'
					/>

					{/* [03] Skills Progression Tracking -- tall column spanning rows 2-3
					    TODO(motion): stat counter + chart draw-in on scroll */}
					<CardShell
						feature={FEATURES[2]}
						motionSlot={<ProgressionVisual />}
						className='md:col-span-1 lg:col-span-4 lg:row-span-2'
					/>

					{/* [04] Cash Cards -- compact row-2 right card on desktop;
					    full-width row on tablet; vertical stack on mobile
					    TODO(motion): stacked flashcard hover fan */}
					<CardShell
						feature={FEATURES[3]}
						motionSlot={<FlashcardStackVisual />}
						className='md:col-span-2 lg:col-span-8 lg:min-h-[300px]'
					/>

					{/* [05] 40+ Languages -- wider row-3 right card on desktop;
					    full-width row on tablet; vertical stack on mobile
					    TODO(motion): microphone pulse + flag orbit rotation */}
					<CardShell
						feature={FEATURES[4]}
						motionSlot={<LanguageOrbitVisual />}
						className='md:col-span-2 lg:col-span-8 lg:min-h-[380px]'
					/>
				</div>

				{/* CTA */}
				<div className='mt-12 text-center md:mt-16'>
					<MotionCTA href={CTA.tryFree.href} variant='primary' size='lg'>
						{CTA.tryFree.text}
					</MotionCTA>
				</div>
			</div>
		</section>
	)
}
