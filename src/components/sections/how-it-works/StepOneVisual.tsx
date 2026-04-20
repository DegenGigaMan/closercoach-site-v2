/** @fileoverview S3 Step 1 Plan right-column visual composition.
 * 5-sub-state scroll-trigger-then-autoplay chain:
 *   1A (0 - 500ms):     Calendar widget fades in. Sarah Chen meeting highlighted.
 *                        Integration lockup (Google Calendar / Outlook / Salesforce / HubSpot).
 *   1B (500 - 1400ms):  Meeting card pulses. Enrichment lines flow via pathLength animation.
 *   1C (1400 - 2800ms): Clone card surface materializes. 8 fields cascade in (~200ms each).
 *   1D (2800 - 3400ms): "7 Layers of Personalization" PC1 badge appears with glow pulse.
 *   1E (3400ms+):        Settled. Ambient idle (subtle badge pulse every 4s).
 *
 * Authority:
 *   - Visual spec: vault/clients/closer-coach/design/section-blueprint.md §S3 Step 1 (lines 201-209)
 *   - Copy spec:   vault/clients/closer-coach/copy/lp-copy-deck-v5.md §Section 3 Step 1 (v5.3)
 *   - Motion:      vault/clients/closer-coach/design/motion-spec.md §Thread Emergence
 *   - Vocabulary:  src/components/hero/hero-phone-v2.tsx (CARD_SHADOW, spring physics, reduced-motion)
 *   - Shared utils: ./_shared/use-sub-state-machine (chain) + ./_shared/step-visual-defaults (tokens)
 *
 * Refactor note (MR-S3-W2.5, 2026-04-19): chain extracted to `useSubStateMachine`
 * hook per DD-S3-W2 F18; shared vocabulary sourced from `step-visual-defaults`
 * per F19. Behavior is byte-identical to MR-S3-W2 baseline (commit 67a2cd0);
 * visual output verified via Playwright parity capture at 1E settled.
 * Per-component tuning that diverges from shared defaults (field label 8.5px
 * vs shared 9px, field value 10.5px vs shared 12px, ENRICHED kicker 8.5px vs
 * shared 10px) is intentional to fit the composition inside the 36rem slot and
 * is documented inline at each call site.
 *
 * Reduced-motion guard collapses the entire chain to state 1E instantly.
 * NO phone frame here: phone is reserved for Step 3 per D3 phone allocation.
 *
 * Layout strategy: the composition is anchored inside the 36rem sticky slot.
 * To fit calendar + flow + clone card, the visual uses a negative-margin overlap
 * where the enrichment flow visually connects the two cards while occupying no
 * standalone height. The clone card slides up into view during 1C; until then
 * its slot is collapsed so the calendar sits centered. */

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { CalendarBlank } from '@phosphor-icons/react'
import { useSubStateMachine } from './_shared/use-sub-state-machine'
/* Imports from step-visual-defaults. FIELD_LABEL / FIELD_VALUE / KICKER_MONO_EMERALD
 * are NOT imported because this composition diverges from those defaults for
 * per-row size tuning (see divergence comments at call sites). */
import {
	CARD_SHADOW,
	PC_BADGE_PILL,
	THREAD_EASE,
} from './_shared/step-visual-defaults'

/* Sub-state timings (ms). Each value is the moment the state begins. */
const T_1A = 0
const T_1B = 500
const T_1C = 1400
const T_1D = 2800
const T_1E = 3400

/* Clone card fields. Cascade order drives the narrative (buyer known > objection > talk track).
 * 8 rows per copy deck v5.3 Step 1. Values land inside a tight single-line row unless
 * explicitly italicised (OBJECTION). Compact sizing is required to fit within the 36rem
 * sticky slot alongside the calendar widget and enrichment flow. */
type Field = { label: string, value: string, italic?: boolean }
const CLONE_FIELDS: readonly Field[] = [
	{ label: 'NAME', value: 'Sarah Chen' },
	{ label: 'ROLE', value: 'VP of Operations' },
	{ label: 'COMPANY', value: 'Apex Industries, logistics SaaS' },
	{ label: 'INDUSTRY', value: 'Enterprise Logistics' },
	{ label: 'OBJECTION', value: 'We\u2019ve tried tools before. They all failed integration.', italic: true },
	{ label: 'TALK TRACK', value: 'Lead with integration case studies, not feature list.' },
	{ label: 'PAIN 1', value: 'Manual dispatch inefficiency' },
	{ label: 'PAIN 2', value: 'Visibility gap for operations team' },
] as const

