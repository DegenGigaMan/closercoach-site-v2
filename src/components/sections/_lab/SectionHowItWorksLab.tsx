/** @fileoverview Lab-scoped S3 "How It Works" section. Scroll-pinned split layout.
 * Left column (35%) scrolls naturally with four ~100vh step rooms.
 * Right column (65%) is sticky-pinned, swapping placeholder visuals per activeStep.
 * Emerald thread indicator spans the full split column with a scroll-linked pulse.
 *
 * This wave (W1) ships the scaffold + scroll-trigger-then-autoplay framework only.
 * Step content composition is scoped to W2-W5. Production port is W6.
 *
 * Copy locked to vault/clients/closer-coach/copy/lp-copy-deck-v5.md §Section 3 (v5.2).
 * Em dashes in Step 3 body and Step 4 paragraph 2 are replaced with colons per the project-wide
 * em-dash-ban (both substitutions logged in vault/clients/closer-coach/design/build-deviations.md). */

'use client'

import { useRef, useState, useEffect, useCallback, useSyncExternalStore, type ReactNode } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'

/* SSR-safe mount flag. useSyncExternalStore returns the SSR snapshot (false) on
 * the server AND on the first client render, then switches to the client
 * snapshot (true) AFTER hydration completes. This matches the pattern
 * SectionHero uses for its media query and avoids the react-hooks/set-state-
 * in-effect lint rule. F33 StepIndicator hydration mismatch fix. */
function subscribeNoop() { return () => {} }
function useMounted(): boolean {
	return useSyncExternalStore(subscribeNoop, () => true, () => false)
}
import { Sparkle, Microphone, PhoneCall } from '@phosphor-icons/react'
import StepIndicator, { type StepMeta } from './how-it-works/StepIndicator'
import StepOneVisual from './how-it-works/StepOneVisual'
import StepTwoVisual from './how-it-works/StepTwoVisual'

const STEPS: readonly StepMeta[] = [
	{ number: '01', label: 'PLAN' },
	{ number: '02', label: 'PRACTICE' },
	{ number: '03', label: 'SELL' },
	{ number: '04', label: 'REVIEW' },
] as const

const STEP_VISUAL_LABELS: Record<number, string> = {
	3: 'Step 3 SELL: Phone morphing dialer / in-person record',
	4: 'Step 4 REVIEW: Practice vs real scorecard + 1/20 deep-drill',
}

/**
 * @description S3 lab section shell. Renders the opener, the split layout, and the
 * placeholder right-column visual per active step. Each step room's useInView advances
 * the shared activeStep state monotonically (step state never goes backward).
 */
export default function SectionHowItWorksLab() {
	const splitRef = useRef<HTMLDivElement>(null)
	const [activeStep, setActiveStep] = useState(1)

	const advanceTo = useCallback((n: number) => {
		setActiveStep((prev) => (n > prev ? n : prev))
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

			{/* Split layout: position: relative so Motion useScroll can compute offsets. */}
			<div
				ref={splitRef}
				className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 md:px-12 lg:grid-cols-[35%_65%] lg:gap-16 lg:px-24"
			>
				<StepIndicator steps={STEPS} activeStep={activeStep} containerRef={splitRef} />

				{/* Left column: scrolling step rooms */}
				<div className="flex flex-col lg:pl-16">
					<StepRoom index={1} onEnter={advanceTo}>
						<Step1Plan />
					</StepRoom>
					<StepRoom index={2} onEnter={advanceTo}>
						<Step2Practice />
					</StepRoom>
					<StepRoom index={3} onEnter={advanceTo}>
						<Step3Sell />
					</StepRoom>
					<StepRoom index={4} onEnter={advanceTo}>
						<Step4Review />
					</StepRoom>
				</div>

				{/* Right column: sticky pinned visual */}
				<div className="hidden lg:block">
					<div className="sticky top-[calc(50vh-18rem)] h-[36rem]">
						<RightColumnVisual activeStep={activeStep} />
					</div>
				</div>
			</div>
		</section>
	)
}

/* ---------- Step room ---------- */

/**
 * @description One ~100vh step room in the left column. Uses useInView to fire
 * the onEnter callback exactly once when the room crosses 40% into viewport.
 *
 * F33 hydration fix: activeStep advancement is gated behind a post-mount flag.
 * SSR and first client render always produce activeStep=1 (the pinned initial),
 * so the StepIndicator marker DOM matches across the hydration boundary. Only
 * after mount can useInView's callback advance the state. Mirrors the stable-
 * initial approach SectionHero uses (useSyncExternalStore SSR snapshot). */
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
	const isInView = useInView(ref, { amount: 0.4, once: true })
	const mounted = useMounted()

	useEffect(() => {
		if (mounted && isInView) onEnter(index)
	}, [mounted, isInView, index, onEnter])

	return (
		<motion.div
			ref={ref}
			initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
			className="flex min-h-screen flex-col justify-center py-16"
		>
			{children}
		</motion.div>
	)
}

/* ---------- Right column (pinned placeholder) ---------- */

