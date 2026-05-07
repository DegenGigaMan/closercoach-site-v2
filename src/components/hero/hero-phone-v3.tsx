/** @fileoverview Hero Phone V3 — 6-state Family Values composite.
 *
 * Architecture: one mounted component, LayoutGroup at the root, AnimatePresence
 * for state body swaps. Persistent identity carried via layoutId across phase
 * boundaries (cc-logo-header, phone-progress-bar, prospect-camil-avatar,
 * prospect-camil-name, stepper-active-dot).
 *
 * Native size: 340 × 696 (locked per Hero V3 motion brief, 2026-05-05). No CSS
 * scale-up on desktop. Mobile constrains via max-w-full.
 *
 * Phase chrome map (from Figma 191:698 / 191:729 / 192:1101 / 191:606 /
 * 193:1798 / 191:625):
 *   1 Onboarding, 2 Setup, 3 Selection, 5 Live Call, 6 Complete — show CC logo
 *     header, stepper, home indicator
 *   4 Call Connecting — hides logo header + stepper, ramps inset emerald glow,
 *     uses solid #0d0f14 screen bg (no radial)
 *   6 Call Complete — uses emerald gradient screen bg (#042013 → #080a09)
 *
 * Step 1 scope (this commit): chrome + state-switcher cycling 1..6 with
 * placeholder body slots. State implementations drop in across Steps 2-7.
 *
 * Reduced motion: cycling pauses; phase 1 shows as static settled state. */

