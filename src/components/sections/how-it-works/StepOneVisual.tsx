/** @fileoverview S3 Step 1 Plan right-column visual composition.
 *
 * Rebuild mapped to Figma node 1:10313 (file fLZECQP0aetUwhj9ZHLJ6S). This
 * visual renders INSIDE the shared `StepCanvas` (see ./StepCanvas.tsx). The
 * canvas provides the rounded rect + radial-gradient surface; this component
 * only draws the two-anchor composition on top of it.
 *
 * Composition (anchored inside 714x600 canvas at desktop):
 *   - LEFT region: CONNECTED integrations pill -> emerald thread -> calendar
 *     icon + TODAY'S MEETINGS caption -> 2 stacked meeting cards (Sarah active
 *     with emerald stripe, Marcus dimmed).
 *   - RIGHT region: Cloning... header + progress (3/7) -> 7-pip progress bar ->
 *     clone card with Sarah avatar + AI Clone pill + 2-col x 4-row field grid
 *     (blurred placeholder bars for still-loading fields) -> "7 Layers of
 *     Personalization" sparkle badge anchored below the card bottom edge.
 *   - CONNECTOR: emerald horizontal line between Sarah's active meeting card
 *     (left) and the clone card (right), gradient fill with dot endpoints.
 *
 * Authority:
 *   - Figma node 1:10313 (S3 Step 1 Desktop, file fLZECQP0aetUwhj9ZHLJ6S)
 *   - Copy spec: vault/clients/closer-coach/copy/lp-copy-deck-v5.md Section 3 Step 1
 *   - Visual direction: vault/clients/closer-coach/research/r7-visual-direction.md
 *
 * Reduced-motion: spinner rotation is the only continuous motion; `prefers-reduced-motion`
 * collapses it to a static emerald icon. Everything else is static layout.
 *
 * Phone motif NOT used here. Phone is reserved for S1 Hero and S3 Step 3 per D3.
 *
 * @param devPin - Legacy prop (kept for backwards compatibility with /lab routes).
 *   The rebuild has no sub-state machine; devPin is accepted but unused.
 */

'use client'

import Image from 'next/image'
import { useReducedMotion } from 'motion/react'
import { Calendar, Sparkle, SpinnerGap } from '@phosphor-icons/react'

const SARAH_AVATAR = '/images/step1/avatar-sarah-face1.png'
const MARCUS_AVATAR = '/images/step1/avatar-marcus-face.png'
const LOGO_GOOGLE_MEET = '/images/step1/logo-google-meet.svg'
const LOGO_TEAMS = '/images/step1/logo-teams.png'
const LOGO_SALESFORCE = '/images/step1/logo-salesforce.svg'

/* ─── Integration pill ─────────────────────────────────────── */

function IntegrationPill() {
	return (
		<div
			role="img"
			className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-cc-surface-card/60 px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm"
			aria-label="Connected to Google Meet, Microsoft Teams, and Salesforce"
		>
			<div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.04]">
				<Image src={LOGO_GOOGLE_MEET} alt="" width={14} height={14} className="h-3.5 w-3.5" unoptimized />
			</div>
			<div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.04]">
				<Image src={LOGO_TEAMS} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" unoptimized />
			</div>
			<div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.04]">
				<Image src={LOGO_SALESFORCE} alt="" width={14} height={14} className="h-3.5 w-3.5" unoptimized />
			</div>
		</div>
	)
}

/* ─── Calendar region (left) ───────────────────────────────── */

function CalendarRegion() {
	return (
		<div className="absolute left-[48px] top-[48px] flex w-[262px] flex-col">
			{/* CONNECTED caption + integrations pill */}
			<div className="flex flex-col gap-2">
				<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] text-cc-accent">
					&#10004;&#10004; CONNECTED
				</span>
				<IntegrationPill />
			</div>

			{/* Emerald thread descending from pill to calendar icon */}
			<div
				aria-hidden="true"
				className="ml-3 mt-2 h-[28px] w-px bg-gradient-to-b from-cc-accent/70 via-cc-accent/40 to-cc-accent/20"
			/>

			{/* Calendar icon + TODAY'S MEETINGS caption */}
			<div className="mt-2 flex items-center gap-2">
				<div className="rounded-md bg-cc-accent/10 p-1">
					<Calendar size={16} weight="duotone" className="text-cc-accent" aria-hidden="true" />
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
					TODAY&apos;S MEETINGS
				</span>
			</div>

			{/* Meeting cards (2 stacked) */}
			<div className="mt-3 flex flex-col gap-3">
				<MeetingCard name="Sarah Chen" time="10:30am" avatarSrc={SARAH_AVATAR} active />
				<MeetingCard name="Marcus Rivera" time="2:00pm" avatarSrc={MARCUS_AVATAR} />
			</div>
		</div>
	)
}

