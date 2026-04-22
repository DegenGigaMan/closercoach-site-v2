/** @fileoverview Card 4 visual -- Cash Cards stacked flashcards.
 *
 * Composition: 3 receding flashcards stacked behind a foreground card that
 * shows an "Objection 4" label, the big quote, and a Medium difficulty meter
 * (3/5 amber). Back cards are narrower and dimmer to create depth.
 *
 * Mapped from Figma node 1:11393. */

'use client'

import type { ReactElement } from 'react'

function DifficultyMeter(): ReactElement {
	const filled = 3
	return (
		<div className='flex h-[6px] w-[116px] items-start gap-1' aria-hidden='true'>
			{[0, 1, 2, 3, 4].map((i) => (
				<div
					key={i}
					className='h-[6px] flex-1 rounded-full'
					style={{
						backgroundColor: i < filled ? '#F59E0B' : 'rgba(255,255,255,0.06)',
						minWidth: '14px',
					}}
				/>
			))}
		</div>
	)
}

export default function FlashcardStackVisual(): ReactElement {
	return (
		<div
			className='relative flex w-full flex-1 items-center justify-center overflow-hidden py-8'
			role='img'
			aria-label='A stack of flashcards. The top card shows Objection 4: How can I justify spending this much right now? with a medium difficulty meter.'
		>
			<div className='relative w-full max-w-[340px]'>
				{/* Back card 1 (widest, dimmest) */}
				<div
					className='absolute left-1/2 top-0 -translate-x-1/2 rounded-2xl border border-white/[0.1] p-[13px] opacity-60'
					style={{
						width: '78%',
						backgroundColor: '#1E2230',
						boxShadow: '0px -4px 12px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
					}}
				>
					<div className='h-[24px]' />
				</div>
				{/* Back card 2 (narrower, brighter) */}
				<div
					className='absolute left-1/2 top-3 -translate-x-1/2 rounded-2xl border border-white/[0.1] p-[13px] opacity-80'
					style={{
						width: '88%',
						backgroundColor: '#1E2230',
						boxShadow: '0px -4px 12px 0px rgba(0,0,0,0.6), 0px 0px 20px 0px rgba(16,185,129,0.05)',
					}}
				>
					<div className='h-[24px]' />
				</div>

				{/* Foreground card */}
				<div
					className='relative mt-6 w-full rounded-2xl border border-white/[0.1] p-5'
					style={{
						backgroundColor: '#1E2230',
						boxShadow: '0px -4px 12px 0px rgba(0,0,0,0.6)',
					}}
				>
					<div className='flex flex-col gap-5'>
						<div className='flex flex-col gap-3'>
							<span className='text-[10px] leading-[15px] text-[#64748B]'>Objection 4</span>
							<p className='text-[18px] font-medium leading-[1.4] text-white md:text-[20px]'>
								{'\u201C'}How can I justify spending this much right now?{'\u201D'}
							</p>
						</div>
						<div className='flex flex-col gap-3'>
							<span className='text-[10px] leading-[15px] text-[#94A3B8]'>
								Difficulty: <span className='text-[#F59E0B]'>Medium</span>
							</span>
							<DifficultyMeter />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