function RightColumnVisual({ activeStep }: { activeStep: number }) {
	const prefersReducedMotion = useReducedMotion()

	/* Step 1 is a real composition (W2). Step 2 is a real composition (W3).
	 * Steps 3-4 remain W1 placeholders until W4-W5. */
	if (activeStep === 1) {
		return (
			<div className="flex h-full min-h-[36rem] items-center justify-center">
				<StepOneVisual />
			</div>
		)
	}

	if (activeStep === 2) {
		return (
			<div className="flex h-full min-h-[36rem] items-center justify-center">
				<StepTwoVisual />
			</div>
		)
	}

	return (
		<AnimatePresence mode="popLayout" initial={false}>
			<motion.div
				key={activeStep}
				initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
				className="flex h-full min-h-[36rem] items-center justify-center rounded-3xl border border-white/[0.08] bg-cc-surface-card/60 p-8 lg:p-12"
			>
				<div className="flex flex-col items-center gap-4 text-center">
					<span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-accent">
						W1 placeholder
					</span>
					<p className="max-w-sm text-sm leading-relaxed text-cc-text-secondary">
						{STEP_VISUAL_LABELS[activeStep]}
					</p>
				</div>
			</motion.div>
		</AnimatePresence>
	)
}

/* ---------- Shared copy primitives ---------- */

function StepKicker({ number, children }: { number: string; children: ReactNode }) {
	return (
		<div className="flex items-center gap-3">
			<span
				className="flex h-8 w-8 items-center justify-center rounded-full border border-cc-accent/30 bg-cc-foundation font-[family-name:var(--font-mono)] text-[12px] text-cc-accent lg:hidden"
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

function Step1Plan() {
	return (
		<>
			<StepKicker number="01">PLAN</StepKicker>
			<StepHeadline>
				<em className="not-italic text-cc-accent">Clone Your Clients</em> Before The Meeting Even Starts
			</StepHeadline>
			<StepBody>
				Sync your calendar and CRM. CloserCoach pulls the buyer&rsquo;s profile, clones them, and hands you a practice partner that looks, talks, and pushes back exactly like the real person on your calendar.
			</StepBody>

			<figure className="mt-10 max-w-xl rounded-2xl border border-cc-surface-border bg-cc-surface-card/40 p-6">
				<blockquote className="text-base leading-relaxed text-white md:text-lg">
					&ldquo;Helped me close a $10k+ deal last week. I used the app to rehearse my pitch to the CEO of a large company that was scheduled 3 weeks in advance.&rdquo;
				</blockquote>
				<figcaption className="mt-4 flex items-center gap-3">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-cc-accent">
						Verified user
					</span>
					<span className="text-xs text-cc-text-secondary">Enterprise sales</span>
				</figcaption>
			</figure>
		</>
	)
}

/* ---------- Step 2: Practice ---------- */

function Step2Practice() {
	return (
		<>
			<StepKicker number="02">PRACTICE</StepKicker>
			<StepHeadline>
				Roleplay Until <em className="not-italic text-cc-accent">Every Objection</em> Feels Predictable
			</StepHeadline>
			<StepBody>
				The AI clone is realistic enough that prospects hang up when you fumble. Track your interest meter in real time, pull one-click suggested responses when you&rsquo;re stuck, and drill until your pitch is sharp.
			</StepBody>

			<div className="mt-8 inline-flex items-center gap-3 rounded-full border border-cc-surface-border bg-cc-surface-card/40 px-4 py-2">
				<span className="font-[family-name:var(--font-mono)] text-sm text-cc-accent">5 min / week</span>
				<span className="text-xs text-cc-text-secondary">=</span>
				<span className="font-[family-name:var(--font-mono)] text-sm text-white">2 practice rounds</span>
			</div>

			<p className="mt-6 max-w-xl text-xs leading-relaxed text-cc-text-secondary">
				[PLACEHOLDER: Step 2 testimonial A5, to be finalized in W3 Step 2 wave]
			</p>
		</>
	)
}

/* ---------- Step 3: Sell ---------- */

function Step3Sell() {
	return (
		<>
			<StepKicker number="03">SELL</StepKicker>
			<StepHeadline>
				Take The Call. <em className="not-italic text-cc-accent">Close The Deal.</em>
			</StepHeadline>
			<StepBody>
				Dial directly from CloserCoach for AI-powered phone calls, or record any in-person meeting. Every word captured, every missed moment flagged, every objection coached: whether you&rsquo;re at the door or on the phone.
			</StepBody>

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

/* ---------- Step 4: Review ---------- */

function Step4Review() {
	return (
		<>
			<StepKicker number="04">REVIEW</StepKicker>
			<StepHeadline>
				See <em className="not-italic text-cc-accent">Exactly</em> What&rsquo;s Losing You Deals
			</StepHeadline>
			<StepBody>
				Every call gets scored A through F, with industry-tailored scorecards and word-for-word talk-tracks showing you exactly what you should have said.
			</StepBody>
			<p className="mt-5 max-w-xl text-base leading-relaxed text-cc-text-secondary md:text-lg">
				Track how your skills improve over time: discovery, pitch, objection handling, tone, talk time, and close rate. The more you sell, the more your AI knows exactly where you&rsquo;re winning and where you&rsquo;re bleeding deals.
			</p>

			<div className="mt-10 flex flex-wrap items-center gap-3">
				<button
					type="button"
					className="inline-flex items-center gap-2 rounded-full bg-cc-accent px-6 py-3 text-sm font-semibold text-cc-foundation transition-colors hover:bg-cc-accent-hover"
				>
					Try for Free
				</button>
				<span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-cc-text-muted">
					App Store / Google Play
				</span>
			</div>
		</>
	)
}
