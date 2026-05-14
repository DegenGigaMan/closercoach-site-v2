'use client'

import type { ReactElement } from 'react'
import Image from 'next/image'
import { WarningOctagon, PiggyBank, HeadCircuit } from '@phosphor-icons/react'

type Persona = {
	name: string
	photo: string
	badgeLabel: string
	badgeTone: 'orange' | 'emerald' | 'cyan'
	BadgeIcon: typeof WarningOctagon
	quote: string
	difficulty: 'Easy' | 'Medium' | 'Hard'
	filled: number
	meterColor: string
	meterText: string
	rotClass: string
	imgRotClass: string
}

const BADGE_TONES: Record<Persona['badgeTone'], { bg: string; border: string; text: string }> = {
	orange: {
		bg: 'rgba(245,136,11,0.10)',
		border: 'rgba(245,136,11,0.20)',
		text: '#F5880B',
	},
	emerald: {
		bg: 'rgba(16,183,127,0.10)',
		border: 'rgba(16,183,127,0.20)',
		text: '#10B981',
	},
	cyan: {
		bg: 'rgba(0,195,255,0.10)',
		border: 'rgba(0,195,255,0.20)',
		text: '#00C3FF',
	},
}

const PERSONAS: readonly Persona[] = [
	{
		name: 'Brenda, 28',
		photo: '/images/features/card1-avatar-brenda.webp',
		badgeLabel: 'Skeptical Prospect',
		badgeTone: 'orange',
		BadgeIcon: WarningOctagon,
		quote: '\u201CI don\u2019t have time.\u201D',
		difficulty: 'Easy',
		filled: 1,
		meterColor: '#10B981',
		meterText: '#10B981',
		rotClass: '-rotate-3 lg:-rotate-[8deg]',
		imgRotClass: 'rotate-3 lg:rotate-[8deg]',
	},
	{
		name: 'Bobby, 35',
		photo: '/images/features/card1-avatar-bobby.webp',
		badgeLabel: 'Price-sensitive Buyer',
		badgeTone: 'emerald',
		BadgeIcon: PiggyBank,
		quote: '\u201CHow can I justify spending this much right now?\u201D',
		difficulty: 'Medium',
		filled: 3,
		meterColor: '#F59E0B',
		meterText: '#F59E0B',
		rotClass: 'rotate-0 lg:-rotate-[2deg]',
		imgRotClass: 'rotate-0 lg:rotate-[2deg]',
	},
	{
		name: 'Marcus, 47',
		photo: '/images/features/card1-avatar-marcus.webp',
		badgeLabel: 'Technical Evaluator',
		badgeTone: 'cyan',
		BadgeIcon: HeadCircuit,
		quote: '\u201CI\u2019m not convinced the ROI is clear.\u201D',
		difficulty: 'Hard',
		filled: 5,
		meterColor: '#FF5A5A',
		meterText: '#FF5A5A',
		rotClass: 'rotate-3 lg:rotate-[5deg]',
		imgRotClass: '-rotate-3 lg:-rotate-[5deg]',
	},
] as const

function DifficultyMeter({ filled, color }: { filled: number; color: string }): ReactElement {
	return (
		<div className='flex h-[6px] w-[116px] items-start gap-1' aria-hidden='true'>
			{[0, 1, 2, 3, 4].map((i) => {
				const isFilled = i < filled
				const base = i < 2 ? 'h-[6px] w-[20px] shrink-0 rounded-full' : 'h-[6px] min-w-px flex-1 rounded-full'
				return (
					<div
						key={i}
						className={base}
						style={{ backgroundColor: isFilled ? color : 'rgba(255,255,255,0.15)' }}
					/>
				)
			})}
		</div>
	)
}

