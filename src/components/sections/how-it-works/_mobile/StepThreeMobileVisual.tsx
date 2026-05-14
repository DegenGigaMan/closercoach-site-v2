'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { CheckCircle, Microphone, Phone as PhoneIcon, Warning } from '@phosphor-icons/react'
import { CARD_SHADOW, KICKER_MONO_EMERALD, KICKER_MONO_MUTED, THREAD_EASE } from '../_shared/step-visual-defaults'

const TRANSCRIPT_AI = 'We’ve tried tools before. Integration always breaks.'
const TRANSCRIPT_USER = 'What specifically broke last time?'

type Mode = 'A' | 'B'

export default function StepThreeMobileVisual() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.4, once: true })

	const [mode, setMode] = useState<Mode>('A')
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

	const handleKey = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
		e.preventDefault()
		setMode((prev) => (prev === 'A' ? 'B' : 'A'))
		const next = mode === 'A' ? 1 : 0
		tabRefs.current[next]?.focus()
	}, [mode])

	return (
		<div ref={ref} className="flex flex-col gap-3">
				<motion.div
				role="tablist"
				aria-label="Call mode"
				className="inline-flex w-fit items-center gap-1 self-start rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
				initial={{ opacity: 0, y: 8 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: THREAD_EASE }}
			>
				<button
					ref={(el) => { tabRefs.current[0] = el }}
					id="cc-s3-mobile-tab-a"
					type="button"
					role="tab"
					aria-selected={mode === 'A'}
					aria-controls="cc-s3-mobile-panel-a"
					tabIndex={mode === 'A' ? 0 : -1}
					onClick={() => setMode('A')}
					onKeyDown={handleKey}
					className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60 ${
						mode === 'A'
							? 'bg-cc-accent text-cc-foundation shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
							: 'text-cc-text-secondary hover:text-white'
					}`}
				>
					<PhoneIcon size={12} weight="fill" aria-hidden="true" />
					Phone Call
				</button>
				<button
					ref={(el) => { tabRefs.current[1] = el }}
					id="cc-s3-mobile-tab-b"
					type="button"
					role="tab"
					aria-selected={mode === 'B'}
					aria-controls="cc-s3-mobile-panel-b"
					tabIndex={mode === 'B' ? 0 : -1}
					onClick={() => setMode('B')}
					onKeyDown={handleKey}
					className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60 ${
						mode === 'B'
							? 'bg-cc-accent text-cc-foundation shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
							: 'text-cc-text-secondary hover:text-white'
					}`}
				>
					<Microphone size={12} weight="fill" aria-hidden="true" />
					Record
				</button>
			</motion.div>

			{/* Swappable content card. Crossfade on mode change. */}
			<AnimatePresence mode="wait" initial={false}>
				{mode === 'A'
					? <AiPhoneCallCard key="card-a" inView={inView} prefersReducedMotion={prefersReducedMotion} />
					: <RecordCard key="card-b" inView={inView} prefersReducedMotion={prefersReducedMotion} />
				}
			</AnimatePresence>

			{/* 2 annotation chips (positive + negative). Compact row. */}
			<div className="flex flex-wrap gap-1.5">
				<motion.span
					className="inline-flex items-center gap-1 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium text-cc-accent"
					initial={{ opacity: 0, y: 4 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.5 }}
				>
					<CheckCircle size={10} weight="fill" aria-hidden="true" />
					Great discovery question
					<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-accent/70">02:13</span>
				</motion.span>
				<motion.span
					className="inline-flex items-center gap-1 rounded-full border border-cc-score-red/30 bg-cc-score-red/10 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-medium text-cc-score-red"
					initial={{ opacity: 0, y: 4 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.7 }}
				>
					<Warning size={10} weight="fill" aria-hidden="true" />
					Rushed the rebuttal
					<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-score-red/70">03:04</span>
				</motion.span>
			</div>
		</div>
	)
}

/* ─── Mode A: AI Phone Call card ───────────────────────────── */

