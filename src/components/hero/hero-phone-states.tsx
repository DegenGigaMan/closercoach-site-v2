/** @fileoverview 4 distinct product UI compositions for the hero phone.
 * Each state tells a compressed story of one step in the CloserCoach flow.
 * TRAIN → PRACTICE → RECORD → SCORE
 *
 * These are marketing-abstracted compositions, not raw screenshots.
 * Each state should visually communicate its value before the user reads any text. */

'use client'

import { motion } from 'motion/react'
import {
	Globe,
	Check,
	Microphone,
	Phone as PhoneIcon,
	Circle,
	ChatCircle,
	Warning,
	CheckCircle,
	Trophy,
	UserCircle,
} from '@phosphor-icons/react'

const stagger = (i: number) => ({ delay: 0.15 + i * 0.12 })

/* ─── State 1: TRAIN ─────────────────────────────────────── */

const CHECKLIST_ITEMS = [
	'Understanding call type',
	'Understanding your product',
	'Building a challenging customer',
	'Baking in objectives',
]

export function HeroStateTraining() {
	return (
		<div className="flex flex-col gap-3 px-4 pb-3 pt-1">
			{/* URL Input */}
			<div className="rounded-lg border border-cc-surface-border bg-cc-surface-elevated px-3 py-2.5">
				<div className="mb-1 text-[10px] font-medium text-cc-text-muted">What do you sell?</div>
				<div className="flex items-center gap-2">
					<Globe size={12} className="shrink-0 text-cc-accent" weight="bold" />
					<span className="flex-1 truncate font-[family-name:var(--font-mono)] text-[11px] text-cc-text-secondary">yoursite.com/product</span>
					<span className="rounded bg-cc-accent/20 px-1.5 py-0.5 text-[9px] font-medium text-cc-accent">Paste</span>
				</div>
			</div>

			{/* AI Learning */}
			<div className="flex flex-col items-center gap-2 py-2">
				<motion.div
					className="text-[10px] text-cc-accent"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.4, 1, 0.4] }}
					transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
				>
					Learning your business...
				</motion.div>

				{/* Progress bar */}
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-cc-surface-elevated">
					<motion.div
						className="h-full rounded-full bg-cc-accent"
						initial={{ width: '0%' }}
						animate={{ width: '85%' }}
						transition={{ duration: 2.5, ease: 'easeOut' }}
					/>
				</div>
			</div>

			{/* Checklist */}
			<div className="flex flex-col gap-1.5">
				{CHECKLIST_ITEMS.map((item, i) => (
					<motion.div
						key={item}
						className="flex items-center gap-2"
						initial={{ opacity: 0, x: -8 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, ...stagger(i) }}
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.2, delay: 0.4 + i * 0.3 }}
						>
							<Check size={12} weight="bold" className="text-cc-accent" />
						</motion.div>
						<span className="text-[10px] text-cc-text-secondary">{item}</span>
					</motion.div>
				))}
			</div>

			{/* Prospect Card Preview */}
			<motion.div
				className="mt-1 rounded-lg border border-cc-accent/20 bg-cc-accent/5 p-2.5"
				initial={{ opacity: 0, y: 12, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.5, delay: 1.6, ease: 'easeOut' }}
			>
				<div className="mb-1.5 flex items-center gap-2">
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-cc-accent/20">
						<UserCircle size={16} className="text-cc-accent" weight="fill" />
					</div>
					<div>
						<div className="text-[10px] font-medium text-white">Sarah Chen</div>
						<div className="text-[8px] text-cc-text-muted">VP Operations, GreenLeaf</div>
					</div>
				</div>
				<div className="flex gap-1.5">
					<span className="rounded bg-cc-accent/15 px-1.5 py-0.5 text-[8px] text-cc-accent">AI Clone Ready</span>
					<span className="rounded bg-cc-amber/15 px-1.5 py-0.5 text-[8px] text-cc-amber">Hard</span>
				</div>
			</motion.div>
		</div>
	)
}

/* ─── State 2: PRACTICE ───────────────────────────────────── */

