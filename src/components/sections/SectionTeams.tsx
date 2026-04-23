/** @fileoverview S6 Teams — rebuilt 2026-04-20 per Alim directive.
 *
 * PRIOR constellation hero (stat pills + growth chart + 3 inline features)
 * KILLED 2026-04-20. Alim: "remove all this yeah, just make it a heading
 * center aligned ... perhaps you could just have company logos under it and
 * say like Join 35+ Sales Teams Scaling with CloserCoach or something."
 * Bento grid KEPT per Alim: "but i like the bemto".
 *
 * Composition (top → bottom):
 *   1. Center-aligned overline + display headline + subhead + social proof
 *      line + 6-logo manager wall (SP2).
 *   2. Bento feature grid — 6 cards, 3-col masonry desktop, stack mobile.
 *      Card 01 is HERO card (2-col span desktop).
 *   3. Cost-of-Inaction block (CR-4) — IB1/IB2/IB3/IB4 + $49 kill-shot.
 *   4. Competitive Pricing row (CR-2) — CC $49 vs Rilla / Siro / Hyperbound.
 *   5. Compliance strip — SOC2 · GDPR · SSO · SAML · Audit Log · Data Residency.
 *   6. Dual CTAs — "Contact Sales" (Calendly) + "Try for Free" (/download).
 *
 * Surface: dark (cc-foundation #0D0F14). Returns from S5.5 warm.
 * Copy locked to lp-copy-deck-v5 § Section 6 + blueprint § S6.
 * Proof locked to proof-inventory: SP2, IB1-IB4, $3, $5-$8, PC8, TR1-TR6.
 *
 * Zero fabricated data: no 2,847 active reps, no 94% adoption, no $249/rep
 * competitor price. Stats that remain (500+ managers, 35+ teams, 20,000+
 * closers, 6+ hours, $49) are all verified in proof-inventory.
 *
 * Hydration safety: ScrollReveal uses stable initial props; useReducedMotion
 * handled by the shared wrapper. No client-branched initial state. F42 safe.
 *
 * WCAG AA on dark: white headings (21:1), cc-text-secondary #94A3B8 body
 * (6.4:1), emerald #10B981 accent (4.83:1), amber #F59E0B stat accent
 * (9.6:1). Focus-visible rings via MotionCTA. */

'use client'

import Image from 'next/image'
import { useRef, type ReactElement, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND } from '@/lib/constants'
import {
	Users,
	ChartBar,
	Rocket,
	FileText,
	UserPlus,
	Plugs,
	ShieldCheck,
} from '@phosphor-icons/react'

/* ── Reveal wrapper (hydration-safe, reduced-motion aware) ── */

type RevealProps = {
	children: ReactNode
	className?: string
	delay?: number
}

/**
 * @description Fades + lifts children on scroll. Stable initial props so SSR
 * matches first client render. Collapses to 0s under reduced-motion per F42.
 */
function Reveal({ children, className = '', delay = 0 }: RevealProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const ref = useRef<HTMLDivElement | null>(null)
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: 18 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
			transition={
				prefersReducedMotion
					? { duration: 0 }
					: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }
			}
		>
			{children}
		</motion.div>
	)
}

/* ── Manager logo wall (SP2) ── */

/* Figma-locked logo set + order per node 63:3441. Swapped Vivint → Sunrun
 * to match the Figma spec. Assets themselves were overwritten from the Figma
 * source so strokes and proportions match the design exactly.
 *
 * Dimensions are taken verbatim from the Figma frames so each brand keeps
 * its own visual weight at a shared eye-level band (20-32px tall). Do not
 * force-uniform the heights — Figma intentionally gives Land Rover +8px
 * over Toyota so the oval badge reads at the same optical weight as the
 * wordmarks. */
const MANAGER_LOGOS = [
	{ src: '/logos/toyota.svg', alt: 'Toyota', w: 168, h: 24, heightClass: 'h-6' },
	{ src: '/logos/state-farm.svg', alt: 'State Farm', w: 171, h: 24, heightClass: 'h-6' },
	{ src: '/logos/sunrun.svg', alt: 'Sunrun', w: 105, h: 20, heightClass: 'h-5' },
	{ src: '/logos/land-rover.svg', alt: 'Land Rover', w: 61, h: 32, heightClass: 'h-8' },
	{ src: '/logos/remax.svg', alt: 'RE/MAX', w: 152, h: 28, heightClass: 'h-7' },
	{ src: '/logos/fidelity.svg', alt: 'Fidelity', w: 92, h: 28, heightClass: 'h-7' },
] as const

/* ── Bento feature cards (6) ── */

type Feature = {
	chapter: string
	title: string
	body: string
	icon: typeof Users
	span?: 'hero' | 'full' | 'default'
}

