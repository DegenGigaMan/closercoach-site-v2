/** @fileoverview S3 How It Works section. Dark surface with 3-phase vertical progression
 * (Before/During/After), each with distinct visual treatment. Emerald thread connects steps.
 * Copy locked to lp-copy-deck-v5. */

'use client'

import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { CTA } from '@/lib/constants'
import { Check, Warning } from '@phosphor-icons/react'

/* ---------- Step 1 composites ---------- */

function CharacterCard() {
	return (
		<div className="w-56 rounded-xl border border-cc-surface-border bg-cc-surface-card p-4 shadow-lg">
			<div className="mb-3 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-cc-accent/15 text-sm font-semibold text-cc-accent">
					JD
				</div>
				<div>
					<div className="text-sm font-medium text-white">CEO, Enterprise Software</div>
					<div className="text-xs text-cc-text-secondary">Series B, 200 employees</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-[10px] text-cc-text-secondary">Difficulty</span>
				<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cc-surface-elevated">
					<div className="h-full w-4/5 rounded-full bg-cc-accent" />
				</div>
				<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-accent">Hard</span>
			</div>
		</div>
	)
}

function CheckpointPill() {
	return (
		<div className="flex w-fit items-center gap-2 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-4 py-2">
			<Check size={14} weight="bold" className="text-cc-accent" />
			<span className="text-xs font-medium text-cc-accent">Objection Handling</span>
		</div>
	)
}

/* ---------- Step 2 composites ---------- */

