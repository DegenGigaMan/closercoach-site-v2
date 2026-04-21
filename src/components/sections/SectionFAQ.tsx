/** @fileoverview S7 FAQ — proof-dense accordion. Built W8 (2026-04-20).
 *
 * Composition (per section-blueprint v2 § S7):
 *   1. Section label (overline, emerald mono)
 *   2. Display headline (Lora Bold, italic emphasis on "honest")
 *   3. AC billboard corner label — "FAQ" rotated -90deg in left margin,
 *      clamp(160px, 20vw, 300px) at 6% opacity. Desktop only.
 *   4. 12-question accordion with AA numbered markers [01]-[12].
 *      First question expanded by default.
 *      AB rim glow on the open item (emerald border highlight, subtle).
 *
 * Surface: dark (cc-foundation). Minimal atmosphere — reading section.
 * Copy: 12 Q+A sourced from prior lab z-qa-architecture + ac-billboard-label,
 * cross-checked against blueprint proof map (PC1, PC3, PC4, P1, P2, P4,
 * TR1-6, SP1, $3, $4, $5-7, E4, IB3) and proof-inventory. Zero fabrication.
 *
 * Accordion: native <button> + aria-expanded + aria-controls + hidden panel.
 * Single-open model. Keyboard a11y: Enter/Space toggles via button semantics.
 * Motion: height + opacity on panel, spring. Stable initial props (F42 safe).
 *
 * WCAG AA on dark: white questions (21:1), cc-text-secondary answers (6.4:1),
 * emerald #10B981 markers (5.2:1 on cc-foundation). Focus-visible rings.
 *
 * Responsive: billboard label hidden < 1024px, mono markers scale down to
 * 10px on mobile, chevron right-aligned. */

'use client'

import { useState, useRef, useId, type ReactElement } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { CaretDown } from '@phosphor-icons/react'

/* ── FAQ content ── */

type FAQItem = {
	id: string
	question: string
	answer: string
}

