/** @fileoverview S6 Card 1 visual — "Coach Reps At Scale" calendar mockup.
 *
 * Composition (per Figma 93-16840, hero col-span-2 card):
 *   ─ Top row: "YOUR CALENDAR BEFORE" mono kicker + horizontal connector,
 *     emerald play-orb center marker, "6h cleared up!" emerald pill right.
 *
 *   ─ Calendar lane: 8AM / 9AM / 10AM / 11AM time markers with a horizontal
 *     hairline per hour. Each hour seats a "Sarah Chen 10:30am" meeting card
 *     in the LEFT half. The 8AM row carries an additional element in its
 *     RIGHT half: 5-avatar -space-x cluster + "● 10 AI sessions active"
 *     emerald label, anchoring the AI-coverage proof point inline with the
 *     first booked meeting.
 *
 *   ─ Bottom gradient fade (~h-32) bleeds the 11AM row into the card body
 *     below so the calendar feels like a longer-than-visible day strip.
 *
 * Wave T (Figma 93-16840 alignment, 2026-04-27): reverts Wave N polish.
 *   ─ All 4 rows now "Sarah Chen 10:30am" per Figma (was: Marcus / Priya /
 *     Tom / Jordan distinct roster from Wave P + Wave N).
 *   ─ "AI handled from here" dashed divider removed (was: Wave N FIX-03).
 *   ─ Avatar cluster + AI sessions label inlined on row 1 at md+ (was:
 *     footer band below calendar). Mobile <md keeps the footer band
 *     fallback so the narrow card doesn't crowd the row.
 *   ─ Per-row opacity-15 fading removed; only the bottom gradient fades. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { Sparkle } from '@phosphor-icons/react'

type Meeting = { hour: string; name: string; time: string; avatar: string }

const MEETINGS: readonly Meeting[] = [
	{ hour: '8 AM', name: 'Marcus Rivera', time: '8:15am', avatar: '/images/step1/avatar-marcus-face.png' },
	{ hour: '9 AM', name: 'Priya Patel', time: '9:30am', avatar: '/images/avatars/closer-1.png' },
	{ hour: '10 AM', name: 'Tom Walsh', time: '10:30am', avatar: '/images/avatars/closer-2.png' },
	{ hour: '11 AM', name: 'Jordan Kim', time: '11:45am', avatar: '/images/avatars/closer-3.png' },
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
		<div className='relative flex items-center gap-3 rounded-xl border border-cc-surface-border bg-cc-surface-card/80 px-3 py-2.5 backdrop-blur-sm'>
			<span aria-hidden='true' className='absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-cc-accent' />
			<div className='relative ml-1 h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
				<Image src={avatar} alt={name} fill sizes='28px' className='object-cover' unoptimized />
			</div>
			<div className='flex min-w-0 flex-col leading-none'>
				<span className='text-trim text-[13px] font-semibold text-white'>{name}</span>
				<span className='text-trim mt-1 text-[11px] text-cc-text-secondary'>{time}</span>
			</div>
		</div>
	)
}

function AvatarCluster(): ReactElement {
	return (
		<div className='flex flex-col items-center gap-2'>
			<div className='flex -space-x-2'>
				{STACKED_AVATARS.map((a, i) => (
					<div key={`${a.alt}-${i}`} className='relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-cc-foundation'>
						<Image src={a.src} alt={a.alt} fill sizes='28px' className='object-cover' unoptimized />
					</div>
				))}
			</div>
			<p className='text-trim flex items-center gap-1.5 text-[11px] font-medium text-cc-mint'>
				<span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-cc-accent shadow-[0_0_6px_rgba(16,185,129,0.8)]' />
				10 AI sessions active
			</p>
		</div>
	)
}

export default function CoachRepsAtScaleVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden bg-cc-foundation px-5 pt-5 pb-3 md:px-8 md:pt-7 md:pb-4'>
			{/* Top row: kicker + connector + play orb + cleared pill. At <sm the
			 * row stacks: eyebrow + sparkle on row 1, "6h cleared up!" pill on
			 * row 2 — prevents the 3 anchor elements from crowding/touching at
			 * 390/430 viewports (Wave N FIX-04). At sm+ the connectors fill in
			 * and all 4 elements sit on one line. */}
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 md:gap-3'>
				<div className='flex items-center gap-2'>
					<span className='text-trim shrink-0 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.18em] text-cc-text-secondary'>
						Your calendar before
					</span>
					<span aria-hidden='true' className='hidden h-px flex-1 bg-gradient-to-r from-cc-accent/60 via-cc-accent/30 to-transparent sm:block' />
					<div className='relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cc-foundation-deep ring-2 ring-cc-accent shadow-[0_0_16px_rgba(16,185,129,0.45)]'>
						<Sparkle size={14} weight='fill' className='text-cc-accent' />
					</div>
				</div>
				<span aria-hidden='true' className='hidden h-px shrink-0 bg-gradient-to-r from-cc-accent/30 to-cc-accent/60 sm:block sm:w-12 md:w-16' />
				<div className='self-start shrink-0 rounded-full border border-cc-accent/40 bg-cc-accent/10 px-2.5 py-1.5 sm:ml-auto sm:self-auto'>
					<span className='text-trim flex items-center gap-1.5 text-[10px] font-medium text-cc-mint md:text-[11px]'>
						<Sparkle size={11} weight='fill' aria-hidden='true' />
						6h cleared up!
					</span>
				</div>
			</div>

			{/* Calendar lane. Each hour row: hour-label LEFT, hairline + content
			 * spanning the rest. Content collapses to single column at <md so
			 * the meeting card has full width on phone; at md+ a 2-col grid
			 * splits the row so the 8AM line can carry the avatar cluster on
			 * the right while remaining rows leave the right column empty. */}
			<div className='mt-5 flex flex-col gap-2'>
				{MEETINGS.map((meeting, i) => (
					<div key={meeting.hour} className='flex items-start gap-3'>
						<span className='text-trim mt-2 w-10 shrink-0 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-wider text-cc-text-secondary/70'>
							{meeting.hour}
						</span>
						<div className='relative flex-1'>
							<span aria-hidden='true' className='absolute -top-1 left-0 right-0 h-px bg-cc-surface-border' />
							<div className='grid grid-cols-1 items-center gap-3 md:grid-cols-2 md:gap-8'>
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
					</div>
				))}
			</div>

			{/* Mobile-only footer band — at <md the avatar cluster doesn't fit
			 * inline with the 8AM card (~318px visual width is too tight for a
			 * 2-col split), so it falls back to a band below the calendar. */}
			<div className='mt-4 flex items-center gap-3 md:hidden'>
				<div className='flex -space-x-2'>
					{STACKED_AVATARS.map((a, i) => (
						<div key={`m-${a.alt}-${i}`} className='relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-cc-foundation'>
							<Image src={a.src} alt={a.alt} fill sizes='28px' className='object-cover' unoptimized />
						</div>
					))}
				</div>
				<p className='text-trim flex items-center gap-1.5 text-[11px] font-medium text-cc-mint'>
					<span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-cc-accent shadow-[0_0_6px_rgba(16,185,129,0.8)]' />
					10 AI sessions active
				</p>
			</div>

			{/* Bottom gradient fade — Figma node 93:16871 specs ~137px tall. h-32
			 * (128px) keeps it close while staying on the spacing scale. The
			 * 11AM row reads as fading into the card body below, signaling
			 * the day strip continues beyond what's visible. */}
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-cc-foundation'
			/>
		</div>
	)
}
