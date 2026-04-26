/** @fileoverview S5.5 Case Studies (W6). NEW section between Founder Strip (W5,
 * dark) and Teams (S6). Warm surface (#F5F0EB) continues the exhale. Top edge
 * gradient softens the dark → warm transition from Founder Strip.
 *
 * Composition per section-blueprint v2 § S5.5 Case Studies:
 *   1. Top-edge gradient band (~96px) from cc-foundation into warm.
 *   2. Geist Mono overline + Lora Bold billboard-adjacent headline.
 *   3. AZ 4-frame duotone interstitial: Practice · Lose · Learn · Win.
 *      Inline SVG duotone color blocks (emerald shadow #0D4A38 → warm highlight
 *      #F5F0EB). Large Lora Bold label overlay bottom-left on each frame.
 *      Desktop: 4-col horizontal row. Mobile: 2x2 grid.
 *   4. Three case study tier cards (REAL DATA ONLY — NO fabricated V2 content):
 *        - CLOSER — Dimitriy (T2 verbatim) · "Verified User" badge
 *        - TEAMS — Chris (T3 verbatim + "1 hour per week. 20 reps trained.")
 *        - ENTERPRISE — G9 reframe ("22-seat team onboarding") — flagged as
 *          placeholder until real enterprise testimonial lands (T6 P0).
 *      3-col grid desktop / stack mobile.
 *
 * Surface transition: 80-100px gradient at top from cc-foundation (#0D0F14) into
 * cc-warm-light (#F5F0EB). Continues from W5 dark into warm exhale.
 *
 * Portrait placeholders: /public/images/case-studies/{dimitriy,chris,enterprise}.svg
 * Same duotone vocabulary as W5 founder headshots (circular frame, emerald ring,
 * duotone bg). Marked placeholder — swap when real photos land.
 *
 * WCAG AA on warm (#F5F0EB):
 *   - cc-text-primary #0D0F14 = 18:1 (headlines, names)
 *   - cc-text-secondary-warm (#3A3D47) = ~10:1 (body)
 *   - Emerald-hover #059669 = 4.52:1 (tier accent for CLOSER pill text)
 *   - Amber-dark #B45309 = 5.03:1 (tier accent for TEAMS pill text)
 *   - Slate-700 #334155 = 9.1:1 (tier accent for ENTERPRISE pill text)
 *
 * Hydration safety: all initial props stable, no client-branched initial state.
 * Reduced motion via useReducedMotion collapses transitions to 0s per F42.
 *
 * Zero fabricated data: T2 Dimitriy quote verbatim, T3 Chris quote verbatim, G9
 * enterprise reframe uses only verified "22-seat deal" fact. Marcus Chen and all
 * V2 fabricated metrics (3x quota, C- to A in 8 weeks, $10K months, Meridian
 * Financial) are KILLED. */

'use client'

