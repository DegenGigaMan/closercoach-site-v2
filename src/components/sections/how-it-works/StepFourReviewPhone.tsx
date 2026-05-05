/** @fileoverview S3 Step 4 Review — phone-mockup variant.
 *
 * Static phone visual matching Figma node 166:605 (CC Visual Assets, fileKey
 * fLZECQP0aetUwhj9ZHLJ6S). 1:1 with Figma — sizes, fonts, colors, paddings,
 * radii, shadows, copy.
 *
 * Phone-internal typography is INTER (Figma uses Inter SemiBold/Medium for
 * in-app UI). Lora Bold is the LP heading family but never appears inside
 * the phone — Andy 2026-05-05 directive: "make it match the Figma."
 *
 * Copy is hardcoded from the Figma example (NOT pulled from SCORING_DATA).
 * The Figma asset was authored as a single-state marketing visual; tying
 * its body copy to the SCORING_DATA matrix made the bubbles wrap in ways
 * that broke the Figma layout. Per Andy: this is the asset, render it.
 *
 * Layout (top → bottom inside the phone screen):
 *   - Dynamic island (100×22 black pill)
 *   - Score ring 80×80 (red 82% sweep) + "3/5" + "Needs work" sublabel
 *   - "Objection Handling" 28px Inter SemiBold + 14px Inter subtitle
 *   - Said/Should chat pair (no "Why this works" callout — removed per
 *     Andy's reference image 2026-05-05)
 *   - "Practice Again" h-12 ghost button
 *   - Home indicator (4×112 white/20 pill)
 *
 * Background composition (matches Figma node 166:606 stack):
 *   1. Outer phone shell: linear gradient #2A2D36 → #1A1D26 (cool metal),
 *      rounded-[48px], white/10 border, p-[7px], emerald/10 outer glow.
 *   2. Inner screen overlay: red radial (rgba(68,11,23) 0% → rgba(40,12,21)
 *      50% → rgba(12,14,19) 100%) over an emerald linear gradient (rgb(4,32,
 *      19) 0% → rgb(8,10,9) 46%). Inset red shadow grounds the bottom.
 *
 * Render scale: phone HTML renders at 306×~700 native (matching Figma
 * canvas 1:1). On lg+ viewports it scales 1.5x via CSS transform with an
 * outer height-reservation wrapper so layout flow stays correct. Mobile
 * shows the native 1x render to fit small viewports.
 *
 * Phone allocation post-2026-05-05: S1 Hero, S3 Step 2 (StepThreeVisual),
 * S4 Step 4 (this file). Per R7 v3 D3 lock 2026-04-29 (Q17 Wave E). */

'use client'

import {
	XCircle,
	Lightning,
	ArrowsCounterClockwise,
	AppleLogo,
	AndroidLogo,
	Globe,
} from '@phosphor-icons/react'
import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA } from '@/lib/constants'

const COACH_AVATAR = '/images/cc-step4-avatar.png'

/* Hardcoded Figma example copy (node 166:605). Matches Andy's reference
 * 2026-05-05. Title + dimension match the dimension being scored. */
const PHONE_COPY = {
	score: 3,
	max: 5,
	tone: 'red' as const,
	verdict: 'Needs work',
	title: 'Objection Handling',
	subtitle: 'You acknowledged the concern, but didn’t isolate the true objection.',
	said: 'Does the policy seem like it could work for you?',
	shouldHaveSaid:
		'What specifically feels concerning to you? Is it the coverage, the price, or something else?',
}

/**
 * @description S3 Step 4 Review — phone-mockup variant matching Figma 166:605.
 * Renders the section header (kicker + headline) + the static phone asset +
 * the section subhead + the bottom CTA stack. Phone interior is static.
 */
