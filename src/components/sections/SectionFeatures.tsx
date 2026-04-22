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

/* ── Data ── */

type PhosphorIcon = ComponentType<{
	size?: number | string
	weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
	className?: string
	'aria-hidden'?: boolean | 'true' | 'false'
}>

type Feature = {
	chapter: string
	title: string
	body: string
	Icon: PhosphorIcon
}

const FEATURES: readonly Feature[] = [
	{
		chapter: '[01]',
		title: 'Practice Against Realistic AI Customer Clones',
		body: 'Three fresh sales scenarios every day so your skills never go cold.',
		Icon: SealCheck,
	},
	{
		chapter: '[02]',
		title: 'AI Dialer + Notetaker',
		body: 'Call directly from the app or hit record in the room. Either way, AI captures the conversation, scores the call, and writes your notes.',
		Icon: Phone,
	},
	{
		chapter: '[03]',
		title: 'Skills Progression Tracking',
		body: 'See exactly how your discovery, objection handling, close rate, and more improve over time. Call by call, rep by rep.',
		Icon: ChartLineUp,
	},
	{
		chapter: '[04]',
		title: 'Cash Cards',
		body: 'Flashcards built around real objections so you always know exactly what to say when it counts.',
		Icon: Lightning,
	},
	{
		chapter: '[05]',
		title: '40+ Languages',
		body: 'Practice Spanish cold calls, French closings, Portuguese discovery. All from the same app.',
		Icon: GlobeHemisphereWest,
	},
] as const

const EXPERTS: readonly string[] = [
	'Grant Cardone',
	'Cole Gordon',
	'Andy Elliot',
	'Dan Lok',
	'Daniel G',
] as const

/* ── Dashed-box placeholder ── */

/**
 * @description Empty dashed frame reserving space for a future visual asset.
 * Renders a single centered "VISUAL ASSET" label in Geist Mono. Fills the
 * remaining card height via flex-1 so the reserved footprint tracks the
 * card's grid row assignment rather than a hard-coded aspect ratio. The real
 * visual asset will replace this frame in a later wave and is responsible
 * for its own internal composition.
 */
function DashedSlot(): ReactElement {
	return (
		<div
			className='relative flex w-full flex-1 min-h-[140px] items-center justify-center rounded-xl border-2 border-dashed border-cc-accent/25'
			aria-hidden='true'
		>
			<span
				className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-cc-text-muted/40'
			>
				Visual Asset
			</span>
		</div>
	)
}

/* ── Card shell ── */

type CardShellProps = {
	feature: Feature
	/** Optional slot for a future motion-aware visual. When omitted, the card
	 *  renders the DashedSlot placeholder sized per the reference layout. */
	motionSlot?: ReactNode
	className?: string
	slotWrapperClassName?: string
}

/**
 * @description S4 bento card shell. Renders chapter marker, icon, title, body,
 * and either a caller-provided motion slot or the default DashedSlot. Uses a
 * column flex so the slot grows to fill the remaining card height and the
 * outer grid's row assignment drives the visual footprint. A future wave can
 * bolt animation into `motionSlot` without shifting layout.
 */
function CardShell({ feature, motionSlot, className = '', slotWrapperClassName = '' }: CardShellProps): ReactElement {
	const { chapter, title, body, Icon } = feature

	return (
		<div
			className={`group relative flex h-full flex-col gap-5 rounded-2xl border border-cc-surface-border bg-cc-surface-card/40 p-6 md:p-8 ${className}`}
		>
			<span
				className='absolute right-6 top-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-cc-accent/60'
				style={{ fontVariantNumeric: 'tabular-nums' }}
				aria-hidden='true'
			>
				{chapter}
			</span>

			<Icon className='text-cc-accent' size={28} weight='duotone' aria-hidden='true' />
			<h3 className='pr-12 display-sm text-cc-text-primary'>{title}</h3>
			<p className='max-w-md text-base leading-relaxed text-cc-text-secondary'>{body}</p>

			<div className={`mt-auto flex w-full flex-1 ${slotWrapperClassName}`}>
				{motionSlot ?? <DashedSlot />}
			</div>
		</div>
	)
}

/* ── Methodology strip (DB-1) ── */

/**
 * @description Expert Methodology Authority Strip (DB-1). Overline label + 5
 * expert names inline, separated by thin emerald hairlines. Names only, no
 * photos. PC7 deployed. Static -- no scroll-driven reveal at rest.
 */
function MethodologyStrip(): ReactElement {
	return (
		<div className='mt-16 flex flex-col items-center gap-4 md:mt-20'>
			<p className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.22em] text-cc-text-muted/70'>
				Built on proven sales frameworks
			</p>
			<div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2'>
				{EXPERTS.map((name, i) => (
					<span
						key={name}
						className='flex items-center gap-3 text-base text-cc-text-secondary md:text-lg'
					>
						{name}
						{i < EXPERTS.length - 1 && (
							<span className='h-3 w-px bg-cc-accent/30' aria-hidden='true' />
						)}
					</span>
				))}
			</div>
		</div>
	)
}

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
				{/* Billboard headline. Lora Bold with Lora Bold ITALIC emerald span on
				    "Operating System" per VIS lock 2026-04-21. Fluid clamp so the
				    headline owns the viewport on desktop and scales down cleanly. */}
				<h2
					className='mb-6 text-cc-text-primary text-balance text-center md:mb-8'
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(2.5rem, 10vw, 10rem)',
						lineHeight: 0.95,
						letterSpacing: '-0.015em',
						fontWeight: 700,
					}}
				>
					An AI Sales{' '}
					<span
						className='text-cc-accent'
						style={{ fontStyle: 'italic', fontWeight: 700 }}
					>
						Operating System
					</span>
					<br className='hidden sm:block' />
					<span className='sm:hidden'> </span>
					in Your Pocket
				</h2>

				{/* Scale callout (E4). Single line, muted, sits directly under billboard. */}
				<p className='mb-16 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.22em] text-cc-text-muted md:mb-20 md:text-sm'>
					100+ scenarios across 16+ industries
				</p>

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
						className='md:col-span-2 lg:col-span-7 lg:min-h-[520px]'
					/>

					{/* [02] AI Dialer + Notetaker
					    TODO(motion): live waveform animation + session complete reveal on scroll */}
					<CardShell
						feature={FEATURES[1]}
						className='md:col-span-1 lg:col-span-5 lg:min-h-[520px]'
					/>

					{/* [03] Skills Progression Tracking -- tall column spanning rows 2-3
					    TODO(motion): stat counter + chart draw-in on scroll */}
					<CardShell
						feature={FEATURES[2]}
						className='md:col-span-1 lg:col-span-4 lg:row-span-2'
					/>

					{/* [04] Cash Cards -- compact row-2 right card
					    TODO(motion): stacked flashcard hover fan */}
					<CardShell
						feature={FEATURES[3]}
						className='md:col-span-1 lg:col-span-8 lg:min-h-[300px]'
					/>

					{/* [05] 40+ Languages -- wider row-3 right card, taller than [04]
					    TODO(motion): microphone pulse + flag orbit rotation */}
					<CardShell
						feature={FEATURES[4]}
						className='md:col-span-1 lg:col-span-8 lg:min-h-[380px]'
					/>
				</div>

				{/* DB-1 Methodology Strip (PC7) */}
				<MethodologyStrip />

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
