/** @fileoverview Lab route — dark→warm transition variants (Q17 Wave D2-2).
 *
 * Andy 2026-04-29 #19: current gradient bridge between the App Store press
 * quote (dark) and the Camil Reese performance card (warm) is "god awful."
 * Asked to explore component libraries for stronger section-level
 * transitions. This page renders 3 variants for Andy to pick:
 *
 *   A. Sharp diagonal cut with subtle emerald glow accent (clean editorial).
 *   B. Particle / stardust sweep that wipes from dark to warm (motion-led).
 *   C. Layered card-overlap with depth and soft drop shadow (structural).
 *
 * Each variant uses the same press-quote content + Camil card content for
 * fair comparison. The /round-trip section sequence (dark FAQ-like surface
 * above, warm card surface below) mirrors the production composition. */

'use client'

import type { ReactElement, ReactNode } from 'react'
import { motion } from 'motion/react'

const PRESS_QUOTE = '“This app went from something that was a nice idea that needed some work to something that is super useful.”'
const ATTRIB = 'App Store Review · 5 stars'

/* Shared press quote block (dark side). */
function DarkPressQuote(): ReactElement {
	return (
		<section className='relative flex items-center justify-center bg-cc-foundation py-24'>
			<div className='mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center'>
				<p className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary'>
					{ATTRIB}
				</p>
				<p
					className='text-balance text-cc-text-primary'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontStyle: 'italic',
						fontSize: 'clamp(1.25rem, 2.8vw, 1.875rem)',
						lineHeight: 1.3,
					}}
				>
					{PRESS_QUOTE}
				</p>
			</div>
		</section>
	)
}

/* Shared warm card block (warm side). Stand-in for SectionResults floating
 * proof Camil Reese card. */
function WarmCardBlock(): ReactElement {
	return (
		<section className='relative bg-cc-warm py-24'>
			<div className='mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center'>
				<span
					className='inline-flex items-center justify-center rounded-full px-5 py-[10px]'
					style={{
						backgroundColor: 'rgba(255,255,255,0.51)',
						border: '1px solid rgba(229,221,212,0.8)',
					}}
				>
					<span className='text-cc-text-primary-warm' style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px' }}>
						Coached weekly: <span style={{ color: '#059669' }}>76% quota hit.</span> Coached quarterly: <span style={{ color: '#FF5A5A' }}>47%.</span>
					</span>
				</span>
				<h3
					className='text-balance text-cc-text-primary-warm'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontSize: 'clamp(1.875rem, 4vw, 3rem)',
						lineHeight: 1.08,
					}}
				>
					Top sales producers are training on CloserCoach at least 2 hours/week.
				</h3>
			</div>
		</section>
	)
}

/* ── VARIANT A: Sharp diagonal cut with emerald glow accent ── */

function VariantA({ children }: { children: ReactNode }): ReactElement {
	return (
		<>
			{children}
			<div
				aria-hidden='true'
				className='relative h-[120px] overflow-hidden md:h-[140px]'
			>
				{/* Top half: dark foundation */}
				<div className='absolute inset-x-0 top-0 h-full bg-cc-foundation' />
				{/* Diagonal warm wedge */}
				<svg
					className='absolute inset-0 h-full w-full'
					viewBox='0 0 1440 140'
					preserveAspectRatio='none'
				>
					<polygon points='0,140 1440,140 1440,40 0,100' fill='#F5F0EB' />
				</svg>
				{/* Emerald glow on the diagonal seam */}
				<svg
					className='pointer-events-none absolute inset-0 h-full w-full'
					viewBox='0 0 1440 140'
					preserveAspectRatio='none'
				>
					<defs>
						<linearGradient id='cc-glow-a' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='#10B981' stopOpacity='0' />
							<stop offset='50%' stopColor='#10B981' stopOpacity='0.85' />
							<stop offset='100%' stopColor='#10B981' stopOpacity='0' />
						</linearGradient>
					</defs>
					<line x1='0' y1='100' x2='1440' y2='40' stroke='url(#cc-glow-a)' strokeWidth='2' />
				</svg>
			</div>
		</>
	)
}

/* ── VARIANT B: Particle / stardust sweep ── */

