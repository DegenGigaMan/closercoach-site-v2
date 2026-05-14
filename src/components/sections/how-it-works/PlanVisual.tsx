'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Calendar, Check, Checks, Sparkle, SpinnerGap } from '@phosphor-icons/react'
import { CLONE_CARD } from '@/lib/constants'
import TextType from '@/components/ui/text-type'

const SARAH_AVATAR = '/images/step1/avatar-sarah-v2.webp'
const MARCUS_AVATAR = '/images/step1/avatar-marcus-face.webp'
const LOGO_GOOGLE_MEET = '/images/step1/logo-google-meet.svg'
const LOGO_TEAMS = '/images/step1/logo-teams.png'
const LOGO_SALESFORCE = '/images/step1/logo-salesforce.svg'

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

/* Emerald accent in the form SVG attrs + motion JS literals can consume.
 * Mirrors `--cc-accent` (#10B981) but the Tailwind token can't be applied to
 * `fill` / `stroke` / `stopColor` attrs or `animate={{ backgroundColor }}`
 * literals — so we promote the hex to a single source of truth here. */
const EMERALD = '#10B981'

const PHASE = {
	headerLand: 0,
	integrationCascade: 0.20,
	connectedCaption: 0.55,
	railDraw: 1.10,
	calendarCaption: 1.45,
	sarahCard: 1.85,
	marcusCard: 2.10,
	connectorDraw: 2.40,
	cloningStart: 2.55,
	cardReveal: 5.40,
	checkmark: 5.40,
	footerPulse: 6.10,
} as const

const FIELD_TYPE_GAP = 0.18
const FIELD_TYPE_BASE = PHASE.cardReveal + 0.35
const FIELD_START: Record<string, number> = {}
	{
	const ordered = [
		...CLONE_CARD.fields.filter((f) => f.span === 'short'),
		...CLONE_CARD.fields.filter((f) => f.span === 'long'),
	]
	ordered.forEach((f, i) => {
		FIELD_START[f.label] = FIELD_TYPE_BASE + i * FIELD_TYPE_GAP
	})
}

/* Bar segment fill schedule (7 pips, evenly distributed across the cloning
 * window). 7 fills across cloningStart..cardReveal. */
const BAR_FILL_AT: number[] = [
	PHASE.cloningStart + 0.30,
	PHASE.cloningStart + 0.70,
	PHASE.cloningStart + 1.10,
	PHASE.cloningStart + 1.50,
	PHASE.cloningStart + 1.95,
	PHASE.cloningStart + 2.45,
	PHASE.cloningStart + 2.85,
]

/* ─── Icon rail (shared between Checks and Calendar columns) ─── */

function IconRail({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex shrink-0 flex-col items-center gap-2 pb-1.5'>
			{children}
		</div>
	)
}

