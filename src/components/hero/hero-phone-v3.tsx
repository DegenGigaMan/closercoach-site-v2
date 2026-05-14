'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
	AnimatePresence,
	LayoutGroup,
	motion,
	useInView,
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

const STATE_DWELL_MS: Record<HeroV3StateIndex, number> = {
	0: 3400,
	1: 5800,
	2: 3600,
	3: 4800,
	4: 6800,
	5: 6600,
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

const STATE2_PILLS: ReadonlyArray<{ icon: PhosphorIcon, label: string }> = [
	{ icon: Binoculars, label: 'Analyzing Ideal Customer Profile' },
	{ icon: UserSound, label: 'Configuring Realistic Voices' },
	{ icon: HeadCircuit, label: 'Setting up Buyer Behavior' },
] as const

function State2CreatingCustomers({ reducedMotion }: { reducedMotion: boolean }) {
	return (
		<div className='flex h-full flex-col items-center justify-center gap-10 px-4 pb-2 pt-4'>
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
		photo: '/images/prospects/brandon.webp',
		heightPx: 320,
	},
	{
		id: 'camil',
		name: 'Camil',
		age: 42,
		role: 'Homeowner • Phoenix, AZ',
		quote: '“We don’t want to sell the house.”',
		difficulty: 'Hard',
		difficultyColor: '#FF5A5A',
		photo: '/images/prospects/camil-v3.webp',
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
		photo: '/images/prospects/caleb.webp',
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

const SPRING_SCORE = { type: 'spring' as const, stiffness: 300, damping: 18 }

const STATE6_SCORECARDS: ReadonlyArray<{
	title: string
	desc: string
	grade: string
	ringFill: number
	ringColor: string
}> = [
	{
		title: 'Building Rapport',
		desc: 'You made Camil feel heard right away.',
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

	return (
		<div className='relative flex h-full flex-col items-center gap-4 overflow-hidden px-4 pb-2 pt-8'>
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
							src='/images/prospects/camil-v3.webp'
							alt='AI Coach'
							fill
							sizes='40px'
							className='object-cover'
							style={{ objectPosition: 'center top' }}
						/>
					</div>
					<div className='flex-1 rounded-[12px] rounded-tl-none border border-white/[0.06] bg-[#09f] p-3'>
						<p className='text-trim font-sans text-[14px] font-medium leading-[1.4] text-white'>
							Good opener. Next time, lead with the cash offer benefit earlier — Camil needs to hear speed and certainty upfront.
						</p>
					</div>
				</motion.div>
			</div>

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
				animate={{ opacity: 1, y: 0 }}
				transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 2.7 }}
			>
				<span className='text-trim text-[16px] font-bold text-[#313131] [font-family:var(--font-cta),system-ui,sans-serif]'>
					Practice Again
				</span>
				<ArrowsCounterClockwise size={16} weight='bold' className='text-[#313131]' />
			</motion.button>
		</div>
	)
}

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
							src='/images/prospects/camil-v3.webp'
							alt=''
							fill
							sizes='20px'
							className='object-cover'
							style={{ objectPosition: 'center top' }}
						/>
					</div>
				)}
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
				<div className='flex flex-col items-center justify-center gap-6 border-b border-white/[0.15] pb-4'>
				<div className='flex flex-col items-center gap-2'>
					<motion.div
						layoutId='prospect-camil-avatar'
						className='relative size-[48px] overflow-hidden rounded-full border border-white/[0.05]'
					>
						<Image
							src='/images/prospects/camil-v3.webp'
							alt='Camil'
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
							Camil
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

				<motion.div
				className='flex items-center gap-2 rounded-[24px] border border-cc-accent/60 bg-cc-accent/15 py-[5px] pl-[5px] pr-[9px] shadow-[0_0_20px_rgba(16,185,129,0.4)]'
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 0.2 }}
			>
				<div className='flex size-[40px] shrink-0 items-center justify-center rounded-full bg-cc-accent/25'>
					<Microphone size={24} weight='fill' className='text-white' />
				</div>
				<span className='text-trim flex-1 font-sans text-[14px] font-medium leading-[1.4] text-white/90'>
					Recording your response
				</span>
				<MicWaveform bars={12} reducedMotion={reducedMotion} />
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
						src='/images/prospects/camil-v3.webp'
						alt='Camil'
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

function State3StartTraining({ reducedMotion, isPressed }: { reducedMotion: boolean; isPressed: boolean }) {
	const cardConfig = {
		camil: { delay: 0.4, fromX: 0 },
		brandon: { delay: 0.55, fromX: -40 },
		caleb: { delay: 0.7, fromX: 40 },
	} as const

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

			{/* Call Camil CTA. */}
			<motion.div
				animate={isPressed ? { scale: [1, 0.86, 1.03, 1] } : { scale: 1 }}
				transition={isPressed ? { duration: 0.3, times: [0, 0.2, 0.75, 1] } : { duration: 0 }}
				className='w-full'
			>
				<motion.button
					type='button'
					className='flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[27px] bg-cc-mint shadow-[0_8px_20px_rgba(52,225,142,0.18)]'
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 1.1 }}
				>
					<span className='text-trim text-[16px] font-bold text-black [font-family:var(--font-cta),system-ui,sans-serif]'>
						Call Camil
					</span>
					<ArrowRight size={16} weight='bold' className='text-black' />
				</motion.button>
			</motion.div>
		</div>
	)
}

