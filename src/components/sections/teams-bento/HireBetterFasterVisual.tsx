/** @fileoverview S6 Card 5 visual — "Hire Better, Faster".
 *
 * Composition (per Figma 81-4739, equal col-span-1 row 2 — taller card):
 *   ─ Header row: "Candidate" mono label (left) + emerald sparkle orb +
 *     "Suggestion" emerald mono label (right).
 *   ─ Top emphasized row (rank 1, ~floating off the stack): Sarah Chen +
 *     Strong Hire emerald pill, with elevated shadow.
 *   ─ Stacked candidate rows (4 more): 4 distinct candidates with descending
 *     hire suggestion pills: Strong Hire / Good Hire / Good Fit / Pass. Pass
 *     uses red border + red text on dark (the only "no" in the field).
 *
 * Wave N (FIX-01): replaced 5x repeated Sarah Chen with 5 distinct
 * candidates so the card no longer reads as placeholder data. Each row pairs
 * a unique name with a unique portrait drawn from the real Pexels avatar
 * pool already shipped with the repo (step1/ + avatars/). Card C2 keeps the
 * emphasized rank-25 Sarah Chen as THE star rep — Card C5 shows the 5
 * distinct candidates being evaluated. */

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
		'strong-hire': { label: 'Strong Hire', className: 'border-cc-accent/40 bg-cc-accent/10 text-cc-mint' },
		'good-hire': { label: 'Good Hire', className: 'border-cc-accent/30 bg-cc-accent/5 text-cc-mint/80' },
		'good-fit': { label: 'Good Fit', className: 'border-cc-text-secondary/30 bg-cc-surface-card text-cc-text-secondary' },
		pass: { label: 'Pass', className: 'border-cc-error/50 bg-transparent text-cc-error' },
	}
	const m = map[verdict]
	return (
		<span className={`text-trim shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${m.className}`}>
			{m.label}
		</span>
	)
}

function CandidateRow({ name, avatar, verdict, emphasised = false }: Row): ReactElement {
	return (
		<div
			className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2 ${
				emphasised
					? 'border border-cc-accent/40 bg-cc-surface-card shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
					: 'border border-cc-surface-border bg-cc-surface-card/70'
			}`}
		>
			<div className='relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
				<Image src={avatar} alt={name} fill sizes='24px' className='object-cover' unoptimized />
			</div>
			<span className='text-trim flex-1 text-[12px] font-medium text-white/85'>{name}</span>
			<VerdictPill verdict={verdict} />
		</div>
	)
}

export default function HireBetterFasterVisual(): ReactElement {
	return (
		<div className='relative h-full w-full overflow-hidden bg-cc-foundation px-4 py-5 md:px-5 md:py-6'>
			{/* Header row */}
			<div className='flex items-center justify-between border-b border-cc-surface-border pb-2.5'>
				<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-cc-text-secondary'>
					Candidate
				</span>
				<div className='flex items-center gap-1.5'>
					<div className='relative flex h-5 w-5 items-center justify-center rounded-full bg-cc-foundation-deep ring-1 ring-cc-accent/70 shadow-[0_0_8px_rgba(16,185,129,0.35)]'>
						<Sparkle size={9} weight='fill' className='text-cc-accent' aria-hidden='true' />
					</div>
					<span className='text-trim font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-cc-mint'>
						Suggestion
					</span>
				</div>
			</div>

			{/* Stacked rows */}
			<div className='mt-2.5 flex flex-col gap-1.5'>
				{ROWS.map((row) => (
					<CandidateRow key={row.name} {...row} />
				))}
			</div>
		</div>
	)
}
