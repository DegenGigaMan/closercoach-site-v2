/** @fileoverview S6 Card 5 visual — "Hire Better, Faster".
 *
 * Composition (per Figma 95-18267, split-equal col-span-1 row 2):
 *   ─ Header row: "Candidate" mono label (left) + square emerald CC chip
 *     + "Suggestion" emerald label (right).
 *   ─ Top emphasised row (rank 1, slightly elevated): bigger 29px avatar +
 *     candidate name + Strong Hire emerald pill, with elevated shadow +
 *     emerald-bordered card so it reads as the AI's recommended pick.
 *   ─ 4 standard rows below, each with 25px avatar + name + verdict pill.
 *     Verdicts descend Strong Hire / Good Hire / Good Fit / Pass. Pass uses
 *     a red border + red text on dark (the only "no" in the field).
 *   ─ Hairline dividers between rows so the table reads as ranked, not
 *     as a stack of disconnected cards.
 *
 * Wave T (Figma 95-18267 alignment, 2026-04-27): existing distinct
 * candidate roster preserved (Sarah / Marcus / Priya / Tom / Jordan).
 * Wave T scope is visual design alignment, not content rewrite.
 *   ─ Verdict pills tuned to Figma scale: 8px font, ~22px tall, ~79px wide.
 *   ─ Verdict colors aligned to Figma: emerald #10d078 for hire-pills,
 *     red #ff5a5a border + text for Pass.
 *   ─ Top row 29px avatar (was 24px), others 25px (was 24px).
 *   ─ Hairline row dividers added.
 *   ─ "Suggestion" orb swapped for a square emerald CC chip with radial
 *     gradient, matching Cards 3 + 1 chip vocabulary (was: circular ring). */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { Sparkle } from '@phosphor-icons/react'

type Verdict = 'strong-hire' | 'good-hire' | 'good-fit' | 'pass'

type Row = { name: string; avatar: string; verdict: Verdict; emphasised?: boolean }

const ROWS: readonly Row[] = [
	{ name: 'Sarah Chen', avatar: '/images/step1/avatar-sarah-v2.png', verdict: 'strong-hire', emphasised: true },
	{ name: 'Marcus Rivera', avatar: '/images/step1/avatar-marcus-face.png', verdict: 'strong-hire' },
	{ name: 'Priya Patel', avatar: '/images/avatars/closer-1.png', verdict: 'good-hire' },
	{ name: 'Tom Walsh', avatar: '/images/avatars/closer-2.png', verdict: 'good-fit' },
	{ name: 'Jordan Kim', avatar: '/images/avatars/closer-3.png', verdict: 'pass' },
] as const

function VerdictPill({ verdict }: { verdict: Verdict }): ReactElement {
	const map: Record<Verdict, { label: string; className: string }> = {
		'strong-hire': { label: 'Strong Hire', className: 'border-[rgba(16,208,120,0.4)] bg-white/5 text-[#10d078]' },
		'good-hire': { label: 'Good Hire', className: 'border-[rgba(16,208,120,0.25)] bg-white/5 text-[#10d078]' },
		'good-fit': { label: 'Good Fit', className: 'border-[rgba(16,208,120,0.18)] bg-white/5 text-[#10d078]' },
		pass: { label: 'Pass', className: 'border-[rgba(255,122,106,0.5)] bg-white/5 text-[#ff5a5a]' },
	}
	const m = map[verdict]
	return (
		<span className={`text-trim flex h-[22px] w-[79px] shrink-0 items-center justify-center rounded-full border text-[8px] font-bold uppercase tracking-wider ${m.className}`}>
			{m.label}
		</span>
	)
}

function CandidateRow({ name, avatar, verdict, emphasised = false }: Row): ReactElement {
	const avatarSize = emphasised ? 'h-[29px] w-[29px]' : 'h-[25px] w-[25px]'
	const sizes = emphasised ? '29px' : '25px'
	return (
		<div
			className={`relative flex items-center gap-2 rounded-xl px-3 ${
				emphasised
					? 'border border-[rgba(16,208,120,0.4)] bg-cc-surface-card py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
					: 'py-2.5'
			}`}
		>
			<div className={`relative shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 ${avatarSize}`}>
				<Image src={avatar} alt={name} fill sizes={sizes} className='object-cover' unoptimized />
			</div>
			<span className='text-trim flex-1 text-[14px] text-white/90'>{name}</span>
			<VerdictPill verdict={verdict} />
		</div>
	)
}

export default function HireBetterFasterVisual(): ReactElement {
	const standardRows = ROWS.filter((r) => !r.emphasised)
	const emphasisedRow = ROWS.find((r) => r.emphasised)

	return (
		<div className='relative h-full w-full overflow-hidden bg-cc-foundation px-4 py-5 md:px-5 md:py-6'>
			<div className='flex h-full flex-col'>
				{/* Header row — pr-12 sm:pr-10 clears the absolute [05] chapter
				 * marker rendered by BentoCard at all breakpoints. */}
				<div className='flex items-center justify-between pb-2 pr-12 sm:pr-10'>
					<span className='text-trim text-[11px] font-semibold text-[#aba7a7]'>
						Candidate
					</span>
					<div className='flex items-center gap-1.5'>
						{/* Square CC chip — radial-gradient tile + emerald glow per
						 * Figma 95:18331 */}
						<div
							className='relative flex h-[18px] w-[20px] shrink-0 items-center justify-center rounded-md shadow-[0_0_24px_rgba(16,208,120,0.4),0_0_60px_rgba(16,208,120,0.18)]'
							style={{
								background: 'radial-gradient(circle at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
							}}
						>
							<Sparkle size={10} weight='fill' className='text-cc-accent' />
						</div>
						<span className='text-trim text-[8px] font-bold uppercase tracking-wider text-[#10d078]'>
							Suggestion
						</span>
					</div>
				</div>

				{/* Emphasised top row — sits in its own slightly-elevated card so
				 * the AI's recommendation pops out of the ranking list. */}
				{emphasisedRow && (
					<div className='mt-1'>
						<CandidateRow {...emphasisedRow} />
					</div>
				)}

				{/* Standard rows separated by hairline dividers per Figma. */}
				<div className='mt-2 flex flex-col'>
					{standardRows.map((row, i) => (
						<div key={row.name}>
							<CandidateRow {...row} />
							{i < standardRows.length - 1 && (
								<div className='mx-3 h-px bg-white/[0.06]' aria-hidden='true' />
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
