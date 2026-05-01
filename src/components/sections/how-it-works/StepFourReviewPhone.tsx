/** @fileoverview S3 Step 4 Review — phone-mockup variant (Q17 Wave D2-1).
 *
 * Andy 2026-04-29 #16+#17: dense scorecard composite (StepFourReview.tsx) was
 * "too dense for the simplicity of preceding step visuals." Reference: Pingo
 * AI score panel inside an iPhone frame (image F0B0ET4GA86.png).
 *
 * This variant preserves all four interactivity vectors from the legacy:
 *   - Industry switching (Insurance / Automotive / Financial / SaaS)
 *   - Dimension switching (Discovery / Pitch / Objection / Closing / Tonality)
 *   - "What you said" panel (red, current state)
 *   - "What you should have said" panel (green, fix)
 *
 * Density reductions vs legacy:
 *   - Industry tabs sit ABOVE the phone (outside the frame), keeping the
 *     phone screen focused on the scorecard for a single industry.
 *   - Inside the phone: top header (Sarah Chen + grade ring), then dimension
 *     pills as a horizontal scroll-snap row (replaces the 250px sidebar),
 *     then the SAID / SHOULD-HAVE-SAID panels stacked.
 *   - Grade ring centered prominently (Pingo-style large numeric anchor).
 *   - Dimension grade badges still present per row but smaller / monochrome.
 *
 * R7 v3 phone-motif lock notes: spec restricts phone motif to S1 Hero + S3
 * Step 2. Adding a phone here introduces a 3rd phone occurrence on the LP.
 * Andy explicitly directed this in #16+#17 — flagged for confirmation in
 * the dispatch return.
 *
 * The legacy non-phone variant remains intact at StepFourReview.tsx and is
 * exposed at /lab/legacy-step-detail for reference. The homepage swaps to
 * this phone variant. */

'use client'

import { useMemo, useState } from 'react'
import {
	MagnifyingGlass,
	Megaphone,
	ShieldCheck,
	PhoneCall,
	SpeakerHigh,
	XCircle,
	PencilSimple,
	AppleLogo,
	AndroidLogo,
	Globe,
	type IconProps,
} from '@phosphor-icons/react'
import type { ComponentType } from 'react'
import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import { CTA, SCORING_DATA } from '@/lib/constants'

const CC_LOGO = '/images/closercoach-logo.svg'

type Example = {
	title: string
	grade: string
	said: string
	shouldHaveSaid: string
	page: string
}

type ExamplesMap = Record<string, Record<string, Example>>

const DIMENSION_ICONS: Record<string, ComponentType<IconProps>> = {
	Discovery: MagnifyingGlass,
	Pitch: Megaphone,
	'Objection Handling': ShieldCheck,
	Closing: PhoneCall,
	Tonality: SpeakerHigh,
}

type GradeTone = 'green' | 'amber' | 'red'

function gradeTone(grade: string): GradeTone {
	const letter = grade.trim().charAt(0).toUpperCase()
	if (letter === 'A' || letter === 'B') return 'green'
	if (letter === 'C') return 'amber'
	return 'red'
}

const GRADE_TONE_STYLES: Record<GradeTone, { bg: string; border: string; text: string }> = {
	green: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10B981' },
	amber: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B' },
	red: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#EF4444' },
}

/* Phone frame — borrows the structure from StepThreeVisual's PhoneFrame but
 * sized for a wider portrait scorecard (280px wide vs 240px) and given a
 * fixed iPhone-proper aspect ratio (Q17 Wave E fix per Andy 2026-04-29).
 *
 * The wider frame gives the SAID / SHOULD-HAVE-SAID panels enough horizontal
 * room to read at 13px without wrapping awkwardly. The inner screen area
 * uses aspect-ratio 9/19 (close to iPhone 14/15 Pro 9:19.5) so the phone
 * always renders at proper proportions — never short-and-squat. Content
 * distributes inside the screen with justify-between + flex-1 spacers
 * giving each panel proper breathing room.
 *
 * Width 280 × (19/9) = ~591px content height + ~36px dynamic island/home
 * indicator chrome = ~627px total phone height, mirroring the visual cadence
 * of the S1 Hero phone (240px / 16.8 ratio = ~448px). */
