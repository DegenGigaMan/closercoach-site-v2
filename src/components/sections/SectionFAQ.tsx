/** @fileoverview S7 FAQ — restyled 2026-04-23 to Figma node 1:5217.
 *
 * Composition:
 *   1. Centered header stack (gap-[15px]): emerald overline + Lora Bold title
 *      at 48px / leading-[52.8px] + Inter subhead at 16px / leading-[24px].
 *   2. 64px gap to accordion.
 *   3. Accordion items rendered as rounded-[24px] pills with translucent card
 *      fill rgba(30,34,48,0.15) and hairline border rgba(255,255,255,0.06).
 *      12px gap between items. Max width 720px per Figma.
 *   4. Open panel expands inline; a chevron rotates 180°.
 *
 * Styling ports verbatim from Figma; copy block is Figma's ("Questions,
 * answered" / "Frequently asked questions" / "Everything you need to know
 * before you download"). The 12 Q+A entries are preserved from the prior
 * proof-dense v2 source.
 *
 * Dropped from the v2 original: billboard "FAQ" rotated corner label, the
 * [01]-[12] numbered mono markers, the italic-emerald "honest" emphasis,
 * and the horizontal rule separator model. These were replaced by the
 * individual pill treatment shown in the Figma.
 *
 * Accordion: native <button> + aria-expanded + aria-controls + hidden panel.
 * Single-open model. Keyboard a11y via button semantics. Motion: height +
 * opacity on panel, spring. Stable initial props (F42 safe). */

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
			'SOC2 Type II compliant, GDPR ready, with SSO, SAML, role-based access control, audit logging, and data residency options on Enterprise plans. Trusted by enterprise teams at State Farm, Land Rover, Sunrun, RE/MAX, Toyota, and Fidelity. Calls are encrypted in transit and at rest. Your data is yours and is never used to train models for other customers.',
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
		question: 'How do I book a demo?',
		answer:
			'Book a 30-minute demo with Taylor, our Head of Growth, at calendly.com/taylor-closercoach/demo. For business propositions or custom integrations, use the Intercom widget at the bottom right of this page or email hello@closercoach.ai.',
	},
]

/* ── Accordion item ── */

type AccordionItemProps = {
	faq: FAQItem
	isOpen: boolean
	onToggle: () => void
}

/**
 * @description Single accordion pill. Figma 1:5223 contract: bg
 * rgba(30,34,48,0.15), border rgba(255,255,255,0.06), rounded-[24px].
 * Trigger is 66-68px tall; open panel grows inline with a height +
 * opacity spring.
 */
function AccordionItem({ faq, isOpen, onToggle }: AccordionItemProps): ReactElement {
	const prefersReducedMotion = useReducedMotion()
	const panelId = useId()
	const buttonId = useId()

	return (
		<div
			className='rounded-[24px] border border-white/[0.06] bg-[rgba(30,34,48,0.15)] transition-colors duration-300'
		>
			<h3>
				<button
					id={buttonId}
					type='button'
					onClick={onToggle}
					aria-expanded={isOpen}
					aria-controls={panelId}
					className='group flex w-full items-center gap-4 rounded-[24px] px-6 py-[21px] text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-cc-accent/60'
				>
					<span
						className='text-trim flex-1 text-[16px] leading-[24px] text-white transition-colors duration-200'
						style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
					>
						{faq.question}
					</span>
					<motion.span
						aria-hidden='true'
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
						className='shrink-0 text-white/60 transition-colors duration-200 group-hover:text-cc-accent'
					>
						<CaretDown size={16} weight='regular' />
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
						<p
							className='text-trim px-6 pb-6 pr-8 text-[14px] text-cc-text-secondary'
							style={{ lineHeight: '22.75px' }}
						>
							{faq.answer}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

/* ── Main section ── */

/**
 * @description S7 FAQ. Figma-styled header (emerald overline + Lora Bold
 * title + Inter subhead) over a column of translucent rounded-[24px]
 * accordion pills. Single-open model. First question open by default to
 * demonstrate answer depth.
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
			{/* Soft emerald haze per prior atmosphere spec — kept for dark-surface depth. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0'
				style={{
					background:
						'radial-gradient(ellipse 80vw 45% at 50% 40%, rgba(16,185,129,0.02) 0%, transparent 70%)',
				}}
			/>

			{/* Wave I FIX-08: bumped max-w-[720px] → max-w-4xl (~896px). The
			    original Figma 720px spec assumed a sidebar of category filters
			    that this FAQ doesn't carry. As an orphan single column at 1440,
			    720px reads as a narrow strip. 896px keeps the editorial column
			    rhythm without going wide enough to hurt accordion readability. */}
			<div className='relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-16 px-6'>
				{/* ── Header (Figma 1:5218) ── */}
				<motion.div
					ref={headerRef}
					initial={{ opacity: 0, y: 18 }}
					animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }
					}
					/* Q17 Wave D1-8 (Andy 2026-04-29 #21): label → heading →
					 * subhead gap was 15px which Andy flagged as too tight.
					 * Bumped to gap-8 (32px) so each line gets clear vertical
					 * separation matching the step section header rhythm. */
					className='flex flex-col items-center gap-8 text-center'
				>
					<p
						className='text-trim font-semibold uppercase text-cc-accent'
						style={{
							fontFamily: 'var(--font-sans)',
							fontSize: '12px',
							lineHeight: '16px',
							letterSpacing: '0.96px',
						}}
					>
						Questions, answered
					</p>
					<h2
						className='text-trim text-white'
						style={{
							fontFamily: 'var(--font-heading)',
							fontWeight: 700,
							fontSize: 'clamp(32px, 5vw, 48px)',
							lineHeight: 1.1,
						}}
					>
						Frequently asked questions
					</h2>
					<p
						className='text-trim text-cc-text-secondary'
						style={{
							fontFamily: 'var(--font-sans)',
							fontSize: '16px',
							lineHeight: '24px',
						}}
					>
						Everything you need to know before you download.
					</p>
				</motion.div>

				{/* ── Accordion list (Figma 1:5222) ── */}
				<motion.div
					ref={listRef}
					initial={{ opacity: 0, y: 12 }}
					animate={listInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
					}
					className='flex w-full flex-col gap-3'
				>
					{FAQS.map((faq) => (
						<AccordionItem
							key={faq.id}
							faq={faq}
							isOpen={openId === faq.id}
							onToggle={() => handleToggle(faq.id)}
						/>
					))}
				</motion.div>
			</div>
		</section>
	)
}
