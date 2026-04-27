/** @fileoverview S3 Step 1 "Plan" visual — standalone composition with R-09
 * cinematic motion sequence (Wave C 2026-04-25).
 *
 * Composition (horizontal flex, gap-[79px] at desktop):
 *   ┌ LEFT  ───────────────────────────── ┐  ┌ RIGHT ──────────────── ┐
 *   │ [✓✓]─┐  CONNECTED                   │  │ ⟳ Cloning…       N/7    │
 *   │      │  [GMeet · Teams · Salesforce]│  │ ▆▆▆▆▆▆▆                 │
 *   │      │                              │  │ ┌─Clone card──────────┐ │
 *   │ [📅]─┤  TODAY'S MEETINGS            │  │ │ [Sarah] Sarah Chen  │ │
 *   │      │  ┌─Sarah 10:30am (active)──┐ │──┤ │ JOB     CREDIT      │ │
 *   │      │  └───────────────────────  ┘ │  │ │ HHI     DECISION    │ │
 *   │      │  ┌─Marcus 2:00pm  (dim) ───┐ │  │ │ LIKELY OBJECTION    │ │
 *   │      │  └─────────────────────────┘ │  │ │ HOW TO HANDLE       │ │
 *   │                                      │  │ │ BUYER SIGNAL        │ │
 *   │                                      │  │ │ [7 LAYERS BADGE]    │ │
 *   │                                      │  │ └─────────────────────┘ │
 *   └──────────────────────────────────── ┘  └────────────────────────┘
 *
 * R-09 motion sequence (5 phases, ~4.4s total):
 *   Phase 1 (0.0–0.6s):   Header (avatar + name + AI Clone pill) lands.
 *   Phase 2 (0.6–1.0s):   "CONNECTED" pill activates + 3 integration logos cascade.
 *   Phase 3 (1.0–1.6s):   "TODAY'S MEETINGS" populates — Sarah active, Marcus dim.
 *   Phase 4 (1.6–4.0s):   Cloning bar fills 0→7 as each field typewriter-fills.
 *   Phase 5 (4.0–4.4s):   Spinner→checkmark, "7 LAYERS" footer pulses emerald.
 *
 * Each phase is gated by an in-viewport flag. Reduced-motion: settles
 * instantly to phase-5 state. Re-trigger: useInView with viewport reset.
 *
 * Library: typewriter via `<TextType>` (ReactBits TextType, adapted to TS,
 * src/components/ui/text-type.tsx). Other motion via motion/react primitives.
 *
 * Copy source: vault/clients/closer-coach/copy/lp-copy-deck-v5.md §S3 Step 1.
 * Field schema source: src/lib/constants.ts CLONE_CARD (R-11 B2C lock).
 * Motion spec: vault/clients/closer-coach/design/hero-s3-connected-system-spec.md.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Calendar, Check, Checks, Sparkle, SpinnerGap } from '@phosphor-icons/react'
import { CLONE_CARD } from '@/lib/constants'
import TextType from '@/components/ui/text-type'

const SARAH_AVATAR = '/images/step1/avatar-sarah-v2.png'
const MARCUS_AVATAR = '/images/step1/avatar-marcus-face.png'
const LOGO_GOOGLE_MEET = '/images/step1/logo-google-meet.svg'
const LOGO_TEAMS = '/images/step1/logo-teams.png'
const LOGO_SALESFORCE = '/images/step1/logo-salesforce.svg'

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

/* Emerald accent in the form SVG attrs + motion JS literals can consume.
 * Mirrors `--cc-accent` (#10B981) but the Tailwind token can't be applied to
 * `fill` / `stroke` / `stopColor` attrs or `animate={{ backgroundColor }}`
 * literals — so we promote the hex to a single source of truth here. */
const EMERALD = '#10B981'

/* Motion-sequence phase timings (seconds). Phase = milestone in the cloning
 * narrative. Field typewriter timings derived per field length. */
const PHASE = {
	headerLand: 0,
	integrationCascade: 0.6,
	meetingsPopulate: 1.0,
	cloningStart: 1.6,
	checkmark: 4.0,
} as const

/* Per-field typewriter delay (relative to start, seconds). Short fields fire
 * in parallel; long fields stack sequentially because reading them fast feels
 * unnatural. Each delay corresponds to a corresponding bar segment lighting up. */
