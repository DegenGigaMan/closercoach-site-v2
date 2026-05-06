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

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import {
	Globe,
	Check,
	Warning,
	WarningOctagon,
	CheckCircle,
	Microphone,
	Users,
	Timer,
	Headset,
	CaretDown,
} from '@phosphor-icons/react'

/* Shared card recipe — L1 elevated card with dual shadow */
const CARD_SHADOW = 'shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.15)]'

const CYCLE_MS = 9800
const CAMIL_IMG = '/images/prospects/camil-reese.png'
/* Use the cleaned 24KB wordmark at /cc-logo.png instead of the 1.5MB Figma
 * export under /images/closercoach-logo.svg — identical paths, no embedded
 * raster bloat. Saves ~1.5MB per render. */
const CC_LOGO = '/cc-logo.png'

/* ─── Dot Indicator ──────────────────────────────────────── */

function DotIndicator({ activeIndex }: { activeIndex: number }) {
	return (
		<div className="flex items-center justify-center gap-2 py-1.5">
			{Array.from({ length: 3 }).map((_, i) => (
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

/* Deterministic PRNG so bar speeds stay stable across SSR/CSR and survive the
 * React Compiler "no impure calls during render" rule. */
function waveformRng(seed: number): () => number {
	let t = seed
	return () => {
		t = (t + 0x6d2b79f5) | 0
		let r = Math.imul(t ^ (t >>> 15), 1 | t)
		r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296
	}
}

function Waveform({ bars = 48, height = 80, mini = false, pulse = true, ducked = false }: { bars?: number, height?: number, mini?: boolean, pulse?: boolean, ducked?: boolean }) {
	const prefersReducedMotion = useReducedMotion()
	const barData = useMemo(() => {
		const rand = waveformRng(5717 + bars)
		return Array.from({ length: bars }).map((_, i) => {
			const base = Math.sin(i * 0.3) * 0.5 + 0.5
			return { base, phase: i * 0.15, speed: 1 + rand() * 0.6 }
		})
	}, [bars])

	const shouldAnimate = pulse && !prefersReducedMotion
	/* F3 (W5 §F3): amplitude duck on chip fire in S3 RECORD. When ducked=true,
	 * bars shrink to 0.5 scale for ~200ms creating a causal link between the
	 * audio event and the coaching annotation. Reduced-motion suppresses the duck. */
	const shouldDuck = ducked && !prefersReducedMotion

	return (
		<div
			className={`flex w-full items-center justify-center transition-transform ${mini ? 'gap-[1px]' : 'gap-px'}`}
			style={{
				height,
				transform: shouldDuck ? 'scaleY(0.5)' : 'scaleY(1)',
				transformOrigin: 'center',
				transitionDuration: shouldDuck ? '160ms' : '240ms',
				transitionTimingFunction: 'ease-out',
			}}
		>
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
							duration: bar.speed * 2,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: bar.phase * 0.1,
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
	const [subState, setSubState] = useState<'input' | 'processing' | 'ready' | 'connecting'>('input')

	useEffect(() => {
		// 1A input: 1.8s, 1B processing: 1.7s, 1C ready: 3.7s, 1D connecting: until cycle
		const t1 = setTimeout(() => setSubState('processing'), 1800)
		const t2 = setTimeout(() => setSubState('ready'), 3500)
		const t3 = setTimeout(() => setSubState('connecting'), 7400)
		return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
	}, [])

	/* Spring config shared across all inter-frame slides */
	const slideSpring = { type: 'spring' as const, stiffness: 300, damping: 36, bounce: 0 }

	return (
		/* overflow-hidden clips the slide in/out so frames never bleed outside the phone screen */
		<div className="relative h-full overflow-hidden">
			{/* mode="sync" lets the exiting frame slide out while the entering frame slides in
			    simultaneously — no blank gap between frames, pure connected ribbon feel. */}
			<AnimatePresence mode="sync" initial={false}>
			{subState === 'input' && (
				<motion.div
					key="input-frame"
					className="absolute inset-0 flex flex-col px-4 pb-4 pt-1"
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '-100%' }}
					transition={slideSpring}
				>
					{/* ── Webpage preview card (no chrome bar) ── */}
					<div className="mb-0 overflow-hidden rounded-xl border border-white/[0.10] bg-[#18191F]">
						<div className="px-3 pt-3">
							<div className="mb-1.5 h-[9px] w-[55%] rounded-sm bg-white/[0.18]" />
							<div className="mb-2.5 h-[7px] w-[75%] rounded-sm bg-white/[0.10]" />
						</div>
						<div className="mx-3 mb-3 flex h-[70px] items-center justify-center rounded-lg bg-white/[0.07]">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" opacity="0.35">
								<rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
								<circle cx="8.5" cy="8.5" r="1.5" stroke="white" strokeWidth="1.5"/>
								<path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>

					{/* ── iOS Safari URL-copy overlay ── */}
					<div className="relative">
						<motion.div
							className="absolute -top-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
							initial={{ opacity: 0, y: 4 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.25 }}
						>
							<div className="rounded-md bg-cc-accent px-3 py-[5px] text-[10px] font-semibold text-black shadow-md">Copy</div>
							<div className="h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-cc-accent" />
						</motion.div>
						<div className="flex items-center gap-1.5 bg-[#1C1C1E] px-3 py-[9px]">
							<svg width="7" height="16" viewBox="0 0 7 16" fill="none" className="shrink-0">
								<path d="M1 0h5M3.5 0v16M1 16h5" stroke="#4A9EFF" strokeWidth="1.4" strokeLinecap="round"/>
								<circle cx="3.5" cy="15.5" r="2" fill="#4A9EFF"/>
							</svg>
							<span className="flex-1 text-center text-[11px] font-medium text-white">yoursite.com/product</span>
							<svg width="7" height="16" viewBox="0 0 7 16" fill="none" className="shrink-0">
								<path d="M1 0h5M3.5 0v16M1 16h5" stroke="#4A9EFF" strokeWidth="1.4" strokeLinecap="round"/>
								<circle cx="3.5" cy="15.5" r="2" fill="#4A9EFF"/>
							</svg>
						</div>
						<div className="flex items-center justify-around bg-[#1C1C1E] px-4 pb-2 pt-1">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.5"/></svg>
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.25"/></svg>
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M8 12V20h8v-8M12 3v10M9 6l3-3 3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/></svg>
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4zM8 8h8M8 12h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.5"/></svg>
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="1.8" strokeOpacity="0.5"/><path d="M8 10h8M8 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/></svg>
						</div>
						<div className="flex justify-center bg-[#1C1C1E] pb-2">
							<div className="h-1 w-24 rounded-full bg-white/20" />
						</div>
					</div>

					{/* ── App content ── */}
					<div className="flex flex-1 flex-col px-1 pt-4">
						<h2 className="mb-2 text-center font-sans text-[20px] font-bold text-white">What do you sell?</h2>
						<p className="mb-4 text-center text-[10px] leading-relaxed text-white/50">
							Our AI will research your business to build avatars and role play scenarios for you to practice against.
						</p>
						<div className="mb-4 rounded-2xl border border-white/[0.12] bg-[#1E2130] px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] text-white/30">Link to your website</span>
								<span className="text-[11px] font-semibold text-cc-accent">Paste</span>
							</div>
						</div>
						<div className="mt-auto rounded-full bg-cc-mint py-3 text-center text-[14px] font-bold text-black">
							Continue →
						</div>
					</div>
				</motion.div>
			)}

			{subState === 'processing' && (
				<motion.div
					key="processing-frame"
					className="absolute inset-0 flex flex-col px-4 pb-4 pt-2"
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '-100%' }}
					transition={slideSpring}
				>
					<h2 className="mb-8 text-center font-sans text-[22px] font-bold leading-tight text-white">
						Creating Your AI Customers
					</h2>
					<p className="mb-2 text-center text-[14px] font-semibold text-cc-accent">
						Learning your business...
					</p>
					<div className="mx-auto mb-8 h-[5px] w-full overflow-hidden rounded-full bg-white/[0.08]">
						<motion.div
							className="h-full rounded-full bg-cc-accent"
							initial={{ width: '0%' }}
							animate={{ width: '65%' }}
							transition={{ duration: 1.6, ease: 'easeOut' }}
						/>
					</div>
					<div className="flex flex-col gap-3">
						{([
							{ icon: <Users size={16} weight="duotone" className="text-cc-accent" />, label: 'Analyzing Ideal Customer Profile' },
							{ icon: <Timer size={16} weight="duotone" className="text-cc-accent" />, label: 'Designing AI Characters' },
							{ icon: <Users size={16} weight="duotone" className="text-cc-accent" />, label: 'Configuring Realistic Voices' },
							{ icon: <Users size={16} weight="duotone" className="text-cc-accent" />, label: 'Setting up Buyer Behaviour' },
						] as { icon: React.ReactNode; label: string }[]).map(({ icon, label }, i) => (
							<motion.div
								key={label}
								className="flex items-center gap-3 rounded-full bg-white/[0.06] px-4 py-3"
								initial={{ opacity: 0, x: -16 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 + i * 0.14 }}
							>
								{icon}
								<span className="text-[12px] font-medium text-white/80">{label}</span>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{subState === 'ready' && (
				<motion.div
					key="ready-frame"
					className="absolute inset-0 flex flex-col px-4 pb-4 pt-1"
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '-100%' }}
					transition={slideSpring}
				>
					{/* Heading — springs up from below */}
					<motion.h2
						className="mb-3 text-center font-sans text-[21px] font-bold leading-tight text-white"
						initial={{ y: 28, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.18 }}
					>
						3 Prospects to start<br />training against.
					</motion.h2>

					{/* "AI Customers Ready!" — pops in with bounce */}
					<motion.p
						className="mb-1.5 text-center text-[13px] font-bold text-cc-accent"
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 }}
					>
						AI Customers Ready!
					</motion.p>

					{/* Progress bar — springs to 100%, overshoot then settle */}
					<div className="mb-4 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
						<motion.div
							className="h-full rounded-full bg-cc-accent"
							initial={{ width: '65%' }}
							animate={{ width: '100%' }}
							transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.36 }}
						/>
					</div>

					{/* Carousel — edge-to-edge via -mx-4 */}
					<div className="relative mb-3 flex-1 -mx-4">

						{/* Left peek — slides in from left */}
						<motion.div
							className="absolute inset-y-0 left-0 w-[13%] overflow-hidden rounded-r-2xl opacity-40"
							style={{ filter: 'blur(1.5px)' }}
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.44 }}
						>
							<Image src={CAMIL_IMG} alt="" fill className="object-cover object-[35%_top]" sizes="50px" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
						</motion.div>

						{/* Center card — scales up with spring bounce, glows after landing */}
						<motion.div
							className="absolute inset-y-0 overflow-hidden rounded-2xl"
							style={{ left: '15%', right: '15%' }}
							initial={{ scale: 0.72, opacity: 0, y: 20 }}
							animate={{
								scale: 1,
								opacity: 1,
								y: 0,
								boxShadow: [
									'0 0 0 2px #10B981, 0 0 0px rgba(16,185,129,0)',
									'0 0 0 2px #10B981, 0 0 24px rgba(16,185,129,0.55)',
									'0 0 0 2px #10B981, 0 0 8px rgba(16,185,129,0.25)',
								],
							}}
							transition={{
								scale: { type: 'spring', stiffness: 320, damping: 22, delay: 0.32 },
								opacity: { duration: 0.25, delay: 0.32 },
								y: { type: 'spring', stiffness: 320, damping: 22, delay: 0.32 },
								boxShadow: { duration: 1.2, delay: 0.7, ease: 'easeOut' },
							}}
						>
							<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover object-top" sizes="230px" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
							<div className="absolute bottom-0 left-0 right-0 p-3.5">
								<motion.p
									className="text-[14px] font-bold text-white"
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.52 }}
								>Camil Reese</motion.p>
								<motion.p
									className="mb-2 text-[11px] text-white/60"
									initial={{ y: 8, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.58 }}
								>Finance Director @ Oracle</motion.p>
								<motion.span
									className="inline-flex items-center gap-1 rounded-full border border-cc-amber/25 bg-cc-amber/15 px-2 py-0.5 text-[9px] font-semibold text-cc-amber"
									initial={{ scale: 0.6, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ type: 'spring', stiffness: 460, damping: 20, delay: 0.65 }}
								>
									<WarningOctagon size={9} weight="fill" />
									Skeptical
								</motion.span>
								<motion.p
									className="mt-2 text-[12px] font-light leading-snug text-white"
									initial={{ y: 8, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.72 }}
								>
									&ldquo;How can I justify spending this much right now?&rdquo;
								</motion.p>
							</div>
							{/* Ambient ring pulse after card lands */}
							<motion.div
								className="pointer-events-none absolute inset-0 rounded-2xl"
								initial={{ opacity: 0 }}
								animate={{ opacity: [0, 1, 0] }}
								transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4, repeatDelay: 1.5 }}
								style={{ boxShadow: 'inset 0 0 0 2px rgba(16,185,129,0.7)' }}
							/>
						</motion.div>

						{/* Right peek — slides in from right */}
						<motion.div
							className="absolute inset-y-0 right-0 w-[13%] overflow-hidden rounded-l-2xl opacity-40"
							style={{ filter: 'blur(1.5px)' }}
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.44 }}
						>
							<Image src={CAMIL_IMG} alt="" fill className="object-cover object-[65%_top]" sizes="50px" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
							<div className="absolute bottom-0 left-0 right-0 p-2">
								<p className="text-[10px] font-bold text-white">Ca</p>
								<p className="text-[9px] text-white/60">Fina</p>
								<div className="mt-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-cc-amber/20 bg-cc-amber/15">
									<WarningOctagon size={7} weight="fill" className="text-cc-amber" />
								</div>
								<p className="mt-0.5 text-[9px] text-white/70">&ldquo;H...</p>
							</div>
						</motion.div>

					</div>

					{/* CTA — bounces in last */}
					<motion.div
						className="rounded-full bg-cc-mint-bright py-3.5 text-center text-[14px] font-bold text-cc-foundation"
						initial={{ y: 28, scale: 0.88, opacity: 0 }}
						animate={{ y: 0, scale: 1, opacity: 1 }}
						transition={{ type: 'spring', stiffness: 460, damping: 20, delay: 0.55 }}
					>
						Call Camil →
					</motion.div>
				</motion.div>
			)}
			{subState === 'connecting' && (
				<motion.div
					key="connecting-frame"
					className="absolute inset-0 flex flex-col items-center justify-center bg-cc-foundation"
					initial={{ y: '100%' }}
					animate={{ y: 0 }}
					exit={{ y: '-100%' }}
					transition={slideSpring}
				>
					{/* Ripple rings expand outward from the icon */}
					<div className="relative flex items-center justify-center">

						{/* Ring 1 — slow expand */}
						<motion.div
							className="absolute rounded-full border border-cc-accent/20"
							style={{ width: 128, height: 128 }}
							animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
							transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.2 }}
						/>
						{/* Ring 2 — offset by 0.7s */}
						<motion.div
							className="absolute rounded-full border border-cc-accent/15"
							style={{ width: 128, height: 128 }}
							animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
							transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.75, repeatDelay: 0.2 }}
						/>
						{/* Ring 3 — offset by 1.4s */}
						<motion.div
							className="absolute rounded-full border border-cc-accent/10"
							style={{ width: 128, height: 128 }}
							animate={{ scale: [1, 2.9], opacity: [0.3, 0] }}
							transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1.4, repeatDelay: 0.2 }}
						/>

						{/* Icon circle — dark green, pulsing glow */}
						<motion.div
							className="relative z-10 flex h-[128px] w-[128px] items-center justify-center rounded-full border border-cc-accent/35"
							style={{ background: 'radial-gradient(circle at 38% 32%, #1E4A2A 0%, #0B1C10 70%)' }}
							animate={{ boxShadow: [
								'0 0 0px rgba(16,185,129,0)',
								'0 0 32px rgba(16,185,129,0.38)',
								'0 0 0px rgba(16,185,129,0)',
							] }}
							transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
						>
							{/* Sparkle stars — four corners */}
							<span className="absolute top-4 left-6 text-[11px] leading-none text-white/70">✦</span>
							<span className="absolute top-3 right-5 text-[14px] leading-none text-white/90">✦</span>
							<span className="absolute bottom-5 left-7 text-[8px] leading-none text-white/50">✦</span>
							<span className="absolute bottom-4 right-6 text-[11px] leading-none text-white/65">✦</span>

							{/* Main icon */}
							<Headset size={52} weight="duotone" className="text-white drop-shadow-lg" />
						</motion.div>
					</div>

					{/* "Call Connecting" label */}
					<motion.p
						className="mt-8 text-[20px] font-bold text-white tracking-[-0.01em]"
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.25 }}
					>
						Call Connecting
					</motion.p>

					{/* Animated dots */}
					<div className="mt-3 flex items-center gap-1.5">
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								className="h-1.5 w-1.5 rounded-full bg-cc-accent"
								animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
								transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
							/>
						))}
					</div>
				</motion.div>
			)}
			</AnimatePresence>
		</div>
	)
}

