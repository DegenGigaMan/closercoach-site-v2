/** @fileoverview S3 How It Works section (production port, W6).
 *
 * Scroll-pinned 4-step narrative: Prepare / Train / Close / Win. Left column
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
import { Star } from '@phosphor-icons/react'
import StepIndicator from './how-it-works/StepIndicator'
import StepCanvas from './how-it-works/StepCanvas'
import PlanVisual from './how-it-works/PlanVisual'
import StepTwoVisual from './how-it-works/StepTwoVisual'
import StepThreeVisual from './how-it-works/StepThreeVisual'
/* Q17 Wave D2-1 (Andy 2026-04-29 #16+#17): Step 4 review swapped from the
 * dense scorecard composite to a phone-mockup variant for elegance parity
 * with preceding steps. Legacy non-phone variant remains importable from
 * './how-it-works/StepFourReview' and is exposed at /lab/legacy-step-detail
 * for fallback / comparison. */
import StepFourReview from './how-it-works/StepFourReviewPhone'
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
	/* H-19 (2026-05-04): track per-room inView so the sticky right-column
	 * visuals only START their timer chains when the matching StepRoom is
	 * actually in viewport — not at first paint when activeStep defaults to 1
	 * and the right-column ref is geometrically inside the just-mounted grid.
	 * Without this, PlanVisual's 6.6s phase chain ran to completion while the
	 * user was still on the section heading, leaving Step 1 fully animated by
	 * the time the user actually scrolled to it. */
	const [step1RoomInView, setStep1RoomInView] = useState(false)

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
			{/* Section opener.
			 * Wave Y.4 (Alim 2026-04-28): bottom padding bumped (py-24 lg:py-32
			 * -> pt-24 pb-40 lg:pt-32 lg:pb-56) to add breathing room between
			 * the section heading and the first step content (now PREPARE).
			 * Alim feedback: 'Increase margin from SELL and heading' — increasing
			 * the gap so the section heading lands cleanly without crowding the
			 * step rail.
			 *
			 * Wave Y DD R1 S1 (2026-04-28): closer 'Win.' previously spoiled the
			 * Step 4 kicker post-rename (Review→Win). Swapped closer to
			 * 'Compound.' so the opener ends on the cycle frame (compound
			 * interest of skill) without pre-calling Step 4. */}
			<div className="mx-auto max-w-7xl px-6 pt-24 pb-20 text-center md:px-12 md:pb-40 lg:px-24 lg:pt-32 lg:pb-56">
				<p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent">
					HOW IT WORKS
				</p>
				{/* Q17 Wave E (Andy 2026-04-29 #25): heading reframed to verb-map
				 * directly to the 4 steps (PREPARE/Practice, TRAIN/Train,
				 * CLOSE/Close, WIN/Win). Closer 'Win.' uses italic emerald
				 * emphasis matching the SectionFeatures 'win more deals.' VIS
				 * lock 2026-04-21 pattern (italic primary, color secondary). */}
				<h2 className="display-lg mx-auto mt-6 max-w-4xl text-white md:text-5xl lg:text-6xl">
					Practice. Train. Close. <em className="italic font-bold text-cc-accent">Win.</em>
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
					<StepRoom index={1} onEnter={advanceTo} onInViewChange={setStep1RoomInView}>
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
						<RightColumnVisual
							activeStep={activeStep}
							step1InView={step1RoomInView}
							devPin={devPin}
						/>
					</div>
				</div>
			</div>
			</ActiveStepContext.Provider>

			{/* Step 4 Review: brought back 2026-04-25 per Andy R-08 (was hidden
			 * 2026-04-23, now restored). Renders the scorecard composite below
			 * the 3-step scroll-pinned narrative as a vertically-stacked section. */}
			<StepFourReview />
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
	onInViewChange,
	children,
}: {
	index: number
	onEnter: (n: number) => void
	onInViewChange?: (inView: boolean) => void
	children: ReactNode
}) {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { amount: 0.4 })
	const mounted = useMounted()

	useEffect(() => {
		if (mounted && isInView) onEnter(index)
	}, [mounted, isInView, index, onEnter])

	useEffect(() => {
		if (mounted && onInViewChange) onInViewChange(isInView)
	}, [mounted, isInView, onInViewChange])

	return (
		<motion.div
			ref={ref}
			/* F39: stable initial across SSR/client hydration. Reduced-motion snaps
			 * via transition.duration: 0 below. */
			initial={{ opacity: 0, y: 24 }}
			animate={isInView ? { opacity: 1, y: 0 } : {}}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
			className="flex flex-col py-10 lg:min-h-screen lg:justify-start lg:py-16"
		>
			{children}
		</motion.div>
	)
}