function AiPhoneCallCard({ inView, prefersReducedMotion }: { inView: boolean, prefersReducedMotion: boolean }) {
	return (
		<motion.div
			role="tabpanel"
			id="cc-s3-mobile-panel-a"
			aria-labelledby="cc-s3-mobile-tab-a"
			className={`flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-cc-surface-card/70 p-4 ${CARD_SHADOW}`}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			exit={{ opacity: 0, y: -8 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.15 }}
		>
			{/* Header row: live dot + caller name + timer. */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<span className="flex h-1.5 w-1.5 items-center justify-center">
						<motion.span
							aria-hidden="true"
							className="block h-1.5 w-1.5 rounded-full bg-cc-accent"
							initial={{ opacity: 1 }}
							animate={prefersReducedMotion ? { opacity: 1 } : inView ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
						/>
					</span>
					<span className={`${KICKER_MONO_EMERALD} text-[9px]`}>Live</span>
					<span className="text-[11px] font-medium text-white">Sarah Chen</span>
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-text-secondary">
					02:38
				</span>
			</div>

			{/* Transcript stub: AI line + user line. */}
			<div className="flex flex-col gap-2 rounded-lg border border-white/[0.05] bg-cc-foundation/60 p-3">
				<p className="text-[13px] italic leading-relaxed text-cc-text-secondary">
					<span className={`${KICKER_MONO_MUTED} text-[8px] mr-1 not-italic`}>SC</span>
					{TRANSCRIPT_AI}
				</p>
				<p className="text-[13px] italic leading-relaxed text-white">
					<span className={`${KICKER_MONO_EMERALD} text-[8px] mr-1 not-italic`}>You</span>
					{TRANSCRIPT_USER}
				</p>
			</div>
		</motion.div>
	)
}

/* ─── Mode B: Record In-Person card ─────────────────────────── */

function RecordCard({ inView, prefersReducedMotion }: { inView: boolean, prefersReducedMotion: boolean }) {
	const bars = 20
	const barData = Array.from({ length: bars }).map((_, i) => ({
		base: Math.sin(i * 0.4) * 0.5 + 0.55,
		phase: i * 0.18,
		speed: 1.1 + (i % 3) * 0.22,
	}))

	return (
		<motion.div
			role="tabpanel"
			id="cc-s3-mobile-panel-b"
			aria-labelledby="cc-s3-mobile-tab-b"
			className={`flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-cc-surface-card/70 p-4 ${CARD_SHADOW}`}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			exit={{ opacity: 0, y: -8 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: THREAD_EASE, delay: 0.15 }}
		>
			{/* REC header + timer + meeting label */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<span className="flex h-1.5 w-1.5 items-center justify-center">
						<motion.span
							aria-hidden="true"
							className="block h-1.5 w-1.5 rounded-full bg-cc-score-red"
							initial={{ opacity: 1 }}
							animate={prefersReducedMotion ? { opacity: 1 } : inView ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
						/>
					</span>
					<span className="font-[family-name:var(--font-mono)] text-[9px] font-semibold tracking-[0.04em] text-red-400">REC</span>
					<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-text-secondary">03:04</span>
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[8.5px] uppercase tracking-[0.15em] text-cc-text-muted">
					In-Person
				</span>
			</div>

			{/* Ambient waveform */}
			<div className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.05] bg-cc-foundation/60 px-2 py-4">
				<div className="flex h-8 items-center justify-center gap-[2px]">
					{barData.map((bar, i) => (
						<motion.span
							key={i}
							className="block w-[2px] rounded-full bg-cc-accent"
							animate={prefersReducedMotion
								? { height: `${bar.base * 18}px`, opacity: 0.6 }
								: {
									height: [`${bar.base * 22}px`, `${bar.base * 10}px`, `${bar.base * 22}px`],
									opacity: [0.5, 0.85, 0.5],
								}
							}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: bar.speed, repeat: Infinity, ease: 'easeInOut', delay: bar.phase * 0.05 }
							}
						/>
					))}
				</div>
			</div>

			{/* Footer pill */}
			<div className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.05] bg-cc-foundation/60 py-1.5">
				<Microphone size={10} weight="fill" className="text-cc-accent" aria-hidden="true" />
				<span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-secondary">
					Recording meeting
				</span>
			</div>
		</motion.div>
	)
}
