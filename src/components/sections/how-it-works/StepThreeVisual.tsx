'use client'

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup, useInView, useReducedMotion, useAnimation } from 'motion/react'
import Image from 'next/image'
import {
	CheckCircle,
	Lightning,
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

const SARAH_IMG = '/images/prospects/sarah-chen.webp'
const CC_LOGO = '/cc-logo.png'

const T_3B = 0
const T_3C = 1600
const T_3D = 8000
const T_3E = 9600
const T_3F = 11200

type SubState = '3B' | '3C' | '3D' | '3E' | '3F'

const STEP_THREE_STATES: ReadonlyArray<{ id: SubState, enterAtMs: number }> = [
	{ id: '3B', enterAtMs: T_3B },
	{ id: '3C', enterAtMs: T_3C },
	{ id: '3D', enterAtMs: T_3D },
	{ id: '3E', enterAtMs: T_3E },
	{ id: '3F', enterAtMs: T_3F },
] as const

const TRANSCRIPT_AI = 'Honestly, I just don\u2019t think it\u2019s worth it at that price..'
const TRANSCRIPT_USER = 'I hear you. Can I ask what\u2019s working well with your current setup?'
const TRANSCRIPT_CLOSE = 'Alright, let\u2019s do it!'

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
type AnchorPos = { top: string, mTop: string, side: 'left' | 'right', offset: string, startDX: number, startDY: number, mStartDX: number, mStartDY: number }
const ANCHOR_POSITIONS: Record<AnnotationSpec['anchor'], AnchorPos> = {
	'top-left':     { top: '4%',  mTop: '22%', side: 'right', offset: 'calc(50% + 132px)', startDX:  50, startDY:  40, mStartDX:  10, mStartDY:  8 },
	'top-right':    { top: '14%', mTop: '32%', side: 'left',  offset: 'calc(50% + 132px)', startDX: -50, startDY:  30, mStartDX: -10, mStartDY:  8 },
	'bottom-left':  { top: '64%', mTop: '58%', side: 'right', offset: 'calc(50% + 132px)', startDX:  50, startDY: -30, mStartDX:  10, mStartDY: -8 },
	'bottom-right': { top: '72%', mTop: '72%', side: 'left',  offset: 'calc(50% + 132px)', startDX: -50, startDY: -20, mStartDX: -10, mStartDY: -8 },
}

/* ─── Dual-mode toggle row (above phone) ────────────────────── */

function DualModeToggles({
	modeBActive,
	onSelect,
	prefersReducedMotion,
}: {
	modeBActive: boolean
	onSelect: (mode: 'A' | 'B') => void
	prefersReducedMotion: boolean
}) {
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

	const handleKey = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
		e.preventDefault()
		const next = e.key === 'ArrowRight' ? (idx + 1) % 2 : (idx + 1) % 2 /* 2-tab: Left == Right */
		const target = tabRefs.current[next]
		if (target) {
			target.focus()
			onSelect(next === 0 ? 'A' : 'B')
		}
	}, [onSelect])

	return (
		<div
			role="tablist"
			aria-label="Call mode"
			className="relative inline-flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-[3px]"
		>
			<ModeToggle
				ref={(el) => { tabRefs.current[0] = el }}
				id="cc-s3-tab-mode-a"
				icon={<PhoneIcon size={10} weight="fill" aria-hidden="true" />}
				label="Phone Call"
				active={!modeBActive}
				prefersReducedMotion={prefersReducedMotion}
				onClick={() => onSelect('A')}
				onKeyDown={(e) => handleKey(e, 0)}
				controlsPanelId="cc-s3-tabpanel-mode-a"
			/>
			<ModeToggle
				ref={(el) => { tabRefs.current[1] = el }}
				id="cc-s3-tab-mode-b"
				icon={<Microphone size={10} weight="fill" aria-hidden="true" />}
				label="Record In-Person"
				active={modeBActive}
				prefersReducedMotion={prefersReducedMotion}
				onClick={() => onSelect('B')}
				onKeyDown={(e) => handleKey(e, 1)}
				controlsPanelId="cc-s3-tabpanel-mode-b"
			/>
		</div>
	)
}

type ModeToggleProps = {
	id: string
	icon: React.ReactNode
	label: string
	active: boolean
	prefersReducedMotion: boolean
	onClick: () => void
	onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void
	controlsPanelId: string
}