function RailLine({ inView, reduced, delay }: {
	inView?: boolean
	reduced?: boolean
	delay?: number
}) {
	const animated = typeof delay === 'number'
	if (!animated || reduced) {
		return (
			<span
				aria-hidden='true'
				className='min-h-full w-px flex-1 bg-gradient-to-b from-cc-accent/60 via-cc-accent/30 to-cc-accent/10'
			/>
		)
	}
	return (
		<motion.span
			aria-hidden='true'
			className='min-h-full w-px flex-1 origin-top bg-gradient-to-b from-cc-accent/60 via-cc-accent/30 to-cc-accent/10'
			initial={{ scaleY: 0, opacity: 0 }}
			animate={inView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
			transition={{ duration: 0.5, ease: EASE, delay }}
		/>
	)
}

/* ─── Integrations pill (3 brand logos with cascade reveal) ─── */

function IntegrationsPill({ inView, reduced }: { inView: boolean, reduced: boolean }) {
	const enter = (delay: number) => ({
		initial: { opacity: 0, scale: 0.6 },
		animate: inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 },
		transition: reduced
			? { duration: 0 }
			: { type: 'spring' as const, stiffness: 380, damping: 26, delay: PHASE.integrationCascade + 0.05 + delay },
	})
	return (
		<motion.div
			role='img'
			className='inline-flex items-center gap-2 rounded-[12px] border border-white/[0.06] bg-cc-surface-card/60 px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.05)] backdrop-blur-sm'
			aria-label='Connected to Google Meet, Microsoft Teams, and Salesforce'
			initial={{ opacity: 0, y: 4 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
			transition={reduced
				? { duration: 0 }
				: { duration: 0.35, ease: EASE, delay: PHASE.integrationCascade }
			}
		>
			<motion.div className='flex h-6 w-6 shrink-0 items-center justify-center' {...enter(0)}>
				<Image src={LOGO_GOOGLE_MEET} alt='' width={18} height={15} className='h-[15px] w-[18px]' unoptimized />
			</motion.div>
			<motion.div className='flex h-6 w-6 shrink-0 items-center justify-center' {...enter(0.1)}>
				<Image src={LOGO_TEAMS} alt='' width={24} height={24} className='h-6 w-6 object-contain' unoptimized />
			</motion.div>
			<motion.div className='flex h-8 w-8 shrink-0 items-center justify-center' {...enter(0.2)}>
				<Image src={LOGO_SALESFORCE} alt='' width={26} height={18} className='h-[18px] w-[26px] object-contain' unoptimized />
			</motion.div>
		</motion.div>
	)
}

/* ─── Meeting card (Sarah active / Marcus dim) ─── */

function MeetingCard({ name, time, avatarSrc, active = false, inView, reduced, delay }: {
	name: string, time: string, avatarSrc: string, active?: boolean, inView: boolean, reduced: boolean, delay: number,
}) {
	return (
		<motion.div
			className={[
				'flex w-full items-start gap-2 rounded-[12px] border border-white/10 bg-cc-surface-card p-[9px]',
				'shadow-[-8px_8px_16px_0_rgba(0,0,0,0.6),0_0_20px_0_rgba(16,185,129,0.05)]',
				active ? '' : 'border-white/[0.14]',
			].join(' ').trim()}
			initial={{ opacity: 0, x: -8 }}
			animate={inView ? { opacity: active ? 1 : 0.28, x: 0 } : { opacity: 0, x: -8 }}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE, delay: PHASE.sarahCard + delay }}
		>
			{active && (
				<span
					aria-hidden='true'
					className='self-stretch w-[3px] shrink-0 rounded-full bg-cc-accent'
				/>
			)}
			<div className='flex flex-1 items-start gap-3'>
				<div className='relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
					<Image src={avatarSrc} alt='' fill className='object-cover' sizes='28px' unoptimized />
				</div>
				<div className='flex min-w-0 flex-1 flex-col gap-3 py-1.5'>
					<span className='text-trim truncate text-[14px] font-semibold leading-5 text-[#EBEBEB]'>{name}</span>
					<span className='text-trim truncate text-[12px] leading-none text-white/50'>{time}</span>
				</div>
			</div>
		</motion.div>
	)
}

/* ─── Left visual (integrations + calendar) ─── */

function IconBoxStaged({ children, inView, reduced, delay }: {
	children: React.ReactNode
	inView: boolean
	reduced: boolean
	delay: number
}) {
	return (
		<motion.div
			className='flex shrink-0 items-center justify-center rounded-[4px] bg-cc-accent/10 p-1'
			aria-hidden='true'
			initial={{ opacity: 0, scale: 0.7 }}
			animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
			transition={reduced
				? { duration: 0 }
				: { type: 'spring' as const, stiffness: 380, damping: 26, delay }
			}
		>
			{children}
		</motion.div>
	)
}

