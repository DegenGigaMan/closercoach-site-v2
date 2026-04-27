/** @fileoverview /blog/closercoach-raises-1m — funding announcement post.
 * Linked from the top AnnouncementBanner. Placeholder body copy until the
 * announcement copy lands; structure + typography are launch-grade. */

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

const TITLE = 'CloserCoach raises $1M to build Duolingo for sales'
const PUBLISHED = 'March 2026'
const READ_TIME = '3 min read'

export const metadata: Metadata = {
	title: TITLE,
	description:
		'CloserCoach raises $1M seed round to scale AI-powered sales coaching for the 20,000+ closers training inside the app every day.',
	openGraph: {
		title: TITLE,
		description:
			'CloserCoach raises $1M seed round to scale AI-powered sales coaching for the 20,000+ closers training inside the app every day.',
		type: 'article',
	},
}

export default function FundingAnnouncementPage() {
	return (
		<div className='bg-cc-warm-light text-cc-text-primary-warm'>
			<article className='mx-auto max-w-3xl px-6 py-20 md:py-28'>
				{/* Back to blog */}
				<Link
					href='/blog'
					className='inline-flex items-center gap-2 text-sm text-cc-text-secondary-warm transition-colors hover:text-cc-text-primary-warm'
				>
					<ArrowLeft weight='bold' className='h-3.5 w-3.5' aria-hidden='true' />
					<span>Back to blog</span>
				</Link>

				{/* Kicker */}
				<p className='mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-cc-accent-hover'>
					Announcement
				</p>

				{/* Headline */}
				<h1 className='mt-4 display-md text-cc-text-primary-warm md:display-lg'>
					CloserCoach raises{' '}
					<span className='italic text-cc-accent-hover'>$1M</span> to build
					Duolingo for sales.
				</h1>

				{/* Byline / meta */}
				<div className='mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cc-text-secondary-warm'>
					<span>By the CloserCoach team</span>
					<span aria-hidden='true' className='text-cc-text-tertiary-warm'>·</span>
					<span>{PUBLISHED}</span>
					<span aria-hidden='true' className='text-cc-text-tertiary-warm'>·</span>
					<span>{READ_TIME}</span>
				</div>

				{/* Hairline */}
				<div className='mt-10 h-px bg-cc-warm-border' aria-hidden='true' />

				{/* Body — placeholder copy. Replace with approved announcement text. */}
				<div className='mt-10 space-y-6 text-base leading-relaxed text-cc-text-secondary-warm md:text-lg'>
					<p>
						Today we&rsquo;re announcing that CloserCoach has raised a $1M seed
						round to keep building the fastest path from new rep to closer. We
						started CloserCoach because the gap between sales training and the
						real work of selling has stayed wide for far too long. Reps were
						being shipped slide decks and watching old recordings, then
						thrown on calls and graded by outcomes that landed weeks later.
						We thought there had to be a better loop.
					</p>
					<p>
						The thesis is simple. Reps get better the same way language
						learners do. Short reps, fast feedback, real practice against the
						hardest moments of the job. CloserCoach turns roleplay into a
						daily habit, scores it the way a great manager would, and keeps
						the muscle warm between live calls.
					</p>

					<blockquote className='my-10 border-l-2 border-cc-accent-hover pl-6 italic'>
						<p
							className='text-cc-text-primary-warm'
							style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px', lineHeight: '34px' }}
						>
							&ldquo;The Duolingo for sales.&rdquo;
						</p>
						<footer className='mt-3 font-mono text-[11px] uppercase not-italic tracking-[0.18em] text-cc-text-tertiary-warm'>
							Hypepotamus, March 2026
						</footer>
					</blockquote>

					<p>
						The round will fund three things. First, we&rsquo;re doubling down
						on the core scoring engine so the feedback every rep gets in the
						app keeps getting sharper. Second, we&rsquo;re expanding the
						Teams plan so sales leaders can roll out new scripts, onboard new
						reps, and audit performance the way they audit pipeline. Third,
						we&rsquo;re investing in the catalog of industry-specific
						scenarios so reps in insurance, real estate, solar, mortgage, and
						a growing list of other verticals can practice the exact calls
						they&rsquo;ll run tomorrow.
					</p>
					<p>
						More than 20,000 closers train on CloserCoach every day. We&rsquo;re
						grateful to the operators, founders, and sales leaders who
						believed early, and to every rep who&rsquo;s logged a session.
						We&rsquo;ll have more to share soon. Until then, the work
						continues. The next session takes 60 seconds.
					</p>
				</div>

				{/* CTA row */}
				<div className='mt-12 flex flex-col items-start gap-4 border-t border-cc-warm-border pt-8 md:flex-row md:items-center md:justify-between'>
					<p className='text-sm text-cc-text-secondary-warm'>
						Want to try the loop yourself?
					</p>
					<Link
						href='/download'
						className='inline-flex items-center gap-2 rounded-lg bg-cc-accent-hover px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cc-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent-hover focus-visible:ring-offset-2 focus-visible:ring-offset-cc-warm-light'
					>
						Try CloserCoach free for 3 days
					</Link>
				</div>
			</article>
		</div>
	)
}
