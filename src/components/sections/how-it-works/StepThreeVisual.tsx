/** @fileoverview S3 Step 3 Sell right-column visual composition.
 * 6-sub-state scroll-trigger-then-autoplay chain. Single phone frame MORPHS
 * between Mode A (AI Phone Call) and Mode B (In-Person Record) via layoutId.
 * In 3E, coaching annotations spring OUT of the phone onto the dark surface
 * around it -- the $10K signature moment unique to S3.
 *
 *   3A (0 - 800ms):    Dual-mode toggles appear above empty phone frame.
 *                       "AI Phone Call" toggle active, "Record In-Person" muted.
 *                       Mode A dialer visible: Sarah Chen, number, caller-ID sub.
 *   3B (800 - 2400ms): Dial -> connecting dots -> live call UI with avatar +
 *                       call timer counting up from 00:00. NumberFlow animates.
 *   3C (2400 - 4000ms): Coaching annotations fire INSIDE the phone during the
 *                       live call. Negative + positive CoachingPill appear near
 *                       transcript. Transcript line italic.
 *   3D (4000 - 5600ms): Mode toggle swap: "Record In-Person" becomes active,
 *                       "AI Phone Call" dims. Phone interior MORPHS via
 *                       layoutId. REC pulse + ambient waveform + room-blur
 *                       backdrop fades in behind phone.
 *   3E (5600 - 7200ms): SIGNATURE -- 4 coaching annotations emerge from phone
 *                       edges onto surrounding dark surface. Staggered springs
 *                       + emerald glow trail. Unique to S3.
 *   3F (7200ms+):       Settled. Annotations breathe at anchor positions
 *                       (ambient scale + opacity drift, staggered 0.4s per
 *                       pill). Replacement badge rendered by left-column
 *                       body copy (single source); right-column keeps the
 *                       phone + annotations breathing as the payoff surface.
 *
 * Authority:
 *   - Visual spec: vault/clients/closer-coach/design/section-blueprint.md §S3 Step 3 (222-235)
 *   - Copy spec:   vault/clients/closer-coach/copy/lp-copy-deck-v5.md §Section 3 Step 3 (v5.3)
 *   - Motion:      vault/clients/closer-coach/design/motion-spec.md (Thread Emergence + layoutId morph)
 *   - Vocabulary:  src/components/hero/hero-phone-v2.tsx (CoachingPill, Waveform, PhoneFrame, layoutId)
 *   - Shared utils: ./_shared/use-sub-state-machine + ./_shared/step-visual-defaults
 *
 * Phone is appearance #2 on the page (S1 Hero is #1). D3 phone allocation rule:
 * Step 3 is the ONLY S3 phone step.
 *
 * Single linear 6-state hook (per W4 dispatch pre-K1 decision). NOT two hook
 * instances. The mode transition (3C -> 3D) is a state advance; the layoutId
 * morph is a consequence of swapping the interior panel while the outer shell
 * keeps a stable layoutId.
 *
 * Reduced-motion guard collapses to 3F instantly: REC interior, annotations at
 * final perimeter positions, replacement badge visible, no ambient, no fade.
 *
 * F38/F39 hydration safety: every motion.* initial prop uses STABLE values.
 * Reduced-motion lives exclusively in transition (duration: 0). */

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import NumberFlow from '@number-flow/react'
import {
	CheckCircle,
	Microphone,
	Phone as PhoneIcon,
	Warning,
} from '@phosphor-icons/react'
import { useSubStateMachine } from './_shared/use-sub-state-machine'
/* CARD_SHADOW is intentionally NOT imported: the phone frame carries its own
 * deeper shadow recipe inline (the phone is a 3D object, not an L1 card). */
import {
	CARD_ENTER_SPRING,
	THREAD_EASE,
} from './_shared/step-visual-defaults'

const SARAH_IMG = '/images/prospects/sarah-chen.png'
const CC_LOGO = '/images/closercoach-logo.svg'

/* Sub-state timings (ms). Each value is the moment the state begins. */
const T_3A = 0
const T_3B = 800
const T_3C = 2400
const T_3D = 4000
const T_3E = 5600
const T_3F = 7200

