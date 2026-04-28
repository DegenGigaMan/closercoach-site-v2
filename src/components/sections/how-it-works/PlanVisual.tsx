/** @fileoverview S3 Step 1 "Plan" visual -- standalone composition with R-09
 * cinematic motion sequence (Wave C 2026-04-25). Wave X.2 (2026-04-28)
 * re-architected the cloning sequence per Alim's overnight Slack feedback:
 * "Clone your clients visual animation needs a pass. The graphics look
 * great but the clone should appear at the end.. we should make the Cloning
 * loading bigger and obvious af that somethings being cloned. .. think like
 * a cloning lab".
 *
 * Composition (horizontal flex, gap-[79px] at desktop):
 *   LEFT  Source: integrations + today's meetings (Sarah active, Marcus dim)
 *   RIGHT Cloning lab (during cloning) -> Clone card (after cloning).
 *         Card stays hidden while cloning loads. The clone is the payoff.
 *
 * R-09 motion sequence (Wave X.2 re-timing, ~6.0s total -- slower per Alim
 * pacing directive "long is OK, that's the point"):
 *   Phase 1 (0.0-1.0s):   "CONNECTED" pill activates + integrations cascade.
 *   Phase 2 (1.0-2.0s):   "TODAY'S MEETINGS" populates -- Sarah active.
 *   Phase 3 (2.0-5.0s):   CLONING LAB STATE (big, obvious): pulsing emerald
 *                         halo around source-avatar silhouette + scanning
 *                         line + big "CLONING SARAH" mono label + 7-pip
 *                         progress bar fills 0->7 with delayed segment beats.
 *                         The clone card area is hidden -- only the cloning
 *                         lab is visible.
 *   Phase 4 (5.0-5.5s):   Cloning lab dims, clone card SNAPS into place
 *                         (spring scale 0.92->1 + opacity 0->1) with all
 *                         fields populated. No per-field typewriter; the
 *                         card lands as a confident, complete clone.
 *   Phase 5 (5.5-6.0s):   Proof badge pulses emerald. Done.
 *
 * Each phase is gated by an in-viewport flag. Reduced-motion: settles
 * instantly to phase-5 state (clone card visible, no animation). Re-trigger:
 * useInView with viewport reset.
 *
 * Library: motion/react AnimatePresence for the cloning-lab -> clone-card
 * crossfade. The TextType per-field typewriter that lived here pre-Wave X.2
 * was removed since the card is no longer visible during cloning -- fields
 * are static-rendered the moment the card snaps in.
 *
 * Copy source: vault/clients/closer-coach/copy/lp-copy-deck-v5.md §S3 Step 1.
 * Field schema source: src/lib/constants.ts CLONE_CARD (R-11 B2C lock).
 * Motion spec: vault/clients/closer-coach/design/hero-s3-connected-system-spec.md.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Calendar, Check, Checks, Sparkle, SpinnerGap } from '@phosphor-icons/react'
import { CLONE_CARD } from '@/lib/constants'

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

/* Motion-sequence phase timings (seconds). Wave X.2 (2026-04-28) retimed
 * per Alim pacing directive: cloning lab visible 2.0-5.0s, card snap-in
 * at 5.0s. Total cycle ~6s. */
const PHASE = {
	headerLand: 0,
	integrationCascade: 0.4,
	meetingsPopulate: 1.0,
	cloningStart: 2.0,
	cardReveal: 5.0,
	checkmark: 5.0,
	footerPulse: 5.5,
} as const

/* Bar segment fill schedule (7 pips, evenly distributed across the cloning
 * window). 7 fills across 2.0-4.8s = ~0.4s per pip with slight acceleration
 * toward the end so the final pip lands with momentum. */
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

/* Cloning header. Wave X.2: bigger label (14px mono) + taller progress
 * bar (3px tall, was 1px) so the cloning state reads from across the
 * room, not as a hairline. Per Alim: "make the Cloning loading bigger
 * and obvious af that somethings being cloned". */
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
						className={`h-full min-w-px flex-1 rounded-full transition-colors duration-300 ease-out ${i < filled ? 'bg-cc-accent shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-white/15'}`}
					/>
				))}
			</div>
		</div>
	)
}

/* Static field renders. Wave X.2: typewriter dropped because the card is
 * hidden during cloning -- fields appear all-at-once when the card snaps in. */
function FieldShort({ label, value }: { label: string, value: string }) {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.04em] text-cc-text-secondary'>
				{label}
			</span>
			<span className='text-trim font-sans text-[13px] leading-[18px] text-white'>{value}</span>
		</div>
	)
}

