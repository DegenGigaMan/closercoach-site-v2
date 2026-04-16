/** @fileoverview Hero Phone V2 with Family Values transition model.
 * One mounted component. Shared elements (Sarah Chen avatar/name) morph
 * via layoutId across states. State content enters/exits directionally.
 * No crossfade teleportation. Elements fly, they don't teleport.
 *
 * Architecture: LayoutGroup wraps the phone. Sarah Chen's avatar and name
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
	CheckCircle,
	Trophy,
	Microphone,
	PhoneDisconnect,
	Phone as PhoneIcon,
	Users,
	Timer,
} from '@phosphor-icons/react'
import NumberFlow from '@number-flow/react'

const CYCLE_MS = 5500
const SARAH_IMG = '/images/prospects/sarah-chen.png'

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
						backgroundColor: i === activeIndex ? '#10B981' : 'rgba(255,255,255,0.12)',
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
			className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 ${isPositive ? 'border-cc-accent/20 bg-cc-accent/8' : 'border-cc-score-red/20 bg-cc-score-red/8'}`}
			initial={{ opacity: 0, x: 20, scale: 0.9 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20, delay }}
		>
			{isPositive
				? <CheckCircle size={12} weight="fill" className="shrink-0 text-cc-accent" />
				: <Warning size={12} weight="fill" className="shrink-0 text-cc-score-red" />
			}
			<span className={`flex-1 text-[10px] ${isPositive ? 'text-cc-accent' : 'text-cc-score-red'}`}>{text}</span>
			{timestamp && (
				<span className={`font-[family-name:var(--font-mono)] text-[8px] ${isPositive ? 'text-cc-accent/50' : 'text-cc-score-red/50'}`}>
					{timestamp}
				</span>
			)}
		</motion.div>
	)
}

/* ─── State 1: TRAIN ─────────────────────────────────────── */

function TrainState() {
	return (
		<div className="flex h-full flex-col justify-between px-4 pb-3 pt-1">
			{/* Top: URL Input */}
			<div>
				<div className="rounded-lg border border-cc-surface-border bg-cc-surface-elevated px-3 py-2.5">
					<div className="mb-1.5 text-[10px] font-medium text-cc-text-muted">What do you sell?</div>
					<div className="flex items-center gap-2">
						<Globe size={12} className="shrink-0 text-cc-accent" weight="bold" />
						<div className="flex-1 font-[family-name:var(--font-mono)] text-[11px] text-cc-text-secondary">
							<TypeAnimation
								sequence={['', 400, 'yoursite.com/product', 1000]}
								speed={60}
								cursor={true}
								repeat={0}
							/>
						</div>
						<span className="rounded bg-cc-accent/20 px-1.5 py-0.5 text-[9px] font-medium text-cc-accent">Paste</span>
					</div>
				</div>
			</div>

			{/* Middle: AI Processing */}
			<div className="flex flex-col items-center gap-3 py-4">
				<motion.div
					className="text-[10px] text-cc-accent"
					animate={{ opacity: [0.4, 1, 0.4] }}
					transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
				>
					Learning your business...
				</motion.div>

				<div className="h-1.5 w-full overflow-hidden rounded-full bg-cc-surface-elevated">
					<motion.div
						className="h-full rounded-full bg-cc-accent"
						initial={{ width: '0%' }}
						animate={{ width: '90%' }}
						transition={{ duration: 2, ease: 'easeOut' }}
					/>
				</div>

				<div className="flex w-full flex-col gap-1.5 pt-1">
					{['Understanding call type', 'Understanding your product', 'Building a challenging customer', 'Baking in objectives'].map((item, i) => (
						<motion.div
							key={item}
							className="flex items-center gap-2"
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.25, delay: 0.3 + i * 0.2 }}
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.15, delay: 0.5 + i * 0.2 }}
							>
								<Check size={12} weight="bold" className="text-cc-accent" />
							</motion.div>
							<span className="text-[10px] text-cc-text-secondary">{item}</span>
						</motion.div>
					))}
				</div>
			</div>

			{/* Bottom: Prospect Card (hero of this state) */}
			<div>
				<motion.div
					className="rounded-xl border border-cc-accent/20 bg-cc-accent/5 p-3"
					initial={{ opacity: 0, y: 16, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.5, delay: 1.4, ease: 'easeOut' }}
				>
					<div className="mb-2 flex items-center gap-2.5">
						<motion.div layoutId="sarah-avatar" className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
							<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="36px" />
						</motion.div>
						<div>
							<motion.div layoutId="sarah-name" className="text-[11px] font-medium text-white">Sarah Chen</motion.div>
							<motion.div layoutId="sarah-role" className="text-[9px] text-cc-text-muted">VP Operations, GreenLeaf</motion.div>
						</div>
					</div>
					<div className="mb-2 text-[10px] leading-relaxed text-cc-text-secondary">
						&ldquo;How can I justify spending this much right now?&rdquo;
					</div>
					<div className="flex gap-1.5">
						<span className="rounded bg-cc-accent/15 px-1.5 py-0.5 text-[8px] text-cc-accent">AI Clone Ready</span>
						<span className="rounded bg-cc-amber/15 px-1.5 py-0.5 text-[8px] text-cc-amber">Hard</span>
					</div>
				</motion.div>

				<motion.div
					className="mt-2 flex items-center justify-center rounded-lg bg-cc-accent py-2.5"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.8, duration: 0.3 }}
				>
					<span className="text-[11px] font-medium text-white">Continue →</span>
				</motion.div>
			</div>
		</div>
	)
}