type SubState = '3A' | '3B' | '3C' | '3D' | '3E' | '3F'

/* Module-level pinned chain per F27 (states-array identity warning). */
const STEP_THREE_STATES: ReadonlyArray<{ id: SubState, enterAtMs: number }> = [
	{ id: '3A', enterAtMs: T_3A },
	{ id: '3B', enterAtMs: T_3B },
	{ id: '3C', enterAtMs: T_3C },
	{ id: '3D', enterAtMs: T_3D },
	{ id: '3E', enterAtMs: T_3E },
	{ id: '3F', enterAtMs: T_3F },
] as const

/* Sarah Chen transcript lines fire inside the phone during 3C. Agent-authored,
 * anchored on the Step 1/2 OBJECTION (integration failure) for narrative
 * continuity. Logged DEV-024. */
const TRANSCRIPT_AI = 'We\u2019ve tried tools before. Integration always breaks.'
const TRANSCRIPT_USER = 'What specifically broke last time?'

/* Coaching pill copy fired during 3E (signature annotations-spring-OUT moment).
 * Agent-authored, specific to the authentic-beat-observation tone per K6. Logged
 * DEV-026. Positioned around the phone perimeter. Timestamps anchor each chip
 * to a moment in the live call / record session for credibility. The inline 3C
 * coaching pill labels (DEV-025) live in the LiveCallPanel JSX below. */
type AnnotationSpec = {
	id: string
	type: 'positive' | 'negative'
	label: string
	timestamp: string
	/* Anchor position around the phone. Each anchor is pre-computed in pixel
	 * space relative to the phone container -- start at phone edge, end at
	 * perimeter position outside. The 4 anchors cover TL / TR / BL / BR so the
	 * signature moment reads as "annotations radiating out." */
	anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const ANNOTATIONS: readonly AnnotationSpec[] = [
	{ id: 'pos-discovery', type: 'positive', label: 'Great discovery question', timestamp: '02:13', anchor: 'top-right' },
	{ id: 'neg-defer', type: 'negative', label: 'Let the prospect defer', timestamp: '01:47', anchor: 'bottom-left' },
	{ id: 'pos-tone', type: 'positive', label: 'Confident tone shift', timestamp: '02:38', anchor: 'top-left' },
	{ id: 'neg-pacing', type: 'negative', label: 'Rushed the rebuttal', timestamp: '03:04', anchor: 'bottom-right' },
] as const

/* Pixel positions for each annotation's END position (outside the phone). The
 * phone frame is 240px wide centered inside a relative container. Left pills
 * use `right: ...%` to anchor their right-edge just past the phone's left edge;
 * right pills use `left: ...%` to anchor their left-edge just past the phone's
 * right edge. Outer container on this page is wider than 240px so left/right
 * anchor values land the pills on the dark surface surrounding the phone.
 * START offsets (DX/DY) originate at the phone edge -- positive DX pulls left
 * pills toward phone center, negative DX pulls right pills toward phone center.
 * Final travel settles them at the anchored resting position. */
/* Pill anchor positions. Phone is 240px wide centered in a 480px container:
 * phone left edge at container x=120, phone right edge at container x=360.
 * Left-side pills anchor with `right: 360px` so the pill's right edge sits 360px
 * from the container's right edge, which lands at x=480-360=120 -- right at the
 * phone's left edge, with gap-of-2 spacing applied via mr-2. Right-side pills
 * anchor with `left: 360px` for the mirror placement. */
type AnchorPos = { top: string, side: 'left' | 'right', offset: string, startDX: number, startDY: number }
const ANCHOR_POSITIONS: Record<AnnotationSpec['anchor'], AnchorPos> = {
	'top-left':     { top: '4%',   side: 'right', offset: 'calc(50% + 132px)', startDX:  50, startDY:  40 },
	'top-right':    { top: '14%',  side: 'left',  offset: 'calc(50% + 132px)', startDX: -50, startDY:  30 },
	'bottom-left':  { top: '64%',  side: 'right', offset: 'calc(50% + 132px)', startDX:  50, startDY: -30 },
	'bottom-right': { top: '72%',  side: 'left',  offset: 'calc(50% + 132px)', startDX: -50, startDY: -20 },
}

/* ─── Dual-mode toggle row (above phone) ────────────────────── */

function DualModeToggles({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	const modeBActive = subState === '3D' || subState === '3E' || subState === '3F'
	return (
		<div
			role="tablist"
			aria-label="Call mode"
			className="flex items-center justify-center gap-2"
		>
			<ModeToggle
				icon={<PhoneIcon size={10} weight="fill" aria-hidden="true" />}
				label="AI Phone Call"
				active={!modeBActive}
				prefersReducedMotion={prefersReducedMotion}
			/>
			<ModeToggle
				icon={<Microphone size={10} weight="fill" aria-hidden="true" />}
				label="Record In-Person"
				active={modeBActive}
				prefersReducedMotion={prefersReducedMotion}
			/>
		</div>
	)
}

function ModeToggle({ icon, label, active, prefersReducedMotion }: {
	icon: React.ReactNode
	label: string
	active: boolean
	prefersReducedMotion: boolean
}) {
	return (
		<motion.button
			type="button"
			role="tab"
			aria-selected={active}
			tabIndex={active ? 0 : -1}
			className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60"
			/* F39: stable initial. Reduced-motion snaps via duration: 0. */
			initial={{ opacity: 1 }}
			animate={{
				opacity: 1,
				borderColor: active ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)',
				backgroundColor: active ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.02)',
				color: active ? '#10B981' : 'rgba(148,163,184,0.85)',
			}}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: THREAD_EASE }}
		>
			{icon}
			{label}
		</motion.button>
	)
}

