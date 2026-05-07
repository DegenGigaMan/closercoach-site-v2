/** @fileoverview S3 Step 1 Plan right-column visual composition.
 *
 * Animation (scroll-triggered, once: true, amount: 0.3):
 *   All entrance motion fires when ≥30% of the canvas enters the viewport.
 *   Sequence (t = seconds after inView):
 *     0.00  CONNECTED label  — fade + slide up
 *     0.12  Integration pill — fade + slide up
 *     0.24  Emerald thread   — scaleY 0→1 (origin top)
 *     0.34  Calendar row     — fade + slide up
 *     0.46  Sarah card       — fade + slide up
 *     0.58  Marcus card      — fade + slide up
 *     0.68  Connector        — opacity + scaleX 0→1 (origin left)
 *     0.72  Clone header     — fade + slide in from right
 *     0.84  Progress pips    — stagger fill left→right (each +0.06s)
 *     1.00  Clone card       — fade + scale up
 *     1.18  Sparkle badge    — fade + scale up
 *
 * Reduced-motion: all entrance animations collapse to instant (duration:0).
 */

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Calendar, Sparkle, SpinnerGap } from '@phosphor-icons/react'

const SARAH_AVATAR = '/images/step1/avatar-sarah-face1.png'
const MARCUS_AVATAR = '/images/step1/avatar-marcus-face.png'
const LOGO_GOOGLE_MEET = '/images/step1/logo-google-meet.svg'
const LOGO_TEAMS = '/images/step1/logo-teams.png'
const LOGO_SALESFORCE = '/images/step1/logo-salesforce.svg'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

/** Returns a transition object. When reduced-motion is on, collapses to
 *  duration:0 so elements snap to their final state immediately. */
function tx(delay: number, reduced: boolean, override?: object) {
	if (reduced) return { duration: 0, delay: 0 }
	return { ...SPRING, delay, ...override }
}

/* ─── Integration pill ─────────────────────────────────────── */

