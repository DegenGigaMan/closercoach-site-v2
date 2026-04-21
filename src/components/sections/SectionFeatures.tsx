/** @fileoverview S4 Feature Deep Dives (W3 blueprint v2 port).
 *
 * Composition per section-blueprint v2 S4:
 *   1. Billboard section headline (clamp to 10vw, Lora Bold) with emerald italic accent span.
 *   2. Scale callout beneath -- E4 "100+ scenarios across 16+ industries."
 *   3. 5-card masonry grid with chapter markers [01]-[05]:
 *        [01] Daily Roleplay Drills -- ANCHOR card (2-col span desktop), ONLY animated moment
 *             (persona fan cycling every ~3s via Motion AnimatePresence, single-ambient rule).
 *        [02]-[05] static Phosphor icon + headline + one-liner.
 *   4. Expert Methodology Strip (DB-1) below the grid -- PC7 expert names inline with
 *        emerald hairline separators.
 *
 * Copy locked to lp-copy-deck-v5 §Section 4. Proof locked to proof-inventory E4 + PC7.
 * Dark surface. BD hairline dividers (emerald/20) replace gap between cards so the grid
 * reads as a structural diagram. BE chapter markers (Geist Mono emerald corners).
 *
 * Hydration safety: anchor card PersonaFan seeds initial index 0 on server + first client
 * render. AnimatePresence cycles AFTER hydration via useEffect setInterval.
 * Reduced-motion: persona fan freezes on index 0, no cycling. Masonry otherwise inert. */

'use client'

import { useEffect, useState, type ReactElement } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Microphone, Strategy, ChartLineUp, Cards } from '@phosphor-icons/react'

/* ── Data ── */

type Feature = {
	chapter: string
	title: string
	body: string
}

const FEATURES: readonly Feature[] = [
	{
		chapter: '[01]',
		title: 'Daily Roleplay Drills',
		body: 'Three fresh sales scenarios every day so your skills never go cold.',
	},
	{
		chapter: '[02]',
		title: 'AI Dialer + Notetaker',
		body: 'Call directly from the app or hit record in the room, either way AI captures the conversation, scores the call, and writes your notes.',
	},
	{
		chapter: '[03]',
		title: 'Pre-Call Preparation',
		body: 'Know your prospect, your angles, and your talk track before you ever say hello.',
	},
	{
		chapter: '[04]',
		title: 'Skills Progression Tracking',
		body: 'See exactly how your discovery, objection handling, close rate, and more improve over time. Call by call, rep by rep.',
	},
	{
		chapter: '[05]',
		title: 'Cash Cards',
		body: 'Flashcards built around real objections so you always know exactly what to say when it counts.',
	},
] as const

type Persona = {
	name: string
	role: string
	industry: string
	tone: string
}

const PERSONAS: readonly Persona[] = [
	{ name: 'Maria V.', role: 'Skeptical CFO', industry: 'SaaS', tone: 'Analytical' },
	{ name: 'Derek K.', role: 'Busy Operator', industry: 'Roofing', tone: 'Impatient' },
	{ name: 'Priya S.', role: 'Warm Referral', industry: 'Solar', tone: 'Curious' },
] as const

const EXPERTS: readonly string[] = [
	'Grant Cardone',
	'Cole Gordon',
	'Andy Elliot',
	'Dan Lok',
	'Daniel G',
] as const

/* ── Anchor card persona fan (single-ambient animation) ── */

/**
 * @description Fanned persona card stack inside the Daily Roleplay Drills anchor card.
 * Two static back cards angled left + right; a front card cycles through three personas
 * every ~3.2s via Motion AnimatePresence. This is the only animated moment in S4 per BF
 * single-ambient rule. Hydration-safe: initial index 0 on server + first client render.
 * Respects prefers-reduced-motion by freezing the index and disabling swap motion.
 */
