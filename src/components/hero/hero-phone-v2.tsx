/** @fileoverview Hero Phone V2 with Family Values transition model.
 * One mounted component. Shared elements (Camil Reese avatar/name) morph
 * via layoutId across states. State content enters/exits directionally.
 * No crossfade teleportation. Elements fly, they don't teleport.
 *
 * Architecture: LayoutGroup wraps the phone. Camil Reese's avatar and name
 * have consistent layoutId props. When activeIndex changes, Motion
 * automatically animates their position, size, and shape.
 *
 * States: TRAIN → PRACTICE → RECORD → SCORE (5s cycle)
 * Phone frame: Magic UI iPhone (realistic SVG with Dynamic Island) */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'
import {
	Globe,
	Check,
	Warning,
	WarningOctagon,
	CheckCircle,
	Trophy,
	Microphone,
	PhoneDisconnect,
	Phone as PhoneIcon,
	Users,
	Timer,
} from '@phosphor-icons/react'

/* Shared card recipe — L1 elevated card with dual shadow */
const CARD_SHADOW = 'shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.15)]'
import NumberFlow from '@number-flow/react'

const CYCLE_MS = 5800
const CAMIL_IMG = '/images/prospects/camil-reese.png'
const CC_LOGO = '/images/closercoach-logo.svg'

/* ─── Floating Badges ────────────────────────────────────── */

interface BadgeConfig {
	text: string
	variant: 'emerald' | 'amber' | 'red' | 'muted'
	position: 'right' | 'left'
	pulse?: boolean
}

const BADGE_SETS: BadgeConfig[][] = [
	[
		{ text: '60 seconds to start', variant: 'emerald', position: 'right' },
		{ text: 'AI-personalized', variant: 'muted', position: 'left' },
	],
	[
		{ text: 'Real-time coaching', variant: 'emerald', position: 'right' },
		{ text: '3 checkpoints', variant: 'amber', position: 'left' },
	],
	[
		{ text: 'LIVE', variant: 'red', position: 'right', pulse: true },
		{ text: 'Your caller ID', variant: 'muted', position: 'left' },
	],
	[
		{ text: 'See Detailed Feedback', variant: 'emerald', position: 'right' },
		{ text: '20 pages of feedback', variant: 'emerald', position: 'left' },
	],
]

const badgeVariantStyles: Record<BadgeConfig['variant'], string> = {
	emerald: 'border-cc-accent/30 bg-cc-accent/10 text-cc-accent',
	amber: 'border-cc-amber/30 bg-cc-amber/10 text-cc-amber',
	red: 'border-cc-score-red/30 bg-cc-score-red/10 text-cc-score-red',
	muted: 'border-cc-surface-border bg-cc-surface-card text-cc-text-secondary',
}

/* Direction tracks the cross-state narrative beat per transition map:
 *  down  = 0→1 onboarding→practice (exit-up / enter-below)
 *  right = 1→2 practice→real-call  (exit-left / enter-right)
 *  center= 2→3 real-call→verdict   (contract / expand-from-center)
 *  loop  = 3→0 verdict→new-cycle   (exit-up-fade / enter-cinematic)
 * Directional deltas are shared between state content and floating badges so they
 * travel together and do not lag during cross-fade windows (W4 §C3). */
type TransitionDirection = 'down' | 'right' | 'center' | 'loop'

const badgeDirectionOffset: Record<TransitionDirection, { x: number, y: number }> = {
	down: { x: 0, y: 8 },
	right: { x: -8, y: 0 },
	center: { x: 0, y: 0 },
	loop: { x: 0, y: -8 },
}

function FloatingBadges({
	activeIndex,
	direction,
	prefersReducedMotion,
}: {
	activeIndex: number
	direction: TransitionDirection
	prefersReducedMotion: boolean
}) {
	const offset = badgeDirectionOffset[direction]
	return (
		<AnimatePresence initial={false}>
			<motion.div key={`badges-${activeIndex}`} className="pointer-events-none">
				{BADGE_SETS[activeIndex].map((badge) => (
					<motion.div
						key={badge.text}
						className={`absolute hidden items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-medium backdrop-blur-sm md:flex ${badgeVariantStyles[badge.variant]} ${badge.position === 'right' ? 'right-[-140px] top-[25%]' : 'left-[-140px] bottom-[25%]'}`}
						initial={prefersReducedMotion
							? { opacity: 1, scale: 1, x: 0, y: 0 }
							: { opacity: 0, scale: 0.9, x: -offset.x, y: -offset.y }
						}
						animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
						exit={prefersReducedMotion
							? { opacity: 0 }
							: { opacity: 0, scale: 0.9, x: offset.x, y: offset.y }
						}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.25, ease: 'easeOut' }
						}
					>
						{badge.pulse && (
							<motion.div
								className="h-1.5 w-1.5 rounded-full bg-cc-score-red"
								animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
								transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity }}
							/>
						)}
						{badge.text}
					</motion.div>
				))}
			</motion.div>
		</AnimatePresence>
	)
}

/* ─── Dot Indicator ──────────────────────────────────────── */

function DotIndicator({ activeIndex }: { activeIndex: number }) {
	return (
		<div className="flex items-center justify-center gap-2 py-1.5">
			{Array.from({ length: 4 }).map((_, i) => (
				<motion.div
					key={i}
					className="rounded-full"
					animate={{
						width: i === activeIndex ? 16 : 6,
						height: 6,
						backgroundColor: i === activeIndex ? '#34E18E' : 'rgba(255,255,255,0.12)',
					}}
					transition={{ type: 'spring', stiffness: 400, damping: 25 }}
				/>
			))}
		</div>
	)
}

/* ─── Waveform ───────────────────────────────────────────── */