function VariantB({ children }: { children: ReactNode }): ReactElement {
	/* Generate stable particle positions (deterministic for SSR safety). */
	const particles = Array.from({ length: 36 }, (_, i) => {
		const xPct = ((i * 37) % 100)
		const yPct = ((i * 53) % 100)
		const size = 1 + (i % 4)
		const delay = (i % 12) * 0.08
		return { xPct, yPct, size, delay }
	})

	return (
		<>
			{children}
			<div
				aria-hidden='true'
				className='relative h-[160px] overflow-hidden md:h-[200px]'
				style={{
					background: 'linear-gradient(180deg, #0D0F14 0%, #1A1D26 30%, #4A443E 60%, #C9C0B2 85%, #F5F0EB 100%)',
				}}
			>
				{particles.map((p, i) => (
					<motion.span
						key={i}
						className='absolute rounded-full bg-cc-accent'
						style={{
							left: `${p.xPct}%`,
							top: `${p.yPct}%`,
							width: `${p.size}px`,
							height: `${p.size}px`,
							boxShadow: `0 0 ${p.size * 3}px rgba(16,185,129,0.7)`,
						}}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: [0, 1, 0], y: [-10, -40, -70] }}
						transition={{
							duration: 3.2,
							repeat: Infinity,
							delay: p.delay,
							ease: 'easeOut',
						}}
					/>
				))}
			</div>
		</>
	)
}

/* ── VARIANT C: Layered card-overlap with soft drop shadow ── */

/* Warm content is rendered with a wrapper that lifts up over the dark
 * surface. Dark content + warm content are siblings; the warm wrapper has
 * negative top margin + rounded top corners + drop shadow. */
function VariantCWarm({ children }: { children: ReactNode }): ReactElement {
	return (
		<div className='relative -mt-20 md:-mt-24'>
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 -top-px h-px'
				style={{
					background:
						'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.55) 50%, transparent 100%)',
				}}
			/>
			<div className='relative overflow-hidden rounded-t-[48px] bg-cc-warm shadow-[0_-24px_48px_-8px_rgba(0,0,0,0.5),0_-2px_0_0_rgba(255,255,255,0.06)] md:rounded-t-[64px]'>
				{children}
			</div>
		</div>
	)
}

/* Variant container — wraps each variant's transition + warm content. */
function VariantBlock({
	label,
	description,
	children,
}: {
	label: string
	description: string
	children: ReactNode
}): ReactElement {
	return (
		<div className='border-b border-white/10'>
			<div className='mx-auto max-w-7xl px-6 pb-6 pt-12'>
				<p className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-accent'>
					{label}
				</p>
				<p className='mt-2 text-sm text-cc-text-secondary'>{description}</p>
			</div>
			{children}
		</div>
	)
}

export default function TransitionExplorationsPage(): ReactElement {
	return (
		<main className='bg-cc-foundation'>
			<div className='mx-auto max-w-7xl px-6 py-12'>
				<h1 className='font-[family-name:var(--font-heading)] text-4xl font-bold text-white'>
					Section transition explorations
				</h1>
				<p className='mt-3 max-w-2xl text-cc-text-secondary'>
					3 variants for the dark → warm bridge between the App Store press quote and the Camil performance card. Per Andy 2026-04-29 #19. Pick one (or
					mix vocabulary).
				</p>
			</div>

			{/* Variant A: Sharp diagonal cut + emerald glow */}
			<VariantBlock
				label='Variant A · Sharp diagonal'
				description='Hard polygonal seam with emerald hairline. Editorial, structural, no motion.'
			>
				<VariantA>
					<DarkPressQuote />
				</VariantA>
				<WarmCardBlock />
			</VariantBlock>

			{/* Variant B: Particle/stardust sweep */}
			<VariantBlock
				label='Variant B · Particle sweep'
				description='Emerald particles drift up across a multi-stop dark→warm gradient. Motion-led, ambient.'
			>
				<VariantB>
					<DarkPressQuote />
				</VariantB>
				<WarmCardBlock />
			</VariantBlock>

			{/* Variant C: Layered card-overlap with soft drop shadow */}
			<VariantBlock
				label='Variant C · Layered card-overlap'
				description='Warm surface lifts as a rounded slab over the dark with a deep shadow. Tactile, structural.'
			>
				<DarkPressQuote />
				<VariantCWarm>
					<WarmCardBlock />
				</VariantCWarm>
			</VariantBlock>
		</main>
	)
}
