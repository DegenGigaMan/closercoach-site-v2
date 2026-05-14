'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import NumberFlow from '@number-flow/react'
import { useSubStateMachine } from './_shared/use-sub-state-machine'
import {
	CARD_SHADOW,
	CARD_ENTER_SPRING,
	FIELD_CASCADE_SPRING,
	THREAD_EASE,
	KICKER_MONO_EMERALD,
	KICKER_MONO_MUTED,
	PC_BADGE_PILL,
} from './_shared/step-visual-defaults'

/* Sub-state timings (ms). Each value is the moment the state begins. */
const T_4A = 0
const T_4B = 800
const T_4C = 2000
const T_4D = 3500
const T_4E = 5000

type SubState = '4A' | '4B' | '4C' | '4D' | '4E'

const STEP_FOUR_STATES: ReadonlyArray<{ id: SubState, enterAtMs: number }> = [
	{ id: '4A', enterAtMs: T_4A },
	{ id: '4B', enterAtMs: T_4B },
	{ id: '4C', enterAtMs: T_4C },
	{ id: '4D', enterAtMs: T_4D },
	{ id: '4E', enterAtMs: T_4E },
] as const

const INDUSTRY_TABS = ['Enterprise SaaS', 'Logistics', 'FinTech'] as const
const ACTIVE_INDUSTRY = 'Enterprise SaaS'

const METRIC_TABS = [
	'Discovery',
	'Pitch',
	'Objection Handling',
	'Closing',
	'Tonality',
] as const
const ACTIVE_METRIC = 'Objection Handling'

const TRANSCRIPT_YOU = 'We have integrations with everyone. I can send you docs.'
const TRANSCRIPT_COACHED = 'Which integration broke first when you tried it before?'

const FINDING_BODY =
	'Prospect deflected on pricing at 04:22. You answered with features. Anchor to the ROI timeline next time: "If this closes one deal in 90 days, it pays for itself."'

const AI_SUMMARY_STATS_WPM = 211
const AI_SUMMARY_STATS_TALK = 64
const AI_SUMMARY_STATS_LISTEN = 36

/* --------------- Shared primitives --------------- */

function IndustryTabs({ active, prefersReducedMotion }: {
	active: string
	prefersReducedMotion: boolean
}) {
	return (
		<div
			role="tablist"
			aria-label="Industry scorecard"
			className="flex items-center gap-1 border-b border-white/[0.06] px-1"
		>
			{INDUSTRY_TABS.map((tab) => {
				const isActive = tab === active
				return (
					<motion.button
						key={tab}
						type="button"
						role="tab"
						aria-selected={isActive}
						tabIndex={isActive ? 0 : -1}
						className="relative px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60"
						initial={{ opacity: 1 }}
						animate={{ color: isActive ? '#ffffff' : 'rgba(133,149,168,0.9)' }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: THREAD_EASE }}
					>
						{tab}
						{isActive && (
							<motion.span
								aria-hidden="true"
								layoutId="industry-tab-underline"
								className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-cc-accent"
								transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24 }}
							/>
						)}
					</motion.button>
				)
			})}
		</div>
	)
}

function MetricTabs({ active, prefersReducedMotion }: {
	active: string
	prefersReducedMotion: boolean
}) {
	return (
		<div
			role="tablist"
			aria-label="Scorecard metric"
			aria-orientation="vertical"
			className="flex w-[124px] shrink-0 flex-col gap-0.5"
		>
			{METRIC_TABS.map((tab) => {
				const isActive = tab === active
				return (
					<motion.button
						key={tab}
						type="button"
						role="tab"
						aria-selected={isActive}
						tabIndex={isActive ? 0 : -1}
						className="relative flex items-center rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60"
						initial={{ opacity: 1 }}
						animate={{
							color: isActive ? '#10B981' : 'rgba(133,149,168,0.85)',
							backgroundColor: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(0,0,0,0)',
						}}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: THREAD_EASE }}
					>
						{isActive && (
							<motion.span
								aria-hidden="true"
								layoutId="metric-tab-bar"
								className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-cc-accent"
								transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24 }}
							/>
						)}
						<span className="pl-1">{tab}</span>
					</motion.button>
				)
			})}
		</div>
	)
}

/* --------------- Scorecards --------------- */

