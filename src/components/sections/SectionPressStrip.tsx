/** @fileoverview Press Strip — minimal pull-quote band between S2 warm and
 * S3 dark. Reworked 2026-04-25 (R-05 / D2) to match Figma 85:16457: the
 * outlet sub-layer + kicker were removed, leaving just the centered Lora
 * Bold Italic quote + vertical-hairline attribution between two horizontal
 * emerald gradient lines. Compact 32px vertical padding. */

'use client'

export default function SectionPressStrip() {
	return (
		<section
			id='press-strip'
			data-surface='dark'
			className='relative bg-cc-foundation py-8'
		>
			{/* Top horizontal gradient line (emerald 0 → 20% → 0) */}
			<div
				className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>

			<div className='mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 md:px-[104px]'>
				<blockquote className='text-center'>
					<p
						className='text-trim text-white'
						style={{
							fontFamily: 'var(--font-heading)',
							fontStyle: 'italic',
							fontWeight: 700,
							fontSize: '24px',
							lineHeight: '33px',
						}}
					>
						&ldquo;The{' '}<span className='text-cc-accent'>Duolingo</span>{' '}for sales.&rdquo;
					</p>
					<footer className='mt-3 flex items-center justify-center gap-2'>
						<span
							aria-hidden='true'
							className='inline-block h-3 w-px bg-cc-accent/40'
						/>
						<span
							className='text-trim font-[family-name:var(--font-mono)] uppercase text-cc-text-muted'
							style={{
								fontSize: '10px',
								lineHeight: '15px',
								letterSpacing: '1.8px',
							}}
						>
							Hypepotamus, March 2026
						</span>
					</footer>
				</blockquote>
			</div>

			{/* Bottom horizontal gradient line */}
			<div
				className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>
		</section>
	)
}