/* ─── State 2: PRACTICE ──────────────────────────────────── */

type PracticeMsg = {
	id: string
	role: 'ai' | 'user'
	text: string
	chip?: { type: 'positive' | 'negative'; label: string }
}

const PRACTICE_MSGS: readonly PracticeMsg[] = [
	{ id: 'ai-1', role: 'ai',   text: "Thanks for reaching out. We already have a solution in place." },
	{ id: 'u-1',  role: 'user', text: "I hear you. Can I ask what's working well with your current setup?", chip: { type: 'positive', label: '⚡ Great Response' } },
	{ id: 'ai-2', role: 'ai',   text: "Our current vendor handles most of what you're describing." },
	{ id: 'u-2',  role: 'user', text: "That makes sense. If I could show you a 30-day ROI comparison…",  chip: { type: 'negative', label: '✕ Missed The Mark' } },
] as const

function PracticeState() {
	const prefersReducedMotion = useReducedMotion()
	const [step, setStep] = useState(prefersReducedMotion ? PRACTICE_MSGS.length : 0)

	useEffect(() => {
		if (prefersReducedMotion) return
		const t1 = setTimeout(() => setStep(1), 700)
		const t2 = setTimeout(() => setStep(2), 1550)
		const t3 = setTimeout(() => setStep(3), 2450)
		const t4 = setTimeout(() => setStep(4), 3400)
		return () => [t1, t2, t3, t4].forEach(clearTimeout)
	}, [prefersReducedMotion])

	const visible = PRACTICE_MSGS.slice(0, step)

	return (
		<div className="flex h-full flex-col overflow-hidden">

			{/* ── Contact card ───────────────────────────────────── */}
			<div className="mx-3 mt-1 mb-1.5 flex items-center gap-3 rounded-2xl bg-[#1C1F2E] px-4 py-3">
				<div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
					<Image src={CAMIL_IMG} alt="Camil Reese" fill className="object-cover" sizes="56px" />
				</div>
				<div className="flex flex-col gap-0.5">
					<div className="flex items-center gap-2">
						<span className="text-[17px] font-bold leading-tight text-white">Camil Rees</span>
						<span className="rounded-lg bg-[#163825] px-2.5 py-[3px] text-[10px] font-bold text-cc-accent">
							AI Clone
						</span>
					</div>
					<span className="text-[11px] text-cc-text-muted">Finance Director</span>
				</div>
			</div>

			{/* ── Chat (messages only — button lives outside so it never clips) */}
			<div className="flex flex-1 flex-col gap-2 overflow-hidden px-3">
				<AnimatePresence initial={false}>
					{visible.map((msg) => (
						<motion.div
							key={msg.id}
							initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', stiffness: 340, damping: 30 }}
						>
							{msg.role === 'ai' ? (
								/* AI: avatar + dark bubble, left-aligned */
								<div className="flex items-end gap-2">
									<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2A2D3A]">
										<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
											<circle cx="7.5" cy="5" r="2.8" fill="rgba(148,163,184,0.8)" />
											<path d="M1.5 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="rgba(148,163,184,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
										</svg>
									</div>
									<div className="max-w-[74%] rounded-2xl rounded-bl-sm bg-[#22263A] px-3 py-2.5">
										<p className="text-[11.5px] leading-[1.5] text-[#B4BDD0]">{msg.text}</p>
									</div>
								</div>
							) : (
								/* User: same mounting pattern as StepThreeVisual "Winning
								   Response" badge — relative parent + absolute -top-2 badge
								   + pt-4 bubble so text clears the chip. */
								<motion.div
									className="relative ml-auto max-w-[82%] self-end"
									style={{ marginTop: msg.chip ? '0.75rem' : 0 }}
								>
									{msg.chip && (
										<motion.span
											initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.14, duration: 0.35, ease: 'easeOut' }}
											className={`absolute -top-[10px] left-2 z-[2] inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-2.5 py-[3px] text-[10px] font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.4)] backdrop-blur-sm ${
												msg.chip.type === 'positive'
													? 'bg-[rgba(16,30,20,0.96)] text-[#34D399]'
													: 'bg-[rgba(28,14,14,0.96)] text-[#FF6B6B]'
											}`}
										>
											{msg.chip.label}
										</motion.span>
									)}
									<div className={`w-full rounded-2xl rounded-br-sm bg-[#2C75F0] px-3 pb-2.5 ${msg.chip ? 'pt-3.5' : 'pt-2.5'}`}>
										<p className="text-[11.5px] leading-[1.5] text-white">{msg.text}</p>
									</div>
								</motion.div>
							)}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* ── Get suggested responses — outside overflow so always visible */}
			{step >= 4 && (
				<motion.div
					className="mx-3 mb-1.5 mt-2 flex justify-center"
					initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.06 }}
				>
					<div className="flex items-center gap-1.5 rounded-full bg-[#163825] px-5 py-2">
						<span className="text-[11px]">✏️</span>
						<span className="text-[11px] font-semibold text-cc-accent">Get suggested responses</span>
					</div>
				</motion.div>
			)}

			{/* ── Gauge + mic row ────────────────────────────────── */}
			<div className="mx-3 mt-1.5 flex items-center gap-2">

				{/* Interest gauge
				    Arc math: centre (60,62), r=55, sweep-flag=1 (clockwise in SVG =
				    counterclockwise visually = upward arc). Segment boundaries at 33%
				    and 66% of the 180° span. Needle at 39%. */}
				<div className="flex shrink-0 flex-col items-center">
					<svg width="100" height="64" viewBox="0 0 120 78" aria-hidden="true">
						{/* Track */}
						<path d="M 5 62 A 55 55 0 0 1 115 62"
							fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
						{/* Red   0% – 33% */}
						<path d="M 5 62 A 55 55 0 0 1 32.1 14.6"
							fill="none" stroke="#EF4444" strokeWidth="9" strokeLinecap="round" />
						{/* Amber 33% – 66% */}
						<path d="M 32.1 14.6 A 55 55 0 0 1 86.5 13.8"
							fill="none" stroke="#F59E0B" strokeWidth="9" strokeLinecap="round" />
						{/* Green 66% – 100% */}
						<path d="M 86.5 13.8 A 55 55 0 0 1 115 62"
							fill="none" stroke="#22C55E" strokeWidth="9" strokeLinecap="round" />
						{/* Needle dot at 39% (amber zone) */}
						<circle cx="41.4" cy="10.2" r="5.5" fill="white" />
						{/* Number */}
						<text x="60" y="55" textAnchor="middle" dominantBaseline="auto"
							fill="white" fontSize="26" fontWeight="700" fontFamily="system-ui,sans-serif">39</text>
						{/* Label */}
						<text x="60" y="72" textAnchor="middle"
							fill="rgba(148,163,184,0.65)" fontSize="8" fontWeight="600"
							letterSpacing="2" fontFamily="system-ui,sans-serif">INTEREST</text>
					</svg>
				</div>

				{/* Mic bar */}
				<div className="flex flex-1 items-center gap-2 rounded-2xl bg-[#1A1D26] px-3 py-2.5">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cc-accent/20">
						<Microphone size={14} weight="fill" className="text-cc-accent" />
					</div>
					<div className="flex flex-1 items-center justify-center">
						<Waveform bars={18} height={18} mini pulse={!prefersReducedMotion} />
					</div>
					<div className="flex shrink-0 items-center gap-1.5">
						<motion.div
							className="h-[7px] w-[7px] rounded-full bg-red-500"
							animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0.2, 1] }}
							transition={{ duration: 1.1, repeat: Infinity }}
						/>
						<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-text-muted">
							02:34
						</span>
					</div>
				</div>
			</div>

			{/* ── Task bar ───────────────────────────────────────── */}
			<div className="mx-3 mb-2 mt-1.5 flex shrink-0 items-center rounded-2xl border border-white/[0.06] bg-[#1A1D26] px-3 py-2">
				<div className="flex items-center gap-2">
					<CheckCircle size={15} weight="duotone" className="shrink-0 text-cc-accent" />
					<span className="text-[10.5px] font-medium text-cc-text-secondary">2 Tasks completed</span>
				</div>
				<div className="ml-auto flex items-center gap-1.5">
					{/* green check \xd7 2 */}
					{[0, 1].map((i) => (
						<div key={i} className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[#22C55E]">
							<Check size={12} weight="bold" className="text-white" />
						</div>
					))}
					{/* red x */}
					<div className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[#EF4444]">
						<Warning size={12} weight="bold" className="text-white" />
					</div>
					<CaretDown size={13} className="ml-1 text-cc-text-muted" weight="bold" />
				</div>
			</div>
		</div>
	)
}


