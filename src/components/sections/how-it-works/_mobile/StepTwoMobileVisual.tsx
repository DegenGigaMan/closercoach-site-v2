/** @fileoverview Step 2 Practice mobile visual — derived from the new
 * StepTwoVisual composition (desktop Figma 40:1202), condensed into a
 * vertical stack.
 *
 * Not desktop parity. Carries forward the key beats:
 *   1. Compact AI Clone card — Sarah headshot + "CLOSING A DEAL" chip +
 *      objection quote + Medium difficulty meter.
 *   2. ROLEPLAY SESSION header with user icon + hairline.
 *   3. Two chat bubbles (one AI, one user) with a "Great Response"
 *      coaching chip over the user reply.
 *   4. Bottom bar: 39% interest gauge + mic + audio waveform + 02:34 timer.
 *
 * The 4-bubble cascade from desktop is trimmed to 2 on mobile so the stack
 * stays inside a reasonable fold. All vocabulary — colors, type scale, card
 * recipes, coaching chip treatment — is lifted from StepTwoVisual.
 *
 * Motion: card entrance fade-up, bubbles stagger in, coaching chip pops,
 * gauge fill animates, waveform bars breathe. Reduced-motion collapses to
 * the settled frame via transition.duration: 0. */

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { PhoneCall, User, Microphone, CheckCircle } from '@phosphor-icons/react'

const SARAH_AVATAR = '/images/step2/avatar-sarah.png'
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

/* Compact waveform — fewer bars than desktop for mobile width. */
const WAVE_BARS: ReadonlyArray<readonly [number, number]> = [
	[2, 0.3], [4, 0.5], [7, 0.6], [13, 0.8], [7, 0.5], [11, 0.8],
	[6, 0.5], [9, 0.6], [13, 0.8], [6, 0.5], [8, 0.6], [4, 0.4],
	[10, 0.7], [6, 0.5], [3, 0.3],
] as const