function State1Onboarding({ reducedMotion, isPressed }: { reducedMotion: boolean; isPressed: boolean }) {

	return (
		<div className='flex h-full flex-col items-center justify-between px-4 pb-2 pt-2'>
			<div className='flex flex-1 w-full flex-col items-center justify-center gap-10'>
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

				<BrowserMock reducedMotion={reducedMotion} />
			</div>

			<motion.div
				animate={isPressed ? { scale: [1, 0.86, 1.03, 1] } : { scale: 1 }}
				transition={isPressed ? { duration: 0.3, times: [0, 0.2, 0.75, 1] } : { duration: 0 }}
				className='mt-4 w-full'
			>
				<motion.button
					type='button'
					className='flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[27px] bg-cc-mint shadow-[0_8px_20px_rgba(52,225,142,0.18)]'
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={reducedMotion ? { duration: 0 } : { ...SPRING_FIELD, delay: 1.05 }}
				>
					<span className='text-trim text-[16px] font-bold text-black [font-family:var(--font-cta),system-ui,sans-serif]'>
						Continue
					</span>
					<ArrowRight size={16} weight='bold' className='text-black' />
				</motion.button>
			</motion.div>
		</div>
	)
}

/* ─── Phone screen chrome (per-state bg + bezel inset glow) ─────── */

function ScreenBackground({ state }: { state: HeroV3StateIndex }) {
	if (state === 5) {
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
	const [btnPressed, setBtnPressed] = useState(false)

	/* Visibility gate: pause the state cycle when the phone scrolls out of
	 * view, resume from the last active state when it scrolls back in.
	 * `amount: 0.3` = active when at least 30% of the phone is in viewport.
	 * autoIndexRef lets the resume path read the latest autoIndex without
	 * making the effect re-fire on every state advance. */
	const containerRef = useRef<HTMLDivElement>(null)
	const inView = useInView(containerRef, { amount: 0.3 })
	const autoIndexRef = useRef<HeroV3StateIndex>(0)
	useEffect(() => {
		autoIndexRef.current = autoIndex
	}, [autoIndex])

	useEffect(() => {
		if (!autoplay || prefersReducedMotion || !inView) return
		let advanceTimer: ReturnType<typeof setTimeout> | null = null
		let pressTimer:   ReturnType<typeof setTimeout> | null = null
		let fadeInTimer:  ReturnType<typeof setTimeout> | null = null
		let fadeOutTimer: ReturnType<typeof setTimeout> | null = null

		/* States that have a CTA button to press before advancing. */
		const PRESSABLE_STATES = new Set<HeroV3StateIndex>([0, 2])

		const scheduleNext = (current: HeroV3StateIndex) => {
			setBtnPressed(false)

			/* Fire the press animation PRESS_LEAD_MS before the state advances. */
			if (PRESSABLE_STATES.has(current)) {
				pressTimer = setTimeout(() => {
					setBtnPressed(true)
				}, STATE_DWELL_MS[current] - PRESS_LEAD_MS)
			}

			advanceTimer = setTimeout(() => {
				setBtnPressed(false)
				if (current === 5) {
					setLoopFade(true)
					fadeInTimer = setTimeout(() => {
						setAutoIndex(0)
						fadeOutTimer = setTimeout(() => {
							setLoopFade(false)
							scheduleNext(0)
						}, LOOP_FADE_HOLD_MS)
					}, LOOP_FADE_IN_MS)
				} else {
					/* Skip state 3 (Call Connecting) — jump straight from 2 → 4 */
					const next = (current === 2 ? 4 : current + 1) as HeroV3StateIndex
					setAutoIndex(next)
					scheduleNext(next)
				}
			}, STATE_DWELL_MS[current])
		}

		scheduleNext(autoIndexRef.current)
		return () => {
			if (advanceTimer) clearTimeout(advanceTimer)
			if (pressTimer)   clearTimeout(pressTimer)
			if (fadeInTimer)  clearTimeout(fadeInTimer)
			if (fadeOutTimer) clearTimeout(fadeOutTimer)
		}
	}, [autoplay, prefersReducedMotion, inView])

	const activeIndex: HeroV3StateIndex = autoplay ? autoIndex : pinnedState

	const dot = stepperDotForState(activeIndex)
	return (
		<LayoutGroup>
			<div
				ref={containerRef}
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
									<State1Onboarding reducedMotion={prefersReducedMotion} isPressed={btnPressed} />
								) : activeIndex === 1 ? (
									<State2CreatingCustomers reducedMotion={prefersReducedMotion} />
								) : activeIndex === 2 ? (
									<State3StartTraining reducedMotion={prefersReducedMotion} isPressed={btnPressed} />
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