/* ─── State 4: SCORE ─────────────────────────────────────── */

/* Ring geometry for the grade circle */
const S_RADIUS = 52
const S_CIRC = 2 * Math.PI * S_RADIUS

/* Skill dimensions shown in the score cards */
const SKILL_CARDS = [
	{ score: '5/5', label: 'Executive-Level Framing', sub: 'Excellent', highlight: true },
	{ score: '5/5', label: 'Clear Next Step Commitment', sub: null, highlight: false },
] as const

function ScoreState() {
	const prefersReducedMotion = useReducedMotion()
	const [ringDrawn, setRingDrawn] = useState(!!prefersReducedMotion)
	const [badgeIn, setBadgeIn] = useState(!!prefersReducedMotion)
	const [coachIn, setCoachIn] = useState(!!prefersReducedMotion)
	const [cardsIn, setCardsIn] = useState(!!prefersReducedMotion)
	const [ctaIn, setCtaIn] = useState(!!prefersReducedMotion)

	useEffect(() => {
		if (prefersReducedMotion) return
		const t1 = setTimeout(() => setRingDrawn(true), 300)
		const t2 = setTimeout(() => setBadgeIn(true), 1100)
		const t3 = setTimeout(() => setCoachIn(true), 1600)
		const t4 = setTimeout(() => setCardsIn(true), 2200)
		const t5 = setTimeout(() => setCtaIn(true), 2600)
		return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
	}, [prefersReducedMotion])

	/* Ring draws to ~88% fill (grade A territory) */
	const ringFill = ringDrawn ? S_CIRC * (1 - 0.88) : S_CIRC

	return (
		<div className="flex h-full flex-col overflow-hidden px-4 pb-3 pt-2">

			{/* Header: icon + "Call Complete" */}
			<motion.div
				className="mb-2 flex items-center justify-center gap-2"
				initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, ease: 'easeOut' }}
			>
				<span className="text-[18px]">🤝</span>
				<span className="text-[15px] font-semibold text-white">Call Complete</span>
			</motion.div>

			{/* Grade ring: "A" in center, "Top 15%" badge floating on top edge */}
			<div className="relative mx-auto mb-3 flex items-center justify-center">
				<svg width="116" height="116" viewBox="0 0 120 120" aria-hidden="true">
					{/* Track */}
					<circle cx="60" cy="60" r={S_RADIUS} fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="7" />
					{/* Filled arc — draws in */}
					<motion.circle
						cx="60"
						cy="60"
						r={S_RADIUS}
						fill="none"
						stroke="#10B981"
						strokeWidth="7"
						strokeLinecap="round"
						strokeDasharray={S_CIRC}
						initial={{ strokeDashoffset: S_CIRC }}
						animate={{ strokeDashoffset: ringFill }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
						style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
					/>
					{/* Glow dot at tip of arc */}
					{ringDrawn && (
						<motion.circle
							cx="60"
							cy="8"
							r="4"
							fill="#10B981"
							initial={{ opacity: 0 }}
							animate={{ opacity: [0.6, 1, 0.6] }}
							transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
						/>
					)}
				</svg>

				{/* Grade letter in center */}
				<motion.div
					className="absolute flex items-center justify-center"
					initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22, delay: 0.9 }}
				>
					<span
						className="font-bold text-cc-accent"
						style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', lineHeight: 1 }}
					>
						A
					</span>
				</motion.div>

				{/* "Top 15%" badge — floats on the top edge of the ring */}
				<motion.div
					className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
					initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.6, y: 8 }}
					animate={{ opacity: badgeIn ? 1 : 0, scale: badgeIn ? 1 : 0.6, y: badgeIn ? 0 : 8 }}
					transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20 }}
				>
					<div className="flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-accent/15 px-2.5 py-[3px]">
						<span className="text-[9px]">🏆</span>
						<span className="text-[9px] font-bold text-cc-accent">Top 15%</span>
					</div>
				</motion.div>
			</div>

			{/* AI Coach Suggests section */}
			<motion.div
				className="mb-2.5"
				initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
				animate={{ opacity: coachIn ? 1 : 0, y: coachIn ? 0 : 10 }}
				transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 26 }}
			>
				<p className="mb-1.5 text-[11px] font-semibold text-cc-accent">AI Coach Suggests..</p>
				<div className="flex items-start gap-2">
					{/* Camil avatar */}
					<div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
						<Image src={CAMIL_IMG} alt="AI Coach" fill className="object-cover" sizes="32px" />
					</div>
					{/* Blue message bubble */}
					<div className="flex-1 rounded-2xl rounded-tl-sm bg-[#4B7BEC] px-3 py-2">
						<p className="text-[10px] leading-[1.5] text-white">
							You addressed risks clearly and secured next steps but could probe more on their team&apos;s concerns.
						</p>
					</div>
				</div>
			</motion.div>

			{/* Skill score cards */}
			<div className="flex flex-col gap-1.5">
				{SKILL_CARDS.map((card, i) => (
					<motion.div
						key={card.label}
						className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${
							card.highlight
								? 'border-cc-accent/20 bg-[#0D1F17]'
								: 'border-white/[0.05] bg-[#111318]'
						}`}
						initial={prefersReducedMotion ? false : { opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
						animate={{ opacity: cardsIn ? 1 : 0, x: cardsIn ? 0 : (i % 2 === 0 ? -10 : 10) }}
						transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 24, delay: i * 0.1 }}
					>
						{/* Score circle */}
						<div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
							card.highlight ? 'border-cc-accent' : 'border-cc-accent/40'
						}`}>
							<span className={`font-[family-name:var(--font-mono)] text-[11px] font-bold ${
								card.highlight ? 'text-cc-accent' : 'text-cc-accent/60'
							}`}>
								{card.score}
							</span>
						</div>
						{/* Label + sub */}
						<div className="flex flex-col">
							<span className={`text-[11px] font-semibold ${card.highlight ? 'text-white' : 'text-cc-text-muted'}`}>
								{card.label}
							</span>
							{card.sub && (
								<span className="text-[9px] text-cc-text-muted">{card.sub}</span>
							)}
							{card.highlight && (
								<span className="mt-0.5 text-[9px] font-medium text-cc-accent">Drill deeper →</span>
							)}
						</div>
					</motion.div>
				))}
			</div>

			{/* "Practice Again" CTA */}
			<motion.button
				className="mt-auto w-full rounded-full bg-white py-2.5 text-[13px] font-bold text-cc-foundation"
				initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
				animate={{ opacity: ctaIn ? 1 : 0, y: ctaIn ? 0 : 12 }}
				transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 26 }}
				type="button"
			>
				Practice Again ↺
			</motion.button>
		</div>
	)
}


