'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'

type Verdict = 'strong-hire' | 'good-hire' | 'good-fit' | 'pass'

type Row = { name: string; avatar: string; verdict: Verdict; emphasised?: boolean }

const ROWS: readonly Row[] = [
	{ name: 'Sarah Chen', avatar: '/images/step1/avatar-sarah-v2.webp', verdict: 'strong-hire', emphasised: true },
	{ name: 'Marcus Rivera', avatar: '/images/step1/avatar-marcus-face.webp', verdict: 'strong-hire' },
	{ name: 'Tom Walsh', avatar: '/images/avatars/closer-2.webp', verdict: 'good-fit' },
	{ name: 'Devon Nguyen', avatar: '/images/avatars/closer-2.webp', verdict: 'good-fit' },
	{ name: 'Jordan Kim', avatar: '/images/avatars/closer-3.webp', verdict: 'pass' },
	{ name: 'Alex Pierce', avatar: '/images/avatars/closer-3.webp', verdict: 'pass' },
] as const

const VERDICT_MAP: Record<Verdict, { label: string; border: string; text: string; weight: 'bold' | 'medium' }> = {
	'strong-hire': { label: 'Strong Hire', border: 'rgba(16,208,120,0.15)', text: '#10d078', weight: 'medium' },
	'good-hire': { label: 'Good Hire', border: 'rgba(16,208,120,0.15)', text: '#10d078', weight: 'medium' },
	'good-fit': { label: 'Good Fit', border: 'rgba(16,208,120,0.15)', text: '#10d078', weight: 'medium' },
	pass: { label: 'Pass', border: 'rgba(255,122,106,0.5)', text: '#ff5a5a', weight: 'medium' },
}

function VerdictPill({ verdict, weight }: { verdict: Verdict; weight: 'bold' | 'medium' }): ReactElement {
	const m = VERDICT_MAP[verdict]
	const fontWeight = weight === 'bold' ? 700 : 500
	return (
		<span
			className='text-trim flex h-[22px] w-[79px] shrink-0 items-center justify-center rounded-full border bg-white/5 text-[8px] uppercase'
			style={{ borderColor: m.border, color: m.text, fontWeight }}
		>
			{m.label}
		</span>
	)
}

function CandidateRow({ name, avatar, verdict }: Row): ReactElement {
	return (
		<div className='flex items-center gap-2 px-3 py-[15px]'>
			<div className='relative h-[25px] w-[25px] shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
				<Image src={avatar} alt={name} fill sizes='25px' className='object-cover' unoptimized />
			</div>
			<span className='text-trim flex-1 text-[14px] leading-[20px] text-[#ebebeb]'>{name}</span>
			<VerdictPill verdict={verdict} weight={VERDICT_MAP[verdict].weight} />
		</div>
	)
}

export default function HireBetterFasterVisual(): ReactElement {
	const standardRows = ROWS.filter((r) => !r.emphasised)
	const emphasisedRow = ROWS.find((r) => r.emphasised)

	return (
		<div className='relative h-full w-full overflow-hidden px-4 py-5 md:px-6 md:py-7'>
			<div className='flex h-full w-full flex-col items-end justify-center'>
					<div className='relative flex w-full max-w-[314px] flex-col rounded-r-[12px] border border-l-0 border-white/[0.05] px-5'>
					{/* Header row: Candidate label + CC chip + Suggestion label */}
					<div className='flex items-center justify-center gap-2 px-3 py-2'>
						<span className='flex-1 text-trim text-[11px] font-semibold leading-[20px] text-[#aba7a7]'>
							Candidate
						</span>
						<div className='flex items-center gap-[7px]'>
								<div
								className='relative flex h-[23px] w-[24px] shrink-0 items-center justify-center rounded-[8px] shadow-[0_0_32px_rgba(16,208,120,0.4),0_0_80px_rgba(16,208,120,0.15)]'
								style={{
									background: 'radial-gradient(ellipse at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
								}}
							>
								<Image
									src='/images/cc-logomark.png'
									alt=''
									width={11}
									height={11}
									sizes='11px'
									className='h-[11px] w-[11px] object-contain'
									unoptimized
								/>
							</div>
							<span className='text-trim text-[8px] text-[#10d078]'>Suggestion</span>
						</div>
					</div>

					{/* Hairline */}
					<span aria-hidden='true' className='block h-px w-full bg-white/[0.05]' />

						{emphasisedRow && (
						<div className='relative -ml-[17px] flex items-center gap-2 rounded-l-[12px] border border-white/10 bg-[#1e2230] py-[9px] pl-[13px] pr-[28px] shadow-[0_8px_6px_rgba(0,0,0,0.6)]'>
							<div className='relative h-[29px] w-[29px] shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
								<Image src={emphasisedRow.avatar} alt={emphasisedRow.name} fill sizes='29px' className='object-cover' unoptimized />
							</div>
							<span className='text-trim flex-1 text-[14px] leading-[20px] text-[#ebebeb]'>{emphasisedRow.name}</span>
							<VerdictPill verdict={emphasisedRow.verdict} weight='bold' />
						</div>
					)}

					{/* Standard rows — separated by 1px white/05 hairlines per Figma. */}
					{standardRows.map((row, i) => (
						<div key={row.name}>
							<CandidateRow {...row} />
							{i < standardRows.length - 1 && (
								<span aria-hidden='true' className='block h-px w-full bg-white/[0.05]' />
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
