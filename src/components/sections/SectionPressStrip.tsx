/** @fileoverview Press Strip — minimal pull-quote band between S2 warm and
 * S3 dark. Refined 2026-04-26 (Wave F.3) per Figma 85:16459: vertical
 * hairline between quote and attribution removed, gap between the two
 * tightened to 24px (Figma blockquote `gap-[24px]`). Compact 32px vertical
 * padding preserved; horizontal emerald gradient framing lines preserved.
 *
 * Wave Y.2 (Alim 2026-04-28): pull-quote rewritten from "The Duolingo for
 * sales." to the Hypepotamus article's framing angle. Alim shared the source
 * URL and suggested pulling the angle "Ex prizepicks engineer bringing
 * sports-like competition to sales" — that headline summary now anchors the
 * strip. This rewrite supersedes Wave X.5's REDUCTION CANDIDATE C (remove
 * SectionPressStrip): the prior "Duolingo for sales" line was flagged as
 * redundant with ProofConnectorB's App Store quote, but the Hypepotamus
 * angle is editorial press framing — not customer testimony — so the two
 * surfaces are no longer redundant.
 *
 * Wave Z.1 P1-A (2026-04-28): attribution wrapped in source link to the
 * Hypepotamus article so the editorial press framing is verifiably
 * third-party. Subtle hover underline; new tab + noopener noreferrer. */

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
						className='text-trim text-balance text-white'
						style={{
							fontFamily: 'var(--font-heading)',
							fontStyle: 'italic',
							fontWeight: 700,
							fontSize: '24px',
							lineHeight: '33px',
						}}
					>
						Ex-PrizePicks engineer brings{' '}
						<span className='text-cc-accent'>sports-like competition</span>{' '}
						to sales.
					</p>
					<footer>
						<a
							href='https://hypepotamus.com/startup-news/prizepicks-alum-launches-closercoach-ai-sales-coaching-atlanta/'
							target='_blank'
							rel='noopener noreferrer'
							className='text-trim font-[family-name:var(--font-mono)] uppercase text-cc-text-muted underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
							style={{
								fontSize: '10px',
								lineHeight: '15px',
								letterSpacing: '1.8px',
							}}
						>
							Hypepotamus, March 2026
						</a>
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
