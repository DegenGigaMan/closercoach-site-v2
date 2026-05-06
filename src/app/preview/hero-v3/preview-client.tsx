/** @fileoverview Client-rendered shell for /preview/hero-v3.
 *
 * Foundation backdrop + 3-layer emerald glow + the phone composite. When
 * `pinned` is null, the phone autoplays the cycle. When set, it freezes on
 * that state for Figma diff capture. */

'use client'

import HeroPhoneV3, { type HeroV3StateIndex } from '@/components/hero/hero-phone-v3'

type Props = {
	pinned: HeroV3StateIndex | null
}

export default function HeroPhoneV3PreviewClient({ pinned }: Props) {
	return (
		<div className='flex min-h-screen items-center justify-center overflow-hidden bg-cc-foundation px-4 py-12'>
			<div className='relative flex items-center justify-center'>
				<div
					aria-hidden
					className='pointer-events-none absolute inset-[-40%] rounded-full blur-[120px]'
					style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
				/>
				<div
					aria-hidden
					className='pointer-events-none absolute inset-[-15%] rounded-full blur-[80px]'
					style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 45%)' }}
				/>
				<div
					aria-hidden
					className='pointer-events-none absolute inset-[-5%] rounded-full blur-[40px]'
					style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 25%)' }}
				/>

				<HeroPhoneV3
					autoplay={pinned === null}
					pinnedState={pinned ?? 0}
				/>
			</div>
		</div>
	)
}