'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
	AnimatePresence,
	LayoutGroup,
	motion,
	useReducedMotion,
} from 'motion/react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'
import {
	ArrowRight,
	ArrowsCounterClockwise,
	BookOpen,
	Binoculars,
	CaretLeft,
	CaretRight,
	ChartBar,
	Copy,
	Export,
	HeadCircuit,
	Image as ImageIcon,
	Lightning,
	Microphone,
	Trophy,
	UserFocus,
	UserSound,
	XCircle,
	type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

const CC_LOGO = '/cc-logo.png'

/* ─── Motion vocabulary (per brief §3) ───────────────────────────── */
const SPRING_CARD = { type: 'spring' as const, stiffness: 250, damping: 22 }
const SPRING_FIELD = { type: 'spring' as const, stiffness: 380, damping: 26 }
const SPRING_LAYOUT = { type: 'spring' as const, stiffness: 200, damping: 30 }
/* Snappy press feedback for state-driving CTAs. Higher stiffness, lower
 * mass-feel so the "click" lands fast (no spongey overshoot). */
const SPRING_PRESS = { type: 'spring' as const, stiffness: 600, damping: 28 }
/* Lead-time before each state's dwell expires when CTA-press fires. */
const PRESS_LEAD_MS = 320

/* Per-state autoplay dwell. Calibrated post-Step-7 against each state's
 * sub-state cascade so every animation lands before the cycle advances:
 *   State 1 (3.4s): CTA enters at 1.05s; +2.3s settled hold for the URL
 *     type-loop to read at least once.
 *   State 2 (5.8s): pills cascade 0.75s apart; last flash ends ~4.3s; +1.5s breathing.
 *   State 3 (3.6s): Camil card lands at 0.85s; +2.7s "select me" breathe.
 *   State 4 (2.8s): cinematic — let the ring pulse breathe a beat.
 *   State 5 (6.8s): chat cascade ends ~4.05s (last badge); +2.75s for
 *     viewer to read the final exchange (slower cascade per S+ pass
 *     2026-05-05 so each bubble reads one-by-one).
 *   State 6 (4.6s): CTA at 2.7s; +1.9s for "A" + scorecard cascade.
 * Cycle total ≈ 26.2s, in the 14-18s estimate from brief §7 once the
 * loop fade is folded in. Brief §0: timing unrestricted, every state
 * breathes. */
const STATE_DWELL_MS: Record<HeroV3StateIndex, number> = {
	0: 3400,
	1: 5800,
	2: 3600,
	3: 2800,
	4: 6800,
	5: 4600,
}

/* Loop-restart fade. State 6 → black overlay (~250ms in, ~150ms hold,
 * ~250ms out) → State 1 enters. Acceptable teleport per brief §7
 * locked decision #4 — the only sanctioned discontinuity in the cycle. */
const LOOP_FADE_IN_MS = 250
const LOOP_FADE_HOLD_MS = 150
const LOOP_FADE_OUT_MS = 250

export type HeroV3StateIndex = 0 | 1 | 2 | 3 | 4 | 5

const STATE_NAMES = [
	'Onboarding',
	'Creating AI Customers',
	'Start Training',
	'Call Connecting',
	'Live Call',
	'Call Complete',
] as const

/* Phase grouping the stepper paints. Per brief §2:
 *   1+2 → dot index 0 (Onboarding+Setup share a phase)
 *   3   → dot index 1
 *   4   → stepper hidden entirely
 *   5   → dot index 2
 *   6   → dot index 3 */
function stepperDotForState(s: HeroV3StateIndex): number | null {
	if (s === 0 || s === 1) return 0
	if (s === 2) return 1
	if (s === 3) return null
	if (s === 4) return 2
	return 3
}

/* CC logo header is hidden during State 4 (Call Connecting cinematic) AND
 * State 5 (Live Call — Figma 193:1798 puts the Camil header at the top
 * with no CC logo). The brief §4 persistence-map originally chained CC
 * logo through 5→6, but the Figma end-state for 5 has the Camil header
 * occupying that slot. Following Figma per brief §10 (Figma = source of
 * truth for end-state). */
/* ─── Chrome subcomponents ───────────────────────────────────────── */

function Stepper({ activeDot }: { activeDot: number | null }) {
	return (
		<div className='flex h-[18px] items-center justify-center gap-2 py-[6px]'>
			{[0, 1, 2, 3].map((i) => {
				const isActive = activeDot === i
				return (
					<motion.div
						key={i}
						className='rounded-full'
						animate={{
							width: isActive ? 16 : 6,
							height: 6,
							backgroundColor: isActive ? '#10B981' : 'rgba(255,255,255,0.12)',
						}}
						transition={SPRING_LAYOUT}
					/>
				)
			})}
		</div>
	)
}

function HomeIndicator() {
	return (
		<div className='flex h-[16px] shrink-0 items-start justify-center pb-[8px] pt-[4px]'>
			<div className='h-[4px] w-[112px] rounded-full bg-white/20' />
		</div>
	)
}

/* ─── Per-state placeholder body (Step 1 only) ──────────────────── */

function PlaceholderBody({ state }: { state: HeroV3StateIndex }) {
	return (
		<div className='flex flex-1 flex-col items-center justify-center gap-3 px-4 py-2 text-center'>
			<span className='text-trim text-[12px] font-medium uppercase tracking-[0.18em] text-white/40'>
				State {state + 1} of 6
			</span>
			<span className='text-trim text-[20px] font-semibold leading-tight text-white'>
				{STATE_NAMES[state]}
			</span>
			<span className='text-trim text-[13px] leading-[1.5] text-white/50'>
				Body lands in Step {state + 2}
			</span>
		</div>
	)
}

/* ─── State 1: Onboarding ────────────────────────────────────────
 * Figma 191:698. Composed browser mock + heading + URL input + CTA.
 * Browser mock is hand-built per locked decision #2 (CSS, not raw image),
 * URL bar type-animates "yoursite.com/product", Copy tooltip pops with
 * SPRING_CARD ~600ms after the type completes. */

/* iOS Safari-style browser mock per Figma 191:698. Shows the
 * "user copies their site URL" sequence:
 *   T+0      — browser shell renders (image + placeholder bars)
 *   T+0.2   — URL types into bottom URL bar ("yoursite.com/product")
 *   T+1.6   — text selects (blue highlight + iOS handles wipe in)
 *   T+2.0   — green Copy tooltip pops above with arrow pointing down
 * NOT a macOS browser — no traffic-light dots. URL bar lives at the
 * BOTTOM of the chrome (iOS pattern), not the top. */
function BrowserMock({ reducedMotion }: { reducedMotion: boolean }) {
	const [showSelection, setShowSelection] = useState(reducedMotion)
	const [showCopy, setShowCopy] = useState(reducedMotion)

	useEffect(() => {
		if (reducedMotion) return
		const t1 = setTimeout(() => setShowSelection(true), 1600)
		const t2 = setTimeout(() => setShowCopy(true), 2000)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
		}
	}, [reducedMotion])

	return (
		<motion.div
			className='relative flex h-[244px] w-[252px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#1a1d24] shadow-[0_8px_16px_rgba(0,0,0,0.45)]'
			initial={{ opacity: 0, y: 14, scale: 0.96 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={reducedMotion ? { duration: 0 } : { ...SPRING_CARD, delay: 0.05 }}
		>
			{/* Webpage content: header placeholder bars + image. Mirrors a
			 * generic article/landing page (title block + body line + hero img). */}
			<div className='flex flex-1 flex-col px-4 pt-4'>
				<div className='flex flex-col gap-2'>
					<div className='h-[18px] w-[64px] rounded-[4px] bg-white/15' />
					<div className='h-[6px] w-[140px] rounded-[3px] bg-white/[0.09]' />
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='flex size-20 items-center justify-center rounded-[8px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.06]'>
						<ImageIcon size={28} weight='regular' className='text-white/30' />
					</div>
				</div>
			</div>

			{/* iOS Safari URL bar zone with Copy tooltip + selection handles. */}
			<div className='relative px-3 pb-1.5'>
				{/* Copy tooltip — green pill with arrow pointing DOWN at URL. */}
				<AnimatePresence>
					{showCopy && (
						<motion.div
							key='copy-tooltip'
							className='pointer-events-none absolute -top-[36px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center'
							initial={{ opacity: 0, y: 4, scale: 0.7 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -2, scale: 0.9 }}
							transition={SPRING_CARD}
						>
							<div className='rounded-[7px] bg-[#22C55E] px-3 py-[6px] shadow-[0_6px_12px_rgba(0,0,0,0.5)]'>
								<span className='text-trim text-[12px] font-semibold leading-none text-white'>
									Copy
								</span>
							</div>
							<span
								aria-hidden
								className='-mt-px size-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#22C55E]'
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{/* URL bar */}
				<div className='relative flex h-[32px] items-center justify-center rounded-[10px] bg-[#2c3038] px-3'>
					<div className='relative inline-flex items-center'>
						{/* Selection wash: blue translucent rectangle behind text. */}
						<AnimatePresence>
							{showSelection && (
								<motion.span
									key='selection'
									aria-hidden
									className='absolute -inset-x-1 -inset-y-[3px] rounded-[2px] bg-[#2D7FF9]/45'
									style={{ transformOrigin: 'left' }}
									initial={{ scaleX: 0, opacity: 0 }}
									animate={{ scaleX: 1, opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.28, ease: 'easeOut' }}
								/>
							)}
						</AnimatePresence>

						{/* iOS selection handles: blue line + dot at each end. */}
						<AnimatePresence>
							{showSelection && (
								<>
									<motion.span
										key='handle-left'
										aria-hidden
										className='absolute -left-[6px] -top-[8px] z-10 flex flex-col items-center'
										initial={{ opacity: 0, y: -2, scale: 0.6 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0 }}
										transition={{ ...SPRING_FIELD, delay: 0.12 }}
									>
										<span className='size-[6px] rounded-full bg-[#2D7FF9]' />
										<span className='h-[24px] w-[1.5px] -mt-[1px] bg-[#2D7FF9]' />
									</motion.span>
									<motion.span
										key='handle-right'
										aria-hidden
										className='absolute -right-[6px] -bottom-[8px] z-10 flex flex-col items-center'
										initial={{ opacity: 0, y: 2, scale: 0.6 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0 }}
										transition={{ ...SPRING_FIELD, delay: 0.16 }}
									>
										<span className='h-[24px] w-[1.5px] -mb-[1px] bg-[#2D7FF9]' />
										<span className='size-[6px] rounded-full bg-[#2D7FF9]' />
									</motion.span>
								</>
							)}
						</AnimatePresence>

						<span className='relative z-[5] text-trim font-[family-name:var(--font-mono)] text-[12px] leading-none text-white/95'>
							{reducedMotion ? (
								'quickcashoffer.com'
							) : (
								<TypeAnimation
									sequence={['', 200, 'quickcashoffer.com', 6000]}
									speed={55}
									cursor={false}
									repeat={Infinity}
								/>
							)}
						</span>
					</div>
				</div>
			</div>

			{/* iOS Safari action bar. */}
			<div className='flex shrink-0 items-center justify-around px-3 pb-2.5 pt-1'>
				<CaretLeft size={16} weight='regular' className='text-white/50' />
				<CaretRight size={16} weight='regular' className='text-white/50' />
				<Export size={16} weight='regular' className='text-white/50' />
				<BookOpen size={16} weight='regular' className='text-white/50' />
				<Copy size={16} weight='regular' className='text-white/50' />
			</div>
		</motion.div>
	)
}

/* ─── State 2: Creating AI Customers ──────────────────────────────
 * Figma 191:729. Title block + mint loading label + progress bar +
 * 4 task pills cascade. Per brief §6 sub-states 2A-2E:
 *   2A: title morphs in from below
 *   2B: mint label + progress bar reveal
 *   2C: 4 pills cascade (FIELD spring, 200ms stagger)
 *   2D: each pill emerald-flashes as it "completes" (subtle, post-entrance)
 *   2E: settled
 * Progress bar persists from State 1's URL field via layoutId
 * "phone-progress-bar" (wired at Step 8 loop pass; standalone State 2
 * just renders it at the State-2 position). */

const STATE2_PILLS: ReadonlyArray<{ icon: PhosphorIcon, label: string }> = [
	{ icon: Binoculars, label: 'Analyzing Ideal Customer Profile' },
	{ icon: UserFocus, label: 'Designing AI Characters' },
	{ icon: UserSound, label: 'Configuring Realistic Voices' },
	{ icon: HeadCircuit, label: 'Setting up Buyer Behavior' },
] as const

function State2CreatingCustomers({ reducedMotion }: { reducedMotion: boolean }) {
	return (
		<div className='flex h-full flex-col items-center justify-center gap-10 px-4 pb-2 pt-4'>
			{/* Title block. Two-line layout per Figma 191:741. */}
			<motion.h2
				className='text-trim w-full text-center font-sans text-[28px] font-semibold leading-[1.15] text-white'
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0 }}
				transition={reducedMotion ? { duration: 0 } : { ...SPRING_CARD, delay: 0.05 }}
			>
				Creating Your<br />AI Customers
			</motion.h2>

			{/* Loading section: mint label + progress bar. */}
			<div className='flex w-full flex-col items-center gap-4'>
				<motion.span
					className='text-trim font-sans text-[16px] font-semibold leading-[1] text-cc-mint'
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 0.35 }}
				>
					Learning your business...
				</motion.span>
				<motion.div
					layoutId='phone-progress-bar'
					className='h-[4px] w-[272px] overflow-hidden rounded-full bg-[#1a1a1a]'
					initial={false}
					transition={SPRING_LAYOUT}
				>
					<motion.div
						className='h-full rounded-full bg-cc-mint'
						initial={{ width: '0%' }}
						animate={{ width: '100%' }}
						transition={
							reducedMotion
								? { duration: 0 }
								: { duration: 1.4, ease: 'easeOut', delay: 0.55 }
						}
					/>
				</motion.div>
			</div>

			{/* Pills build up one at a time — each enters with a 0.9s stagger
			 * and stays visible so the list accumulates naturally. */}
			<div className='flex w-full flex-col items-center gap-3'>
				{STATE2_PILLS.map((pill, i) => {
					const Icon = pill.icon
					return (
						<motion.div
							key={pill.label}
							className='flex h-[32px] items-center gap-1.5 rounded-[24px] border border-white/[0.06] bg-[rgba(30,34,48,0.8)] px-[13px] py-[9px] shadow-[0_8px_16px_rgba(0,0,0,0.4)]'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={
								reducedMotion
									? { duration: 0 }
									: { ...SPRING_FIELD, delay: 0.85 + i * 0.9 }
							}
						>
							<Icon size={14} weight='regular' className='shrink-0 text-cc-accent' />
							<span className='text-trim whitespace-nowrap font-sans text-[14px] font-normal leading-[16px] text-white'>
								{pill.label}
							</span>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

/* ─── State 3: Start Training (carousel) ─────────────────────────
 * Figma 192:1101 + cards 200:196-200:237. Title block + 3-card prospect
 * row with Camil center+taller as the focal hierarchy + Call Jose CTA.
 *
 * Layout per Figma: 3 cards in a flex row, gap-16, no rotations. Each
 * card 250px wide; Brandon/Caleb 320px tall, Camil 370px tall (the
 * height bump is the visual hierarchy cue). Order: Brandon | Camil |
 * Caleb so Camil sits center and the side cards become slivers when
 * the parent overflow-clips.
 *
 * Photo fills the entire card as a background; a blur-fade gradient
 * sits above the photo at the bottom; name+role and quote+difficulty
 * stack BELOW the fade with the card's `justify-end` pushing them to
 * the bottom edge.
 *
 * Camil's card carries layoutId="prospect-camil-avatar" +
 * "prospect-camil-name" which morph into State 4's brand circle and
 * State 5's chat header. */

type ProspectData = {
	id: 'brandon' | 'caleb' | 'camil'
	name: string
	age: number
	role: string
	quote: string
	difficulty: 'Easy' | 'Medium' | 'Hard'
	difficultyColor: string
	photo: string
	heightPx: number
}

/* Order matters: Brandon (left), Camil (center, taller), Caleb (right).
 * Phone screen overflow-clips so Brandon and Caleb become edge slivers. */
const STATE3_PROSPECTS: ReadonlyArray<ProspectData> = [
	{
		id: 'brandon',
		name: 'David',
		age: 44,
		role: 'Homeowner • Houston, TX',
		quote: '“We’re still figuring things out.”',
		difficulty: 'Easy',
		difficultyColor: '#10B981',
		photo: '/images/prospects/brandon.png',
		heightPx: 320,
	},
	{
		id: 'camil',
		name: 'Jose',
		age: 42,
		role: 'Homeowner • Phoenix, AZ',
		quote: '“We don’t want to sell the house.”',
		difficulty: 'Hard',
		difficultyColor: '#FF5A5A',
		photo: '/images/prospects/camil-v3.png',
		heightPx: 370,
	},
	{
		id: 'caleb',
		name: 'Sandra',
		age: 38,
		role: 'Homeowner • Dallas, TX',
		quote: '“What’s your best offer?”',
		difficulty: 'Medium',
		difficultyColor: '#F59E0B',
		photo: '/images/prospects/caleb.png',
		heightPx: 320,
	},
] as const

function ProspectCard({
	prospect,
	enterDelay,
	enterFromX,
	reducedMotion,
	isCamil,
}: {
	prospect: ProspectData
	enterDelay: number
	enterFromX: number
	reducedMotion: boolean
	isCamil: boolean
}) {
	const Icon = ChartBar
	const fadeHeightPx = isCamil ? 209 : 174
	return (
		<motion.div
			className='relative flex w-[250px] shrink-0 flex-col items-start justify-end gap-6 overflow-hidden rounded-[16px] border border-white/30 p-[13px] shadow-[0_8px_16px_rgba(0,0,0,0.6)]'
			style={{ height: prospect.heightPx }}
			initial={{ opacity: 0, y: 24, x: enterFromX, scale: 0.94 }}
			animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
			transition={
				reducedMotion
					? { duration: 0 }
					: { ...SPRING_CARD, delay: enterDelay }
			}
		>
			{isCamil ? (
				<motion.div
					layoutId='prospect-camil-avatar'
					className='absolute inset-0'
				>
					<Image
						src={prospect.photo}
						alt={prospect.name}
						fill
						sizes='250px'
						className='object-cover'
						style={{ objectPosition: 'center top' }}
						priority
					/>
				</motion.div>
			) : (
				<div className='absolute inset-0'>
					<Image
						src={prospect.photo}
						alt={prospect.name}
						fill
						sizes='250px'
						className='object-cover'
						style={{ objectPosition: 'center top' }}
					/>
				</div>
			)}

			{/* Progressive blur fade: stack of 3 backdrop-blur layers each masked
			 * with a different gradient so the blur intensity ramps from 0 at
			 * top to full at the bottom. The top of the blur frame blends into
			 * the unblurred photo cleanly instead of slamming on a uniform blur. */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-x-0 bottom-0'
				style={{
					height: fadeHeightPx,
					background: 'linear-gradient(to bottom, rgba(8,9,12,0) 0%, #08090c 88.94%)',
				}}
			/>

			{/* Customer name + role. */}
			<div className='relative flex flex-col gap-3'>
				{isCamil ? (
					<motion.p
						layoutId='prospect-camil-name'
						className='text-trim whitespace-nowrap font-sans text-[18px] font-semibold leading-[16px] text-white'
					>
						{prospect.name}, {prospect.age}
					</motion.p>
				) : (
					<p className='text-trim whitespace-nowrap font-sans text-[18px] font-semibold leading-[16px] text-white'>
						{prospect.name}, {prospect.age}
					</p>
				)}
				<p className='text-trim whitespace-nowrap font-sans text-[14px] font-semibold leading-none text-white/60'>
					{prospect.role}
				</p>
			</div>

			{/* Quote + difficulty pill. */}
			<div className='relative flex w-full flex-col gap-4'>
				<p className='font-sans text-[24px] font-medium leading-[1.2] text-white'>
					{prospect.quote}
				</p>
				<div className='flex items-center gap-2'>
					<Icon size={16} weight='fill' style={{ color: prospect.difficultyColor }} />
					<span
						className='text-trim font-sans text-[14px] font-semibold leading-[15px]'
						style={{ color: prospect.difficultyColor }}
					>
						{prospect.difficulty}
					</span>
				</div>
			</div>
		</motion.div>
	)
}

/* ─── State 4: Call Connecting ─────────────────────────────────────
 * Figma 191:606. Cinematic beat — phone bezel inset emerald glow
 * (handled by shell's BezelInsetGlow when state === 3), CC header +
 * stepper hidden, brand circle 133x133 centered, "Call Connecting..."
 * label below.
 *
 * STRUCTURAL DEVIATION FROM FIGMA: the Figma frame renders the CC
 * logomark inside the brand circle. The motion brief (§4 Persistence
 * Map, locked 2026-05-05) places Camil's avatar inside the circle so
 * the prospect-camil-avatar layoutId chain morphs cleanly across
 * States 3 -> 4 -> 5. Following the brief because (a) the Camil-face
 * persistence is the load-bearing motion grammar, (b) "you're calling
 * Camil — his face appears as the call connects" is a stronger
 * narrative beat than swapping to the app brand, (c) breaking
 * persistence at State 4 would force State 5's header avatar to fresh-
 * mount (no layoutId target), losing the "he answers" beat.
 * Surfacing this for Andy at commit; can flip to the logomark with a
 * one-line render swap if he prefers the Figma reading. */

/* ─── State 6: Call Complete ────────────────────────────────────
 * Figma 191:625. Verdict screen. Emerald gradient bg (handled by
 * shell ScreenBackground when state===5), Top 15% trophy pill,
 * 120px grade ring with "A" letter, AI Coach Suggests bubble,
 * 3 scorecard cards (with bottom blur fade), Practice Again CTA.
 *
 * Per brief §6 sub-states 6A-6J. The "A" letter spring-bounce is
 * THE delight moment of the loop — score-spring 300/18 with the
 * heaviest stiffness/lowest damping in the system. Earn it. */

const SPRING_SCORE = { type: 'spring' as const, stiffness: 300, damping: 18 }

/* Per Figma 200:1191 (locked 2026-05-06 with Andy):
 *   Card 1: Executive-Level Framing / Excellent
 *   Card 2: Risk & ROI Exploration / Excellent       ← updated
 *   Card 3: Clear Next Step Commitment / Repeatedly pushed for contract signing
 * Card 3 is mostly hidden behind the bottom blur fade. */
const STATE6_SCORECARDS: ReadonlyArray<{
	title: string
	desc: string
	grade: string
	ringFill: number
	ringColor: string
}> = [
	{
		title: 'Building Rapport',
		desc: 'You made Jose feel heard right away.',
		grade: 'A',
		ringFill: 1.0,
		ringColor: '#10D078',
	},
	{
		title: 'Handling Objections',
		desc: 'Good instincts, missed the insurance angle.',
		grade: 'B',
		ringFill: 0.75,
		ringColor: '#F59E0B',
	},
	{
		title: 'Closing the Appointment',
		desc: "Didn't ask for a face-to-face walkthrough.",
		grade: 'C',
		ringFill: 0.5,
		ringColor: '#FF5A5A',
	},
]

function ScorecardRow({
	card,
	enterDelay,
	reducedMotion,
}: {
	card: { title: string, desc: string, grade: string, ringFill: number, ringColor: string }
	enterDelay: number
	reducedMotion: boolean
}) {
	const RING_C = 2 * Math.PI * 21
	return (
		<motion.div
			className='flex w-full items-center gap-3 rounded-[16px] border border-[#353535] bg-black p-3'
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={
				reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: enterDelay }
			}
		>
			<div className='relative flex size-[48px] shrink-0 items-center justify-center'>
				<svg
					width='48'
					height='48'
					viewBox='0 0 48 48'
					className='absolute inset-0 -rotate-90'
				>
					<circle cx='24' cy='24' r='21' fill='none' stroke='rgba(255,255,255,0.08)' strokeWidth='3' />
					<motion.circle
						cx='24'
						cy='24'
						r='21'
						fill='none'
						stroke={card.ringColor}
						strokeWidth='3'
						strokeLinecap='round'
						strokeDasharray={`${RING_C}`}
						initial={{ strokeDashoffset: RING_C }}
						animate={{ strokeDashoffset: RING_C * (1 - card.ringFill) }}
						transition={
							reducedMotion
								? { duration: 0 }
								: { duration: 0.7, ease: 'easeOut', delay: enterDelay + 0.2 }
						}
					/>
				</svg>
				<span
					className='relative z-10 text-trim text-[16px] font-semibold [font-family:var(--font-cta),system-ui,sans-serif]'
					style={{ color: card.ringColor }}
				>
					{card.grade}
				</span>
			</div>

			<div className='flex min-w-0 flex-1 flex-col gap-2 py-1'>
				<span className='text-trim font-sans text-[14px] font-semibold leading-none tracking-[-0.2px] text-[#efefef]'>
					{card.title}
				</span>
				<span className='text-trim font-sans text-[12px] font-normal leading-[1.4] tracking-[-0.2px] text-[#919191]'>
					{card.desc}
				</span>
			</div>
		</motion.div>
	)
}

function State6CallComplete({ reducedMotion }: { reducedMotion: boolean }) {
	const RING_R = 50
	const RING_C = 2 * Math.PI * RING_R

	/* Press Practice Again right before the loop fade-to-black starts. This
	 * is the "user kicks off another practice round" beat — without press
	 * feedback the loop restart reads as a teleport. */
	const [pressed, setPressed] = useState(false)
	useEffect(() => {
		if (reducedMotion) return
		const t = setTimeout(() => setPressed(true), STATE_DWELL_MS[5] - PRESS_LEAD_MS)
		return () => clearTimeout(t)
	}, [reducedMotion])

	return (
		<div className='relative flex h-full flex-col items-center gap-4 overflow-hidden px-4 pb-2 pt-8'>
			{/* Top 15% trophy pill + grade ring stack. Per Andy 2026-05-06 the
			 * pill should sit ON the ring's top stroke (was floating above it
			 * with a negative margin, now absolute-positioned over the ring
			 * container so the pill's bottom edge aligns with the ring stroke
			 * top — overlap per Figma reference Image #41). */}
			<div className='flex w-full flex-col items-center'>
				<div className='relative flex size-[120px] items-center justify-center'>
					<svg
						width='120'
						height='120'
						viewBox='0 0 120 120'
						className='absolute inset-0 -rotate-90'
					>
						<circle cx='60' cy='60' r={RING_R} fill='none' stroke='rgba(52,225,142,0.2)' strokeWidth='4' />
						<motion.circle
							cx='60'
							cy='60'
							r={RING_R}
							fill='none'
							stroke='#34E18E'
							strokeWidth='4'
							strokeLinecap='round'
							strokeDasharray={`${RING_C}`}
							initial={{ strokeDashoffset: RING_C }}
							animate={{ strokeDashoffset: 0 }}
							transition={
								reducedMotion
									? { duration: 0 }
									: { duration: 1.0, ease: 'easeOut', delay: 0.45 }
							}
							style={{ filter: 'drop-shadow(0 0 6px rgba(52,225,142,0.6))' }}
						/>
					</svg>
					<motion.span
						className='relative text-[48px] leading-[40px] text-cc-mint [font-family:var(--font-cta),system-ui,sans-serif] font-semibold'
						initial={{ opacity: 0, scale: 0.4 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={
							reducedMotion ? { duration: 0 } : { ...SPRING_SCORE, delay: 1.0 }
						}
					>
						B
					</motion.span>

					{/* Top 35% pill — absolute over ring's top stroke. */}
					<motion.div
						className='absolute -top-[14px] left-1/2 z-20 flex h-[28px] -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border-[0.5px] border-[rgba(52,225,142,0.9)] bg-[#0d201f] px-3 py-1 shadow-[0_0_16px_rgba(52,225,142,0.3),0_8px_16px_rgba(0,0,0,0.6)]'
						initial={{ opacity: 0, scale: 0.6, y: 6 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={
							reducedMotion ? { duration: 0 } : { ...SPRING_SCORE, delay: 0.15 }
						}
					>
						<Trophy size={14} weight='fill' className='shrink-0 text-cc-mint' />
						<motion.span
							className='text-trim whitespace-nowrap font-sans text-[14px] font-bold leading-none text-cc-mint'
							animate={
								reducedMotion ? { opacity: 1 } : { opacity: [1, 0.6, 1] }
							}
							transition={
								reducedMotion
									? { duration: 0 }
									: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }
							}
						>
							Top 35%
						</motion.span>
					</motion.div>
				</div>
			</div>

			{/* AI Coach Suggests label + bubble. Per Figma 200:1218: 40px avatar,
			 * 14px label/bubble text, gap-3 between label and bubble. */}
			<div className='flex w-full flex-col gap-3'>
				<motion.span
					className='text-trim font-sans text-[14px] font-semibold leading-[1.4] text-white'
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					transition={
						reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 1.4 }
					}
				>
					AI Coach Suggests..
				</motion.span>
				<motion.div
					className='flex w-full items-start gap-2'
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={
						reducedMotion ? { duration: 0 } : { ...SPRING_CARD, delay: 1.6 }
					}
				>
					<div className='relative size-[40px] shrink-0 overflow-hidden rounded-full border border-white/[0.05]'>
						<Image
							src='/images/prospects/camil-v3.png'
							alt='AI Coach'
							fill
							sizes='40px'
							className='object-cover'
							style={{ objectPosition: 'center top' }}
						/>
					</div>
					<div className='flex-1 rounded-[12px] rounded-tl-none border border-white/[0.06] bg-[#09f] p-3'>
						<p className='text-trim font-sans text-[14px] font-medium leading-[1.4] text-white'>
							Good opener. Next time, lead with the cash offer benefit earlier — Jose needs to hear speed and certainty upfront.
						</p>
					</div>
				</motion.div>
			</div>

			{/* 3 scorecard cards with bottom blur fade. flex-1 + min-h-0 lets
			 * the container shrink below content size so card 3's bottom
			 * portion gets clipped instead of pushing the Practice Again CTA
			 * out of the phone frame. The 80px backdrop-blur fade visually
			 * obscures card 3 so it reads as "more cards available, scroll
			 * to see" instead of "broken layout". */}
			<div className='relative flex w-full min-h-0 flex-1 flex-col gap-2 overflow-hidden'>
				{STATE6_SCORECARDS.map((card, i) => (
					<ScorecardRow
						key={i}
						card={card}
						enterDelay={1.9 + i * 0.18}
						reducedMotion={reducedMotion}
					/>
				))}
				<div
					aria-hidden
					className='pointer-events-none absolute inset-x-0 bottom-0 h-[80px] backdrop-blur-[3px]'
					style={{
						WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
						maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
					}}
				/>
				<div
					aria-hidden
					className='pointer-events-none absolute inset-x-0 bottom-0 h-[80px]'
					style={{
						background:
							'linear-gradient(to bottom, rgba(8,10,9,0) 0%, rgba(8,10,9,0.85) 60%, #080a09 100%)',
					}}
				/>
			</div>

			{/* Practice Again CTA. */}
			<motion.button
				type='button'
				className='flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[27px] bg-cc-mint shadow-[0_8px_20px_rgba(52,225,142,0.18)]'
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0, scale: pressed ? 0.94 : 1 }}
				transition={{
					default: reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 2.7 },
					scale: SPRING_PRESS,
				}}
			>
				<span className='text-trim text-[16px] font-bold text-[#313131] [font-family:var(--font-cta),system-ui,sans-serif]'>
					Practice Again
				</span>
				<ArrowsCounterClockwise size={16} weight='bold' className='text-[#313131]' />
			</motion.button>
		</div>
	)
}

/* ─── State 5: Live Call ────────────────────────────────────────
 * Figma 193:1798. Densest screen of the loop:
 *   - Header: Camil avatar (48px, layoutId="prospect-camil-avatar"
 *     morphs from State 4's 133px brand circle), name + REC dot +
 *     timer, divider line at bottom.
 *   - 4 chat bubbles in alternating left (AI w/ 20px Camil avatar)
 *     / right (user, blue #09f). User bubbles carry stamped badges:
 *     "Great Response" emerald (lightning) on bubble #1, "Missed The
 *     Mark" red (X-circle) on bubble #2.
 *   - Mic bar at bottom: emerald-tinted shell, mic icon, label,
 *     small waveform.
 * Per brief §6 sub-states 5A-5J, body cascades with chat bubbles
 * landing ~400-600ms apart and badges stamping after their parent
 * bubble settles. Reduced motion = settled instantly. */

/* Static-ish waveform: deterministic heights from a sin/cos pattern,
 * subtle breathing on opacity if pulse enabled. Used in State 5 mic bar. */
function MicWaveform({
	bars = 25,
	pulse = true,
	reducedMotion,
}: {
	bars?: number
	pulse?: boolean
	reducedMotion: boolean
}) {
	const data = Array.from({ length: bars }).map((_, i) => {
		const t = i / bars
		const wave = Math.sin(t * Math.PI * 4) * 0.5 + 0.5
		const noise = Math.sin(i * 1.7) * 0.3 + Math.cos(i * 2.3) * 0.2
		const h = Math.max(2, Math.round((wave + noise) * 14))
		const opacity = 0.3 + (h / 16) * 0.55
		return { h, opacity, phase: i * 0.12 }
	})
	const animate = pulse && !reducedMotion
	return (
		<div className='flex items-center gap-px'>
			{data.map((bar, i) => (
				<motion.span
					key={i}
					className='block w-[2px] rounded-full bg-cc-accent'
					animate={
						animate
							? {
								height: [`${bar.h}px`, `${Math.max(2, bar.h - 3)}px`, `${bar.h}px`],
								opacity: [bar.opacity, bar.opacity * 0.6, bar.opacity],
							}
							: { height: `${bar.h}px`, opacity: bar.opacity }
					}
					transition={
						animate
							? {
								duration: 1.4,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: bar.phase,
							}
							: { duration: 0 }
					}
				/>
			))}
		</div>
	)
}

type ChatBubble = {
	id: string
	side: 'ai' | 'user'
	text: string
	delay: number
	badge?: { kind: 'positive' | 'negative', label: string, delay: number }
}

/* Cascade timing tuned for readability (per Andy 2026-05-05 S+ pass): bubbles
 * land ~1s apart so a viewer can follow each line one by one. Mic bar enters
 * early (0.2s) as part of the screen UI, not mid-cascade. Badges stamp ~350ms
 * after their parent bubble settles. Total cascade ≈ 4.0s + ~2s breathing. */
const STATE5_BUBBLES: ReadonlyArray<ChatBubble> = [
	{
		id: 'ai-1',
		side: 'ai',
		text: "We’re not really looking to sell right now.",
		delay: 0.5,
	},
	{
		id: 'user-1',
		side: 'user',
		text: "I get it. What’s keeping you from exploring your options?",
		delay: 1.5,
		badge: { kind: 'positive', label: 'Great Response', delay: 1.85 },
	},
	{
		id: 'ai-2',
		side: 'ai',
		text: "We’ve got a situation with the mortgage and insurance.",
		delay: 2.7,
	},
	{
		id: 'user-2',
		side: 'user',
		text: "How much is left on the mortgage? We buy as-is, all cash, fast close.",
		delay: 3.7,
		badge: { kind: 'negative', label: 'Missed The Mark', delay: 4.05 },
	},
] as const

function ChatBubbleRow({
	bubble,
	reducedMotion,
}: {
	bubble: ChatBubble
	reducedMotion: boolean
}) {
	const isAI = bubble.side === 'ai'
	const fromX = isAI ? -10 : 10
	/* Per Figma 200:282/200:293: user-bubble rows always have pt-[20px] for
	 * badge clearance (badge sticks 19px above the bubble). AI rows have
	 * pr-[24px] to keep the avatar+bubble from kissing the right edge. */
	return (
		<div
			className={`flex w-full ${
				isAI ? 'justify-start pr-6' : 'justify-end pl-6 pt-5'
			}`}
		>
			<motion.div
				className={`flex items-end gap-2 ${isAI ? '' : 'flex-row-reverse'}`}
				initial={{ opacity: 0, x: fromX, y: 4 }}
				animate={{ opacity: 1, x: 0, y: 0 }}
				transition={
					reducedMotion
						? { duration: 0 }
						: { ...SPRING_FIELD, delay: bubble.delay }
				}
			>
				{isAI && (
					<div className='relative size-[20px] shrink-0 overflow-hidden rounded-full border border-white/[0.05]'>
						<Image
							src='/images/prospects/camil-v3.png'
							alt=''
							fill
							sizes='20px'
							className='object-cover'
							style={{ objectPosition: 'center top' }}
						/>
					</div>
				)}
				{/* Bubble container caps at 260px so 1st/2nd/4th messages wrap
				 * to 2 lines per Andy's reference (Image #39, 2026-05-06). The
				 * 3rd bubble is the only one whose content forces 3 lines at
				 * this width, which is the desired ratio. */}
				<div className='relative max-w-[260px]'>
					<div
						className={
							isAI
								? 'rounded-[12px] rounded-bl-none border border-white/[0.06] bg-cc-surface-card p-3'
								: 'rounded-[12px] rounded-br-none border border-white/[0.06] bg-[#09f] p-3'
						}
					>
						<p className='text-trim font-sans text-[16px] font-normal leading-[1.4] text-white'>
							{bubble.text}
						</p>
					</div>
					{bubble.badge && (
						<motion.div
							className='absolute -left-[9px] -top-[19px] flex shrink-0 items-center gap-1 rounded-full border border-white/[0.06] bg-cc-surface-card pl-1.5 pr-3 py-1.5 shadow-[0_2px_2px_rgba(0,0,0,0.4)]'
							initial={{ opacity: 0, scale: 0.8, y: 4 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={
								reducedMotion
									? { duration: 0 }
									: { ...SPRING_CARD, delay: bubble.badge.delay }
							}
						>
							{bubble.badge.kind === 'positive' ? (
								<Lightning size={10} weight='fill' className='text-cc-mint' />
							) : (
								<XCircle size={10} weight='fill' className='text-[#ff6467]' />
							)}
							<span
								className={`text-trim font-sans text-[14px] font-medium leading-[15px] ${
									bubble.badge.kind === 'positive' ? 'text-cc-mint' : 'text-[#ff6467]'
								}`}
							>
								{bubble.badge.label}
							</span>
						</motion.div>
					)}
				</div>
			</motion.div>
		</div>
	)
}

function State5LiveCall({ reducedMotion }: { reducedMotion: boolean }) {
	return (
		<div className='flex h-full flex-col gap-6 px-4 pb-2 pt-2'>
			{/* Header: Camil avatar (layoutId target from State 4 brand circle)
			 * + name + REC dot + timer. Divider line beneath. Per Figma 200:244
			 * the header uses gap-6 (24px) between avatar group and divider. */}
			<div className='flex flex-col items-center justify-center gap-6 border-b border-white/[0.15] pb-4'>
				<div className='flex flex-col items-center gap-2'>
					<motion.div
						layoutId='prospect-camil-avatar'
						className='relative size-[48px] overflow-hidden rounded-full border border-white/[0.05]'
					>
						<Image
							src='/images/prospects/camil-v3.png'
							alt='Jose'
							fill
							sizes='48px'
							className='object-cover'
							style={{ objectPosition: 'center top' }}
						/>
					</motion.div>
					<div className='flex items-center gap-2'>
						<motion.span
							layoutId='prospect-camil-name'
							className='text-trim font-sans text-[16px] font-medium leading-[16px] text-white'
						>
							Jose
						</motion.span>
						<motion.span
							className='size-1 rounded-full bg-cc-score-red'
							animate={
								reducedMotion ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }
							}
							transition={
								reducedMotion
									? { duration: 0 }
									: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
							}
						/>
						<span className='text-trim font-sans text-[14px] font-medium leading-none text-white/80 tabular-nums'>
							00:34
						</span>
						<span className='text-trim font-sans text-[14px] font-medium leading-none text-white/50'>
							/
						</span>
						<span className='text-trim font-sans text-[14px] font-medium leading-none text-white/50 tabular-nums'>
							10:00
						</span>
					</div>
				</div>
			</div>

			{/* Chat area. Cascades 4 bubbles with badge stamps. Per Figma
			 * 200:277, gap-6 (24px) between rows. */}
			<div className='flex flex-1 flex-col gap-6 overflow-hidden'>
				{STATE5_BUBBLES.map((bubble) => (
					<ChatBubbleRow
						key={bubble.id}
						bubble={bubble}
						reducedMotion={reducedMotion}
					/>
				))}
			</div>

			{/* Mic bar with active waveform. Per Figma 200:304: 40px mic-icon
			 * container, 24px Microphone icon, 14px label. Enters early at 0.2s
			 * as persistent UI, not mid-cascade. */}
			<motion.div
				className='flex items-center gap-2 rounded-[24px] border border-cc-accent/60 bg-cc-accent/15 py-[5px] pl-[5px] pr-[9px] shadow-[0_0_20px_rgba(16,185,129,0.4)]'
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={
					reducedMotion
						? { duration: 0 }
						: { ...SPRING_FIELD, delay: 0.2 }
				}
			>
				<div className='flex size-[40px] shrink-0 items-center justify-center rounded-full bg-cc-accent/25'>
					<Microphone size={24} weight='fill' className='text-white' />
				</div>
				<span className='text-trim min-w-0 flex-1 truncate font-sans text-[14px] font-medium leading-none text-white/90'>
					Record your response
				</span>
				<MicWaveform bars={22} reducedMotion={reducedMotion} />
			</motion.div>
		</div>
	)
}

function State4CallConnecting({ reducedMotion }: { reducedMotion: boolean }) {
	return (
		<div className='flex h-full flex-col items-center justify-center gap-7 px-4'>
			{/* Brand circle with Camil avatar inside. layoutId carries the
			 * morph from State 3's carousel center card. */}
			<motion.div
				className='relative size-[133px] overflow-hidden rounded-full border-[1.5px] border-[#00e486] shadow-[0_0_20px_rgba(16,185,129,0.05),0_8px_16px_rgba(0,0,0,0.6)]'
				animate={
					reducedMotion
						? { boxShadow: '0 0 20px rgba(16,185,129,0.05), 0 8px 16px rgba(0,0,0,0.6)' }
						: {
							boxShadow: [
								'0 0 20px rgba(16,185,129,0.10), 0 8px 16px rgba(0,0,0,0.6)',
								'0 0 32px rgba(16,185,129,0.30), 0 8px 16px rgba(0,0,0,0.6)',
								'0 0 20px rgba(16,185,129,0.10), 0 8px 16px rgba(0,0,0,0.6)',
							],
						}
				}
				transition={
					reducedMotion
						? { duration: 0 }
						: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
				}
			>
				<motion.div layoutId='prospect-camil-avatar' className='absolute inset-0'>
					<Image
						src='/images/prospects/camil-v3.png'
						alt='Jose'
						fill
						sizes='133px'
						className='object-cover'
						style={{ objectPosition: 'center top' }}
					/>
				</motion.div>
			</motion.div>

			{/* Label + animated ellipsis. */}
			<div className='flex items-baseline justify-center gap-[2px]'>
				<span className='text-trim font-sans text-[20px] font-medium leading-none text-white'>
					Call Connecting
				</span>
				{[0, 1, 2].map((i) => (
					<motion.span
						key={i}
						className='text-trim font-sans text-[20px] font-medium leading-none text-white'
						animate={
							reducedMotion
								? { opacity: 1 }
								: { opacity: [0.3, 1, 0.3] }
						}
						transition={
							reducedMotion
								? { duration: 0 }
								: {
									duration: 1.4,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: i * 0.18,
								}
						}
					>
						.
					</motion.span>
				))}
			</div>
		</div>
	)
}

function State3StartTraining({ reducedMotion }: { reducedMotion: boolean }) {
	/* Motion order updated 2026-05-06 per Andy: Camil leads (focal card
	 * entering first establishes the lead), then Brandon and Caleb slide
	 * in from off-screen to flank her. Reading priority Camil → sides
	 * matches the visual hierarchy Camil-taller-+-centered already
	 * communicates. Side cards enter with an x-translate from the
	 * direction they sit, so the slivers feel like they're sliding into
	 * frame instead of fading from nothing. */
	const cardConfig = {
		camil: { delay: 0.4, fromX: 0 },
		brandon: { delay: 0.55, fromX: -40 },
		caleb: { delay: 0.7, fromX: 40 },
	} as const

	/* Press the Call Jose CTA right before state advances to State 4. */
	const [pressed, setPressed] = useState(false)
	useEffect(() => {
		if (reducedMotion) return
		const t = setTimeout(() => setPressed(true), STATE_DWELL_MS[2] - PRESS_LEAD_MS)
		return () => clearTimeout(t)
	}, [reducedMotion])

	return (
		<div className='flex h-full flex-col items-center justify-between gap-4 px-4 pb-2 pt-4'>
			{/* Title block. */}
			<motion.div
				className='flex w-full flex-col items-center gap-6 text-center'
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 0.05 }}
			>
				<h2 className='text-trim font-sans text-[28px] font-semibold leading-[1.15] text-white'>
					Start training!
				</h2>
				<p className='text-trim font-sans text-[16px] font-normal leading-[1.6] text-white/50'>
					Your AI Customers are ready.
				</p>
			</motion.div>

			{/* 3-card row: Brandon | Camil | Caleb. Cards are 250px each with
			 * gap-4 (16px). Total row width 782px overflows the phone screen
			 * (~294px inner width) — overflow-clip + flex justify-center
			 * centers the row so Camil sits in the middle and the side cards
			 * become edge slivers. */}
			<div className='-mx-4 flex w-[calc(100%+2rem)] flex-1 items-center justify-center overflow-clip py-2'>
				<div className='flex shrink-0 items-center gap-4'>
					{STATE3_PROSPECTS.map((prospect) => (
						<ProspectCard
							key={prospect.id}
							prospect={prospect}
							enterDelay={cardConfig[prospect.id].delay}
							enterFromX={cardConfig[prospect.id].fromX}
							reducedMotion={reducedMotion}
							isCamil={prospect.id === 'camil'}
						/>
					))}
				</div>
			</div>

			{/* Call Jose CTA. */}
			<motion.button
				type='button'
				className='flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[27px] bg-cc-mint shadow-[0_8px_20px_rgba(52,225,142,0.18)]'
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0, scale: pressed ? 0.94 : 1 }}
				transition={{
					default: reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 1.1 },
					scale: SPRING_PRESS,
				}}
			>
				<span className='text-trim text-[16px] font-bold text-black [font-family:var(--font-cta),system-ui,sans-serif]'>
					Call Jose
				</span>
				<ArrowRight size={16} weight='bold' className='text-black' />
			</motion.button>
		</div>
	)
}

function State1Onboarding({ reducedMotion }: { reducedMotion: boolean }) {
	/* Press the Continue CTA ~300ms before the state advances to provide
	 * "click happened" feedback that justifies the transition to State 2. */
	const [pressed, setPressed] = useState(false)
	useEffect(() => {
		if (reducedMotion) return
		const t = setTimeout(() => setPressed(true), STATE_DWELL_MS[0] - PRESS_LEAD_MS)
		return () => clearTimeout(t)
	}, [reducedMotion])

	return (
		<div className='flex h-full flex-col items-center justify-between px-4 pb-2 pt-2'>
			<div className='flex flex-1 w-full flex-col items-center justify-center gap-10'>
				<BrowserMock reducedMotion={reducedMotion} />

				{/* Paste input removed 2026-05-06 per Andy: redundant since the URL
				 * is already highlighted as selected text in the browser visual
				 * above the heading. The narrative beat reads cleanly without it. */}
				<motion.div
					className='flex w-full flex-col items-center gap-6 text-center'
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 0.6 }}
				>
					<h2 className='text-trim font-sans text-[28px] font-semibold leading-tight text-white'>
						Train your CloserCoach
					</h2>
					<p className='text-trim w-full text-[16px] font-normal leading-[1.5] text-white/50'>
						We research your business to build customers and role play
						scenarios you can practice against.
					</p>
				</motion.div>
			</div>

			<motion.button
				type='button'
				className='mt-4 flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[27px] bg-cc-mint shadow-[0_8px_20px_rgba(52,225,142,0.18)]'
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0, scale: pressed ? 0.94 : 1 }}
				transition={{
					default: reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 1.05 },
					scale: SPRING_PRESS,
				}}
			>
				<span className='text-trim text-[16px] font-bold text-black [font-family:var(--font-cta),system-ui,sans-serif]'>
					Continue
				</span>
				<ArrowRight size={16} weight='bold' className='text-black' />
			</motion.button>
		</div>
	)
}