function LeftVisual({ inView, reduced }: { inView: boolean, reduced: boolean }) {
	return (
		<div className='flex w-[230px] shrink-0 flex-col gap-2'>
			{/* Integrations row -- AA.3 stage: pill pops in first (0.20s), then
			 * "Connected" caption fades in next to it (0.55s), then the rail
			 * line draws down (1.10s) into the calendar row. */}
			<div className='flex items-stretch gap-3'>
				<IconRail>
					<IconBoxStaged inView={inView} reduced={reduced} delay={PHASE.integrationCascade}>
						<Checks size={16} weight='bold' className='text-cc-accent' />
					</IconBoxStaged>
					<RailLine inView={inView} reduced={reduced} delay={PHASE.railDraw} />
				</IconRail>
				<div className='flex w-[110px] flex-col gap-4 pb-6 pt-2'>
					<motion.span
						className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.1em] text-cc-accent'
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : { opacity: 0 }}
						transition={reduced ? { duration: 0 } : { duration: 0.4, delay: PHASE.connectedCaption, ease: EASE }}
					>
						Connected
					</motion.span>
					<IntegrationsPill inView={inView} reduced={reduced} />
				</div>
			</div>

			{/* Calendar row -- AA.3 stage: calendar icon + "TODAY'S MEETINGS"
			 * caption land at PHASE.calendarCaption (1.45s), then Sarah card
			 * (1.85s), then Marcus (2.10s). */}
			<div className='flex w-full items-stretch gap-3'>
				<IconRail>
					<IconBoxStaged inView={inView} reduced={reduced} delay={PHASE.calendarCaption}>
						<Calendar size={16} weight='duotone' className='text-cc-accent' />
					</IconBoxStaged>
					{/* Bottom rail stays static -- only the top rail "comes down". */}
					<RailLine />
				</IconRail>
				<div className='flex flex-1 flex-col gap-4 pt-2'>
					<motion.span
						className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-white/80'
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : { opacity: 0 }}
						transition={reduced ? { duration: 0 } : { duration: 0.4, delay: PHASE.calendarCaption + 0.05, ease: EASE }}
					>
						Today&apos;s Meetings
					</motion.span>
					<div className='flex flex-col gap-3'>
						<MeetingCard name='Sarah Chen' time='10:30am' avatarSrc={SARAH_AVATAR} active inView={inView} reduced={reduced} delay={0} />
						<MeetingCard name='Marcus Rivera' time='2:00pm' avatarSrc={MARCUS_AVATAR} inView={inView} reduced={reduced} delay={0.25} />
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Right visual (clone) ─── */

function CloneHeader({ filled, reduced, isComplete }: { filled: number, reduced: boolean, isComplete: boolean }) {
	return (
		<div className='flex w-full flex-col gap-3 px-3'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					{isComplete ? (
						<Check size={20} weight='bold' className='text-cc-accent' aria-hidden='true' />
					) : (
						<SpinnerGap
							size={20}
							weight='bold'
							className={`text-cc-accent ${reduced ? '' : 'animate-spin'}`}
							aria-hidden='true'
						/>
					)}
					<span className='text-trim font-[family-name:var(--font-mono)] text-[14px] font-semibold uppercase tracking-[0.12em] text-cc-accent'>
						{isComplete ? 'Cloned' : 'Cloning'}
					</span>
				</div>
				<div className='flex items-baseline tabular-nums'>
					<span className='text-[18px] font-semibold leading-[18px] text-cc-accent'>{filled}</span>
					<span className='text-[14px] leading-[18px] tracking-[0.06em] text-cc-text-secondary'>/7</span>
				</div>
			</div>
			<div className='flex h-[3px] w-full items-start gap-1' aria-hidden='true'>
				{Array.from({ length: 7 }).map((_, i) => (
					<span
						key={i}
						className={`h-full min-w-px flex-1 rounded-full transition-colors duration-300 ease-out ${i < filled ? 'bg-cc-accent' : 'bg-white/15'}`}
					/>
				))}
			</div>
		</div>
	)
}

function FieldShort({ label, value, start }: {
	label: string
	value: string
	start: boolean
}) {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.04em] text-cc-text-secondary'>
				{label}
			</span>
			<TextType
				as='span'
				className='text-trim font-sans text-[13px] leading-[18px] text-white'
				text={value}
				start={start}
				typingSpeed={26}
				cursorClassName='text-cc-accent/80'
			/>
		</div>
	)
}

function FieldLong({ label, value, start }: {
	label: string
	value: string
	start: boolean
}) {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.04em] text-cc-text-secondary'>
				{label}
			</span>
			<TextType
				as='span'
				className='text-balance font-sans text-[12px] leading-[17px] text-white/95'
				text={value}
				start={start}
				typingSpeed={22}
				cursorClassName='text-cc-accent/80'
			/>
		</div>
	)
}