/* ─── Phone Frame (shared shell) ───────────────────────────── */

/* Static outer shell. Bezel + Dynamic Island match hero-phone-v2 vocabulary.
 * Interior is passed as children; the interior is the layoutId morph target,
 * not the shell (so the shell doesn't jitter during mode swap). */
function PhoneFrame({ children, mode }: { children: React.ReactNode, mode: 'A' | 'B' }) {
	return (
		<div className="relative z-10 w-[240px]">
			<div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#2a2d36] to-[#1a1d26] p-[5px] shadow-[0_0_50px_rgba(16,185,129,0.1),0_16px_32px_rgba(0,0,0,0.45)]">
				<div className="overflow-hidden rounded-[2.2rem] border border-white/5 bg-cc-foundation">
					{/* Dynamic Island */}
					<div className="flex justify-center pt-2">
						<div className="h-[18px] w-[80px] rounded-full bg-black" />
					</div>
					{/* App header */}
					<div className="flex items-center justify-between px-4 py-1.5">
						<Image src={CC_LOGO} alt="CloserCoach" width={72} height={16} className="h-5 w-auto" />
						<div className="flex items-center gap-1">
							<div className={`h-1.5 w-1.5 rounded-full ${mode === 'B' ? 'bg-cc-score-red' : 'bg-cc-accent'}`} />
							<span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.15em] text-cc-text-muted">
								{mode === 'A' ? 'Phone Call' : 'Recording'}
							</span>
						</div>
					</div>
					{/* Screen content area: fixed aspect so the frame height is stable
					 * across Mode A/B swaps and no reflow occurs during morph. */}
					<div className="relative" style={{ aspectRatio: '9 / 16.8' }}>
						{children}
					</div>
					{/* Home indicator */}
					<div className="flex justify-center pb-1.5 pt-1">
						<div className="h-[3px] w-20 rounded-full bg-white/20" />
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Mode A interior (3A-3C) ──────────────────────────────── */

function ModeAInterior({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	const isDialer = subState === '3A'
	const isConnecting = subState === '3B'
	const isLive = subState === '3C'

	/* Live call timer ticks 00:00 -> 00:12 during 3C so NumberFlow animates in.
	 * setState scheduled via setTimeout(0) to avoid the repo-wide
	 * react-hooks/set-state-in-effect lint rule (mirrors StepTwoVisual pattern). */
	const [timer, setTimer] = useState(0)
	useEffect(() => {
		if (prefersReducedMotion) return
		if (!isLive) {
			const t = setTimeout(() => setTimer(0), 0)
			return () => clearTimeout(t)
		}
		const id = setInterval(() => setTimer((prev) => (prev < 599 ? prev + 1 : prev)), 1000)
		return () => clearInterval(id)
	}, [isLive, prefersReducedMotion])

	return (
		<motion.div
			layoutId="cc-s3-step-three-interior"
			className="flex h-full w-full flex-col"
		>
			{isDialer && <DialerPanel prefersReducedMotion={prefersReducedMotion} />}
			{isConnecting && <ConnectingPanel prefersReducedMotion={prefersReducedMotion} />}
			{isLive && <LiveCallPanel timer={timer} prefersReducedMotion={prefersReducedMotion} />}
		</motion.div>
	)
}

function DialerPanel({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	return (
		<motion.div
			key="dialer"
			className="flex h-full flex-col justify-between px-4 pb-3 pt-2"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
		>
			{/* Large prospect block */}
			<div className="flex flex-col items-center gap-1.5 pt-4">
				<div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-cc-accent/40">
					<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="56px" />
				</div>
				<span className="text-[13px] font-semibold text-white">Sarah Chen</span>
				<span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-cc-text-secondary">+1 (555) 0134</span>
			</div>
			{/* Caller-ID sub-text (verbatim from copy deck). Lifted from /80 to /90
			 * for WCAG AA on the 9.5px italic copy (emerald base #10B981 4.96:1 on
			 * cc-foundation at full alpha; /90 composite clears 4.5:1 AA). */}
			<div className="px-1 pb-1">
				<p className="text-center text-[9.5px] italic leading-snug text-cc-accent/90">
					&ldquo;Your number, not a rented spam line.&rdquo;
				</p>
			</div>
			{/* Call button */}
			<div className="flex justify-center pb-3">
				<motion.button
					type="button"
					tabIndex={-1}
					aria-hidden="true"
					className="flex h-11 w-11 items-center justify-center rounded-full bg-cc-accent shadow-[0_0_16px_rgba(16,185,129,0.45)]"
					animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.05, 1] }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
				>
					<PhoneIcon size={18} weight="fill" className="text-cc-foundation" />
				</motion.button>
			</div>
		</motion.div>
	)
}

function ConnectingPanel({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	return (
		<motion.div
			key="connecting"
			className="flex h-full flex-col items-center justify-center gap-3 px-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
		>
			<div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-cc-accent/30">
				<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="56px" />
			</div>
			<span className="text-[12px] font-semibold text-white">Sarah Chen</span>
			<div className="flex items-center gap-1.5" aria-hidden="true">
				{[0, 1, 2].map((i) => (
					<motion.span
						key={i}
						className="block h-1.5 w-1.5 rounded-full bg-cc-accent"
						animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }
						}
					/>
				))}
			</div>
			<span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-cc-text-muted">
				Connecting
			</span>
		</motion.div>
	)
}