function FieldLong({ label, value }: { label: string, value: string }) {
	return (
		<div className='flex flex-col items-start gap-1.5'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.04em] text-cc-text-secondary'>
				{label}
			</span>
			<span className='text-balance font-sans text-[12px] leading-[17px] text-white/95'>{value}</span>
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

/* CloneCard. Wave X.2: snap-in entrance (spring scale + opacity) when the
 * cloning lab finishes. All fields render statically -- no per-field
 * typewriter. The card lands as a confident, complete clone. */
function CloneCard({ reduced, pulseFooter }: {
	reduced: boolean
	pulseFooter: boolean
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

				{/* 2-col grid for 4 short fields */}
				<div className='grid grid-cols-2 gap-x-3 gap-y-3.5'>
					{shortFields.map((f) => (
						<FieldShort key={f.label} label={f.label} value={f.value} />
					))}
				</div>

				{/* Stack of 3 long full-width rows */}
				<div className='flex flex-col gap-3'>
					{longFields.map((f) => (
						<FieldLong key={f.label} label={f.label} value={f.value} />
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

/* CloningLabState (Wave X.2). The big, obvious "cloning lab" visual that
 * occupies the clone-card real estate while filled < 7. Composition:
 *
 *   - Outer frame: same width as the eventual clone card so the swap is
 *     dimensionally honest.
 *   - Center: pulsing emerald halo + Sarah source-avatar silhouette.
 *     Scanline travels top->bottom across the avatar (the cloning beam).
 *   - Below avatar: large mono "CLONING SARAH" label.
 *   - Footer: dotted gridlines (lab grid) hint at scientific instrumentation
 *     without stacking a 4th effect (Alim anti-pattern: "do not stack
 *     scanline + particles + glow + typewriter all at once" -- we use halo
 *     + scanline + grid; particles + typewriter are out).
 *
 * No card chrome -- this is the lab table, not the cloned product. */
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

			{/* Big label */}
			<div className='flex flex-col items-center gap-1'>
				<span className='text-trim font-[family-name:var(--font-mono)] text-[14px] font-semibold uppercase tracking-[0.18em] text-cc-accent'>
					Cloning Sarah
				</span>
				<span className='text-trim font-sans text-[11px] text-cc-text-secondary'>
					7-layer behavioral model
				</span>
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

function CloneVisual({ reduced, filled, pulseFooter, isComplete, cardRevealed }: {
	reduced: boolean
	filled: number
	pulseFooter: boolean
	isComplete: boolean
	cardRevealed: boolean
}) {
	return (
		<div className='relative flex w-[280px] shrink-0 flex-col items-center gap-4'>
			<CloneHeader filled={filled} reduced={reduced} isComplete={isComplete} />
			<div className='relative w-full'>
				<AnimatePresence mode='wait' initial={false}>
					{cardRevealed ? (
						<CloneCard key='card' reduced={reduced} pulseFooter={pulseFooter} />
					) : (
						<CloningLabState key='lab' reduced={reduced} />
					)}
				</AnimatePresence>
			</div>
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
	const [pulseFooter, setPulseFooter] = useState(reduced)
	const [isComplete, setIsComplete] = useState(reduced)
	const [cardRevealed, setCardRevealed] = useState(reduced)

	useEffect(() => {
		if (reduced) {
			setFilled(7)
			setPulseFooter(false)
			setIsComplete(true)
			setCardRevealed(true)
			return
		}
		if (!inView) {
			setFilled(0)
			setPulseFooter(false)
			setIsComplete(false)
			setCardRevealed(false)
			return
		}
		/* Wave X.2: schedule progress bar segment fills (cloning lab state),
		 * then card snap-in at PHASE.cardReveal, then footer pulse beat. */
		const timeouts: ReturnType<typeof setTimeout>[] = []
		BAR_FILL_AT.forEach((at, i) => {
			const t = setTimeout(() => setFilled(i + 1), at * 1000)
			timeouts.push(t)
		})
		const tComplete = setTimeout(() => setIsComplete(true), PHASE.checkmark * 1000)
		const tReveal = setTimeout(() => setCardRevealed(true), PHASE.cardReveal * 1000)
		const tPulse = setTimeout(() => setPulseFooter(true), PHASE.footerPulse * 1000)
		timeouts.push(tComplete, tReveal, tPulse)
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
				/>
			</div>
		</div>
	)
}