const FAQS: readonly FAQItem[] = [
	{
		id: 'industry-fit',
		question: 'How does the AI know my industry?',
		answer:
			'Drop in your website URL and the AI reads your product, your pricing, your positioning, and your buyer language. From there it generates roleplay scenarios that mirror real conversations with your real prospects. CloserCoach covers 16+ industries including Insurance, SaaS, Solar, Automotive, Financial Services, and Real Estate, with 100+ scenario types across them.',
	},
	{
		id: 'feedback-depth',
		question: 'How detailed is the coaching feedback?',
		answer:
			'Up to 20 pages of personalized coaching feedback per scoring section. Every call is scored across dynamic dimensions like tone, objection handling, discovery, and closing, with specific timestamps and line-by-line coaching notes. It is the depth of a great sales manager sitting next to you on every call.',
	},
	{
		id: 'effectiveness',
		question: 'Do reps actually improve?',
		answer:
			'Yes. Closers coached weekly hit 76% of quota vs 47% for closers coached quarterly. CloserCoach users report an average 7% increase in close rate after consistent practice. The scoring model is built on proven sales frameworks, so every scorecard and coaching note is grounded in a methodology that actually closes deals.',
	},
	{
		id: 'onboarding',
		question: 'How long does onboarding take?',
		answer:
			'New reps practice before they ever talk to a customer, which cuts ramp time by roughly 50%. Industry average for new sales rep ramp is 6-9 months. CloserCoach compresses that by letting reps roleplay your exact scripts, objection patterns, and buyer profiles from day one.',
	},
	{
		id: 'enterprise-security',
		question: 'What about enterprise security?',
		answer:
			'SOC2 Type II compliant, GDPR ready, with SSO, SAML, role-based access control, audit logging, and data residency options on Enterprise plans. Trusted by enterprise teams at State Farm, Land Rover, Vivint, RE/MAX, Toyota, and Fidelity. Calls are encrypted in transit and at rest. Your data is yours and is never used to train models for other customers.',
	},
	{
		id: 'pricing-moat',
		question: 'Why $12.99 and $49 when competitors charge 10x more?',
		answer:
			'Rilla starts at $199-349 per rep per month on annual contracts with 5-user minimums. Siro is $3,000+ per user per year. Hyperbound is $15,000+ per year. CloserCoach Closer is $12.99/mo, Teams is $49/user/mo month-to-month. Same 7-layer personalization depth. Priced for teams, not enterprises.',
	},
	{
		id: 'trial',
		question: 'Can I try it first?',
		answer:
			'Yes. 3-day free trial with full access to everything in the Closer plan. Unlimited roleplays, live call scoring, personalized scorecards, skill progression tracking. Cancel anytime from settings. No annual commitment, no surprise charges.',
	},
	{
		id: 'industries',
		question: 'How many industries?',
		answer:
			'16+ industries supported with 100+ scenario types and 20+ distinct call variations across them. Insurance, SaaS, Solar, Automotive, Financial Services, Real Estate, Home Services, Healthcare, and more. Every scenario is generated from your product context, not a generic template.',
	},
	{
		id: 'vs-competitors',
		question: 'What makes this different from Rilla or Siro?',
		answer:
			'Rilla and Siro score calls after the fact. CloserCoach lets you practice before the call with an AI buyer trained on your product, record the live call with in-call annotations, and see exactly what lost you the deal. 7-layer personalization, mobile-first, and priced at a fraction of enterprise tools.',
	},
	{
		id: 'cancel',
		question: 'Can I cancel anytime?',
		answer:
			'Yes, anytime from app settings. No annual contracts. No cancellation fees. Teams is billed month-to-month with no seat minimums. You stay in full control.',
	},
	{
		id: 'mobile',
		question: 'Does it work on the road?',
		answer:
			'CloserCoach is mobile-first. iOS and Android apps are built for closers in the field, between calls, or at the kitchen table after a day of appointments. Roleplay, review your scores, and log calls from anywhere.',
	},
	{
		id: 'sales-contact',
		question: 'How do I contact sales?',
		answer:
			'Book a 30-minute demo with Taylor, our Head of Growth, at calendly.com/taylor-closercoach/demo. For business propositions or custom integrations, use the Intercom widget at the bottom right of this page or email hello@closercoach.ai.',
	},
]

/* ── Accordion item ── */

type AccordionItemProps = {
	faq: FAQItem
	index: number
	isOpen: boolean
	onToggle: () => void
}

/**
 * @description Single accordion row with numbered marker, question button,
 * and animated answer panel. Button handles aria-expanded + aria-controls.
 * Panel uses AnimatePresence so the height animates cleanly open/closed.
 */