/* ─── State 2: PRACTICE ──────────────────────────────────── */

function PracticeState() {
	return (
		<div className="flex h-full flex-col justify-between px-3 pb-3 pt-1">
			{/* Top: Call Header */}
			<div className="flex items-center gap-2 rounded-lg bg-cc-surface-elevated/60 px-3 py-2">
				<motion.div layoutId="sarah-avatar" className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
					<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="24px" />
				</motion.div>
				<div className="flex items-center gap-1">
					<span className="rounded bg-blue-500/20 px-1 py-0.5 text-[7px] font-bold text-blue-400">AI</span>
					<motion.div layoutId="sarah-name" className="text-[10px] font-medium text-white">Sarah Chen</motion.div>
				</div>
				<span className="ml-auto font-[family-name:var(--font-mono)] text-[9px] text-cc-text-muted">00:33 / 10:00</span>
			</div>

			{/* Middle: Conversation */}
			<div className="flex flex-1 flex-col gap-1.5 overflow-hidden py-2">
				{/* AI message */}
				<motion.div
					className="mr-auto max-w-[85%] rounded-xl rounded-bl-sm border-l-2 border-cc-accent/30 bg-cc-surface-elevated px-2.5 py-2"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 0.15 }}
				>
					<p className="text-[10px] leading-relaxed text-cc-text-secondary">We already have a vendor we&rsquo;re comfortable with.</p>
				</motion.div>

				{/* User message + chip */}
				<motion.div
					className="ml-auto max-w-[85%]"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 0.5 }}
				>
					<div className="rounded-xl rounded-br-sm bg-cc-accent/25 px-2.5 py-2">
						<p className="text-[10px] leading-relaxed text-white">I hear you. Switching feels risky. What would need to be true for you to consider it?</p>
					</div>
					<motion.div
						className="mt-1 flex items-center gap-1"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.9 }}
					>
						<CheckCircle size={10} weight="fill" className="text-cc-accent" />
						<span className="text-[8px] font-medium text-cc-accent">Strong objection pivot</span>
					</motion.div>
				</motion.div>

				{/* AI follow-up */}
				<motion.div
					className="mr-auto max-w-[85%] rounded-xl rounded-bl-sm border-l-2 border-cc-accent/30 bg-cc-surface-elevated px-2.5 py-2"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 1.1 }}
				>
					<p className="text-[10px] leading-relaxed text-cc-text-secondary">Honestly? If you could show me real ROI numbers...</p>
				</motion.div>

				{/* User miss */}
				<motion.div
					className="ml-auto max-w-[85%]"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.25, delay: 1.5 }}
				>
					<div className="rounded-xl rounded-br-sm bg-cc-accent/25 px-2.5 py-2">
						<p className="text-[10px] leading-relaxed text-white">Let me send over a case study after.</p>
					</div>
					<motion.div
						className="mt-1 flex items-center gap-1"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 1.9 }}
					>
						<Warning size={10} weight="fill" className="text-cc-score-red" />
						<span className="text-[8px] font-medium text-cc-score-red">Missed The Mark</span>
					</motion.div>
				</motion.div>
			</div>

			{/* Bottom: Checkpoint + Mic Bar */}
			<div>
				<motion.div
					className="mb-2 flex items-center justify-between px-1"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
				>
					<div className="flex items-center gap-1.5">
						{[true, true, false].map((done, i) => (
							<div key={i} className={`h-2 w-2 rounded-full border ${done ? 'border-cc-accent bg-cc-accent' : 'border-cc-text-muted/40'}`} />
						))}
						<span className="ml-1 text-[8px] text-cc-text-muted">Checkpoints</span>
					</div>
					<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-amber">2/3</span>
				</motion.div>

				<motion.div
					className="flex items-center gap-2 rounded-xl bg-cc-surface-elevated px-3 py-2.5"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
				>
					<Microphone size={16} weight="fill" className="shrink-0 text-cc-accent" />
					<span className="text-[10px] text-cc-text-muted">Record your response</span>
					<div className="ml-auto flex-1">
						<Waveform bars={20} height={16} mini />
					</div>
				</motion.div>
			</div>
		</div>
	)
}

/* ─── State 3: RECORD ────────────────────────────────────── */

