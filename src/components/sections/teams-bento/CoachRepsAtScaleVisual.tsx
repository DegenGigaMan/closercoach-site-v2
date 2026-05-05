/** @fileoverview S6 Card 1 visual — "Coach Reps At Scale" calendar mockup.
 *
 * Composition (per Figma 93-16849, Wave V tokens 2026-04-27):
 *   ─ Header row: "YOUR CALENDAR BEFORE" mono kicker (Geist Mono Medium 12px,
 *     0.72px tracking, white/80) → 80px hairline → 29×28 emerald-glow pill
 *     carrying the actual CC logomark → 80px hairline → "6h cleared up!" pill
 *     (emerald gradient bg, pencil icon + Inter Medium 12px white/95).
 *   ─ Calendar lane: 4 hour rows (8/9/10/11 AM). Each row has a 26px-wide
 *     time label (10px hour + 7px AM tail) followed by a 1px white/10 hairline,
 *     then meeting cards beneath.
 *   ─ Meeting card: rgba(30,34,48,0.3) bg + white/10 border + 0,8 r=8 0.4
 *     drop-shadow + rounded-12px + 9px padding. 2px emerald `#10B981` accent
 *     bar pinned full-height left, 28x28 avatar with white/5 ring, name in
 *     Inter Semibold 14px #ebebeb, time in Inter Regular 12px rgba(251,251,251,0.5).
 *   ─ 8 AM row also carries the right-column avatar cluster: 5×28px avatars
 *     with 2px cc-surface-card ring, -6px overlap, 8px gap to the
 *     "10 AI sessions active" label (Inter Regular 12px emerald #10d078 with
 *     5x5 emerald square dot).
 *   ─ Bottom blur fade (Figma 93:16871, 137px tall) softens the lower hours
 *     into the card surface.
 *
 * CC logomark: /public/images/cc-logomark.png (40×40 transparent PNG
 * sourced from Figma 94:18012 → image 98). Replaces the prior Sparkle icon
 * orb per Andy 2026-04-27 — the orb is the brand mark, not a generic icon. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { PencilSimple } from '@phosphor-icons/react'

type Meeting = { hour: string; name: string; time: string; avatar: string }

const MEETINGS: readonly Meeting[] = [
	{ hour: '8 AM', name: 'Marcus Rivera', time: '8:00am', avatar: '/images/step1/avatar-marcus-face.png' },
	{ hour: '9 AM', name: 'Priya Patel', time: '9:30am', avatar: '/images/avatars/closer-1.png' },
	{ hour: '10 AM', name: 'Tom Walsh', time: '10:30am', avatar: '/images/avatars/closer-2.png' },
	{ hour: '11 AM', name: 'Jordan Kim', time: '11:00am', avatar: '/images/avatars/closer-3.png' },
] as const

const STACKED_AVATARS = [
	{ src: '/images/step1/avatar-sarah-v2.png', alt: 'Sarah Chen' },
	{ src: '/images/avatars/closer-1.png', alt: 'Priya Patel' },
	{ src: '/images/avatars/closer-2.png', alt: 'Tom Walsh' },
	{ src: '/images/avatars/closer-3.png', alt: 'Jordan Kim' },
	{ src: '/images/step1/avatar-marcus-face.png', alt: 'Marcus Rivera' },
] as const

function MeetingCard({ name, time, avatar }: { name: string; time: string; avatar: string }): ReactElement {
	return (
		<div
			className='relative flex flex-1 items-start gap-3 rounded-[12px] border border-white/10 p-[9px] shadow-[0px_8px_8px_rgba(0,0,0,0.4)]'
			style={{ backgroundColor: 'rgba(30,34,48,0.3)' }}
		>
			<span aria-hidden='true' className='self-stretch w-[2px] shrink-0 rounded-full bg-cc-accent' />
			<div className='relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
				<Image src={avatar} alt={name} fill sizes='28px' className='object-cover' unoptimized />
			</div>
			<div className='flex min-w-0 flex-1 flex-col gap-3 py-1.5 leading-none'>
				<span className='text-trim text-[14px] font-semibold text-[#ebebeb] leading-[20px]'>{name}</span>
				<span className='text-trim text-[12px] text-[rgba(251,251,251,0.5)]'>{time}</span>
			</div>
		</div>
	)
}

function AvatarCluster(): ReactElement {
	return (
		<div className='flex flex-col items-center gap-2'>
			<div className='flex pr-1.5'>
				{STACKED_AVATARS.map((a, i) => (
					<div
						key={`${a.alt}-${i}`}
						className='relative -mr-1.5 h-7 w-7 overflow-hidden rounded-full border-2 border-cc-surface-card'
					>
						<Image src={a.src} alt={a.alt} fill sizes='28px' className='object-cover' unoptimized />
					</div>
				))}
			</div>
			<p className='text-trim flex items-center gap-[5px] text-[12px] text-[#10d078]'>
				<span aria-hidden='true' className='h-[5px] w-[5px] rounded-[2.5px] bg-[#10d078]' />
				10 AI sessions active
			</p>
		</div>
	)
}

function HourRow({ hour }: { hour: string }): ReactElement {
	const [num, suffix] = hour.split(' ')
	return (
		<div className='flex items-center gap-2.5'>
			<span className='shrink-0 w-[26px] text-right leading-none'>
				<span className='text-[10px] text-white'>{num} </span>
				<span className='text-[7px] text-[#675d5d]'>{suffix}</span>
			</span>
			<span aria-hidden='true' className='h-px flex-1 rounded-full bg-white/10' />
		</div>
	)
}

export default function CoachRepsAtScaleVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden px-7 pt-3 pb-3 md:px-12 md:pt-4 md:pb-4'>
			{/* Top header row per Figma 94:17959. At <sm the row stacks so the 3
			 * elements don't crowd; at sm+ the symmetric 80px hairlines flank
			 * the 29×28 emerald-glow logomark pill. */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2'>
				<div className='flex items-center gap-2 sm:flex-1 sm:justify-end'>
					<span
						className='text-trim shrink-0 uppercase'
						style={{
							fontFamily: 'var(--font-mono)',
							fontWeight: 500,
							fontSize: '12px',
							letterSpacing: '0.72px',
							color: 'rgba(255,255,255,0.8)',
						}}
					>
						Your calendar before
					</span>
					<span aria-hidden='true' className='hidden h-px w-[80px] shrink-0 bg-white/15 sm:block' />
				</div>

				{/* CC logomark orb — Figma 94:18012. 29×28 rounded-14 pill with
				 * triple-layer emerald glow shadow + radial-gradient interior. */}
				<div
					className='relative flex h-7 w-[29px] shrink-0 items-center justify-center self-start rounded-[14px] sm:self-auto'
					style={{
						background:
							'radial-gradient(ellipse at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
						boxShadow:
							'0 0 0 2px rgba(16,208,120,0.3), 0 0 32px rgba(16,208,120,0.4), 0 0 80px rgba(16,208,120,0.15)',
					}}
				>
					<Image
						src='/images/cc-logomark.png'
						alt=''
						width={15}
						height={15}
						sizes='15px'
						className='h-[15px] w-[15px] object-contain'
						unoptimized
					/>
				</div>

				<div className='flex items-center gap-2 sm:flex-1'>
					<span aria-hidden='true' className='hidden h-px w-[80px] shrink-0 bg-white/15 sm:block' />
					{/* "6h cleared up!" pill per Figma 94:17976 — emerald gradient
					 * bg + white/6 border + drop-shadow + pencil icon. */}
					<div
						className='relative flex shrink-0 items-center gap-1 self-start rounded-[24px] border border-white/[0.06] py-2 pl-2 pr-2.5 shadow-[0_4px_6px_rgba(0,0,0,0.4)] sm:self-auto'
						style={{
							background:
								'linear-gradient(89.99deg, rgba(52,225,142,0) 9.6%, rgba(255,255,255,0.06) 38.5%, rgba(52,225,142,0) 62.5%), linear-gradient(90deg, rgba(52,225,142,0.25) 0%, rgba(52,225,142,0.25) 100%)',
						}}
					>
						<PencilSimple size={12} weight='regular' className='shrink-0 text-white/95' aria-hidden='true' />
						<span className='text-trim text-[12px] font-medium text-white/95'>6h cleared up!</span>
					</div>
				</div>
			</div>

			{/* Calendar lane — 4 hour rows alternating time-label hairline +
			 * meeting card. The 8 AM row carries the avatar cluster on the right
			 * at md+; remaining rows leave the right column empty. */}
			<div className='mt-5 flex flex-col gap-1'>
				{MEETINGS.map((meeting, i) => (
					<div key={meeting.hour} className='flex flex-col gap-1'>
						<HourRow hour={meeting.hour} />
						<div className='grid grid-cols-1 items-center gap-3 pl-8 md:grid-cols-2 md:gap-16'>
							<MeetingCard name={meeting.name} time={meeting.time} avatar={meeting.avatar} />
							{i === 0 ? (
								<div className='hidden md:block'>
									<AvatarCluster />
								</div>
							) : (
								<div className='hidden md:block' aria-hidden='true' />
							)}
						</div>
					</div>
				))}
			</div>

			{/* Mobile-only footer band — at <md the cluster doesn't fit inline. */}
			<div className='mt-4 flex items-center gap-3 md:hidden'>
				<div className='flex pr-1.5'>
					{STACKED_AVATARS.map((a, i) => (
						<div
							key={`m-${a.alt}-${i}`}
							className='relative -mr-1.5 h-7 w-7 overflow-hidden rounded-full border-2 border-cc-surface-card'
						>
							<Image src={a.src} alt={a.alt} fill sizes='28px' className='object-cover' unoptimized />
						</div>
					))}
				</div>
				<p className='text-trim flex items-center gap-[5px] text-[12px] text-[#10d078]'>
					<span aria-hidden='true' className='h-[5px] w-[5px] rounded-[2.5px] bg-[#10d078]' />
					10 AI sessions active
				</p>
			</div>

			{/* Bottom blur fade — Figma 93:16871. Fades calendar lane into the
			 * card surface so lower rows trail off naturally. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 bottom-0 h-32'
				style={{ background: 'linear-gradient(to bottom, rgba(16,18,25,0) 0%, rgba(16,18,25,0.95) 85%)' }}
			/>
		</div>
	)
}