function PersonaFan(): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const [index, setIndex] = useState(0)

	useEffect(() => {
		if (prefersReducedMotion) return
		const timer = setInterval(() => {
			setIndex((i) => (i + 1) % PERSONAS.length)
		}, 3200)
		return () => clearInterval(timer)
	}, [prefersReducedMotion])

	const persona = PERSONAS[index]

	return (
		<div
			className='relative flex h-56 w-full items-center justify-center'
			aria-hidden='true'
		>
			{/* Back card, angled left */}
			<div
				className='absolute h-44 w-32 rounded-xl border border-cc-surface-border bg-cc-surface-card/60'
				style={{ transform: 'translate(-42px, 0) rotate(-10deg)' }}
			/>
			{/* Back card, angled right */}
			<div
				className='absolute h-44 w-32 rounded-xl border border-cc-surface-border bg-cc-surface-card/60'
				style={{ transform: 'translate(42px, 0) rotate(10deg)' }}
			/>

			{/* Front card cycles through personas. Hydration-safe: `initial` is stable (never
			    branches on client-only signals). Reduced-motion collapses transition to 0s so
			    the same initial state applies without server/client mismatch. */}
			<AnimatePresence mode='wait'>
				<motion.div
					key={persona.name}
					initial={{ opacity: 0, y: 14, scale: 0.96 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.96 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
					className='relative z-10 flex h-48 w-36 flex-col justify-between rounded-xl border border-cc-accent/40 bg-cc-surface-card p-4 shadow-[0_16px_48px_rgba(16,185,129,0.18)]'
				>
					<div className='flex flex-col gap-1'>
						<span className='font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.2em] text-cc-accent'>
							Scenario
						</span>
						<span className='font-[family-name:var(--font-heading)] text-sm font-bold text-cc-text-primary'>
							{persona.name}
						</span>
						<span className='text-[11px] leading-snug text-cc-text-secondary'>
							{persona.role}
						</span>
					</div>
					<div className='flex flex-col gap-1 border-t border-cc-surface-border pt-2'>
						<span className='font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wide text-cc-text-muted'>
							{persona.industry}
						</span>
						<span className='font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wide text-cc-text-muted'>
							{persona.tone}
						</span>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}

/* ── Static (non-anchor) feature card ── */

type StaticCardProps = {
	chapter: string
	title: string
	body: string
	Icon: typeof Microphone
	className?: string
}

/**
 * @description Non-anchor S4 feature card. Static Phosphor icon, chapter marker top-right,
 * title, one-liner body. Four of these per S4 per single-ambient rule.
 */
function StaticFeatureCard({ chapter, title, body, Icon, className = '' }: StaticCardProps): ReactElement {
	return (
		<div
			className={`group relative flex flex-col gap-3 p-6 md:p-8 transition-colors hover:bg-cc-surface-card/60 ${className}`}
		>
			<span
				className='absolute right-6 top-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-cc-accent'
				style={{ fontVariantNumeric: 'tabular-nums' }}
				aria-hidden='true'
			>
				{chapter}
			</span>
			<Icon className='text-cc-accent' size={32} weight='bold' aria-hidden='true' />
			<h3 className='pr-12 display-sm text-cc-text-primary'>{title}</h3>
			<p className='text-base leading-relaxed text-cc-text-secondary'>{body}</p>
		</div>
	)
}

/* ── Anchor feature card (Daily Roleplay Drills) ── */

/**
 * @description S4 anchor card. 2-col span on desktop, hosts the persona fan mini-preview.
 * Bold emerald border + subtle glow to mark it as the hook. Single-ambient animation lives
 * inside via PersonaFan.
 */
function AnchorFeatureCard({ feature, className = '' }: { feature: Feature; className?: string }): ReactElement {
	return (
		<div
			className={`group relative flex flex-col gap-5 p-6 md:p-8 shadow-[0_0_48px_rgba(16,185,129,0.06)] ${className}`}
		>
			<div className='flex items-start justify-between'>
				<span
					className='font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-cc-accent'
					style={{ fontVariantNumeric: 'tabular-nums' }}
					aria-hidden='true'
				>
					{feature.chapter}
				</span>
				<span
					className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-accent/70'
					aria-hidden='true'
				>
					Anchor
				</span>
			</div>
			<h3 className='display-md text-cc-text-primary'>{feature.title}</h3>
			<p className='max-w-md text-base leading-relaxed text-cc-text-secondary'>
				{feature.body}
			</p>
			<div className='mt-auto border-t border-cc-surface-border pt-6'>
				<PersonaFan />
			</div>
		</div>
	)
}

/* ── Methodology strip (DB-1) ── */

/**
 * @description Expert Methodology Authority Strip (DB-1). Overline label + 5 expert
 * names inline, separated by thin emerald hairlines. Names only, no photos. PC7 deployed.
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
 * @description S4 Feature Deep Dives. Billboard headline + scale callout + 5-card masonry
 * with BD hairline dividers + DB-1 methodology strip. Dark surface. Single-ambient animation
 * (persona fan inside anchor card). All other visual elements static.
 */
export default function SectionFeatures(): ReactElement {
	return (
		<section
			id='features'
			data-surface='dark-features'
			className='relative overflow-hidden bg-cc-foundation py-24 md:py-32'
		>
			<div className='relative z-10 mx-auto max-w-7xl px-6'>
				{/* Billboard headline. Fluid clamp 3rem to 8rem at 10vw, tight leading so the
				    headline fills viewport width and becomes the typographic event. */}
				<h2
					className='mb-6 text-cc-text-primary text-balance text-center'
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(3rem, 10vw, 8rem)',
						lineHeight: 0.95,
						letterSpacing: '-0.015em',
						fontWeight: 700,
					}}
				>
					An AI Sales Operating System{' '}
					<span
						className='text-cc-accent'
						style={{ fontStyle: 'italic' }}
					>
						in Your Pocket
					</span>
				</h2>

				{/* Scale callout (E4). Single line, muted, sits directly under billboard. */}
				<p className='mb-16 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.22em] text-cc-text-muted md:mb-20 md:text-sm'>
					100+ scenarios across 16+ industries
				</p>

				{/* Masonry grid:
				    - Desktop (lg): 4-column grid.
				      Row 1: anchor card col-span-2 row-span-2 + [02] col-span-2 + [03] col-span-2 (stacked right column).
				      Row 2: [04] col-span-2 + [05] col-span-2 below the right stack.
				    - Mobile: 1 column stack. Anchor first at normal card size, then [02]-[05].
				    Cards use BD hairline dividers instead of gap: border-cc-accent/20 right/bottom
				    borders stitch the grid into a single structural diagram. */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-4'>
					{/* [01] Anchor -- 2-col span, 2-row span on desktop */}
					<AnchorFeatureCard
						feature={FEATURES[0]}
						className='lg:col-span-2 lg:row-span-2 border-b border-cc-accent/20 lg:border-b-0 lg:border-r border-cc-accent/20 md:border-r md:border-cc-accent/20 md:col-span-2'
					/>

					{/* [02] AI Dialer + Notetaker */}
					<StaticFeatureCard
						chapter={FEATURES[1].chapter}
						title={FEATURES[1].title}
						body={FEATURES[1].body}
						Icon={Microphone}
						className='lg:col-span-1 border-b border-cc-accent/20 md:border-r md:border-cc-accent/20 lg:border-r lg:border-cc-accent/20'
					/>

					{/* [03] Pre-Call Preparation */}
					<StaticFeatureCard
						chapter={FEATURES[2].chapter}
						title={FEATURES[2].title}
						body={FEATURES[2].body}
						Icon={Strategy}
						className='lg:col-span-1 border-b border-cc-accent/20'
					/>

					{/* [04] Skills Progression Tracking */}
					<StaticFeatureCard
						chapter={FEATURES[3].chapter}
						title={FEATURES[3].title}
						body={FEATURES[3].body}
						Icon={ChartLineUp}
						className='lg:col-span-1 border-b border-cc-accent/20 md:border-r md:border-cc-accent/20 md:border-b-0 lg:border-r lg:border-cc-accent/20 lg:border-b-0'
					/>

					{/* [05] Cash Cards */}
					<StaticFeatureCard
						chapter={FEATURES[4].chapter}
						title={FEATURES[4].title}
						body={FEATURES[4].body}
						Icon={Cards}
						className='lg:col-span-1'
					/>
				</div>

				{/* DB-1 Methodology Strip (PC7) */}
				<MethodologyStrip />
			</div>
		</section>
	)
}