function ProofBadge({ pulse }: { pulse: boolean }) {
	return (
		<motion.div
			className='inline-flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-foundation px-[11px] py-[5px]'
			initial={{ opacity: 0 }}
			animate={pulse ? { opacity: 1 } : undefined}
			transition={pulse ? { duration: 0.5, ease: 'easeOut' } : undefined}
		>
			<Sparkle size={10} weight='fill' className='text-cc-accent' aria-hidden='true' />
			<span className='text-trim whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] font-normal uppercase leading-[15px] tracking-[0.05em] text-cc-accent'>
				7 Layers of Personalization
			</span>
		</motion.div>
	)
}

function CloneCard({ reduced, pulseFooter, fieldStarts }: {
	reduced: boolean
	pulseFooter: boolean
	fieldStarts: Record<string, boolean>
}) {
	const shortFields = CLONE_CARD.fields.filter((f) => f.span === 'short')
	const longFields = CLONE_CARD.fields.filter((f) => f.span === 'long')
	return (
		<motion.div
			className='relative w-full rounded-2xl border-[0.5px] border-cc-accent/60 bg-cc-surface-card px-[12.5px] pb-[32.5px] pt-[12.5px] shadow-[-8px_8px_16px_0_rgba(0,0,0,0.6),0_0_24px_0_rgba(16,185,129,0.18)]'
			initial={{ opacity: 0, scale: 0.92 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.96 }}
			transition={reduced
				? { duration: 0 }
				: { type: 'spring' as const, stiffness: 320, damping: 24 }
			}
		>
			<div className='flex flex-col gap-3.5'>
				{/* Top row: Sarah avatar + name + AI Clone badge */}
				<div className='flex items-center gap-2.5'>
					<div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
						<Image src={SARAH_AVATAR} alt='Sarah Chen portrait' fill className='object-cover' sizes='40px' unoptimized />
					</div>
					<span className='text-trim flex-1 truncate font-[family-name:var(--font-heading)] text-[15px] font-bold leading-[18px] text-white'>
						{CLONE_CARD.name}
					</span>
					<span className='inline-flex items-center rounded-md border border-cc-accent/30 bg-cc-accent/15 px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase leading-none tracking-[0.08em] text-cc-accent'>
						AI Clone
					</span>
				</div>

					<div className='grid grid-cols-2 gap-x-3 gap-y-3.5'>
					{shortFields.map((f) => (
						<FieldShort
							key={f.label}
							label={f.label}
							value={f.value}
							start={fieldStarts[f.label] ?? false}
						/>
					))}
				</div>

				{/* Stack of 3 long full-width rows. Begin after the short-field
				 * cascade lands so the eye reads short -> long without overlap. */}
				<div className='flex flex-col gap-3'>
					{longFields.map((f) => (
						<FieldLong
							key={f.label}
							label={f.label}
							value={f.value}
							start={fieldStarts[f.label] ?? false}
						/>
					))}
				</div>
			</div>

			{/* 7 Layers proof badge anchored on the bottom edge */}
			<div className='absolute -bottom-[12.5px] left-1/2 -translate-x-1/2'>
				<ProofBadge pulse={pulseFooter} />
			</div>
		</motion.div>
	)
}