function Waveform({ bars = 48, height = 80, mini = false, pulse = true }: { bars?: number, height?: number, mini?: boolean, pulse?: boolean }) {
	const prefersReducedMotion = useReducedMotion()
	const barData = useMemo(() =>
		Array.from({ length: bars }).map((_, i) => {
			const base = Math.sin(i * 0.3) * 0.5 + 0.5
			return { base, phase: i * 0.15, speed: 1 + Math.random() * 0.6 }
		}), [bars])

	const shouldAnimate = pulse && !prefersReducedMotion

	return (
		<div className={`flex w-full items-center justify-center ${mini ? 'gap-[1px]' : 'gap-px'}`} style={{ height }}>
			{barData.map((bar, i) => (
				<motion.div
					key={i}
					className={`rounded-full bg-cc-accent ${mini ? 'w-[2px]' : 'w-[3px]'}`}
					animate={shouldAnimate
						? {
							height: [`${bar.base * height * 0.7}px`, `${bar.base * height * 0.25}px`, `${bar.base * height * 0.7}px`],
							opacity: [0.5, 0.9, 0.5],
						}
						: {
							height: `${bar.base * height * 0.5}px`,
							opacity: 0.7,
						}
					}
					transition={shouldAnimate
						? {
							duration: bar.speed,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: bar.phase * 0.05,
						}
						: { duration: 0 }
					}
				/>
			))}
		</div>
	)
}

/* ─── State 1: TRAIN ─────────────────────────────────────── */

const CHECKLIST_ITEMS = [
	'Understanding call type',
	'Understanding your product',
	'Building a challenging customer',
	'Baking in objectives',
]

