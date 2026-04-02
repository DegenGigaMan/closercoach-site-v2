/** @fileoverview S6 Teams upsell section. Dark surface with split layout:
 * content/VPs left, sticky manager dashboard composite right.
 * Manager logo strip, testimonial, cost comparison, bottom-up adoption line, dual CTAs. */

'use client'

import Image from 'next/image'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND, CTA } from '@/lib/constants'
import { Users, ChartBar, Rocket, FileText, UserPlus, Plugs } from '@phosphor-icons/react'

/* ---------- Value props data ---------- */

const VALUE_PROPS = [
	{
		icon: Users,
		title: 'Coach Reps At Scale',
		body: 'Reps practice and improve without touching your calendar or pulling a teammate into a mock call. AI handles the repetitions so your coaching time goes to the moments that actually need you.',
	},
	{
		icon: ChartBar,
		title: 'Know Exactly Where Every Rep Stands',
		body: 'Know exactly where each rep needs help. See every rep\'s performance from one dashboard. Scores, call recordings, improvement trends. No more guessing who is struggling and on what.',
	},
	{
		icon: Rocket,
		title: 'Onboard New Reps 10x Faster',
		body: 'New reps practice before they ever talk to a customer - AI roleplay lets new hires train against real industry scenarios from day one. They walk into their first appointment with reps under their belt, not just a PowerPoint.',
	},
	{
		icon: FileText,
		title: 'Enforce New Scripting Efficiently',
		body: 'Roll out a new talk track and push it to the whole team as a structured practice. Reps drill it in roleplay until it\'s second nature -- no all-hands required, no wondering if it landed.',
	},
	{
		icon: UserPlus,
		title: 'Hire Better, Faster',
		body: 'Send candidates a roleplay challenge before they ever step into an interview. See how they handle a real sales conversation under pressure -- not just how well they interview.',
	},
	{
		icon: Plugs,
		title: 'Integrate Your Existing Sales Technology',
		body: 'Salesforce. HubSpot. GoHighLevel. Request a connection to the tools your team already uses.',
	},
] as const

/* ---------- Manager logo strip ---------- */

const MANAGER_LOGOS = [
	{ src: '/logos/state-farm.svg', alt: 'State Farm', w: 72, h: 28 },
	{ src: '/logos/land-rover.svg', alt: 'Land Rover', w: 72, h: 28 },
	{ src: '/logos/vivint.svg', alt: 'Vivint', w: 64, h: 28 },
	{ src: '/logos/remax.svg', alt: 'RE/MAX', w: 64, h: 28 },
	{ src: '/logos/toyota.svg', alt: 'Toyota', w: 64, h: 28 },
	{ src: '/logos/fidelity.svg', alt: 'Fidelity', w: 72, h: 28 },
] as const

/* ---------- Dashboard composite ---------- */

const KPI_CARDS = [
	{ value: '12', label: 'Active Reps' },
	{ value: 'B+', label: 'Avg Score' },
	{ value: '\u2191 15%', label: 'This Month' },
] as const

const BAR_HEIGHTS = [60, 85, 45, 100] as const

/**
 * @description Browser-frame mockup showing a simplified manager dashboard.
 * Dark-themed with KPI cards and emerald bar chart.
 */
