/** @fileoverview Lab route — App Store review-card real-format variants
 * (Q17 Wave D2-3).
 *
 * Andy 2026-04-29 #20: current Wave Y review card design needs to look
 * EXACTLY like real iOS App Store review boxes per ref image #20:
 *   - Bold title at top-left
 *   - "1y ago" timestamp top-right
 *   - 4 colored stars row (left)
 *   - Username gray right-aligned
 *   - 2-paragraph body with truncation + "more" link in blue
 *
 * Variants:
 *   A. Light-on-dark — White/cream review cards rendered against CC's
 *      dark site. Most authentic to iOS App Store visual. Layered depth
 *      from light card on dark.
 *   B. Dark-mode-native — Dark-themed review cards matching CC's overall
 *      theme. Same typographic / spatial structure as App Store but in
 *      dark mode.
 *
 * Both variants render the SAME 3 review quotes for fair comparison. */

'use client'

import { useState, type ReactElement } from 'react'
import { Star } from '@phosphor-icons/react'

type Review = {
	title: string
	body: string
	username: string
	timeAgo: string
	rating: number
}

const REVIEWS: ReadonlyArray<Review> = [
	{
		title: 'Streamlined my process',
		body:
			'This app has helped me streamline my process. Really good with specific scenarios, and helping you with pace, tonality, and goals completed. The AI cloning makes practice feel real, and the scoring tells you exactly what you missed every single time. Highly recommend for any sales professional who wants to sharpen their game without bothering a manager.',
		username: 'TheRealCloser',
		timeAgo: '2w ago',
		rating: 5,
	},
	{
		title: 'Super impressed',
		body:
			'After coming back to this app after a couple of months I’m super impressed at the improvements that have been made. The roleplay is sharper, the feedback is faster, and the new scoring system makes it easy to see where you’re still leaving money on the table. Highly recommend!',
		username: 'salesguy_atl',
		timeAgo: '1mo ago',
		rating: 5,
	},
	{
		title: 'The next wave of sales training',
		body:
			'I can already tell it’s going to be the next wave of sales training and recruiting. The personalization on the AI clone is wild. It pushes back the way real prospects actually do. I can see myself using this to help drill my closers and figure out who’s actually ready to go on calls.',
		username: 'managermode',
		timeAgo: '3w ago',
		rating: 4,
	},
]

const STAR_COLOR = '#FF9500' // iOS orange star color

/* Truncated body with "more" link — line-clamp-3 with toggle. */
function TruncatedBody({
	body,
	textColor,
	linkColor,
}: {
	body: string
	textColor: string
	linkColor: string
}): ReactElement {
	const [expanded, setExpanded] = useState(false)
	return (
		<div>
			<p
				className={expanded ? '' : 'line-clamp-3'}
				style={{
					fontFamily: 'var(--font-sans)',
					fontSize: '13px',
					lineHeight: '18px',
					color: textColor,
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
						color: linkColor,
					}}
				>
					more
				</button>
			)}
		</div>
	)
}

/* ── VARIANT A: Light-on-dark cards ── */

function ReviewCardLightOnDark({ title, body, username, timeAgo, rating }: Review): ReactElement {
	return (
		<div
			className='flex flex-col gap-3 rounded-[14px] p-4 shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
			style={{
				backgroundColor: '#FAFAF8',
				border: '1px solid rgba(0,0,0,0.08)',
			}}
		>
			{/* Title row + timestamp */}
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
				<span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8E8E93' }}>{timeAgo}</span>
			</div>

			{/* Stars + username */}
			<div className='flex items-center justify-between'>
				<div role='img' aria-label={`${rating} out of 5 stars`} className='flex items-center gap-[1px]'>
					{Array.from({ length: 5 }, (_, i) => (
						<Star
							key={i}
							size={14}
							weight={i < rating ? 'fill' : 'regular'}
							style={{ color: i < rating ? STAR_COLOR : 'rgba(142,142,147,0.4)' }}
							aria-hidden='true'
						/>
					))}
				</div>
				<span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#8E8E93' }}>{username}</span>
			</div>

			{/* Body */}
			<TruncatedBody body={body} textColor='#1C1C1E' linkColor='#007AFF' />
		</div>
	)
}

/* ── VARIANT B: Dark-mode-native cards ── */

function ReviewCardDarkNative({ title, body, username, timeAgo, rating }: Review): ReactElement {
	return (
		<div
			className='flex flex-col gap-3 rounded-[14px] p-4'
			style={{
				backgroundColor: 'rgba(30,34,48,0.72)',
				border: '1px solid rgba(255,255,255,0.08)',
				boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
			}}
		>
			{/* Title row + timestamp */}
			<div className='flex items-start justify-between gap-3'>
				<h4
					className='leading-tight'
					style={{
						fontFamily: 'var(--font-sans)',
						fontWeight: 700,
						fontSize: '15px',
						color: '#F5F5F7',
						letterSpacing: '-0.1px',
					}}
				>
					{title}
				</h4>
				<span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{timeAgo}</span>
			</div>

			{/* Stars + username */}
			<div className='flex items-center justify-between'>
				<div role='img' aria-label={`${rating} out of 5 stars`} className='flex items-center gap-[1px]'>
					{Array.from({ length: 5 }, (_, i) => (
						<Star
							key={i}
							size={14}
							weight={i < rating ? 'fill' : 'regular'}
							style={{ color: i < rating ? STAR_COLOR : 'rgba(255,255,255,0.2)' }}
							aria-hidden='true'
						/>
					))}
				</div>
				<span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{username}</span>
			</div>

			{/* Body */}
			<TruncatedBody body={body} textColor='rgba(245,245,247,0.92)' linkColor='#0A84FF' />
		</div>
	)
}

/* ── Section wrappers ── */

function VariantSection({
	label,
	description,
	children,
}: {
	label: string
	description: string
	children: ReactElement
}): ReactElement {
	return (
		<section className='border-b border-white/10 bg-cc-foundation py-16'>
			<div className='mx-auto max-w-7xl px-6'>
				<p className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-cc-accent'>
					{label}
				</p>
				<p className='mt-2 text-sm text-cc-text-secondary'>{description}</p>
				<div className='mt-8'>{children}</div>
			</div>
		</section>
	)
}

export default function AppStoreReviewExplorationsPage(): ReactElement {
	return (
		<main className='bg-cc-foundation'>
			<div className='mx-auto max-w-7xl px-6 py-12'>
				<h1 className='font-[family-name:var(--font-heading)] text-4xl font-bold text-white'>
					App Store review-card variants
				</h1>
				<p className='mt-3 max-w-2xl text-cc-text-secondary'>
					Real iOS App Store review-box format (bold title, time-ago, stars row, username, truncated body + &ldquo;more&rdquo; link). 2 variants for
					Andy to pick. Per #20 Andy 2026-04-29.
				</p>
			</div>

			{/* Variant A: Light-on-dark */}
			<VariantSection
				label='Variant A · Light-on-dark cards'
				description='Cream/white review cards on the dark CC site. Most authentic to actual iOS App Store visual. Layered depth from light card on dark.'
			>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{REVIEWS.map((r, i) => (
						<ReviewCardLightOnDark key={i} {...r} />
					))}
				</div>
			</VariantSection>

			{/* Variant B: Dark-mode-native */}
			<VariantSection
				label='Variant B · Dark-mode-native cards'
				description='Dark-themed review cards matching the overall site theme. Same typographic/spatial structure as App Store but in dark mode.'
			>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{REVIEWS.map((r, i) => (
						<ReviewCardDarkNative key={i} {...r} />
					))}
				</div>
			</VariantSection>
		</main>
	)
}
