/** @fileoverview Phone device frame with 4-state animated product flow.
 * Cycles through Training → Roleplay → Annotation → Scorecard states
 * with crossfade transitions via AnimatePresence. */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Globe, ChatCircle, Warning, Trophy } from '@phosphor-icons/react'

const CYCLE_MS = 3000

interface PhoneState {
	label: string
	color: string
	icon: typeof Globe
	content: React.ReactNode
}

function TrainingContent() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex items-center gap-2 text-xs font-medium text-cc-text-secondary">
				<Globe size={14} weight="bold" className="text-cc-accent" />
				<span>Training AI...</span>
			</div>
			<div className="rounded-lg border border-cc-surface-border bg-cc-surface-elevated px-3 py-2">
				<span className="text-xs text-cc-text-secondary">https://yoursite.com</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-cc-surface-elevated">
				<motion.div
					className="h-full rounded-full bg-cc-accent"
					initial={{ width: '0%' }}
					animate={{ width: '78%' }}
					transition={{ duration: 2.2, ease: 'easeOut' }}
				/>
			</div>
			<div className="text-[10px] text-cc-text-secondary">Analyzing 24 pages...</div>
		</div>
	)
}

function RoleplayContent() {
	return (
		<div className="flex flex-col gap-3 p-4">
			<div className="flex items-center gap-2 text-xs font-medium text-cc-accent">
				<ChatCircle size={14} weight="bold" />
				<span>Roleplay Active</span>
			</div>
			<div className="flex flex-col gap-2">
				<div className="ml-auto max-w-[75%] rounded-xl rounded-br-sm bg-cc-accent px-3 py-2 text-xs text-white">
					What sets your solution apart?
				</div>
				<div className="mr-auto max-w-[75%] rounded-xl rounded-bl-sm bg-cc-surface-elevated px-3 py-2 text-xs text-cc-text-secondary">
					We reduce onboarding time by 60%.
				</div>
				<div className="ml-auto max-w-[75%] rounded-xl rounded-br-sm bg-cc-accent px-3 py-2 text-xs text-white">
					How does pricing work for teams?
				</div>
			</div>
		</div>
	)
}

function AnnotationContent() {
	return (
		<div className="flex flex-col gap-3 p-4">
			<div className="flex items-center gap-2 text-xs font-medium text-[#EF4444]">
				<Warning size={14} weight="bold" />
				<span>Missed The Mark</span>
			</div>
			<div className="rounded-lg border border-cc-surface-border bg-cc-surface-elevated p-3">
				<div className="mb-2 text-[10px] text-cc-text-secondary">0:47 - Objection Handling</div>
				<div className="text-xs text-white">&ldquo;Let me check with my team...&rdquo;</div>
			</div>
			<div className="rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2">
				<div className="text-[10px] font-medium text-[#EF4444]">You let the prospect defer.</div>
				<div className="mt-1 text-[10px] text-cc-text-secondary">Try: isolate the real objection first.</div>
			</div>
		</div>
	)
}

function ScorecardContent() {
	return (
		<div className="flex flex-col gap-3 p-4">
			<div className="flex items-center gap-2 text-xs font-medium text-cc-accent">
				<Trophy size={14} weight="bold" />
				<span>Session Complete</span>
			</div>
			<div className="flex items-center justify-center py-2">
				<span className="font-[family-name:var(--font-mono)] text-4xl font-medium text-cc-accent">B+</span>
			</div>
			<div className="flex flex-col gap-1.5">
				{[
					{ label: 'Discovery', score: 82 },
					{ label: 'Objections', score: 61 },
					{ label: 'Close Attempt', score: 74 },
				].map((m) => (
					<div key={m.label} className="flex items-center gap-2">
						<span className="w-20 text-[10px] text-cc-text-secondary">{m.label}</span>
						<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cc-surface-elevated">
							<div
								className="h-full rounded-full bg-cc-accent"
								style={{ width: `${m.score}%` }}
							/>
						</div>
						<span className="w-7 text-right font-[family-name:var(--font-mono)] text-[10px] text-cc-text-secondary">{m.score}</span>
					</div>
				))}
			</div>
		</div>
	)
}

const STATES: PhoneState[] = [
	{ label: 'training', color: '#10B981', icon: Globe, content: <TrainingContent /> },
	{ label: 'roleplay', color: '#10B981', icon: ChatCircle, content: <RoleplayContent /> },
	{ label: 'annotation', color: '#EF4444', icon: Warning, content: <AnnotationContent /> },
	{ label: 'scorecard', color: '#10B981', icon: Trophy, content: <ScorecardContent /> },
]

/**
 * @description Phone device frame with 4-state product animation.
 * States cycle every 3s: Training AI → Roleplay Active → Missed The Mark → Score B+.
 * Crossfade via AnimatePresence. Emerald 3-layer glow behind frame.
 */
export default function PhoneMockup() {
	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) return

		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % STATES.length)
		}, CYCLE_MS)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="relative flex items-center justify-center">
			{/* 3-layer emerald glow behind phone */}
			<div
				className="absolute inset-0 animate-[glow-pulse_4s_ease-in-out_infinite]"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
				}}
			/>
			<div
				className="absolute inset-0 animate-[glow-pulse_4s_ease-in-out_infinite_0.5s]"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 50%)',
				}}
			/>
			<div
				className="absolute inset-0 animate-[glow-pulse_4s_ease-in-out_infinite_1s]"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.20) 0%, transparent 30%)',
				}}
			/>

			{/* Phone frame */}
			<div className="relative z-10 w-[280px] rounded-[2.5rem] border border-white/12 bg-cc-surface-card p-3">
				{/* Notch */}
				<div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-cc-foundation" />

				{/* Screen */}
				<div
					className="relative overflow-hidden rounded-[2rem] bg-cc-foundation"
					style={{ aspectRatio: '9 / 19.5' }}
				>
					{/* Status bar area */}
					<div className="flex h-10 items-end justify-center pb-1">
						<div className="h-1 w-8 rounded-full bg-white/20" />
					</div>

					{/* State content */}
					<AnimatePresence mode="wait">
						<motion.div
							key={activeIndex}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.4, ease: 'easeInOut' }}
						>
							{STATES[activeIndex].content}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}
