/** @fileoverview S5 Results. Billboard headline + floating proof-field pattern
 * ported from the legacy lab (`/lab/s5/ca-billboard-proof-field`), adapted to
 * v2 fonts + styling:
 *
 *   - Massive Lora Bold headline as the absolute gravity center of the top
 *     section. "Getting Better" uses Lora Bold Italic per VIS §2 lock (no
 *     colour variation on warm surface for WCAG AA).
 *   - 8 ambient proof cards orbit the headline in the surrounding whitespace
 *     on desktop (absolute-positioned percentages). Each card enters with a
 *     staggered opacity + translate animation, landing at 0.88 opacity so
 *     the headline reads at 100%.
 *   - Mobile collapses to a vertical stack below the centered headline.
 *   - Cards: Profile anchor, 20,000+ closers, 4.7/5 App Store, 3,000+ calls
 *     per day, 16+ industries, 7-dimension radar, 76% coached weekly, and
 *     a 7/50/30 performance gains strip.
 *
 * Everything below the billboard (context callout, App Store review
 * carousel, review-count anchor, ego appeal line, CTA) is unchanged from
 * prior S5 spec — we are only rebuilding the top of the section.
 *
 * WCAG AA on warm surface:
 *   - Emerald text uses #059669 (cc-accent-hover), not #10B981
 *   - Amber stat text uses #D97706 (amber-600), not #F59E0B
 *   - Body text: #475569 (text-secondary-warm) on #F5F0EB = 6.7:1
 *   - Headlines: #1A1D26 (text-primary-warm) on #F5F0EB = 14.9:1
 *
 * Profile card is anonymised ("Insurance closer") per the v2 truth-pack rule
 * — named customers are reserved for S5.5 and are not duplicated here. */

'use client'

import { useRef, type ReactElement, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA } from '@/lib/constants'
import { Star, AppleLogo } from '@phosphor-icons/react'

/* ── Tokens used inline where Tailwind token lookup is insufficient for AA ── */

const EMERALD_AA = '#059669' // cc-accent-hover: AA-safe emerald text on warm

/* ── Shared reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactElement | ReactElement[]
	className?: string
	delay?: number
}

/**
 * @description Local scroll-reveal wrapper for below-the-billboard blocks.
 * Stable initial props so server and client first-render match. Reduced
 * motion collapses the transition to 0s.
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

/* ── Proof card definitions for the anchor stats grid ──
 *
 * Reworked 2026-04-24 (Wave F2 G1/G2). Prior pinterest-float composition
 * with 8 orbiting stats + a 7-dimension radar has been replaced by a 5-card
 * responsive grid. The radar SVG is removed — not loss-bearing at this copy
 * density. */

type ProofCard = {
	id: string
	content: ReactNode
}

/* Anchor stats grid. Reworked 2026-04-24 (Wave F2 G1/G2) — killed the
 * pinterest-float orbit layout and the 2 cards that duplicated copy shown
 * elsewhere (profile "Insurance closer" overspecific; "Coached weekly 76%"
 * already shipped in the G3 testimonial kicker). Remaining 5 cards render
 * in a tight responsive grid below the headline instead of orbiting it. */
const CARDS: readonly ProofCard[] = [
	{
		id: 'stat-closers',
		content: (
			<div className='text-center'>
				<p className='font-[family-name:var(--font-mono)] text-2xl font-bold text-cc-text-primary-warm md:text-3xl'>
					20,000+
				</p>
				<p className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
					Closers
				</p>
			</div>
		),
	},
	{
		id: 'stat-calls',
		content: (
			<div className='text-center'>
				<p className='font-[family-name:var(--font-mono)] text-2xl font-bold text-cc-text-primary-warm md:text-3xl'>
					3,000+
				</p>
				<p className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
					Calls/Day
				</p>
			</div>
		),
	},
	{
		id: 'stat-industries',
		content: (
			<div className='text-center'>
				<p className='font-[family-name:var(--font-mono)] text-2xl font-bold text-cc-text-primary-warm md:text-3xl'>
					16+
				</p>
				<p className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
					Industries
				</p>
			</div>
		),
	},
	{
		id: 'stat-rating',
		content: (
			<div className='text-center'>
				<p className='font-[family-name:var(--font-mono)] text-2xl font-bold text-cc-text-primary-warm md:text-3xl'>
					4.7/5
				</p>
				<p className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
					App Store
				</p>
			</div>
		),
	},
	{
		id: 'gains',
		content: (
			<div className='flex items-center justify-center gap-4 md:gap-5'>
				<div className='flex flex-col items-center'>
					<span
						className='font-[family-name:var(--font-mono)] text-2xl font-bold md:text-3xl'
						style={{ color: EMERALD_AA }}
					>
						7%
					</span>
					<span className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
						Close Rate
					</span>
				</div>
				<div className='h-8 w-px bg-cc-warm-border' aria-hidden='true' />
				<div className='flex flex-col items-center'>
					<span
						className='font-[family-name:var(--font-mono)] text-2xl font-bold md:text-3xl'
						style={{ color: EMERALD_AA }}
					>
						50%
					</span>
					<span className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
						Faster Ramp
					</span>
				</div>
				<div className='h-8 w-px bg-cc-warm-border' aria-hidden='true' />
				<div className='flex flex-col items-center'>
					<span
						className='font-[family-name:var(--font-mono)] text-2xl font-bold md:text-3xl'
						style={{ color: EMERALD_AA }}
					>
						30%
					</span>
					<span className='mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
						More Deals
					</span>
				</div>
			</div>
		),
	},
] as const