export default function StepFourReviewPhone() {
	return (
		<div className='mx-auto max-w-7xl px-6 pb-32 md:px-12 lg:px-16 lg:pb-40'>
			{/* Intro: kicker + headline */}
			<div className='mx-auto max-w-3xl text-center'>
				<div className='inline-flex items-center gap-2 rounded-full border border-cc-accent/25 bg-cc-accent/5 px-3 py-1'>
					<span className='h-1.5 w-1.5 rounded-full bg-cc-accent' aria-hidden='true' />
					<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent'>
						04 &middot; Win
					</span>
				</div>
				<h3 className='mt-6 text-3xl leading-[1.15] text-white md:mt-10 md:text-4xl lg:text-[2.75rem]'>
					See <em className='text-cc-accent'>Exactly</em>{' '}What&rsquo;s Losing You Deals
				</h3>
			</div>

			{/* Phone mockup. Renders at native 340×~723 across all viewports
			 * so it fits within typical 900-1080px desktop viewport heights
			 * (Andy 2026-05-05: prior 1.5× scale at 510×1140 was taller than
			 * the viewport on most desktop displays). Aspect ratio preserved
			 * — sizing is uniformly native, not desktop-scaled. */}
			<div className='mt-12 flex justify-center'>
				<PhoneMockup />
			</div>

			{/* Subhead beneath the visual. */}
			<p className='mx-auto mt-12 max-w-3xl px-4 text-center text-base leading-relaxed text-cc-text-secondary md:text-lg'>
				Every call gets scored A through F, with industry-tailored scorecards and word-for-word talk-tracks showing you exactly what you should have said.
			</p>

			{/* Bottom CTA. */}
			<div className='mt-8 flex flex-col items-center gap-4'>
				<MotionCTA variant='primary' size='lg' href={CTA.tryFree.href}>
					{CTA.tryFree.text}
				</MotionCTA>
				<div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center font-sans text-sm text-cc-text-muted'>
					<span className='inline-flex items-center gap-1.5'>
						<AppleLogo size={14} weight='fill' aria-hidden='true' />
						<span>iOS</span>
					</span>
					<span className='text-cc-text-muted/40' aria-hidden='true'>·</span>
					<span className='inline-flex items-center gap-1.5'>
						<AndroidLogo size={14} weight='fill' aria-hidden='true' />
						<span>Android</span>
					</span>
					<span className='text-cc-text-muted/40' aria-hidden='true'>·</span>
					<span className='inline-flex items-center gap-1.5'>
						<Globe size={14} weight='regular' aria-hidden='true' />
						<span>Web</span>
					</span>
				</div>
			</div>
		</div>
	)
}

/* Phone shell — outer cool-metal gradient + inner red-radial × emerald-linear
 * background composition. Width 306px matches Figma node 166:605. */
