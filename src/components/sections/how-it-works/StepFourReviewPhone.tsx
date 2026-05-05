/** @fileoverview S3 Step 4 Review — phone-mockup variant.
 *
 * Static phone visual matching Figma node 166:605 (CC Visual Assets, fileKey
 * fLZECQP0aetUwhj9ZHLJ6S). Replaced the prior interactive industry/dimension
 * scorecard composite per Andy 2026-05-05 — visual asset is intentionally
 * single-state to keep S3 narrative simple.
 *
 * Layout (top → bottom inside the phone screen):
 *   - Dynamic island (100×22 black pill)
 *   - Score ring: 80×80 open arc (red, 82% sweep) with "3/5" centered + red
 *     "Needs work" sublabel. The 3/5 maps to Insurance/Objection-Handling
 *     grade C from SCORING_DATA (A=5, B=4, C=3, D=2, F=1).
 *   - Title block: "Objection Handling" h4 (28px, white) + 14px subtitle
 *     ("You acknowledged the concern, but didn't isolate the true objection.")
 *   - Said/Should chat pair:
 *       Right-aligned gray bubble (#1E2230) + red "What you said" badge
 *         body: SCORING_DATA.Insurance.Objection-Handling.said (canvas-locked)
 *       Left-aligned blue bubble (#09F) + green "What you should've said" badge
 *         + 20×20 CC logomark avatar
 *         body: SCORING_DATA.Insurance.Objection-Handling.shouldHaveSaid
 *   - "Why this works" frosted callout (white/10 border, 6px backdrop-blur)
 *   - "Practice Again" button (rounded-[27px] outline ghost w/ refresh icon)
 *   - Home indicator (4px white/20 pill)
 *
 * Background composition: outer phone shell uses dark cool gradient (#2A2D36
 * → #1A1D26) with #10B981/10 outer glow. Inner screen layers a red radial
 * (rgba(68,11,23) → rgba(12,14,19)) emanating from above the phone over an
 * emerald-tinted vertical gradient (#042013 → #080A09). Inset red shadow
 * grounds the bottom of the phone.
 *
 * Copy is canvas-locked from src/lib/constants.ts SCORING_DATA. No raw
 * screenshots; this is the abstracted product visual per R7 v3 D8.
 *
 * Phone allocation post-2026-05-05: S1 Hero, S3 Step 2 (StepThreeVisual.tsx),
 * S4 Step 4 (this file). Per R7 v3 D3 lock 2026-04-29 (Q17 Wave E). */

'use client'

import {
	XCircle,
	Check,
	Lightbulb,
	ArrowsCounterClockwise,
	AppleLogo,
	AndroidLogo,
	Globe,
} from '@phosphor-icons/react'
import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA, SCORING_DATA } from '@/lib/constants'

const CC_LOGOMARK = '/cc-logomark-32.png'

/* Letter→/5 score mapping. A=5, B=4, C=3, D=2, F=1; +/- modifiers held by
 * the base letter (B+, B-, B all → 4). Keeps the score ring honest against
 * the canvas-locked grade strings without forcing a data shape change. */
function letterToScore(grade: string): number {
	const letter = grade.trim().charAt(0).toUpperCase()
	if (letter === 'A') return 5
	if (letter === 'B') return 4
	if (letter === 'C') return 3
	if (letter === 'D') return 2
	return 1
}

/**
 * @description S3 Step 4 Review — phone-mockup variant matching Figma 166:605.
 * Renders the section header (kicker + headline) + the static phone asset +
 * the section subhead + the bottom CTA stack. Phone interior is static; copy
 * pulls from canvas-locked Insurance/Objection-Handling example.
 */