/* One practice/real scorecard panel. Grade letter uses the ScoreState spring
 * vocabulary (stiffness 300, damping 18, scale 0.5 -> 1 with 0.05 delay). Amber
 * ring on practice, emerald ring on real. Panel itself uses CARD_ENTER_SPRING
 * for entrance. */
function ScorecardPanel({
	label,
	grade,
	subLabel,
	variant,
	revealed,
	prefersReducedMotion,
}: {
	label: string
	grade: string
	subLabel: string
	variant: 'practice' | 'real'
	revealed: boolean
	prefersReducedMotion: boolean
}) {
	const isReal = variant === 'real'
	const ringColor = isReal ? '#10B981' : '#F59E0B'
	const letterColor = isReal ? 'text-cc-accent' : 'text-cc-amber'
	const kickerClass = isReal ? KICKER_MONO_EMERALD : KICKER_MONO_MUTED

	return (
		<motion.div
			data-scorecard-variant={variant}
			className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-cc-surface/70 p-4 ${CARD_SHADOW}`}
			initial={{ opacity: 0, y: 8 }}
			animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={prefersReducedMotion ? { duration: 0 } : CARD_ENTER_SPRING}
		>
			<span className={kickerClass}>{label}</span>
			{/* Grade circle: 72px ring + letter-spring reveal. */}
			<div className="relative flex h-[72px] w-[72px] items-center justify-center">
				<svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
					<circle
						cx="36"
						cy="36"
						r="30"
						fill="none"
						stroke="rgba(255,255,255,0.06)"
						strokeWidth="4"
					/>
					<motion.circle
						cx="36"
						cy="36"
						r="30"
						fill="none"
						stroke={ringColor}
						strokeWidth="4"
						strokeLinecap="round"
						/* Stroke-dash draw on reveal. Practice ~52% fill (C+ reads ~low-mid),
						 * real ~88% fill (A- reads near-full). */
						strokeDasharray={2 * Math.PI * 30}
						initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
						animate={{
							strokeDashoffset: revealed
								? 2 * Math.PI * 30 * (1 - (isReal ? 0.88 : 0.52))
								: 2 * Math.PI * 30,
						}}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: THREAD_EASE, delay: revealed ? 0.1 : 0 }}
						style={{ transformOrigin: '36px 36px', transform: 'rotate(-90deg)' }}
					/>
				</svg>
				<motion.span
					className={`absolute font-[family-name:var(--font-heading)] text-[28px] leading-none ${letterColor}`}
					aria-label={`${label} grade ${grade}`}
					initial={{ opacity: 0, scale: 0.5 }}
					animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
					transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18, delay: 0.55 }}
				>
					{grade}
				</motion.span>
			</div>
			<span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-muted tabular-nums">
				{subLabel}
			</span>
		</motion.div>
	)
}

/* Emerald delta arrow between practice and real. SVG path stroke-draws left-to-
 * right during 4C with THREAD_EASE. Arrowhead appears on path land. */
function DeltaArrow({ drawn, prefersReducedMotion }: {
	drawn: boolean
	prefersReducedMotion: boolean
}) {
	return (
		<motion.div
			aria-hidden="true"
			data-arrow-drawn={drawn}
			className="pointer-events-none relative flex w-12 shrink-0 flex-col items-center justify-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: drawn ? 1 : 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
		>
			<svg width="48" height="32" viewBox="0 0 48 32" className="overflow-visible">
				<motion.path
					d="M 2 16 Q 24 4 46 16"
					fill="none"
					stroke="#10B981"
					strokeWidth="2"
					strokeLinecap="round"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: drawn ? 1 : 0 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: THREAD_EASE }}
				/>
				<motion.path
					d="M 40 10 L 46 16 L 40 22"
					fill="none"
					stroke="#10B981"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={{ opacity: 0 }}
					animate={{ opacity: drawn ? 1 : 0 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut', delay: 0.8 }}
				/>
			</svg>
			<motion.span
				className="mt-1 inline-flex items-center gap-1 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.15em] text-cc-accent tabular-nums"
				initial={{ opacity: 0, y: 4 }}
				animate={{ opacity: drawn ? 1 : 0, y: drawn ? 0 : 4 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut', delay: 0.9 }}
			>
				+2 grades
			</motion.span>
		</motion.div>
	)
}

/* --------------- Transcript split --------------- */

function TranscriptRow({ label, body, tone, index, revealed, prefersReducedMotion }: {
	label: string
	body: string
	tone: 'muted' | 'coached'
	index: number
	revealed: boolean
	prefersReducedMotion: boolean
}) {
	const kickerClass = tone === 'coached' ? KICKER_MONO_EMERALD : KICKER_MONO_MUTED
	const bodyClass = 'text-white'
	const borderClass = tone === 'coached'
		? 'border-cc-accent/20 bg-cc-accent/[0.06]'
		: 'border-white/[0.08] bg-cc-surface/60'
	return (
		<motion.div
			className={`flex flex-col gap-1.5 rounded-xl border p-3 ${borderClass}`}
			initial={{ opacity: 0, y: 6 }}
			animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={prefersReducedMotion
				? { duration: 0 }
				: { ...FIELD_CASCADE_SPRING, delay: 0.12 * index }
			}
		>
			<span className={kickerClass}>{label}</span>
			<p className={`text-[12px] leading-[1.4] ${bodyClass}`}>{body}</p>
		</motion.div>
	)
}

/* --------------- Deep-drill 1 of 20 card --------------- */

function DeepDrillCard({ revealed, prefersReducedMotion }: {
	revealed: boolean
	prefersReducedMotion: boolean
}) {
	return (
		<motion.div
			className={`flex min-w-0 flex-col gap-2 rounded-xl border border-cc-accent/20 bg-cc-surface-card p-3 ${CARD_SHADOW}`}
			initial={{ opacity: 0, x: 20 }}
			animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
			transition={prefersReducedMotion
				? { duration: 0 }
				: { ...CARD_ENTER_SPRING, delay: 0.3 }
			}
		>
			{/* Header: mono kicker + pagination glyphs */}
			<div className="flex items-center justify-between gap-2">
				<span className={KICKER_MONO_EMERALD}>Finding 1 / 20</span>
				<div className="flex items-center gap-1 text-cc-text-muted" aria-hidden="true">
					<CaretLeft size={10} weight="bold" />
					<CaretRight size={10} weight="bold" className="text-cc-accent" />
				</div>
			</div>
			<p className="text-[11.5px] leading-[1.45] text-cc-text-secondary">
				{FINDING_BODY}
			</p>
			{/* Badge inside the card for tight proof-adjacency. */}
			<span className={PC_BADGE_PILL}>
				Up to 20 Pages of Feedback
			</span>
		</motion.div>
	)
}

/* --------------- AI Coach summary --------------- */

function AICoachSummary({ revealed, prefersReducedMotion }: {
	revealed: boolean
	prefersReducedMotion: boolean
}) {
	return (
		<motion.div
			className={`flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-cc-surface/70 p-4 ${CARD_SHADOW}`}
			initial={{ opacity: 0, y: 12 }}
			animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={prefersReducedMotion ? { duration: 0 } : CARD_ENTER_SPRING}
		>
			<div className="flex items-center gap-2">
				<span className="flex h-6 w-6 items-center justify-center rounded-full border border-cc-accent/30 bg-cc-accent/10 font-[family-name:var(--font-mono)] text-[10px] font-semibold text-cc-accent">
					AI
				</span>
				<span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-cc-text-muted">
					AI Coach Summary
				</span>
			</div>
			{/* Headline grade + percentile. */}
			<p className="text-[13px] leading-[1.4] text-white">
				<span className="font-semibold text-cc-accent">B grade.</span>
				{' Top 15% this week.'}
			</p>
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-[10.5px] text-cc-text-secondary tabular-nums">
				<span aria-label={`${AI_SUMMARY_STATS_WPM} words per minute`}>
					<span aria-hidden="true">
						<NumberFlow value={revealed ? AI_SUMMARY_STATS_WPM : 0} />
						{' WPM'}
					</span>
				</span>
				<span aria-hidden="true" className="text-cc-text-muted">/</span>
				<span aria-label={`${AI_SUMMARY_STATS_TALK} percent talk, ${AI_SUMMARY_STATS_LISTEN} percent listen ratio`}>
					<span aria-hidden="true">
						{`${AI_SUMMARY_STATS_TALK} / ${AI_SUMMARY_STATS_LISTEN}`}
						<span className="text-cc-text-muted">{' talk-listen'}</span>
					</span>
				</span>
			</div>
			{/* 10px floor for readability at small sizes. */}
			<p className="font-[family-name:var(--font-mono)] text-[10px] italic leading-snug text-cc-text-muted">
				Scoring adapts to your conversation. Not a fixed rubric.
			</p>
		</motion.div>
	)
}

/* --------------- Dev pin hook --------------- */

function useSubStatePin(enabled: boolean): SubState | null {
	const [pin, setPin] = useState<SubState | null>(null)
	useEffect(() => {
		if (!enabled) return
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return
			const raw = new URLSearchParams(window.location.search).get('pin')
			if (raw === '4A' || raw === '4B' || raw === '4C' || raw === '4D' || raw === '4E') {
				setPin(raw)
			}
		}, 0)
		return () => clearTimeout(t)
	}, [enabled])
	return pin
}

/* --------------- Main component --------------- */

export default function StepFourVisual({ devPin = false }: { devPin?: boolean } = {}) {
	const prefersReducedMotion = useReducedMotion() ?? false
	const rootRef = useRef<HTMLDivElement>(null)
	const inView = useInView(rootRef, { amount: 0.3, once: true })
	const pin = useSubStatePin(devPin)
	const machineState = useSubStateMachine<SubState>({
		states: STEP_FOUR_STATES,
		trigger: inView,
		reducedMotion: prefersReducedMotion,
		initialState: '4A',
		settledState: '4E',
		once: true,
	})
	const subState: SubState = pin ?? machineState

	const practiceRevealed = subState !== '4A'
	const realRevealed = subState === '4C' || subState === '4D' || subState === '4E'
	const arrowDrawn = realRevealed
	const transcriptRevealed = subState === '4D' || subState === '4E'
	const summaryRevealed = subState === '4E'

	return (
		<div
			ref={rootRef}
			data-step="4"
			data-sub-state={subState}
			className="mx-auto flex h-full w-full max-w-[540px] flex-col gap-3"
		>
			{/* Outer shell: rounded card with industry tabs on top + metric tabs on
			 * left + comparison panel on right. 4A renders this alone; later states
			 * fill it. */}
			<motion.div
				className={`flex flex-col gap-3 rounded-3xl border border-white/[0.08] bg-cc-surface-card/80 p-4 backdrop-blur-sm ${CARD_SHADOW}`}
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={prefersReducedMotion ? { duration: 0 } : CARD_ENTER_SPRING}
			>
				<IndustryTabs active={ACTIVE_INDUSTRY} prefersReducedMotion={prefersReducedMotion} />

				<div className="flex gap-3">
					<MetricTabs active={ACTIVE_METRIC} prefersReducedMotion={prefersReducedMotion} />

					{/* Comparison + transcript column */}
					<div className="flex min-w-0 flex-1 flex-col gap-3">
						{/* Scorecards + delta */}
						<div className="flex items-center gap-2">
							<ScorecardPanel
								label="Practice"
								grade="C+"
								subLabel="Oct 14 / session 3"
								variant="practice"
								revealed={practiceRevealed}
								prefersReducedMotion={prefersReducedMotion}
							/>
							<DeltaArrow drawn={arrowDrawn} prefersReducedMotion={prefersReducedMotion} />
							<ScorecardPanel
								label="Real Call"
								grade="A-"
								subLabel="Apex, Oct 21"
								variant="real"
								revealed={realRevealed}
								prefersReducedMotion={prefersReducedMotion}
							/>
						</div>

						{/* Transcript split + deep-drill card row */}
						<div className="grid grid-cols-[1fr_1fr_minmax(0,1fr)] gap-2">
							<TranscriptRow
								label="You Said"
								body={TRANSCRIPT_YOU}
								tone="muted"
								index={0}
								revealed={transcriptRevealed}
								prefersReducedMotion={prefersReducedMotion}
							/>
							<TranscriptRow
								label="Coached Response"
								body={TRANSCRIPT_COACHED}
								tone="coached"
								index={1}
								revealed={transcriptRevealed}
								prefersReducedMotion={prefersReducedMotion}
							/>
							<DeepDrillCard
								revealed={transcriptRevealed}
								prefersReducedMotion={prefersReducedMotion}
							/>
						</div>
					</div>
				</div>
			</motion.div>

			{/* AI Coach summary below shell (full width). */}
			<AICoachSummary revealed={summaryRevealed} prefersReducedMotion={prefersReducedMotion} />
		</div>
	)
}