/* ---------- Right column (sticky per-step visual) ---------- */

function RightColumnVisual({
	activeStep,
	step1InView,
	devPin,
}: {
	activeStep: number
	step1InView: boolean
	devPin: boolean
}) {
	const prefersReducedMotion = useReducedMotion()

	/* Single StepCanvas wraps all 4 step visuals. The canvas provides the
	 * rounded-3xl surface + radial-gradient background + border. Inner content
	 * swaps via AnimatePresence on activeStep. F39 hydration safety: stable
	 * initials on motion.div; reduced-motion collapses duration to 0.
	 *
	 * H-25 REVERT (2026-05-05): mode="wait" broke the sticky pinning of the
	 * S3 right column on desktop — during the wait gap the absolutely-sized
	 * inner content unmounts before the next mounts, causing the StepCanvas
	 * to collapse for a frame and breaking the parent grid's row height
	 * which the sticky positioning depends on. Reverted to mode="popLayout"
	 * which keeps the outgoing element in flow (position: absolute) during
	 * the cross-fade so layout stays stable.
	 *
	 * H-19 (2026-05-04): step1InView is forwarded to PlanVisual so its phase
	 * chain only starts when StepRoom 1 is actually in viewport. */
	return (
		<StepCanvas>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.div
					key={activeStep}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
					className="flex h-full w-full items-center justify-center p-4"
				>
					{activeStep === 1 && <PlanVisual devPin={devPin} start={step1InView} />}
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
			<p className="text-trim font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-accent">
				{children}
			</p>
		</div>
	)
}

