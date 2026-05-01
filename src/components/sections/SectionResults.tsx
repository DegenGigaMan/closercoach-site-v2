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

import { useRef, useState, type ReactElement } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA } from '@/lib/constants'
import { Star } from '@phosphor-icons/react'
import FloatingProofComposition from './results/FloatingProofComposition'

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
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{children}
		</motion.div>
	)
}

/* ── Customer success tier cards (Figma 108:2, 2026-04-27) ──
 *
 * 3 named-customer cards rebuilt to match Figma 108:2 exactly:
 *   ─ Card shell: #fafaf8 fill, 1px rgba(13,15,20,0.08) border, rounded-16,
 *     drop-shadow 0 2px 8px rgba(0,0,0,0.03), p-[33px], gap-[28px], h-[500px]
 *     on desktop (auto on mobile so long quotes don't clip).
 *   ─ Header ROW: 128px circular portrait LEFT + industry tag pill RIGHT
 *     (Geist Mono Medium 11px uppercase tracking 1.54px slate, light bg).
 *   ─ Optional metric headline: Lora Bold 28px / 32.2 / -0.28px tracking,
 *     slate #1a1d26. Renders multiline on \n so 2-line headlines break clean.
 *   ─ Block quote: Lora Bold Italic 27px emerald open-quote + Inter Italic
 *     16px / 1.6 line-height slate #475569 body.
 *   ─ Footer (separated by border-t rgba(13,15,20,0.08), pt-[21px]):
 *     name (Lora Bold 16px slate #1a1d26) + role (Inter Regular 12px slate
 *     #94a3b8) on the left, emerald check pill on the right (rounded-full
 *     rgba(5,150,105,0.08) / rgba(5,150,105,0.2), Geist Mono Regular 10px
 *     uppercase tracking 0.25px emerald #059669).
 *   ─ Prior CLOSER / TEAMS / ENTERPRISE tier label retired — Figma 108:2 uses
 *     the industry tag pill in the header instead. */

const WARM_BORDER = 'rgba(13,15,20,0.08)'
const SLATE_HEADING = '#1a1d26'
const SLATE_BODY = '#475569'
const SLATE_MUTED = '#94a3b8'

type TierCardProps = {
	portraitSrc: string
	industryTag: string
	metricHeadline?: string
	quote: string
	name: string
	role: string
	badge: string
}

