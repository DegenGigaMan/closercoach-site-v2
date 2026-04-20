/** @fileoverview S3 Step 2 Practice right-column visual composition.
 * 5-sub-state scroll-trigger-then-autoplay chain (Alim added this step; two new
 * product features sell here: interest meter + one-click suggested responses):
 *   2A (0 - 600ms):     Roleplay shell fades in. Sarah Chen avatar + VP Ops tag +
 *                        AI Clone pill visible. Conversation empty. Mic bar idle.
 *                        Interest meter at 50% neutral. Readiness gauge at 0%.
 *   2B (600 - 1800ms):  First AI clone objection bubble appears. Interest meter
 *                        drops to ~30% amber. "Weak objection pivot" negative
 *                        coaching chip fires beneath the AI bubble.
 *   2C (1800 - 3000ms): User response bubble appears. Interest meter rebounds to
 *                        ~55% emerald. "Great discovery question" positive chip
 *                        fires beneath the user bubble. Readiness gauge ticks to 40%.
 *   2D (3000 - 4200ms): Second AI clone objection. "Get Suggested Response"
 *                        affordance lights at mic corner + sparkle glyph. Popover
 *                        with 2-3 AI-generated rebuttal suggestions opens.
 *   2E (4200ms+):        Interest meter settles at 72% emerald. Readiness gauge
 *                        fills to 72% with "READY FOR THE REAL CALL" label. Stat
 *                        line "5 minutes a week = 2 practice rounds" renders.
 *                        Popover stays open; suggested-response button ambient pulse.
 *
 * Authority:
 *   - Visual spec: vault/clients/closer-coach/design/section-blueprint.md §S3 Step 2 (lines 211-220)
 *   - Copy spec:   vault/clients/closer-coach/copy/lp-copy-deck-v5.md §Section 3 Step 2 (v5.3)
 *   - Motion:      vault/clients/closer-coach/design/motion-spec.md §Thread Emergence
 *   - Vocabulary:  src/components/hero/hero-phone-v2.tsx (CoachingPill recipe, spring physics)
 *   - Shared utils: ./_shared/use-sub-state-machine (chain) + ./_shared/step-visual-defaults (tokens)
 *
 * NO phone frame in Step 2: phone is reserved for Step 3 per R7 v3 D3.
 *
 * Reduced-motion guard collapses the chain to state 2E instantly (suggested
 * popover renders open, meter at 72%, gauge full, chips visible, no ambient).
 *
 * Layout: the composition anchors inside the 36rem sticky slot. Roleplay card
 * sits centered (max-w-[420px]) with the vertical interest meter pinned to the
 * left edge (outside the card, anchored to the column) and the readiness gauge
 * + stat stacked beneath the card. */

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { CheckCircle, Warning, Microphone, Sparkle } from '@phosphor-icons/react'
import { useSubStateMachine } from './_shared/use-sub-state-machine'
import {
	CARD_SHADOW,
	CARD_ENTER_SPRING,
	THREAD_EASE,
	KICKER_MONO_MUTED,
	KICKER_MONO_EMERALD,
} from './_shared/step-visual-defaults'

/* Sub-state timings (ms). Each value is the moment the state begins. */
const T_2A = 0
const T_2B = 600
const T_2C = 1800
const T_2D = 3000
const T_2E = 4200

type SubState = '2A' | '2B' | '2C' | '2D' | '2E'

/* Sub-state chain definition. Pinned at module level per F27 (states-array
 * identity warning): inline arrays create new references every render and, with
 * once: false, would restart the chain. once: true makes this safe regardless,
 * but pinning keeps the hook contract clean and matches W2's STEP_ONE_STATES
 * convention. */
const STEP_TWO_STATES: ReadonlyArray<{ id: SubState, enterAtMs: number }> = [
	{ id: '2A', enterAtMs: T_2A },
	{ id: '2B', enterAtMs: T_2B },
	{ id: '2C', enterAtMs: T_2C },
	{ id: '2D', enterAtMs: T_2D },
	{ id: '2E', enterAtMs: T_2E },
] as const

/* Interest meter stops per sub-state. Values are 0-100 scale. Color shifts by
 * value: emerald >= 60, amber 40-59, score-red < 40. */
const INTEREST_BY_STATE: Record<SubState, number> = {
	'2A': 50,
	'2B': 30,
	'2C': 55,
	'2D': 55,
	'2E': 72,
}