function PhoneFrame({ children, mode }: { children: React.ReactNode; mode: string }) {
	return (
		<div className='relative z-10 w-[280px]'>
			<div className='rounded-[2.75rem] border border-white/10 bg-gradient-to-b from-[#2a2d36] to-[#1a1d26] p-[5px] shadow-[0_0_50px_rgba(16,185,129,0.12),0_16px_40px_rgba(0,0,0,0.5)]'>
				<div className='overflow-hidden rounded-[2.45rem] border border-white/5 bg-cc-foundation'>
					{/* Dynamic Island */}
					<div className='flex justify-center pt-2'>
						<div className='h-[18px] w-[80px] rounded-full bg-black' />
					</div>
					{/* App header */}
					<div className='flex items-center justify-between px-4 py-2'>
						<Image src={CC_LOGO} alt='CloserCoach' width={72} height={16} className='h-5 w-auto' />
						<div className='flex items-center gap-1'>
							<div className='h-1.5 w-1.5 rounded-full bg-cc-accent' />
							<span className='font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.15em] text-cc-text-muted'>
								{mode}
							</span>
						</div>
					</div>
					{/* Screen content area: fixed aspect ratio so the phone is
					 * always proper-iPhone-proportioned. Content laid out
					 * vertically with breathing room. */}
					<div className='relative' style={{ aspectRatio: '9 / 19.5' }}>
						{children}
					</div>
					{/* Home indicator */}
					<div className='flex justify-center pb-1.5 pt-1'>
						<div className='h-[3px] w-20 rounded-full bg-white/20' />
					</div>
				</div>
			</div>
		</div>
	)
}

/* Big centered grade ring — Pingo-style numeric anchor. */
function GradeRingLarge({ grade, tone }: { grade: string; tone: GradeTone }) {
	const color = GRADE_TONE_STYLES[tone].text
	const radius = 36
	const circumference = 2 * Math.PI * radius
	const arcFraction = 0.82
	return (
		<div className='relative flex h-[80px] w-[80px] shrink-0 items-center justify-center'>
			<svg viewBox='0 0 80 80' className='absolute inset-0 h-full w-full' aria-hidden='true'>
				<circle cx={40} cy={40} r={radius} fill='none' stroke={color} strokeOpacity={0.18} strokeWidth={4} strokeLinecap='round' />
				<circle
					cx={40}
					cy={40}
					r={radius}
					fill='none'
					stroke={color}
					strokeWidth={4}
					strokeLinecap='round'
					strokeDasharray={`${circumference * arcFraction} ${circumference}`}
					transform='rotate(-90 40 40)'
				/>
			</svg>
			<span className='relative font-[family-name:var(--font-heading)] text-[28px] font-semibold leading-none' style={{ color }}>
				{grade}
			</span>
		</div>
	)
}

/* SAID/SHOULD section — compressed for phone width. */
function SaidSection({ variant, label, body }: { variant: 'said' | 'should'; label: string; body: string }) {
	const isSaid = variant === 'said'
	const Icon = isSaid ? XCircle : PencilSimple
	const iconColor = isSaid ? '#FF6467' : '#10B981'
	const panelBg = isSaid ? 'rgba(255,90,90,0.08)' : 'rgba(16,185,129,0.08)'
	const panelBorder = isSaid ? 'rgba(255,90,90,0.22)' : 'rgba(16,185,129,0.22)'
	const kickerColor = isSaid ? '#FF6467' : '#10B981'
	const bodyColor = isSaid ? '#94A3B8' : 'rgba(255,255,255,0.92)'

	return (
		<div className='flex w-full flex-col gap-1.5'>
			<div className='flex items-center gap-1.5'>
				<Icon size={11} weight={isSaid ? 'fill' : 'regular'} style={{ color: iconColor }} aria-hidden='true' />
				<span
					className='font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase leading-none'
					style={{ color: kickerColor, letterSpacing: '0.8px' }}
				>
					{label}
				</span>
			</div>
			<div className='w-full rounded-[10px] border p-2.5' style={{ backgroundColor: panelBg, borderColor: panelBorder }}>
				<p className='text-[11px] leading-[16px]' style={{ color: bodyColor }}>
					&ldquo;{body}&rdquo;
				</p>
			</div>
		</div>
	)
}

/**
 * @description S3 Step 4 Review — phone-mockup variant. Industry tabs above
 * the phone (outside frame); inside the phone: title row + grade ring,
 * horizontal dimension pill row, then SAID / SHOULD-HAVE-SAID panels.
 */
