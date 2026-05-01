/** @fileoverview /blog -- editorial warm index. Surfaces the $1M funding-announcement
 * post as a hero card above the placeholder grid so the AnnouncementBanner CTA has a
 * visible destination on the index. Wave R FIX-01. */

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
	alternates: {
		canonical: '/blog',
	},
}

const LINKEDIN_URL = 'https://linkedin.com/company/closercoach'

const HERO_POST = {
	href: '/blog/closercoach-raises-1m',
	kicker: 'Announcement',
	titlePre: 'CloserCoach raises ',
	titleEm: '$1M',
	titlePost: ' to build Duolingo for sales.',
	meta: 'March 2026 · 3 min read · By the CloserCoach team',
	cta: 'Read post',
} as const

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

					{/* LinkedIn follow row */}
					<div className='mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
						<p className='text-sm text-cc-text-secondary-warm'>
							New posts drop here. Follow on LinkedIn for updates.
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

				{/* Hero post — full-width feature card linking to the live post. Wave R FIX-01. */}
				<Link
					href={HERO_POST.href}
					className='group mt-14 block overflow-hidden rounded-3xl border border-cc-warm-border bg-white/70 transition-colors hover:border-cc-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent-hover focus-visible:ring-offset-2 focus-visible:ring-offset-cc-warm-light md:grid md:grid-cols-[5fr_7fr] md:items-stretch'
				>
					{/* Typographic cover: large 01 numeral on emerald-tinted gradient warm surface. */}
					<div className='relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-cc-warm-light-secondary via-cc-warm-light to-[rgba(16,185,129,0.12)] md:aspect-auto md:min-h-[280px]'>
						<span
							aria-hidden='true'
							className='select-none font-bold leading-none text-cc-accent-hover/30 transition-transform duration-500 group-hover:scale-105'
							style={{
								fontFamily: 'var(--font-heading)',
								fontSize: 'clamp(7rem, 18vw, 14rem)',
							}}
						>
							01
						</span>
						{/* subtle emerald wash bottom-right */}
						<span
							aria-hidden='true'
							className='absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-cc-accent-hover/10 blur-3xl'
						/>
					</div>

					{/* Content side */}
					<div className='flex flex-col justify-center gap-4 p-8 md:p-10'>
						<span className='font-mono text-[11px] uppercase tracking-[0.18em] text-cc-accent-hover'>
							{HERO_POST.kicker}
						</span>
						<h2
							className='text-balance text-cc-text-primary-warm'
							style={{
								fontFamily: 'var(--font-heading)',
								fontWeight: 700,
								fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
								lineHeight: 1.05,
								letterSpacing: '-0.015em',
							}}
						>
							{HERO_POST.titlePre}
							<em className='italic text-cc-accent-hover'>{HERO_POST.titleEm}</em>
							{HERO_POST.titlePost}
						</h2>
						<p className='font-mono text-xs uppercase tracking-[0.14em] text-cc-text-secondary-warm'>
							{HERO_POST.meta}
						</p>
						<span className='inline-flex items-center gap-2 text-sm font-medium text-cc-accent-hover transition-transform duration-200 group-hover:translate-x-1'>
							{HERO_POST.cta}
							<ArrowRight weight='bold' className='h-3.5 w-3.5' aria-hidden='true' />
						</span>
					</div>
				</Link>

				{/* More posts coming soon — eyebrow + placeholder grid */}
				<div className='mt-16 flex items-center gap-3'>
					<span className='font-mono text-[11px] uppercase tracking-[0.18em] text-cc-text-tertiary-warm'>
						More posts coming soon
					</span>
					<span aria-hidden='true' className='h-px flex-1 bg-cc-warm-border' />
				</div>

				{/* Placeholder post-card skeletons */}
				<div className='mt-8 grid gap-6 md:grid-cols-3'>
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
								Post #{String(i + 2).padStart(2, '0')}
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