export default function StepFourReviewPhone() {
	const example = SCORING_DATA.examples.Insurance['Objection Handling']
	const score = letterToScore(example.grade)

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

			{/* Phone mockup — static visual matching Figma 166:605. */}
			<div className='mt-12 flex justify-center'>
				<PhoneMockup score={score} example={example} />
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

type Example = {
	title: string
	grade: string
	said: string
	shouldHaveSaid: string
	page: string
}

/* Phone shell — outer cool-metal gradient + inner red-radial × emerald-linear
 * background composition. Width 306px caps the asset per Figma; max-w-full
 * lets it tighten on <320 viewports without breaking. */
function PhoneMockup({ score, example }: { score: number; example: Example }) {
	return (
		<div
			className='w-[306px] max-w-full rounded-[48px] border border-white/10 p-[7px] shadow-[0_0_60px_rgba(16,185,129,0.1),0_20px_40px_rgba(0,0,0,0.4)]'
			style={{
				backgroundImage:
					'linear-gradient(180deg, #2a2d36 0%, #282b34 14.286%, #252831 28.571%, #23262f 42.857%, #21242d 57.143%, #1e212a 71.429%, #1c1f28 85.714%, #1a1d26 100%)',
			}}
		>
			<div
				className='relative flex flex-col overflow-hidden rounded-[42px] border border-white/[0.05]'
				style={{
					boxShadow: 'inset 0 0 40px rgba(68,11,23,0.4)',
				}}
			>
				{/* Layered phone screen background: red radial overlay above an
				 * emerald-linear base. Both layers render over the parent rounded
				 * container so they crop cleanly. */}
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0'
					style={{
						background:
							'radial-gradient(ellipse 380px 520px at 50% -40px, rgba(68,11,23,1) 0%, rgba(40,12,21,0.92) 45%, rgba(12,14,19,1) 100%), linear-gradient(180deg, rgb(4,32,19) 0%, rgb(8,10,9) 46.154%)',
					}}
				/>

				{/* Dynamic Island */}
				<div className='relative flex justify-center pt-[10px]'>
					<div className='h-[22px] w-[100px] rounded-full bg-black' />
				</div>

				{/* Main content column */}
				<div className='relative flex flex-1 flex-col items-center gap-10 px-4 pb-4 pt-6'>
					{/* Score block */}
					<div className='flex flex-col items-center gap-3'>
						<ScoreRing score={score} max={5} />
						<span className='font-[family-name:var(--font-heading)] text-[16px] font-semibold text-[#E11D48]'>
							Needs work
						</span>
					</div>

					{/* Title block */}
					<div className='flex w-full flex-col items-center gap-[15px] text-center'>
						<h4 className='font-[family-name:var(--font-heading)] text-[24px] font-semibold leading-tight text-white'>
							Objection Handling
						</h4>
						<p className='text-[13px] leading-[1.4] text-white/80'>
							You acknowledged the concern, but didn&rsquo;t isolate the true objection.
						</p>
					</div>

					{/* Said / Should chat pair */}
					<div className='flex w-full flex-col gap-6'>
						<SaidBubble body={example.said} />
						<ShouldBubble body={example.shouldHaveSaid} />
					</div>

					{/* Why this works callout */}
					<div className='self-start rounded-[12px] border border-white/10 bg-[rgba(30,34,48,0.6)] p-3 backdrop-blur-md drop-shadow-[0_4px_4px_rgba(17,17,17,0.2)]'>
						<div className='flex items-center gap-1.5'>
							<Lightbulb size={14} weight='fill' className='text-white' aria-hidden='true' />
							<span className='text-[13px] font-medium leading-none text-white'>
								Why this works
							</span>
						</div>
						<p className='mt-2 text-[12px] font-light leading-[1.4] text-white/90'>
							It helps you identify the real blocker before trying to solve it.
						</p>
					</div>

					{/* Practice Again button (display only — phone mockup, not interactive) */}
					<div
						role='img'
						aria-label='Practice Again button'
						className='flex h-[44px] w-full items-center justify-center gap-2 rounded-[27px] border border-white/20 px-6 text-[14px] font-medium text-white'
					>
						<ArrowsCounterClockwise size={14} weight='regular' aria-hidden='true' />
						<span>Practice Again</span>
					</div>
				</div>

				{/* Home indicator */}
				<div className='relative flex justify-center pb-2 pt-1'>
					<div className='h-1 w-[112px] rounded-full bg-white/20' />
				</div>
			</div>
		</div>
	)
}

/* Score ring — open arc (82% sweep) in red with the score/max numerator
 * centered. Matches Figma's 80×80 ellipse with stroke-linecap round. The
 * "open" gap rotates to the top so the ring reads as a measurement, not a
 * full circle. */
function ScoreRing({ score, max }: { score: number; max: number }) {
	const color = '#E11D48'
	const radius = 36
	const circumference = 2 * Math.PI * radius
	const arcFraction = 0.82
	const fill = (score / max) * arcFraction
	return (
		<div className='relative flex h-[80px] w-[80px] items-center justify-center'>
			<svg viewBox='0 0 80 80' className='absolute inset-0 h-full w-full' aria-hidden='true'>
				{/* Track */}
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
				{/* Filled portion */}
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
				className='relative font-[family-name:var(--font-heading)] text-[24px] font-semibold leading-none'
				style={{ color }}
				aria-label={`Score ${score} out of ${max}`}
			>
				{score}/{max}
			</span>
		</div>
	)
}

/* "What you said" bubble — right-aligned gray (#1E2230) message with the red
 * X-circle "What you said" badge floating top-left. Tail corner clipped at
 * bottom-right to read as user message. */
function SaidBubble({ body }: { body: string }) {
	return (
		<div className='flex w-full justify-end pl-8 pt-5'>
			<div className='relative max-w-[85%] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] border border-white/[0.06] bg-[#1E2230] p-3'>
				<p className='text-[14px] leading-[1.4] text-white'>{body}</p>
				<div
					className='absolute -left-2 -top-3 inline-flex items-center gap-1 rounded-full border border-white/[0.09] bg-[#1E2230] py-1 pl-1.5 pr-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]'
				>
					<XCircle
						size={13}
						weight='fill'
						style={{ color: '#FF6467' }}
						aria-hidden='true'
					/>
					<span className='text-[12px] font-medium leading-tight text-[#FF6467]'>
						What you said
					</span>
				</div>
			</div>
		</div>
	)
}

/* "What you should've said" bubble — left-aligned blue (#09F) message with
 * the green check "What you should've said" badge floating top-left, plus
 * a 20×20 CC logomark avatar to the left of the bubble. Tail corner clipped
 * at bottom-left to read as coach message. */
function ShouldBubble({ body }: { body: string }) {
	return (
		<div className='flex w-full items-end gap-2.5 pr-4 pt-5'>
			<div
				className='relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cc-accent/40 bg-cc-accent/15 ring-1 ring-cc-accent/20 ring-offset-0'
				aria-hidden='true'
			>
				<Image
					src={CC_LOGOMARK}
					alt=''
					width={16}
					height={16}
					className='h-4 w-4 object-contain'
				/>
			</div>
			<div className='relative flex-1 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] border border-white/[0.06] bg-[#09F] p-3'>
				<p className='text-[14px] leading-[1.4] text-white'>{body}</p>
				<div
					className='absolute -left-2 -top-3 inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-[#1E2230] py-1 pl-1.5 pr-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]'
				>
					<Check
						size={11}
						weight='bold'
						style={{ color: '#34E18E' }}
						aria-hidden='true'
					/>
					<span className='text-[12px] font-medium leading-tight text-[#34E18E]'>
						What you should&rsquo;ve said
					</span>
				</div>
			</div>
		</div>
	)
}