function MeetingCard({ name, time, avatarSrc, active = false }: {
	name: string, time: string, avatarSrc: string, active?: boolean,
}) {
	return (
		<div
			className={[
				'relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-cc-surface-card p-2.5',
				active ? '' : 'opacity-40',
			].join(' ').trim()}
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
		</div>
	)
}

/* ─── Clone region (right) ─────────────────────────────────── */

function CloneRegion({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	return (
		<div className="absolute left-[357px] top-[53px] flex w-[304px] flex-col">
			{/* Header: Cloning... + 3/7 */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<SpinnerGap
						size={16}
						weight="bold"
						className={`text-cc-accent ${prefersReducedMotion ? '' : 'animate-spin'}`}
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
			</div>

			{/* Progress pips (7 equal segments, first 3 filled emerald) */}
			<div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
				{Array.from({ length: 7 }).map((_, i) => (
					<span
						key={i}
						className={`h-1 flex-1 rounded-full ${i < 3 ? 'bg-cc-accent' : 'bg-white/15'}`}
					/>
				))}
			</div>

			{/* Clone card */}
			<div className="relative mt-3">
				<CloneCard />
				{/* Proof badge anchored below the bottom edge, horizontally centered */}
				<div className="absolute left-1/2 top-full -translate-x-1/2 translate-y-[-12.5px]">
					<ProofBadge />
				</div>
			</div>
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

/* ─── Connector line (between calendar active card and clone card) ─── */

function Connector() {
	/* Anchored absolute between the calendar active card right edge (~x=230 in
	 * canvas coords, card at left=48 + width=262 minus some) and the clone card
	 * left edge (~x=357). Using an SVG so we can paint the gradient + endpoint
	 * dots with a single rendering pass. Y-center roughly matches the active
	 * Sarah card vertical center (calendar top 48 + connected caption 16 + pill
	 * 28 + thread 30 + calendar icon row 24 + gap 12 + active card mid-height
	 * ~24 = ~182). */
	return (
		<svg
			aria-hidden="true"
			width="117"
			height="8"
			viewBox="0 0 117 8"
			className="pointer-events-none absolute left-[306px] top-[210px]"
		>
			<defs>
				<linearGradient id="cc-step1-connector" x1="0%" y1="50%" x2="100%" y2="50%">
					<stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
					<stop offset="50%" stopColor="#10B981" stopOpacity="1" />
					<stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
				</linearGradient>
			</defs>
			{/* Dot endpoints */}
			<circle cx="4" cy="4" r="3" fill="#10B981" />
			<circle cx="113" cy="4" r="3" fill="#10B981" />
			{/* Line */}
			<rect x="4" y="3" width="109" height="2" rx="1" fill="url(#cc-step1-connector)" />
		</svg>
	)
}

/* ─── Main component ───────────────────────────────────────── */

export default function StepOneVisual({}: { devPin?: boolean } = {}) {
	const prefersReducedMotion = useReducedMotion() ?? false

	return (
		<div
			data-step="1"
			/* Desktop canvas anchor: Figma uses 714x600 coordinate system. We render
			 * absolute-positioned children against this frame and let the parent
			 * StepCanvas clip at rounded-3xl edges. On smaller viewports the absolute
			 * positions preserve visual intent because the parent constrains height. */
			className="relative mx-auto h-full w-full max-w-[714px]"
		>
			<CalendarRegion />
			<CloneRegion prefersReducedMotion={prefersReducedMotion} />
			<Connector />
		</div>
	)
}