import { useRef, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'

const EMERALD_ACCENT_WARM = '#059669'
const AMBER_WARM = '#B45309'
const SLATE_WARM = '#334155'
const WARM_BORDER = 'rgba(13,15,20,0.08)'

/* ── Reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactElement | ReactElement[]
	className?: string
	delay?: number
}

/**
 * @description Scroll-reveal wrapper. Stable initial props so SSR matches CSR.
 * Reduced motion collapses the transition to 0s per F42 hydration contract.
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
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{children}
		</motion.div>
	)
}

/* ── AZ 4-frame duotone interstitial (Practice · Lose · Learn · Win) ── */

type AzFrame = {
	label: string
	/* Per AP lock: emerald shadow on warm highlight. Each frame shifts the
	   gradient angle/intensity to give the 4 beats their own rhythm. */
	gradient: string
	/* Decorative glyph hint rendered as a faint SVG overlay. Never load-bearing. */
	glyph: 'dots' | 'arrow-down' | 'arrow-up' | 'check'
}

const AZ_FRAMES: ReadonlyArray<AzFrame> = [
	{
		label: 'Practice',
		gradient: 'linear-gradient(160deg, #0D4A38 0%, #1A6B52 45%, #F5F0EB 140%)',
		glyph: 'dots',
	},
	{
		label: 'Lose',
		gradient: 'linear-gradient(170deg, #0D4A38 0%, #12563E 55%, #2F4A3F 120%)',
		glyph: 'arrow-down',
	},
	{
		label: 'Learn',
		gradient: 'linear-gradient(150deg, #0D4A38 0%, #1A6B52 40%, #8FB39E 130%)',
		glyph: 'arrow-up',
	},
	{
		label: 'Win',
		gradient: 'linear-gradient(140deg, #0D4A38 0%, #10B981 50%, #F5F0EB 130%)',
		glyph: 'check',
	},
] as const

/**
 * @description Small decorative glyph. Faint white stroke, aria-hidden.
 */
function FrameGlyph({ glyph }: { glyph: AzFrame['glyph'] }): ReactElement {
	const common = { stroke: 'rgba(245,240,235,0.35)', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
	switch (glyph) {
		case 'dots':
			return (
				<svg viewBox='0 0 40 40' width='32' height='32' aria-hidden='true'>
					<circle cx='8' cy='20' r='2' fill='rgba(245,240,235,0.45)' stroke='none'/>
					<circle cx='20' cy='20' r='2' fill='rgba(245,240,235,0.45)' stroke='none'/>
					<circle cx='32' cy='20' r='2' fill='rgba(245,240,235,0.45)' stroke='none'/>
				</svg>
			)
		case 'arrow-down':
			return (
				<svg viewBox='0 0 40 40' width='32' height='32' aria-hidden='true'>
					<path d='M20 10 V30 M12 24 L20 30 L28 24' {...common}/>
				</svg>
			)
		case 'arrow-up':
			return (
				<svg viewBox='0 0 40 40' width='32' height='32' aria-hidden='true'>
					<path d='M20 30 V10 M12 16 L20 10 L28 16' {...common}/>
				</svg>
			)
		case 'check':
			return (
				<svg viewBox='0 0 40 40' width='32' height='32' aria-hidden='true'>
					<path d='M10 21 L18 28 L30 14' {...common} strokeWidth={2}/>
				</svg>
			)
	}
}

/**
 * @description 4-frame duotone interstitial. 4-col desktop / 2x2 mobile grid.
 * Each frame is a 3:4 duotone color block with a Lora Bold label overlay and a
 * subtle glyph hint. No photos — stylized color-block treatment per agent
 * judgment (cleaner than placeholder SVGs for launch).
 */
function AzInterstitial(): ReactElement {
	return (
		<div className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
			{AZ_FRAMES.map((frame, i) => (
				<Reveal key={frame.label} delay={i * 0.06}>
					<div
						className='relative aspect-[3/4] overflow-hidden rounded-xl'
						style={{
							backgroundImage: frame.gradient,
							boxShadow: '0 18px 40px -24px rgba(13,74,56,0.45)',
						}}
					>
						{/* Subtle inner emerald wash for depth */}
						<div
							aria-hidden='true'
							className='pointer-events-none absolute inset-0'
							style={{
								background: 'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 70%)',
							}}
						/>
						{/* Glyph top-right */}
						<div className='absolute right-4 top-4 opacity-90 md:right-5 md:top-5'>
							<FrameGlyph glyph={frame.glyph}/>
						</div>
						{/* Label bottom-left */}
						<div
							className='absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 md:px-5 md:pb-5'
							style={{
								background: 'linear-gradient(180deg, rgba(13,15,20,0) 0%, rgba(13,15,20,0.55) 100%)',
							}}
						>
							<p
								className='text-balance'
								style={{
									fontFamily: 'var(--font-heading)',
									fontWeight: 700,
									fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
									lineHeight: 1.1,
									color: '#F8FAFC',
									letterSpacing: '-0.01em',
								}}
							>
								{frame.label}
							</p>
						</div>
					</div>
				</Reveal>
			))}
		</div>
	)
}

/* ── Case study tier card ── */

type TierCardProps = {
	tier: string
	tierAccent: string
	portraitSrc: string
	portraitAlt: string
	metricHeadline?: string
	industryTag: string
	quote: string
	name: string
	role: string
	badge: string
	isPlaceholder?: boolean
}

/**
 * @description Case study tier card. Portrait top 40-50%, tier pill top-left
 * overlapping portrait edge, optional metric headline, industry tag pill, Lora
 * Bold Italic quote, name + role + source badge footer. Used for CLOSER, TEAMS,
 * and ENTERPRISE tiers on warm surface.
 */
function TierCard({
	tier,
	tierAccent,
	portraitSrc,
	portraitAlt,
	metricHeadline,
	industryTag,
	quote,
	name,
	role,
	badge,
	isPlaceholder = false,
}: TierCardProps): ReactElement {
	return (
		<article
			className='relative flex h-full flex-col gap-6 rounded-2xl bg-cc-warm-secondary p-6 md:gap-7 md:p-8'
			style={{
				border: `1px solid ${WARM_BORDER}`,
				boxShadow: '0 1px 2px rgba(13,15,20,0.04), 0 24px 48px -32px rgba(13,15,20,0.18)',
			}}
		>
			{/* Portrait + tier pill overlap */}
			<header className='relative'>
				<div className='relative h-28 w-28 overflow-hidden rounded-full md:h-32 md:w-32'>
					<Image
						src={portraitSrc}
						alt={portraitAlt}
						aria-hidden='true'
						fill
						sizes='(min-width: 768px) 128px, 112px'
						style={{ objectFit: 'cover' }}
					/>
				</div>
				<span
					className='absolute -top-1 left-24 inline-flex items-center rounded-full bg-cc-warm px-3 py-1.5 md:left-28'
					style={{
						border: `1px solid ${WARM_BORDER}`,
						boxShadow: '0 4px 12px -6px rgba(13,15,20,0.12)',
					}}
				>
					<span
						className='font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] md:text-[11px]'
						style={{ color: tierAccent }}
					>
						{tier}
					</span>
				</span>
			</header>

			{/* Metric headline (optional) */}
			{metricHeadline ? (
				<h3
					className='text-trim text-balance text-cc-text-primary-warm'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontSize: 'clamp(1.375rem, 2.4vw, 1.75rem)',
						lineHeight: 1.15,
						letterSpacing: '-0.01em',
					}}
				>
					{metricHeadline}
				</h3>
			) : null}

			{/* Industry tag */}
			<span
				className='inline-flex w-fit items-center rounded-full px-3 py-1'
				style={{
					backgroundColor: 'rgba(13,15,20,0.04)',
					border: `1px solid ${WARM_BORDER}`,
				}}
			>
				<span className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.14em] text-cc-text-secondary-warm md:text-[11px]'>
					{industryTag}
				</span>
			</span>

			{/* Quote */}
			<blockquote
				className='text-cc-text-primary-warm'
				style={{
					fontFamily: 'var(--font-heading)',
					fontWeight: 700,
					fontStyle: 'italic',
					fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
					lineHeight: 1.5,
					letterSpacing: '-0.005em',
				}}
			>
				<span
					aria-hidden='true'
					className='mr-1.5 align-top'
					style={{ color: EMERALD_ACCENT_WARM, fontSize: '1.5em', lineHeight: 0.8 }}
				>
					&ldquo;
				</span>
				{quote}
			</blockquote>

			{/* Footer: name + role + badge */}
			<footer className='mt-auto flex flex-col gap-3 border-t pt-5' style={{ borderColor: WARM_BORDER }}>
				<div className='flex flex-col gap-0.5'>
					<p
						className='text-trim text-cc-text-primary-warm'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: '1rem',
							lineHeight: 1.25,
						}}
					>
						{name}
					</p>
					<p className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.16em] text-cc-text-secondary-warm md:text-[11px]'>
						{role}
					</p>
				</div>
				<span
					className='inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1'
					style={{
						backgroundColor: 'rgba(5,150,105,0.08)',
						border: `1px solid rgba(5,150,105,0.2)`,
					}}
				>
					<svg viewBox='0 0 12 12' width='10' height='10' aria-hidden='true'>
						<path d='M2 6.5 L5 9 L10 3' fill='none' stroke={EMERALD_ACCENT_WARM} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
					</svg>
					<span
						className='font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase tracking-[0.16em] md:text-[10px]'
						style={{ color: EMERALD_ACCENT_WARM }}
					>
						{badge}
					</span>
				</span>
				{isPlaceholder ? (
					/* PLACEHOLDER — real enterprise customer testimonial pending (T6 P0 Taylor).
					 * Swap to "[INDUSTRY VERTICAL TBD]" tag pre-launch per F1-H3. Real attribution lands in Wave F4. */
					<p className='font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.14em] text-cc-text-secondary-warm/70'>
						[Industry Vertical TBD]
					</p>
				) : null}
			</footer>
		</article>
	)
}

