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
	CaretLeft,
	CaretRight,
	MagnifyingGlass,
	Megaphone,
	ShieldCheck,
	PhoneCall,
	SpeakerHigh,
	XCircle,
	PencilSimple,
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

/* Finding number for the bottom pill. 4 industries × 5 dimensions = 20 total
 * examples; compute the 1-based index from the current selection so the pill
 * reads "Finding 1/20" through "Finding 20/20" in a stable row-major order. */
function findingIndex(
	industries: readonly string[],
	dimensions: readonly string[],
	industry: string,
	dimension: string,
): number {
	const iIdx = industries.indexOf(industry)
	const dIdx = dimensions.indexOf(dimension)
	if (iIdx < 0 || dIdx < 0) return 1
	return iIdx * dimensions.length + dIdx + 1
}

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
	const total = industries.length * dimensions.length
	const finding = findingIndex(industries, dimensions, industry, dimension)

	const stepPrev = () => {
		const dIdx = dimensions.indexOf(dimension)
		if (dIdx > 0) {
			setDimension(dimensions[dIdx - 1])
			return
		}
		const iIdx = industries.indexOf(industry)
		const nextIndustry = iIdx > 0 ? industries[iIdx - 1] : industries[industries.length - 1]
		setIndustry(nextIndustry)
		setDimension(dimensions[dimensions.length - 1])
	}

	const stepNext = () => {
		const dIdx = dimensions.indexOf(dimension)
		if (dIdx < dimensions.length - 1) {
			setDimension(dimensions[dIdx + 1])
			return
		}
		const iIdx = industries.indexOf(industry)
		const nextIndustry = iIdx < industries.length - 1 ? industries[iIdx + 1] : industries[0]
		setIndustry(nextIndustry)
		setDimension(dimensions[0])
	}

	return (
		<div className='mx-auto max-w-7xl px-6 pb-32 md:px-12 lg:px-16 lg:pb-40'>
			{/* Intro: kicker + headline + body */}
			<div className='mx-auto max-w-3xl text-center'>
				<div className='inline-flex items-center gap-2 rounded-full border border-cc-accent/25 bg-cc-accent/5 px-3 py-1'>
					<span className='h-1.5 w-1.5 rounded-full bg-cc-accent' aria-hidden='true' />
					<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent'>
						04 &middot; Review
					</span>
				</div>
				<h3 className='mt-6 text-3xl leading-[1.15] text-white md:text-4xl lg:text-[2.75rem]'>
					See <em className='text-cc-accent'>Exactly</em> What&rsquo;s Losing You Deals
				</h3>
				<p className='mt-6 text-base leading-relaxed text-cc-text-secondary md:text-lg'>
					Every call gets scored A through F, with industry-tailored scorecards and word-for-word talk-tracks showing you exactly what you should have said.
				</p>
				<p className='mt-4 text-base leading-relaxed text-cc-text-secondary md:text-lg'>
					Track how your skills improve over time: discovery, pitch, objection handling, tone, talk time, and close rate. The more you sell, the more your AI knows exactly where you&rsquo;re winning and where you&rsquo;re bleeding deals.
				</p>
			</div>

			{/* Scorecard composite — Figma 61:3023. Top industry pill row, then
			 * the framed scorecard (sidebar + content). */}
			<div className='mx-auto mt-12 flex w-full max-w-[800px] flex-col items-center gap-8'>
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

				{/* Framed scorecard: sidebar + main content */}
				<div
					className='relative flex w-full items-start gap-8 overflow-hidden rounded-[24px] border border-white/[0.08] pl-4 pr-8 py-4'
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

					{/* Left sidebar: dimensions */}
					<nav
						aria-label='Scoring dimensions'
						className='relative flex w-[250px] shrink-0 flex-col gap-4 self-stretch border-r border-white/[0.06] pr-6'
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
									className={`flex w-full items-center justify-between rounded-[12px] border transition-opacity ${
										isActive
											? 'border-white/[0.06] pl-[17px] pr-[9px] py-[9px]'
											: 'border-transparent pl-4 pr-2 py-2 opacity-50 hover:opacity-75'
									}`}
									style={isActive ? { backgroundColor: 'rgba(16,185,129,0.2)' } : undefined}
								>
									<span className='flex items-center gap-2'>
										<Icon size={14} weight='regular' className='text-white' aria-hidden='true' />
										<span className='text-[12px] font-medium leading-[16px] text-white/90'>
											{d}
										</span>
									</span>
									<span
										className='flex h-[21px] w-[32px] items-center justify-center rounded-[4px] border px-[7px] py-[3px]'
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

							{/* Finding counter pill */}
							<div
								className='inline-flex items-center justify-end gap-4 self-start rounded-full border border-white/[0.06] px-[13px] py-[5px]'
								style={{
									backgroundColor: 'rgba(26,29,38,0.7)',
									boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.4)',
								}}
							>
								<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[15px] text-cc-accent' style={{ letterSpacing: '2px' }}>
									Finding {finding}/{total}
								</span>
								<div className='flex items-center gap-1'>
									<button
										type='button'
										aria-label='Previous finding'
										onClick={stepPrev}
										className='flex h-[10px] w-[10px] items-center justify-center text-cc-accent transition-colors hover:text-cc-accent-hover'
									>
										<CaretLeft size={10} weight='bold' />
									</button>
									<button
										type='button'
										aria-label='Next finding'
										onClick={stepNext}
										className='flex h-[10px] w-[10px] items-center justify-center text-cc-accent transition-colors hover:text-cc-accent-hover'
									>
										<CaretRight size={10} weight='bold' />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom CTA */}
			<div className='mt-12 flex flex-wrap items-center justify-center gap-3'>
				<MotionCTA variant='primary' size='lg' href={CTA.tryFree.href}>
					{CTA.tryFree.text}
				</MotionCTA>
				<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-cc-text-muted'>
					App Store / Google Play
				</span>
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