const ModeToggle = forwardRef<HTMLButtonElement, ModeToggleProps>(function ModeToggle(
	{ id, icon, label, active, prefersReducedMotion, onClick, onKeyDown, controlsPanelId },
	ref,
) {
	return (
		<motion.button
			ref={ref}
			id={id}
			type="button"
			role="tab"
			aria-selected={active}
			aria-controls={controlsPanelId}
			tabIndex={active ? 0 : -1}
			onClick={onClick}
			onKeyDown={onKeyDown}
			className="relative inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.15em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent/60"
			initial={{ opacity: 1 }}
			animate={{
				backgroundColor: active ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0)',
				color: active ? '#10B981' : 'rgba(148,163,184,0.6)',
			}}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: THREAD_EASE }}
		>
			{icon}
			{label}
		</motion.button>
	)
})

/* ─── Phone Frame (shared shell) ───────────────────────────── */

/* Static outer shell. Bezel + Dynamic Island match hero-phone-v3 vocabulary.
 * Interior is passed as children; the interior is the layoutId morph target,
 * not the shell (so the shell doesn't jitter during mode swap). */
function PhoneFrame({ children, mode }: { children: React.ReactNode, mode: 'A' | 'B' }) {
	return (
		<div className="relative z-10 w-[280px] lg:w-[240px]">
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
								{mode === 'A' ? 'Phone Call' : 'In-Person'}
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

/* ─── Mode A interior (3B-3C) ──────────────────────────────── */

function ModeAInterior({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	const isConnecting = subState === '3B'
	const isLive = subState === '3C'

	return (
		<motion.div
			className="absolute inset-0 flex h-full w-full flex-col"
			role="tabpanel"
			id="cc-s3-tabpanel-mode-a"
			aria-labelledby="cc-s3-tab-mode-a"
			/* Crossfade between Mode A and Mode B interiors via absolute overlap +
			 * AnimatePresence. Sharing a layoutId between the two used to handle
			 * the morph but it short-circuited the opacity tween once both could
			 * coexist (Motion treated them as one morphing element rather than
			 * sibling enter/exit), so the layoutId is removed. */
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			{isConnecting && <ConnectingPanel prefersReducedMotion={prefersReducedMotion} />}
			{isLive && <LiveCallPanel prefersReducedMotion={prefersReducedMotion} />}
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

/* Semi-circle interest meter (speedometer). Radius 16, centered at (cx=22, cy=22).
 * Arc: M 6 22 A 16 16 0 0 1 38 22 (left to right). Gradient: red→amber→green.
 * Dot placed at the 98% position near the right end of the arc. */
function InterestMeter({ value = 98 }: { value?: number }) {
	const R = 16, cx = 22, cy = 22
	const circ = Math.PI * R
	const fill = (value / 100) * circ
	const angleRad = Math.PI * (1 - value / 100)
	const dotX = cx + R * Math.cos(angleRad)
	const dotY = cy - R * Math.sin(angleRad)
	return (
		<div className="flex flex-col items-center gap-0">
			<div className="relative" style={{ width: 44, height: 24 }}>
				<svg width="44" height="24" viewBox="0 0 44 24" aria-hidden="true">
					<defs>
						<linearGradient id="s3-meter-grad" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#ef4444" />
							<stop offset="45%" stopColor="#f59e0b" />
							<stop offset="100%" stopColor="#10B981" />
						</linearGradient>
					</defs>
					<path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
						fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2.5" strokeLinecap="round" />
					<path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
						fill="none" stroke="url(#s3-meter-grad)" strokeWidth="2.5" strokeLinecap="round"
						strokeDasharray={`${circ}`} strokeDashoffset={`${circ - fill}`} />
					<circle cx={dotX} cy={dotY} r="2.5" fill="#10B981" />
				</svg>
				<div className="absolute inset-0 flex items-end justify-center pb-[1px]">
					<span className="font-[family-name:var(--font-mono)] text-[9px] font-bold leading-none text-white">{value}</span>
				</div>
			</div>
			<span className="font-[family-name:var(--font-mono)] text-[6px] uppercase tracking-[0.08em] text-cc-text-muted">Interest Meter</span>
		</div>
	)
}

function LiveCallPanel({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	/* Staggered reveal: contact card → AI bubble → user reply (with attached
	 * Winning Response badge as one component) → Alright / DEAL CLOSED → $24.5k
	 * deal card. Each element mounts individually so AnimatePresence initial
	 * state actually fires. */
	const EASE_INNER: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
	const [showContact, setShowContact] = useState(prefersReducedMotion)
	const [showAi, setShowAi] = useState(prefersReducedMotion)
	const [showUser, setShowUser] = useState(prefersReducedMotion)
	const [showClose, setShowClose] = useState(prefersReducedMotion)
	const [showDeal, setShowDeal] = useState(prefersReducedMotion)

	useEffect(() => {
		if (prefersReducedMotion) return
		const t1 = setTimeout(() => setShowContact(true), 150)
		const t2 = setTimeout(() => setShowAi(true), 500)
		const t3 = setTimeout(() => setShowUser(true), 1100)
		const t4 = setTimeout(() => setShowClose(true), 1750)
		const t5 = setTimeout(() => setShowDeal(true), 2350)
		return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
	}, [prefersReducedMotion])

	return (
		<motion.div
			key="live"
			className="relative flex h-full flex-col gap-1.5 overflow-hidden px-2.5 pb-2.5 pt-1"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
		>
			{/* Celebration flash: brief emerald radial pulse when the deal closes.
			 * Fires once at showDeal=true. Sits behind content (z-0 relative to
			 * conversation flow) but reads as an ambient "this is the moment" beat. */}
			<AnimatePresence>
				{showDeal && !prefersReducedMotion && (
					<motion.div
						key="celebration-flash"
						aria-hidden="true"
						className="pointer-events-none absolute inset-0"
						style={{
							background:
								'radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.10) 35%, transparent 65%)',
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0.25] }}
						transition={{ duration: 1.4, ease: 'easeOut', times: [0, 0.18, 1] }}
					/>
				)}
			</AnimatePresence>

			{/* "REAL SALES CALL" badge */}
			<div className="relative z-[1] flex items-center">
				<span className="inline-flex items-center gap-1 rounded-md bg-cc-accent/20 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[8px] font-semibold uppercase tracking-[0.12em] text-cc-accent">
					<PhoneIcon size={7} weight="fill" aria-hidden="true" />
					Real Sales Call
				</span>
			</div>

			{/* Contact card: avatar + name/title + interest meter */}
			<AnimatePresence>
				{showContact && (
					<motion.div
						key="contact"
						className="relative z-[1] flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[rgba(30,34,48,0.7)] px-2.5 py-2"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_INNER }}
					>
						<div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
							<Image src={SARAH_IMG} alt="Sarah Chen" fill className="object-cover" sizes="36px" />
						</div>
						<div className="flex min-w-0 flex-1 flex-col">
							<span className="text-[11px] font-semibold text-white">Sarah Chen</span>
							<span className="text-[9px] text-cc-text-secondary">VP Operations</span>
						</div>
						<InterestMeter value={98} />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Divider */}
			<div className="relative z-[1] flex items-center gap-1.5 py-0.5">
				<div className="h-px flex-1 bg-white/[0.06]" />
				<span className="font-[family-name:var(--font-mono)] text-[7.5px] text-cc-text-muted">Start of call · 0:00</span>
				<div className="h-px flex-1 bg-white/[0.06]" />
			</div>

			{/* Conversation */}
			<div className="relative z-[1] flex flex-1 flex-col gap-1.5 overflow-hidden">
				<AnimatePresence>
					{showAi && (
						<motion.div
							key="ai-line"
							className="flex items-end gap-1.5"
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_INNER }}
						>
							<div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
								<Image src={SARAH_IMG} alt="" fill className="object-cover" sizes="20px" />
							</div>
							<div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-[rgba(40,44,58,0.9)] px-2.5 py-1.5">
								<p className="text-[9.5px] leading-[1.45] text-cc-text-secondary">{TRANSCRIPT_AI}</p>
							</div>
						</motion.div>
					)}
					{showUser && (
						<motion.div
							key="winning-group"
							/* Merged "Winning Response" group: badge sits attached above the
							 * user bubble, both read as one highlighted unit. The bubble's
							 * text + padding are sized up vs surrounding messages so this
							 * beat carries visual weight. Calm ease-out entrance — no spring
							 * overshoot, no scale-pop. mt-3 reserves room for the badge to
							 * extend above the bubble's top edge. */
							className="relative ml-auto mt-3 max-w-[94%] self-end"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 0.45, ease: EASE_INNER }
							}
						>
							{/* Winning Response badge: dark pill with emerald label, anchored
							 * to the top-left corner of the bubble. Sits inside the bubble's
							 * top-padding zone so it never covers the message text. */}
							<span
								className="absolute -top-2 left-2 z-[2] inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-[rgba(20,22,30,0.95)] px-2 py-[3px] font-semibold text-cc-accent shadow-[0_4px_10px_rgba(0,0,0,0.35)] backdrop-blur-sm"
								style={{ fontSize: '9.5px', letterSpacing: '0.01em' }}
							>
								<Lightning size={9} weight="fill" aria-hidden="true" />
								Winning Response
							</span>
							{/* User bubble — meaningfully larger than surrounding messages
							 * (12px vs 9.5px, generous pt-4 to clear the badge). Subtle blue
							 * glow shadow so it reads as the emphasized winning beat. */}
							<div
								className="rounded-2xl rounded-br-sm bg-blue-500 px-3.5 pb-3 pt-4 shadow-[0_4px_18px_rgba(59,130,246,0.30)]"
							>
								<p className="text-[12px] leading-[1.4] text-white">{TRANSCRIPT_USER}</p>
							</div>
						</motion.div>
					)}
					{showClose && (
						<motion.div
							key="close"
							className="flex flex-col gap-1.5"
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_INNER }}
						>
							<div className="flex items-end gap-1.5">
								<div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
									<Image src={SARAH_IMG} alt="" fill className="object-cover" sizes="20px" />
								</div>
								<motion.div
									className="rounded-2xl rounded-bl-sm border border-cc-accent/50 bg-cc-foundation px-2.5 py-1.5"
									animate={prefersReducedMotion
										? undefined
										: {
											boxShadow: [
												'0 0 0px rgba(16,185,129,0)',
												'0 0 16px rgba(16,185,129,0.55)',
												'0 0 8px rgba(16,185,129,0.25)',
											],
										}
									}
									transition={prefersReducedMotion ? undefined : { duration: 1.1, ease: 'easeOut' }}
								>
									<p className="text-[9.5px] font-medium leading-[1.45] text-white">{TRANSCRIPT_CLOSE}</p>
								</motion.div>
							</div>
							<motion.div
								className="ml-7 flex items-center gap-1.5"
								initial={{ opacity: 0, scale: 0.7 }}
								animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : [0.7, 1.25, 1] }}
								transition={prefersReducedMotion
									? { duration: 0 }
									: { duration: 0.7, ease: 'easeOut', times: [0, 0.5, 1], delay: 0.2 }
								}
							>
								<Lightning size={11} weight="fill" className="text-cc-accent" aria-hidden="true" />
								<span className="font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.14em] text-cc-accent">
									Deal Closed
								</span>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Deal card — the moment. Bouncy spring entrance, expanding glow rings,
			 * the $ figure pops with a follow-up scale flourish, Personal Best
			 * badge slides in last. Reduced-motion collapses to settled instantly. */}
			<AnimatePresence>
				{showDeal && (
					<motion.div
						key="deal"
						className="relative z-[1] flex flex-col items-center justify-center overflow-visible rounded-2xl border border-cc-accent/40 bg-[rgba(16,185,129,0.10)] py-3 shadow-[0_0_28px_rgba(16,185,129,0.30)]"
						initial={{ opacity: 0, y: 12, scale: 0.7 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={prefersReducedMotion
							? { duration: 0 }
							: { type: 'spring', stiffness: 220, damping: 14, mass: 0.85 }
						}
					>
						{/* Expanding glow rings: two staggered emerald rings ripple outward
						 * the moment the card lands, signalling celebration. */}
						{!prefersReducedMotion && (
							<>
								<motion.span
									aria-hidden="true"
									className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-cc-accent"
									initial={{ opacity: 0.7, scale: 1 }}
									animate={{ opacity: 0, scale: 1.22 }}
									transition={{ duration: 1.0, ease: 'easeOut' }}
								/>
								<motion.span
									aria-hidden="true"
									className="pointer-events-none absolute inset-0 rounded-2xl border border-cc-accent"
									initial={{ opacity: 0.55, scale: 1 }}
									animate={{ opacity: 0, scale: 1.4 }}
									transition={{ duration: 1.4, ease: 'easeOut', delay: 0.18 }}
								/>
							</>
						)}
						<motion.span
							className="font-[family-name:var(--font-heading)] font-bold leading-none text-cc-accent"
							style={{
								fontSize: '30px',
								letterSpacing: '-0.5px',
								textShadow: '0 0 18px rgba(16,185,129,0.45)',
							}}
							initial={{ scale: 0.7 }}
							animate={{ scale: prefersReducedMotion ? 1 : [0.7, 1.12, 1] }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 0.65, ease: 'easeOut', times: [0, 0.55, 1], delay: 0.12 }
							}
						>
							$24.5k
						</motion.span>
						<motion.div
							className="mt-2 flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-accent/15 px-2 py-0.5"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 0.4, ease: 'easeOut', delay: 0.55 }
							}
						>
							<Lightning size={8} weight="fill" className="text-cc-accent" aria-hidden="true" />
							<span className="font-[family-name:var(--font-mono)] text-[8px] font-semibold text-cc-accent">Personal Best</span>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

/* ─── Mode B interior (3D-3F) ──────────────────────────────── */

function ModeBInterior({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	return (
		<motion.div
			className="absolute inset-0 flex h-full w-full flex-col justify-between px-3 pb-3 pt-2"
			role="tabpanel"
			id="cc-s3-tabpanel-mode-b"
			aria-labelledby="cc-s3-tab-mode-b"
			/* Match Mode A's crossfade timing so the mode swap reads as one smooth
			 * crossfade rather than a wait-then-pop. */
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
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
			</div>
			{/* Ambient waveform (center) */}
			<div className="flex flex-1 items-center justify-center py-2">
				<AmbientWaveform prefersReducedMotion={prefersReducedMotion} />
			</div>
			{/* Footer pill: mic indicator only */}
			<div className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.05] bg-cc-surface/40 py-1.5">
				<Microphone size={11} weight="fill" className="text-cc-accent" aria-hidden="true" />
				<span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-secondary">
					Live Session
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
function AnnotationPill({ spec, visible, isSettled, index, prefersReducedMotion, mobileOffset }: {
	spec: AnnotationSpec
	visible: boolean
	isSettled: boolean
	index: number
	prefersReducedMotion: boolean
	mobileOffset: boolean
}) {
	const isPositive = spec.type === 'positive'
	const { top, mTop, side, startDX, startDY, mStartDX, mStartDY } = ANCHOR_POSITIONS[spec.anchor]
	const resolvedTop = mobileOffset ? mTop : top
	/* On mobile the pills overflow the viewport at 132px. Use a tighter offset
	 * so pills stay visible. Pill itself is ~110px wide; at 50px offset the
	 * right edge lands at 50vw + 50 + 110 = well within 375px. */
	const offset = mobileOffset ? 'calc(50% + 6px)' : 'calc(50% + 132px)'
	/* Mobile uses tiny travel distances so pills never enter the clipped zone. */
	const dx = mobileOffset ? mStartDX : startDX
	const dy = mobileOffset ? mStartDY : startDY
	const positionStyle: React.CSSProperties = side === 'left'
		? { top: resolvedTop, left: offset }
		: { top: resolvedTop, right: offset }
	const pillClass = `relative inline-flex items-center gap-1 whitespace-nowrap rounded-full border backdrop-blur-sm ${
		mobileOffset ? 'px-1.5 py-[3px] text-[8px]' : 'px-2.5 py-1 text-[11px]'
	} font-medium ${isPositive
		? 'border-cc-accent/40 bg-cc-accent/15 text-cc-accent'
		: 'border-cc-score-red/40 bg-cc-score-red/15 text-red-400'
	}`
	const timestampClass = `ml-1 font-[family-name:var(--font-mono)] tabular-nums ${mobileOffset ? 'text-[7px]' : 'text-[8.5px]'} ${isPositive ? 'text-cc-accent/85' : 'text-red-400/85'}`
	const glowColor = isPositive ? '16,185,129' : '239,68,68'

	/* useAnimation controls let us snap to startDX/startDY then spring to final
	 * position on EVERY visible=true transition — not just on initial mount.
	 * This fixes the snap-back bug where Framer Motion would re-apply `initial`
	 * after a visible false->true cycle. */
	const controls = useAnimation()

	useEffect(() => {
		if (prefersReducedMotion) {
			controls.set(visible ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 1, x: 0, y: 0 })
			return
		}
		if (visible) {
			if (isSettled) {
				/* Settled breath: pills already at (0,0) from entrance; just drift opacity+scale. */
				controls.start({
					opacity: [0.95, 1, 0.95], scale: [1, 1.02, 1], x: 0, y: 0,
					transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 },
				})
			} else if (mobileOffset) {
				/* Mobile: pure fade+scale only — no x/y travel so there is zero snap-back
				 * and zero risk of pills entering the overflow-x:clip zone. */
				controls.set({ opacity: 0, scale: 0.8, x: 0, y: 0 })
				controls.start({
					opacity: 1, scale: 1, x: 0, y: 0,
					transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.12 * index },
				})
			} else {
				/* Desktop: travel from phone edge, smooth ease-out (no spring overshoot). */
				controls.set({ opacity: 0, scale: 0.85, x: dx, y: dy })
				controls.start({
					opacity: 1, scale: 1, x: 0, y: 0,
					transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 * index },
				})
			}
		} else {
			controls.start({
				opacity: 0, scale: 0.95, x: 0, y: 0,
				transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
			})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible, isSettled, prefersReducedMotion, mobileOffset])

	return (
		<motion.div
			className="absolute z-20"
			style={positionStyle}
			initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
			animate={controls}
		>
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

function useSubStatePin(enabled: boolean): SubState | null {
	const [pin, setPin] = useState<SubState | null>(null)
	useEffect(() => {
		if (!enabled) return
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return
			const raw = new URLSearchParams(window.location.search).get('pin')
			if (raw === '3B' || raw === '3C' || raw === '3D' || raw === '3E' || raw === '3F') {
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
	const [mobileOffset, setMobileOffset] = useState(false)
	useEffect(() => {
		const check = () => setMobileOffset(window.innerWidth < 640)
		check()
		window.addEventListener('resize', check)
		return () => window.removeEventListener('resize', check)
	}, [])
	const inView = useInView(rootRef, { amount: 0.3, once: true })
	const pin = useSubStatePin(devPin)
	const machineState = useSubStateMachine<SubState>({
		states: STEP_THREE_STATES,
		trigger: inView,
		reducedMotion: prefersReducedMotion,
		initialState: '3B',
		settledState: '3F',
		once: true,
	})
	const subState: SubState = pin ?? machineState

	const [userMode, setUserMode] = useState<'A' | 'B' | null>(null)
	const handleModeSelect = useCallback((mode: 'A' | 'B') => {
		setUserMode(mode)
	}, [])

	const machineModeBActive = subState === '3D' || subState === '3E' || subState === '3F'
	const modeBActive = userMode === null ? machineModeBActive : userMode === 'B'
	/* When user forces Mode B, reveal annotations settled; when user forces
	 * Mode A, hide them (they belong to the Mode B signature moment). */
	const annotationsOut = userMode === 'B'
		? true
		: userMode === 'A'
			? false
			: subState === '3E' || subState === '3F'
	const isSettled = userMode === 'B' ? true : userMode === 'A' ? false : subState === '3F'
	/* Ripples only fire during the one-time 3E signature moment. User clicks
	 * don't re-trigger them (would read as decorative noise on repeat toggle). */
	const ripplesFiring = userMode === null && subState === '3E'

	/* Effective substate for Mode A interior panel: pinned to 3C (live call) when
	 * user forces Mode A; otherwise the state machine's value. For Mode B,
	 * ModeBInterior reads subState directly (3D/3E/3F all render the record UI). */
	const modeAEffectiveSubState: SubState = userMode === 'A' ? '3C' : subState
	const modeBEffectiveSubState: SubState = userMode === 'B' ? '3F' : subState

	return (
		<div
			ref={rootRef}
			data-step="3"
			data-sub-state={subState}
			data-user-mode={userMode ?? 'auto'}
			className="relative mx-auto flex h-full w-full max-w-[480px] flex-col items-center justify-center gap-5"
		>
			{/* Toggles above phone */}
			<DualModeToggles
				modeBActive={modeBActive}
				onSelect={handleModeSelect}
				prefersReducedMotion={prefersReducedMotion}
			/>

			{/* Phone + annotation surface. The relative wrapper below spans the full
			 * outer column width (not just the phone width) so annotations can anchor
			 * to the dark surface surrounding the phone. The inner motion.div
			 * contains just the phone + room-blur. */}
			<LayoutGroup>
				<div className="relative w-full overflow-visible">
					<motion.div
						className="relative mx-auto flex w-fit justify-center"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : CARD_ENTER_SPRING}
					>
						<RoomBlurBackdrop active={modeBActive} prefersReducedMotion={prefersReducedMotion} />

						<PhoneFrame mode={modeBActive ? 'B' : 'A'}>
							<AnimatePresence initial={false}>
								{modeBActive
									? (
										<ModeBInterior
											key="mode-b"
											subState={modeBEffectiveSubState}
											prefersReducedMotion={prefersReducedMotion}
										/>
									)
									: (
										<ModeAInterior
											key="mode-a"
											subState={modeAEffectiveSubState}
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
							mobileOffset={mobileOffset}
						/>
					))}
				</div>
			</LayoutGroup>
		</div>
	)
}