/* Readiness gauge stops per sub-state. Arc fills from 0 to 0.72 over the chain. */
const READINESS_BY_STATE: Record<SubState, number> = {
	'2A': 0,
	'2B': 0,
	'2C': 0.4,
	'2D': 0.55,
	'2E': 0.72,
}

/* Suggested-rebuttal copy for the popover. Natural, non-slop phrasing anchored
 * on the AI's "integration failed" objection (mirrors the W2 OBJECTION field).
 * Not drawn from copy deck; flagged as agent invention in DEV-021. */
const SUGGESTED_REBUTTALS: readonly string[] = [
	'Try: "Which integration failed exactly?"',
	'Pivot: "What worked about the tool before it broke?"',
	'Reset: "Can I show you how ours is different?"',
] as const

/* ─── Interest meter ───────────────────────────────────────── */

/* Vertical bar anchored to the LEFT column edge, outside the card. Height
 * matches the card conversation area. Fill height + color animate per sub-state.
 *
 * Tooltip is WCAG-compliant: visible on hover AND focus (button wrapper), not
 * hover-only. title attribute provides native fallback for pointer devices. */
function InterestMeter({ subState, prefersReducedMotion }: {
	subState: SubState
	prefersReducedMotion: boolean
}) {
	const value = INTEREST_BY_STATE[subState]
	/* Color band: emerald (engaged) >= 60, amber (slipping) 40-59, score-red (near hang-up) < 40.
	 * emerald #10B981 WCAG 4.96:1 on cc-foundation, amber #F59E0B 10.08:1, score-red #EF4444 4.51:1. */
	const color = value >= 60 ? '#10B981' : value >= 40 ? '#F59E0B' : '#EF4444'
	/* Shadow color matches fill for a coherent glow pulse. */
	const glow = value >= 60 ? '16,185,129' : value >= 40 ? '245,158,11' : '239,68,68'

	return (
		<div className="flex h-full flex-col items-center gap-2 pr-1">
			<span className={`${KICKER_MONO_MUTED} writing-mode-vertical origin-center -rotate-180 [writing-mode:vertical-rl]`}>
				Buyer Interest
			</span>
			<button
				type="button"
				className="group relative flex h-[280px] w-[4px] cursor-help flex-col justify-end overflow-visible rounded-full bg-cc-surface-border outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60"
				aria-label={`Buyer interest at ${value}%. Prospects hang up when you suck.`}
				title="Prospects hang up when you suck."
			>
				{/* Fill bar. Grows from the bottom (justify-end). */}
				<motion.span
					aria-hidden="true"
					className="block w-full rounded-full"
					initial={prefersReducedMotion
						? { height: `${value}%`, backgroundColor: color }
						: { height: '50%', backgroundColor: '#F59E0B' }
					}
					animate={{
						height: `${value}%`,
						backgroundColor: color,
						boxShadow: `0 0 8px rgba(${glow},0.45)`,
					}}
					transition={prefersReducedMotion
						? { duration: 0 }
						: { duration: 0.55, ease: THREAD_EASE }
					}
				/>
				{/* Hover/focus tooltip. Pinned above the bar. */}
				<span
					role="tooltip"
					className="pointer-events-none absolute -top-9 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-cc-surface-card/95 px-2 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-secondary shadow-lg backdrop-blur-sm group-hover:block group-focus-visible:block"
				>
					Prospects hang up when you suck.
				</span>
			</button>
			<span className="font-[family-name:var(--font-mono)] text-[9px] font-semibold tabular-nums text-cc-text-secondary">
				{value}%
			</span>
		</div>
	)
}

/* ─── Coaching chip (positive/negative inline) ──────────────── */

/* Reuses HPV2 CoachingPill vocabulary: emerald + checkmark on positive,
 * score-red + warning on negative. 11px text with 12px glyph per the micro-lift
 * documented in hero-phone-v2.tsx §F2. */