/* ─── Phone Frame ────────────────────────────────────────── */


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
					<div className="relative overflow-hidden" style={{ aspectRatio: '9 / 17.5' }}>
						{/* App header bar */}
						<div className="flex items-center justify-center px-5 py-1.5">
							<img src={CC_LOGO} alt="CloserCoach" className="h-6 w-auto" />
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
		initial: { opacity: 0, scale: 0.92, x: 0, y: 0 },
		animate: { opacity: 1, scale: 1, x: 0, y: 0 },
		exit: { opacity: 0, y: -16, scale: 1, x: 0 },
	},
} as const

export default function HeroPhoneV2() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		if (prefersReducedMotion) return

		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % 3)
		}, CYCLE_MS)

		return () => clearInterval(interval)
	}, [prefersReducedMotion])

	const variants = stateVariants[activeIndex as 0 | 1 | 2]
	const stateTransition = prefersReducedMotion
		? { duration: 0 }
		: { type: 'spring' as const, stiffness: 125, damping: 30 }

	return (
		<LayoutGroup>
			<div className="relative flex items-center justify-center px-40">
				{/* Emerald glow */}
				<div className="pointer-events-none absolute inset-[-40%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
				<div className="pointer-events-none absolute inset-[-15%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 45%)' }} />
				<div className="pointer-events-none absolute inset-[-5%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 25%)' }} />

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
							{activeIndex === 2 && <ScoreState />}
						</motion.div>
					</AnimatePresence>
				</PhoneFrame>
			</div>
		</LayoutGroup>
	)
}