type SubState = 1 | 2 | 3 | 4 | 5

/* Today's meeting label. Dynamic date with a deterministic SSR fallback so
 * server and client output match on first paint, then the real local-time
 * formatted value hydrates in on the next tick. Scheduling the setState via
 * setTimeout(0) breaks the synchronous-effect-setState chain the linter flags. */
function useMeetingDateLabel() {
	const [label, setLabel] = useState('TODAY')
	useEffect(() => {
		const t = setTimeout(() => {
			const d = new Date()
			const formatted = new Intl.DateTimeFormat('en-US', {
				weekday: 'long', month: 'long', day: 'numeric',
			}).format(d).toUpperCase()
			setLabel(formatted)
		}, 0)
		return () => clearTimeout(t)
	}, [])
	return label
}

/* ─── Integration lockup ───────────────────────────────────── */

/* Four-tile row representing calendar + CRM integrations.
 * Google Calendar / Outlook / Salesforce / HubSpot per copy deck v5.3.
 * Phosphor ships only GoogleLogo + MicrosoftOutlookLogo; Salesforce and HubSpot
 * aren't in the set and the repo doesn't carry simple-icons. Rather than mixing
 * two real brand marks with two fallback letters (uneven visual weight), we use
 * a unified monogram-tile treatment for all four, keeping the lockup coherent
 * with the dark card surface. W3-W5 can upgrade to real brand SVGs if we add
 * simple-icons. Flagged in the W2 return as "integration lockup uses monogram
 * fallback, not real brand SVGs". */
function IntegrationLockup() {
	const tiles: readonly { label: string, letter: string }[] = [
		{ label: 'Google Calendar', letter: 'G' },
		{ label: 'Outlook', letter: 'O' },
		{ label: 'Salesforce', letter: 'S' },
		{ label: 'HubSpot', letter: 'H' },
	]
	return (
		<div
			className="flex items-center gap-1"
			aria-label="Integrates with Google Calendar, Outlook, Salesforce, and HubSpot"
		>
			{tiles.map((t) => (
				<div
					key={t.label}
					className="flex h-[22px] w-[22px] items-center justify-center rounded-md border border-cc-accent/20 bg-cc-accent/[0.08]"
					title={t.label}
				>
					<span
						className="font-[family-name:var(--font-mono)] text-[10px] font-semibold text-cc-accent"
						aria-hidden="true"
					>
						{t.letter}
					</span>
				</div>
			))}
		</div>
	)
}

/* ─── Calendar widget ──────────────────────────────────────── */

function CalendarWidget({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	const dateLabel = useMeetingDateLabel()
	const isPulsing = subState >= 2 && subState < 4 && !prefersReducedMotion

	return (
		<motion.div
			className={`relative shrink-0 rounded-2xl border border-white/[0.08] bg-cc-surface-card/90 p-4 backdrop-blur-sm ${CARD_SHADOW}`}
			/* F39: stable initial. Reduced-motion users get duration: 0 below,
			 * which snaps from {opacity:0,y:12} to settled instantly. */
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: THREAD_EASE }}
		>
			{/* Header row: date kicker + integration lockup. */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<CalendarBlank size={14} weight="duotone" className="text-cc-accent" aria-hidden="true" />
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
						{dateLabel}
					</span>
				</div>
				<IntegrationLockup />
			</div>

			{/* 3 meeting rows. Middle row (Sarah Chen) is highlighted and pulses during 1B. */}
			<div className="flex flex-col gap-1.5">
				<MeetingRow time="10:30 AM" name="Internal standup" org="Apex ops weekly" dimmed />
				<motion.div
					animate={isPulsing
						? { boxShadow: ['0 0 0 rgba(16,185,129,0)', '0 0 16px rgba(16,185,129,0.4)', '0 0 0 rgba(16,185,129,0)'] }
						: { boxShadow: '0 0 0 rgba(16,185,129,0)' }
					}
					transition={isPulsing
						? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
						: { duration: 0 }
					}
					className="rounded-lg"
				>
					<MeetingRow time="2:00 PM" name="Sarah Chen" org="VP Ops, Apex Industries" highlighted />
				</motion.div>
				<MeetingRow time="4:15 PM" name="Pipeline review" org="With Andrea R." dimmed />
			</div>
		</motion.div>
	)
}

