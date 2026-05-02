/** @fileoverview Branded 404 page. Renders within root layout, so Header /
 * Footer auto-mount. Server component (no client-side state needed). Voice
 * matches site rhythm: short, slightly playful, never desperate. Pattern for
 * italic emphasis ported from /thank-you `<span className='italic text-cc-accent'>`. */

import type { Metadata } from 'next'
import MotionCTA from '@/components/shared/motion-cta'

export const metadata: Metadata = {
	title: '404. Wrong number.',
	description: 'That page is not on the line. Head back to the homepage or download CloserCoach.',
	robots: { index: false, follow: true },
}

export default function NotFound() {
	return (
		<section className='relative bg-cc-foundation'>
			<div className='mx-auto flex min-h-[calc(100vh-4rem-var(--cc-banner-h,0px))] max-w-2xl flex-col items-center justify-center px-6 py-32 text-center md:py-48'>
				<span className='mb-6 inline-flex items-center rounded-full border border-cc-accent/30 bg-cc-accent/8 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-cc-accent'>
					Error 404
				</span>

				<h1 className='display-lg text-white md:display-xl'>
					404. <span className='italic text-cc-accent'>Wrong number.</span>
				</h1>

				<p className='mt-6 max-w-xl font-sans text-lg leading-relaxed text-cc-text-secondary md:text-xl'>
					We can&apos;t find that page. Maybe it dialed itself.
				</p>

				<div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
					<MotionCTA href='/' variant='primary'>
						Back home
					</MotionCTA>
					<MotionCTA href='/download' variant='secondary'>
						Download CloserCoach
					</MotionCTA>
				</div>
			</div>
		</section>
	)
}
