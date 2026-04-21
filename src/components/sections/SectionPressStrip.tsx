/** @fileoverview Press Strip ("As Seen In"). Dark thin strip between S2 warm and
 * S3 dark. CU-3 treatment per visual-asset-ideation-2026-04-08. Left 60%: "Featured
 * in" label + 6 press outlets as Geist Mono wordmarks (typographic, Attio-style
 * sparse execution). Right 40%: Lora Bold Italic pull quote "The Duolingo for
 * sales." + Hypepotamus attribution. Vertical emerald-tinted hairline between.
 * Top and bottom AK-system hairlines frame the strip. Mobile stacks vertically. */

'use client'

const PRESS_OUTLETS = [
	{ name: 'Hypepotamus', mobilePriority: true },
	{ name: 'CompleteAITraining', mobilePriority: true },
	{ name: 'IT-Boltwise', mobilePriority: false },
	{ name: 'LinkedIn Daily AI Pulse', mobilePriority: true },
	{ name: 'Rep Hub', mobilePriority: false },
	{ name: 'H.I.G.H. Podcast', mobilePriority: true },
] as const

/**
 * @description Single press-outlet wordmark. Geist Mono, muted uppercase. Subtle
 * outline on mobile (adds visual weight); pure type on desktop for editorial calm.
 */
function PressWordmark({ name, hiddenOnMobile }: { name: string; hiddenOnMobile: boolean }) {
	return (
		<span
			className={`font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-cc-text-muted/70 transition-colors duration-300 hover:text-cc-text-secondary ${
				hiddenOnMobile ? 'hidden md:inline-flex' : ''
			}`}
		>
			{name}
		</span>
	)
}

/**
 * @description Press Strip. Dark surface, thin (~120px desktop). Horizontal split
 * 60/40 desktop; stacks vertically on mobile with horizontal hairline between
 * logos row and quote block.
 */
export default function SectionPressStrip() {
	return (
		<section
			id='press-strip'
			data-surface='dark'
			className='relative bg-cc-foundation py-10 md:py-8'
		>
			{/* Top AK hairline */}
			<div
				className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>

			<div className='mx-auto max-w-7xl px-6'>
				<div className='flex flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-0'>
					{/* Left 60%: press logos */}
					<div className='flex flex-col gap-3 md:w-[60%] md:pr-8'>
						<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-cc-text-muted/50'>
							Featured in
						</span>
						<div className='flex flex-wrap items-center gap-x-5 gap-y-3 md:gap-x-7'>
							{PRESS_OUTLETS.map((outlet) => (
								<PressWordmark
									key={outlet.name}
									name={outlet.name}
									hiddenOnMobile={!outlet.mobilePriority}
								/>
							))}
						</div>
					</div>

					{/* Mobile horizontal hairline */}
					<div
						className='h-px w-full bg-gradient-to-r from-transparent via-cc-accent/15 to-transparent md:hidden'
						aria-hidden='true'
					/>

					{/* Desktop vertical hairline (AK system) */}
					<div
						className='hidden w-px self-stretch bg-gradient-to-b from-transparent via-cc-accent/20 to-transparent md:block'
						aria-hidden='true'
					/>

					{/* Right 40%: pull quote */}
					<div className='md:w-[40%] md:pl-8'>
						<blockquote>
							<p
								className='text-xl leading-snug text-cc-text-primary md:text-2xl'
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
							<footer className='mt-3 flex items-center gap-2'>
								<div className='h-3 w-px bg-cc-accent/40' aria-hidden='true' />
								<span className='font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-cc-text-muted'>
									Hypepotamus, March 2026
								</span>
							</footer>
						</blockquote>
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
