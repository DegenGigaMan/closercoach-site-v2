/** @fileoverview S4 Bento 1 — three fanned persona roleplay cards.
 *
 * Spec: Figma node 4:72 (S4 - Bento 1). Each card maps to 4:3 / 4:26 / 4:49
 * (Brenda / Bobby / Marcus). All three cards are 240 × 351 with identical
 * recipes:
 *   - Container: bg #1E2230, border white/14, rounded-[16px], p-[13px],
 *     shadow `-8 8 16 rgba(0,0,0,0.6), 0 0 20 rgba(16,185,129,0.05)`
 *   - Inner layout: flex-col h-full gap-[16px]
 *       * Portrait: aspect-[214/200], border white/5, rounded-[8px]; full-bleed
 *         photo with a backdrop-blur "Name, Age" pill anchored top-left
 *         (12px inset per Figma overlay padding).
 *       * Badge + quote group: flex-col gap-[12px]. Trust pill uses the
 *         persona's tone colour; quote is Inter Regular 16px leading-[1.4].
 *       * Difficulty: flex-1 justify-end so the label + 5-segment meter pin
 *         to the bottom regardless of quote length.
 *   - Meter: 116px track, gap-[4px]. Segments 1-2 are fixed 20px; segments
 *     3-5 are flex-1 (matches every card's auto-layout in Figma).
 *
 * Tone colours (exact Figma hex):
 *   - Card 1 Skeptical Prospect: #F5880B orange (NOT amber)
 *   - Card 2 Price-sensitive Buyer: #10B981 emerald (bg rgba(16,183,127))
 *   - Card 3 Technical Evaluator: #00C3FF cyan
 *
 * Difficulty colours:
 *   - Easy: #10B981
 *   - Medium: #F59E0B
 *   - Hard: #FF5A5A
 *
 * Text-trim (`text-box: trim-both cap alphabetic`) applied to every visible
 * text element so the cap-to-baseline box matches Figma's reported metrics
 * instead of the browser's default leading-inflated line box.
 *
 * Fan layout: three cards placed side-by-side with negative horizontal
 * margins; outer cards rotated ±6° per Figma node 1:11128's original
 * composition. Responsive scale keeps the stack inside the bento card
 * footprint on smaller viewports. */

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
	/* Responsive rotation classes. Mobile values derived from Figma
	 * 12:1509 (-3° / 0° / +3°); desktop from Figma 4:72 (-8° / -2° / +5°).
	 * Class controls the card frame rotation; `imgRotClass` is the
	 * exact opposite so the portrait image stays visually upright. */
	rotClass: string
	imgRotClass: string
}

/* Exact Figma 4:72 tone values. Badge bg/border use slightly different hex
 * from the text colour in Figma source (emerald card uses rgba(16,183,127)
 * for surfaces but #10B981 for text — we honour that inconsistency). */
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
		photo: '/images/features/card1-avatar-brenda.png',
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
		photo: '/images/features/card1-avatar-bobby.png',
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
		photo: '/images/features/card1-avatar-marcus.png',
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

/* 5-segment meter per Figma 4:20/4:43/4:66. Segments 1-2 are fixed 20px;
 * segments 3-5 are flex-1 and grow to fill the remaining track width.
 * Track: 116 wide, gap-[4px] between segments. */
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

/**
 * @description S4 bento fan — three persona roleplay cards.
 *
 * Mobile (< lg, Figma 12:1509): tight stack. Cards tilted ±3°, each
 * overlapping the next by 210px so only ~30px of Brenda and Bobby peek
 * out to the left of Marcus, who sits fully visible on top.
 *
 * Desktop (lg+, Figma 4:72): deck fan. Cards tilted -8° / -2° / +5°,
 * each overlapping the next by 130px so the left ~110px of Brenda and
 * Bobby show as stack hints. Marcus is fully visible on the right.
 *
 * Z-order (both breakpoints): Brenda (z-0) → Bobby (z-10) → Marcus
 * (z-20), so subsequent cards render on top of earlier ones. A per-
 * breakpoint scale wrapper keeps the composition inside the bento card
 * footprint without horizontal overflow.
 */
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