function DashboardComposite() {
	return (
		<div className="rounded-xl border border-cc-surface-border bg-cc-surface-card shadow-2xl">
			{/* Browser chrome */}
			<div className="flex items-center gap-2 border-b border-cc-surface-border px-4 py-3">
				<div className="flex gap-1.5">
					<div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
					<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
					<div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
				</div>
				<div className="ml-2 flex-1 rounded-md bg-cc-foundation px-3 py-1.5">
					<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-text-muted">
						app.closercoach.ai
					</span>
				</div>
			</div>

			{/* Dashboard content */}
			<div className="p-5">
				<h4 className="mb-4 text-sm font-semibold text-white">Team Overview</h4>

				{/* KPI cards */}
				<div className="mb-5 grid grid-cols-3 gap-3">
					{KPI_CARDS.map((kpi) => (
						<div
							key={kpi.label}
							className="rounded-lg border border-cc-surface-border bg-cc-foundation p-3 text-center"
						>
							<div className="font-[family-name:var(--font-mono)] text-lg font-medium text-cc-accent">
								{kpi.value}
							</div>
							<div className="text-[10px] text-cc-text-secondary">{kpi.label}</div>
						</div>
					))}
				</div>

				{/* Bar chart */}
				<div className="rounded-lg border border-cc-surface-border bg-cc-foundation p-4">
					<div className="mb-3 text-[10px] text-cc-text-secondary">Rep Performance</div>
					<div className="flex items-end justify-around gap-3" style={{ height: 80 }}>
						{BAR_HEIGHTS.map((h, i) => (
							<div
								key={i}
								className="w-8 rounded-t-sm bg-cc-accent/80"
								style={{ height: `${h}%` }}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

/* ---------- Main section ---------- */

/**
 * @description S6 Teams upsell section. Split layout with scrollable content left
 * and sticky dashboard composite right on desktop. Includes 6 value props,
 * manager logo strip, testimonial, cost comparison, bottom-up adoption, and dual CTAs.
 */
export default function SectionTeams() {
	return (
		<section
			id="teams"
			data-surface="dark-teams"
			className="relative overflow-hidden bg-cc-foundation py-24 md:py-32"
		>
			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.02} />

			<div className="relative z-10 mx-auto max-w-7xl px-6">
				{/* Mobile: dashboard shown above content */}
				<div className="mb-12 md:hidden">
					<DashboardComposite />
				</div>

				{/* Split layout */}
				<div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[55%_45%] md:gap-16">
					{/* Left column: all content */}
					<div className="flex flex-col gap-10">
						{/* Header block */}
						<div className="flex flex-col gap-4">
							<span className="text-xs uppercase tracking-wider text-cc-accent">
								For Sales Managers
							</span>
							<h2 className="display-lg text-white">CloserCoach for Teams</h2>
							<p className="text-lg text-cc-text-secondary">
								One dashboard. Every rep. Every score. Every trend.
							</p>
							<p className="text-base text-cc-text-secondary">
								Over 20,000 closers already use CloserCoach individually. Now give your whole team the same edge.
							</p>
						</div>

						{/* Manager onboarding */}
						<p className="text-base text-cc-text-secondary">
							<span className="font-semibold text-white">Enter your website. AI learns what your team sells.</span>{' '}
							One URL and your team is training on real scenarios from day one.
						</p>

						{/* Value props */}
						<div className="flex flex-col gap-6">
							{VALUE_PROPS.map((vp, i) => {
								const Icon = vp.icon
								return (
									<div key={vp.title}>
										<div className="mb-2 flex items-center gap-3">
											<Icon size={20} weight="bold" className="shrink-0 text-cc-accent" />
											<span className="text-base font-semibold text-white">{vp.title}</span>
										</div>
										<p className="pl-8 text-sm text-cc-text-secondary">{vp.body}</p>
										{/* Standalone paragraph after VP2 */}
										{i === 1 && (
											<p className="mt-3 pl-8 text-sm text-cc-text-secondary">
												See every rep&rsquo;s performance from one dashboard -- scores, call recordings, and improvement trends over time. No more guessing who needs help or where they&rsquo;re struggling.
											</p>
										)}
									</div>
								)
							})}
						</div>

						{/* Manager logo strip */}
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
								{MANAGER_LOGOS.map((logo) => (
									<Image
										key={logo.alt}
										src={logo.src}
										alt={logo.alt}
										width={logo.w}
										height={logo.h}
										className="h-6 w-auto opacity-50 grayscale"
									/>
								))}
							</div>
							<p className="text-center text-xs text-cc-text-muted md:text-left">
								500+ sales managers already use CloserCoach with their teams.
							</p>
						</div>

						{/* Chris testimonial */}
						<div className="rounded-xl border border-cc-surface-border bg-cc-surface-card p-6">
							<blockquote>
								<p className="text-base italic text-white">
									&ldquo;Before CloserCoach, I was spending 1 hour per week per rep. Now, I spend 1 hour per week training 20 reps.&rdquo;
								</p>
								<footer className="mt-3 text-sm text-cc-text-secondary">
									Chris, Sales Manager at Lake Washington
								</footer>
							</blockquote>
						</div>

						{/* Cost comparison */}
						<div className="rounded-xl border border-cc-surface-border bg-cc-surface-card p-6">
							<p className="text-base text-cc-text-secondary">
								<span className="font-[family-name:var(--font-mono)] font-medium text-cc-amber">$49</span>/rep/mo vs{' '}
								<span className="font-[family-name:var(--font-mono)] font-medium text-cc-amber">$200+</span>/rep/mo competitors.
								20% off annual. No minimums, no lock-in. Sales managers save{' '}
								<span className="font-[family-name:var(--font-mono)] font-medium text-cc-amber">6+</span> hours/week.
							</p>
						</div>

						{/* Bottom-up adoption */}
						<p className="text-sm italic text-cc-text-secondary">
							Most teams discover CloserCoach because one rep starts closing more deals. You are bringing it to the whole team.
						</p>

						{/* CTAs */}
						<div className="flex flex-col gap-4 sm:flex-row">
							<MotionCTA variant="primary" size="lg" href={BRAND.calendly}>
								Contact Sales
							</MotionCTA>
							<MotionCTA variant="secondary" size="lg" href="/download">
								Try for Free
							</MotionCTA>
						</div>
					</div>

					{/* Right column: sticky dashboard (desktop only) */}
					<div className="hidden md:block">
						<div className="sticky top-24">
							<DashboardComposite />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