function CloningLabState({ reduced }: { reduced: boolean }) {
	return (
		<motion.div
			className='relative flex w-full flex-col items-center gap-5 rounded-2xl border-[0.5px] border-cc-accent/30 bg-cc-foundation/60 px-6 py-8'
			style={{
				/* Faint dotted grid for "lab table" feel. */
				backgroundImage:
					'radial-gradient(circle at 1px 1px, rgba(16,185,129,0.12) 1px, transparent 1px)',
				backgroundSize: '12px 12px',
			}}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 0.98 }}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
			role='status'
			aria-live='polite'
			aria-label='Cloning Sarah'
		>
			{/* Halo + scanline frame */}
			<div className='relative flex h-[140px] w-[140px] items-center justify-center'>
				{/* Outer pulsing halo */}
				<motion.div
					aria-hidden='true'
					className='absolute inset-0 rounded-full'
					style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.12) 45%, transparent 70%)' }}
					initial={{ scale: 0.92, opacity: 0.7 }}
					animate={reduced
						? { scale: 1, opacity: 1 }
						: { scale: [0.92, 1.08, 0.92], opacity: [0.55, 1, 0.55] }
					}
					transition={reduced
						? { duration: 0 }
						: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' }
					}
				/>
				{/* Inner avatar (source: Sarah). Renders behind the scanline. */}
				<div className='relative h-[88px] w-[88px] overflow-hidden rounded-full ring-2 ring-cc-accent/60 shadow-[0_0_24px_rgba(16,185,129,0.5)]'>
					<Image
						src={SARAH_AVATAR}
						alt=''
						fill
						className='object-cover'
						sizes='88px'
						unoptimized
					/>
					{/* Scanline beam: travels top -> bottom, 4s loop */}
					{!reduced && (
						<motion.div
							aria-hidden='true'
							className='absolute inset-x-0 h-[6px]'
							style={{
								background:
									'linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.8) 40%, rgba(16,185,129,1) 50%, rgba(16,185,129,0.8) 60%, transparent 100%)',
								boxShadow: '0 0 12px rgba(16,185,129,0.9)',
							}}
							initial={{ y: -8 }}
							animate={{ y: 88 }}
							transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
						/>
					)}
				</div>
			</div>

				<div className='flex flex-col items-center gap-1'>
				<span className='text-trim font-sans text-[14px] font-semibold text-cc-accent'>
					Cloning Sarah
				</span>
				<span className='text-trim font-sans text-[11px] text-cc-text-secondary'>
					7-layer behavioral model
				</span>
			</div>
		</motion.div>
	)
}

function Connector({ inView, reduced, delay }: {
	inView?: boolean
	reduced?: boolean
	delay?: number
}) {
	const animated = typeof delay === 'number'
	return (
		<svg
			aria-hidden='true'
			width='82'
			height='6'
			viewBox='0 0 82 6'
			className='pointer-events-none absolute -left-[82px] top-[224px]'
		>
			<defs>
				<linearGradient id='cc-plan-link' x1='0%' y1='50%' x2='100%' y2='50%'>
					<stop offset='0%' stopColor={EMERALD} stopOpacity='0.9' />
					<stop offset='100%' stopColor={EMERALD} stopOpacity='0.9' />
				</linearGradient>
			</defs>
			<motion.circle
				cx='3' cy='3' r='3' fill={EMERALD}
				initial={animated && !reduced ? { opacity: 0 } : false}
				animate={animated ? (inView ? { opacity: 1 } : { opacity: 0 }) : undefined}
				transition={animated && !reduced ? { duration: 0.25, delay } : undefined}
			/>
			<motion.rect
				x='3' y='2' width='76' height='2' rx='1' fill='url(#cc-plan-link)'
				style={{ transformOrigin: 'left center' }}
				initial={animated && !reduced ? { scaleX: 0, opacity: 0 } : false}
				animate={animated ? (inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }) : undefined}
				transition={animated && !reduced ? { duration: 0.4, ease: EASE, delay: delay + 0.1 } : undefined}
			/>
			<motion.circle
				cx='79' cy='3' r='3' fill={EMERALD}
				initial={animated && !reduced ? { opacity: 0 } : false}
				animate={animated ? (inView ? { opacity: 1 } : { opacity: 0 }) : undefined}
				transition={animated && !reduced ? { duration: 0.25, delay: delay + 0.45 } : undefined}
			/>
		</svg>
	)
}

