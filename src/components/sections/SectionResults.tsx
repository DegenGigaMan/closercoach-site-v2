'use client'

import { useRef, type ReactElement } from 'react'
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
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{children}
		</motion.div>
	)
}

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
				<div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-full md:h-32 md:w-32'>
					<Image
						src={portraitSrc}
						alt=''
						aria-hidden='true'
						fill
						sizes='(min-width: 768px) 128px, 80px'
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

type Review = {
	title: string
	quote: string
	reviewer: string
	date: string
}

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

const STAR_COLOR = '#FF9500' // iOS orange (Variant A lock)

function TruncatedBody({ body }: { body: string }): ReactElement {
	return (
		<div>
			<p
				className='line-clamp-3'
				style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: '18px', color: '#1C1C1E' }}
			>
				{body}
			</p>
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
				<div className='flex items-start justify-between gap-3'>
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
				<span
					className='shrink-0'
					style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8E8E93' }}
				>
					{date}
				</span>
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

export default function SectionResults(): ReactElement {
	return (
		<section id='results' data-surface='warm' className='relative overflow-hidden bg-cc-warm'>
				<div className='relative overflow-hidden py-24 md:py-32'>
				<FloatingProofComposition />
			</div>

			{/* ── Below-billboard content (top: warm pill + headline) ── */}
			<div className='mx-auto max-w-7xl px-6'>
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

				<div className='mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-4 px-6 md:mt-16 md:grid-cols-3'>
				{APP_STORE_REVIEWS.map((r, i) => (
					<Reveal key={i} delay={i * 0.06}>
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
							portraitSrc='/images/case-studies/dimitriy.webp'
							industryTag='Insurance Sales'
							quote={'Honestly a great app and a surprisingly well thought out and detail-oriented use of AI. I\u2019ve been using CloserCoach to sharpen my skills and get back into sales after being out of the game, it\u2019s the most valuable resource I have.'}
							name='Dimitriy'
							role='Insurance Sales'
							badge='Verified User'
						/>
					</Reveal>
					<Reveal delay={0.05}>
						<TierCard
							portraitSrc='/images/case-studies/chris.webp'
							industryTag='Home Services'
							metricHeadline={'1 hour per week.\n20 reps trained.'}
							quote={'Before CloserCoach, I was spending 1 hour per week per rep. Now, I spend 1 hour per week training 20 reps.'}
							name='Chris'
							role='Sales Manager, Lake Washington'
							badge='Sales Manager'
						/>
					</Reveal>
						<Reveal delay={0.1}>
						<TierCard
							portraitSrc='/images/case-studies/taylor.webp'
							industryTag='Financial Services'
							quote={'CloserCoach streamlined my discovery and made objection handling more fluid. Shifted my focus from selling a product to securing a client’s future.'}
							name='Taylor'
							role='Financial Security Advisor, Experior Financial Group'
							badge='Verified User'
						/>
					</Reveal>
				</div>

				{/* CTA */}
				<Reveal className='mt-16 flex justify-center md:mt-24' delay={0.05}>
					<MotionCTA variant='primary' size='lg' href={CTA.tryFree.href} warmSurface className='w-full sm:w-auto'>
						{CTA.tryFree.text}
					</MotionCTA>
				</Reveal>
			</div>
		</section>
	)
}