function LiveCallPanel({ timer, prefersReducedMotion }: { timer: number, prefersReducedMotion: boolean }) {
	return (
		<motion.div
			key="live"
			className="flex h-full flex-col gap-2 px-3 pb-3 pt-1.5"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
		>
			{/* Live call header */}
			<div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-cc-surface/50 px-2.5 py-1.5">
				<div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/10">
					<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="28px" />
				</div>
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-[10.5px] font-semibold text-white">Sarah Chen</span>
					<span className="truncate text-[8.5px] text-cc-text-secondary">VP Ops, Apex</span>
				</div>
				<div className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-[10px] text-cc-accent tabular-nums">
					<NumberFlow value={timer} format={{ minimumIntegerDigits: 2 }} prefix="00:" />
				</div>
			</div>
			{/* Transcript area + in-phone coaching annotations */}
			<div className="flex flex-1 flex-col gap-2 overflow-hidden py-1">
				<div className="mr-auto max-w-[88%] rounded-2xl rounded-bl-sm border border-l-2 border-white/[0.06] border-l-cc-accent/50 bg-cc-surface-card/80 px-2.5 py-1.5">
					<p className="text-[10.5px] italic leading-[1.4] text-cc-text-secondary">
						{TRANSCRIPT_AI}
					</p>
				</div>
				<InPhoneCoachingPill type="negative" label="Weak objection pivot" prefersReducedMotion={prefersReducedMotion} delay={0.25} align="left" />
				<div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm border border-cc-accent/20 bg-cc-accent/15 px-2.5 py-1.5">
					<p className="text-[10.5px] leading-[1.4] text-white">
						{TRANSCRIPT_USER}
					</p>
				</div>
				<InPhoneCoachingPill type="positive" label="Strong discovery question" prefersReducedMotion={prefersReducedMotion} delay={0.65} align="right" />
			</div>
			{/* Mute / End bar */}
			<div className="flex items-center justify-between gap-2 border-t border-white/[0.05] pt-1.5">
				<div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-cc-surface/60">
					<Microphone size={11} weight="regular" className="text-cc-text-secondary" aria-hidden="true" />
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[8.5px] uppercase tracking-[0.15em] text-cc-text-muted">
					Live
				</span>
				<div className="flex h-7 w-7 items-center justify-center rounded-full bg-cc-score-red/80">
					<PhoneIcon size={11} weight="fill" className="rotate-[135deg] text-white" aria-hidden="true" />
				</div>
			</div>
		</motion.div>
	)
}