/* ── Entrance animation config for the floating cards ── */

const cardVariant = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 0.88,
		y: 0,
		transition: { delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
	}),
}

/* ── Customer success tier cards (ported from SectionCaseStudies 2026-04-23) ──
 *
 * 3 named-customer tiers: CLOSER (Dimitriy, T2 verbatim), TEAMS (Chris, T3
 * verbatim), ENTERPRISE (G9 reframe, placeholder until a real enterprise
 * testimonial lands). Tier accents map: emerald #059669 / amber #B45309 /
 * slate #334155 — all AA on warm surface. */

const SLATE_WARM = '#334155'
const AMBER_WARM = '#B45309'
const WARM_BORDER = 'rgba(13,15,20,0.08)'

type TierCardProps = {
	tier: string
	tierAccent: string
	portraitSrc: string
	metricHeadline?: string
	industryTag: string
	quote: string
	name: string
	role: string
	badge: string
}

function TierCard({
	tier,
	tierAccent,
	portraitSrc,
	metricHeadline,
	industryTag,
	quote,
	name,
	role,
	badge,
}: TierCardProps): ReactElement {
	return (
		<article
			className='relative flex h-full flex-col gap-6 rounded-2xl bg-cc-warm-secondary p-6 md:gap-7 md:p-8'
			style={{
				border: `1px solid ${WARM_BORDER}`,
				boxShadow: '0 1px 2px rgba(13,15,20,0.04), 0 24px 48px -32px rgba(13,15,20,0.18)',
			}}
		>
			<header className='relative'>
				<div className='relative h-28 w-28 overflow-hidden rounded-full md:h-32 md:w-32'>
					<Image
						src={portraitSrc}
						alt=''
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
					style={{ color: EMERALD_AA, fontSize: '1.5em', lineHeight: 0.8 }}
				>
					&ldquo;
				</span>
				{quote}
			</blockquote>

			<footer
				className='mt-auto flex flex-col gap-3 border-t pt-5'
				style={{ borderColor: WARM_BORDER }}
			>
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
						border: '1px solid rgba(5,150,105,0.2)',
					}}
				>
					<svg viewBox='0 0 12 12' width='10' height='10' aria-hidden='true'>
						<path
							d='M2 6.5 L5 9 L10 3'
							fill='none'
							stroke={EMERALD_AA}
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					<span
						className='font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase tracking-[0.16em] md:text-[10px]'
						style={{ color: EMERALD_AA }}
					>
						{badge}
					</span>
				</span>
			</footer>
		</article>
	)
}

/* ── App Store testimonial cards (Figma 1:8352) ──
 *
 * Card shell: rgba(250,250,248,0.92) bg, rgba(229,221,212,0.8) border,
 * rounded-[24px], p-[21px], soft 2px/16px shadow. 5 amber stars at 16px,
 * Inter Regular 14px / 22.75px body, and an emerald "APP STORE REVIEW"
 * pill in the footer (Geist Mono 10px uppercase, tracking 0.25px). */

type Review = {
	quote: string
}

const YELLOW_STAR = '#FBBC04' // Figma Buttercup — brighter than AMBER_AA for star fills.

