/** @fileoverview S3 Step 2 Practice right-column visual.
 *
 * Composition mapped from Figma node 40:1211. Renders directly inside the
 * shared StepCanvas (which provides the outer rounded container + radial
 * gradient backdrop), so this file contributes only the two-column layout
 * plus motion:
 *   - Left (213px): "AI Clone" tab badge + clone card with Sarah Chen
 *     portrait, "CLOSING A DEAL" chip, objection quote, Medium difficulty
 *     meter.
 *   - Right: vertical timeline (user icon + hairline) flanking a
 *     "ROLEPLAY SESSION" chat column with 4 alternating bubbles
 *     (AI grey / user blue), coaching chips ("Great Response" / "Missed
 *     The Mark"), a "Get suggested responses" pill, and a bottom bar with
 *     a tick-style 39% interest gauge + audio waveform + 02:34 timer.
 *
 * Prior revision wrapped the whole composition in a second rounded
 * container, producing a visible double-frame against StepCanvas. That
 * container is removed here so StepCanvas is the sole frame.
 *
 * Motion: bubbles stagger in, coaching chips pop after their bubble
 * settles, waveform bars breathe, the suggested responses pill pulses
 * in settled, the interest gauge tick-segments light up in sequence, the
 * indicator dot travels to the reading, and the center number counts
 * from 0 to 39. Reduced-motion collapses to the settled frame. */

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useReducedMotion, useMotionValue, useTransform, animate } from 'motion/react'
import { useEffect, useState } from 'react'
import {
	PhoneCall,
	User,
	Microphone,
	PencilSimple,
	CheckCircle,
	XCircle,
} from '@phosphor-icons/react'

const SARAH_AVATAR = '/images/step2/avatar-sarah.png'

/* Audio waveform bar ladder. Heights and opacities mirror the Figma pattern
 * at node 40:1211, visually approximating an active voice capture. */
const WAVE_BARS: ReadonlyArray<readonly [number, number]> = [
	[2, 0.3], [2, 0.3], [4, 0.5], [6.9, 0.6], [15.3, 0.8], [7.0, 0.6], [4.2, 0.5],
	[9.8, 0.6], [13.9, 0.8], [6.9, 0.5], [13.7, 0.8], [9.5, 0.6], [4.0, 0.3],
	[9.1, 0.6], [6.4, 0.5], [6.2, 0.5], [10.8, 0.8], [7.0, 0.5], [9.0, 0.6],
	[11.9, 0.8], [6.2, 0.5], [6.2, 0.5], [7.9, 0.5], [10.4, 0.8], [8.1, 0.6],
	[6.8, 0.5], [4.9, 0.3], [7.9, 0.5], [4.0, 0.3], [2, 0.3], [2, 0.3],
] as const

/* Sequence delays (seconds) relative to inView. Coaching chips piggyback on
 * user-message delays via +0.35s. Gauge fill begins at first AI message. */
const DELAY = {
	ai1: 0.25,
	user1: 0.85,
	ai2: 1.5,
	user2: 2.1,
	pill: 2.75,
	gaugeStart: 0.25,
} as const

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

/* ─── AI Clone Card (left column) ─────────────────────────── */