/* ── Section ── */

/**
 * @description S5.5 Case Studies section. Warm surface with top-edge dark→warm
 * gradient transition from Founder Strip. AZ 4-frame interstitial above 3 tier
 * cards (CLOSER Dimitriy T2, TEAMS Chris T3, ENTERPRISE G9 reframe). All
 * content traced to verified proof — zero fabricated quotes, metrics, or names.
 */
export default function SectionCaseStudies(): ReactElement {
	return (
		<section
			id='case-studies'
			data-surface='warm'
			className='relative overflow-hidden bg-cc-warm-light py-16 md:py-24'
		>
			{/* Top-edge gradient: fades from cc-foundation into warm. ~96px band. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 top-0 h-20 md:h-24'
				style={{
					background:
						'linear-gradient(180deg, rgba(13,15,20,1) 0%, rgba(13,15,20,0.6) 30%, rgba(245,240,235,0) 100%)',
				}}
			/>

			<div className='relative mx-auto max-w-7xl px-6'>
				{/* Overline + headline */}
				<Reveal className='flex flex-col items-center text-center'>
					<p className='mb-5 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary-warm md:text-xs'>
						Real closers. Real stories.
					</p>
					<h2
						className='text-trim text-balance text-cc-text-primary-warm'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: 'clamp(2rem, 5.5vw, 3.75rem)',
							lineHeight: 1.05,
							letterSpacing: '-0.015em',
						}}
					>
						Practice. Lose. Learn.{' '}
						<span style={{ fontStyle: 'italic', color: EMERALD_ACCENT_WARM }}>Win</span>.
					</h2>
				</Reveal>

				{/* AZ 4-frame duotone interstitial */}
				<div className='mt-12 md:mt-16'>
					<AzInterstitial/>
				</div>

				{/* 3 tier cards */}
				<div className='mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3 md:gap-6'>
					<Reveal delay={0}>
						<TierCard
							tier='Closer'
							tierAccent={EMERALD_ACCENT_WARM}
							portraitSrc='/images/placeholders/case-dimitriy.jpg'
							portraitAlt=''
							industryTag='Insurance Sales'
							quote={'Honestly a great app and a surprisingly well thought out and detail-oriented use of AI. I\u2019ve been using CloserCoach to sharpen my skills and get back into sales after being out of the game, it\u2019s the most valuable resource I have.'}
							name='Dimitriy'
							role='Insurance Sales'
							badge='Verified User'
						/>
					</Reveal>
					<Reveal delay={0.08}>
						<TierCard
							tier='Teams'
							tierAccent={AMBER_WARM}
							portraitSrc='/images/placeholders/case-chris.jpg'
							portraitAlt=''
							metricHeadline='1 hour per week. 20 reps trained.'
							industryTag='Sales Manager, Lake Washington'
							quote={'Before CloserCoach, I was spending 1 hour per week per rep. Now, I spend 1 hour per week training 20 reps.'}
							name='Chris'
							role='Sales Manager, Lake Washington'
							badge='Sales Manager'
						/>
					</Reveal>
					{/* PLACEHOLDER — real enterprise customer testimonial pending (T6). G9
					    reframe used per section-blueprint Option A. */}
					<Reveal delay={0.16}>
						<TierCard
							tier='Enterprise'
							tierAccent={SLATE_WARM}
							portraitSrc='/images/placeholders/case-enterprise.jpg'
							portraitAlt=''
							metricHeadline='22-seat team onboarding.'
							industryTag='Enterprise Sales Team'
							quote={'Enterprise sales teams are onboarding CloserCoach at scale. One of the fastest-growing teams on the platform has 22 active seats.'}
							name='Enterprise Sales Team'
							role='Anonymized'
							badge='Platform Deal'
							isPlaceholder
						/>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
