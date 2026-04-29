/** @fileoverview S3 Step 4 Review — scorecard composite.
 *
 * Visual spec: Figma node 61:3023. Two-tier layout:
 *   1. Top industry nav (pill row, 4 tabs): active uses dark bg #1E2230 with
 *      border white/6; inactive tabs are opacity-50 outline pills. Gap-[16px].
 *   2. Scorecard container (rounded-[24px], border white/8, bg rgba(30,34,48,
 *      0.8), shadow + inset shadow). pl-[16px] pr-[32px] py-[16px], gap-[32px].
 *      - Left sidebar (250px, border-r white/6): 5 dimension rows with icon +
 *        label + colour-coded grade badge (32×21, rounded-[4px]). Active row
 *        uses bg rgba(16,185,129,0.2) with border white/6; inactive rows are
 *        opacity-50 (no bg).
 *      - Right content (flex-1): title + 64×64 grade ring on the right,
 *        "What you said" (red) and "What you should have said" (green)
 *        sections — each with an icon tile + connecting hairline on the left,
 *        mono-uppercase kicker, and a tinted panel with the quote. Footer
 *        "Finding N/20" pill with prev/next carets.
 *
 * Copy: section intro is canvas-locked Step 4 body from lp-copy-deck-v5.md.
 * SCORING_DATA (src/lib/constants.ts) supplies industry/dimension/example
 * content. */

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
import MotionCTA from '@/components/shared/motion-cta'
import { CTA, SCORING_DATA } from '@/lib/constants'

type Example = {
	title: string
	grade: string
	said: string
	shouldHaveSaid: string
	page: string
}

type ExamplesMap = Record<string, Record<string, Example>>

/* Dimension icon mapping per Figma 61:3023's sidebar. Each dimension row uses
 * a Phosphor icon at 14px inside a left-aligned row. Tonality uses SpeakerHigh
 * as the closest equivalent to Figma's custom waveform glyph. */
const DIMENSION_ICONS: Record<string, ComponentType<IconProps>> = {
	Discovery: MagnifyingGlass,
	Pitch: Megaphone,
	'Objection Handling': ShieldCheck,
	Closing: PhoneCall,
	Tonality: SpeakerHigh,
}

/* Grade colour bands match Figma's three grade-badge tones:
 *   - green #10B981 for A/B grades (good)
 *   - amber #F59E0B for C grades (neutral)
 *   - red   #EF4444 for D/F grades (bad) */
type GradeTone = 'green' | 'amber' | 'red'

function gradeTone(grade: string): GradeTone {
	const letter = grade.trim().charAt(0).toUpperCase()
	if (letter === 'A' || letter === 'B') return 'green'
	if (letter === 'C') return 'amber'
	return 'red'
}

const GRADE_TONE_STYLES: Record<GradeTone, { bg: string; border: string; text: string }> = {
	green: {
		bg: 'rgba(16,185,129,0.15)',
		border: 'rgba(16,185,129,0.3)',
		text: '#10B981',
	},
	amber: {
		bg: 'rgba(245,158,11,0.15)',
		border: 'rgba(245,158,11,0.3)',
		text: '#F59E0B',
	},
	red: {
		bg: 'rgba(239,68,68,0.15)',
		border: 'rgba(239,68,68,0.3)',
		text: '#EF4444',
	},
}

/* Wave Y.6 (Alim 2026-04-28): findingIndex helper REMOVED with the Finding
 * N/total pill. The function is no longer referenced anywhere; the sidebar
 * dimension list + industry tabs are the canonical navigation surface. */

/**
 * @description Renders the S3 Step 4 Review section: kicker + headline + body
 * + Figma-spec scorecard composite + bottom CTA. Industry and dimension state
 * managed locally. The composite's prev/next buttons step through the 4×5
 * example matrix in row-major order (dimensions rotate first, then industries).
 */