function CloneVisual({ reduced, filled, pulseFooter, isComplete, cardRevealed, cloningStarted, inView, fieldStarts }: {
	reduced: boolean
	filled: number
	pulseFooter: boolean
	isComplete: boolean
	cardRevealed: boolean
	cloningStarted: boolean
	inView: boolean
	fieldStarts: Record<string, boolean>
}) {
	return (
		<div className='relative flex w-[280px] shrink-0 flex-col items-center gap-4'>
			<motion.div
				className='flex w-full flex-col items-center gap-4'
				initial={{ opacity: 0 }}
				animate={cloningStarted ? { opacity: 1 } : { opacity: 0 }}
				transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
			>
				<CloneHeader filled={filled} reduced={reduced} isComplete={isComplete} />
				<div className='relative w-full min-h-[340px]'>
					<AnimatePresence mode='wait' initial={false}>
						{cardRevealed ? (
							<CloneCard key='card' reduced={reduced} pulseFooter={pulseFooter} fieldStarts={fieldStarts} />
						) : (
							<CloningLabState key='lab' reduced={reduced} />
						)}
					</AnimatePresence>
				</div>
			</motion.div>
			<Connector inView={inView} reduced={reduced} delay={PHASE.connectorDraw} />
		</div>
	)
}

/* ─── Root ─── */

export default function PlanVisual({}: { devPin?: boolean } = {}) {
	const reduced = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)
	useEffect(() => {
		const el = ref.current
		if (!el) return
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					io.disconnect()
				}
			},
			{ threshold: 0 },
		)
		io.observe(el)
		const fallback = setTimeout(() => {
			const rect = el.getBoundingClientRect()
			if (rect.top < window.innerHeight && rect.bottom > 0) setInView(true)
		}, 500)
		return () => { io.disconnect(); clearTimeout(fallback) }
	}, [])

	const [filled, setFilled] = useState(reduced ? 7 : 0)
	const [pulseFooter, setPulseFooter] = useState(reduced)
	const [isComplete, setIsComplete] = useState(reduced)
	const [cardRevealed, setCardRevealed] = useState(reduced)
	const [cloningStarted, setCloningStarted] = useState(reduced)
	const [fieldStarts, setFieldStarts] = useState<Record<string, boolean>>(
		() => Object.fromEntries(CLONE_CARD.fields.map((f) => [f.label, reduced])),
	)

	useEffect(() => {
		if (reduced) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- prefers-reduced-motion short-circuit fast-forwards all sub-states; intentional one-shot batch update
			setFilled(7)
			setPulseFooter(false)
			setIsComplete(true)
			setCardRevealed(true)
			setCloningStarted(true)
			setFieldStarts(Object.fromEntries(CLONE_CARD.fields.map((f) => [f.label, true])))
			return
		}
		if (!inView) return
		const timeouts: ReturnType<typeof setTimeout>[] = []
		const tCloningStart = setTimeout(() => setCloningStarted(true), PHASE.cloningStart * 1000)
		timeouts.push(tCloningStart)
		BAR_FILL_AT.forEach((at, i) => {
			const t = setTimeout(() => setFilled(i + 1), at * 1000)
			timeouts.push(t)
		})
		const tComplete = setTimeout(() => setIsComplete(true), PHASE.checkmark * 1000)
		const tReveal = setTimeout(() => setCardRevealed(true), PHASE.cardReveal * 1000)
		const tPulse = setTimeout(() => setPulseFooter(true), PHASE.footerPulse * 1000)
		timeouts.push(tComplete, tReveal, tPulse)
		CLONE_CARD.fields.forEach((f) => {
			const at = FIELD_START[f.label]
			if (at == null) return
			const t = setTimeout(() => {
				setFieldStarts((prev) => ({ ...prev, [f.label]: true }))
			}, at * 1000)
			timeouts.push(t)
		})
		return () => timeouts.forEach(clearTimeout)
	}, [inView, reduced])

	return (
		<div
			ref={ref}
			data-step='1'
			className='flex h-full w-full items-center justify-center px-8 py-10 md:px-12 md:py-14'
		>
			<div className='flex items-center gap-[79px]'>
				<LeftVisual inView={inView} reduced={reduced} />
				<CloneVisual
					reduced={reduced}
					filled={filled}
					pulseFooter={pulseFooter}
					isComplete={isComplete}
					cardRevealed={cardRevealed}
					cloningStarted={cloningStarted}
					inView={inView}
					fieldStarts={fieldStarts}
				/>
			</div>
		</div>
	)
}
