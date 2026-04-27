/** @fileoverview Step 1 Plan mobile visual — derived from the new PlanVisual
 * composition (desktop Figma 40:1192), condensed into a vertical stack.
 *
 * Not desktop parity. Carries forward the key beats of the desktop moment:
 *   1. TODAY'S MEETINGS calendar block — Sarah Chen (active, emerald strip)
 *      and Marcus Rivera (dim). Two cards stacked vertically; the same
 *      meeting-card grammar the desktop uses.
 *   2. Downward emerald connector dot-line-dot glyph, echoing the horizontal
 *      Connector on desktop (pulled vertical for mobile flow).
 *   3. AI Clone reveal card — header shows "CLONED 7/7" with 7-segment bar
 *      that fills on viewport entry, then 4 short fields in a 2-col grid
 *      (Job/Credit Score/HHI/Decision Maker) followed by 3 long-form rows
 *      (Likely Objection/How to Handle/Buyer Signal). All values sourced
 *      from `CLONE_CARD` constant for one-place editability.
 *
 * Width: fits inside 358px viewport (390 minus 16*2 padding) without overflow.
 *
 * Motion: card entrance fade-up, connector dash draws, clone card reveals
 * after the meetings, progress bars fill in sequence. Reduced-motion
 * collapses to the settled frame via transition.duration: 0. */

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Calendar, Sparkle, SpinnerGap } from '@phosphor-icons/react'
import { CLONE_CARD } from '@/lib/constants'

const SARAH_AVATAR = '/images/step1/avatar-sarah-v2.png'
const MARCUS_AVATAR = '/images/step1/avatar-marcus-face.png'

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

/* Emerald accent in the form SVG attrs + motion JS literals can consume.
 * Mirrors `--cc-accent` (#10B981) but the Tailwind token can't be applied to
 * `fill` / `stroke` SVG attrs or `animate={{ backgroundColor }}` literals — so
 * we promote the hex to a single source of truth here. */
const EMERALD = '#10B981'

function MeetingCard({ name, time, avatarSrc, active = false, inView, reduced, delay }: {
	name: string
	time: string
	avatarSrc: string
	active?: boolean
	inView: boolean
	reduced: boolean
	delay: number
}) {
	return (
		<motion.div
			className={`flex w-full items-stretch gap-2 rounded-xl border bg-cc-surface-card p-2 shadow-[-6px_6px_12px_0_rgba(0,0,0,0.5),0_0_16px_0_rgba(16,185,129,0.05)] ${
				active ? 'border-white/10' : 'border-white/[0.08] opacity-45'
			}`}
			initial={{ opacity: 0, y: 10 }}
			animate={inView ? { opacity: active ? 1 : 0.28, y: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE, delay }}
		>
			{active && (
				<span aria-hidden='true' className='w-[3px] shrink-0 self-stretch rounded-full bg-cc-accent' />
			)}
			<div className='flex flex-1 items-center gap-2.5'>
				<div className='relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
					<Image src={avatarSrc} alt='' fill sizes='28px' className='object-cover' aria-hidden='true' unoptimized />
				</div>
				<div className='flex min-w-0 flex-1 flex-col gap-1'>
					<span className='text-trim truncate text-[13px] font-semibold leading-none text-[#EBEBEB]'>{name}</span>
					<span className='text-trim truncate text-[11px] leading-none text-white/50'>{time}</span>
				</div>
			</div>
		</motion.div>
	)
}

function CalendarBlock({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div className='flex w-full flex-col gap-2'>
			<div className='flex items-center gap-2'>
				<span className='flex h-6 w-6 items-center justify-center rounded-[4px] bg-cc-accent/10' aria-hidden='true'>
					<Calendar size={14} weight='duotone' className='text-cc-accent' />
				</span>
				<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-white/80'>
					Today&rsquo;s Meetings
				</span>
			</div>
			<div className='flex flex-col gap-2'>
				<MeetingCard
					name='Sarah Chen'
					time='10:30am'
					avatarSrc={SARAH_AVATAR}
					active
					inView={inView}
					reduced={reduced}
					delay={0.1}
				/>
				<MeetingCard
					name='Marcus Rivera'
					time='2:00pm'
					avatarSrc={MARCUS_AVATAR}
					inView={inView}
					reduced={reduced}
					delay={0.25}
				/>
			</div>
		</div>
	)
}

function Connector({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div className='flex h-8 w-full items-center justify-center' aria-hidden='true'>
			<svg width='6' height='32' viewBox='0 0 6 32' className='overflow-visible'>
				<circle cx='3' cy='3' r='3' fill={EMERALD} />
				<motion.line
					x1='3'
					y1='4'
					x2='3'
					y2='28'
					stroke={EMERALD}
					strokeOpacity='0.85'
					strokeWidth='2'
					strokeLinecap='round'
					initial={{ pathLength: 0 }}
					animate={inView ? { pathLength: 1 } : undefined}
					transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.5 }}
				/>
				<motion.circle
					cx='3'
					cy='29'
					r='3'
					fill={EMERALD}
					initial={{ opacity: 0, scale: 0.6 }}
					animate={inView ? { opacity: 1, scale: 1 } : undefined}
					transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 22, delay: 1.05 }}
				/>
			</svg>
		</div>
	)
}

