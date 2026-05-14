'use client'

import Image from 'next/image'
import type { ReactElement } from 'react'
import { User } from '@phosphor-icons/react'

export default function OnboardFasterVisual(): ReactElement {
	return (
		<div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-6 md:px-6 md:py-7'>
				<div className='w-full mb-5 flex items-center justify-between'>
				<span
					className='text-trim text-[19px] font-bold leading-none text-cc-mint'
					style={{ fontFamily: 'var(--font-heading)' }}
				>
					10x faster
				</span>
				<div className='flex items-center gap-1'>
					<span aria-hidden='true' className='text-[16px] leading-none'>🏁</span>
					<span
						className='text-trim text-[14px] font-medium uppercase tracking-[0.08em] text-white/70'
						style={{ fontFamily: 'var(--font-mono)' }}
					>
						Quota Reached
					</span>
				</div>
			</div>

			{/* Two-track stack — 12px between rails so the 91%/44% pair
			 * reads as a comparison, not two unrelated rows. */}
			<div className='flex w-full flex-col gap-3'>
				{/* Track 1: trained rep at ~91% */}
				<div className='flex items-center gap-2.5'>
						<div
						className='relative flex h-[34px] w-[36px] shrink-0 items-center justify-center rounded-[8px]'
						style={{
							background: 'radial-gradient(ellipse at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
						}}
					>
						<Image
							src='/images/cc-logomark.png'
							alt=''
							width={17}
							height={17}
							sizes='17px'
							className='h-[17px] w-[17px] object-contain'
							unoptimized
						/>
					</div>
					<div className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]'>
						<div className='h-full w-[91%] rounded-full bg-gradient-to-r from-[#2dc87e] to-[#3ae09b]' />
					</div>
					<div className='relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-cc-foundation shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'>
						<Image src='/images/avatars/closer-1.png' alt='Priya Patel' fill sizes='32px' className='object-cover' unoptimized />
					</div>
				</div>

				{/* Track 2: average rep at ~44% */}
				<div className='flex items-center gap-2.5'>
					<span
						className='text-trim w-[33px] shrink-0 text-right text-[9px] font-medium uppercase tracking-[0.18em] text-white/35'
						style={{ fontFamily: 'var(--font-mono)' }}
					>
						Avg
					</span>
					<div className='relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]'>
						<div className='h-full w-[44%] rounded-full bg-white/25' />
					</div>
					<div className='relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10'>
						<User size={16} weight='regular' className='text-white/45' aria-hidden='true' />
					</div>
				</div>
			</div>
		</div>
	)
}