function PhoneMockup() {
	return (
		<div
			className='w-[340px] rounded-[48px] border border-white/10 p-[7px] shadow-[0_0_60px_rgba(16,185,129,0.1),0_20px_40px_rgba(0,0,0,0.4)]'
			style={{
				backgroundImage:
					'linear-gradient(180deg, #2a2d36 0%, #282b34 14.286%, #252831 28.571%, #23262f 42.857%, #21242d 57.143%, #1e212a 71.429%, #1c1f28 85.714%, #1a1d26 100%)',
			}}
		>
			<div
				className='relative flex flex-col overflow-hidden rounded-[42.4px] border border-white/[0.05]'
				style={{ boxShadow: 'inset 0 0 40px rgba(68,11,23,0.4)' }}
			>
				{/* Layered phone screen background. */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0'
					style={{
						background:
							'radial-gradient(ellipse 380px 520px at 50% -40px, rgba(68,11,23,1) 0%, rgba(40,12,21,0.92) 45%, rgba(12,14,19,1) 100%), linear-gradient(180deg, rgb(4,32,19) 0%, rgb(8,10,9) 46.154%)',
					}}
				/>

				{/* Dynamic Island */}
				<div className='relative flex h-8 items-start justify-center pt-[10px]'>
					<div className='h-[22px] w-[100px] rounded-full bg-black' />
				</div>

				{/* Main column — Figma main: pt-24 px-16 pb-16 gap-16. */}
				<div className='relative flex flex-1 flex-col items-center gap-4 px-4 pb-4 pt-6'>
					<div className='flex w-full flex-col items-center gap-10 overflow-hidden'>
						{/* Score block */}
						<div className='flex flex-col items-center gap-3'>
							<ScoreRing score={PHONE_COPY.score} max={PHONE_COPY.max} />
							<span className='font-sans text-[16px] font-semibold leading-normal text-[#E11D48]'>
								{PHONE_COPY.verdict}
							</span>
						</div>

						{/* Title block */}
						<div className='flex w-full flex-col items-center gap-[15px] text-center'>
							<h4 className='whitespace-nowrap font-sans text-[28px] font-semibold leading-normal tracking-tight text-white'>
								{PHONE_COPY.title}
							</h4>
							<p className='font-sans text-[14px] font-normal leading-[1.4] text-white/80'>
								{PHONE_COPY.subtitle}
							</p>
						</div>

						{/* Said / Should chat pair */}
						<div className='flex w-full flex-col gap-6'>
							<SaidBubble body={PHONE_COPY.said} />
							<ShouldBubble body={PHONE_COPY.shouldHaveSaid} />
						</div>
					</div>

					{/* Practice Again button. Display only — phone mockup, not
					 * an interactive surface. */}
					<div
						role='img'
						aria-label='Practice Again button'
						className='flex h-12 w-full items-center justify-center gap-2.5 rounded-[27px] border border-white/20 pl-6 pr-[30px] font-sans text-[16px] font-medium text-white'
					>
						<ArrowsCounterClockwise size={16} weight='regular' aria-hidden='true' />
						<span>Practice Again</span>
					</div>
				</div>

				{/* Home indicator */}
				<div className='relative flex h-4 items-start justify-center pt-1'>
					<div className='h-1 w-[112px] rounded-full bg-white/20' />
				</div>
			</div>
		</div>
	)
}

/* Score ring — 80×80, red 82% open arc, "3/5" centered. Inter SemiBold 24px
 * (Figma calls Plus Jakarta Sans SemiBold; Inter is the loaded fallback). */
function ScoreRing({ score, max }: { score: number; max: number }) {
	const color = '#E11D48'
	const radius = 36
	const circumference = 2 * Math.PI * radius
	const arcFraction = 0.82
	const fill = (score / max) * arcFraction
	return (
		<div className='relative flex h-[80px] w-[80px] items-center justify-center'>
			<svg viewBox='0 0 80 80' className='absolute inset-0 h-full w-full' aria-hidden='true'>
				<circle
					cx={40}
					cy={40}
					r={radius}
					fill='none'
					stroke={color}
					strokeOpacity={0.18}
					strokeWidth={4}
					strokeLinecap='round'
					strokeDasharray={`${circumference * arcFraction} ${circumference}`}
					transform='rotate(-90 40 40)'
				/>
				<circle
					cx={40}
					cy={40}
					r={radius}
					fill='none'
					stroke={color}
					strokeWidth={4}
					strokeLinecap='round'
					strokeDasharray={`${circumference * fill} ${circumference}`}
					transform='rotate(-90 40 40)'
				/>
			</svg>
			<span
				className='relative font-sans text-[24px] font-semibold leading-normal'
				style={{ color }}
				aria-label={`Score ${score} out of ${max}`}
			>
				{score}/{max}
			</span>
		</div>
	)
}

/* "What you said" bubble — right-aligned gray (#1E2230). Bubble text 16px
 * Inter Regular white. Badge: 16px Inter Medium #FF6467 with X-circle. */
function SaidBubble({ body }: { body: string }) {
	return (
		<div className='flex w-full justify-end pl-8 pt-5'>
			<div className='relative rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] border border-white/[0.06] bg-[#1E2230] p-3'>
				<p className='font-sans text-[16px] font-normal leading-[1.4] text-white'>{body}</p>
				<div className='absolute -left-2 -top-[23px] inline-flex items-center gap-1 rounded-full border border-white/[0.09] bg-[#1E2230] py-1.5 pl-1.5 pr-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]'>
					<XCircle
						size={14}
						weight='fill'
						style={{ color: '#FF6467' }}
						aria-hidden='true'
					/>
					<span className='whitespace-nowrap font-sans text-[16px] font-medium leading-[1.2] text-[#FF6467]'>
						What you said
					</span>
				</div>
			</div>
		</div>
	)
}

/* "What you should've said" bubble — left-padded blue (#09F) with avatar on
 * the bottom-left. Bubble text 18px Inter Regular white. Badge: 16px Inter
 * Medium #34E18E with green lightning bolt (matches Figma SSRBase glyph).
 * Avatar: 20px circle with white/5 border holding the coach photo. */
function ShouldBubble({ body }: { body: string }) {
	return (
		<div className='flex w-full items-end gap-2.5 pr-4 pt-5'>
			<div
				className='relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-white/[0.05]'
				aria-hidden='true'
			>
				<Image
					src={COACH_AVATAR}
					alt=''
					fill
					sizes='20px'
					className='object-cover'
				/>
			</div>
			<div className='relative flex-1 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] border border-white/[0.06] bg-[#09F] p-3'>
				<p className='font-sans text-[18px] font-normal leading-[1.4] text-white'>{body}</p>
				<div className='absolute -left-2 -top-[21px] inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-[#1E2230] py-1.5 pl-1.5 pr-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]'>
					<Lightning
						size={12}
						weight='fill'
						style={{ color: '#34E18E' }}
						aria-hidden='true'
					/>
					<span className='whitespace-nowrap font-sans text-[16px] font-medium leading-[15px] text-[#34E18E]'>
						What you should&rsquo;ve said
					</span>
				</div>
			</div>
		</div>
	)
}