function StepHeadline({ children }: { children: ReactNode }) {
	/* Q17 Wave D1-1 (Andy 2026-04-29 #11): label→heading vertical gap on
	 * desktop felt cramped. Bumped mt-4 → mt-4 md:mt-8 (16px → 32px on
	 * desktop) so the kicker breathes before the headline lands. Mobile
	 * spacing unchanged. */
	return (
		<h3 className="text-trim mt-4 text-3xl leading-[1.15] text-white md:mt-8 md:text-4xl lg:text-[2.75rem]">
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
			<StepKicker number="01" stepIndex={1}>PREPARE</StepKicker>
			<StepHeadline>
				Clone Your <em className="text-cc-accent">Clients</em>
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
			{/* Q17 Wave D1-6 (Andy 2026-04-29 #15): testimonial sat too
			 * close to the heading/body. Bumped mt-10 → mt-10 md:mt-20
			 * so the testimonial reads as a separate beat in the same
			 * vertical rhythm as Step 2/3/4 visual cards. Mobile rhythm
			 * preserved. */}
			<figure className="mt-10 flex max-w-xl flex-col gap-4 py-3 md:mt-20">
				<div role="img" className="flex items-start gap-[2px]" aria-label="5 out of 5 stars">
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
			<StepKicker number="02" stepIndex={2}>TRAIN</StepKicker>
			<StepHeadline>
				Roleplay Until <em className="text-cc-accent">Every Objection</em> Feels Predictable
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

			{/* Q17 Wave D1-4 (Andy 2026-04-29 #13): pill was stretching to
			 * full column width because the parent flex-col defaults to
			 * align-items: stretch. inline-flex alone doesn't escape that.
			 * Added self-start + w-fit so the pill hugs its text content. */}
			<div className="mt-8 inline-flex w-fit items-center gap-3 self-start rounded-full border border-cc-surface-border bg-cc-surface-card/40 px-4 py-2">
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
			<StepKicker number="03" stepIndex={3}>CLOSE</StepKicker>
			<StepHeadline>
				Close The <em className="text-cc-accent">Deal</em>
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

			{/* CloserCoach replaces -- logo strip per Alim 2026-04-28 overnight
			 * Slack feedback: 'CloserCoach replaces -- was hoping wed have the
			 * logos here of who we replace. like logo logo logo'.
			 *
			 * Wave Y.5 (Alim 2026-04-28 AM): Phosphor placeholders replaced
			 * with iOS-style app-icon SVGs matching how each app looks in the
			 * App Store / on a phone home screen.
			 *
			 * Wave Z.6 P2-D (2026-04-28): canonical-icon retrieval evaluated +
			 * intentionally declined. DD R1 C4 / S+ Audit P2-D flagged the
			 * risk that recreated-from-memory SVGs could drift from iOS stock
			 * gradients. Retrieval paths considered:
			 *   - Apple SF Symbols: Voice Memos + Phone glyphs are licensed
			 *     for use IN Apple platform apps only, not for redistribution
			 *     as marketing raster/SVG mockups (Apple SF Symbols License
			 *     §2.b). Embedding stock SF Symbols on a marketing site is a
			 *     license violation.
			 *   - Brandfetch (apple.com / openai.com): OpenAI mark is
			 *     available but Apple Voice Memos + Phone return no public
			 *     app-icon assets; both are first-party iOS surfaces, not
			 *     brand marks Apple distributes.
			 *   - Recraft canonical generation: would produce a reasonable
			 *     visual but introduces same trademark risk + still drifts
			 *     from current iOS stock.
			 * Decision: keep the current inline SVGs as INTENTIONAL editorial
			 * reproductions. They communicate the home-screen-icon language
			 * (rounded square, white glyph on saturated gradient, label
			 * underneath) without claiming Apple's or OpenAI's actual
			 * identity. The composition is the message, not pixel parity
			 * with iOS 18 stock. If iOS stock drifts again the next refresh,
			 * these stay legible.
			 *
			 * Sources:
			 *   - Voice Memos: inline SVG iOS app icon (white waveform on red
			 *     #FF453A -> #C30000 vertical gradient rounded square).
			 *     simple-icons has no Apple Voice Memos mark; Brandfetch
			 *     returns no clean public asset.
			 *   - ChatGPT: inline SVG of OpenAI's 4-petal logomark on black
			 *     rounded square (matches the public ChatGPT iOS app icon).
			 *     simple-icons does not ship an openai/chatgpt SVG (verified
			 *     2026-04-28 against node_modules/simple-icons/icons/);
			 *     mark is rendered inline from the public OpenAI logomark.
			 *   - Phone: inline SVG iOS app icon (white handset on green
			 *     #4CD964 -> #1B9628 vertical gradient rounded square). Apple
			 *     Phone trademark concern resolved by using a generic handset
			 *     glyph at iOS-icon dimensions, no Apple wordmark.
			 *
			 * Canonical order (lp-copy-deck-v5.md §S3 Step 2):
			 *   Voice Memos (left), ChatGPT (middle), Phone (right). */}
			{/* Q17 Wave D1-5 (Andy 2026-04-29 #14): card was stretching to
			 * column width. Added w-fit + self-start to outer + inner card
			 * so the icon strip hugs Voice Memos / ChatGPT / Phone content.
			 *
			 * 2026-05-02 (Andy): left-align the whole block with the body
			 * paragraph above (self-start + items-start). The three icon
			 * columns inside still use w-24 each so the icons themselves
			 * line up cleanly relative to one another. */}
			{/* H-34 (2026-05-04): stronger replacement messaging + mobile cut-off fix.
			 * Eyebrow rewritten from "CloserCoach replaces" → "ONE APP. THREE TOOLS
			 * GONE." Bumped from 10px mono to 12px Lora-bold uppercase so it commands
			 * the strip. Icon labels carry a subtle red strikethrough so the
			 * "replaced" narrative reads visually, not just from the eyebrow.
			 * Mobile cut-off (was overflowing 390px viewport at 416px width):
			 * gap-8 → gap-4 sm:gap-8, w-24 → w-20 sm:w-24, px-8 → px-4 sm:px-8. */}
			<div className="mt-8 flex w-fit max-w-xl flex-col items-start gap-3 self-start">
				<span
					className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-[0.18em] text-white/95"
				>
					One app. Three tools gone.
				</span>
				<div
					role="img"
					aria-label="CloserCoach replaces Voice Memos, ChatGPT, and your Phone app"
					className="flex w-fit items-center gap-4 rounded-2xl border border-cc-surface-border bg-cc-surface-card/40 px-4 py-4 sm:gap-8 sm:px-8"
				>
					{/* Voice Memos — white waveform on red gradient rounded square. */}
					<div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
						<svg
							width={36}
							height={36}
							viewBox="0 0 36 36"
							role="img"
							aria-label="Voice Memos"
							className="shrink-0"
						>
							<defs>
								<linearGradient id="cc-voice-memos-bg" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#FF453A" />
									<stop offset="100%" stopColor="#C30000" />
								</linearGradient>
							</defs>
							<rect width={36} height={36} rx={8} fill="url(#cc-voice-memos-bg)" />
							{/* Waveform: 7 vertical bars, varied heights, white. */}
							<g fill="#FFFFFF">
								<rect x={6}  y={15} width={2} height={6}  rx={1} />
								<rect x={10} y={12} width={2} height={12} rx={1} />
								<rect x={14} y={9}  width={2} height={18} rx={1} />
								<rect x={18} y={11} width={2} height={14} rx={1} />
								<rect x={22} y={13} width={2} height={10} rx={1} />
								<rect x={26} y={10} width={2} height={16} rx={1} />
								<rect x={30} y={14} width={2} height={8}  rx={1} />
							</g>
						</svg>
						<span className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.1em] text-cc-text-secondary line-through decoration-red-500/50 decoration-[1.5px] underline-offset-2">
							Voice Memos
						</span>
					</div>
					{/* ChatGPT — OpenAI 4-petal logomark on black rounded square. */}
					<div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
						<svg
							width={36}
							height={36}
							viewBox="0 0 36 36"
							role="img"
							aria-label="ChatGPT"
							className="shrink-0"
						>
							<rect width={36} height={36} rx={8} fill="#000000" />
							<g transform="translate(7 7) scale(0.91)">
								<path
									d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
									fill="#FFFFFF"
								/>
							</g>
						</svg>
						<span className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.1em] text-cc-text-secondary line-through decoration-red-500/50 decoration-[1.5px] underline-offset-2">
							ChatGPT
						</span>
					</div>
					{/* Phone — white handset on green gradient rounded square. */}
					<div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
						<svg
							width={36}
							height={36}
							viewBox="0 0 36 36"
							role="img"
							aria-label="Phone"
							className="shrink-0"
						>
							<defs>
								<linearGradient id="cc-phone-bg" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#4CD964" />
									<stop offset="100%" stopColor="#1B9628" />
								</linearGradient>
							</defs>
							<rect width={36} height={36} rx={8} fill="url(#cc-phone-bg)" />
							{/* Handset glyph: rotated phone receiver, white. */}
							<path
								d="M24.7 22.3c0 .5-.1 1.1-.3 1.6-.2.5-.5.9-.8 1.3-.5.6-1.1.9-1.7 1-.6.1-1.3.1-2-.1-.7-.2-1.5-.5-2.3-1-.8-.4-1.6-1-2.4-1.7-.8-.7-1.6-1.4-2.3-2.2-.7-.8-1.3-1.6-1.8-2.4-.5-.8-.9-1.6-1.2-2.4-.3-.8-.4-1.5-.4-2.2 0-.5.1-.9.2-1.4.2-.4.4-.8.8-1.1.4-.4.9-.6 1.4-.6.2 0 .4 0 .5.1.2.1.3.2.4.4l1.7 2.4c.1.2.2.3.3.5 0 .1.1.3.1.4 0 .2-.1.3-.2.5-.1.1-.2.3-.4.4l-.5.5c-.1.1-.1.2-.1.3 0 .1 0 .1.1.2 0 .1.1.1.1.2.1.2.4.5.7.9.4.4.7.8 1.1 1.2.4.4.8.7 1.2 1 .4.3.7.5.9.7l.2.1c.1 0 .1.1.2.1.1 0 .2 0 .3-.1l.5-.5c.2-.1.3-.3.5-.4.1-.1.3-.1.5-.1.1 0 .3 0 .4.1.2 0 .3.1.5.2l2.5 1.7c.2.1.3.2.4.4 0 .1.1.3.1.5z"
								fill="#FFFFFF"
							/>
						</svg>
						<span className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.1em] text-cc-text-secondary line-through decoration-red-500/50 decoration-[1.5px] underline-offset-2">
							Phone
						</span>
					</div>
				</div>
			</div>
		</>
	)
}