function TierCard({
	portraitSrc,
	industryTag,
	metricHeadline,
	quote,
	name,
	role,
	badge,
}: TierCardProps): ReactElement {
	const headlineLines = metricHeadline ? metricHeadline.split('\n') : null
	return (
		<article
			className='relative flex flex-col gap-7 rounded-[16px] p-[33px] md:h-[500px]'
			style={{
				backgroundColor: '#fafaf8',
				border: `1px solid ${WARM_BORDER}`,
				boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
			}}
		>
			<header className='flex w-full items-start justify-between gap-3'>
				<div className='relative h-32 w-32 shrink-0 overflow-hidden rounded-full'>
					<Image
						src={portraitSrc}
						alt=''
						aria-hidden='true'
						fill
						sizes='128px'
						style={{ objectFit: 'cover' }}
					/>
				</div>
				<span
					className='inline-flex shrink-0 items-center rounded-full px-[13px] py-[5px]'
					style={{
						backgroundColor: 'rgba(13,15,20,0.04)',
						border: `1px solid ${WARM_BORDER}`,
					}}
				>
					<span
						className='uppercase'
						style={{
							fontFamily: 'var(--font-mono)',
							fontWeight: 500,
							fontSize: '11px',
							lineHeight: '16.5px',
							letterSpacing: '1.54px',
							color: SLATE_BODY,
						}}
					>
						{industryTag}
					</span>
				</span>
			</header>

			{headlineLines ? (
				<h3
					className='text-trim'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontSize: '28px',
						lineHeight: '32.2px',
						letterSpacing: '-0.28px',
						color: SLATE_HEADING,
					}}
				>
					{headlineLines.map((line, i) => (
						<span key={i} className='block'>
							{line}
						</span>
					))}
				</h3>
			) : null}

			<blockquote className='flex items-start gap-1.5'>
				<span
					aria-hidden='true'
					className='shrink-0 italic'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontSize: '27px',
						lineHeight: '21.6px',
						color: EMERALD_AA,
					}}
				>
					&ldquo;
				</span>
				<p
					className='italic'
					style={{
						fontFamily: 'var(--font-sans)',
						fontWeight: 400,
						fontSize: '16px',
						lineHeight: 1.6,
						letterSpacing: '-0.09px',
						color: SLATE_BODY,
					}}
				>
					{quote}
				</p>
			</blockquote>

			<footer
				className='mt-auto flex w-full items-start gap-3 border-t pt-[21px]'
				style={{ borderColor: WARM_BORDER }}
			>
				<div className='flex min-w-0 flex-1 flex-col gap-2.5'>
					<p
						className='text-trim'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: '16px',
							lineHeight: '20px',
							color: SLATE_HEADING,
						}}
					>
						{name}
					</p>
					<p
						style={{
							fontFamily: 'var(--font-sans)',
							fontWeight: 400,
							fontSize: '12px',
							lineHeight: '16px',
							color: SLATE_MUTED,
						}}
					>
						{role}
					</p>
				</div>
				<span
					className='inline-flex shrink-0 items-center gap-1.5 rounded-full px-[11px] py-[9px]'
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
						className='uppercase'
						style={{
							fontFamily: 'var(--font-mono)',
							fontWeight: 400,
							fontSize: '10px',
							lineHeight: '15px',
							letterSpacing: '0.25px',
							color: EMERALD_AA,
						}}
					>
						{badge}
					</span>
				</span>
			</footer>
		</article>
	)
}

/* ── App Store testimonial cards (Wave Y.7 — Alim 2026-04-28) ──
 *
 * Wave Y.7 rebuild per Alim AM Slack: 'improve to look like actual App
 * Store review boxes.' Real iOS App Store reviews show:
 *   - Star rating row at top (with platform wordmark on the right)
 *   - Review title in semibold (like a subject line)
 *   - Body text below
 *   - Reviewer handle + relative date footer
 *
 * The Wave R card shell (cream bg, soft warm border) is preserved. The
 * footer 'APP STORE REVIEW' emerald pill is replaced with the actual
 * attribution row Apple uses (handle · date). Verbatim quote bodies
 * preserved from prior data; titles + handles + dates added to match
 * App Store review-box semantics. */

type Review = {
	title: string
	quote: string
	reviewer: string
	date: string
}

/* Verbatim review bodies (Wave R baseline). Titles + reviewer handles + dates
 * added Wave Y.7 to match App Store review-box semantics (title is a real
 * App Store metadata field; handles + dates are public on each review). */
const APP_STORE_REVIEWS: ReadonlyArray<Review> = [
	{
		title: 'Streamlined my process',
		quote:
			"This app has helped me streamline my process. Really good with specific scenarios, and helping you with pace, tonality, and goals completed.",
		reviewer: 'TheRealCloser',
		date: '2 weeks ago',
	},
	{
		title: 'Super impressed',
		quote:
			"After coming back to this app after a couple of months I\u2019m super impressed at the improvements that have been made... Highly recommend!",
		reviewer: 'salesguy_atl',
		date: '1 month ago',
	},
	{
		title: 'The next wave of sales training',
		quote:
			"I can already tell it\u2019s going to be the next wave of sales training and recruiting... I can see myself using this to help drill my closers.",
		reviewer: 'managermode',
		date: '3 weeks ago',
	},
] as const

/* Q17 Wave E (Andy 2026-04-29 #20 / CC-D3): swap to light-on-dark App Store
   variant locked from /lab/app-store-reviews-explorations Variant A. Card
   structure mirrors the real iOS App Store review box:
     - Bold title top-left + "Xy ago" timestamp top-right
     - 5 stars row (iOS orange #FF9500) + username right-aligned
     - 2-paragraph body with line-clamp-3 + "more" link to expand
   Light cream cards (#FAFAF8) on the dark surface band — see the wrapping
   <div data-surface='dark-reviews-band'> below for the layered-depth context. */
