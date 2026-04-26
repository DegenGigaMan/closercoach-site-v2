/** @fileoverview /blog -- editorial warm coming-soon index. Placeholder post-card skeletons signal
 * future shape. Content population deferred to post-launch. W12 enhancement. */

import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowRight, LinkedinLogo } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
	title: 'Blog',
	description:
		'Sales training insights, playbooks, and field notes from the CloserCoach team. First posts dropping soon.',
	openGraph: {
		title: 'CloserCoach Blog',
		description:
			'Sales training insights, playbooks, and field notes from the CloserCoach team.',
		type: 'website',
	},
}

const LINKEDIN_URL = 'https://linkedin.com/company/closercoach'

const PLACEHOLDER_POSTS = [
	{ kicker: 'Playbook', title: 'How top AEs structure their first 60 seconds' },
	{ kicker: 'Teardown', title: 'What changes when you score every call' },
	{ kicker: 'Field notes', title: 'The 3 objections AI buyers keep landing' },
] as const

export default function BlogPage() {
	return (
		<div className='bg-cc-warm-light text-cc-text-primary-warm'>
			{/* Wave I FIX-05: outer container max-w-7xl so the post grid + footer
			    distribute evenly at 1440/1920 (was max-w-4xl, leaving 600+px
			    empty right canvas). Editorial header block (badge / H1 / intro /
			    LinkedIn row) stays in a max-w-4xl inner container so the
			    reading line length stays editorial-tight and centered, not
			    stretched across the wide canvas. */}
			<div className='mx-auto max-w-7xl px-6 py-20 md:py-28'>
				{/* Editorial header — narrower reading column inside the wide canvas. */}
				<div className='mx-auto max-w-4xl'>
					{/* Coming soon badge */}
					<span className='inline-flex items-center gap-2 rounded-full border border-cc-warm-border bg-white/60 px-3 py-1.5 text-xs font-medium text-cc-text-secondary-warm'>
						<span className='relative flex h-1.5 w-1.5' aria-hidden='true'>
							<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-cc-accent-hover opacity-75' />
							<span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-cc-accent-hover' />
						</span>
						<span className='font-mono uppercase tracking-[0.18em]'>Coming Soon</span>
					</span>

					{/* Hero */}
					<h1 className='mt-6 display-md text-cc-text-primary-warm md:display-lg'>
						Sales insights and playbooks from the{' '}
						<span className='italic text-cc-accent-hover'>CloserCoach</span> team.
					</h1>
					<p className='mt-5 max-w-2xl text-base text-cc-text-secondary-warm md:text-lg'>
						Short reads for people who close for a living. Frameworks you can use on your next call, teardowns of real roleplays, and lessons from the 20,000+ closers training inside the app.
					</p>

					{/* Placeholder state */}
					<div className='mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
						<p className='text-sm text-cc-text-secondary-warm'>
							First posts drop soon. Follow on LinkedIn for updates.
						</p>
						<Link
							href={LINKEDIN_URL}
							target='_blank'
							rel='noopener noreferrer'
							className='inline-flex items-center gap-2 self-start rounded-full border border-cc-text-primary-warm/20 bg-white/60 px-4 py-2 text-sm font-medium text-cc-text-primary-warm transition-colors hover:border-cc-accent-hover hover:bg-white hover:text-cc-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent-hover focus-visible:ring-offset-2 focus-visible:ring-offset-cc-warm-light'
						>
							<LinkedinLogo weight='regular' className='h-4 w-4' aria-hidden='true' />
							<span>Follow on LinkedIn</span>
							<ArrowRight weight='bold' className='h-3.5 w-3.5' aria-hidden='true' />
						</Link>
					</div>
				</div>

				{/* Placeholder post-card skeletons */}
				<div className='mt-14 grid gap-6 md:grid-cols-3'>
					{PLACEHOLDER_POSTS.map((post, i) => (
						<article
							key={post.title}
							aria-hidden='true'
							className='group relative flex flex-col overflow-hidden rounded-2xl border border-cc-warm-border bg-white/60 p-6 opacity-70'
						>
							{/* Skeleton image block */}
							<div className='mb-5 flex aspect-[16/10] items-center justify-center rounded-lg bg-gradient-to-br from-cc-warm-light-secondary to-cc-warm-light text-cc-text-tertiary-warm'>
								<BookOpen weight='regular' className='h-8 w-8 opacity-40' />
							</div>

							<p className='font-mono text-[11px] uppercase tracking-[0.18em] text-cc-accent-hover'>
								{post.kicker}
							</p>

							<h2 className='mt-3 text-lg font-semibold leading-snug text-cc-text-primary-warm md:text-xl'>
								{post.title}
							</h2>

							{/* Shimmer placeholder lines */}
							<div className='mt-4 space-y-2'>
								<div className='h-2 rounded bg-cc-text-tertiary-warm/20' />
								<div className='h-2 w-11/12 rounded bg-cc-text-tertiary-warm/20' />
								<div className='h-2 w-4/5 rounded bg-cc-text-tertiary-warm/20' />
							</div>

							<p className='mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-cc-text-tertiary-warm'>
								Post #{String(i + 1).padStart(2, '0')}
							</p>
						</article>
					))}
				</div>

				{/* Back link — back inside the editorial column. */}
				<div className='mx-auto mt-16 max-w-4xl'>
					<Link
						href='/'
						className='text-sm text-cc-text-secondary-warm transition-colors hover:text-cc-text-primary-warm'
					>
						&larr; Back to homepage
					</Link>
				</div>
			</div>
		</div>
	)
}