export default function StepFourReview() {
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
	/* Wave Y.6 (Alim 2026-04-28): total/finding/stepPrev/stepNext removed
	 * with the Finding N/total pill. Industry tabs + sidebar dimension list
	 * are the only navigation surface now. */

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
				<h3 className='mt-6 text-3xl leading-[1.15] text-white md:text-4xl lg:text-[2.75rem]'>
					See <em className='text-cc-accent'>Exactly</em> What&rsquo;s Losing You Deals
				</h3>
			</div>

			{/* Scorecard composite — Figma 61:3023. Top industry pill row, then
			 * the framed scorecard (sidebar + content).
			 *
			 * Wave Z.3 P2-B (2026-04-28): widened from max-w-[800px] to
			 * max-w-[1100px] so the composite no longer floats narrow against
			 * the surrounding max-w-7xl Step rooms at 1440. DD R1 C2 / S+
			 * Audit P2-B. */}
			<div className='mx-auto mt-12 flex w-full max-w-[1100px] flex-col items-center gap-8'>
				{/* Industry pill row */}
				<div
					role='tablist'
					aria-label='Industry'
					className='flex flex-wrap items-start justify-center gap-4'
				>
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
								className={`rounded-[12px] border border-white/[0.06] px-[13px] py-[7px] text-[12px] font-medium leading-[16px] text-white transition-opacity ${
									isActive
										? 'bg-cc-surface-card shadow-[0px_8px_16px_rgba(0,0,0,0.4)]'
										: 'opacity-50 hover:opacity-75'
								}`}
							>
								{ind}
							</button>
						)
					})}
				</div>

				{/* Framed scorecard: sidebar + main content.
				 * Wave R FIX-06 (2026-04-27): at <md viewport (where sidebar +
				 * content side-by-side overflows the 390 frame and renders as a
				 * ~28px peek of the next column), the layout stacks vertically
				 * with the dimensions list collapsing to a horizontal scroll-snap
				 * pill row above the card content. md+ keeps the side-by-side
				 * Figma layout. */}
				<div
					className='relative flex w-full flex-col items-start gap-4 overflow-hidden rounded-[24px] border border-white/[0.08] p-4 md:flex-row md:gap-8 md:pl-4 md:pr-8 md:py-4'
					style={{
						boxShadow:
							'0px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05), inset 0px 0px 16px 0px rgba(10,18,51,0.4)',
					}}
				>
					{/* Layered background: 80% surface-card overlay per Figma
					 * node 39:731 background stack. */}
					<div
						aria-hidden='true'
						className='pointer-events-none absolute inset-0 rounded-[24px]'
						style={{ backgroundColor: 'rgba(30,34,48,0.8)' }}
					/>

					{/* Left sidebar: dimensions.
					 * <md: full-width horizontal pill row, scroll-snap on x.
					 * md+: 250px vertical column with right hairline. */}
					<nav
						aria-label='Scoring dimensions'
						className='relative -mx-1 flex w-full shrink-0 items-stretch gap-2 self-stretch overflow-x-auto px-1 pb-1 md:mx-0 md:w-[250px] md:flex-col md:gap-4 md:overflow-visible md:border-r md:border-white/[0.06] md:px-0 md:pb-0 md:pr-6'
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
									type='button'
									aria-pressed={isActive}
									onClick={() => setDimension(d)}
									className={`flex shrink-0 items-center justify-between gap-2 rounded-[12px] border transition-opacity md:w-full md:shrink ${
										isActive
											? 'border-white/[0.06] pl-3 pr-2 py-1.5 md:pl-[17px] md:pr-[9px] md:py-[9px]'
											: 'border-transparent pl-3 pr-2 py-1.5 opacity-50 hover:opacity-75 md:pl-4 md:pr-2 md:py-2'
									}`}
									style={isActive ? { backgroundColor: 'rgba(16,185,129,0.2)' } : undefined}
								>
									<span className='flex items-center gap-2'>
										<Icon size={14} weight='regular' className='text-white' aria-hidden='true' />
										<span className='whitespace-nowrap text-[12px] font-medium leading-[16px] text-white/90'>
											{d}
										</span>
									</span>
									<span
										className='flex h-[21px] w-[32px] shrink-0 items-center justify-center rounded-[4px] border px-[7px] py-[3px]'
										style={{ backgroundColor: styles.bg, borderColor: styles.border }}
										aria-label={`Grade ${grade}`}
									>
										<span
											className='font-[family-name:var(--font-mono)] text-[10px] font-semibold leading-[15px]'
											style={{ color: styles.text }}
										>
											{grade}
										</span>
									</span>
								</button>
							)
						})}
					</nav>

					{/* Right content: title row + sections + finding counter */}
					<div className='relative flex min-w-0 flex-1 flex-col items-start gap-2 self-stretch'>
						{/* Title row: example title on the left, grade ring on the right */}
						<div className='flex w-full items-center justify-between'>
							<h4 className='font-[family-name:var(--font-heading)] text-[18px] font-semibold leading-none' style={{ color: '#EFEFEF' }}>
								{active.title}
							</h4>
							<GradeRing grade={active.grade} tone={activeGrade} />
						</div>

						<div className='flex w-full flex-col gap-4'>
							<div className='flex w-full flex-col gap-4'>
								<SaidSection
									variant='said'
									label='What you said'
									body={active.said}
								/>
								<SaidSection
									variant='should'
									label='What you should have said'
									body={active.shouldHaveSaid}
								/>
							</div>

							{/* Wave Y.6 (Alim 2026-04-28): Finding N/total prev/next pill
							 * REMOVED. Per 'See why you're losing deals — current too
							 * complex' directive, reduce moving parts: sidebar dimension
							 * list + industry tabs already provide the navigation
							 * surface; the secondary Finding counter stacked another
							 * paginator on top and read as chrome overhead. */}
						</div>
					</div>
				</div>
			</div>

			{/* Subhead beneath the visual — first paragraph from the canvas
			 * v5 deck only (second paragraph dropped per Andy 2026-04-27). */}
			<p className='mx-auto mt-12 max-w-3xl text-center text-base leading-relaxed text-cc-text-secondary md:text-lg'>
				Every call gets scored A through F, with industry-tailored scorecards and word-for-word talk-tracks showing you exactly what you should have said.
			</p>

			{/* Bottom CTA: button stacked on its own line, platform list below
			 * (mirrors SectionHero pattern at line 222) per Andy 2026-04-27. */}
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