function CloneCard() {
	return (
		<div className='relative w-[213px] shrink-0'>
			{/* Clone tab badge — Figma 40:1482. 84 × 43 positioned at (0, -27.5)
			 * relative to the card. Inner padding pl-[9px] pr-[9px] pt-[9px]
			 * pb-[25px]; the 25px bottom padding tucks the badge's lower 25px
			 * behind the card's top edge for the overlapping-tab silhouette. */}
			<div
				className='absolute -top-[27px] left-0 z-0 inline-flex items-center gap-1.5 rounded-t-[8px] border border-cc-accent/20 border-b-0 px-[9px] pt-[9px] pb-[25px]'
				style={{ backgroundColor: '#0C2822' }}
				aria-hidden='true'
			>
				<span className='font-[family-name:var(--font-mono)] text-[12px] font-semibold uppercase leading-none tracking-[0.1em] text-cc-mint'>
					AI Clone
				</span>
			</div>

			<div
				className='relative z-10 flex flex-col gap-4 rounded-[12px] border border-white/[0.10] bg-cc-surface-card p-[13px]'
				style={{
					boxShadow:
						'-8px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
				}}
			>
				{/* Figma 40:1447 — avatar 40×40 + name block with gap-[12px] between
				 * them. Name block per 40:1478 uses gap-[10px] between "Sarah Chen"
				 * (14px Inter Regular, leading-[20px]) and "VP Operations" (12px
				 * Inter Regular, white/50). */}
				<div className='flex items-center gap-3'>
					<div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/[0.05]'>
						<Image
							src={SARAH_AVATAR}
							alt=''
							fill
							sizes='40px'
							className='object-cover'
							aria-hidden='true'
						/>
					</div>
					<div className='flex flex-col gap-[10px] whitespace-nowrap'>
						<span className='text-[14px] leading-[20px] text-[#EBEBEB]'>
							Sarah Chen
						</span>
						<span className='text-[12px] leading-none text-white/50'>VP Operations</span>
					</div>
				</div>

				<div className='flex flex-col gap-6'>
					<div
						className='inline-flex items-center gap-1.5 self-start rounded-[8px] border border-white/[0.05] px-2 py-1.5'
						style={{
							backgroundColor: 'rgba(255,255,255,0.03)',
							boxShadow: '0px 4px 8px 0px rgba(17,17,17,0.2)',
						}}
					>
						<PhoneCall size={14} weight='regular' className='text-[#B3BECE]' aria-hidden='true' />
						<span className='font-[family-name:var(--font-sans)] text-[10px] font-medium uppercase leading-none text-[#B3BECE]'>
							Closing a deal
						</span>
					</div>

					<p className='text-[18px] leading-[1.6] text-white'>
						&ldquo;Why switch from our solution to yours?&rdquo;
					</p>

					{/* Figma 46:2444 — difficulty meter. 116px track width, 5 segments
					 * each 20×6 with gap-[4px] between, all fixed 20px (no flex-1
					 * growth). 3 filled amber + 2 unfilled white/15. */}
					<div className='flex items-center gap-3'>
						<span className='text-[10px] leading-[15px] text-cc-amber'>Medium</span>
						<div className='flex h-[6px] w-[116px] items-start gap-1' aria-hidden='true'>
							{[0, 1, 2, 3, 4].map((i) => {
								const filled = i < 3
								return (
									<div
										key={i}
										className='h-[6px] w-[20px] shrink-0 rounded-full'
										style={{ backgroundColor: filled ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}
									/>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Chat primitives ─────────────────────────────────────── */

function AiMessage({
	lines,
	delay,
	inView,
	reduced,
}: {
	lines: readonly string[]
	delay: number
	inView: boolean
	reduced: boolean
}) {
	return (
		<motion.div
			className='flex w-full items-end gap-2 pr-6'
			initial={{ opacity: 0, x: -8 }}
			animate={inView ? { opacity: 1, x: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE, delay }}
		>
			<div className='relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-white/[0.05]'>
				<Image src={SARAH_AVATAR} alt='' fill sizes='20px' className='object-cover' aria-hidden='true' />
			</div>
			<div className='rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] border border-white/[0.06] bg-cc-surface-card p-3'>
				{lines.map((line, i) => (
					<p
						key={i}
						className='whitespace-nowrap text-[14px] font-light leading-[1.4] text-white/80'
					>
						{line}
					</p>
				))}
			</div>
		</motion.div>
	)
}

function UserMessage({
	lines,
	chip,
	delay,
	inView,
	reduced,
}: {
	lines: readonly string[]
	chip: { tone: 'positive' | 'negative'; label: string }
	delay: number
	inView: boolean
	reduced: boolean
}) {
	const isPositive = chip.tone === 'positive'
	const chipColor = isPositive ? '#34E18E' : '#FF6467'
	const ChipIcon = isPositive ? CheckCircle : XCircle
	return (
		<motion.div
			className='flex w-full flex-col items-end pl-6 pt-5'
			initial={{ opacity: 0, x: 8 }}
			animate={inView ? { opacity: 1, x: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE, delay }}
		>
			<div
				className='relative rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] border border-white/[0.06] p-3'
				style={{ backgroundColor: '#0099FF' }}
			>
				<motion.div
					className='absolute -left-[9px] -top-[19px] inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-cc-surface-card pl-1.5 pr-3 py-1.5'
					style={{ boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)' }}
					initial={{ opacity: 0, scale: 0.85 }}
					animate={inView ? { opacity: 1, scale: 1 } : undefined}
					transition={reduced
						? { duration: 0 }
						: { type: 'spring', stiffness: 460, damping: 22, delay: delay + 0.35 }
					}
				>
					<ChipIcon size={10} weight='fill' style={{ color: chipColor }} aria-hidden='true' />
					<span
						className='font-[family-name:var(--font-sans)] text-[12px] font-medium leading-[15px]'
						style={{ color: chipColor }}
					>
						{chip.label}
					</span>
				</motion.div>
				{lines.map((line, i) => (
					<p
						key={i}
						className='whitespace-nowrap text-[14px] leading-[1.4] text-white'
					>
						{line}
					</p>
				))}
			</div>
		</motion.div>
	)
}

/* ─── Interest gauge (segmented arc per Figma 46:2533) ────────── */

/* Container width matches Figma's 80px exactly so the bar row resolves to
 * Figma's 288 total (80 gauge + 16 gap + 192 audio bar). Container height
 * bumped from Figma's 43.077 to 58 so the "39" + INTEREST stack has
 * breathing room below the arc baseline — the 43px version squeezed the
 * text into the arc's interior. The arc itself keeps Figma's geometry:
 * center at (40, 36), radius 32.55 (= (80 - 2×7.38)/2). */
const GAUGE = {
	w: 80,
	h: 58,
	cx: 40,
	cy: 36,
	r: 32.55,
	stroke: 6,
} as const

/* Segments expressed in math-degrees (0° = east, 180° = west). The arc
 * sweeps from 180° through 90° to 0°. Five 22.4°-wide segments separated
 * by 17° gaps cover the full 180° exactly. Gaps are intentionally wide
 * enough that the round stroke-linecaps (which each extend half a stroke-
 * width past the path) don't visually merge adjacent segments — matches
 * the Figma reference where each segment reads as a discrete pill. */
const SEGMENTS: ReadonlyArray<{ a1: number; a2: number; color: string }> = [
	{ a1: 180,   a2: 157.6, color: '#EF4444' }, // red
	{ a1: 140.6, a2: 118.2, color: '#FB923C' }, // orange
	{ a1: 101.2, a2: 78.8,  color: '#FACC15' }, // yellow
	{ a1: 61.8,  a2: 39.4,  color: '#A3E635' }, // lime
	{ a1: 22.4,  a2: 0,     color: '#10B981' }, // green
]

function polar(angleDeg: number, radius: number): [number, number] {
	const a = (angleDeg * Math.PI) / 180
	return [GAUGE.cx + radius * Math.cos(a), GAUGE.cy - radius * Math.sin(a)]
}

function arcPath(a1: number, a2: number): string {
	const [x1, y1] = polar(a1, GAUGE.r)
	const [x2, y2] = polar(a2, GAUGE.r)
	return `M ${x1} ${y1} A ${GAUGE.r} ${GAUGE.r} 0 0 1 ${x2} ${y2}`
}

function InterestGauge({ value, inView, reduced }: { value: number; inView: boolean; reduced: boolean }) {
	const pct = value / 100
	const [displayValue, setDisplayValue] = useState(0)
	const count = useMotionValue(0)
	const rounded = useTransform(count, (v) => Math.round(v))

	useEffect(() => {
		if (!inView) return
		if (reduced) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- short-circuit to final value under reduced motion
			setDisplayValue(value)
			return
		}
		const controls = animate(count, value, {
			duration: 1.3,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: DELAY.gaugeStart,
		})
		const unsub = rounded.on('change', (v) => setDisplayValue(v))
		return () => {
			controls.stop()
			unsub()
		}
	}, [inView, reduced, value, count, rounded])

	/* Indicator angle: 180° at value=0, 0° at value=100. */
	const indicatorAngle = 180 - 180 * pct
	const [indicatorX, indicatorY] = polar(indicatorAngle, GAUGE.r)
	const [startX, startY] = polar(180, GAUGE.r)

	return (
		<div className='relative h-[58px] w-[80px] shrink-0'>
			<svg
				viewBox={`0 0 ${GAUGE.w} ${GAUGE.h}`}
				className='absolute inset-0 h-full w-full overflow-visible'
				aria-hidden='true'
			>
				{SEGMENTS.map((seg, i) => (
					<motion.path
						key={i}
						d={arcPath(seg.a1, seg.a2)}
						fill='none'
						stroke={seg.color}
						strokeWidth={GAUGE.stroke}
						strokeLinecap='round'
						initial={{ opacity: 0, pathLength: 0 }}
						animate={inView ? { opacity: 1, pathLength: 1 } : undefined}
						transition={reduced
							? { duration: 0 }
							: {
								opacity: { duration: 0.25, delay: DELAY.gaugeStart + i * 0.11 },
								pathLength: { duration: 0.45, ease: EASE, delay: DELAY.gaugeStart + i * 0.11 },
							}
						}
					/>
				))}

				{/* Indicator per Figma 46:2543: 7.38 × 7.38 disc (r ≈ 3.69) with an
				 * 8.33% outer ring. Rendered as a white-filled circle with a dark
				 * stroke for definition against the arc. */}
				<motion.circle
					r={4}
					fill='#FFFFFF'
					stroke='#0D0F14'
					strokeWidth={1.5}
					initial={{ cx: startX, cy: startY, opacity: 0 }}
					animate={inView ? { cx: indicatorX, cy: indicatorY, opacity: 1 } : undefined}
					transition={reduced
						? { duration: 0 }
						: {
							opacity: { duration: 0.3, delay: DELAY.gaugeStart + 0.55 },
							cx: { duration: 1.2, ease: EASE, delay: DELAY.gaugeStart + 0.55 },
							cy: { duration: 1.2, ease: EASE, delay: DELAY.gaugeStart + 0.55 },
						}
					}
				/>
			</svg>
			{/* Value stack: Figma 46:2546 places "39" (Lora SemiBold 18px) with a
			 * 4.923px gap above "interest" (Geist Mono Regular 8px, tracking-0.8px,
			 * uppercase, white/50). Our Lora is locked Bold (CLAUDE.md) so the
			 * number renders a touch heavier than Figma's SemiBold. Bottom-
			 * anchored so the "39" sits just inside the arc baseline with the
			 * label trailing below. */}
			<div className='absolute inset-x-0 bottom-[4px] flex flex-col items-center gap-[4px]'>
				<span className='font-[family-name:var(--font-heading)] text-[20px] font-semibold leading-none text-white tabular-nums'>
					{displayValue}
				</span>
				<span
					className='font-[family-name:var(--font-mono)] text-[8px] uppercase leading-none text-white/50'
					style={{ letterSpacing: '0.8px' }}
				>
					Interest
				</span>
			</div>
		</div>
	)
}

/* ─── Audio bar (breathing waveform) ─────────────────────── */

function AudioBar({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div
			className='flex flex-1 items-center justify-between rounded-full border border-white/[0.08] px-[5px] py-[5px]'
			style={{
				backgroundColor: 'rgba(30,34,48,0.1)',
				boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.1)',
			}}
		>
			<div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cc-accent/10'>
				<Microphone size={16} weight='regular' className='text-cc-accent' aria-hidden='true' />
			</div>

			<div className='flex items-center gap-[1px] px-1' aria-hidden='true'>
				{WAVE_BARS.map(([h, o], i) => {
					const phase = (i * 137) % 360
					return (
						<motion.span
							key={i}
							className='shrink-0 rounded-full bg-cc-accent'
							style={{ width: '2px', height: `${h}px` }}
							initial={{ opacity: o }}
							animate={inView && !reduced
								? { opacity: [o * 0.6, o, o * 0.6] }
								: { opacity: o }
							}
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

			<div className='flex shrink-0 items-center gap-1 pr-1'>
				<motion.span
					className='h-1 w-1 rounded-full bg-cc-score-red'
					aria-hidden='true'
					animate={inView && !reduced ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
					transition={reduced
						? { duration: 0 }
						: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
					}
				/>
				<span className='font-[family-name:var(--font-mono)] text-[10px] font-medium leading-[16.5px] text-white/80'>
					02:34
				</span>
			</div>
		</div>
	)
}

/* ─── Suggested responses pill (ambient pulse) ─────────────── */

function SuggestedPill({ inView, reduced, delay }: { inView: boolean; reduced: boolean; delay: number }) {
	return (
		<motion.div
			className='inline-flex items-center gap-1 rounded-[24px] border border-white/[0.06] pl-2 pr-2.5 py-2'
			style={{
				background:
					'linear-gradient(90deg, rgba(52,225,142,0) 10%, rgba(255,255,255,0.06) 38%, rgba(52,225,142,0) 62%), linear-gradient(90deg, rgba(52,225,142,0.25), rgba(52,225,142,0.25))',
			}}
			initial={{ opacity: 0, y: 6 }}
			animate={inView
				? {
					opacity: 1,
					y: 0,
					boxShadow: reduced
						? '0px 4px 12px 0px rgba(0,0,0,0.4)'
						: [
							'0px 4px 12px 0px rgba(0,0,0,0.4), 0 0 0 rgba(52,225,142,0)',
							'0px 4px 12px 0px rgba(0,0,0,0.4), 0 0 16px rgba(52,225,142,0.35)',
							'0px 4px 12px 0px rgba(0,0,0,0.4), 0 0 0 rgba(52,225,142,0)',
						],
				}
				: undefined
			}
			transition={reduced
				? { duration: 0 }
				: {
					opacity: { duration: 0.4, delay },
					y: { duration: 0.4, delay },
					boxShadow: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.4 },
				}
			}
		>
			<PencilSimple size={12} weight='regular' className='text-white/95' aria-hidden='true' />
			<span className='font-[family-name:var(--font-sans)] text-[12px] leading-none text-white/95'>
				Get suggested responses
			</span>
		</motion.div>
	)
}

/* ─── Roleplay chat column ─────────────────────────────────── */

function RoleplayChat({ inView, reduced }: { inView: boolean; reduced: boolean }) {
	return (
		<div className='flex items-stretch gap-3'>
			{/* Timeline: user icon + a hairline that stretches down to the bottom of
			 * the chat column. items-stretch on the parent lets flex-1 on the line
			 * fill the full column height. */}
			<div className='flex flex-col items-center gap-2 py-px' aria-hidden='true'>
				<div className='flex items-center rounded bg-cc-accent/10 p-1'>
					<User size={16} weight='regular' className='text-cc-accent' />
				</div>
				<div className='w-px flex-1 bg-cc-accent/50' />
			</div>

			<div className='flex w-[300px] flex-col gap-4 pt-2 pr-3'>
				<p className='font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-white/80'>
					Roleplay session
				</p>

				<AiMessage
					lines={['Thanks for reaching out.', 'We already have a solution in place.']}
					delay={DELAY.ai1}
					inView={inView}
					reduced={reduced}
				/>
				<UserMessage
					lines={['I hear you. Can I ask what\u2019s working', 'well with your current setup?']}
					chip={{ tone: 'positive', label: 'Great Response' }}
					delay={DELAY.user1}
					inView={inView}
					reduced={reduced}
				/>
				<AiMessage
					lines={['Our current vendor handles', 'most of what you\u2019re describing.']}
					delay={DELAY.ai2}
					inView={inView}
					reduced={reduced}
				/>
				<UserMessage
					lines={['That makes sense. If I could show', 'you a 30-day ROI comparison...']}
					chip={{ tone: 'negative', label: 'Missed The Mark' }}
					delay={DELAY.user2}
					inView={inView}
					reduced={reduced}
				/>

				<div className='flex items-center justify-end px-2'>
					<SuggestedPill inView={inView} reduced={reduced} delay={DELAY.pill} />
				</div>

				<div className='flex items-center gap-4'>
					<InterestGauge value={39} inView={inView} reduced={reduced} />
					<AudioBar inView={inView} reduced={reduced} />
				</div>
			</div>
		</div>
	)
}

/* ─── Main component ───────────────────────────────────────── */

/* devPin kept for signature parity with sibling step visuals; no sub-states
 * to pin in the new composition. */
export default function StepTwoVisual({ devPin: _devPin = false }: { devPin?: boolean } = {}) {
	const reduced = useReducedMotion() ?? false
	const rootRef = useRef<HTMLDivElement>(null)
	const inView = useInView(rootRef, { amount: 0.3, once: true })

	return (
		<motion.div
			ref={rootRef}
			data-step='2'
			className='relative flex h-full w-full items-center justify-center'
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : undefined}
			transition={reduced ? { duration: 0 } : { duration: 0.55, ease: EASE }}
		>
			<div className='scale-[0.75] sm:scale-90 md:scale-[0.95] lg:scale-100'>
				<div className='flex items-start gap-6'>
					<CloneCard />
					<RoleplayChat inView={inView} reduced={reduced} />
				</div>
			</div>
		</motion.div>
	)
}
