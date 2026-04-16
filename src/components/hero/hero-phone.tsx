/** @fileoverview Hero phone with 4-state product story.
 * Anchor: phone frame (persistent). Content: crossfades between states.
 * Floating badges: change per step with spring physics.
 * Auto-cycles ~4s. Respects prefers-reduced-motion. */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HeroStateTraining, HeroStatePractice, HeroStateRecord, HeroStateScore } from './hero-phone-states'

const CYCLE_MS = 4000

const STATES = [
	{ key: 'training', content: <HeroStateTraining /> },
	{ key: 'practice', content: <HeroStatePractice /> },
	{ key: 'record', content: <HeroStateRecord /> },
	{ key: 'score', content: <HeroStateScore /> },
] as const

/* ─── Floating Badges ────────────────────────────────────── */

interface BadgeConfig {
	text: string
	variant: 'emerald' | 'amber' | 'red' | 'muted'
	position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	pulse?: boolean
}

const BADGE_SETS: BadgeConfig[][] = [
	// Step 1: TRAIN
	[
		{ text: '60 seconds to start', variant: 'emerald', position: 'top-right' },
		{ text: 'AI-personalized', variant: 'muted', position: 'bottom-left' },
	],
	// Step 2: PRACTICE
	[
		{ text: 'Real-time coaching', variant: 'emerald', position: 'top-right' },
		{ text: '3 checkpoints', variant: 'amber', position: 'bottom-left' },
	],
	// Step 3: RECORD
	[
		{ text: 'LIVE', variant: 'red', position: 'top-right', pulse: true },
		{ text: 'Your caller ID', variant: 'muted', position: 'bottom-left' },
	],
	// Step 4: SCORE
	[
		{ text: 'Top 15%', variant: 'amber', position: 'top-right' },
		{ text: '20 pages of feedback', variant: 'emerald', position: 'bottom-left' },
	],
]

const variantStyles: Record<BadgeConfig['variant'], string> = {
	emerald: 'border-cc-accent/30 bg-cc-accent/10 text-cc-accent',
	amber: 'border-cc-amber/30 bg-cc-amber/10 text-cc-amber',
	red: 'border-cc-score-red/30 bg-cc-score-red/10 text-cc-score-red',
	muted: 'border-cc-surface-border bg-cc-surface-card text-cc-text-secondary',
}

const positionStyles: Record<BadgeConfig['position'], string> = {
	'top-left': '-left-16 top-16',
	'top-right': '-right-16 top-20',
	'bottom-left': '-left-14 bottom-28',
	'bottom-right': '-right-14 bottom-24',
}

function FloatingBadge({ config }: { config: BadgeConfig }) {
	return (
		<motion.div
			className={`absolute hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium backdrop-blur-sm md:flex ${variantStyles[config.variant]} ${positionStyles[config.position]}`}
			initial={{ opacity: 0, scale: 0.8, y: 8 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.8, y: -8 }}
			transition={{ type: 'spring', stiffness: 400, damping: 25 }}
		>
			{config.pulse && (
				<motion.div
					className="h-1.5 w-1.5 rounded-full bg-cc-score-red"
					animate={{ opacity: [1, 0.3, 1] }}
					transition={{ duration: 1, repeat: Infinity }}
				/>
			)}
			{config.text}
		</motion.div>
	)
}

/* ─── Dot Indicator ──────────────────────────────────────── */

function DotIndicator({ activeIndex }: { activeIndex: number }) {
	return (
		<div className="flex items-center justify-center gap-2 py-2">
			{STATES.map((_, i) => (
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

/* ─── Main Component ─────────────────────────────────────── */

/**
 * @description Hero phone device frame with 4-state product story.
 * States auto-cycle every 4s: TRAIN → PRACTICE → RECORD → SCORE.
 * Phone frame is the persistent anchor. Content crossfades.
 * Floating badges change per step with spring physics.
 */
export default function HeroPhone() {
	const [activeIndex, setActiveIndex] = useState(0)
	const [reducedMotion, setReducedMotion] = useState(false)

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		setReducedMotion(mq.matches)
		const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [])

	useEffect(() => {
		if (reducedMotion) return
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % STATES.length)
		}, CYCLE_MS)
		return () => clearInterval(interval)
	}, [reducedMotion])

	const handleDotClick = useCallback((i: number) => {
		setActiveIndex(i)
	}, [])

	return (
		<div className="relative flex items-center justify-center">
			{/* 3-layer emerald glow behind phone */}
			<div
				className="pointer-events-none absolute inset-[-40%]"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
				}}
			/>
			<div
				className="pointer-events-none absolute inset-[-20%]"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 50%)',
				}}
			/>
			<div
				className="pointer-events-none absolute inset-[-5%]"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 30%)',
				}}
			/>

			{/* Floating badges */}
			<AnimatePresence mode="wait">
				<motion.div key={`badges-${activeIndex}`} className="contents">
					{BADGE_SETS[activeIndex].map((badge) => (
						<FloatingBadge key={`${badge.text}-${badge.position}`} config={badge} />
					))}
				</motion.div>
			</AnimatePresence>

			{/* Phone frame */}
			<div className="relative z-10 w-[300px] rounded-[2.75rem] border border-white/10 bg-gradient-to-b from-[#1a1d26] to-[#15171f] p-3 shadow-[0_0_48px_rgba(16,185,129,0.08)]">
				{/* Notch */}
				<div className="absolute left-1/2 top-3 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-cc-foundation" />

				{/* Screen */}
				<div
					className="relative overflow-hidden rounded-[2.25rem] bg-cc-foundation"
					style={{ aspectRatio: '9 / 19.5' }}
				>
					{/* Status bar */}
					<div className="flex h-12 items-end justify-between px-6 pb-1">
						<span className="font-[family-name:var(--font-mono)] text-[9px] text-cc-text-muted">12:00</span>
						<div className="flex items-center gap-1">
							<div className="h-1.5 w-1 rounded-sm bg-cc-text-muted/40" />
							<div className="h-2 w-1 rounded-sm bg-cc-text-muted/40" />
							<div className="h-2.5 w-1 rounded-sm bg-cc-text-muted/60" />
							<div className="h-3 w-1 rounded-sm bg-cc-text-muted/80" />
						</div>
					</div>

					{/* App header */}
					<div className="flex items-center justify-between px-4 py-1">
						<span className="font-[family-name:var(--font-mono)] text-[9px] font-medium tracking-wider text-cc-text-muted">CLOSERCOACH</span>
						<div className="flex items-center gap-1">
							<div className="h-1.5 w-1.5 rounded-full bg-cc-accent" />
							<span className="text-[8px] text-cc-text-muted">
								{['Setup', 'Roleplay', 'Live Call', 'Review'][activeIndex]}
							</span>
						</div>
					</div>

					{/* State content */}
					<AnimatePresence mode="wait">
						<motion.div
							key={activeIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4, ease: 'easeInOut' }}
						>
							{STATES[activeIndex].content}
						</motion.div>
					</AnimatePresence>

					{/* Dot indicator at bottom of screen */}
					<div className="absolute bottom-2 left-0 right-0">
						<DotIndicator activeIndex={activeIndex} />
					</div>
				</div>
			</div>
		</div>
	)
}
