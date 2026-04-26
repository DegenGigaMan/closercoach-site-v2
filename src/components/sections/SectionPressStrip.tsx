/** @fileoverview Press Strip — minimal pull-quote band between S2 warm and
 * S3 dark. Refined 2026-04-26 (Wave F.3) per Figma 85:16459: vertical
 * hairline between quote and attribution removed, gap between the two
 * tightened to 24px (Figma blockquote `gap-[24px]`). Compact 32px vertical
 * padding preserved; horizontal emerald gradient framing lines preserved. */

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

			<div className='mx-auto flex max-w-7xl flex-col items-center px-6 md:px-[104px]'>
				<blockquote className='flex flex-col items-center gap-6 text-center'>
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
					<footer>
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