function PersonaCard({ persona }: { persona: Persona }): ReactElement {
	const tones = BADGE_TONES[persona.badgeTone]
	/* Card frame rotates via `persona.rotClass`; the portrait image
	 * counter-rotates (`persona.imgRotClass`) so the photo stays visually
	 * upright, like a print mounted inside a tilted frame. scale-[1.12] is
	 * the max corner-cover factor across mobile -3/+3 and desktop -8/+5
	 * rotations — derived from
	 * max((w·|cos θ|+h·|sin θ|)/w, (w·|sin θ|+h·|cos θ|)/h) for 214×200 at
	 * ≤8° with a small safety margin. Applied via Tailwind's `scale-*` which
	 * sets the individual `scale` property and composes with `rotate`. */
	return (
		<div
			className={`relative h-[351px] w-[240px] shrink-0 rounded-2xl border border-white/[0.14] bg-cc-surface-card p-[13px] ${persona.rotClass}`}
			style={{
				boxShadow:
					'-8px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
			}}
		>
			<div className='flex h-full flex-col gap-[16px]'>
				{/* Portrait — counter-rotated photo so it stays upright while the
				 * card frame tilts. The current asset files already have the
				 * "Name, Age" pill baked into the image, so no component-level
				 * pill is rendered here (which would otherwise duplicate). */}
				<div
					className='relative shrink-0 overflow-hidden rounded-[8px] border border-white/[0.05]'
					style={{ aspectRatio: '214 / 200' }}
				>
					<Image
						src={persona.photo}
						alt=''
						fill
						sizes='240px'
						className={`object-cover scale-[1.12] ${persona.imgRotClass}`}
						aria-hidden='true'
					/>
				</div>

				{/* Badge + quote group. */}
				<div className='flex flex-col gap-[12px]'>
					<div
						className='inline-flex items-center gap-1.5 self-start rounded-full border px-[9px] py-[5px]'
						style={{ backgroundColor: tones.bg, borderColor: tones.border }}
					>
						<persona.BadgeIcon size={12} weight='regular' style={{ color: tones.text }} aria-hidden='true' />
						<span
							className='text-trim text-[10px] font-medium leading-[20px]'
							style={{ color: tones.text, letterSpacing: '0.2px' }}
						>
							{persona.badgeLabel}
						</span>
					</div>
					<p className='text-trim min-w-full text-[16px] leading-[1.4] text-white'>
						{persona.quote}
					</p>
				</div>

				{/* Difficulty — flex-1 + justify-end pins label + meter to the
				 * card bottom so meters align across cards despite quote length
				 * variation. Matches Figma card-1 structure (4:18). */}
				<div className='flex flex-1 flex-col items-start justify-end gap-[12px]'>
					<span
						className='text-trim text-[10px] leading-[15px]'
						style={{ color: persona.meterText }}
					>
						{persona.difficulty}
					</span>
					<DifficultyMeter filled={persona.filled} color={persona.meterColor} />
				</div>
			</div>
		</div>
	)
}

export default function PracticeFanVisual(): ReactElement {
	return (
		<div
			className='relative flex w-full flex-1 items-start justify-center overflow-visible pt-4'
			role='img'
			aria-label='Three AI customer persona cards: Brenda the skeptical prospect, Bobby the price-sensitive buyer, and Marcus the technical evaluator.'
		>
			<div className='flex items-start justify-center transition-transform duration-300 ease-out sm:scale-[0.82] sm:group-hover:scale-[0.88] md:scale-[0.9] md:group-hover:scale-[0.96] lg:scale-100 lg:group-hover:scale-[1.06]'>
				<div className='relative z-0 -mr-[210px] transition-[margin] duration-300 ease-out group-hover:-mr-[150px] lg:-mr-[130px] lg:group-hover:-mr-[70px]'>
					<PersonaCard persona={PERSONAS[0]} />
				</div>
				<div className='relative z-10 -mr-[210px] transition-[margin] duration-300 ease-out group-hover:-mr-[150px] lg:-mr-[130px] lg:group-hover:-mr-[70px]'>
					<PersonaCard persona={PERSONAS[1]} />
				</div>
				<div className='relative z-20'>
					<PersonaCard persona={PERSONAS[2]} />
				</div>
			</div>
		</div>
	)
}