/* ─── Phone screen chrome (per-state bg + bezel inset glow) ─────── */

function ScreenBackground({ state }: { state: HeroV3StateIndex }) {
	if (state === 5) {
		/* State 6: emerald gradient (Figma 191:626) */
		return (
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 rounded-[42.4px]'
				style={{
					background:
						'linear-gradient(180deg, #042013 0%, #080a09 46.154%, #080a09 100%)',
				}}
			/>
		)
	}

	if (state === 3) {
		/* State 4: solid foundation, no radial. Inset emerald glow added below. */
		return (
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 rounded-[42.4px] bg-cc-foundation'
			/>
		)
	}

	/* States 1, 2, 3, 5: radial atmospheric over foundation (Figma std). */
	return (
		<div
			aria-hidden
			className='pointer-events-none absolute inset-0 rounded-[42.4px]'
			style={{
				background:
					'radial-gradient(15.879px 22.85px at 158.79px -70.5px, rgba(30,34,48,1) 0%, rgba(21,24,34,1) 50%, rgba(12,14,19,1) 100%), linear-gradient(90deg, #0d0f14 0%, #0d0f14 100%)',
			}}
		/>
	)
}

function BezelInsetGlow({ state }: { state: HeroV3StateIndex }) {
	const visible = state === 3
	return (
		<motion.div
			aria-hidden
			className='pointer-events-none absolute inset-0 rounded-[42.4px]'
			animate={{
				boxShadow: visible
					? 'inset 0 0 40.4px rgba(16,185,129,0.58)'
					: 'inset 0 0 0px rgba(16,185,129,0)',
			}}
			transition={{ duration: 0.6, ease: 'easeOut' }}
		/>
	)
}