function CoachingChip({ type, label, visible, prefersReducedMotion, align }: {
	type: 'positive' | 'negative'
	label: string
	visible: boolean
	prefersReducedMotion: boolean
	align: 'left' | 'right'
}) {
	const isPositive = type === 'positive'
	const pillClass = `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${isPositive
		? 'border-cc-accent/30 bg-cc-accent/10 text-cc-accent'
		: 'border-cc-score-red/30 bg-cc-score-red/10 text-red-400'
	}`
	const offsetX = align === 'right' ? -8 : 8

	return (
		<AnimatePresence>
			{visible && (
				<motion.span
					className={pillClass}
					initial={prefersReducedMotion ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: offsetX }}
					animate={{ opacity: 1, scale: 1, x: 0 }}
					exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: offsetX }}
					transition={prefersReducedMotion
						? { duration: 0 }
						: { type: 'spring', stiffness: 500, damping: 24 }
					}
				>
					{isPositive
						? <CheckCircle size={12} weight="fill" aria-hidden="true" />
						: <Warning size={12} weight="fill" aria-hidden="true" />
					}
					{label}
				</motion.span>
			)}
		</AnimatePresence>
	)
}

/* ─── Chat bubble ──────────────────────────────────────────── */

function ChatBubble({ who, text, visible, prefersReducedMotion }: {
	who: 'ai' | 'user'
	text: string
	visible: boolean
	prefersReducedMotion: boolean
}) {
	const isAi = who === 'ai'
	const align = isAi ? 'self-start' : 'self-end'
	/* AI bubbles use cc-surface-card, user bubbles use cc-accent/15 for the
	 * "yours" visual. Both maintain AA on their text color. */
	const bubbleClass = isAi
		? 'bg-cc-surface/80 border-white/[0.06] text-white'
		: 'bg-cc-accent/15 border-cc-accent/25 text-white'

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className={`${align} flex max-w-[82%] flex-col gap-1.5`}
					initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE }}
				>
					<div
						className={`rounded-2xl border px-3 py-2 text-[12px] leading-snug ${bubbleClass}`}
					>
						{text}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

/* ─── Roleplay card (conversation shell) ───────────────────── */

function RoleplayCard({ subState, prefersReducedMotion }: {
	subState: SubState
	prefersReducedMotion: boolean
}) {
	const aiBubble1Visible = subState === '2B' || subState === '2C' || subState === '2D' || subState === '2E'
	const userBubbleVisible = subState === '2C' || subState === '2D' || subState === '2E'
	const aiBubble2Visible = subState === '2D' || subState === '2E'
	const negChipVisible = aiBubble1Visible
	const posChipVisible = userBubbleVisible
	const suggestedLit = subState === '2D' || subState === '2E'
	const popoverOpen = subState === '2D' || subState === '2E'

	return (
		<motion.div
			className={`relative flex w-full max-w-[420px] flex-col gap-3 rounded-3xl border border-white/[0.08] bg-cc-surface-card/80 p-5 backdrop-blur-sm ${CARD_SHADOW}`}
			initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : CARD_ENTER_SPRING}
		>
			{/* Header: avatar + name + role + AI Clone pill */}
			<div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cc-accent/30 bg-cc-accent/10">
					<span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-cc-accent">SC</span>
				</div>
				<div className="flex min-w-0 flex-1 flex-col">
					<div className="flex items-center gap-1.5">
						<span className="text-[13px] font-semibold text-white">Sarah Chen</span>
						<span className="inline-flex items-center rounded-full border border-cc-accent/30 bg-cc-accent/10 px-1.5 py-[1px] font-[family-name:var(--font-mono)] text-[8px] font-medium uppercase tracking-[0.15em] text-cc-accent">
							AI Clone
						</span>
					</div>
					<span className="text-[10px] text-cc-text-secondary">VP Ops, Apex Industries</span>
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.2em] text-cc-accent/85">
					Live
				</span>
			</div>

			{/* Conversation area. Edge fades mask incoming bubbles for visual polish. */}
			<div className="relative min-h-[260px]">
				{/* Top fade mask */}
				<div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 z-10 bg-gradient-to-b from-cc-surface-card/85 to-transparent" />
				{/* Bottom fade mask */}
				<div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 z-10 bg-gradient-to-t from-cc-surface-card/85 to-transparent" />

				<div className="flex flex-col gap-3">
					{/* AI bubble 1 + negative chip beneath it (left-aligned) */}
					<ChatBubble
						who="ai"
						text="We've tried tools before. They all failed integration."
						visible={aiBubble1Visible}
						prefersReducedMotion={prefersReducedMotion}
					/>
					<div className="self-start">
						<CoachingChip
							type="negative"
							label="Weak objection pivot"
							visible={negChipVisible}
							prefersReducedMotion={prefersReducedMotion}
							align="left"
						/>
					</div>

					{/* User bubble + positive chip beneath it (right-aligned) */}
					<ChatBubble
						who="user"
						text="What worked about the last tool before it broke?"
						visible={userBubbleVisible}
						prefersReducedMotion={prefersReducedMotion}
					/>
					<div className="self-end">
						<CoachingChip
							type="positive"
							label="Great discovery question"
							visible={posChipVisible}
							prefersReducedMotion={prefersReducedMotion}
							align="right"
						/>
					</div>

					{/* AI bubble 2 (triggers the "user needs help" moment) */}
					<ChatBubble
						who="ai"
						text="Honestly? Nothing. Sales promised the world, delivery flopped."
						visible={aiBubble2Visible}
						prefersReducedMotion={prefersReducedMotion}
					/>
				</div>
			</div>

			{/* Mic bar: mic icon (left) + "Get Suggested Response" affordance (right corner) */}
			<div className="relative flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-cc-surface/60">
					<Microphone size={14} weight="regular" className="text-cc-text-secondary" aria-hidden="true" />
				</div>

				<SuggestedResponseAffordance
					lit={suggestedLit}
					popoverOpen={popoverOpen}
					settled={subState === '2E'}
					prefersReducedMotion={prefersReducedMotion}
				/>
			</div>
		</motion.div>
	)
}