const APP_STORE_REVIEWS: ReadonlyArray<Review> = [
	{
		quote:
			"This app has helped me streamline my process. Really good with specific scenarios, and helping you with pace, tonality, and goals completed.",
	},
	{
		quote:
			"After coming back to this app after a couple of months I\u2019m super impressed at the improvements that have been made... Highly recommend!",
	},
	{
		quote:
			"I can already tell it\u2019s going to be the next wave of sales training and recruiting... I can see myself using this to help drill my closers.",
	},
] as const

function ReviewCard({ quote }: Review): ReactElement {
	return (
		<div
			className='flex h-full flex-col gap-3 rounded-[24px] p-[21px]'
			style={{
				backgroundColor: 'rgba(250,250,248,0.92)',
				border: '1px solid rgba(229,221,212,0.8)',
				boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
			}}
		>
			<div role='img' className='flex items-center gap-[2px]' aria-label='Five stars'>
				{Array.from({ length: 5 }, (_, i) => (
					<Star key={i} size={16} weight='fill' style={{ color: YELLOW_STAR }} aria-hidden='true' />
				))}
			</div>

			<p
				className='flex-1 text-cc-text-primary-warm'
				style={{
					fontFamily: 'var(--font-sans)',
					fontSize: '14px',
					lineHeight: '22.75px',
				}}
			>
				&ldquo;{quote}&rdquo;
			</p>

			<div className='pt-2'>
				<span
					className='inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px]'
					style={{
						backgroundColor: 'rgba(5,150,105,0.1)',
						border: '1px solid rgba(5,150,105,0.25)',
					}}
				>
					<AppleLogo size={12} weight='fill' style={{ color: EMERALD_AA }} aria-hidden='true' />
					<span
						className='uppercase'
						style={{
							fontFamily: 'var(--font-mono)',
							fontSize: '10px',
							lineHeight: '15px',
							letterSpacing: '0.25px',
							color: EMERALD_AA,
						}}
					>
						App Store Review
					</span>
				</span>
			</div>
		</div>
	)
}

/* ── Section ── */

/**
 * @description S5 Results. Billboard floating-proof top + unchanged
 * testimonial + ego-appeal tail. Lora Bold + italic emphasis on "Getting
 * Better" per VIS lock. All colours AA-safe on warm surface.
 */