function IntegrationPill({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<motion.div
			role="img"
			className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-cc-surface-card/60 px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm"
			aria-label="Connected to Google Meet, Microsoft Teams, and Salesforce"
			initial={{ opacity: 0, y: 8 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={tx(0.12, reduced)}
		>
			<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
				<Image src={LOGO_GOOGLE_MEET} alt="" width={14} height={14} className="h-3.5 w-3.5" unoptimized />
			</div>
			<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
				<Image src={LOGO_TEAMS} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" unoptimized />
			</div>
			<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
				<Image src={LOGO_SALESFORCE} alt="" width={14} height={14} className="h-3.5 w-3.5" unoptimized />
			</div>
		</motion.div>
	)
}

/* ─── Calendar region (left) ───────────────────────────────── */

function CalendarRegion({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div className="absolute left-[48px] top-[48px] flex w-[262px] flex-col">
			{/* CONNECTED caption */}
			<div className="flex flex-col gap-2">
				<motion.span
					className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] text-cc-accent"
					initial={{ opacity: 0, y: 6 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
					transition={tx(0.00, reduced)}
				>
					&#10004;&#10004; CONNECTED
				</motion.span>
				<IntegrationPill inView={inView} reduced={reduced} />
			</div>

			{/* Emerald thread: scaleY 0→1, transform-origin top */}
			<motion.div
				aria-hidden="true"
				className="ml-3 mt-2 h-[28px] w-px origin-top bg-gradient-to-b from-cc-accent/70 via-cc-accent/40 to-cc-accent/20"
				initial={{ scaleY: 0, opacity: 0 }}
				animate={inView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
				transition={tx(0.24, reduced, { duration: 0.35, ease: 'easeOut', type: 'tween' })}
			/>

			{/* Calendar icon + TODAY'S MEETINGS caption */}
			<motion.div
				className="mt-2 flex items-center gap-2"
				initial={{ opacity: 0, y: 6 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
				transition={tx(0.34, reduced)}
			>
				<div className="rounded-md bg-cc-accent/10 p-1">
					<Calendar size={16} weight="duotone" className="text-cc-accent" aria-hidden="true" />
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
					TODAY&apos;S MEETINGS
				</span>
			</motion.div>

			{/* Meeting cards */}
			<div className="mt-3 flex flex-col gap-3">
				<MeetingCard name="Sarah Chen" time="10:30am" avatarSrc={SARAH_AVATAR} active inView={inView} reduced={reduced} delay={0.46} />
				<MeetingCard name="Marcus Rivera" time="2:00pm" avatarSrc={MARCUS_AVATAR} inView={inView} reduced={reduced} delay={0.58} />
			</div>
		</div>
	)
}

function MeetingCard({ name, time, avatarSrc, active = false, inView, reduced, delay }: {
	name: string; time: string; avatarSrc: string; active?: boolean;
	inView: boolean; reduced: boolean; delay: number;
}) {
	return (
		<motion.div
			className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-cc-surface-card p-2.5"
			initial={{ opacity: 0, y: 10 }}
			animate={inView ? { opacity: active ? 1 : 0.4, y: 0 } : { opacity: 0, y: 10 }}
			transition={tx(delay, reduced)}
		>
			{active && (
				<span
					aria-hidden="true"
					className="absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-cc-accent"
				/>
			)}
			<div className={`${active ? 'ml-2' : ''} relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10`}>
				<Image src={avatarSrc} alt="" fill className="object-cover" sizes="28px" unoptimized />
			</div>
			<div className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-[14px] font-semibold leading-tight text-white">{name}</span>
				<span className="truncate text-[12px] leading-tight text-white/50">{time}</span>
			</div>
		</motion.div>
	)
}

/* ─── Clone region (right) ─────────────────────────────────── */

function CloneRegion({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div className="absolute left-[357px] top-[53px] flex w-[304px] flex-col">
			{/* Header: Cloning... + 3/7 */}
			<motion.div
				className="flex items-center justify-between"
				initial={{ opacity: 0, x: 16 }}
				animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
				transition={tx(0.72, reduced)}
			>
				<div className="flex items-center gap-1.5">
					<SpinnerGap
						size={16}
						weight="bold"
						className={`text-cc-accent ${reduced ? '' : 'animate-spin'}`}
						aria-hidden="true"
					/>
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] text-cc-accent">
						Cloning...
					</span>
				</div>
				<div className="flex items-baseline gap-0.5 tabular-nums">
					<span className="text-[14px] font-semibold text-cc-accent">3</span>
					<span className="text-[12px] text-white/50">/7</span>
				</div>
			</motion.div>

			{/* Progress pips (7 equal segments, first 3 filled emerald, staggered) */}
			<div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
				{Array.from({ length: 7 }).map((_, i) => (
					<motion.span
						key={i}
						className="h-1 flex-1 rounded-full"
						initial={{ backgroundColor: 'rgba(255,255,255,0.15)', opacity: 0 }}
						animate={inView ? {
							backgroundColor: i < 3 ? '#10B981' : 'rgba(255,255,255,0.15)',
							opacity: 1,
						} : { backgroundColor: 'rgba(255,255,255,0.15)', opacity: 0 }}
						transition={tx(0.84 + i * 0.06, reduced, { duration: 0.3, ease: 'easeOut', type: 'tween' })}
					/>
				))}
			</div>

			{/* Clone card */}
			<motion.div
				className="relative mt-3"
				initial={{ opacity: 0, scale: 0.96, y: 8 }}
				animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
				transition={tx(1.00, reduced)}
			>
				<CloneCard />
				{/* Proof badge anchored below the bottom edge, horizontally centered */}
				<motion.div
					className="absolute left-1/2 top-full -translate-x-1/2 translate-y-[-12.5px]"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
					transition={tx(1.18, reduced)}
				>
					<ProofBadge />
				</motion.div>
			</motion.div>
		</div>
	)
}

function CloneCard() {
	return (
		<div className="relative rounded-2xl border border-cc-accent/50 bg-cc-surface-card p-3.5 shadow-[-8px_8px_16px_0_rgba(0,0,0,0.6),0_0_20px_0_rgba(16,185,129,0.05)]">
			{/* Top row: Sarah avatar + AI Clone badge */}
			<div className="flex items-center gap-2.5">
				<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
					<Image src={SARAH_AVATAR} alt="Sarah Chen" fill className="object-cover" sizes="40px" unoptimized />
				</div>
				<span className="inline-flex items-center rounded-md border border-cc-accent/20 bg-cc-accent/20 px-2.5 py-1.5 font-sans text-[16px] font-medium text-cc-accent">
					AI Clone
				</span>
			</div>

			{/* 2-col grid, 4 rows */}
			<div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6">
				<FieldLabeled label="NAME" value="Sarah Chen" />
				<FieldLabeled label="ROLE" value="VP Operations" />

				<FieldLabeled label="COMPANY" value="Greenleaf Inc." />
				<FieldBlurred label="INDUSTRY" widthClass="w-[84px]" />

				<FieldBlurred label="OBJECTION" widthClass="w-[97px]" />
				<FieldBlurred label="TALK TRACK" widthClass="w-[92px]" />

				<FieldBlurred label="PAIN 1" widthClass="w-[78px]" />
				<FieldBlurred label="PAIN 2" widthClass="w-[70px]" />
			</div>
		</div>
	)
}

function FieldLabeled({ label, value }: { label: string, value: string }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.15em] text-cc-text-secondary">
				{label}
			</span>
			<span className="font-sans text-[14px] text-white">{value}</span>
		</div>
	)
}

function FieldBlurred({ label, widthClass }: { label: string, widthClass: string }) {
	return (
		<div role="status" aria-live="polite" className="flex flex-col gap-1.5" aria-label={`${label} loading`}>
			<span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.15em] text-cc-text-secondary">
				{label}
			</span>
			<span
				aria-hidden="true"
				className={`h-4 rounded bg-gradient-to-r from-white/10 via-white/15 to-white/10 ${widthClass}`}
			/>
		</div>
	)
}

function ProofBadge() {
	return (
		<div className="inline-flex items-center gap-1.5 rounded-full border border-cc-accent/40 bg-cc-foundation px-3 py-1 shadow-[0_0_16px_rgba(16,185,129,0.25)]">
			<Sparkle size={10} weight="fill" className="text-cc-accent" aria-hidden="true" />
			<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] text-cc-accent">
				7 Layers of Personalization
			</span>
		</div>
	)
}

/* ─── Connector line ───────────────────────────────────────── */

function Connector({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<motion.svg
			aria-hidden="true"
			width="117"
			height="8"
			viewBox="0 0 117 8"
			className="pointer-events-none absolute left-[306px] top-[210px] origin-left"
			initial={{ opacity: 0, scaleX: 0 }}
			animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
			transition={tx(0.68, reduced, { duration: 0.4, ease: 'easeOut', type: 'tween' })}
		>
			<defs>
				<linearGradient id="cc-step1-connector" x1="0%" y1="50%" x2="100%" y2="50%">
					<stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
					<stop offset="50%" stopColor="#10B981" stopOpacity="1" />
					<stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
				</linearGradient>
			</defs>
			<circle cx="4" cy="4" r="3" fill="#10B981" />
			<circle cx="113" cy="4" r="3" fill="#10B981" />
			<rect x="4" y="3" width="109" height="2" rx="1" fill="url(#cc-step1-connector)" />
		</motion.svg>
	)
}

/* ─── Main component ───────────────────────────────────────── */

export default function StepOneVisual({}: { devPin?: boolean } = {}) {
	const reduced = useReducedMotion() ?? false
	const rootRef = useRef<HTMLDivElement>(null)
	const inView = useInView(rootRef, { amount: 0.3, once: true })

	return (
		<div
			ref={rootRef}
			data-step="1"
			className="relative mx-auto h-full w-full max-w-[714px]"
		>
			<CalendarRegion inView={inView} reduced={reduced} />
			<CloneRegion inView={inView} reduced={reduced} />
			<Connector inView={inView} reduced={reduced} />
		</div>
	)
}
