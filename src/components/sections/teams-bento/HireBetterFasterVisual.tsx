/** @fileoverview S6 Card 5 visual — "Hire Better, Faster".
 *
 * Composition (per Figma 81-4739, equal col-span-1 row 2 — taller card):
 *   ─ Header row: "Candidate" mono label (left) + emerald sparkle orb +
 *     "Suggestion" emerald mono label (right).
 *   ─ Top emphasized row (rank 1, ~floating off the stack): Sarah Chen +
 *     Strong Hire emerald pill, with elevated shadow.
 *   ─ Stacked candidate rows (4 more): Sarah Chen × 4 with descending hire
 *     suggestion pills: Strong Hire / Good Hire / Good Fit / Pass. Pass uses
 *     red border + red text on dark (the only "no" in the field).
 *
 * The repeated "Sarah Chen" name is intentional — emphasizes that the AI
 * grades on roleplay performance, not name/resume signals. */

'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { Sparkle } from '@phosphor-icons/react'

const SARAH = '/images/step1/avatar-sarah-v2.png'

type Verdict = 'strong-hire' | 'good-hire' | 'good-fit' | 'pass'

type Row = { verdict: Verdict; emphasised?: boolean }

const ROWS: readonly Row[] = [
	{ verdict: 'strong-hire', emphasised: true },
	{ verdict: 'strong-hire' },
	{ verdict: 'good-hire' },
	{ verdict: 'good-fit' },
	{ verdict: 'pass' },
] as const

function VerdictPill({ verdict }: { verdict: Verdict }): ReactElement {
	const map: Record<Verdict, { label: string; className: string }> = {
		'strong-hire': { label: 'Strong Hire', className: 'border-cc-accent/40 bg-cc-accent/10 text-cc-mint' },
		'good-hire': { label: 'Good Hire', className: 'border-cc-accent/30 bg-cc-accent/5 text-cc-mint/80' },
		'good-fit': { label: 'Good Fit', className: 'border-cc-text-secondary/30 bg-cc-surface-card text-cc-text-secondary' },
		pass: { label: 'Pass', className: 'border-[#EF4444]/50 bg-transparent text-[#EF4444]' },
	}
	const m = map[verdict]
	return (
		<span className={`text-trim shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${m.className}`}>
			{m.label}
		</span>
	)
}

function CandidateRow({ verdict, emphasised = false }: Row): ReactElement {
	return (
		<div
			className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2 ${
				emphasised
					? 'border border-cc-accent/40 bg-cc-surface-card shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
					: 'border border-cc-surface-border bg-cc-surface-card/70'
			}`}
		>
			<div className='relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-cc-surface-border'>
				<Image src={SARAH} alt='Sarah Chen' fill sizes='24px' className='object-cover' unoptimized />
			</div>
			<span className='text-trim flex-1 text-[12px] font-medium text-white/85'>Sarah Chen</span>
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
				{ROWS.map((row, i) => (
					<CandidateRow key={i} {...row} />
				))}
			</div>
		</div>
	)
}