const FEATURES: readonly Feature[] = [
	{
		chapter: '[01]',
		title: 'Coach Reps At Scale',
		body: 'AI handles the repetitions so your coaching time goes to the moments that actually need you.',
		icon: Users,
		span: 'hero',
	},
	{
		chapter: '[02]',
		title: 'Know Where Every Rep Stands',
		body: 'See every rep\u2019s performance from one dashboard.',
		icon: ChartBar,
	},
	{
		chapter: '[03]',
		title: 'Onboard New Reps 10x Faster',
		body: 'New reps practice before they ever talk to a customer.',
		icon: Rocket,
	},
	{
		chapter: '[04]',
		title: 'Enforce New Scripting Efficiently',
		body: 'Roll out a new talk track and push it as a structured practice.',
		icon: FileText,
	},
	{
		chapter: '[05]',
		title: 'Hire Better, Faster',
		body: 'Send candidates a roleplay challenge before they interview.',
		icon: UserPlus,
	},
	{
		chapter: '[06]',
		title: 'Integrate Your Sales Stack',
		body: 'Salesforce. HubSpot. GoHighLevel. Request a connection to the tools your team already uses.',
		icon: Plugs,
		span: 'full',
	},
] as const

/* ── Cost-of-Inaction rows (IB1/IB2/IB3) ── */

const COST_ROWS = [
	{ value: '25-35%', label: 'Annual turnover on your team' },
	{ value: '$97-115K', label: 'Replacement cost per rep' },
	{ value: '6-9 mo', label: 'New rep ramp to productivity' },
] as const

/* ── Competitive pricing (CR-2 / $5-$8) ── */

type PriceCol = {
	name: string
	price: string
	note: string
	elevated?: boolean
}

const PRICE_COLS: readonly PriceCol[] = [
	{
		name: 'CloserCoach',
		price: '$49',
		note: '/user/mo. Month-to-month.',
		elevated: true,
	},
	{
		name: 'Rilla',
		price: '$199-349',
		note: '/rep/mo. Annual + 5-user min.',
	},
	{
		name: 'Siro',
		price: '$3,000+',
		note: '/user/year.',
	},
	{
		name: 'Hyperbound',
		price: '$15,000+',
		note: '/year.',
	},
] as const

/* ── Compliance strip (TR1-TR6) ── */

const COMPLIANCE = ['SOC2', 'GDPR', 'SSO', 'SAML', 'Audit Logging', 'Data Residency'] as const

/* ── Bento card ── */