export function HeroStatePractice() {
	return (
		<div className="flex flex-col gap-2 px-3 pb-3 pt-1">
			{/* Call header */}
			<div className="flex items-center justify-center gap-2 rounded-lg bg-cc-surface-elevated/60 px-3 py-1.5">
				<div className="flex h-5 w-5 items-center justify-center rounded-full bg-cc-accent/20">
					<UserCircle size={14} className="text-cc-accent" weight="fill" />
				</div>
				<div className="flex items-center gap-1">
					<span className="rounded bg-blue-500/20 px-1 py-0.5 text-[7px] font-bold text-blue-400">AI</span>
					<span className="text-[10px] text-white">Sarah Chen</span>
				</div>
				<span className="ml-auto font-[family-name:var(--font-mono)] text-[9px] text-cc-text-muted">00:33 / 10:00</span>
			</div>

			{/* Conversation */}
			<div className="flex flex-col gap-1.5">
				{/* AI prospect message */}
				<motion.div
					className="mr-auto max-w-[85%] rounded-xl rounded-bl-sm bg-cc-surface-elevated px-2.5 py-2"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
				>
					<div className="text-[10px] leading-relaxed text-cc-text-secondary">
						We already have a vendor we're comfortable with.
					</div>
				</motion.div>

				{/* User message with coaching chip */}
				<motion.div
					className="ml-auto max-w-[85%]"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.6 }}
				>
					<div className="rounded-xl rounded-br-sm bg-cc-accent/20 px-2.5 py-2">
						<div className="text-[10px] leading-relaxed text-white">
							I hear you. Switching feels risky. What would need to be true for you to consider it?
						</div>
					</div>
					{/* Coaching chip */}
					<motion.div
						className="mt-1 flex items-center gap-1"
						initial={{ opacity: 0, scale: 0.8, y: -4 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 1.0 }}
					>
						<CheckCircle size={10} weight="fill" className="text-cc-accent" />
						<span className="text-[8px] font-medium text-cc-accent">Strong objection pivot</span>
					</motion.div>
				</motion.div>

				{/* AI follow-up */}
				<motion.div
					className="mr-auto max-w-[85%] rounded-xl rounded-bl-sm bg-cc-surface-elevated px-2.5 py-2"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 1.4 }}
				>
					<div className="text-[10px] leading-relaxed text-cc-text-secondary">
						Honestly? If you could show me real ROI numbers...
					</div>
				</motion.div>

				{/* User message with miss */}
				<motion.div
					className="ml-auto max-w-[85%]"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 1.8 }}
				>
					<div className="rounded-xl rounded-br-sm bg-cc-accent/20 px-2.5 py-2">
						<div className="text-[10px] leading-relaxed text-white">
							Let me send over a case study after.
						</div>
					</div>
					<motion.div
						className="mt-1 flex items-center gap-1"
						initial={{ opacity: 0, scale: 0.8, y: -4 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 2.2 }}
					>
						<Warning size={10} weight="fill" className="text-cc-score-red" />
						<span className="text-[8px] font-medium text-cc-score-red">Missed The Mark</span>
					</motion.div>
				</motion.div>
			</div>

			{/* Checkpoint counter */}
			<motion.div
				className="flex items-center justify-between rounded-lg bg-cc-surface-elevated/40 px-3 py-1.5"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
			>
				<span className="text-[9px] text-cc-text-muted">Checkpoint status</span>
				<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-amber">2/3</span>
			</motion.div>
		</div>
	)
}

/* ─── State 3: RECORD ─────────────────────────────────────── */

export function HeroStateRecord() {
	return (
		<div className="flex flex-col items-center gap-3 px-4 pb-3 pt-2">
			{/* REC indicator */}
			<motion.div
				className="flex items-center gap-1.5"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<motion.div
					className="h-2 w-2 rounded-full bg-cc-score-red"
					animate={{ opacity: [1, 0.3, 1] }}
					transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
				/>
				<span className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-cc-score-red">REC</span>
				<span className="ml-2 font-[family-name:var(--font-mono)] text-[10px] text-cc-text-muted">02:47</span>
			</motion.div>

			{/* Caller info */}
			<div className="text-center">
				<div className="flex items-center justify-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-cc-accent/20">
						<UserCircle size={20} className="text-cc-accent" weight="fill" />
					</div>
				</div>
				<div className="mt-1.5 text-xs font-medium text-white">Sarah Chen</div>
				<div className="text-[10px] text-cc-text-muted">VP Operations</div>
			</div>

			{/* Waveform visualization */}
			<div className="flex h-8 w-full items-center justify-center gap-[2px]">
				{Array.from({ length: 32 }).map((_, i) => {
					const height = Math.sin(i * 0.4) * 12 + Math.random() * 8 + 4
					return (
						<motion.div
							key={i}
							className="w-[3px] rounded-full bg-cc-accent"
							style={{ height: `${height}px` }}
							animate={{
								height: [`${height}px`, `${height * 0.4}px`, `${height}px`],
								opacity: [0.6, 1, 0.6],
							}}
							transition={{
								duration: 1.2 + Math.random() * 0.8,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: i * 0.03,
							}}
						/>
					)
				})}
			</div>

			{/* Annotation chips firing */}
			<div className="flex w-full flex-col gap-1.5">
				<motion.div
					className="flex items-center gap-1.5 rounded-md border border-cc-score-red/20 bg-cc-score-red/10 px-2.5 py-1.5"
					initial={{ opacity: 0, x: 20, scale: 0.9 }}
					animate={{ opacity: 1, x: 0, scale: 1 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.0 }}
				>
					<Warning size={10} weight="fill" className="text-cc-score-red" />
					<span className="flex-1 text-[9px] text-cc-score-red">You let the prospect defer</span>
					<span className="font-[family-name:var(--font-mono)] text-[8px] text-cc-score-red/60">01:47</span>
				</motion.div>

				<motion.div
					className="flex items-center gap-1.5 rounded-md border border-cc-accent/20 bg-cc-accent/10 px-2.5 py-1.5"
					initial={{ opacity: 0, x: 20, scale: 0.9 }}
					animate={{ opacity: 1, x: 0, scale: 1 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.8 }}
				>
					<CheckCircle size={10} weight="fill" className="text-cc-accent" />
					<span className="flex-1 text-[9px] text-cc-accent">Great discovery question</span>
					<span className="font-[family-name:var(--font-mono)] text-[8px] text-cc-accent/60">02:13</span>
				</motion.div>
			</div>
		</div>
	)
}