function MeetingRow({ time, name, org, highlighted, dimmed }: {
	time: string, name: string, org: string, highlighted?: boolean, dimmed?: boolean,
}) {
	const base = 'flex items-center gap-2.5 rounded-lg border px-2.5 py-2'
	const ring = highlighted
		? 'border-cc-accent/30 bg-cc-accent/[0.06]'
		: 'border-white/[0.04] bg-cc-surface/40'
	const nameColor = highlighted ? 'text-white' : dimmed ? 'text-cc-text-secondary' : 'text-white'
	const orgColor = dimmed ? 'text-cc-text-muted' : 'text-cc-text-secondary'

	return (
		<div className={`${base} ${ring}`}>
			<span className="font-[family-name:var(--font-mono)] text-[9.5px] font-medium tabular-nums text-cc-text-secondary">
				{time}
			</span>
			{highlighted && (
				<span className="h-1.5 w-1.5 rounded-full bg-cc-accent" aria-hidden="true" />
			)}
			<div className="flex min-w-0 flex-1 flex-col">
				<span className={`text-[11.5px] font-medium leading-tight ${nameColor}`}>{name}</span>
				<span className={`truncate text-[9.5px] leading-tight ${orgColor}`}>{org}</span>
			</div>
		</div>
	)
}

/* ─── Enrichment flow (SVG paths with pathLength animation) ─── */

/* Four curved paths fan out from the calendar card's right-edge meeting anchor
 * down to the clone card's top-edge. Paths use a fixed viewBox so the SVG scales
 * with its wrapper without needing ref measurement. */
const ENRICHMENT_PATHS: readonly string[] = [
	'M 30 10 C 90 20, 150 40, 190 95',
	'M 30 30 C 90 50, 150 70, 190 105',
	'M 30 50 C 90 80, 150 100, 190 115',
	'M 30 70 C 90 100, 150 110, 190 125',
] as const

