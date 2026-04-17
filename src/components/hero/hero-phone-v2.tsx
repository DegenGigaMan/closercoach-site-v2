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

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
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

function FloatingBadges({ activeIndex }: { activeIndex: number }) {
	return (
		<AnimatePresence mode="wait">
			<motion.div key={`badges-${activeIndex}`} className="pointer-events-none">
				{BADGE_SETS[activeIndex].map((badge) => (
					<motion.div
						key={badge.text}
						className={`absolute hidden items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-medium backdrop-blur-sm md:flex ${badgeVariantStyles[badge.variant]} ${badge.position === 'right' ? 'right-[-140px] top-[25%]' : 'left-[-140px] bottom-[25%]'}`}
						initial={{ opacity: 0, scale: 0.85, x: badge.position === 'right' ? 12 : -12 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0.85, x: badge.position === 'right' ? 12 : -12 }}
						transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
					>
						{badge.pulse && (
							<motion.div
								className="h-1.5 w-1.5 rounded-full bg-cc-score-red"
								animate={{ opacity: [1, 0.3, 1] }}
								transition={{ duration: 1, repeat: Infinity }}
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

function Waveform({ bars = 48, height = 80, mini = false }: { bars?: number, height?: number, mini?: boolean }) {
	const barData = useMemo(() =>
		Array.from({ length: bars }).map((_, i) => {
			const base = Math.sin(i * 0.3) * 0.5 + 0.5
			return { base, phase: i * 0.15, speed: 1 + Math.random() * 0.6 }
		}), [bars])

	return (
		<div className={`flex w-full items-center justify-center ${mini ? 'gap-[1px]' : 'gap-px'}`} style={{ height }}>
			{barData.map((bar, i) => (
				<motion.div
					key={i}
					className={`rounded-full bg-cc-accent ${mini ? 'w-[2px]' : 'w-[3px]'}`}
					animate={{
						height: [`${bar.base * height * 0.7}px`, `${bar.base * height * 0.25}px`, `${bar.base * height * 0.7}px`],
						opacity: [0.5, 0.9, 0.5],
					}}
					transition={{
						duration: bar.speed,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: bar.phase * 0.05,
					}}
				/>
			))}
		</div>
	)
}

/* ─── Coaching Chip ──────────────────────────────────────── */

function CoachingChip({ type, text, timestamp, delay = 0 }: {
	type: 'positive' | 'negative'
	text: string
	timestamp?: string
	delay?: number
}) {
	const isPositive = type === 'positive'
	return (
		<motion.div
			className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 ${isPositive ? 'border-cc-accent/20 bg-cc-accent/8' : 'border-cc-score-red/20 bg-cc-score-red/8'}`}
			initial={{ opacity: 0, x: 20, scale: 0.9 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20, delay }}
		>
			{isPositive
				? <CheckCircle size={14} weight="fill" className="shrink-0 text-cc-accent" />
				: <Warning size={14} weight="fill" className="shrink-0 text-cc-score-red" />
			}
			<span className={`flex-1 text-[11px] ${isPositive ? 'text-cc-accent' : 'text-cc-score-red'}`}>{text}</span>
			{timestamp && (
				<span className={`font-[family-name:var(--font-mono)] text-[9px] ${isPositive ? 'text-cc-accent/50' : 'text-cc-score-red/50'}`}>
					{timestamp}
				</span>
			)}
		</motion.div>
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

function PracticeState() {
	return (
		<div className="flex h-full flex-col justify-between px-4 pb-4 pt-1">
			{/* Top: Call Header */}
			<div className="flex items-center gap-2.5 rounded-xl bg-cc-surface-elevated/60 px-3 py-2.5">
				<motion.div layoutId="prospect-avatar" className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
					<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover" sizes="28px" />
				</motion.div>
				<div className="flex items-center gap-1.5">
					<span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[8px] font-bold text-blue-400">AI</span>
					<motion.div layoutId="prospect-name" className="text-[12px] font-medium text-white">Camil Reese</motion.div>
				</div>
				<span className="ml-auto font-[family-name:var(--font-mono)] text-[10px] text-cc-text-muted">00:33 / 10:00</span>
			</div>

			{/* Middle: Conversation */}
			<div className="flex flex-1 flex-col gap-2 overflow-hidden py-3">
				{/* AI message */}
				<motion.div
					className="mr-auto max-w-[88%] rounded-xl rounded-bl-sm border-l-2 border-cc-accent/30 bg-cc-surface-elevated px-3 py-2.5"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 0.15 }}
				>
					<p className="text-[12px] leading-relaxed text-cc-text-secondary">We already have a vendor we&rsquo;re comfortable with.</p>
				</motion.div>

				{/* User message + chip */}
				<motion.div
					className="ml-auto max-w-[88%]"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 0.5 }}
				>
					<div className="rounded-xl rounded-br-sm bg-cc-accent/20 px-3 py-2.5">
						<p className="text-[12px] leading-relaxed text-white">I hear you. Switching feels risky. What would need to be true?</p>
					</div>
					<motion.div
						className="mt-1.5 flex items-center gap-1"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.9 }}
					>
						<CheckCircle size={12} weight="fill" className="text-cc-accent" />
						<span className="text-[10px] font-medium text-cc-accent">Strong objection pivot</span>
					</motion.div>
				</motion.div>

				{/* AI follow-up */}
				<motion.div
					className="mr-auto max-w-[88%] rounded-xl rounded-bl-sm border-l-2 border-cc-accent/30 bg-cc-surface-elevated px-3 py-2.5"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 1.2 }}
				>
					<p className="text-[12px] leading-relaxed text-cc-text-secondary">If you could show me real ROI numbers...</p>
				</motion.div>

				{/* User miss */}
				<motion.div
					className="ml-auto max-w-[88%]"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 1.6 }}
				>
					<div className="rounded-xl rounded-br-sm bg-cc-accent/20 px-3 py-2.5">
						<p className="text-[12px] leading-relaxed text-white">Let me send over a case study after.</p>
					</div>
					<motion.div
						className="mt-1.5 flex items-center gap-1"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 2.0 }}
					>
						<Warning size={12} weight="fill" className="text-cc-score-red" />
						<span className="text-[10px] font-medium text-cc-score-red">Missed The Mark</span>
					</motion.div>
				</motion.div>
			</div>

			{/* Bottom: Checkpoint + Mic Bar */}
			<div>
				<motion.div
					className="mb-2.5 flex items-center justify-between px-1"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
				>
					<div className="flex items-center gap-2">
						{[true, true, false].map((done, i) => (
							<div key={i} className={`h-2.5 w-2.5 rounded-full border ${done ? 'border-cc-accent bg-cc-accent' : 'border-cc-text-muted/40'}`} />
						))}
						<span className="ml-1 text-[10px] text-cc-text-muted">Checkpoints</span>
					</div>
					<span className="font-[family-name:var(--font-mono)] text-[11px] font-medium text-cc-amber">2/3</span>
				</motion.div>

				<motion.div
					className="flex items-center gap-2.5 rounded-xl bg-cc-surface-elevated px-4 py-3"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
				>
					<Microphone size={18} weight="fill" className="shrink-0 text-cc-accent" />
					<span className="text-[11px] text-cc-text-muted">Record your response</span>
					<div className="ml-auto flex-1">
						<Waveform bars={20} height={18} mini />
					</div>
				</motion.div>
			</div>
		</div>
	)
}

/* ─── State 3: RECORD ────────────────────────────────────── */

function RecordState() {
	return (
		<div className="flex h-full flex-col justify-between px-4 pb-4 pt-1">
			{/* Top: Compact header */}
			<div className="flex items-center justify-between py-1">
				<div className="flex items-center gap-2">
					<motion.div
						className="h-2.5 w-2.5 rounded-full bg-cc-score-red"
						animate={{ opacity: [1, 0.3, 1] }}
						transition={{ duration: 1.2, repeat: Infinity }}
					/>
					<span className="font-[family-name:var(--font-mono)] text-[11px] font-medium text-cc-score-red">REC</span>
					<span className="font-[family-name:var(--font-mono)] text-[11px] text-cc-text-muted">02:47</span>
				</div>
				<div className="flex items-center gap-2">
					<motion.div layoutId="prospect-avatar" className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
						<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover" sizes="24px" />
					</motion.div>
					<motion.div layoutId="prospect-name" className="text-[11px] text-cc-text-secondary">Camil Reese</motion.div>
				</div>
			</div>

			{/* Middle: LARGE Waveform (hero of this state) */}
			<div className="flex flex-1 flex-col items-center justify-center py-3">
				<Waveform bars={56} height={80} />
			</div>

			{/* Bottom: Annotations + Transcript + End Call */}
			<div className="flex flex-col gap-2.5">
				<CoachingChip type="negative" text="You let the prospect defer" timestamp="01:47" delay={0.8} />
				<CoachingChip type="positive" text="Great discovery question" timestamp="02:13" delay={1.5} />

				<motion.div
					className="px-1 text-[10px] leading-relaxed text-cc-text-muted/30"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.0 }}
				>
					&ldquo;...it needs to actually drive revenue. Not just look nicer...&rdquo;
				</motion.div>

				<motion.div
					className="flex items-center justify-center gap-2 rounded-xl bg-cc-score-red/12 py-2.5"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
				>
					<PhoneDisconnect size={16} weight="fill" className="text-cc-score-red" />
					<span className="text-[12px] font-medium text-cc-score-red">End Call</span>
				</motion.div>
			</div>
		</div>
	)
}

/* ─── State 4: SCORE ─────────────────────────────────────── */

function ScoreState() {
	const [animatedValue, setAnimatedValue] = useState(0)

	useEffect(() => {
		const timer = setTimeout(() => setAnimatedValue(80), 300)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="flex h-full flex-col justify-between px-4 pb-4 pt-1">
			{/* Top: Grade Ring */}
			<div className="flex flex-col items-center pt-1">
				<motion.div
					className="mb-1.5 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-3 py-1"
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.3 }}
				>
					<span className="flex items-center gap-1.5 text-[10px] font-medium text-cc-accent">
						<div className="h-1.5 w-1.5 rounded-full bg-cc-accent" />
						Top 15%
					</span>
				</motion.div>

				<div className="relative flex items-center justify-center">
					<svg width="120" height="120" viewBox="0 0 120 120">
						<circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
						<motion.circle
							cx="60" cy="60" r="50"
							fill="none"
							stroke="#F59E0B"
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={`${2 * Math.PI * 50}`}
							strokeDashoffset={`${2 * Math.PI * 50}`}
							style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
							animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - animatedValue / 100) }}
							transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
						/>
					</svg>
					<motion.div
						className="absolute flex flex-col items-center"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.8 }}
					>
						<span className="font-[family-name:var(--font-heading)] text-4xl text-cc-amber">B</span>
					</motion.div>
				</div>
			</div>

			{/* Middle: AI Coach Card */}
			<motion.div
				className="rounded-xl border border-cc-accent/20 bg-cc-accent/8 p-3.5"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 1.2 }}
			>
				<div className="mb-2 flex items-center gap-2.5">
					<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
						<Image src={CAMIL_IMG} alt="AI Coach" fill className="object-cover" sizes="32px" />
					</div>
					<div>
						<span className="text-[11px] font-medium text-cc-accent">AI Coach Says..</span>
						<div className="text-[9px] text-cc-accent/60">Personalized feedback</div>
					</div>
				</div>
				<p className="text-[12px] leading-relaxed text-cc-text-secondary">
					You addressed risks clearly and secured next steps but could probe more on their team&rsquo;s concerns.
				</p>
			</motion.div>

			{/* Bottom: Stats + Talk/Listen */}
			<motion.div
				className="flex flex-col gap-2.5"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.6 }}
			>
				<div className="flex gap-2">
					<div className="flex flex-1 items-center gap-2.5 rounded-xl bg-cc-surface-elevated px-3 py-2.5">
						<Timer size={16} weight="duotone" className="shrink-0 text-cc-score-red/70" />
						<div>
							<div className="font-[family-name:var(--font-mono)] text-[14px] font-medium text-white">
								<NumberFlow value={211} />
								<span className="ml-0.5 text-[10px] text-cc-text-muted">wpm</span>
							</div>
							<div className="text-[8px] text-cc-text-muted">Too fast during...</div>
						</div>
					</div>
					<div className="flex flex-1 items-center gap-2.5 rounded-xl bg-cc-surface-elevated px-3 py-2.5">
						<Users size={16} weight="duotone" className="shrink-0 text-blue-400/70" />
						<div>
							<div className="text-[14px] font-medium text-white">Confident</div>
							<div className="text-[8px] text-cc-text-muted">Directly answered</div>
						</div>
					</div>
				</div>

				{/* Talk/Listen bar */}
				<div className="flex items-center gap-2.5 rounded-xl bg-cc-surface-elevated px-3 py-2.5">
					<span className="text-[10px] font-medium text-blue-400">64% Talk</span>
					<div className="flex h-2.5 flex-1 overflow-hidden rounded-full">
						<motion.div
							className="h-full rounded-l-full bg-blue-400"
							initial={{ width: '0%' }}
							animate={{ width: '64%' }}
							transition={{ duration: 0.8, delay: 1.8 }}
						/>
						<motion.div
							className="h-full rounded-r-full bg-cc-accent"
							initial={{ width: '0%' }}
							animate={{ width: '36%' }}
							transition={{ duration: 0.8, delay: 1.8 }}
						/>
					</div>
					<span className="text-[10px] font-medium text-cc-accent">36%</span>
				</div>
			</motion.div>
		</div>
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

export default function HeroPhoneV2() {
	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) return

		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % 4)
		}, CYCLE_MS)

		return () => clearInterval(interval)
	}, [])

	return (
		<LayoutGroup>
			<div className="relative flex items-center justify-center px-40">
				{/* Emerald glow */}
				<div className="pointer-events-none absolute inset-[-40%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
				<div className="pointer-events-none absolute inset-[-15%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 45%)' }} />
				<div className="pointer-events-none absolute inset-[-5%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 25%)' }} />

				{/* Floating badges */}
				<FloatingBadges activeIndex={activeIndex} />

				{/* Phone */}
				<PhoneFrame activeIndex={activeIndex}>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeIndex}
							className="absolute inset-x-0 top-8 bottom-8"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
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
