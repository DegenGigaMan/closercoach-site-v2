/** @fileoverview Card 4 visual -- Cash Cards stacked flashcards.
 *
 * All 3 cards are rendered simultaneously as absolute-positioned motion divs.
 * Every 3.5 s the front card animates to the back of the deck (shrinks, moves
 * up, fades) while the back cards advance forward — giving a card-deck shuffle
 * effect. Slot positions: slot 0 = front (y:30, full width), slot 1 = middle
 * (y:12, 88% width), slot 2 = back (y:0, 78% width).
 *
 * Mapped from Figma node 1:11393. */

'use client'

import { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

const CARDS = [
	{
		label: 'Objection 4',
		quote: '“How can I justify spending this much right now?”',
		difficulty: 'Medium',
		filled: 3,
		color: '#F59E0B',
	},
	{
		label: 'Objection 5',
		quote: '“I need to think about it and get back to you.”',
		difficulty: 'Easy',
		filled: 1,
		color: '#10B981',
	},
	{
		label: 'Objection 6',
		quote: '“We’re already locked in with another provider.”',
		difficulty: 'Hard',
		filled: 5,
		color: '#EF4444',
	},
] as const

/* slot 0 = front (full size, lowest position so front card hangs below)
 * slot 1 = middle back (slightly up, narrower)
 * slot 2 = far back (highest, narrowest) */
const SLOTS = [
	{ y: 34, scaleX: 1,    opacity: 1,    zIndex: 3 },
	{ y: 14, scaleX: 0.87, opacity: 0.72, zIndex: 2 },
	{ y: 0,  scaleX: 0.75, opacity: 0.50, zIndex: 1 },
]

function DifficultyMeter({ filled, color }: { filled: number; color: string }): ReactElement {
	return (
		<div className='flex h-[6px] w-[116px] items-start gap-1' aria-hidden='true'>
			{[0, 1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className='h-[6px] flex-1 rounded-full'
					style={{
						backgroundColor: i < filled ? color : 'rgba(255,255,255,0.06)',
						minWidth: '14px',
					}}
				/>
			))}
		</div>
	)
}

export default function FlashcardStackVisual(): ReactElement {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		const id = setInterval(() => setIndex((i) => (i + 1) % CARDS.length), 2500)
		return () => clearInterval(id)
	}, [])

	return (
		<div className='relative flex w-full flex-1 items-center justify-center overflow-hidden py-8'>
			{/* Fixed-height stage so absolutely-positioned cards don't collapse the wrapper */}
			<div className='relative w-full max-w-[340px]' style={{ height: '230px' }}>
				{CARDS.map((card, cardIdx) => {
					const slot = (cardIdx - index + CARDS.length) % CARDS.length
					const s = SLOTS[slot]
					/* Derive initial slot from index=0 so there's no entrance animation on mount */
					const initSlot = cardIdx % CARDS.length
					const init = SLOTS[initSlot]

					return (
						<motion.div
							key={cardIdx}
							className='absolute left-0 right-0 rounded-2xl border border-white/[0.1] p-5'
							style={{
								backgroundColor: '#1E2230',
								boxShadow: '0px -4px 12px 0px rgba(0,0,0,0.6)',
								originX: '50%',
								originY: 0,
								zIndex: s.zIndex,
							}}
							initial={{ y: init.y, scaleX: init.scaleX, opacity: init.opacity }}
							animate={{ y: s.y, scaleX: s.scaleX, opacity: s.opacity }}
							transition={{ duration: 0.5, ease: EASE, delay: slot === 0 ? 0.08 : 0 }}
						>
							<div className='flex flex-col gap-5'>
								<div className='flex flex-col gap-3'>
									<span className='text-[10px] leading-[15px] text-[#64748B]'>
										{card.label}
									</span>
									<p className='text-[18px] font-medium leading-[1.4] text-white md:text-[20px]'>
										{card.quote}
									</p>
								</div>
								<div className='flex flex-col gap-3'>
									<span className='text-[10px] leading-[15px] text-[#94A3B8]'>
										Difficulty:{' '}
										<span style={{ color: card.color }}>{card.difficulty}</span>
									</span>
									<DifficultyMeter filled={card.filled} color={card.color} />
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}