function CloneCard({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<motion.div
			className='relative w-full'
			initial={{ opacity: 0, y: 10 }}
			animate={inView ? { opacity: 1, y: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
		>
			<div
				className='absolute -top-[14px] left-2 z-0 inline-flex items-center gap-1.5 rounded-t-[6px] border border-cc-accent/20 border-b-0 px-2 pt-1.5 pb-5'
				style={{ backgroundColor: '#0C2822' }}
				aria-hidden='true'
			>
				<span className='font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-cc-mint'>
					AI Clone
				</span>
			</div>

			<div
				className='relative z-10 flex flex-col gap-3 rounded-[12px] border border-white/[0.10] bg-cc-surface-card p-3'
				style={{
					boxShadow:
						'-6px 6px 12px 0px rgba(0,0,0,0.55), 0px 0px 16px 0px rgba(16,185,129,0.05)',
				}}
			>
				<div className='flex items-center gap-2.5'>
					<div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/[0.05]'>
						<Image src={SARAH_AVATAR} alt='' fill sizes='36px' className='object-cover' aria-hidden='true' />
					</div>
					<div className='flex flex-col gap-0.5'>
						<span className='text-[13px] leading-none text-[#EBEBEB]'>Sarah Chen</span>
						<span className='text-[11px] leading-none text-white/50'>VP Operations</span>
					</div>
				</div>

				<div
					className='inline-flex items-center gap-1.5 self-start rounded-[6px] border border-white/[0.05] px-2 py-1'
					style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
				>
					<PhoneCall size={12} weight='regular' className='text-[#B3BECE]' aria-hidden='true' />
					<span className='text-[9px] font-medium uppercase leading-none text-[#B3BECE]'>
						Closing a deal
					</span>
				</div>

				<p className='text-[15px] leading-[1.45] text-white'>
					&ldquo;Why switch from our solution to yours?&rdquo;
				</p>

				<div className='flex items-center gap-2.5'>
					<span className='text-[10px] leading-none text-cc-amber'>Medium</span>
					<div className='flex h-[5px] w-[100px] items-start gap-1' aria-hidden='true'>
						{[0, 1, 2, 3, 4].map((i) => {
							const filled = i < 3
							const base = i < 2 ? 'h-[5px] w-[16px] shrink-0 rounded-full' : 'h-[5px] flex-1 min-w-px rounded-full'
							return (
								<div
									key={i}
									className={base}
									style={{ backgroundColor: filled ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}
								/>
							)
						})}
					</div>
				</div>
			</div>
		</motion.div>
	)
}

function AiBubble({ lines, inView, reduced, delay }: {
	lines: readonly string[]
	inView: boolean
	reduced: boolean
	delay: number
}) {
	return (
		<motion.div
			className='flex items-end gap-1.5'
			initial={{ opacity: 0, x: -6 }}
			animate={inView ? { opacity: 1, x: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE, delay }}
		>
			<div className='relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-white/[0.05]'>
				<Image src={SARAH_AVATAR} alt='' fill sizes='16px' className='object-cover' aria-hidden='true' />
			</div>
			<div className='rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] border border-white/[0.06] bg-cc-surface-card px-2.5 py-2'>
				{lines.map((line, i) => (
					<p key={i} className='text-[11.5px] font-light leading-[1.4] text-white/80'>
						{line}
					</p>
				))}
			</div>
		</motion.div>
	)
}

function UserBubble({ lines, inView, reduced, delay }: {
	lines: readonly string[]
	inView: boolean
	reduced: boolean
	delay: number
}) {
	return (
		<motion.div
			className='flex w-full flex-col items-end pt-4'
			initial={{ opacity: 0, x: 6 }}
			animate={inView ? { opacity: 1, x: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE, delay }}
		>
			<div
				className='relative max-w-[85%] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] border border-white/[0.06] px-2.5 py-2'
				style={{ backgroundColor: '#0099FF' }}
			>
				<motion.div
					className='absolute -left-1.5 -top-[14px] inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-cc-surface-card pl-1.5 pr-2 py-[3px]'
					style={{ boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)' }}
					initial={{ opacity: 0, scale: 0.85 }}
					animate={inView ? { opacity: 1, scale: 1 } : undefined}
					transition={reduced
						? { duration: 0 }
						: { type: 'spring', stiffness: 460, damping: 22, delay: delay + 0.3 }
					}
				>
					<CheckCircle size={9} weight='fill' className='text-cc-mint' aria-hidden='true' />
					<span className='text-[10px] font-medium leading-none text-cc-mint'>
						Great Response
					</span>
				</motion.div>
				{lines.map((line, i) => (
					<p key={i} className='text-[11.5px] leading-[1.4] text-white'>
						{line}
					</p>
				))}
			</div>
		</motion.div>
	)
}

function InterestGauge({ value, inView, reduced }: { value: number; inView: boolean; reduced: boolean }) {
	const pct = value / 100
	const radius = 22
	const arcLength = Math.PI * radius
	return (
		<div className='relative h-[36px] w-[64px] shrink-0'>
			<svg viewBox='0 0 64 36' className='absolute inset-0 h-full w-full' aria-hidden='true'>
				<defs>
					<linearGradient id='cc-s3-step2-mobile-gauge' x1='0%' y1='0%' x2='100%' y2='0%'>
						<stop offset='0%' stopColor='#F59E0B' />
						<stop offset='100%' stopColor='#10B981' />
					</linearGradient>
				</defs>
				<path
					d='M 10 30 A 22 22 0 0 1 54 30'
					fill='none'
					stroke='rgba(255,255,255,0.12)'
					strokeWidth={3}
					strokeLinecap='round'
				/>
				<motion.path
					d='M 10 30 A 22 22 0 0 1 54 30'
					fill='none'
					stroke='url(#cc-s3-step2-mobile-gauge)'
					strokeWidth={3}
					strokeLinecap='round'
					strokeDasharray={`${arcLength} ${arcLength}`}
					initial={{ strokeDashoffset: arcLength }}
					animate={inView ? { strokeDashoffset: arcLength * (1 - pct) } : undefined}
					transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE, delay: 0.5 }}
				/>
			</svg>
			<div className='absolute inset-x-0 bottom-[1px] flex flex-col items-center gap-[1px]'>
				<span className='font-[family-name:var(--font-heading)] text-[15px] leading-none text-white'>
					{value}
				</span>
				<span className='font-[family-name:var(--font-mono)] text-[7px] uppercase leading-none tracking-[0.1em] text-white/50'>
					Interest
				</span>
			</div>
		</div>
	)
}

function AudioBar({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div
			className='flex flex-1 items-center justify-between rounded-full border border-white/[0.08] bg-cc-surface-card/50 px-1.5 py-1'
			style={{ boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.5)' }}
		>
			<div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cc-accent/10'>
				<Microphone size={12} weight='regular' className='text-cc-accent' aria-hidden='true' />
			</div>

			<div className='mx-2 flex flex-1 items-center justify-center gap-[1.5px]' aria-hidden='true'>
				{WAVE_BARS.map(([h, o], i) => {
					const phase = (i * 137) % 360
					return (
						<motion.span
							key={i}
							className='shrink-0 rounded-full bg-cc-accent'
							style={{ width: '1.5px', height: `${h}px` }}
							initial={{ opacity: o }}
							animate={inView && !reduced ? { opacity: [o * 0.6, o, o * 0.6] } : { opacity: o }}
							transition={reduced
								? { duration: 0 }
								: {
									duration: 1.6,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: (phase / 360) * 1.6,
								}
							}
						/>
					)
				})}
			</div>

			<div className='flex shrink-0 items-center gap-1'>
				<motion.span
					className='h-1 w-1 rounded-full bg-cc-score-red'
					aria-hidden='true'
					animate={inView && !reduced ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
					transition={reduced
						? { duration: 0 }
						: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
					}
				/>
				<span className='font-[family-name:var(--font-mono)] text-[9px] font-medium leading-none text-white/80'>
					02:34
				</span>
			</div>
		</div>
	)
}

function RoleplayStack({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center gap-2'>
				<span className='flex items-center rounded bg-cc-accent/10 p-1' aria-hidden='true'>
					<User size={12} weight='regular' className='text-cc-accent' />
				</span>
				<span className='font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-white/80'>
					Roleplay session
				</span>
			</div>

			<AiBubble
				lines={['Thanks for reaching out.', 'We already have a solution in place.']}
				inView={inView}
				reduced={reduced}
				delay={0.15}
			/>
			<UserBubble
				lines={['I hear you. Can I ask what\u2019s', 'working with your current setup?']}
				inView={inView}
				reduced={reduced}
				delay={0.6}
			/>

			<div className='mt-1 flex items-center gap-2.5'>
				<InterestGauge value={39} inView={inView} reduced={reduced} />
				<AudioBar inView={inView} reduced={reduced} />
			</div>
		</div>
	)
}

export default function StepTwoMobileVisual() {
	const reduced = useReducedMotion() ?? false
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { amount: 0.35, once: true })

	return (
		<motion.div
			ref={ref}
			aria-hidden='true'
			className='flex w-full flex-col gap-4 overflow-hidden rounded-[20px] border border-white/[0.08] p-3.5'
			style={{
				backgroundImage:
					'radial-gradient(ellipse 100% 110% at 50% 50%, rgba(30,34,48,0.85) 0%, rgba(21,24,34,0.92) 55%, rgba(12,14,19,0.95) 100%)',
			}}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.55, ease: EASE }}
		>
			<div className='pt-3'>
				<CloneCard inView={inView} reduced={reduced} />
			</div>
			<RoleplayStack inView={inView} reduced={reduced} />
		</motion.div>
	)
}