export default function SectionResults(): ReactElement {
	return (
		<section id='results' data-surface='warm' className='relative bg-cc-warm'>
			{/* ── Billboard top: headline + anchor stats grid below ──
			 * Reworked 2026-04-24 (Wave F2 G1/G2). Replaces the pinterest-float
			 * orbit composition (8 stats scattered around the heading) with a
			 * tight responsive grid (4 stat chips + 1 gains strip) below the new
			 * heading. New heading de-repeats "getting better" copy thesis in
			 * favour of an active verb rhythm tying practice → improvement. */}
			<div className='relative overflow-hidden py-24 md:py-32'>
				<div className='relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 text-center'>
					<motion.p
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
						className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-text-secondary-warm md:text-xs'
					>
						Real numbers. Real closers.
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
						className='text-trim text-balance text-cc-text-primary-warm'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: 'clamp(2.25rem, 8vw, 6.5rem)',
							lineHeight: 0.98,
							letterSpacing: '-0.015em',
						}}
					>
						Every call, scored.
						<br className='hidden sm:block' />
						{' '}Every rep, <span style={{ fontStyle: 'italic' }}>improving</span>.
					</motion.h2>
				</div>

				{/* Anchor stats grid. 4 chips + gains strip — 4-col on desktop, 2-col
				 * on tablet, 1-col stack on mobile. Gains strip spans full width on
				 * all viewports (grid column 1 / -1). */}
				<div className='mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 px-6 md:mt-16 md:grid-cols-4 md:gap-5'>
					{CARDS.slice(0, 4).map((card, i) => (
						<motion.div
							key={card.id}
							custom={i}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true, amount: 0.3 }}
							variants={cardVariant}
							className='rounded-xl border border-cc-warm-border bg-cc-warm-secondary/90 p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]'
						>
							{card.content}
						</motion.div>
					))}
					<motion.div
						key={CARDS[4].id}
						custom={4}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true, amount: 0.3 }}
						variants={cardVariant}
						className='col-span-2 rounded-xl border border-cc-warm-border bg-cc-warm-secondary/90 p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] md:col-span-4'
					>
						{CARDS[4].content}
					</motion.div>
				</div>
			</div>

			{/* ── Below-billboard content ── */}
			<div className='mx-auto max-w-7xl px-6 pb-16 md:pb-24'>
				{/* Context pill + billboard title (Figma 1:8353). Pill carries the
				 * quota stat with red/emerald accents; title below in Lora Bold
				 * 48px anchors the App Store Review block. */}
				<Reveal className='mt-4 flex flex-col items-center gap-6 text-center md:mt-8' delay={0.05}>
					<span
						className='inline-flex items-center justify-center rounded-full px-5 py-[10px]'
						style={{
							backgroundColor: 'rgba(255,255,255,0.51)',
							border: '1px solid rgba(229,221,212,0.8)',
							boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
						}}
					>
						<span
							className='text-cc-text-primary-warm'
							style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', lineHeight: '22px' }}
						>
							Coached weekly:{' '}
							<span style={{ color: EMERALD_AA }}>76% quota hit.</span>
							{' '}Coached quarterly: <span style={{ color: '#FF5A5A' }}>47%.</span>
						</span>
					</span>
					<h3
						className='text-trim text-balance text-cc-text-primary-warm'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: 'clamp(1.875rem, 4vw, 3rem)',
							lineHeight: 1.08,
							letterSpacing: '-0.015em',
						}}
					>
						Top sales producers are training on CloserCoach at least 2 hours/week.
					</h3>
				</Reveal>

				{/* App Store review cards (Figma 1:8359). 3 cards @ 400px each on
				 * desktop, stack on mobile. */}
				<div className='mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3'>
					{APP_STORE_REVIEWS.map((r, i) => (
						<Reveal key={i} delay={i * 0.08}>
							<ReviewCard quote={r.quote} />
						</Reveal>
					))}
				</div>

				{/* Customer success tier cards — CLOSER / TEAMS / ENTERPRISE */}
				<div className='mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3 md:gap-6'>
					<Reveal delay={0}>
						<TierCard
							tier='Closer'
							tierAccent={EMERALD_AA}
							portraitSrc='/images/placeholders/case-dimitriy.jpg'
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
							metricHeadline='1 hour per week. 20 reps trained.'
							industryTag='Sales Manager, Lake Washington'
							quote={'Before CloserCoach, I was spending 1 hour per week per rep. Now, I spend 1 hour per week training 20 reps.'}
							name='Chris'
							role='Sales Manager, Lake Washington'
							badge='Sales Manager'
						/>
					</Reveal>
					<Reveal delay={0.16}>
						<TierCard
							tier='Enterprise'
							tierAccent={SLATE_WARM}
							portraitSrc='/images/placeholders/case-enterprise.jpg'
							metricHeadline='22-seat team onboarding.'
							industryTag='Enterprise Sales Team'
							quote={'Enterprise sales teams are onboarding CloserCoach at scale. One of the fastest-growing teams on the platform has 22 active seats.'}
							name='Enterprise Sales Team'
							role='Anonymized'
							badge='Platform Deal'
						/>
					</Reveal>
				</div>

				{/* Review count anchor (Figma 1:8435). "378+" in Lora Bold Italic
				 * emerald; the rest in Inter Medium uppercase slate. */}
				<Reveal className='mt-8 md:mt-10' delay={0.05}>
					<p
						className='text-trim text-center uppercase text-cc-text-secondary-warm'
						style={{
							fontSize: '16px',
							lineHeight: '19.5px',
							letterSpacing: '2.34px',
						}}
					>
						<span
							className='italic'
							style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: EMERALD_AA }}
						>
							378+
						</span>{' '}
						<span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
							reviews on the App Store.
						</span>
					</p>
				</Reveal>

				{/* Ego appeal line (PC5 + PC6) */}
				<Reveal className='mt-16 md:mt-24' delay={0.05}>
					<p className='mx-auto max-w-3xl text-balance text-center text-base text-cc-text-primary-warm md:text-lg'>
						After one roleplay you will know:{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>B grade</span>
						{' '}&middot;{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>Top 15%</span>
						{' '}&middot;{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>211 WPM</span>
						{' '}&middot;{' '}
						<span className='font-[family-name:var(--font-mono)] font-medium'>
							64/36 talk-listen ratio
						</span>
						. Every number gets better.
					</p>
				</Reveal>

				{/* CTA */}
				<Reveal className='mt-12 flex justify-center md:mt-16' delay={0.05}>
					<MotionCTA variant='primary' size='lg' href={CTA.tryFree.href} warmSurface>
						{CTA.tryFree.text}
					</MotionCTA>
				</Reveal>
			</div>
		</section>
	)
}