function AccordionItem({ faq, index, isOpen, onToggle }: AccordionItemProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const panelId = useId()
	const buttonId = useId()
	const numberStr = String(index + 1).padStart(2, '0')

	return (
		<div
			className={`relative border-t border-cc-surface-border transition-colors duration-300 ${
				isOpen ? 'border-cc-accent/40' : ''
			}`}
		>
			{/* AB rim glow on open — subtle emerald halo on top + bottom edges */}
			{isOpen && (
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cc-accent/40 to-transparent'
				/>
			)}

			<h3>
				<button
					id={buttonId}
					type='button'
					onClick={onToggle}
					aria-expanded={isOpen}
					aria-controls={panelId}
					className='group flex w-full items-start gap-4 py-6 text-left outline-none transition-colors duration-200 hover:text-white focus-visible:text-white md:gap-6 md:py-7'
				>
					<span
						aria-hidden='true'
						className='shrink-0 pt-1 font-[family-name:var(--font-mono)] text-[10px] font-medium tracking-[0.15em] text-cc-accent md:text-[11px]'
					>
						[{numberStr}]
					</span>
					<span
						className={`flex-1 text-base font-medium leading-snug transition-colors duration-200 md:text-lg ${
							isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'
						}`}
					>
						{faq.question}
					</span>
					<motion.span
						aria-hidden='true'
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
						className='shrink-0 pt-0.5 text-cc-text-muted transition-colors duration-200 group-hover:text-cc-accent'
					>
						<CaretDown size={18} weight='bold' />
					</motion.span>
				</button>
			</h3>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						id={panelId}
						role='region'
						aria-labelledby={buttonId}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={
							prefersReducedMotion
								? { duration: 0 }
								: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
						}
						className='overflow-hidden'
					>
						<div className='flex gap-4 pb-7 md:gap-6 md:pb-8'>
							<span aria-hidden='true' className='w-[26px] shrink-0 md:w-[34px]' />
							<p className='flex-1 pr-6 text-sm leading-relaxed text-cc-text-secondary md:pr-10 md:text-base'>
								{faq.answer}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

/* ── Main section ── */

/**
 * @description S7 FAQ section. Dark surface. 12-question accordion with
 * AA numbered markers and AC billboard corner label. First question open
 * by default. Single-open model (opening one closes the others), which
 * keeps the reading focus tight and the vertical rhythm honest.
 */
export default function SectionFAQ(): ReactElement {
	const [openId, setOpenId] = useState<string | null>(FAQS[0].id)
	const sectionRef = useRef<HTMLElement | null>(null)
	const headerRef = useRef<HTMLDivElement | null>(null)
	const listRef = useRef<HTMLDivElement | null>(null)
	const headerInView = useInView(headerRef, { once: true, margin: '-15% 0px' })
	const listInView = useInView(listRef, { once: true, margin: '-10% 0px' })
	const prefersReducedMotion = useReducedMotion()

	const handleToggle = (id: string): void => {
		setOpenId((current) => (current === id ? null : id))
	}

	return (
		<section
			ref={sectionRef}
			id='faq'
			data-surface='dark-faq'
			className='relative overflow-hidden bg-cc-foundation py-24 md:py-32'
		>
			{/* Minimal atmosphere — very soft emerald haze at center */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0'
				style={{
					background:
						'radial-gradient(ellipse 80vw 45% at 50% 40%, rgba(16,185,129,0.02) 0%, transparent 70%)',
				}}
			/>

			{/* AC billboard corner label — FAQ rotated -90deg in left margin. Desktop only. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute left-0 top-0 hidden h-full items-center lg:flex'
				style={{ width: 'clamp(120px, 18vw, 260px)' }}
			>
				<span
					className='block select-none whitespace-nowrap leading-none text-white'
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(160px, 20vw, 300px)',
						transform: 'rotate(-90deg)',
						transformOrigin: 'center center',
						opacity: 0.06,
						letterSpacing: '-0.04em',
					}}
				>
					FAQ
				</span>
			</div>

			<div className='relative z-10 mx-auto max-w-3xl px-6'>
				{/* ── Header ── */}
				<motion.div
					ref={headerRef}
					initial={{ opacity: 0, y: 18 }}
					animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
					}
					className='mb-12 flex flex-col items-center gap-4 text-center md:mb-16'
				>
					<span className='font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-cc-accent'>
						Questions closers ask before they start
					</span>
					<h2
						className='display-lg max-w-2xl text-white'
						style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.08 }}
					>
						The{' '}
						<em className='not-italic'>
							<span className='italic text-cc-accent'>honest</span>
						</em>{' '}
						answers.
					</h2>
				</motion.div>

				{/* ── Accordion list ── */}
				<motion.div
					ref={listRef}
					initial={{ opacity: 0, y: 12 }}
					animate={listInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }
					}
					className='border-b border-cc-surface-border'
				>
					{FAQS.map((faq, i) => (
						<AccordionItem
							key={faq.id}
							faq={faq}
							index={i}
							isOpen={openId === faq.id}
							onToggle={() => handleToggle(faq.id)}
						/>
					))}
				</motion.div>
			</div>
		</section>
	)
}