/* Mobile cloning header — fills 7/7 in sequence on viewport entry. Wave C
 * (R-09) will refine the timing as part of the cinematic motion sequence. */
function CloneHeader({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	const total = 7
	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-1'>
					<SpinnerGap
						size={14}
						weight='bold'
						className='text-cc-accent'
						aria-hidden='true'
					/>
					<span className='text-trim font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-cc-accent'>
						Cloned
					</span>
				</div>
				<div className='flex items-baseline tabular-nums'>
					<span className='text-trim text-[12px] font-semibold leading-none text-cc-accent'>{total}</span>
					<span className='text-trim text-[11px] leading-none tracking-[0.06em] text-cc-text-secondary'>/{total}</span>
				</div>
			</div>
			<div className='flex h-[3px] w-full items-start gap-1' aria-hidden='true'>
				{Array.from({ length: total }).map((_, i) => (
					<motion.span
						key={i}
						className='h-full min-w-px flex-1 rounded-full'
						initial={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
						animate={inView ? { backgroundColor: EMERALD } : undefined}
						transition={reduced
							? { duration: 0 }
							: { duration: 0.3, ease: EASE, delay: 1.1 + i * 0.1 }
						}
					/>
				))}
			</div>
		</div>
	)
}

/* Short field — used in 2-col grid for the 4 short B2C values. */
function FieldShort({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex min-w-0 flex-col gap-1'>
			<span className='text-trim truncate font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.05em] text-cc-text-secondary'>
				{label}
			</span>
			<span className='text-trim truncate text-[12px] leading-[14px] text-white'>{value}</span>
		</div>
	)
}

/* Long field — full-width row for sentence-length values. */
function FieldLong({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex flex-col gap-1'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[12px] tracking-[0.05em] text-cc-text-secondary'>
				{label}
			</span>
			<span className='text-trim text-balance text-[11px] leading-[15px] text-white/95'>{value}</span>
		</div>
	)
}

function ProofBadge() {
	return (
		<div className='inline-flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-foundation px-2.5 py-1 shadow-[0_0_12px_rgba(16,185,129,0.25)]'>
			<Sparkle size={9} weight='fill' className='text-cc-accent' aria-hidden='true' />
			<span className='text-trim whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase leading-none tracking-[0.04em] text-cc-accent'>
				7 Layers of Personalization
			</span>
		</div>
	)
}

function CloneCard({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	const shortFields = CLONE_CARD.fields.filter((f) => f.span === 'short')
	const longFields = CLONE_CARD.fields.filter((f) => f.span === 'long')
	return (
		<motion.div
			className='relative w-full rounded-2xl border-[0.5px] border-cc-accent/60 bg-cc-surface-card px-3 pb-7 pt-3 shadow-[-6px_6px_12px_0_rgba(0,0,0,0.5),0_0_16px_0_rgba(16,185,129,0.08)]'
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 1.1 }}
		>
			<div className='flex flex-col gap-3'>
				<CloneHeader inView={inView} reduced={reduced} />

				{/* Avatar + name + AI Clone badge */}
				<div className='flex items-center gap-2.5'>
					<div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
						<Image src={SARAH_AVATAR} alt='Sarah Chen portrait' fill sizes='36px' className='object-cover' unoptimized />
					</div>
					<span className='text-trim flex-1 truncate font-[family-name:var(--font-heading)] text-[14px] font-bold leading-[16px] text-white'>
						{CLONE_CARD.name}
					</span>
					<span className='text-trim inline-flex items-center rounded-md border border-cc-accent/30 bg-cc-accent/15 px-1.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase leading-none tracking-[0.06em] text-cc-accent'>
						AI Clone
					</span>
				</div>

				{/* 2-col short fields */}
				<div className='grid grid-cols-2 gap-x-3 gap-y-3'>
					{shortFields.map((f) => (
						<FieldShort key={f.label} label={f.label} value={f.value} />
					))}
				</div>

				{/* Stack of long fields */}
				<div className='flex flex-col gap-2.5'>
					{longFields.map((f) => (
						<FieldLong key={f.label} label={f.label} value={f.value} />
					))}
				</div>
			</div>

			<div className='absolute -bottom-[11px] left-1/2 -translate-x-1/2'>
				<ProofBadge />
			</div>
		</motion.div>
	)
}

export default function StepOneMobileVisual() {
	const reduced = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.4, once: true })

	return (
		<div
			ref={ref}
			aria-hidden='true'
			className='flex w-full flex-col items-stretch'
		>
			<CalendarBlock inView={inView} reduced={reduced} />
			<Connector inView={inView} reduced={reduced} />
			<CloneCard inView={inView} reduced={reduced} />
		</div>
	)
}