function PhoneMockupStatic() {
	return (
		<div className="relative mx-auto w-[260px]">
			{/* Subtle glow */}
			<div
				className="absolute inset-0"
				aria-hidden="true"
				style={{
					background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
				}}
			/>

			{/* Frame */}
			<div className="relative z-10 rounded-[2.5rem] border border-white/12 bg-cc-surface-card p-3">
				{/* Notch */}
				<div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-cc-foundation" />

				{/* Screen */}
				<div
					className="relative overflow-hidden rounded-[2rem] bg-cc-foundation"
					style={{ aspectRatio: '9 / 19.5' }}
				>
					{/* Status bar */}
					<div className="flex h-10 items-end justify-center pb-1">
						<div className="h-1 w-8 rounded-full bg-white/20" />
					</div>

					{/* Annotation content (static) */}
					<div className="flex flex-col gap-3 p-4">
						<div className="flex items-center gap-2 text-xs font-medium text-[#EF4444]">
							<Warning size={14} weight="bold" />
							<span>Missed The Mark</span>
						</div>
						<div className="rounded-lg border border-cc-surface-border bg-cc-surface-elevated p-3">
							<div className="mb-2 text-[10px] text-cc-text-secondary">0:47 - Objection Handling</div>
							<div className="text-xs text-white">&ldquo;Let me check with my team...&rdquo;</div>
						</div>
						<div className="rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2">
							<div className="text-[10px] font-medium text-[#EF4444]">You let the prospect defer.</div>
							<div className="mt-1 text-[10px] text-cc-text-secondary">Try: isolate the real objection first.</div>
						</div>
						<div className="mt-1 rounded-lg border border-cc-surface-border bg-cc-surface-elevated p-3">
							<div className="mb-2 text-[10px] text-cc-text-secondary">1:23 - Discovery</div>
							<div className="text-xs text-white">&ldquo;What&rsquo;s your current process?&rdquo;</div>
						</div>
						<div className="rounded-md border border-cc-accent/30 bg-cc-accent/10 px-3 py-2">
							<div className="text-[10px] font-medium text-cc-accent">Strong open-ended question.</div>
							<div className="mt-1 text-[10px] text-cc-text-secondary">Builds rapport and surfaces pain points.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function ReplacementBadge() {
	const items = ['Voice Memos', 'ChatGPT', 'Phone App']
	return (
		<div className="flex flex-wrap items-center justify-center gap-2 pt-4">
			<span className="text-xs font-medium text-cc-text-secondary">CloserCoach Replaces:</span>
			<div className="flex flex-wrap items-center gap-1.5">
				{items.map((item, i) => (
					<span key={item} className="flex items-center gap-1.5">
						<span className="rounded-md border border-cc-surface-border bg-cc-surface-card px-3 py-1.5 text-xs font-medium text-white">
							{item}
						</span>
						{i < items.length - 1 && (
							<span className="text-xs text-cc-text-muted">+</span>
						)}
					</span>
				))}
			</div>
		</div>
	)
}

/* ---------- Step 3 composites ---------- */

const industries = ['Insurance', 'Real Estate', 'Automotive'] as const
const dimensions = ['Discovery', 'Pitch', 'Objections', 'Closing', 'Tonality'] as const

function ScorecardComposite() {
	return (
		<div className="overflow-hidden rounded-xl border border-cc-surface-border bg-cc-surface-card">
			{/* Industry tabs */}
			<div className="flex border-b border-cc-surface-border">
				{industries.map((tab) => (
					<button
						key={tab}
						className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
							tab === 'Insurance'
								? 'border-b-2 border-cc-accent bg-cc-surface-card text-cc-accent'
								: 'text-cc-text-secondary hover:text-white'
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			<div className="flex">
				{/* Dimension sidebar */}
				<div className="flex w-28 shrink-0 flex-col border-r border-cc-surface-border">
					{dimensions.map((dim) => (
						<button
							key={dim}
							className={`px-3 py-2.5 text-left text-xs font-medium transition-colors ${
								dim === 'Discovery'
									? 'bg-cc-accent/10 text-cc-accent'
									: 'text-cc-text-secondary hover:text-white'
							}`}
						>
							{dim}
						</button>
					))}
				</div>

				{/* Main comparison panel */}
				<div className="flex-1 p-4">
					<div className="mb-3 flex items-center justify-between">
						<span className="text-xs font-medium text-cc-accent">Discovery</span>
						<span className="font-[family-name:var(--font-mono)] text-xs text-cc-accent">B+</span>
					</div>

					{/* What you said */}
					<div className="mb-3 rounded-lg border border-cc-score-red/20 bg-cc-score-red/5 p-3">
						<div className="mb-1 text-[10px] font-medium text-cc-score-red">What you said</div>
						<div className="text-xs text-cc-text-secondary">
							&ldquo;So tell me about your business.&rdquo;
						</div>
					</div>

					{/* What you should've said */}
					<div className="rounded-lg border border-cc-accent/20 bg-cc-accent/5 p-3">
						<div className="mb-1 text-[10px] font-medium text-cc-accent">What you should&rsquo;ve said</div>
						<div className="text-xs text-cc-text-secondary">
							&ldquo;Walk me through what happens when a new lead comes in today.&rdquo;
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

/* ---------- Step marker ---------- */

function StepMarker({ number, phase }: { number: string; phase: string }) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs font-medium uppercase tracking-wider text-cc-accent">
				[{number}] {phase}
			</span>
		</div>
	)
}

/* ---------- Main section ---------- */

/**
 * @description S3 How It Works: 3-phase vertical progression (Before/During/After).
 * Each step has a distinct layout: Step 1 = quote-forward split with floating UI composites,
 * Step 2 = centered phone mockup with flanking text, Step 3 = tab-structured scorecard.
 * Emerald thread line connects step markers. Dark surface with L2 noise.
 */
export default function SectionHowItWorks() {
	return (
		<section
			id="product"
			data-surface="dark-education"
			className="relative overflow-hidden bg-cc-foundation py-24 md:py-32"
		>
			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.02} />

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-7xl px-6">
				{/* Section header */}
				<div className="mb-20 text-center md:mb-24">
					<h2 className="display-lg text-white">
						Practice. Lose. Learn. Win.
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-cc-text-secondary">
						Train before the call. Find out where you lost it. Fix it before it costs you again.
					</p>
				</div>

				{/* Steps container with emerald thread */}
				<div className="relative">
					{/* Emerald thread line (desktop only) */}
					<div
						className="absolute left-6 top-0 hidden h-full w-px bg-cc-accent/30 md:block"
						aria-hidden="true"
					/>

					{/* ===== STEP 1: Before ===== */}
					<div className="relative mb-24 md:mb-32 md:pl-16">
						{/* Thread dot */}
						<div className="absolute left-5 top-1 hidden h-3 w-3 rounded-full border-2 border-cc-accent bg-cc-foundation md:block" aria-hidden="true" />

						<div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[55%_45%] md:gap-12">
							{/* Left: text + testimonial */}
							<div className="flex flex-col gap-6">
								<StepMarker number="01" phase="Before" />
								<h3 className="display-md text-white">
									Close The Deal Before The Meeting Even Starts
								</h3>

								{/* Testimonial */}
								<blockquote className="relative border-l-2 border-cc-accent/30 pl-6">
									<span
										className="absolute -left-1 -top-4 text-6xl leading-none text-cc-accent/20"
										aria-hidden="true"
									>
										&ldquo;
									</span>
									<p className="text-lg italic text-white md:text-xl">
										Helped me close a $10k+ deal last week. I used the app to rehearse my pitch to the CEO of a large company that was scheduled 3 weeks in advance.
									</p>
								</blockquote>

								{/* Body */}
								<div className="flex flex-col gap-4">
									<p className="text-base text-cc-text-secondary">
										Tell us what your leads look like. Our AI builds a practice partner that looks, talks, and pushes back exactly like your real buyer. Run the call before the call -- so when you&rsquo;re live, it feels like your second time through the door.
									</p>
									<p className="text-base text-cc-text-secondary">
										You already know the objections. You already know the close.
									</p>
								</div>
							</div>

							{/* Right: floating UI composites */}
							<div className="relative flex flex-col items-center gap-6 pt-8 md:items-start md:pt-12">
								<div className="translate-x-0 md:translate-x-4">
									<CharacterCard />
								</div>
								<div className="translate-x-0 md:translate-x-12">
									<CheckpointPill />
								</div>
							</div>
						</div>
					</div>

					{/* ===== STEP 2: During ===== */}
					<div className="relative mb-24 md:mb-32 md:pl-16">
						{/* Thread dot */}
						<div className="absolute left-5 top-1 hidden h-3 w-3 rounded-full border-2 border-cc-accent bg-cc-foundation md:block" aria-hidden="true" />

						<div className="flex flex-col items-center gap-10">
							{/* Header centered */}
							<div className="w-full text-center md:text-left">
								<StepMarker number="02" phase="During" />
								<h3 className="mt-6 display-md text-white">
									Record Every Sales Meeting. Anytime. Anywhere.
								</h3>
							</div>

							{/* Phone + flanking text */}
							<div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
								{/* Left text */}
								<div className="flex flex-col gap-4">
									<p className="text-base text-cc-text-secondary">
										Dial straight from the app or record any in-person meeting. CloserCoach captures every word, flags your key moments, and delivers notes and coaching -- automatically.
									</p>
								</div>

								{/* Center phone */}
								<PhoneMockupStatic />

								{/* Right text */}
								<div className="flex flex-col gap-4">
									<p className="text-base text-cc-text-secondary">
										Whether you&rsquo;re selling door to door or hammering cold call-- wherever you sell, it&rsquo;s there. Your number shows up on caller ID. No spam flags. No rented numbers. Just your voice, with an AI edge.
									</p>
								</div>
							</div>

							{/* Replacement badge */}
							<ReplacementBadge />
						</div>
					</div>

					{/* ===== STEP 3: After ===== */}
					<div className="relative mb-16 md:mb-20 md:pl-16">
						{/* Thread dot */}
						<div className="absolute left-5 top-1 hidden h-3 w-3 rounded-full border-2 border-cc-accent bg-cc-foundation md:block" aria-hidden="true" />

						<div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[45%_55%] md:gap-12">
							{/* Left: text */}
							<div className="flex flex-col gap-6">
								<StepMarker number="03" phase="After" />
								<h3 className="display-md text-white">
									See Exactly What&rsquo;s Losing You Deals
								</h3>

								<div className="flex flex-col gap-4">
									<p className="text-base text-cc-text-secondary">
										Every call gets scored A through F, with industry-tailored scorecards and word-for-word talk-tracks showing you exactly what you should have said.
									</p>
									<p className="text-base text-cc-text-secondary">
										Track how your skills improve over time -- discovery, pitch, objection handling, tone, talk time, and close rate. The more you sell, the more your AI knows exactly where you&rsquo;re winning and where you&rsquo;re bleeding deals.
									</p>
								</div>
							</div>

							{/* Right: scorecard composite */}
							<div className="pt-0 md:pt-8">
								<ScorecardComposite />
							</div>
						</div>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="flex justify-center pt-8">
					<MotionCTA variant="primary" size="lg" href={CTA.tryFree.href}>
						{CTA.tryFree.text}
					</MotionCTA>
				</div>
			</div>
		</section>
	)
}