function RecordState() {
	return (
		<div className="flex h-full flex-col justify-between px-4 pb-3 pt-1">
			{/* Top: Compact header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<motion.div
						className="h-2 w-2 rounded-full bg-cc-score-red"
						animate={{ opacity: [1, 0.3, 1] }}
						transition={{ duration: 1.2, repeat: Infinity }}
					/>
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-cc-score-red">REC</span>
					<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-text-muted">02:47</span>
				</div>
				<div className="flex items-center gap-1.5">
					<motion.div layoutId="sarah-avatar" className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
						<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="20px" />
					</motion.div>
					<motion.div layoutId="sarah-name" className="text-[9px] text-cc-text-secondary">Sarah Chen</motion.div>
				</div>
			</div>

			{/* Middle: LARGE Waveform (hero of this state) */}
			<div className="flex flex-1 flex-col items-center justify-center py-4">
				<Waveform bars={56} height={80} />
			</div>

			{/* Bottom: Annotations + Transcript + End Call */}
			<div className="flex flex-col gap-2">
				<CoachingChip type="negative" text="You let the prospect defer" timestamp="01:47" delay={0.8} />
				<CoachingChip type="positive" text="Great discovery question" timestamp="02:13" delay={1.5} />

				<motion.div
					className="mt-1 px-2 text-[9px] leading-relaxed text-cc-text-muted/30"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.0 }}
				>
					&ldquo;...it needs to actually drive revenue. Not just look nicer. That&rsquo;s what matters to us...&rdquo;
				</motion.div>

				<motion.div
					className="flex items-center justify-center gap-2 rounded-lg bg-cc-score-red/15 py-2"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
				>
					<PhoneDisconnect size={14} weight="fill" className="text-cc-score-red" />
					<span className="text-[10px] font-medium text-cc-score-red">End Call</span>
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
		<div className="flex h-full flex-col justify-between px-4 pb-3 pt-1">
			{/* Top: Grade Ring */}
			<div className="flex flex-col items-center pt-2">
				<motion.div
					className="mb-2 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-3 py-1"
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.3 }}
				>
					<span className="flex items-center gap-1 text-[9px] font-medium text-cc-accent">
						<div className="h-1.5 w-1.5 rounded-full bg-cc-accent" />
						Top 15%
					</span>
				</motion.div>

				<div className="relative flex items-center justify-center">
					<svg width="130" height="130" viewBox="0 0 130 130">
						<circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
						<motion.circle
							cx="65" cy="65" r="54"
							fill="none"
							stroke="#F59E0B"
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={`${2 * Math.PI * 54}`}
							strokeDashoffset={`${2 * Math.PI * 54}`}
							style={{ transformOrigin: '65px 65px', transform: 'rotate(-90deg)' }}
							animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - animatedValue / 100) }}
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
				className="rounded-xl border border-cc-accent/20 bg-cc-accent/8 p-3"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 1.2 }}
			>
				<div className="mb-2 flex items-center gap-2">
					<div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
						<Image src={SARAH_IMG} alt="AI Coach" fill className="object-cover" sizes="28px" />
					</div>
					<div>
						<span className="text-[9px] font-medium text-cc-accent">AI Coach Says..</span>
						<div className="text-[7px] text-cc-accent/60">Personalized feedback</div>
					</div>
				</div>
				<p className="text-[10px] leading-relaxed text-cc-text-secondary">
					Andy, you addressed risks clearly and secured next steps but could probe more on their team&rsquo;s concerns.
				</p>
			</motion.div>

			{/* Bottom: Stats + Talk/Listen */}
			<motion.div
				className="flex flex-col gap-2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.6 }}
			>
				<div className="flex gap-2">
					<div className="flex flex-1 items-center gap-2 rounded-lg bg-cc-surface-elevated px-2.5 py-2">
						<Timer size={14} weight="duotone" className="shrink-0 text-cc-score-red/70" />
						<div>
							<div className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-white">
								<NumberFlow value={211} />
								<span className="ml-0.5 text-[9px] text-cc-text-muted">wpm</span>
							</div>
							<div className="text-[7px] text-cc-text-muted">Too fast during...</div>
						</div>
					</div>
					<div className="flex flex-1 items-center gap-2 rounded-lg bg-cc-surface-elevated px-2.5 py-2">
						<Users size={14} weight="duotone" className="shrink-0 text-blue-400/70" />
						<div>
							<div className="text-[13px] font-medium text-white">Confident</div>
							<div className="text-[7px] text-cc-text-muted">Directly answered</div>
						</div>
					</div>
				</div>

				{/* Talk/Listen bar */}
				<div className="flex items-center gap-2 rounded-lg bg-cc-surface-elevated px-3 py-2">
					<span className="text-[9px] text-blue-400">64% Talk</span>
					<div className="flex h-2 flex-1 overflow-hidden rounded-full">
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
					<span className="text-[9px] text-cc-accent">36%</span>
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
							<span className="font-[family-name:var(--font-mono)] text-[8px] tracking-widest text-cc-text-muted">CLOSERCOACH</span>
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
							transition={{ duration: 0.35 }}
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
