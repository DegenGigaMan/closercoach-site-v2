/** @fileoverview Card 1 visual -- 3 tilted persona cards fanned out (Brenda / Bobby / Marcus).
 *
 * Composition: 3 overlapping 240px-wide cards arranged in a horizontal fan:
 * left card rotated -8deg, center 0deg, right +8deg. Each card contains the
 * persona portrait (photo + "Name, Age" tag), a trust badge pill, a quote,
 * and a 5-segment difficulty meter. Mapped directly from Figma node 1:11128.
 *
 * Scales responsively: the visual holder is a relative flex container that
 * centers the stack. At <md, we scale the whole stack down to fit within
 * the card's body without horizontal overflow. */

'use client'

import type { ReactElement } from 'react'
import Image from 'next/image'
import { WarningOctagon, PiggyBank, HeadCircuit } from '@phosphor-icons/react'

type Persona = {
	name: string
	photo: string
	badgeLabel: string
	badgeTone: 'amber' | 'emerald' | 'cyan'
	BadgeIcon: typeof WarningOctagon
	quote: string
	difficulty: 'Easy' | 'Medium' | 'Hard'
	filled: number
	meterColor: string
	meterText: string
	rotation: string
	tx: string
}

const BADGE_TONES: Record<Persona['badgeTone'], { bg: string; border: string; text: string }> = {
	amber: {
		bg: 'rgba(245,158,11,0.1)',
		border: 'rgba(245,158,11,0.2)',
		text: '#F59E0B',
	},
	emerald: {
		bg: 'rgba(16,185,129,0.1)',
		border: 'rgba(16,185,129,0.2)',
		text: '#10B981',
	},
	cyan: {
		bg: 'rgba(0,195,255,0.1)',
		border: 'rgba(0,195,255,0.2)',
		text: '#00C3FF',
	},
}

const PERSONAS: readonly Persona[] = [
	{
		name: 'Brenda, 28',
		photo: '/images/features/card1-avatar-brenda.png',
		badgeLabel: 'Skeptical Prospect',
		badgeTone: 'amber',
		BadgeIcon: WarningOctagon,
		quote: '“I don\u2019t have time.”',
		difficulty: 'Easy',
		filled: 1,
		meterColor: '#10B981',
		meterText: '#10B981',
		rotation: '-8deg',
		tx: 'translateX(24px)',
	},
	{
		name: 'Bobby, 35',
		photo: '/images/features/card1-avatar-bobby.png',
		badgeLabel: 'Price-sensitive Buyer',
		badgeTone: 'emerald',
		BadgeIcon: PiggyBank,
		quote: '“How can I justify spending this much right now?”',
		difficulty: 'Medium',
		filled: 3,
		meterColor: '#F59E0B',
		meterText: '#F59E0B',
		rotation: '0deg',
		tx: 'translateX(0)',
	},
	{
		name: 'Marcus, 47',
		photo: '/images/features/card1-avatar-marcus.png',
		badgeLabel: 'Technical Evaluator',
		badgeTone: 'cyan',
		BadgeIcon: HeadCircuit,
		quote: '“I\u2019m not convinced the ROI is clear.”',
		difficulty: 'Hard',
		filled: 5,
		meterColor: '#FF5A5A',
		meterText: '#FF5A5A',
		rotation: '8deg',
		tx: 'translateX(-24px)',
	},
] as const

function DifficultyMeter({ filled, color }: { filled: number; color: string }): ReactElement {
	return (
		<div className='flex h-[6px] w-[116px] items-start gap-1' aria-hidden='true'>
			{[0, 1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className='h-[6px] flex-1 rounded-full'
					style={{
						backgroundColor: i < filled ? color : 'rgba(255,255,255,0.15)',
						minWidth: '14px',
					}}
				/>
			))}
		</div>
	)
}

function PersonaCard({ persona }: { persona: Persona }): ReactElement {
	const tones = BADGE_TONES[persona.badgeTone]
	return (
		<div
			className='relative w-[220px] shrink-0 rounded-2xl border border-white/[0.14] bg-cc-surface-card p-[13px]'
			style={{
				transform: `${persona.tx} rotate(${persona.rotation})`,
				boxShadow:
					'-8px 8px 16px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
			}}
		>
			<div className='flex flex-col gap-4'>
				{/* Portrait */}
				<div
					className='relative overflow-hidden rounded-lg border border-white/[0.05]'
					style={{ aspectRatio: '214 / 200' }}
				>
					<Image
						src={persona.photo}
						alt=''
						fill
						sizes='220px'
						className='object-cover'
						aria-hidden='true'
					/>
					{/* Name tag */}
					<div
						className='absolute left-3 top-3 flex items-center gap-1 rounded-full border border-white/[0.06] px-3 py-2 backdrop-blur-sm'
						style={{
							backgroundColor: 'rgba(30,34,48,0.6)',
							boxShadow: '0px 10px 30px 0px rgba(0,0,0,0.6)',
						}}
					>
						<span className='h-[6px] w-[6px] rounded-full bg-cc-accent' />
						<span className='text-[10px] font-medium leading-4 text-[#DADDE1]'>
							{persona.name}
						</span>
					</div>
				</div>

				{/* Badge + quote */}
				<div className='flex flex-col gap-3'>
					<div
						className='inline-flex items-center gap-1.5 self-start rounded-full border px-[9px] py-[5px]'
						style={{
							backgroundColor: tones.bg,
							borderColor: tones.border,
						}}
					>
						<persona.BadgeIcon size={12} weight='regular' style={{ color: tones.text }} aria-hidden='true' />
						<span className='text-[10px] font-medium tracking-[0.2px]' style={{ color: tones.text }}>
							{persona.badgeLabel}
						</span>
					</div>
					<p className='text-[15px] leading-[1.4] text-white min-h-[42px]'>{persona.quote}</p>
				</div>

				{/* Difficulty */}
				<div className='flex flex-col gap-3'>
					<span
						className='text-[10px] leading-[15px]'
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

/**
 * @description Card 1 visual -- three fanned persona cards. Decorative; the
 * content is presented visually to demonstrate the feature without being a
 * critical text alternative. Cards overlap by negative margin on the outer
 * cards to form the fan silhouette. Mobile: scale the stack to 85% so it
 * fits in the card footprint without horizontal scroll.
 */
export default function PracticeFanVisual(): ReactElement {
	return (
		<div
			className='relative flex w-full flex-1 items-center justify-center overflow-hidden py-6'
			role='img'
			aria-label='Three AI customer persona cards: Brenda the skeptical prospect, Bobby the price-sensitive buyer, and Marcus the technical evaluator.'
		>
			<div className='flex items-center justify-center scale-[0.78] sm:scale-90 md:scale-95 lg:scale-100'>
				<div className='-mr-16'>
					<PersonaCard persona={PERSONAS[0]} />
				</div>
				<div className='relative z-10'>
					<PersonaCard persona={PERSONAS[1]} />
				</div>
				<div className='-ml-16'>
					<PersonaCard persona={PERSONAS[2]} />
				</div>
			</div>
		</div>
	)
}