/* ─── "Get Suggested Response" affordance ──────────────────── */

/* Button at the mic-bar corner. States:
 *   2A-2C: dim (opacity-40, no glow). Button is present but quiet.
 *   2D:    lit (emerald accent + sparkle + shadow glow). Popover opens above.
 *   2E:    ambient pulse on the button so it stays active-feeling in settled. */
function SuggestedResponseAffordance({ lit, popoverOpen, settled, prefersReducedMotion }: {
	lit: boolean
	popoverOpen: boolean
	settled: boolean
	prefersReducedMotion: boolean
}) {
	return (
		<div className="relative">
			{/* Popover: 2-3 rebuttal suggestions. Side-peels from the right edge of
			 * the card (F31 fix: previously opened UP-right from the mic bar and
			 * overlapped the user bubble "What worked about the last tool before
			 * it broke?", truncating it to "What " and undercutting the positive
			 * coaching chip's narrative. Open-down overflowed onto the readiness
			 * gauge. Side-peel right anchors outside the card's right gutter,
			 * keeping the button-to-popover affordance relationship via the small
			 * horizontal offset while leaving both the conversation area and the
			 * gauge unobstructed.) Reduced-motion renders open in 2E with no
			 * toggle animation. */}
			<AnimatePresence>
				{popoverOpen && (
					<motion.div
						role="tooltip"
						className="absolute left-[calc(100%+12px)] top-1/2 z-20 w-[252px] -translate-y-1/2 rounded-xl border border-white/[0.08] bg-cc-surface/95 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.55)] backdrop-blur-md"
						initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -6, scale: 0.98 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -6, scale: 0.98 }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { type: 'spring', stiffness: 320, damping: 26 }
						}
					>
						<div className="mb-2 flex items-center gap-1.5">
							<Sparkle size={11} weight="fill" className="text-cc-accent" aria-hidden="true" />
							<span className={KICKER_MONO_EMERALD}>Suggested</span>
						</div>
						<ul className="flex flex-col gap-1.5">
							{SUGGESTED_REBUTTALS.map((r) => (
								<li
									key={r}
									className="rounded-md border border-white/[0.04] bg-cc-surface-card/60 px-2 py-1.5 text-[11px] leading-snug text-cc-text-secondary"
								>
									{r}
								</li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.button
				type="button"
				className={[
					'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.1em] transition-colors',
					lit
						? 'border-cc-accent/40 bg-cc-accent/10 text-cc-accent'
						: 'border-white/[0.08] bg-cc-surface/40 text-cc-text-muted opacity-40',
				].join(' ')}
				aria-label="Get suggested response"
				animate={lit && !prefersReducedMotion
					? {
						boxShadow: settled
							? [
								'0 0 0 rgba(16,185,129,0)',
								'0 0 14px rgba(16,185,129,0.30)',
								'0 0 0 rgba(16,185,129,0)',
							]
							: '0 0 12px rgba(16,185,129,0.25)',
					}
					: { boxShadow: '0 0 0 rgba(16,185,129,0)' }
				}
				transition={lit && settled && !prefersReducedMotion
					? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
					: { duration: 0.5, ease: 'easeOut' }
				}
			>
				<Sparkle size={11} weight="fill" aria-hidden="true" />
				Get Suggested Response
			</motion.button>
		</div>
	)
}

/* ─── Readiness gauge + stat line ──────────────────────────── */

/* SVG arc gauge. 72% arc fill at 2E settled. pathLength animates 0 -> target
 * per sub-state. Center displays the percentage; label below reads
 * "READY FOR THE REAL CALL". Stat line "5 minutes a week = 2 practice rounds"
 * beneath the gauge sub-label. */
function ReadinessGauge({ subState, prefersReducedMotion }: {
	subState: SubState
	prefersReducedMotion: boolean
}) {
	const target = READINESS_BY_STATE[subState]
	const pct = Math.round(target * 100)
	const ready = subState === '2E'

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative h-[96px] w-[180px]">
				<svg
					viewBox="0 0 180 100"
					className="absolute inset-0 h-full w-full"
					aria-hidden="true"
				>
					<defs>
						<linearGradient id="cc-s3-w3-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
							<stop offset="100%" stopColor="#34E18E" stopOpacity="1" />
						</linearGradient>
					</defs>
					{/* Track */}
					<path
						d="M 14 90 A 76 76 0 0 1 166 90"
						fill="none"
						stroke="rgba(255,255,255,0.08)"
						strokeWidth={8}
						strokeLinecap="round"
					/>
					{/* Fill */}
					<motion.path
						d="M 14 90 A 76 76 0 0 1 166 90"
						fill="none"
						stroke="url(#cc-s3-w3-gauge-gradient)"
						strokeWidth={8}
						strokeLinecap="round"
						initial={prefersReducedMotion ? { pathLength: target } : { pathLength: 0 }}
						animate={{ pathLength: target }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.7, ease: THREAD_EASE }
						}
					/>
				</svg>
				{/* Center numeric display */}
				<div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1">
					<span
						className="font-[family-name:var(--font-heading)] text-[28px] leading-none text-cc-accent"
						aria-label={`Readiness ${pct} percent`}
					>
						{pct}%
					</span>
				</div>
			</div>
			<span className={ready ? KICKER_MONO_EMERALD : KICKER_MONO_MUTED}>
				Ready For The Real Call
			</span>
			<span className="font-[family-name:var(--font-sans)] text-[12px] text-cc-text-secondary">
				5 minutes a week = 2 practice rounds
			</span>
		</div>
	)
}

/* ─── Main component ───────────────────────────────────────── */

/* Dev-only sub-state pin. Mirrors W2 StepOneVisual's useSubStatePin. When
 * `?pin=2A..2E` is in the URL, the chain is bypassed and subState stays pinned.
 * Enables DD / Playwright captures of any sub-state without racing auto-advance. */
function useSubStatePin(): SubState | null {
	const [pin, setPin] = useState<SubState | null>(null)
	useEffect(() => {
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return
			const raw = new URLSearchParams(window.location.search).get('pin')
			if (raw === '2A' || raw === '2B' || raw === '2C' || raw === '2D' || raw === '2E') {
				setPin(raw)
			}
		}, 0)
		return () => clearTimeout(t)
	}, [])
	return pin
}

export default function StepTwoVisual() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const rootRef = useRef<HTMLDivElement>(null)
	/* Auto-fire on sticky viewport entry. amount: 0.3 + once: true mirrors W1/W2. */
	const inView = useInView(rootRef, { amount: 0.3, once: true })
	const pin = useSubStatePin()
	const machineState = useSubStateMachine<SubState>({
		states: STEP_TWO_STATES,
		trigger: inView,
		reducedMotion: prefersReducedMotion,
		initialState: '2A',
		settledState: '2E',
		once: true,
	})
	const subState: SubState = pin ?? machineState

	return (
		<div
			ref={rootRef}
			data-step="2"
			data-sub-state={subState}
			className="relative mx-auto flex h-full w-full max-w-[480px] items-stretch gap-4"
		>
			{/* Left edge: interest meter */}
			<div className="flex shrink-0 items-center">
				<InterestMeter subState={subState} prefersReducedMotion={prefersReducedMotion} />
			</div>

			{/* Main stack: roleplay card + readiness gauge */}
			<div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4">
				<RoleplayCard subState={subState} prefersReducedMotion={prefersReducedMotion} />
				<ReadinessGauge subState={subState} prefersReducedMotion={prefersReducedMotion} />
			</div>
		</div>
	)
}