/* 64×64 grade ring matching Figma 47:2629 — an open arc that sweeps ~80% of
 * the circle with a small gap at the top. The centre displays the grade in
 * Lora SemiBold 24px coloured to match the arc. */
function GradeRing({ grade, tone }: { grade: string; tone: GradeTone }) {
	const color = GRADE_TONE_STYLES[tone].text
	const radius = 28
	const circumference = 2 * Math.PI * radius
	const arcFraction = 0.82
	return (
		<div className='relative flex h-16 w-16 shrink-0 items-center justify-center'>
			<svg viewBox='0 0 64 64' className='absolute inset-0 h-full w-full' aria-hidden='true'>
				<circle
					cx={32}
					cy={32}
					r={radius}
					fill='none'
					stroke={color}
					strokeOpacity={0.18}
					strokeWidth={4}
					strokeLinecap='round'
				/>
				<circle
					cx={32}
					cy={32}
					r={radius}
					fill='none'
					stroke={color}
					strokeWidth={4}
					strokeLinecap='round'
					strokeDasharray={`${circumference * arcFraction} ${circumference}`}
					transform='rotate(-90 32 32)'
				/>
			</svg>
			<span
				className='relative font-[family-name:var(--font-heading)] text-[24px] font-semibold leading-none'
				style={{ color }}
			>
				{grade}
			</span>
		</div>
	)
}

/* Said/Should section — left column has a 20×20 icon tile + vertical hairline
 * running to the bottom; right column has an uppercase mono kicker and a
 * tinted panel with the quote. Variant decides colour (red for said, green
 * for should-have-said). */
function SaidSection({
	variant,
	label,
	body,
}: {
	variant: 'said' | 'should'
	label: string
	body: string
}) {
	const isSaid = variant === 'said'
	const Icon = isSaid ? XCircle : PencilSimple
	const iconBg = isSaid ? 'rgba(255,100,103,0.1)' : 'rgba(16,185,129,0.1)'
	const iconColor = isSaid ? '#FF6467' : '#10B981'
	const lineColor = isSaid ? 'rgba(255,100,103,0.4)' : 'rgba(16,185,129,0.4)'
	const panelBg = isSaid ? 'rgba(255,90,90,0.06)' : 'rgba(16,185,129,0.06)'
	const panelBorder = isSaid ? 'rgba(255,90,90,0.2)' : 'rgba(16,185,129,0.2)'
	const kickerColor = isSaid ? '#FF6467' : '#10B981'
	const bodyColor = isSaid ? '#94A3B8' : 'rgba(255,255,255,0.9)'

	return (
		<div className='flex w-full items-start gap-3'>
			{/* Left column: icon + hairline */}
			<div className='flex shrink-0 flex-col items-center gap-2 self-stretch'>
				<span
					className='flex h-5 w-5 items-center justify-center rounded-[4px] p-1'
					style={{ backgroundColor: iconBg }}
					aria-hidden='true'
				>
					<Icon size={12} weight={isSaid ? 'fill' : 'regular'} style={{ color: iconColor }} />
				</span>
				<span className='w-px flex-1' style={{ backgroundColor: lineColor }} aria-hidden='true' />
			</div>

			{/* Right column: kicker + panel */}
			<div className='flex min-w-0 flex-1 flex-col gap-4 pt-[5px]'>
				<span
					className='font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none'
					style={{ color: kickerColor, letterSpacing: '1.2px' }}
				>
					{label}
				</span>
				<div
					className='w-full rounded-2xl border p-4'
					style={{ backgroundColor: panelBg, borderColor: panelBorder }}
				>
					<p className='text-[14px] leading-[22.75px]' style={{ color: bodyColor }}>
						&ldquo;{body}&rdquo;
					</p>
				</div>
			</div>
		</div>
	)
}