/* In-phone coaching pill fired during 3C transcript moments. Lighter weight
 * than the signature pills in 3E; these are inline with the transcript. */
function InPhoneCoachingPill({ type, label, delay, prefersReducedMotion, align }: {
	type: 'positive' | 'negative'
	label: string
	delay: number
	prefersReducedMotion: boolean
	align: 'left' | 'right'
}) {
	const isPositive = type === 'positive'
	const pillClass = `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] font-medium ${isPositive
		? 'border-cc-accent/30 bg-cc-accent/10 text-cc-accent'
		: 'border-cc-score-red/30 bg-cc-score-red/10 text-red-400'
	}`
	const wrapperAlign = align === 'right' ? 'self-end' : 'self-start'
	return (
		<div className={wrapperAlign}>
			<motion.span
				className={pillClass}
				/* F39: stable initial. Reduced-motion snaps via duration: 0. */
				initial={{ opacity: 0, scale: 0.9, y: -4 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={prefersReducedMotion
					? { duration: 0 }
					: { type: 'spring', stiffness: 500, damping: 24, delay }
				}
			>
				{isPositive
					? <CheckCircle size={10} weight="fill" aria-hidden="true" />
					: <Warning size={10} weight="fill" aria-hidden="true" />
				}
				{label}
			</motion.span>
		</div>
	)
}

/* ─── Mode B interior (3D-3F) ──────────────────────────────── */

function ModeBInterior({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	return (
		<motion.div
			layoutId="cc-s3-step-three-interior"
			className="flex h-full w-full flex-col justify-between px-3 pb-3 pt-2"
		>
			{/* REC header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<span className="relative inline-flex h-2 w-2">
						<motion.span
							aria-hidden="true"
							className="absolute inset-0 rounded-full bg-cc-score-red"
							animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
							}
						/>
					</span>
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold tracking-[0.04em] text-red-400">REC</span>
					<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-text-muted tabular-nums">03:04</span>
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[8.5px] uppercase tracking-[0.15em] text-cc-text-muted">
					In-Person
				</span>
			</div>
			{/* Ambient waveform (center) */}
			<div className="flex flex-1 items-center justify-center py-2">
				<AmbientWaveform prefersReducedMotion={prefersReducedMotion} />
			</div>
			{/* Footer copy */}
			<div className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.05] bg-cc-surface/40 py-1.5">
				<Microphone size={11} weight="fill" className="text-cc-accent" aria-hidden="true" />
				<span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-secondary">
					Recording meeting
				</span>
			</div>
			{/* Annotation trails are drawn in the outer component so they can extend
			 * OUTSIDE the phone during 3E. Only the source indicator lives here. */}
			{(subState === '3E' || subState === '3F') && (
				<div className="absolute inset-0 pointer-events-none" aria-hidden="true">
					<div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cc-accent/5 blur-2xl" />
				</div>
			)}
		</motion.div>
	)
}

/* Lightweight local waveform. 24 bars; low amplitude with per-bar shimmer so
 * the "ambient listen" read carries. Reduced-motion freezes bars at idle. */
function AmbientWaveform({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	const bars = 24
	const barData = useMemo(() =>
		Array.from({ length: bars }).map((_, i) => {
			const base = Math.sin(i * 0.35) * 0.5 + 0.5
			return { base, phase: i * 0.15, speed: 1.1 + (i % 3) * 0.25 }
		}), [])
	return (
		<div className="flex h-[50px] w-full items-center justify-center gap-[2px]">
			{barData.map((bar, i) => (
				<motion.span
					key={i}
					className="block w-[2px] rounded-full bg-cc-accent"
					animate={prefersReducedMotion
						? { height: `${bar.base * 28}px`, opacity: 0.6 }
						: {
							height: [`${bar.base * 40}px`, `${bar.base * 14}px`, `${bar.base * 40}px`],
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
	)
}

/* ─── Room-blur backdrop (behind phone, 3D+) ───────────────── */

function RoomBlurBackdrop({ active, prefersReducedMotion }: { active: boolean, prefersReducedMotion: boolean }) {
	return (
		<motion.div
			aria-hidden="true"
			className="pointer-events-none absolute inset-[-6%] -z-10 rounded-[3rem]"
			style={{
				background: 'radial-gradient(ellipse at 30% 40%, rgba(16,185,129,0.12) 0%, transparent 45%), radial-gradient(ellipse at 75% 65%, rgba(0,0,0,0.55) 0%, transparent 55%), linear-gradient(135deg, rgba(13,15,20,0.7) 0%, rgba(26,29,38,0.2) 50%, rgba(0,0,0,0.5) 100%)',
				filter: 'blur(32px)',
			}}
			/* F39: stable initial. Reduced-motion settles visible at 3F via duration: 0. */
			initial={{ opacity: 0 }}
			animate={{ opacity: active ? 1 : 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: THREAD_EASE }}
		/>
	)
}

/* ─── Annotations-spring-OUT (3E signature moment) ─────────── */

/* One annotation pill. Emerges from the phone edge (derived from anchor.startDX /
 * startDY) and lands at the anchor's absolute position. Arc is implied by the
 * spring + offset origin; no actual SVG path. Emerald/red glow trails the travel.
 * Reduced-motion: pill renders at final position with full opacity, no travel.
 * At 3F (isSettled), pills gain an ambient breath (scale 1.02 cycle + opacity
 * drift) to lift the post-arrival feel. Reduced-motion suppresses the breath. */
function AnnotationPill({ spec, visible, isSettled, index, prefersReducedMotion }: {
	spec: AnnotationSpec
	visible: boolean
	isSettled: boolean
	index: number
	prefersReducedMotion: boolean
}) {
	const isPositive = spec.type === 'positive'
	const { top, side, offset, startDX, startDY } = ANCHOR_POSITIONS[spec.anchor]
	const positionStyle: React.CSSProperties = side === 'left'
		? { top, left: offset }
		: { top, right: offset }
	const pillClass = `relative inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${isPositive
		? 'border-cc-accent/40 bg-cc-accent/15 text-cc-accent'
		: 'border-cc-score-red/40 bg-cc-score-red/15 text-red-400'
	}`
	const timestampClass = `ml-1 font-[family-name:var(--font-mono)] text-[8.5px] tabular-nums ${isPositive ? 'text-cc-accent/85' : 'text-red-400/85'}`
	const glowColor = isPositive ? '16,185,129' : '239,68,68'

	/* Ambient breath on settled pills (P1 polish). Scale 1.02 cycle + opacity
	 * drift, 3.2s loop, staggered 0.4s per pill so they breathe out of sync.
	 * Gated by isSettled AND !prefersReducedMotion. At 3E (visible but not
	 * settled), the spring-arrival animation still runs on its own path. */
	const breatheSettled = isSettled && !prefersReducedMotion
	const settledAnimate = breatheSettled
		? { opacity: [0.95, 1, 0.95], scale: [1, 1.02, 1], x: 0, y: 0 }
		: { opacity: 1, scale: 1, x: 0, y: 0 }
	const settledTransition = breatheSettled
		? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay: index * 0.4 }
		: prefersReducedMotion
			? { duration: 0 }
			: { type: 'spring' as const, stiffness: 260, damping: 22, delay: 0.15 * index, mass: 0.9 }

	return (
		<motion.div
			className="absolute z-20"
			style={positionStyle}
			/* F39: stable initial. Reduced-motion: visible=true settled, snaps from
			 * emerging start -> final via duration: 0. */
			initial={{ opacity: 0, scale: 0.7, x: startDX, y: startDY }}
			animate={visible
				? settledAnimate
				: { opacity: 0, scale: 0.7, x: startDX, y: startDY }
			}
			transition={visible
				? settledTransition
				: prefersReducedMotion
					? { duration: 0 }
					: { type: 'spring', stiffness: 260, damping: 22, delay: 0.15 * index, mass: 0.9 }
			}
		>
			{/* Glow trail behind the pill. Only active during spring-out, fades after
			 * the pill lands. Reduced-motion suppresses entirely. */}
			{visible && !prefersReducedMotion && (
				<motion.span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-full"
					initial={{ boxShadow: `0 0 0px rgba(${glowColor},0)` }}
					animate={{
						boxShadow: [
							`0 0 0px rgba(${glowColor},0)`,
							`0 0 20px rgba(${glowColor},0.55)`,
							`0 0 6px rgba(${glowColor},0.15)`,
						],
					}}
					transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 * index }}
				/>
			)}
			<span className={pillClass}>
				{isPositive
					? <CheckCircle size={12} weight="fill" aria-hidden="true" />
					: <Warning size={12} weight="fill" aria-hidden="true" />
				}
				{spec.label}
				<span className={timestampClass}>{spec.timestamp}</span>
			</span>
		</motion.div>
	)
}

/* Edge-ripple source indicator at the phone edge, firing in sync with each
 * annotation pill's 3E emergence. Positioned absolutely against the outer
 * relative container (same coordinate space as AnnotationPill): left-side
 * anchors ripple at `right: calc(50% + 120px)` (phone's left edge), right-side
 * anchors ripple at `left: calc(50% + 120px)` (phone's right edge). A small
 * emerald/red dot briefly expands + fades, matching each pill's 0.15 * index
 * delay so the pill appears to originate from that ripple. Reduced-motion
 * suppresses entirely via opacity 0 + duration 0. */
function EdgeRipple({ spec, active, index, prefersReducedMotion }: {
	spec: AnnotationSpec
	active: boolean
	index: number
	prefersReducedMotion: boolean
}) {
	const isPositive = spec.type === 'positive'
	const { top, side } = ANCHOR_POSITIONS[spec.anchor]
	/* Anchor the ripple AT the phone edge (120px from container center).
	 * Matches phone-left-edge for side='right' pills, phone-right-edge for
	 * side='left' pills. Top offset is tuned to sit near the pill's vertical
	 * anchor so the ripple and pill share a visible origin. */
	const ripplePosition: React.CSSProperties = side === 'left'
		? { top, right: 'calc(50% + 120px)' }
		: { top, left: 'calc(50% + 120px)' }
	const rippleClass = `pointer-events-none absolute h-3 w-3 -translate-y-1/2 rounded-full ${isPositive ? 'bg-cc-accent' : 'bg-cc-score-red'}`

	const canFire = active && !prefersReducedMotion

	return (
		<motion.span
			aria-hidden="true"
			className={rippleClass}
			style={ripplePosition}
			/* F39: stable initial. All ripple motion lives in animate + transition. */
			initial={{ opacity: 0, scale: 0 }}
			animate={canFire
				? { opacity: [0, 0.7, 0], scale: [0, 2.4, 3] }
				: { opacity: 0, scale: 0 }
			}
			transition={canFire
				? { duration: 0.6, delay: 0.15 * index, ease: 'easeOut' }
				: { duration: 0 }
			}
		/>
	)
}

/* ─── Dev pin hook ─────────────────────────────────────────── */

/* Gated behind `enabled` prop (W6). Production never reads URLSearchParams. */
function useSubStatePin(enabled: boolean): SubState | null {
	const [pin, setPin] = useState<SubState | null>(null)
	useEffect(() => {
		if (!enabled) return
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return
			const raw = new URLSearchParams(window.location.search).get('pin')
			if (raw === '3A' || raw === '3B' || raw === '3C' || raw === '3D' || raw === '3E' || raw === '3F') {
				setPin(raw)
			}
		}, 0)
		return () => clearTimeout(t)
	}, [enabled])
	return pin
}

/* ─── Main component ───────────────────────────────────────── */

export default function StepThreeVisual({ devPin = false }: { devPin?: boolean } = {}) {
	const prefersReducedMotion = useReducedMotion() ?? false
	const rootRef = useRef<HTMLDivElement>(null)
	const inView = useInView(rootRef, { amount: 0.3, once: true })
	const pin = useSubStatePin(devPin)
	const machineState = useSubStateMachine<SubState>({
		states: STEP_THREE_STATES,
		trigger: inView,
		reducedMotion: prefersReducedMotion,
		initialState: '3A',
		settledState: '3F',
		once: true,
	})
	const subState: SubState = pin ?? machineState

	const modeBActive = subState === '3D' || subState === '3E' || subState === '3F'
	const annotationsOut = subState === '3E' || subState === '3F'
	const isSettled = subState === '3F'
	const ripplesFiring = subState === '3E'

	return (
		<div
			ref={rootRef}
			data-step="3"
			data-sub-state={subState}
			className="relative mx-auto flex h-full w-full max-w-[480px] flex-col items-center justify-center gap-5"
		>
			{/* Toggles above phone */}
			<DualModeToggles subState={subState} prefersReducedMotion={prefersReducedMotion} />

			{/* Phone + annotation surface. The relative wrapper below spans the full
			 * outer column width (not just the phone width) so annotations can anchor
			 * to the dark surface surrounding the phone. The inner motion.div
			 * contains just the phone + room-blur. */}
			<LayoutGroup>
				<div className="relative w-full">
					<motion.div
						className="relative mx-auto flex w-fit justify-center"
						/* F39: stable initial. Reduced-motion snaps via duration: 0. */
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : CARD_ENTER_SPRING}
					>
						<RoomBlurBackdrop active={modeBActive} prefersReducedMotion={prefersReducedMotion} />

						<PhoneFrame mode={modeBActive ? 'B' : 'A'}>
							<AnimatePresence mode="wait" initial={false}>
								{modeBActive
									? (
										<ModeBInterior
											key="mode-b"
											subState={subState}
											prefersReducedMotion={prefersReducedMotion}
										/>
									)
									: (
										<ModeAInterior
											key="mode-a"
											subState={subState}
											prefersReducedMotion={prefersReducedMotion}
										/>
									)
								}
							</AnimatePresence>
						</PhoneFrame>
					</motion.div>

					{/* Edge-ripples at phone edges, firing in sync with each pill's 3E
					 * emergence stagger. Signals the pills originate FROM the phone. */}
					{ANNOTATIONS.map((spec, i) => (
						<EdgeRipple
							key={`ripple-${spec.id}`}
							spec={spec}
							active={ripplesFiring}
							index={i}
							prefersReducedMotion={prefersReducedMotion}
						/>
					))}

					{/* Annotations spring OUT around the phone (3E signature + 3F settled).
					 * Positioned absolute against the full-width outer relative container
					 * so left-side pills land on the surface LEFT of the phone, not inside it. */}
					{ANNOTATIONS.map((spec, i) => (
						<AnnotationPill
							key={spec.id}
							spec={spec}
							visible={annotationsOut}
							isSettled={isSettled}
							index={i}
							prefersReducedMotion={prefersReducedMotion}
						/>
					))}
				</div>
			</LayoutGroup>
		</div>
	)
}