function BentoCard({ feature, index }: { feature: Feature; index: number }): ReactElement {
	const Icon = feature.icon
	const heroSpan = feature.span === 'hero'
	const fullSpan = feature.span === 'full'
	const displayTitle = heroSpan || fullSpan
	const spanClass = heroSpan ? 'md:col-span-2' : fullSpan ? 'md:col-span-3' : ''
	return (
		<Reveal delay={index * 0.05} className={spanClass}>
			<article className='group relative h-full rounded-2xl border border-cc-surface-border bg-cc-surface-card p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-cc-surface-border-hover hover:shadow-[0_0_32px_rgba(16,185,129,0.12)]'>
				<span
					aria-hidden='true'
					className='absolute right-5 top-5 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wider text-cc-accent/70'
				>
					{feature.chapter}
				</span>
				<div className={`flex gap-4 ${fullSpan ? 'flex-col md:flex-row md:items-center md:gap-8' : 'flex-col'}`}>
					<Icon size={fullSpan ? 32 : 28} weight='bold' className='shrink-0 text-cc-accent' />
					<div className={`flex flex-col gap-3 ${fullSpan ? 'md:gap-2' : ''}`}>
						<h3 className={`text-white ${displayTitle ? 'display-sm' : 'text-xl font-semibold'}`} style={{ fontFamily: displayTitle ? 'var(--font-heading)' : undefined, lineHeight: 1.2 }}>
							{feature.title}
						</h3>
						<p className={`text-cc-text-secondary ${displayTitle ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
							{feature.body}
						</p>
					</div>
				</div>
			</article>
		</Reveal>
	)
}

/* ── Main section ── */

/**
 * @description S6 Teams section. Center-aligned hero block (heading +
 * subhead + "Join 35+" social proof line + logo wall) over a 6-card bento
 * grid, cost-of-inaction block, 4-column competitive pricing row, compliance
 * strip, and dual CTAs. No constellation hero (killed 2026-04-20 per Alim).
 */
export default function SectionTeams(): ReactElement {
	return (
		<section
			id='teams'
			data-surface='dark-teams'
			className='relative overflow-hidden bg-cc-foundation py-24 md:py-32'
		>
			<AtmosphereNoise opacity={0.02} />

			<div className='relative z-10 mx-auto max-w-7xl px-6'>
				{/* ── Top block (center-aligned) ── */}
				<Reveal className='flex flex-col items-center gap-5 text-center'>
					<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-cc-accent'>
						For Sales Managers
					</span>
					<h2
						className='display-lg max-w-3xl text-white md:text-[3.5rem]'
						style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.08 }}
					>
						CloserCoach for{' '}
						<em className='not-italic'>
							<span className='italic text-cc-accent'>Teams.</span>
						</em>
					</h2>
					<p className='max-w-2xl text-lg text-cc-text-secondary md:text-xl'>
						Over 20,000 closers already use CloserCoach individually. Now give your
						whole team the same edge.
					</p>
				</Reveal>

				{/* ── Social proof line + manager logo wall ── */}
				<Reveal delay={0.08} className='mt-10 flex flex-col items-center gap-6'>
					<p
						className='text-center text-base text-white/90 md:text-lg'
						style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
					>
						Join 35+ sales teams scaling with CloserCoach.
					</p>
					<div className='flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6 md:flex-nowrap md:justify-between md:gap-x-8'>
						{MANAGER_LOGOS.map((logo) => (
							<Image
								key={logo.alt}
								src={logo.src}
								alt={logo.alt}
								width={logo.w}
								height={logo.h}
								className={`${logo.heightClass} w-auto opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-95`}
							/>
						))}
					</div>
				</Reveal>

				{/* ── Bento feature grid (6 cards) ── */}
				<div className='mt-20 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-3 md:gap-5'>
					{FEATURES.map((feature, i) => (
						<BentoCard key={feature.title} feature={feature} index={i} />
					))}
				</div>

				{/* ── Cost-of-Inaction block (hidden 2026-04-23 per Andy) ── */}
				{false && <Reveal className='mt-20 rounded-2xl border border-cc-surface-border bg-cc-surface p-8 md:mt-24 md:p-12'>
					<div className='flex flex-col gap-8'>
						<div className='flex flex-col gap-2'>
							<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-cc-amber'>
								What does NOT coaching cost you?
							</span>
							<h3
								className='display-sm text-white md:text-3xl'
								style={{ fontFamily: 'var(--font-heading)' }}
							>
								The math isn&rsquo;t close.
							</h3>
						</div>
						<div className='grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8'>
							{COST_ROWS.map((row) => (
								<div key={row.label} className='flex flex-col gap-2 border-l border-cc-amber/30 pl-5'>
									<div className='font-[family-name:var(--font-mono)] text-3xl font-medium text-cc-amber md:text-4xl'>
										{row.value}
									</div>
									<div className='text-sm text-cc-text-secondary md:text-base'>
										{row.label}
									</div>
								</div>
							))}
						</div>
						<div className='flex flex-col gap-3 border-t border-cc-surface-border pt-6 md:flex-row md:items-center md:justify-between md:pt-8'>
							<p className='text-base text-white md:text-lg'>
								CloserCoach Teams:{' '}
								<span className='font-[family-name:var(--font-mono)] font-medium text-cc-accent'>
									$49/rep/month = $588/year.
								</span>{' '}
								That&rsquo;s 0.5% of one replacement.
							</p>
							<p className='text-sm italic text-cc-text-secondary md:text-base'>
								67% of your competitors already use AI coaching tools.
							</p>
						</div>
					</div>
				</Reveal>}

				{/* ── Competitive pricing row (hidden 2026-04-23 per Andy) ── */}
				{false && <Reveal delay={0.05} className='mt-16 md:mt-20'>
					<div className='mb-6 flex flex-col gap-1 md:mb-8'>
						<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-cc-accent'>
							Priced for teams, not enterprises
						</span>
						<h3
							className='display-sm text-white md:text-3xl'
							style={{ fontFamily: 'var(--font-heading)' }}
						>
							15-27x cheaper than Rilla. No minimums. No annual lock-in.
						</h3>
					</div>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5'>
						{PRICE_COLS.map((col) => (
							<div
								key={col.name}
								className={
									col.elevated
										? 'rounded-xl border border-cc-accent/60 bg-cc-accent/[0.06] p-6 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
										: 'rounded-xl border border-cc-surface-border bg-cc-surface-card p-6'
								}
							>
								<div className='mb-4 flex items-center justify-between'>
									<span
										className={`text-sm font-semibold ${col.elevated ? 'text-cc-accent' : 'text-white'}`}
									>
										{col.name}
									</span>
									{col.elevated && (
										<span className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-wider text-cc-accent'>
											You
										</span>
									)}
								</div>
								<div className={`font-[family-name:var(--font-mono)] text-2xl font-medium md:text-3xl ${col.elevated ? 'text-white' : 'text-cc-text-secondary'}`}>
									{col.price}
								</div>
								<div className='mt-2 text-xs text-cc-text-muted md:text-sm'>
									{col.note}
								</div>
							</div>
						))}
					</div>
				</Reveal>}

				{/* ── Compliance trust strip ── */}
				<Reveal delay={0.08} className='mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-cc-surface-border pt-10 md:mt-20 md:gap-x-10'>
					<ShieldCheck size={18} weight='bold' className='text-cc-accent' aria-hidden='true' />
					{COMPLIANCE.map((label) => (
						<span
							key={label}
							className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.16em] text-cc-text-muted'
						>
							{label}
						</span>
					))}
				</Reveal>

				{/* ── CTAs ── */}
				<Reveal delay={0.1} className='mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
					<MotionCTA variant='primary' size='lg' href={BRAND.calendly}>
						Contact Sales
					</MotionCTA>
					<MotionCTA variant='secondary' size='lg' href='/download'>
						Try for Free
					</MotionCTA>
				</Reveal>
			</div>
		</section>
	)
}