const FIELD_START: Record<string, number> = {
	JOB: PHASE.cloningStart,
	'CREDIT SCORE': PHASE.cloningStart + 0.18,
	HHI: PHASE.cloningStart + 0.36,
	'DECISION MAKER': PHASE.cloningStart + 0.54,
	'LIKELY OBJECTION': PHASE.cloningStart + 0.78,
	'HOW TO HANDLE': PHASE.cloningStart + 1.5,
	'BUYER SIGNAL': PHASE.cloningStart + 2.15,
}

/* Bar fill order (matches field reveal cadence). When the field completes
 * typing, its corresponding segment lights up. */
const BAR_FILL_AT: number[] = [
	PHASE.cloningStart + 0.15,        // Phase: short field 1
	PHASE.cloningStart + 0.33,        // Short 2
	PHASE.cloningStart + 0.51,        // Short 3
	PHASE.cloningStart + 0.69,        // Short 4
	PHASE.cloningStart + 1.45,        // Long 1 done
	PHASE.cloningStart + 2.10,        // Long 2 done
	PHASE.cloningStart + 2.40,        // Long 3 done
]

/* ─── Icon rail (shared between Checks and Calendar columns) ─── */

function IconRail({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex shrink-0 flex-col items-center gap-2 pb-1.5'>
			{children}
		</div>
	)
}

function IconBox({ children }: { children: React.ReactNode }) {
	return (
		<div
			className='flex shrink-0 items-center justify-center rounded-[4px] bg-cc-accent/10 p-1'
			aria-hidden='true'
		>
			{children}
		</div>
	)
}

function RailLine() {
	return (
		<span
			aria-hidden='true'
			className='min-h-full w-px flex-1 bg-gradient-to-b from-cc-accent/60 via-cc-accent/30 to-cc-accent/10'
		/>
	)
}

/* ─── Integrations pill (3 brand logos with cascade reveal) ─── */

function IntegrationsPill({ inView, reduced }: { inView: boolean, reduced: boolean }) {
	const enter = (delay: number) => ({
		initial: { opacity: 0, scale: 0.6 },
		animate: inView ? { opacity: 1, scale: 1 } : undefined,
		transition: reduced
			? { duration: 0 }
			: { type: 'spring' as const, stiffness: 380, damping: 26, delay: PHASE.integrationCascade + delay },
	})
	return (
		<div
			role='img'
			className='inline-flex items-center gap-2 rounded-[12px] border border-white/[0.06] bg-cc-surface-card/60 px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.05)] backdrop-blur-sm'
			aria-label='Connected to Google Meet, Microsoft Teams, and Salesforce'
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
		</div>
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
			animate={inView ? { opacity: active ? 1 : 0.28, x: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE, delay: PHASE.meetingsPopulate + delay }}
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

function LeftVisual({ inView, reduced }: { inView: boolean, reduced: boolean }) {
	return (
		<div className='flex w-[230px] shrink-0 flex-col gap-2'>
			{/* Integrations row */}
			<div className='flex items-stretch gap-3'>
				<IconRail>
					<IconBox>
						<Checks size={16} weight='bold' className='text-cc-accent' />
					</IconBox>
					<RailLine />
				</IconRail>
				<div className='flex w-[110px] flex-col gap-4 pb-6 pt-2'>
					<motion.span
						className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.1em] text-cc-accent'
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : undefined}
						transition={reduced ? { duration: 0 } : { duration: 0.4, delay: PHASE.integrationCascade, ease: EASE }}
					>
						Connected
					</motion.span>
					<IntegrationsPill inView={inView} reduced={reduced} />
				</div>
			</div>

			{/* Calendar row */}
			<div className='flex w-full items-stretch gap-3'>
				<IconRail>
					<IconBox>
						<Calendar size={16} weight='duotone' className='text-cc-accent' />
					</IconBox>
					<RailLine />
				</IconRail>
				<div className='flex flex-1 flex-col gap-4 pt-2'>
					<motion.span
						className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-white/80'
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : undefined}
						transition={reduced ? { duration: 0 } : { duration: 0.4, delay: PHASE.meetingsPopulate, ease: EASE }}
					>
						Today&apos;s Meetings
					</motion.span>
					<div className='flex flex-col gap-3'>
						<MeetingCard name='Sarah Chen' time='10:30am' avatarSrc={SARAH_AVATAR} active inView={inView} reduced={reduced} delay={0.1} />
						<MeetingCard name='Marcus Rivera' time='2:00pm' avatarSrc={MARCUS_AVATAR} inView={inView} reduced={reduced} delay={0.2} />
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Right visual (clone) ─── */

/* Cloning header — drives the count from 0/7 → 7/7 in time with each field
 * completion. When complete, the spinner morphs into a checkmark. */
function CloneHeader({ filled, reduced, isComplete }: { filled: number, reduced: boolean, isComplete: boolean }) {
	return (
		<div className='flex w-full flex-col gap-2 px-3'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-1'>
					{isComplete ? (
						<Check size={16} weight='bold' className='text-cc-accent' aria-hidden='true' />
					) : (
						<SpinnerGap
							size={16}
							weight='bold'
							className={`text-cc-accent ${reduced ? '' : 'animate-spin'}`}
							aria-hidden='true'
						/>
					)}
					<span className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-semibold uppercase tracking-[0.1em] text-cc-accent'>
						{isComplete ? 'Cloned' : 'Cloning…'}
					</span>
				</div>
				<div className='flex items-baseline tabular-nums'>
					<span className='text-[14px] font-semibold leading-[15px] text-cc-accent'>{filled}</span>
					<span className='text-[12px] leading-[15px] tracking-[0.06em] text-cc-text-secondary'>/7</span>
				</div>
			</div>
			<div className='flex h-1 w-full items-start gap-1' aria-hidden='true'>
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

/* Short field — typewriter-fills the value once start=true. */
function FieldShort({ label, value, start }: { label: string, value: string, start: boolean }) {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.04em] text-cc-text-secondary'>
				{label}
			</span>
			<TextType
				as='span'
				text={value}
				start={start}
				typingSpeed={26}
				cursorClassName='text-cc-accent'
				className='text-trim font-sans text-[13px] leading-[18px] text-white'
			/>
		</div>
	)
}

/* Long field — typewriter-fills sentence-length value with text-balance wrap. */
function FieldLong({ label, value, start }: { label: string, value: string, start: boolean }) {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.04em] text-cc-text-secondary'>
				{label}
			</span>
			<TextType
				as='span'
				text={value}
				start={start}
				typingSpeed={14}
				cursorClassName='text-cc-accent'
				className='text-balance font-sans text-[12px] leading-[17px] text-white/95'
			/>
		</div>
	)
}

