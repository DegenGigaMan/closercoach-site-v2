'use client'

import { createContext, useContext, useRef, useState, useEffect, useCallback, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { Star, XCircle } from '@phosphor-icons/react'
import StepIndicator from './how-it-works/StepIndicator'
import StepCanvas from './how-it-works/StepCanvas'
import PlanVisual from './how-it-works/PlanVisual'
import StepTwoVisual from './how-it-works/StepTwoVisual'
import StepThreeVisual from './how-it-works/StepThreeVisual'
import StepFourReview from './how-it-works/StepFourReviewPhone'
import StepOneMobileVisual from './how-it-works/_mobile/StepOneMobileVisual'
import StepTwoMobileVisual from './how-it-works/_mobile/StepTwoMobileVisual'

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
				<div className="mx-auto max-w-7xl px-6 pt-24 pb-20 text-center md:px-12 md:pb-40 lg:px-24 lg:pt-32 lg:pb-56">
				<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cc-accent">
					HOW IT WORKS
				</p>
					<h2 className="display-lg mx-auto mt-6 max-w-4xl text-white md:text-5xl lg:text-6xl">
					Roleplay. Review. <em className="italic font-bold text-cc-accent">Win.</em>
				</h2>
					<p className="mx-auto mt-6 max-w-[340px] text-base text-cc-text-secondary md:max-w-2xl md:text-xl lg:max-w-4xl lg:whitespace-nowrap lg:text-lg">
					Train before the call. Find out where you lost it. Fix it before it costs you again.
				</p>
			</div>

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
						<RightColumnVisual
							activeStep={activeStep}
							devPin={devPin}
						/>
					</div>
				</div>
			</div>
			</ActiveStepContext.Provider>

		<StepFourReview />
		</section>
	)
}

/* ---------- Step room ---------- */

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

function RightColumnVisual({ activeStep, devPin }: { activeStep: number; devPin: boolean }) {
	const prefersReducedMotion = useReducedMotion()

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
			<p className="text-trim text-[11px] font-semibold uppercase tracking-[0.2em] text-cc-accent">
				{children}
			</p>
		</div>
	)
}

function StepHeadline({ children }: { children: ReactNode }) {
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

				<div className="mt-8 lg:hidden">
				<StepOneMobileVisual />
			</div>

			{/* Desktop-only devPin consumer: the sticky StepOneVisual below reads
			 * devPin from the Right Column. This wrapper here is mobile-scoped. */}
			{devPin && null}

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
				From Dial to <em className="text-cc-accent">Deal</em>
			</StepHeadline>
			<StepBody>
				Dial directly from CloserCoach for AI-powered phone calls, or record any in-person meeting. Every word captured, every missed moment flagged, every objection coached: whether you&rsquo;re at the door or on the phone.
			</StepBody>

			{/* Mobile visual: full phone mockup, same as desktop. Annotation pills
			 * are clipped by overflow-hidden inside StepThreeVisual at < lg so
			 * they don't overflow narrow screens. Hidden at lg+ (desktop uses the
			 * sticky right-column instance). */}
			<div className="mt-8 flex justify-center lg:hidden">
				<StepThreeVisual />
			</div>

			{devPin && null}

				<div className="relative mt-8 w-fit self-center lg:self-start pt-[14px]">
				{/* Badge — floats above the container, centered. */}
				<div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-red-500/30 bg-[#1a0808] px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
					<XCircle size={12} weight="fill" className="shrink-0 text-red-400" />
					<span className="text-trim whitespace-nowrap font-[family-name:var(--font-sans)] text-[12px] font-semibold leading-none text-red-400">
						One App. Three Gone.
					</span>
				</div>

				<div
					role="img"
					aria-label="CloserCoach replaces Voice Memos, ChatGPT, and your Phone app"
					className="flex w-fit items-center gap-4 rounded-2xl border border-red-500/25 bg-red-950/20 px-4 py-4 sm:gap-8 sm:px-8"
				>
					{/* Voice Memos */}
					<div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
						<svg width={36} height={36} viewBox="0 0 36 36" role="img" aria-label="Voice Memos" className="shrink-0">
							<defs>
								<linearGradient id="cc-voice-memos-bg" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#FF453A" />
									<stop offset="100%" stopColor="#C30000" />
								</linearGradient>
							</defs>
							<rect width={36} height={36} rx={8} fill="url(#cc-voice-memos-bg)" />
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
						<span className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.1em] text-white/40">
							Voice Memos
						</span>
					</div>
					{/* ChatGPT */}
					<div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
						<svg width={36} height={36} viewBox="0 0 36 36" role="img" aria-label="ChatGPT" className="shrink-0">
							<rect width={36} height={36} rx={8} fill="#000000" />
							<g transform="translate(7 7) scale(0.91)">
								<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#FFFFFF" />
							</g>
						</svg>
						<span className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.1em] text-white/40">
							ChatGPT
						</span>
					</div>
					{/* Phone */}
					<div className="flex w-20 flex-col items-center gap-1.5 sm:w-24">
						<svg width={36} height={36} viewBox="0 0 36 36" role="img" aria-label="Phone" className="shrink-0">
							<defs>
								<linearGradient id="cc-phone-bg" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#4CD964" />
									<stop offset="100%" stopColor="#1B9628" />
								</linearGradient>
							</defs>
							<rect width={36} height={36} rx={8} fill="url(#cc-phone-bg)" />
							<path d="M24.7 22.3c0 .5-.1 1.1-.3 1.6-.2.5-.5.9-.8 1.3-.5.6-1.1.9-1.7 1-.6.1-1.3.1-2-.1-.7-.2-1.5-.5-2.3-1-.8-.4-1.6-1-2.4-1.7-.8-.7-1.6-1.4-2.3-2.2-.7-.8-1.3-1.6-1.8-2.4-.5-.8-.9-1.6-1.2-2.4-.3-.8-.4-1.5-.4-2.2 0-.5.1-.9.2-1.4.2-.4.4-.8.8-1.1.4-.4.9-.6 1.4-.6.2 0 .4 0 .5.1.2.1.3.2.4.4l1.7 2.4c.1.2.2.3.3.5 0 .1.1.3.1.4 0 .2-.1.3-.2.5-.1.1-.2.3-.4.4l-.5.5c-.1.1-.1.2-.1.3 0 .1 0 .1.1.2 0 .1.1.1.1.2.1.2.4.5.7.9.4.4.7.8 1.1 1.2.4.4.8.7 1.2 1 .4.3.7.5.9.7l.2.1c.1 0 .1.1.2.1.1 0 .2 0 .3-.1l.5-.5c.2-.1.3-.3.5-.4.1-.1.3-.1.5-.1.1 0 .3 0 .4.1.2 0 .3.1.5.2l2.5 1.7c.2.1.3.2.4.4 0 .1.1.3.1.5z" fill="#FFFFFF" />
						</svg>
						<span className="whitespace-nowrap font-[family-name:var(--font-sans)] text-[10px] uppercase tracking-[0.1em] text-white/40">
							Phone
						</span>
					</div>
				</div>
			</div>
		</>
	)
}