function EnrichmentFlow({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	const visible = subState >= 2
	const finalPathLength = visible ? 1 : 0
	const opacity = subState === 2 ? 1 : subState >= 3 ? 0.4 : 0

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-x-0 top-[38%] z-10 mx-auto h-[60px] w-full max-w-[360px] shrink-0"
		>
			<svg
				viewBox="0 0 220 140"
				preserveAspectRatio="none"
				className="absolute inset-0 h-full w-full"
			>
				<defs>
					<linearGradient id="cc-s3-enrich-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#10B981" stopOpacity="0" />
						<stop offset="35%" stopColor="#10B981" stopOpacity="0.9" />
						<stop offset="100%" stopColor="#34E18E" stopOpacity="1" />
					</linearGradient>
					<filter id="cc-s3-enrich-glow" x="-30%" y="-30%" width="160%" height="160%">
						<feGaussianBlur stdDeviation="1.8" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<motion.g
					style={{ filter: 'url(#cc-s3-enrich-glow)' }}
					initial={{ opacity: 0 }}
					animate={{ opacity }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
				>
					{ENRICHMENT_PATHS.map((d, i) => (
						<motion.path
							key={d}
							d={d}
							fill="none"
							stroke="url(#cc-s3-enrich-gradient)"
							strokeWidth={1.25}
							strokeLinecap="round"
							/* F39: stable initial. Reduced-motion users hit settled
							 * state where finalPathLength=1, then transition.duration:0
							 * snaps the path to full instantly. */
							initial={{ pathLength: 0 }}
							animate={{ pathLength: finalPathLength }}
							transition={prefersReducedMotion
								? { duration: 0 }
								: { duration: 0.8, delay: i * 0.08, ease: THREAD_EASE }
							}
						/>
					))}
				</motion.g>
			</svg>
		</div>
	)
}

/* ─── AI clone card (1C + 1D) ──────────────────────────────── */

function CloneCard({ subState, prefersReducedMotion }: { subState: SubState, prefersReducedMotion: boolean }) {
	const visible = subState >= 3
	const badgeVisible = subState >= 4
	const settled = subState >= 5

	return (
		<motion.div
			className={`relative shrink-0 rounded-2xl border border-cc-accent/25 bg-cc-surface-card/90 px-4 py-3.5 backdrop-blur-sm ${CARD_SHADOW}`}
			/* F39: stable initial. Reduced-motion users land at subState=5 post-mount
			 * (visible=true), animate target {opacity:1,y:0,scale:1}, transition
			 * duration:0 → instant snap from initial to settled. */
			initial={{ opacity: 0, y: 20, scale: 0.97 }}
			animate={visible
				? { opacity: 1, y: 0, scale: 1 }
				: { opacity: 0, y: 20, scale: 0.97 }
			}
			transition={prefersReducedMotion
				? { duration: 0 }
				: { type: 'spring', stiffness: 260, damping: 24 }
			}
		>
			{/* Header: kicker + avatar + name + role + AI Clone pill */}
			<div className="mb-2.5 flex items-center gap-2.5">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cc-accent/30 bg-cc-accent/10">
					<span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold text-cc-accent">SC</span>
				</div>
				<div className="flex min-w-0 flex-1 flex-col">
					<div className="flex items-center gap-1.5">
						<span className="text-[12px] font-semibold text-white">Sarah Chen</span>
						<span className="inline-flex items-center rounded-full border border-cc-accent/30 bg-cc-accent/10 px-1.5 py-[1px] font-[family-name:var(--font-mono)] text-[8px] font-medium uppercase tracking-[0.15em] text-cc-accent">
							AI Clone
						</span>
					</div>
					<span className="text-[9.5px] text-cc-text-secondary">VP Ops, Apex Industries</span>
				</div>
				{/* Diverges from shared KICKER_MONO_EMERALD (10px) to 8.5px so the
				 * card header fits avatar + name + pill + kicker in a single row at
				 * the 36rem sticky slot. Alpha-lowered to /85 for the "system status"
				 * read versus full-accent active labels. */}
				<span className="font-[family-name:var(--font-mono)] text-[8.5px] font-medium uppercase tracking-[0.2em] text-cc-accent/85">
					Enriched
				</span>
			</div>

			{/* Fields cascade. Each field has its own delay relative to 1C entry. */}
			<div className="flex flex-col gap-[3px]">
				{CLONE_FIELDS.map((field, i) => (
					<CloneField
						key={`${field.label}-${i}`}
						field={field}
						index={i}
						visible={visible}
						prefersReducedMotion={prefersReducedMotion}
					/>
				))}
			</div>

			{/* PC1 proof badge: "7 Layers of Personalization". */}
			<motion.div
				className="mt-3 flex items-center justify-center border-t border-white/[0.06] pt-3"
				/* F39: stable initial. Reduced-motion: badgeVisible=true at settled,
				 * snaps from {opacity:0,y:6} → {opacity:1,y:0} via duration:0. */
				initial={{ opacity: 0, y: 6 }}
				animate={badgeVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
			>
				<motion.div
					className={`relative ${PC_BADGE_PILL}`}
					animate={settled && !prefersReducedMotion
						? { boxShadow: ['0 0 0 rgba(16,185,129,0)', '0 0 18px rgba(16,185,129,0.35)', '0 0 0 rgba(16,185,129,0)'] }
						: badgeVisible && !prefersReducedMotion
							? { boxShadow: ['0 0 0 rgba(16,185,129,0)', '0 0 22px rgba(16,185,129,0.55)', '0 0 8px rgba(16,185,129,0.15)'] }
							: { boxShadow: '0 0 0 rgba(16,185,129,0)' }
					}
					transition={settled && !prefersReducedMotion
						? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
						: badgeVisible
							? { duration: 0.9, ease: 'easeOut' }
							: { duration: 0 }
					}
				>
					<DotLayers active={badgeVisible} prefersReducedMotion={prefersReducedMotion} />
					<span>7 Layers of Personalization</span>
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

function CloneField({ field, index, visible, prefersReducedMotion }: {
	field: Field, index: number, visible: boolean, prefersReducedMotion: boolean,
}) {
	const delay = prefersReducedMotion ? 0 : 0.16 * index
	return (
		<motion.div
			className={[
				'grid grid-cols-[72px_1fr] items-baseline gap-3 rounded-md px-2 py-1',
				field.italic ? 'border-l-2 border-cc-accent/60 bg-cc-accent/[0.04] pl-2' : '',
			].join(' ').trim()}
			/* F39: stable initial. Reduced-motion: visible=true at settled, snap
			 * to settled via duration:0 below. */
			initial={{ opacity: 0, y: 6 }}
			animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={prefersReducedMotion
				? { duration: 0 }
				: { type: 'spring', stiffness: 320, damping: 24, delay }
			}
		>
			{/* Diverges from shared FIELD_LABEL (9px, 0.15em) to 8.5px / 0.16em so
			 * the 8-row cascade fits the clone-card vertical budget. Tracking
			 * compensates for the tighter x-height. */}
			<span className="font-[family-name:var(--font-mono)] text-[8.5px] font-medium uppercase tracking-[0.16em] text-cc-text-muted">
				{field.label}
			</span>
			{/* Diverges from shared FIELD_VALUE (12px) to 10.5px with tight leading
			 * so multi-word values stay on a single row without wrapping. Italic +
			 * white color applies on the OBJECTION row per section-blueprint. */}
			<span
				className={[
					'text-[10.5px] leading-[1.35]',
					field.italic ? 'italic text-white' : 'text-cc-text-secondary',
				].join(' ')}
			>
				{field.value}
			</span>
		</motion.div>
	)
}

/* 7-dot strip inside the badge, communicating "7 layers" visually. */
function DotLayers({ active, prefersReducedMotion }: { active: boolean, prefersReducedMotion: boolean }) {
	return (
		<span className="flex items-center gap-[3px]" aria-hidden="true">
			{Array.from({ length: 7 }).map((_, i) => (
				<motion.span
					key={i}
					className="block h-1 w-1 rounded-full bg-cc-accent"
					/* F39: stable initial. Reduced-motion: active=true at settled,
					 * snaps to active state via duration:0 transition below. */
					initial={{ opacity: 0, scale: 0.5 }}
					animate={active ? { opacity: 0.85, scale: 1 } : { opacity: 0, scale: 0.5 }}
					transition={prefersReducedMotion
						? { duration: 0 }
						: { type: 'spring', stiffness: 420, damping: 22, delay: i * 0.05 }
					}
				/>
			))}
		</span>
	)
}

/* ─── Main component ───────────────────────────────────────── */

/* Dev-only sub-state pin. When enabled AND `?pin=N` (N in 1-5) is in the URL,
 * the chain is bypassed and subState stays at N. Enables DD / Playwright
 * captures of any sub-state without racing the auto-advance timers.
 *
 * W6: gated behind `enabled` prop (default false in production). Production
 * callers never read URLSearchParams. Only the `/lab/how-it-works` preview
 * route passes `devPin={true}` to re-enable the pin. */
function useSubStatePin(enabled: boolean): SubState | null {
	const [pin, setPin] = useState<SubState | null>(null)
	useEffect(() => {
		if (!enabled) return
		const t = setTimeout(() => {
			if (typeof window === 'undefined') return
			const raw = new URLSearchParams(window.location.search).get('pin')
			const n = raw ? Number.parseInt(raw, 10) : NaN
			if (n >= 1 && n <= 5) setPin(n as SubState)
		}, 0)
		return () => clearTimeout(t)
	}, [enabled])
	return pin
}

/* Sub-state chain definition. Consumed by useSubStateMachine; mirrors W2's
 * original inline timer chain (0 / 500 / 1400 / 2800 / 3400 ms). */
const STEP_ONE_STATES: ReadonlyArray<{ id: SubState, enterAtMs: number }> = [
	{ id: 1, enterAtMs: T_1A },
	{ id: 2, enterAtMs: T_1B },
	{ id: 3, enterAtMs: T_1C },
	{ id: 4, enterAtMs: T_1D },
	{ id: 5, enterAtMs: T_1E },
] as const

export default function StepOneVisual({ devPin = false }: { devPin?: boolean } = {}) {
	const prefersReducedMotion = useReducedMotion() ?? false
	const rootRef = useRef<HTMLDivElement>(null)
	/* W2 composition auto-fires when the visual enters the sticky viewport slot. Because the
	 * right column is sticky, useInView on the visual itself is reliable even though the left
	 * column scroll owns activeStep. amount: 0.3 + once: true mirrors W1's StepRoom trigger. */
	const inView = useInView(rootRef, { amount: 0.3, once: true })
	const pin = useSubStatePin(devPin)
	/* Machine-driven sub-state (5-step chain). The pin value below overrides this
	 * for dev/DD capture flows but the chain itself lives in the shared hook. */
	const machineState = useSubStateMachine<SubState>({
		states: STEP_ONE_STATES,
		trigger: inView,
		reducedMotion: prefersReducedMotion,
		initialState: 1,
		settledState: 5,
		once: true,
	})
	const subState: SubState = pin ?? machineState

	return (
		<div
			ref={rootRef}
			data-step="1"
			data-sub-state={subState}
			className="relative mx-auto flex h-full w-full max-w-[420px] flex-col justify-center gap-3"
		>
			<CalendarWidget subState={subState} prefersReducedMotion={prefersReducedMotion} />
			<EnrichmentFlow subState={subState} prefersReducedMotion={prefersReducedMotion} />
			<CloneCard subState={subState} prefersReducedMotion={prefersReducedMotion} />
		</div>
	)
}
