/** @fileoverview Press Strip ("As Seen In"). Dark section between S2 warm and
 * S3 dark. Per Alim feedback D2 (2026-04-23): the dual-column layout read as
 * two competing moments -- outlet list flat, pull-quote orphaned. Reworked to
 * lead with the pull-quote as the centerpiece and demote the 6 outlets to a
 * sub-layer beneath. Option (a) from synthesis §1.D2.
 *
 * Composition (top to bottom):
 *   1. "FEATURED IN" kicker (mono emerald, small caps).
 *   2. Pull-quote hero: "The Duolingo for sales." (Lora Bold Italic, large,
 *      "Duolingo" in emerald).
 *   3. Attribution line: HYPEPOTAMUS · MARCH 2026 (middle dot separator, no
 *      em dashes).
 *   4. Outlet sub-layer: 6 outlet names in Geist Mono, middle-dot separated on
 *      desktop, wraps cleanly on mobile.
 *
 * AK hairlines frame top + bottom. No vertical divider (dual-column artifact). */

'use client'

const PRESS_OUTLETS = [
	'Hypepotamus',
	'CompleteAITraining',
	'IT-Boltwise',
	'LinkedIn Daily AI Pulse',
	'Rep Hub',
	'H.I.G.H. Podcast',
] as const

export default function SectionPressStrip() {
	return (
		<section
			id='press-strip'
			data-surface='dark'
			className='relative bg-cc-foundation py-20 md:py-28'
		>
			{/* Top AK hairline */}
			<div
				className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>

			<div className='mx-auto max-w-4xl px-6 text-center'>
				{/* Kicker */}
				<p className='font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.22em] text-cc-accent'>
					Featured in
				</p>

				{/* Pull-quote hero */}
				<blockquote className='mt-6 md:mt-8'>
					<p
						className='text-cc-text-primary text-[2.5rem] leading-[1.05] md:text-6xl lg:text-7xl'
						style={{
							fontFamily: 'var(--font-heading)',
							fontStyle: 'italic',
							fontWeight: 700,
						}}
					>
						&ldquo;The{' '}
						<span className='text-cc-accent'>Duolingo</span>
						{' '}for sales.&rdquo;
					</p>
					<footer className='mt-5 md:mt-7'>
						<span className='inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-cc-text-secondary'>
							Hypepotamus
							<span
								aria-hidden='true'
								className='inline-block h-[3px] w-[3px] rounded-full bg-cc-accent/60'
							/>
							March 2026
						</span>
					</footer>
				</blockquote>

				{/* Outlet sub-layer */}
				<div className='mt-12 md:mt-16'>
					<div
						className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6'
						aria-label='Press outlets'
					>
						{PRESS_OUTLETS.map((name, i) => (
							<span key={name} className='inline-flex items-center gap-x-4 md:gap-x-6'>
								<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-cc-text-secondary/70 transition-colors duration-300 hover:text-cc-text-secondary'>
									{name}
								</span>
								{i < PRESS_OUTLETS.length - 1 && (
									<span
										aria-hidden='true'
										className='inline-block size-1 rounded-full bg-cc-accent/40'
									/>
								)}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Bottom AK hairline */}
			<div
				className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>
		</section>
	)
}