function ProofBadge({ pulse }: { pulse: boolean }) {
	return (
		<motion.div
			className='inline-flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-foundation px-[11px] py-[5px]'
			initial={{ boxShadow: '0 0 16px rgba(16,185,129,0.25)' }}
			animate={pulse
				? { boxShadow: ['0 0 16px rgba(16,185,129,0.25)', '0 0 32px rgba(16,185,129,0.7)', '0 0 16px rgba(16,185,129,0.3)'] }
				: undefined
			}
			transition={pulse ? { duration: 1.0, ease: 'easeOut' } : undefined}
		>
			<Sparkle size={10} weight='fill' className='text-cc-accent' aria-hidden='true' />
			<span className='text-trim whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] font-normal uppercase leading-[15px] tracking-[0.05em] text-cc-accent'>
				7 Layers of Personalization
			</span>
		</motion.div>
	)
}

function CloneCard({ inView, reduced, fieldStarts, pulseFooter }: {
	inView: boolean
	reduced: boolean
	fieldStarts: Record<string, boolean>
	pulseFooter: boolean
}) {
	const shortFields = CLONE_CARD.fields.filter((f) => f.span === 'short')
	const longFields = CLONE_CARD.fields.filter((f) => f.span === 'long')
	return (
		<motion.div
			className='relative w-full rounded-2xl border-[0.5px] border-cc-accent/60 bg-cc-surface-card px-[12.5px] pb-[32.5px] pt-[12.5px] shadow-[-8px_8px_16px_0_rgba(0,0,0,0.6),0_0_20px_0_rgba(16,185,129,0.05)]'
			initial={{ opacity: 0, y: 8 }}
			animate={inView ? { opacity: 1, y: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 26, delay: PHASE.headerLand }}
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

				{/* 2-col grid for 4 short fields */}
				<div className='grid grid-cols-2 gap-x-3 gap-y-3.5'>
					{shortFields.map((f) => (
						<FieldShort key={f.label} label={f.label} value={f.value} start={fieldStarts[f.label] ?? false} />
					))}
				</div>

				{/* Stack of 3 long full-width rows */}
				<div className='flex flex-col gap-3'>
					{longFields.map((f) => (
						<FieldLong key={f.label} label={f.label} value={f.value} start={fieldStarts[f.label] ?? false} />
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

/* Connector "link" arrow — hangs off the left of the clone column at the
 * vertical level of Sarah's active meeting card. Figma: w=82, h=6,
 * positioned at left=-82, top=191 relative to the clone-visual container.
 * SVG keeps the gradient + endpoint dots in one paint pass. */
function Connector() {
	return (
		<svg
			aria-hidden='true'
			width='82'
			height='6'
			viewBox='0 0 82 6'
			className='pointer-events-none absolute -left-[82px] top-[191px]'
		>
			<defs>
				<linearGradient id='cc-plan-link' x1='0%' y1='50%' x2='100%' y2='50%'>
					<stop offset='0%' stopColor={EMERALD} stopOpacity='0.9' />
					<stop offset='100%' stopColor={EMERALD} stopOpacity='0.9' />
				</linearGradient>
			</defs>
			<circle cx='3' cy='3' r='3' fill={EMERALD} />
			<rect x='3' y='2' width='76' height='2' rx='1' fill='url(#cc-plan-link)' />
			<circle cx='79' cy='3' r='3' fill={EMERALD} />
		</svg>
	)
}

function CloneVisual({ inView, reduced, filled, fieldStarts, pulseFooter, isComplete }: {
	inView: boolean
	reduced: boolean
	filled: number
	fieldStarts: Record<string, boolean>
	pulseFooter: boolean
	isComplete: boolean
}) {
	return (
		<div className='relative flex w-[280px] shrink-0 flex-col items-center gap-3'>
			<CloneHeader filled={filled} reduced={reduced} isComplete={isComplete} />
			<CloneCard inView={inView} reduced={reduced} fieldStarts={fieldStarts} pulseFooter={pulseFooter} />
			<Connector />
		</div>
	)
}

/* ─── Root ─── */

export default function PlanVisual({}: { devPin?: boolean } = {}) {
	const reduced = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	/* Re-trigger on viewport entry — `once: false` and amount: 0.4 means the
	 * sequence replays each time the user scrolls back to it. */
	const inView = useInView(ref, { amount: 0.4 })

	const [filled, setFilled] = useState(reduced ? 7 : 0)
	const [fieldStarts, setFieldStarts] = useState<Record<string, boolean>>(
		() => Object.fromEntries(CLONE_CARD.fields.map((f) => [f.label, reduced])),
	)
	const [pulseFooter, setPulseFooter] = useState(reduced)
	const [isComplete, setIsComplete] = useState(reduced)

	useEffect(() => {
		if (reduced) {
			setFilled(7)
			setFieldStarts(Object.fromEntries(CLONE_CARD.fields.map((f) => [f.label, true])))
			setPulseFooter(false)
			setIsComplete(true)
			return
		}
		if (!inView) {
			setFilled(0)
			setFieldStarts(Object.fromEntries(CLONE_CARD.fields.map((f) => [f.label, false])))
			setPulseFooter(false)
			setIsComplete(false)
			return
		}
		/* Schedule field-start flips */
		const timeouts: ReturnType<typeof setTimeout>[] = []
		CLONE_CARD.fields.forEach((f) => {
			const t = setTimeout(() => {
				setFieldStarts((prev) => ({ ...prev, [f.label]: true }))
			}, FIELD_START[f.label] * 1000)
			timeouts.push(t)
		})
		/* Schedule bar segment fills */
		BAR_FILL_AT.forEach((at, i) => {
			const t = setTimeout(() => setFilled(i + 1), at * 1000)
			timeouts.push(t)
		})
		/* Spinner→check + footer pulse */
		const tCheck = setTimeout(() => setIsComplete(true), PHASE.checkmark * 1000)
		const tPulse = setTimeout(() => setPulseFooter(true), PHASE.checkmark * 1000)
		timeouts.push(tCheck, tPulse)
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
					inView={inView}
					reduced={reduced}
					filled={filled}
					fieldStarts={fieldStarts}
					pulseFooter={pulseFooter}
					isComplete={isComplete}
				/>
			</div>
		</div>
	)
}