export default function StepFourReviewPhone() {
	const industries = SCORING_DATA.industries as readonly string[]
	const dimensions = SCORING_DATA.dimensions as readonly string[]
	const examples = SCORING_DATA.examples as ExamplesMap

	const [industry, setIndustry] = useState<string>(industries[0])
	const [dimension, setDimension] = useState<string>(dimensions[0])

	const active = useMemo<Example>(
		() => examples[industry]?.[dimension] ?? examples.Insurance.Discovery,
		[examples, industry, dimension],
	)
	const activeGrade = gradeTone(active.grade)

	return (
		<div className='mx-auto max-w-7xl px-6 pb-32 md:px-12 lg:px-16 lg:pb-40'>
			{/* Intro: kicker + headline + body */}
			<div className='mx-auto max-w-3xl text-center'>
				<div className='inline-flex items-center gap-2 rounded-full border border-cc-accent/25 bg-cc-accent/5 px-3 py-1'>
					<span className='h-1.5 w-1.5 rounded-full bg-cc-accent' aria-hidden='true' />
					<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent'>
						04 &middot; Win
					</span>
				</div>
				{/* Q17 Wave D1-1 spacing carries forward to this variant. */}
				<h3 className='mt-6 text-3xl leading-[1.15] text-white md:mt-10 md:text-4xl lg:text-[2.75rem]'>
					See <em className='text-cc-accent'>Exactly</em> What&rsquo;s Losing You Deals
				</h3>
			</div>

			{/* Phone variant: industry tabs above + phone frame containing scorecard. */}
			<div className='mx-auto mt-12 flex w-full max-w-[420px] flex-col items-center gap-6'>
				{/* Industry pill row — outside the phone frame so the phone screen
				 * stays focused on a single industry's scorecard. */}
				<div role='tablist' aria-label='Industry' className='flex flex-wrap items-start justify-center gap-3'>
					{industries.map((ind) => {
						const isActive = ind === industry
						return (
							<button
								key={ind}
								role='tab'
								type='button'
								aria-selected={isActive}
								tabIndex={isActive ? 0 : -1}
								onClick={() => setIndustry(ind)}
								className={`rounded-[10px] border border-white/[0.08] px-3 py-1.5 text-[11px] font-medium leading-[14px] text-white transition-opacity ${
									isActive ? 'bg-cc-surface-card shadow-[0px_4px_12px_rgba(0,0,0,0.35)]' : 'opacity-50 hover:opacity-75'
								}`}
							>
								{ind}
							</button>
						)
					})}
				</div>

				{/* Phone frame */}
				<PhoneFrame mode='Score Review'>
					<div className='absolute inset-0 flex flex-col gap-4 px-3 pb-3 pt-2'>
						{/* Title row + grade ring */}
						<div className='flex items-center justify-between gap-2 px-1'>
							<div className='flex flex-col gap-1'>
								<span
									className='font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase leading-none tracking-[0.1em]'
									style={{ color: GRADE_TONE_STYLES[activeGrade].text }}
								>
									{dimension}
								</span>
								<h4
									className='font-[family-name:var(--font-heading)] text-[14px] font-semibold leading-tight'
									style={{ color: '#EFEFEF' }}
								>
									{active.title}
								</h4>
							</div>
							<GradeRingLarge grade={active.grade} tone={activeGrade} />
						</div>

						{/* Dimension pills — horizontal scroll-snap row */}
						<div
							role='tablist'
							aria-label='Scoring dimensions'
							className='-mx-1 flex shrink-0 items-stretch gap-1.5 overflow-x-auto px-1 pb-0.5'
						>
							{dimensions.map((d) => {
								const isActive = d === dimension
								const Icon = DIMENSION_ICONS[d] ?? MagnifyingGlass
								const example = examples[industry]?.[d]
								const grade = example?.grade ?? '--'
								const tone = gradeTone(grade)
								const styles = GRADE_TONE_STYLES[tone]
								return (
									<button
										key={d}
										role='tab'
										type='button'
										aria-selected={isActive}
										tabIndex={isActive ? 0 : -1}
										onClick={() => setDimension(d)}
										className={`flex shrink-0 items-center gap-1.5 rounded-[8px] border px-2 py-1.5 transition-opacity ${
											isActive
												? 'border-white/[0.1] bg-cc-accent/15'
												: 'border-transparent opacity-60 hover:opacity-90'
										}`}
									>
										<Icon size={11} weight='regular' className='text-white/90' aria-hidden='true' />
										<span className='whitespace-nowrap text-[10px] font-medium leading-[12px] text-white/90'>{d}</span>
										<span
											className='flex h-[14px] min-w-[20px] items-center justify-center rounded-[3px] border px-1'
											style={{ backgroundColor: styles.bg, borderColor: styles.border }}
											aria-label={`Grade ${grade}`}
										>
											<span
												className='font-[family-name:var(--font-mono)] text-[8px] font-semibold leading-none'
												style={{ color: styles.text }}
											>
												{grade}
											</span>
										</span>
									</button>
								)
							})}
						</div>

						{/* SAID / SHOULD-HAVE-SAID panels — flex-1 fills remaining
						 * vertical room inside the aspect-locked screen so the
						 * content distributes nicely across the phone height. */}
						<div className='flex flex-1 flex-col justify-around gap-3 pt-1'>
							<SaidSection variant='said' label='What you said' body={active.said} />
							<SaidSection variant='should' label='What you should have said' body={active.shouldHaveSaid} />
						</div>
					</div>
				</PhoneFrame>
			</div>

			{/* Subhead beneath the visual */}
			<p className='mx-auto mt-12 max-w-3xl text-center text-base leading-relaxed text-cc-text-secondary md:text-lg'>
				Every call gets scored A through F, with industry-tailored scorecards and word-for-word talk-tracks showing you exactly what you should have said.
			</p>

			{/* Bottom CTA */}
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