/* ─── Main component ────────────────────────────────────────────── */

export type HeroPhoneV3Props = {
	/* When true (default), the shell auto-cycles 0→5→0. Set false from a
	 * preview-driven UI to pin a single state. */
	autoplay?: boolean
	/* Pin to a specific state when autoplay is false. Defaults to 0. */
	pinnedState?: HeroV3StateIndex
	/* Slot for state body content. Falls back to PlaceholderBody for the
	 * Step 1 scaffold. State implementations override per index. */
	renderState?: (state: HeroV3StateIndex) => ReactNode
}

export default function HeroPhoneV3({
	autoplay = true,
	pinnedState = 0,
	renderState,
}: HeroPhoneV3Props = {}) {
	const prefersReducedMotion = useReducedMotion() ?? false
	const [autoIndex, setAutoIndex] = useState<HeroV3StateIndex>(0)
	/* loopFade flips true briefly during the 6→1 transition to render the
	 * black overlay over the screen. Reduced motion skips entirely. */
	const [loopFade, setLoopFade] = useState(false)

	useEffect(() => {
		if (!autoplay || prefersReducedMotion) return
		let advanceTimer: ReturnType<typeof setTimeout> | null = null
		let fadeInTimer: ReturnType<typeof setTimeout> | null = null
		let fadeOutTimer: ReturnType<typeof setTimeout> | null = null

		const scheduleNext = (current: HeroV3StateIndex) => {
			advanceTimer = setTimeout(() => {
				if (current === 5) {
					/* Loop restart: fade to black, hold, advance to state 0,
					 * fade back. */
					setLoopFade(true)
					fadeInTimer = setTimeout(() => {
						setAutoIndex(0)
						fadeOutTimer = setTimeout(() => {
							setLoopFade(false)
							scheduleNext(0)
						}, LOOP_FADE_HOLD_MS)
					}, LOOP_FADE_IN_MS)
				} else {
					const next = (current + 1) as HeroV3StateIndex
					setAutoIndex(next)
					scheduleNext(next)
				}
			}, STATE_DWELL_MS[current])
		}

		scheduleNext(0)
		return () => {
			if (advanceTimer) clearTimeout(advanceTimer)
			if (fadeInTimer) clearTimeout(fadeInTimer)
			if (fadeOutTimer) clearTimeout(fadeOutTimer)
		}
	}, [autoplay, prefersReducedMotion])

	const activeIndex: HeroV3StateIndex = autoplay ? autoIndex : pinnedState

	const dot = stepperDotForState(activeIndex)
	return (
		<LayoutGroup>
			<div
				className='relative h-[696px] w-[340px] shrink-0 rounded-[48px] border border-white/10 px-[7px] pb-px pt-[7px] shadow-[0_0_60px_rgba(16,185,129,0.1),0_20px_40px_rgba(0,0,0,0.4)]'
				style={{
					background:
						'linear-gradient(180deg, #2a2d36 0%, #28293a 14.286%, #252831 28.571%, #23262f 42.857%, #21242d 57.143%, #1e212a 71.429%, #1c1f28 85.714%, #1a1d26 100%)',
				}}
			>
				<div className='relative flex h-full w-full flex-col overflow-hidden rounded-[42.4px] border border-white/[0.05]'>
					<ScreenBackground state={activeIndex} />
					<BezelInsetGlow state={activeIndex} />

					{/* Dynamic island */}
					<div className='relative z-10 flex h-[32px] shrink-0 items-start justify-center pt-[10px]'>
						<div className='h-[22px] w-[100px] rounded-full bg-black' />
					</div>


					{/* State body. AnimatePresence drives directional swaps once
					 * state implementations land. Step 1 placeholder uses simple
					 * fade so the chrome morph reads cleanly. */}
					<div className='relative z-10 flex min-h-0 flex-1 flex-col'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={activeIndex}
								className='flex min-h-0 flex-1 flex-col'
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={
									prefersReducedMotion
										? { duration: 0 }
										: {
											type: 'spring',
											stiffness: 250,
											damping: 26,
										}
								}
							>
								{renderState ? (
									renderState(activeIndex)
								) : activeIndex === 0 ? (
									<State1Onboarding reducedMotion={prefersReducedMotion} />
								) : activeIndex === 1 ? (
									<State2CreatingCustomers reducedMotion={prefersReducedMotion} />
								) : activeIndex === 2 ? (
									<State3StartTraining reducedMotion={prefersReducedMotion} />
								) : activeIndex === 3 ? (
									<State4CallConnecting reducedMotion={prefersReducedMotion} />
								) : activeIndex === 4 ? (
									<State5LiveCall reducedMotion={prefersReducedMotion} />
								) : activeIndex === 5 ? (
									<State6CallComplete reducedMotion={prefersReducedMotion} />
								) : (
									<PlaceholderBody state={activeIndex} />
								)}
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Stepper. Hidden during State 4. */}
					<AnimatePresence mode='wait'>
						{dot !== null && (
							<motion.div
								key='stepper-mount'
								className='relative z-10 shrink-0'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.25, ease: 'easeOut' }}
							>
								<Stepper activeDot={dot} />
							</motion.div>
						)}
					</AnimatePresence>

					<div className='relative z-10'>
						<HomeIndicator />
					</div>

					{/* Loop-restart black overlay. Renders ABOVE everything inside
					 * the screen during the 6→1 transition to provide the clean
					 * fade-to-black per brief §7 #4. Outside layers (bezel, glow)
					 * stay visible — the "screen" is what blanks. */}
					<motion.div
						aria-hidden
						className='pointer-events-none absolute inset-0 z-30 rounded-[42.4px] bg-black'
						initial={{ opacity: 0 }}
						animate={{ opacity: loopFade ? 1 : 0 }}
						transition={{
							duration: loopFade
								? LOOP_FADE_IN_MS / 1000
								: LOOP_FADE_OUT_MS / 1000,
							ease: 'easeOut',
						}}
					/>
				</div>
			</div>
		</LayoutGroup>
	)
}