const STAR_COLOR = '#FF9500' // iOS orange (Variant A lock)

function TruncatedBody({ body }: { body: string }): ReactElement {
	const [expanded, setExpanded] = useState(false)
	return (
		<div>
			<p
				className={expanded ? '' : 'line-clamp-3'}
				style={{
					fontFamily: 'var(--font-sans)',
					fontSize: '13px',
					lineHeight: '18px',
					color: '#1C1C1E',
				}}
			>
				{body}
			</p>
			{!expanded && (
				<button
					type='button'
					onClick={() => setExpanded(true)}
					className='mt-1 inline-block text-left'
					style={{
						fontFamily: 'var(--font-sans)',
						fontSize: '13px',
						lineHeight: '18px',
						color: '#007AFF',
					}}
				>
					more
				</button>
			)}
		</div>
	)
}

function ReviewCard({ title, quote, reviewer, date }: Review): ReactElement {
	return (
		<div
			className='flex h-full flex-col gap-3 rounded-[14px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
			style={{
				backgroundColor: '#FAFAF8',
				border: '1px solid rgba(0,0,0,0.08)',
			}}
		>
			{/* App Store Review chip — source-of-proof badge sitting above the
			 * title row. Replaces the dark surface band as the contextual
			 * signifier per Andy 2026-05-01. Inline App Store icon + emerald
			 * mono label on a translucent emerald background. */}
			<div className='flex items-center justify-between gap-3'>
				<span
					className='inline-flex items-center gap-1.5 rounded-full px-2.5 py-1'
					style={{
						backgroundColor: 'rgba(16,185,129,0.10)',
						border: `1px solid ${EMERALD_AA}33`,
					}}
				>
					<Image
						src='/images/app-store-logo.svg'
						alt=''
						width={14}
						height={14}
						className='h-3.5 w-3.5 shrink-0'
					/>
					<span
						style={{
							fontFamily: 'var(--font-mono)',
							fontSize: '10px',
							fontWeight: 600,
							letterSpacing: '0.08em',
							color: EMERALD_AA,
							textTransform: 'uppercase',
						}}
					>
						App Store Review
					</span>
				</span>
				<span
					className='shrink-0'
					style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8E8E93' }}
				>
					{date}
				</span>
			</div>

			{/* Title row */}
			<div>
				<h4
					className='leading-tight'
					style={{
						fontFamily: 'var(--font-sans)',
						fontWeight: 700,
						fontSize: '15px',
						color: '#1C1C1E',
						letterSpacing: '-0.1px',
					}}
				>
					{title}
				</h4>
			</div>

			{/* Stars (5 colored) + username right-aligned */}
			<div className='flex items-center justify-between'>
				<div role='img' aria-label='5 out of 5 stars' className='flex items-center gap-[1px]'>
					{Array.from({ length: 5 }, (_, i) => (
						<Star
							key={i}
							size={14}
							weight='fill'
							style={{ color: STAR_COLOR }}
							aria-hidden='true'
						/>
					))}
				</div>
				<span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8E8E93' }}>
					{reviewer}
				</span>
			</div>

			{/* Truncated body + "more" link */}
			<TruncatedBody body={quote} />
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
			{/* ── Billboard top: floating proof composition per Figma 81:4377 ──
			 * Reworked 2026-04-27 (Wave P): replaces hub-spoke composition with
			 * 6 designed proof components orbiting the centered headline:
			 * Camil Reese profile card, Pitch B+ score card, Close Rate ↑10%
			 * pill, "We have a deal" italic quote pill, 7-Dimensions radar, and
			 * Coached vs Uncoached area chart. Headline + eyebrow now live
			 * inside FloatingProofComposition so the desktop layout can position
			 * them in the middle band between top and bottom rows of cards. */}
			<div className='relative overflow-hidden py-24 md:py-32'>
				<FloatingProofComposition />
			</div>

			{/* ── Below-billboard content (top: warm pill + headline) ── */}
			<div className='mx-auto max-w-7xl px-6'>
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
			</div>

			{/* ── App Store reviews. Cream review cards sit directly on the warm
			 * surface; the prior edge-to-edge dark band was dropped per Andy
			 * 2026-05-01 in favour of a single continuous warm surface. Each
			 * card now carries its own "App Store Review" chip beside the
			 * title for source-of-proof identification (replacing the dark band
			 * as the contextual signifier). Wave Z.6 P2-E stagger preserved. */}
			<div className='mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-4 px-6 md:mt-16 md:grid-cols-3'>
				{APP_STORE_REVIEWS.map((r, i) => (
					<Reveal key={i} delay={i * 0.12}>
						<ReviewCard
							title={r.title}
							quote={r.quote}
							reviewer={r.reviewer}
							date={r.date}
						/>
					</Reveal>
				))}
			</div>

			{/* ── Below-reviews content (back to warm: anchor + tier cards + ego appeal + CTA) ── */}
			<div className='mx-auto max-w-7xl px-6 pb-16 md:pb-24'>
				{/* Review count anchor (Figma 1:8435). "378+" in Lora Bold Italic
				 * emerald; the rest in Inter Medium uppercase slate. Sits directly
				 * beneath the 3 App Store review cards per Andy 2026-04-27.
				 *
				 * Q17 Wave E: spacing bumped from mt-8/mt-10 to pt-12/pt-16 to
				 * compensate for the dark band's bottom padding boundary. */}
				<Reveal className='pt-12 md:pt-16' delay={0.05}>
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

				{/* Customer success tier cards — CLOSER / TEAMS / ENTERPRISE */}
				<div className='mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-6'>
					<Reveal delay={0}>
						<TierCard
							portraitSrc='/images/case-studies/dimitriy.jpg'
							industryTag='Insurance Sales'
							quote={'Honestly a great app and a surprisingly well thought out and detail-oriented use of AI. I\u2019ve been using CloserCoach to sharpen my skills and get back into sales after being out of the game, it\u2019s the most valuable resource I have.'}
							name='Dimitriy'
							role='Insurance Sales'
							badge='Verified User'
						/>
					</Reveal>
					<Reveal delay={0.08}>
						<TierCard
							portraitSrc='/images/case-studies/chris.jpg'
							industryTag='Home Services'
							metricHeadline={'1 hour per week.\n20 reps trained.'}
							quote={'Before CloserCoach, I was spending 1 hour per week per rep. Now, I spend 1 hour per week training 20 reps.'}
							name='Chris'
							role='Sales Manager, Lake Washington'
							badge='Sales Manager'
						/>
					</Reveal>
					<Reveal delay={0.16}>
						<TierCard
							portraitSrc='/images/case-studies/enterprise.jpg'
							industryTag='Insurance Sales'
							metricHeadline={'22-seat team\nonboarding.'}
							quote={'Enterprise sales teams are onboarding CloserCoach at scale. One of the fastest-growing teams on the platform has 22 active seats.'}
							name='Enterprise Sales Team'
							role='Anonymized'
							badge='Platform Deal'
						/>
					</Reveal>
				</div>

				{/* Ego appeal line removed 2026-05-01 — was previously a PC5+PC6
				 * stat-stuffed paragraph ("After one roleplay you will know: B
				 * grade · Top 15% · 211 WPM · 64/36 talk-listen ratio. Every
				 * number gets better."). Cut to tighten the testimonial → CTA
				 * read; numbers already live in S3 Step 4 + S5 results grid. */}

				{/* CTA */}
				<Reveal className='mt-16 flex justify-center md:mt-24' delay={0.05}>
					<MotionCTA variant='primary' size='lg' href={CTA.tryFree.href} warmSurface>
						{CTA.tryFree.text}
					</MotionCTA>
				</Reveal>
			</div>
		</section>
	)
}