function TrainState() {
	const [subState, setSubState] = useState<'input' | 'processing' | 'ready'>('input')

	useEffect(() => {
		// Sub-state 1A: URL input visible, typing happens
		// After typing completes (~1.8s), transition to processing
		const t1 = setTimeout(() => setSubState('processing'), 1800)
		// Sub-state 1B: Processing plays for ~2.2s, then result
		const t2 = setTimeout(() => setSubState('ready'), 4000)
		return () => { clearTimeout(t1); clearTimeout(t2) }
	}, [])

	return (
		<div className="flex h-full flex-col px-4 pb-4 pt-1">
			{/* Heading — Inter Medium 20px (override the global serif h2 rule) */}
			<h2 className="mb-[23px] text-center font-sans text-[20px] font-medium text-white">
				What do you sell?
			</h2>

			{/* URL Input Card — L1 recipe with dual shadow */}
			<div className={`rounded-2xl border border-white/[0.14] bg-cc-surface-card p-3 ${CARD_SHADOW}`}>
				<div className="text-[12px] text-white/50">Link to your website</div>
				<div className="mt-2 flex items-center gap-2">
					<Globe size={12} weight="bold" className="shrink-0 text-cc-accent" />
					<div className="flex-1 font-[family-name:var(--font-mono)] text-[11px] text-[#D3DFF0]">
						<TypeAnimation
							sequence={['', 300, 'yoursite.com/product', 800]}
							speed={55}
							cursor={true}
							repeat={0}
						/>
					</div>
					<span className="text-[9px] font-medium text-cc-accent">Paste</span>
				</div>
			</div>

			{/* Status block: enters with processing, stays through ready (progress bar + label persist) */}
			{subState !== 'input' && (
				<div className="mt-5 px-1">
					{/* Status text: morphs in place between processing and ready */}
					<AnimatePresence mode="wait">
						{subState === 'processing' && (
							<motion.div
								key="learning-text"
								className="mb-3 text-center text-[10px] text-cc-accent/[0.51]"
								initial={{ opacity: 0, y: 3 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -3 }}
								transition={{ duration: 0.25 }}
							>
								Learning your business...
							</motion.div>
						)}
						{subState === 'ready' && (
							<motion.div
								key="ready-text"
								className="mb-3 text-center text-[14px] text-cc-mint"
								initial={{ opacity: 0, y: 3 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25 }}
							>
								AI Clone Ready!
							</motion.div>
						)}
					</AnimatePresence>

					{/* Progress bar — persistent. Color shifts from working green → victory mint at ready */}
					<div className="h-[6px] w-full overflow-hidden rounded-full bg-white/[0.05]">
						<motion.div
							className="h-full rounded-full"
							initial={{ width: '0%' }}
							animate={{
								width: subState === 'ready' ? '100%' : '30%',
								backgroundColor: subState === 'ready' ? '#34E18E' : '#10B981',
							}}
							transition={{ duration: subState === 'ready' ? 0.5 : 2, ease: 'easeOut' }}
						/>
					</div>
				</div>
			)}

			{/* Checklist: only visible during processing. 70% group opacity, slate-400 text. */}
			<AnimatePresence>
				{subState === 'processing' && (
					<motion.div
						key="checklist"
						className="mt-4 flex flex-col gap-3 px-1 opacity-70"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 0.7, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.3 }}
					>
						{CHECKLIST_ITEMS.map((item, i) => (
							<motion.div
								key={item}
								className="flex items-center gap-2"
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.2, delay: 0.2 + i * 0.25 }}
							>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.15, delay: 0.35 + i * 0.25 }}
								>
									<Check size={12} weight="bold" className="text-cc-accent" />
								</motion.div>
								<span className="text-[10px] text-[#94A3B8]">{item}</span>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Prospect Card + Continue: only visible in ready state. Pinned to bottom of body. */}
			<AnimatePresence>
				{subState === 'ready' && (
					<motion.div
						key="result"
						className="mt-auto flex flex-col gap-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.3 }}
					>
						<motion.div
							className={`rounded-2xl border border-white/[0.14] bg-cc-surface-card p-3 ${CARD_SHADOW}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
						>
							<div className="flex items-center gap-3">
								<motion.div layoutId="prospect-avatar" className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
									<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover" sizes="40px" />
								</motion.div>
								<div>
									<motion.div layoutId="prospect-name" className="text-[12px] font-semibold text-white">Camil Reese</motion.div>
									<div className="text-[10px] text-white/50">Finance Director @ Oracle</div>
								</div>
							</div>
							<div className="mt-3">
								<span className="inline-flex items-center gap-1 rounded-full border border-cc-amber/10 bg-cc-amber/10 px-1.5 py-0.5 text-[8px] font-medium text-cc-amber">
									<WarningOctagon size={8} weight="fill" />
									Skeptical
								</span>
							</div>
							<p className="mt-3 text-[16px] font-light leading-snug text-white">
								&ldquo;How can I justify spending this much right now?&rdquo;
							</p>
						</motion.div>

						<motion.div
							className="flex items-center justify-center rounded-full bg-cc-mint py-2.5"
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7, duration: 0.3 }}
						>
							<span className="text-[14px] font-semibold text-black">Continue →</span>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

/* ─── State 2: PRACTICE ──────────────────────────────────── */

/* Exchange schedule. Delays are seconds relative to entry into sub-state 2B. */
type ExchangeEntry =
	| { delay: number, kind: 'ai', id: string, text: string }
	| { delay: number, kind: 'user', id: string, text: string }
	| { delay: number, kind: 'chip', id: string, type: 'positive' | 'negative', label: string, anchor: 'user' }

const EXCHANGE_SCHEDULE: readonly ExchangeEntry[] = [
	{ delay: 0.0, kind: 'ai', id: 'ai-1', text: 'We already have a vendor we\u2019re comfortable with.' },
	{ delay: 0.8, kind: 'user', id: 'user-1', text: 'I hear you. Switching feels risky. What would need to be true?' },
	{ delay: 1.3, kind: 'chip', id: 'chip-1', type: 'positive', label: 'Strong objection pivot', anchor: 'user' },
	{ delay: 1.8, kind: 'ai', id: 'ai-2', text: 'If you could show me real ROI numbers...' },
	{ delay: 2.4, kind: 'user', id: 'user-2', text: 'Let me send over a case study after.' },
	{ delay: 2.9, kind: 'chip', id: 'chip-2', type: 'negative', label: 'Missed The Mark', anchor: 'user' },
] as const

/* Render-time grouping: fold each user bubble + its immediately-following chip entry into a
 * single group so the chip anchors visually to the response it annotates. AI entries stay
 * as their own groups. The flat EXCHANGE_SCHEDULE remains the authoritative schedule.
 * F5 fix (W1.1, 2026-04-18). */
type ExchangeGroup =
	| { kind: 'ai', entry: Extract<ExchangeEntry, { kind: 'ai' }> }
	| {
		kind: 'user',
		user: Extract<ExchangeEntry, { kind: 'user' }>,
		chip: Extract<ExchangeEntry, { kind: 'chip' }> | null,
	}

const GROUPED_EXCHANGE: readonly ExchangeGroup[] = (() => {
	const groups: ExchangeGroup[] = []
	for (let i = 0; i < EXCHANGE_SCHEDULE.length; i++) {
		const entry = EXCHANGE_SCHEDULE[i]
		if (entry.kind === 'ai') {
			groups.push({ kind: 'ai', entry })
		} else if (entry.kind === 'user') {
			const next = EXCHANGE_SCHEDULE[i + 1]
			if (next && next.kind === 'chip') {
				groups.push({ kind: 'user', user: entry, chip: next })
				i++
			} else {
				groups.push({ kind: 'user', user: entry, chip: null })
			}
		}
		/* Orphan chips (no preceding user) are skipped. Schedule authors it that way. */
	}
	return groups
})()

type PracticeSubState = 'connecting' | 'exchange' | 'recording-prompt'

function PracticeState() {
	const prefersReducedMotion = useReducedMotion()
	const [subState, setSubState] = useState<PracticeSubState>(
		prefersReducedMotion ? 'recording-prompt' : 'connecting',
	)
	const [timer, setTimer] = useState(prefersReducedMotion ? 33 : 0)
	const [checkpointsFilled, setCheckpointsFilled] = useState(prefersReducedMotion ? 2 : 1)

	useEffect(() => {
		if (prefersReducedMotion) return

		const timers: ReturnType<typeof setTimeout>[] = []
		let tickInterval: ReturnType<typeof setInterval> | null = null

		/* 2A dwell: 0 \u2192 1.0s. Timer ticks 0 \u2192 33 over 1.8s of visual count-up handled by NumberFlow. */
		timers.push(setTimeout(() => setTimer(33), 80))

		/* 2A \u2192 2B at 1.0s. Start the tick interval here so the timer feels live through 2B and 2C. */
		timers.push(setTimeout(() => {
			setSubState('exchange')
			tickInterval = setInterval(() => {
				setTimer((prev) => (prev < 599 ? prev + 1 : prev))
			}, 1000)
		}, 1000))

		/* Checkpoint fill at moment positive chip fires: 1.0s (2B start) + 1.3s chip delay = 2.3s total */
		timers.push(setTimeout(() => setCheckpointsFilled(2), 2300))

		/* 2B \u2192 2C at 4.2s (1.0s entry + 2.9s schedule tail + 0.3s land buffer) */
		timers.push(setTimeout(() => setSubState('recording-prompt'), 4200))

		return () => {
			timers.forEach(clearTimeout)
			if (tickInterval) clearInterval(tickInterval)
		}
	}, [prefersReducedMotion])

	const isConnecting = subState === 'connecting'
	const isRecordingPrompt = subState === 'recording-prompt'
	const showExchange = subState === 'exchange' || subState === 'recording-prompt'

	return (
		<div className="flex h-full flex-col px-4 pb-4 pt-1">
			{/* Top: Call Header */}
			<div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-cc-surface/60 px-3 py-2.5">
				<motion.div layoutId="prospect-avatar" className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
					<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover" sizes="28px" />
				</motion.div>
				<div className="flex items-center gap-1.5">
					<span className="rounded bg-blue-500/20 px-1.5 py-[2px] text-[9px] font-bold text-blue-400 ring-1 ring-blue-400/20">AI</span>
					<motion.div layoutId="prospect-name" className="text-[12px] font-medium text-white">Camil Reese</motion.div>
					<motion.div
						className="ml-0.5 h-1.5 w-1.5 rounded-full bg-cc-accent"
						animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'easeInOut' }}
					/>
				</div>
				<div className="ml-auto flex items-center gap-1 font-[family-name:var(--font-mono)] text-[10px] text-cc-text-muted tabular-nums">
					<NumberFlow
						value={timer}
						format={{ minimumIntegerDigits: 2 }}
						prefix="00:"
					/>
					<span className="text-cc-text-muted/60">/ 10:00</span>
				</div>
			</div>

			{/* Middle: Conversation */}
			<div className="relative flex flex-1 flex-col gap-2 overflow-hidden py-3">
				{isConnecting && (
					<motion.div
						className="m-auto flex flex-col items-center gap-1.5 text-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<motion.div
							className="h-1.5 w-1.5 rounded-full bg-cc-accent/60"
							animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.4, 1] }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
						/>
						<span className="text-[10px] text-cc-text-muted">Connecting...</span>
					</motion.div>
				)}

				{showExchange && (
					<AnimatePresence>
						{GROUPED_EXCHANGE.map((group) => {
							if (group.kind === 'ai') {
								const entry = group.entry
								return (
									<motion.div
										key={entry.id}
										className="relative mr-auto max-w-[88%] rounded-2xl rounded-bl-sm border border-l-2 border-white/[0.08] border-l-cc-accent/50 bg-cc-surface-card/80 px-3.5 py-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
										initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -14 }}
										animate={{ opacity: 1, x: 0 }}
										transition={prefersReducedMotion
											? { duration: 0 }
											: { type: 'spring', stiffness: 320, damping: 24, delay: entry.delay }
										}
									>
										<p className="text-[12px] leading-[1.5] text-cc-text-secondary">{entry.text}</p>
									</motion.div>
								)
							}
							/* User-bubble + trailing chip are rendered as a single grouped container so the chip
							 * visually attaches to the response it annotates (stamp on THIS response, not a
							 * separate banner row). The wrapper owns right-alignment; the chip uses mt-1 to
							 * sit tight beneath the bubble. */
							return (
								<div key={group.user.id} className="ml-auto flex max-w-[88%] flex-col items-end">
									<motion.div
										className="rounded-2xl rounded-br-sm border border-cc-accent/20 bg-cc-accent/15 px-3.5 py-2.5"
										initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 14 }}
										animate={{ opacity: 1, x: 0 }}
										transition={prefersReducedMotion
											? { duration: 0 }
											: { type: 'spring', stiffness: 320, damping: 24, delay: group.user.delay }
										}
									>
										<p className="text-[12px] leading-[1.5] text-white">{group.user.text}</p>
									</motion.div>
									{group.chip && (
										<div className="mt-1">
											<CoachingPill
												type={group.chip.type}
												label={group.chip.label}
												delay={group.chip.delay}
												prefersReducedMotion={!!prefersReducedMotion}
											/>
										</div>
									)}
								</div>
							)
						})}
					</AnimatePresence>
				)}
			</div>

			{/* Bottom: Checkpoint + Mic Bar */}
			<div className="flex flex-col gap-3">
				<motion.div
					className="flex items-center justify-between px-1"
					initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.1, duration: 0.3 }}
				>
					<div className="flex items-center gap-2">
						{[0, 1, 2].map((i) => {
							const isComplete = i < checkpointsFilled
							const isCurrent = i === checkpointsFilled
							return (
								<motion.div
									key={i}
									className="relative h-2.5 w-2.5 rounded-full"
									animate={{
										borderColor: isComplete || isCurrent ? 'rgba(16,185,129,1)' : 'rgba(255,255,255,0.15)',
										borderWidth: isCurrent ? 2 : 1,
									}}
									transition={{ duration: 0.2 }}
									style={{ borderStyle: 'solid' }}
								>
									<motion.div
										className="absolute inset-[1px] rounded-full bg-cc-accent"
										initial={false}
										animate={{ scale: isComplete ? 1 : 0 }}
										transition={{ type: 'spring', stiffness: 400, damping: 22 }}
									/>
								</motion.div>
							)
						})}
						<span className="ml-1 text-[10px] text-cc-text-muted">Checkpoints</span>
					</div>
					<span className="font-[family-name:var(--font-mono)] text-[11px] font-medium text-cc-amber tabular-nums">
						{checkpointsFilled}/3
					</span>
				</motion.div>

				<motion.div
					className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] px-4 py-3"
					initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
					animate={{
						opacity: 1,
						y: 0,
						backgroundColor: isRecordingPrompt ? 'rgba(30,34,48,1)' : 'rgba(26,29,38,0.6)',
						boxShadow: isRecordingPrompt
							? '0 0 20px rgba(16,185,129,0.15)'
							: '0 0 0px rgba(16,185,129,0)',
					}}
					whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
					whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
					transition={prefersReducedMotion
						? { duration: 0 }
						: { delay: 0.15, duration: 0.35 }
					}
				>
					<motion.div
						animate={{ color: isRecordingPrompt ? 'rgba(16,185,129,1)' : 'rgba(16,185,129,0.4)' }}
						transition={{ duration: 0.3 }}
					>
						<Microphone size={18} weight="fill" />
					</motion.div>
					{/* F7 (W4 §C7): muted state lifted from rgba(100,116,139,0.8) on cc-foundation
					 * (~2.88:1, failed AA) to rgba(148,163,184,0.85) on the composited pill bg
					 * (~5.44:1, clears AA 4.5 with buffer). Preserves dimmer read vs the active
					 * state (1.0 alpha, ~7.0:1) so the brighten-on-2C transition still carries. */}
					<motion.span
						className="text-[11px]"
						animate={{
							color: isRecordingPrompt ? 'rgba(148,163,184,1)' : 'rgba(148,163,184,0.85)',
						}}
						transition={{ duration: 0.3 }}
					>
						Record your response
					</motion.span>
					<motion.div
						className="ml-auto flex-1"
						animate={{ opacity: isRecordingPrompt ? 1 : 0.4 }}
						transition={{ duration: 0.3 }}
					>
						<Waveform bars={20} height={18} mini pulse={isRecordingPrompt} />
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}

/* Coaching pill: unified vocabulary for PRACTICE (S2) and RECORD (S3).
 * Structure: wrapper position root, glow layer (behind, positive only), pill (foreground).
 * Isolation: pill carries spring physics only; glow layer owns its own keyframe animation.
 * Re-renders of the parent cannot re-trigger the glow because the pill's animate prop is stable.
 * Negative chips render without a glow layer (misses do not celebrate).
 * Optional `timestamp` prop renders a mono micro-stamp at the right edge, used by S3 RECORD
 * to anchor each annotation to a moment in the live call.
 * F1 (W1.1): negative chip uses text-red-400 (#F87171) on bg-cc-score-red/10, contrast 5.87:1 AA. */
function CoachingPill({ type, label, delay, prefersReducedMotion, timestamp }: {
	type: 'positive' | 'negative'
	label: string
	delay: number
	prefersReducedMotion: boolean
	timestamp?: string
}) {
	const [landed, setLanded] = useState(false)
	const isPositive = type === 'positive'

	const pillClass = `relative inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${isPositive
		? 'border-cc-accent/30 bg-cc-accent/10 text-cc-accent'
		: 'border-cc-score-red/30 bg-cc-score-red/10 text-red-400'
	}`

	/* Timestamp alpha raised to /85 to clear WCAG AA 4.5:1 over the composited pill backgrounds.
	 * Measured: neg 4.73:1, pos 5.17:1 at /85 (vs 2.98 / 3.25 at /60 which failed AA). */
	const timestampClass = `ml-1 font-[family-name:var(--font-mono)] text-[9px] tabular-nums ${isPositive ? 'text-cc-accent/85' : 'text-red-400/85'}`

	return (
		<span className="relative inline-flex">
			{isPositive && landed && !prefersReducedMotion && (
				<motion.span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-full"
					initial={{ boxShadow: '0 0 0px rgba(16,185,129,0)' }}
					animate={{
						boxShadow: [
							'0 0 0px rgba(16,185,129,0)',
							'0 0 10px rgba(16,185,129,0.45)',
							'0 0 0px rgba(16,185,129,0)',
						],
					}}
					transition={{ duration: 0.6, ease: 'easeOut' }}
				/>
			)}
			<motion.span
				className={pillClass}
				initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85, y: -4 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={prefersReducedMotion
					? { duration: 0 }
					: { type: 'spring', stiffness: 500, damping: 24, delay }
				}
				onAnimationComplete={() => {
					if (!landed) setLanded(true)
				}}
			>
				{isPositive
					? <CheckCircle size={12} weight="fill" />
					: <Warning size={12} weight="fill" />
				}
				{label}
				{timestamp && <span className={timestampClass}>{timestamp}</span>}
			</motion.span>
		</span>
	)
}

/* ─── State 3: RECORD ────────────────────────────────────── */

/* Sub-state machine native to RECORD's "live real-world call being captured" narrative:
 *  3A capture     (0 - 0.9s): REC indicator enters, timer starts ticking, waveform low-amplitude
 *  3B annotation  (0.9 - 4.3s): waveform full pulse, negative chip + positive chip + transcript fire
 *  3C end-ready   (4.3 - 5.8s): End Call button gains gentle attention (background breathing)
 *
 * Timer entry: starts at 163 (02:43) and ticks 1Hz across the window, landing at ~02:48.
 * Reduced-motion branch: jumps to end-ready with all chips and transcript present, no animations. */
type RecordSubState = 'capture' | 'annotation' | 'end-ready'

const REC_TIMER_START = 163
const REC_NEGATIVE_DELAY = 1.5
const REC_POSITIVE_DELAY = 2.6
const REC_TRANSCRIPT_DELAY = 3.2

function formatRecordTimer(total: number) {
	const minutes = Math.floor(total / 60)
	const seconds = total % 60
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function RecordState() {
	const prefersReducedMotion = useReducedMotion()
	const [subState, setSubState] = useState<RecordSubState>(
		prefersReducedMotion ? 'end-ready' : 'capture',
	)
	const [timer, setTimer] = useState(prefersReducedMotion ? REC_TIMER_START + 5 : REC_TIMER_START)

	useEffect(() => {
		if (prefersReducedMotion) return

		const timers: ReturnType<typeof setTimeout>[] = []
		let tickInterval: ReturnType<typeof setInterval> | null = null

		/* Tick from 3A entry through 3C; call feels live the whole window. */
		tickInterval = setInterval(() => {
			setTimer((prev) => (prev < 599 ? prev + 1 : prev))
		}, 1000)

		/* 3A to 3B at 0.9s: annotations begin; waveform graduates to full pulse. */
		timers.push(setTimeout(() => setSubState('annotation'), 900))

		/* 3B to 3C at 4.3s: End Call attention arc begins. */
		timers.push(setTimeout(() => setSubState('end-ready'), 4300))

		return () => {
			timers.forEach(clearTimeout)
			if (tickInterval) clearInterval(tickInterval)
		}
	}, [prefersReducedMotion])

	const isCapture = subState === 'capture'
	const isAnnotation = subState === 'annotation' || subState === 'end-ready'
	const isEndReady = subState === 'end-ready'

	return (
		<div className="flex h-full flex-col justify-between px-4 pb-4 pt-1">
			{/* Top: Compact header */}
			<div className="flex items-center justify-between py-1">
				<div className="relative flex items-center gap-2">
					<span className="relative inline-flex h-2.5 w-2.5">
						{!prefersReducedMotion && (
							<motion.span
								aria-hidden="true"
								className="absolute inset-0 rounded-full"
								style={{ boxShadow: '0 0 8px rgba(239,68,68,0.55)' }}
								animate={{ opacity: [0.45, 0.95, 0.45] }}
								transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
							/>
						)}
						<motion.span
							className="relative h-2.5 w-2.5 rounded-full bg-cc-score-red"
							animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0.45, 1] }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
							}
						/>
					</span>
					<span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[0.04em] text-red-400">REC</span>
					<span className="font-[family-name:var(--font-mono)] text-[11px] text-cc-text-muted-warm tabular-nums">
						{formatRecordTimer(timer)}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<motion.div layoutId="prospect-avatar" className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
						<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover" sizes="24px" />
					</motion.div>
					<motion.div layoutId="prospect-name" className="text-[11px] text-cc-text-secondary">Camil Reese</motion.div>
				</div>
			</div>

			{/* Middle: LARGE Waveform (hero of this state).
			 *  3A: subtle scale-down to read as low-amplitude idle pulse
			 *  3B/3C: full amplitude, voice in flight */}
			<div className="flex flex-1 flex-col items-center justify-center py-3">
				<motion.div
					className="w-full"
					initial={prefersReducedMotion ? { scaleY: 1, opacity: 1 } : { scaleY: 0.55, opacity: 0.6 }}
					animate={{
						scaleY: isCapture ? 0.55 : 1,
						opacity: isCapture ? 0.6 : 1,
					}}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeOut' }}
					style={{ transformOrigin: 'center' }}
				>
					<Waveform bars={56} height={80} pulse={!prefersReducedMotion} />
				</motion.div>
			</div>

			{/* Bottom: Annotations + Transcript + End Call */}
			<div className="flex flex-col gap-2">
				<AnimatePresence>
					{isAnnotation && (
						<motion.div
							key="annotation-stack"
							className="flex flex-col items-end gap-1.5"
							initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
						>
							<CoachingPill
								type="negative"
								label="You let the prospect defer"
								timestamp="01:47"
								delay={prefersReducedMotion ? 0 : REC_NEGATIVE_DELAY - 0.9}
								prefersReducedMotion={!!prefersReducedMotion}
							/>
							<CoachingPill
								type="positive"
								label="Great discovery question"
								timestamp="02:13"
								delay={prefersReducedMotion ? 0 : REC_POSITIVE_DELAY - 0.9}
								prefersReducedMotion={!!prefersReducedMotion}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{isAnnotation && (
						<motion.div
							key="transcript"
							className="px-1 text-[10px] italic leading-relaxed text-cc-text-muted-warm/85"
							initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { type: 'spring', stiffness: 180, damping: 22, delay: REC_TRANSCRIPT_DELAY - 0.9 }
							}
						>
							&ldquo;...it needs to actually drive revenue. Not just look nicer...&rdquo;
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div
					className="relative flex items-center justify-center gap-2 rounded-xl border border-cc-score-red/20 py-2.5"
					initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
					animate={prefersReducedMotion
						? {
							opacity: 1,
							y: 0,
							backgroundColor: 'rgba(239,68,68,0.16)',
							boxShadow: '0 0 0 rgba(239,68,68,0)',
						}
						: isEndReady
							? {
								opacity: 1,
								y: 0,
								backgroundColor: ['rgba(239,68,68,0.12)', 'rgba(239,68,68,0.20)', 'rgba(239,68,68,0.12)'],
								boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 14px rgba(239,68,68,0.28)', '0 0 0 rgba(239,68,68,0)'],
							}
							: {
								opacity: 1,
								y: 0,
								backgroundColor: 'rgba(239,68,68,0.12)',
								boxShadow: '0 0 0 rgba(239,68,68,0)',
							}
					}
					transition={prefersReducedMotion
						? { duration: 0 }
						: isEndReady
							? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
							: { duration: 0.35, delay: 0.2 }
					}
				>
					<PhoneDisconnect size={16} weight="fill" className="text-red-400" />
					<span className="text-[12px] font-semibold text-red-400">End Call</span>
				</motion.div>
			</div>
		</div>
	)
}

/* ─── State 4: SCORE ─────────────────────────────────────── */

/* Sub-state machine native to SCORE's "verdict and analysis" narrative.
 *  4A reveal   (0 - 1.6s): ring track fades in, amber arc draws, letter B lands with bounce,
 *                          Top 15% badge pops. THE delight moment.
 *  4B cascade  (1.6 - 4.2s): AI Coach card slides in, WPM card from left, Confident from right,
 *                            Talk/Listen bar fades in then fills sequentially.
 *  4C settled  (4.2 - 5.8s): Top 15% dot pulse + grade ring gentle opacity breath.
 *
 * Entry-frame flash fix (DD W1 §7.4): outer container opacity 0 to 1 over 180ms on mount,
 * so no empty-ring-only frame is visible during the 3 to 4 crossfade.
 *
 * WCAG AA carry-forward: sub-descriptions raised from cc-text-muted (3.51:1) to
 * cc-text-secondary (6.80:1). "Personalized feedback" subtitle raised from cc-accent/60
 * (4.35:1) to cc-accent/75 (5.19:1). Icon tints raised from /70 to /85 for graphical 3:1. */

type ScoreSubState = 'reveal' | 'cascade' | 'settled'

const SCORE_RING_RADIUS = 50
const SCORE_RING_CIRC = 2 * Math.PI * SCORE_RING_RADIUS
const SCORE_TARGET = 80
const SCORE_TALK_PCT = 64
const SCORE_LISTEN_PCT = 36
const SCORE_WPM = 211

function ScoreState() {
	const prefersReducedMotion = useReducedMotion()
	const [subState, setSubState] = useState<ScoreSubState>(
		prefersReducedMotion ? 'settled' : 'reveal',
	)
	const [ringDrawn, setRingDrawn] = useState(prefersReducedMotion)
	const [talkPct, setTalkPct] = useState(prefersReducedMotion ? SCORE_TALK_PCT : 0)
	const [listenPct, setListenPct] = useState(prefersReducedMotion ? SCORE_LISTEN_PCT : 0)

	useEffect(() => {
		if (prefersReducedMotion) return

		const timers: ReturnType<typeof setTimeout>[] = []

		/* Trigger the amber arc draw at t=+0.25s (after the track fade lands). */
		timers.push(setTimeout(() => setRingDrawn(true), 250))

		/* 4A reveal -> 4B cascade at 1.6s. Ring, letter, badge all settled. */
		timers.push(setTimeout(() => setSubState('cascade'), 1600))

		/* Talk/Listen percentages count up as the bars fill. Talk begins at t=+3.0s; Listen at t=+3.5s. */
		timers.push(setTimeout(() => setTalkPct(SCORE_TALK_PCT), 3000))
		timers.push(setTimeout(() => setListenPct(SCORE_LISTEN_PCT), 3500))

		/* 4B cascade -> 4C settled at 4.2s. All analysis present; ambient motion begins. */
		timers.push(setTimeout(() => setSubState('settled'), 4200))

		return () => { timers.forEach(clearTimeout) }
	}, [prefersReducedMotion])

	const isSettled = subState === 'settled'

	return (
		<motion.div
			className="flex h-full flex-col justify-between px-4 pb-4 pt-1"
			initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
		>
			{/* Top: Top 15% badge + Grade Ring.
			 *  Badge pops at t=+1.25s (after letter lands).
			 *  Ring track fades in at t=0; amber arc draws from t=+0.25s over 1.0s.
			 *  Letter B lands with bounce at t=+0.85s (ring ~60% drawn). */}
			<div className="flex flex-col items-center pt-1">
				<motion.div
					className="mb-1.5 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-3 py-1"
					initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={prefersReducedMotion
						? { duration: 0 }
						: { type: 'spring', stiffness: 400, damping: 22, delay: 1.25 }
					}
				>
					<span className="flex items-center gap-1.5 text-[10px] font-medium text-cc-accent">
						<motion.span
							className="block h-1.5 w-1.5 rounded-full bg-cc-accent"
							animate={isSettled && !prefersReducedMotion
								? { opacity: [1, 0.5, 1] }
								: { opacity: 1 }
							}
							transition={isSettled && !prefersReducedMotion
								? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
								: { duration: 0 }
							}
						/>
						Top 15%
					</span>
				</motion.div>

				<div className="relative flex items-center justify-center">
					<motion.svg
						width="120"
						height="120"
						viewBox="0 0 120 120"
						initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
						animate={isSettled && !prefersReducedMotion
							? { opacity: [1, 0.9, 1] }
							: { opacity: 1 }
						}
						transition={isSettled && !prefersReducedMotion
							? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
							: prefersReducedMotion
								? { duration: 0 }
								: { duration: 0.2, ease: 'easeOut' }
						}
					>
						<circle
							cx="60"
							cy="60"
							r={SCORE_RING_RADIUS}
							fill="none"
							stroke="rgba(255,255,255,0.06)"
							strokeWidth="6"
						/>
						<motion.circle
							cx="60"
							cy="60"
							r={SCORE_RING_RADIUS}
							fill="none"
							stroke="#F59E0B"
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={`${SCORE_RING_CIRC}`}
							initial={{ strokeDashoffset: SCORE_RING_CIRC }}
							animate={{
								strokeDashoffset: ringDrawn
									? SCORE_RING_CIRC * (1 - SCORE_TARGET / 100)
									: SCORE_RING_CIRC,
							}}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 1.0, ease: 'easeOut' }
							}
							style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
						/>
					</motion.svg>
					<motion.div
						className="absolute flex flex-col items-center"
						initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { type: 'spring', stiffness: 300, damping: 18, delay: 0.85 }
						}
					>
						<span className="font-[family-name:var(--font-heading)] text-4xl text-cc-amber">B</span>
					</motion.div>
				</div>
			</div>

			{/* Middle: AI Coach Card. Slides in at 4B entry (t=+1.6s) with dual shadow
			 *  echoing State 1 CARD_SHADOW recipe. */}
			<motion.div
				className="rounded-2xl border border-cc-accent/25 bg-cc-accent/8 p-3.5 shadow-[0_6px_14px_rgba(0,0,0,0.45),0_0_18px_rgba(16,185,129,0.10)]"
				initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={prefersReducedMotion
					? { duration: 0 }
					: { type: 'spring', stiffness: 250, damping: 22, delay: 1.6 }
				}
			>
				<div className="mb-2 flex items-center gap-2.5">
					<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
						<Image src={CAMIL_IMG} alt="AI Coach" fill className="object-cover" sizes="32px" />
					</div>
					<div>
						<span className="text-[11px] font-medium text-cc-accent">AI Coach Says..</span>
						<div className="text-[9px] text-cc-text-secondary">Personalized feedback</div>
					</div>
				</div>
				<p className="text-[12px] leading-relaxed text-cc-text-secondary">
					You addressed risks clearly and secured next steps but could probe more on their team&rsquo;s concerns.
				</p>
			</motion.div>

			{/* Bottom: Stat cards + Talk/Listen bar.
			 *  WPM slides from left at t=+2.2s. Confident slides from right at t=+2.4s.
			 *  Talk/Listen fades in at t=+3.0s; bars fill sequentially (Talk then Listen). */}
			<div className="flex flex-col gap-2.5">
				<div className="flex gap-2">
					<motion.div
						className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-cc-surface/60 px-3 py-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
						initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
						animate={{ opacity: 1, x: 0 }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { type: 'spring', stiffness: 300, damping: 22, delay: 2.2 }
						}
					>
						<Timer size={16} weight="duotone" className="shrink-0 text-cc-score-red/85" />
						<div>
							<div className="font-[family-name:var(--font-mono)] text-[14px] font-medium text-white">
								<NumberFlow value={prefersReducedMotion ? SCORE_WPM : (subState === 'reveal' ? 0 : SCORE_WPM)} />
								<span className="ml-0.5 text-[10px] text-cc-text-secondary">wpm</span>
							</div>
							<div className="text-[8px] text-cc-text-secondary">Too fast during...</div>
						</div>
					</motion.div>
					<motion.div
						className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-cc-surface/60 px-3 py-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
						initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
						animate={{ opacity: 1, x: 0 }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { type: 'spring', stiffness: 300, damping: 22, delay: 2.4 }
						}
					>
						<Users size={16} weight="duotone" className="shrink-0 text-blue-400/90" />
						<div>
							<div className="text-[14px] font-medium text-white">Confident</div>
							<div className="text-[8px] text-cc-text-secondary">Directly answered</div>
						</div>
					</motion.div>
				</div>

				<motion.div
					className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-cc-surface/60 px-3 py-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
					initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: 3.0 }}
				>
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-medium tabular-nums text-blue-400">
						<NumberFlow value={talkPct} suffix="% Talk" />
					</span>
					<div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
						<motion.div
							className="h-full bg-blue-400"
							initial={{ width: '0%' }}
							animate={{ width: `${talkPct}%` }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
						/>
						<motion.div
							className="h-full bg-cc-accent"
							initial={{ width: '0%' }}
							animate={{ width: `${listenPct}%` }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }}
						/>
					</div>
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-medium tabular-nums text-cc-accent">
						<NumberFlow value={listenPct} suffix="%" />
					</span>
				</motion.div>
			</div>
		</motion.div>
	)
}

/* ─── Phone Frame ────────────────────────────────────────── */

const STATE_LABELS = ['Setup', 'Roleplay', 'Live Call', 'Review'] as const

function PhoneFrame({ activeIndex, children }: { activeIndex: number, children: React.ReactNode }) {
	return (
		<div className="relative z-10 w-[320px]">
			{/* Phone shell with realistic styling */}
			<div className="rounded-[3rem] border border-white/10 bg-gradient-to-b from-[#2a2d36] to-[#1a1d26] p-[6px] shadow-[0_0_60px_rgba(16,185,129,0.1),0_20px_40px_rgba(0,0,0,0.4)]">
				{/* Inner bezel */}
				<div className="rounded-[2.65rem] border border-white/5 bg-cc-foundation">
					{/* Dynamic Island */}
					<div className="flex justify-center pt-2.5">
						<div className="h-[22px] w-[100px] rounded-full bg-black" />
					</div>

					{/* Screen content area */}
					<div className="relative" style={{ aspectRatio: '9 / 17.5' }}>
						{/* App header bar */}
						<div className="flex items-center justify-between px-5 py-1.5">
							<img src={CC_LOGO} alt="CloserCoach" className="h-6 w-auto" />
							<div className="flex items-center gap-1">
								<div className="h-1.5 w-1.5 rounded-full bg-cc-accent" />
								<span className="text-[8px] text-cc-text-muted">{STATE_LABELS[activeIndex]}</span>
							</div>
						</div>

						{/* State content */}
						{children}

						{/* Dot indicator */}
						<div className="absolute bottom-1 left-0 right-0">
							<DotIndicator activeIndex={activeIndex} />
						</div>
					</div>

					{/* Home indicator */}
					<div className="flex justify-center pb-2 pt-1">
						<div className="h-1 w-28 rounded-full bg-white/20" />
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Main Component ─────────────────────────────────────── */

/* Directional state variants per W4 transition map.
 * Each state carries its own enter/exit vocabulary matching the narrative beat
 * for the transition it participates in:
 *   0 TRAIN   : cinematic enter (scale 1.05 → 1) + exit-up (setup fades upward)
 *   1 PRACTICE: enter-from-below (call scene materializes) + exit-left (roleplay recedes)
 *   2 RECORD  : enter-from-right (live call from future) + contract-to-center
 *   3 SCORE   : enter-from-center (verdict expands) + exit-up-fade (score rises out)
 * Spring stiffness 250 damping 22 per motion-spec §1.2. Reduced-motion collapses
 * all variants to an instant cut via the transition guard at render time. */
const stateVariants = {
	0: {
		initial: { opacity: 0, scale: 1.05, x: 0, y: 0 },
		animate: { opacity: 1, scale: 1, x: 0, y: 0 },
		exit: { opacity: 0, y: -24, scale: 1, x: 0 },
	},
	1: {
		initial: { opacity: 0, y: 24, scale: 1, x: 0 },
		animate: { opacity: 1, y: 0, x: 0, scale: 1 },
		exit: { opacity: 0, x: -24, scale: 1, y: 0 },
	},
	2: {
		initial: { opacity: 0, x: 24, scale: 1, y: 0 },
		animate: { opacity: 1, x: 0, y: 0, scale: 1 },
		exit: { opacity: 0, scale: 0.92, x: 0, y: 0 },
	},
	3: {
		initial: { opacity: 0, scale: 0.92, x: 0, y: 0 },
		animate: { opacity: 1, scale: 1, x: 0, y: 0 },
		exit: { opacity: 0, y: -16, scale: 1, x: 0 },
	},
} as const

function directionFor(prev: number, curr: number): TransitionDirection {
	if (prev === 0 && curr === 1) return 'down'
	if (prev === 1 && curr === 2) return 'right'
	if (prev === 2 && curr === 3) return 'center'
	return 'loop'
}

export default function HeroPhoneV2() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const [activeIndex, setActiveIndex] = useState(0)
	const [direction, setDirection] = useState<TransitionDirection>('down')

	useEffect(() => {
		if (prefersReducedMotion) return

		const interval = setInterval(() => {
			setActiveIndex((prev) => {
				const next = (prev + 1) % 4
				setDirection(directionFor(prev, next))
				return next
			})
		}, CYCLE_MS)

		return () => clearInterval(interval)
	}, [prefersReducedMotion])

	const variants = stateVariants[activeIndex as 0 | 1 | 2 | 3]
	const stateTransition = prefersReducedMotion
		? { duration: 0 }
		: { type: 'spring' as const, stiffness: 250, damping: 22 }

	return (
		<LayoutGroup>
			<div className="relative flex items-center justify-center px-40">
				{/* Emerald glow */}
				<div className="pointer-events-none absolute inset-[-40%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
				<div className="pointer-events-none absolute inset-[-15%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 45%)' }} />
				<div className="pointer-events-none absolute inset-[-5%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 25%)' }} />

				{/* Floating badges */}
				<FloatingBadges activeIndex={activeIndex} direction={direction} prefersReducedMotion={prefersReducedMotion} />

				{/* Phone */}
				<PhoneFrame activeIndex={activeIndex}>
					{/* popLayout lets Motion pop the exiting state out of layout so the
					 * entering state takes its place, preserving layoutId continuity on
					 * prospect-avatar and prospect-name across 0→1→2 while still allowing
					 * overlapping exit/enter for directional motion (no blank-gap swap). */}
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.div
							key={activeIndex}
							className="absolute inset-x-0 top-8 bottom-8"
							initial={variants.initial}
							animate={variants.animate}
							exit={variants.exit}
							transition={stateTransition}
						>
							{activeIndex === 0 && <TrainState />}
							{activeIndex === 1 && <PracticeState />}
							{activeIndex === 2 && <RecordState />}
							{activeIndex === 3 && <ScoreState />}
						</motion.div>
					</AnimatePresence>
				</PhoneFrame>
			</div>
		</LayoutGroup>
	)
}
