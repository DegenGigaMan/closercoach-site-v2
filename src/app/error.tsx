/** @fileoverview Per-segment error boundary. Renders within root layout, so
 * Header + Footer auto-mount around this content.
 *
 * IMPORTANT: This Next.js exposes `unstable_retry` (NOT `reset`) per
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`.
 * `unstable_retry` re-fetches and re-renders the segment; `reset` (deprecated
 * in this version) clears state without re-fetching. We use unstable_retry. */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import MotionCTA from '@/components/shared/motion-cta'

export default function Error({
	error,
	unstable_retry,
}: {
	error: Error & { digest?: string }
	unstable_retry: () => void
}) {
	useEffect(() => {
		// Log so observability tools can correlate by digest.
		console.error('[error.tsx]', error)
	}, [error])

	return (
		<section className='relative bg-cc-foundation'>
			<div className='mx-auto flex min-h-[calc(100vh-4rem-var(--cc-banner-h,0px))] max-w-2xl flex-col items-center justify-center px-6 py-32 text-center md:py-48'>
				<span className='mb-6 inline-flex items-center rounded-full border border-cc-accent/30 bg-cc-accent/8 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-cc-accent'>
					Something broke
				</span>

				<h1 className='display-lg text-white md:display-xl'>
					Something <span className='italic text-cc-accent'>went wrong.</span>
				</h1>

				<p className='mt-6 max-w-xl font-sans text-lg leading-relaxed text-cc-text-secondary md:text-xl'>
					We hit a snag. Try again, or head back home.
				</p>

				{process.env.NODE_ENV === 'development' && error.message ? (
					<pre className='mt-6 max-w-xl overflow-x-auto rounded-md border border-white/10 bg-cc-foundation-deep px-4 py-3 text-left font-mono text-sm text-cc-text-secondary'>
						{error.message}
					</pre>
				) : null}

				{error.digest ? (
					<p className='mt-4 font-mono text-xs uppercase tracking-[0.2em] text-cc-text-secondary'>
						Ref: {error.digest}
					</p>
				) : null}

				<div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
					<button
						type='button'
						onClick={() => unstable_retry()}
						className='inline-flex items-center justify-center rounded-full border border-transparent bg-cc-mint px-6 py-4 text-[16px] font-bold leading-[18px] text-cc-foundation shadow-[0_4px_12px_rgba(29,184,104,0.34)] transition hover:bg-cc-mint focus-visible:ring-2 focus-visible:ring-cc-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation [font-family:var(--font-cta)]'
					>
						Try again
					</button>
					<MotionCTA href='/' variant='secondary'>
						Back home
					</MotionCTA>
				</div>

				{/* Hidden link for screen-reader fallback if Motion fails. */}
				<Link href='/' className='sr-only'>
					Return to home
				</Link>
			</div>
		</section>
	)
}