/* ─── State 4: SCORE ──────────────────────────────────────── */

export function HeroStateScore() {
	return (
		<div className="flex flex-col items-center gap-3 px-4 pb-3 pt-2">
			{/* Call Complete header */}
			<motion.div
				className="flex items-center gap-1.5"
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.1 }}
			>
				<Trophy size={14} weight="fill" className="text-cc-accent" />
				<span className="text-[10px] font-medium text-cc-text-secondary">Call Complete</span>
			</motion.div>

			{/* Grade ring */}
			<div className="relative flex items-center justify-center">
				<svg width="88" height="88" viewBox="0 0 88 88">
					{/* Track */}
					<circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
					{/* Filled arc */}
					<motion.circle
						cx="44" cy="44" r="36"
						fill="none"
						stroke="#F59E0B"
						strokeWidth="4"
						strokeLinecap="round"
						strokeDasharray={`${2 * Math.PI * 36}`}
						strokeDashoffset={`${2 * Math.PI * 36}`}
						style={{ transformOrigin: '44px 44px', transform: 'rotate(-90deg)' }}
						animate={{ strokeDashoffset: 2 * Math.PI * 36 * 0.2 }}
						transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
					/>
				</svg>
				{/* Grade letter */}
				<motion.div
					className="absolute flex flex-col items-center"
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.8 }}
				>
					<span className="font-[family-name:var(--font-heading)] text-3xl text-cc-amber">B</span>
				</motion.div>
				{/* Top 15% badge */}
				<motion.div
					className="absolute -top-1 rounded-full bg-cc-accent/20 px-2 py-0.5"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 1.2 }}
				>
					<span className="font-[family-name:var(--font-mono)] text-[8px] font-medium text-cc-accent">Top 15%</span>
				</motion.div>
			</div>

			{/* AI Coach Says */}
			<motion.div
				className="w-full rounded-lg border border-cc-surface-border bg-cc-surface-elevated/60 p-2.5"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 1.5 }}
			>
				<div className="mb-1 flex items-center gap-1.5">
					<div className="flex h-4 w-4 items-center justify-center rounded-full bg-cc-accent/20">
						<UserCircle size={12} className="text-cc-accent" weight="fill" />
					</div>
					<span className="text-[8px] font-medium text-cc-accent">AI Coach Says...</span>
				</div>
				<p className="text-[9px] leading-relaxed text-cc-text-secondary">
					You addressed risks clearly but could probe more on their team's concerns.
				</p>
			</motion.div>

			{/* Quick stats */}
			<motion.div
				className="flex w-full gap-2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.8 }}
			>
				<div className="flex-1 rounded-md bg-cc-surface-elevated/40 px-2 py-1.5 text-center">
					<div className="font-[family-name:var(--font-mono)] text-[11px] text-white">211</div>
					<div className="text-[7px] text-cc-text-muted">WPM</div>
				</div>
				<div className="flex-1 rounded-md bg-cc-surface-elevated/40 px-2 py-1.5 text-center">
					<div className="font-[family-name:var(--font-mono)] text-[11px] text-white">64/36</div>
					<div className="text-[7px] text-cc-text-muted">Talk/Listen</div>
				</div>
			</motion.div>
		</div>
	)
}
