/** @fileoverview S3 How It Works section (production port, W6).
 *
 * Scroll-pinned 4-step narrative: Plan / Practice / Sell / Review. Left column
 * scrolls naturally through four ~100vh rooms; right column is sticky-pinned
 * and swaps its visual per activeStep. Emerald StepIndicator thread spans the
 * split column with a scroll-linked pulse.
 *
 * This file is the W6 production port of the approved lab composition
 * previously at src/components/sections/_lab/SectionHowItWorksLab.tsx. The
 * step visuals, StepIndicator, shared defaults, and sub-state-machine hook
 * were lifted namespace from `_lab/how-it-works/*` to `how-it-works/*` in the
 * same wave. Lab scaffolding removed: no `?step=N` URL read here (dev pin is
 * gated behind each step visual's `devPin` prop, only enabled by the
 * `/lab/how-it-works` preview route). No PLACEHOLDER copy. No lab page chrome.
 *
 * Copy source: lp-copy-deck-v5.md §Section 3 (v5.3). Em-dash substitutions
 * logged in design/build-deviations.md DEV-017. */

'use client'

import { createContext, useContext, useRef, useState, useEffect, useCallback, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { Sparkle, Microphone, PhoneCall, Star } from '@phosphor-icons/react'
import StepIndicator from './how-it-works/StepIndicator'
import StepCanvas from './how-it-works/StepCanvas'
import PlanVisual from './how-it-works/PlanVisual'
import StepTwoVisual from './how-it-works/StepTwoVisual'
import StepThreeVisual from './how-it-works/StepThreeVisual'
import StepFourReview from './how-it-works/StepFourReview'
import StepOneMobileVisual from './how-it-works/_mobile/StepOneMobileVisual'
import StepTwoMobileVisual from './how-it-works/_mobile/StepTwoMobileVisual'
import StepThreeMobileVisual from './how-it-works/_mobile/StepThreeMobileVisual'

/* SSR-safe mount flag. useSyncExternalStore returns the SSR snapshot (false) on
 * the server AND on the first client render, then switches to the client
 * snapshot (true) AFTER hydration completes. F33 hydration fix carried forward
 * from the lab composition. */
function subscribeNoop() { return () => {} }
function useMounted(): boolean {
	return useSyncExternalStore(subscribeNoop, () => true, () => false)
}

const ActiveStepContext = createContext(1)

/* Layout tokens shared between StepIndicator rail and StepKicker dots.
 * - cc-kicker-x: horizontal offset (negative) so a 40px kicker dot's center
 *   lands on the rail's x=20 position, given the left column starts at x=64
 *   (split px-16, no left-col pl on desktop). Center at 20, left edge at 0,
 *   relative to StepKicker origin (x=64) → offset -64px.
 * - cc-rail-top / cc-rail-bottom: crop the rail vertically so its top sits at
 *   step 1's dot center and its bottom sits at the LAST step's dot center
 *   (step 3 post-extraction; Step 4 moved below the pin-scroll). Each step
 *   room is min-h-screen (100vh) with py-16 (4rem) top padding + a 40px (2.5rem)
 *   dot centered on its first line, so dot center ≈ 4rem + 1.25rem = 5.25rem
 *   from room top. Step 3 room starts at 200vh; its dot is at 200vh + 5.25rem.
 *   Split container has pb-40 (10rem) below step 3, so bottom offset from
 *   container bottom = (300vh + 10rem) - (200vh + 5.25rem) = 100vh + 4.75rem. */
const SPLIT_VARS: CSSProperties = {
	'--cc-kicker-x': '-64px',
	'--cc-rail-top': '5.25rem',
	'--cc-rail-bottom': 'calc(100vh + 4.75rem)',
} as CSSProperties

/**
 * @description S3 How It Works. Renders the opener, the split layout, and the
 * per-activeStep sticky right-column visual. Each step room's useInView advances
 * the shared activeStep monotonically (forward-only; scrolling back up does NOT
 * un-visit a step).
 *
 * @param devPin When true, step visuals read `?pin=<state>` from the URL to
 *   pin their sub-state machine for DD / Playwright captures. Production (the
 *   homepage `/` route) leaves this false. Only the `/lab/how-it-works`
 *   preview route passes `devPin={true}`.
 */
export default function SectionHowItWorks({ devPin = false }: { devPin?: boolean } = {}) {
	const [activeStep, setActiveStep] = useState(1)

	/* Bidirectional step sync. Each StepRoom fires onEnter(index) every time
	 * its 40%-in-view threshold flips TRUE, which happens on scroll-down (entering
	 * from below) AND on scroll-up (re-entering from above). Setting activeStep
	 * unconditionally lets the right-column visual track the scroll direction. */
	const advanceTo = useCallback((n: number) => {
		setActiveStep(n)
	}, [])

	return (
		<section
			id="how-it-works"
			data-surface="dark-education"
			className="relative w-full bg-cc-foundation"
		>
			{/* Section opener */}
			<div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-12 lg:px-24 lg:py-32">
				<p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent">
					HOW IT WORKS
				</p>
				<h2 className="display-lg mx-auto mt-6 max-w-4xl text-white md:text-5xl lg:text-6xl">
					Practice. Lose. Learn. <span className="text-cc-accent">Win.</span>
				</h2>
				<p className="mx-auto mt-6 max-w-2xl text-lg text-cc-text-secondary md:text-xl">
					Train before the call. Find out where you lost it. Fix it before it costs you again.
				</p>
			</div>

			{/* Split layout: position: relative so Motion useScroll can compute offsets.
			 * F5 (W6): `position: relative` is set explicitly via the `relative` class
			 * and via `style={{ position: 'relative' }}` so Motion's useScroll in
			 * StepIndicator never falls back to the mount-time "non-static position"
			 * warning. Tailwind's `relative` is already present; the inline style is
			 * a belt-and-suspenders guarantee that the value is set on the very first
			 * paint (before Tailwind's compiled CSS has bound to the DOM).
			 *
			 * F63 (W6): `pb-32 lg:pb-24` (desktop baseline pb-24; mobile pb-32) adds
			 * 32px of bottom padding above the existing py-24 so the cookie banner
			 * (z-50 fixed bottom ~142px tall on mobile) does not occlude Step 4's
			 * AI Coach summary + CTA. The banner is dismissible; once accepted/declined
			 * the extra padding is harmless. The 32px delta > the 24px cookie-banner
			 * backdrop compensation that sat above the banner's backdrop-blur. */}
			<ActiveStepContext.Provider value={activeStep}>
			<div
				style={{ position: 'relative', ...SPLIT_VARS }}
				className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-32 md:px-12 lg:grid-cols-[40%_60%] lg:gap-16 lg:px-16 lg:pb-40"
			>
				<StepIndicator />

				{/* Left column: scrolling step rooms. No left padding on desktop so the
				 * StepKicker's desktop dot can sit on the rail at x=20 via --cc-kicker-x.
				 * Step 4 is no longer part of the pin-scroll -- it renders below this
				 * grid as a standalone vertically-stacked section (StepFourReview). */}
				<div className="flex flex-col">
					<StepRoom index={1} onEnter={advanceTo}>
						<Step1Plan devPin={devPin} />
					</StepRoom>
					<StepRoom index={2} onEnter={advanceTo}>
						<Step2Practice devPin={devPin} />
					</StepRoom>
					<StepRoom index={3} onEnter={advanceTo}>
						<Step3Sell devPin={devPin} />
					</StepRoom>
				</div>

				{/* Right column: sticky pinned visual (desktop only) */}
				<div className="hidden lg:block">
					<div className="sticky top-[calc(50vh-300px)] h-[600px]">
						<RightColumnVisual activeStep={activeStep} devPin={devPin} />
					</div>
				</div>
			</div>
			</ActiveStepContext.Provider>

			{/* Step 4 Review: hidden 2026-04-23 per Andy. Kept behind `false`
			 * rather than deleted so the redesigned scorecard composite (Figma
			 * 61:3023) stays intact for re-enablement. */}
			{false && <StepFourReview />}
		</section>
	)
}

/* ---------- Step room ---------- */

/**
 * @description One ~100vh step room in the left column. useInView toggles
 * whenever the room crosses 40% into viewport, firing in BOTH scroll directions:
 * scrolling down triggers advance, scrolling up triggers revert. F33 hydration
 * fix: advancement is gated behind a post-mount flag so SSR and first client
 * render always produce activeStep=1 (the pinned initial).
 */
function StepRoom({
	index,
	onEnter,
	children,
}: {
	index: number
	onEnter: (n: number) => void
	children: ReactNode
}) {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { amount: 0.4 })
	const mounted = useMounted()

	useEffect(() => {
		if (mounted && isInView) onEnter(index)
	}, [mounted, isInView, index, onEnter])

	return (
		<motion.div
			ref={ref}
			/* F39: stable initial across SSR/client hydration. Reduced-motion snaps
			 * via transition.duration: 0 below. */
			initial={{ opacity: 0, y: 24 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
			className="flex flex-col py-10 lg:min-h-screen lg:justify-start lg:py-16"
		>
			{children}
		</motion.div>
	)
}

/* ---------- Right column (sticky per-step visual) ---------- */

function RightColumnVisual({ activeStep, devPin }: { activeStep: number; devPin: boolean }) {
	const prefersReducedMotion = useReducedMotion()

	/* Single StepCanvas wraps all 4 step visuals. The canvas provides the
	 * rounded-3xl surface + radial-gradient background + border. Inner content
	 * swaps via AnimatePresence on activeStep. F39 hydration safety: stable
	 * initials on motion.div; reduced-motion collapses duration to 0. */
	return (
		<StepCanvas>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.div
					key={activeStep}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
					className="flex h-full w-full items-center justify-center p-4"
				>
					{activeStep === 1 && <PlanVisual devPin={devPin} />}
					{activeStep === 2 && <StepTwoVisual devPin={devPin} />}
					{activeStep >= 3 && <StepThreeVisual devPin={devPin} />}
				</motion.div>
			</AnimatePresence>
		</StepCanvas>
	)
}

/* ---------- Shared copy primitives ---------- */

function StepKicker({ number, stepIndex, children }: { number: string; stepIndex: number; children: ReactNode }) {
	const activeStep = useContext(ActiveStepContext)
	const isActive = activeStep === stepIndex
	const isPassed = activeStep > stepIndex
	const filled = isActive || isPassed
	return (
		<div className="relative flex items-center gap-2">
			{/* Mobile: inline outlined dot next to kicker. Desktop: hidden (the
			 * absolutely-positioned desktop dot below takes over). */}
			<span
				className={`flex h-8 w-8 items-center justify-center rounded-full border font-[family-name:var(--font-mono)] text-[12px] transition-colors duration-500 ease-out lg:hidden ${
					filled
						? 'border-cc-accent bg-cc-accent text-cc-foundation'
						: 'border-cc-accent/30 bg-cc-foundation text-cc-accent'
				}`}
				aria-hidden="true"
			>
				{number}
			</span>
			{/* Desktop: dot positioned on the StepIndicator rail via --cc-kicker-x
			 * (offsets the StepKicker origin back to the rail's x). Fill + glow
			 * activate when the scroll pulse has reached this step, i.e.
			 * activeStep >= stepIndex, so the dot lights up as the user arrives. */}
			<span
				className={`pointer-events-none absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 font-[family-name:var(--font-mono)] text-[13px] font-medium transition-[background-color,border-color,color,box-shadow] duration-500 ease-out lg:flex ${
					filled
						? 'border-cc-accent bg-cc-accent text-cc-foundation'
						: 'border-cc-accent/50 bg-cc-foundation text-cc-accent/85'
				} ${isActive ? 'shadow-[0_0_16px_rgba(16,185,129,0.45),0_0_32px_rgba(16,185,129,0.2)]' : ''}`}
				style={{ left: 'var(--cc-kicker-x)' }}
				aria-hidden="true"
			>
				{number}
			</span>
			<p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent">
				{children}
			</p>
		</div>
	)
}

function StepHeadline({ children }: { children: ReactNode }) {
	return (
		<h3 className="mt-4 text-3xl leading-[1.15] text-white md:text-4xl lg:text-[2.75rem]">
			{children}
		</h3>
	)
}

function StepBody({ children }: { children: ReactNode }) {
	return (
		<p className="mt-6 max-w-xl text-base leading-relaxed text-cc-text-secondary md:text-lg">
			{children}
		</p>
	)
}

/* ---------- Step 1: Plan ---------- */

function Step1Plan({ devPin }: { devPin: boolean }) {
	return (
		<>
			<StepKicker number="01" stepIndex={1}>PLAN</StepKicker>
			<StepHeadline>
				Clone Your <em className="not-italic text-cc-accent">Clients</em>
			</StepHeadline>
			<StepBody>
				Sync your calendar and CRM. CloserCoach pulls the buyer&rsquo;s profile, clones them, and hands you a practice partner that looks, talks, and pushes back exactly like the real person on your calendar.
			</StepBody>

			{/* Mobile visual: compact composition echoes the desktop right-column
			 * calendar -> clone enrichment moment. Hidden at lg+ where the sticky
			 * desktop StepOneVisual takes over. R7 v3 D9 first-class mobile.
			 * devPin is not wired to mobile visuals (they have no pinnable
			 * sub-state; they animate once on inView and settle). */}
			<div className="mt-8 lg:hidden">
				<StepOneMobileVisual />
			</div>

			{/* Desktop-only devPin consumer: the sticky StepOneVisual below reads
			 * devPin from the Right Column. This wrapper here is mobile-scoped. */}
			{devPin && null}

			{/* Testimonial — Figma 1:1527. 5 filled yellow stars (#FBBC04, 16px,
			 * gap-[2px]), italic Inter 16px quote leading-[1.4], and a user row
			 * (40px circular avatar + name "Andy Bolton" 16px + role "Sales rep"
			 * 14px in #8A9BA1). No card frame; container py-[12px] only. */}
			<figure className="mt-10 flex max-w-xl flex-col gap-4 py-3">
				<div className="flex items-start gap-[2px]" aria-label="5 out of 5 stars">
					{[0, 1, 2, 3, 4].map((i) => (
						<Star key={i} size={16} weight="fill" style={{ color: '#FBBC04' }} aria-hidden="true" />
					))}
				</div>
				<blockquote className="text-trim text-[16px] italic leading-[1.4] text-white">
					&ldquo;Helped me close a $10k+ deal last week. I used the app to rehearse my pitch to the CEO of a large company that was scheduled 3 weeks in advance.&rdquo;
				</blockquote>
				<figcaption className="flex items-center gap-4">
					<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
						<Image
							src="/images/testimonials/andy-bolton.png"
							alt=""
							fill
							sizes="40px"
							className="object-cover"
							aria-hidden="true"
						/>
					</div>
					<div className="flex min-w-0 flex-1 flex-col gap-3">
						<span className="text-trim text-[16px] leading-[24px] text-white">Andy Bolton</span>
						<span className="text-trim text-[14px] font-light leading-[24px]" style={{ color: '#8A9BA1' }}>
							Sales rep
						</span>
					</div>
				</figcaption>
			</figure>
		</>
	)
}

/* ---------- Step 2: Practice ---------- */

function Step2Practice({ devPin }: { devPin: boolean }) {
	return (
		<>
			<StepKicker number="02" stepIndex={2}>PRACTICE</StepKicker>
			<StepHeadline>
				Roleplay Until <em className="not-italic text-cc-accent">Every Objection</em> Feels Predictable
			</StepHeadline>
			<StepBody>
				The AI clone is realistic enough that prospects hang up when you fumble. Track your interest meter in real time, pull one-click suggested responses when you&rsquo;re stuck, and drill until your pitch is sharp.
			</StepBody>

			{/* Mobile visual: compact roleplay stub + horizontal interest meter +
			 * readiness gauge. Rotates the vertical desktop meter to horizontal per
			 * mobile affordance. Hidden at lg+. */}
			<div className="mt-8 lg:hidden">
				<StepTwoMobileVisual />
			</div>

			{devPin && null}

			<div className="mt-8 inline-flex items-center gap-3 rounded-full border border-cc-surface-border bg-cc-surface-card/40 px-4 py-2">
				<span className="font-[family-name:var(--font-mono)] text-sm text-cc-accent">5 min / week</span>
				<span className="text-xs text-cc-text-secondary">=</span>
				<span className="font-[family-name:var(--font-mono)] text-sm text-white">2 practice rounds</span>
			</div>
		</>
	)
}

/* ---------- Step 3: Sell ---------- */

function Step3Sell({ devPin }: { devPin: boolean }) {
	return (
		<>
			<StepKicker number="03" stepIndex={3}>SELL</StepKicker>
			<StepHeadline>
				Take The Call. <em className="not-italic text-cc-accent">Close The Deal.</em>
			</StepHeadline>
			<StepBody>
				Dial directly from CloserCoach for AI-powered phone calls, or record any in-person meeting. Every word captured, every missed moment flagged, every objection coached: whether you&rsquo;re at the door or on the phone.
			</StepBody>

			{/* Mobile visual: mode toggle + live call card + 2 annotation chips.
			 * Phone frame dropped at mobile scale (the phone motif carries on
			 * desktop only). Replacement badge stays below; mobile visual echoes
			 * the SELL moment without recreating the signature annotations-spring-
			 * out choreography. Hidden at lg+. */}
			<div className="mt-8 lg:hidden">
				<StepThreeMobileVisual />
			</div>

			{devPin && null}

			<div className="mt-8 flex max-w-xl flex-wrap items-center gap-2 rounded-full border border-cc-surface-border bg-cc-surface-card/40 px-4 py-2">
				<span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-cc-text-secondary">
					CloserCoach replaces
				</span>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-cc-surface/60 px-2.5 py-1 text-xs text-white">
					<Microphone size={12} weight="regular" className="text-cc-accent" />
					Voice Memos
				</span>
				<span className="text-cc-text-muted">+</span>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-cc-surface/60 px-2.5 py-1 text-xs text-white">
					<Sparkle size={12} weight="regular" className="text-cc-accent" />
					ChatGPT
				</span>
				<span className="text-cc-text-muted">+</span>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-cc-surface/60 px-2.5 py-1 text-xs text-white">
					<PhoneCall size={12} weight="regular" className="text-cc-accent" />
					Phone App
				</span>
			</div>
		</>
	)
}

