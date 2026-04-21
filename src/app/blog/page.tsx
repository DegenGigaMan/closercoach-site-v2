/** @fileoverview Blog index route stub. Content population deferred to post-launch wave. */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Sales training insights, playbooks, and field notes from the CloserCoach team.',
}

export default function BlogPage() {
	return (
		<div className='bg-cc-foundation'>
			<div className='mx-auto max-w-3xl px-6 py-24 md:py-32'>
				<h1 className='display-lg text-white'>Blog</h1>
				<p className='mt-4 text-lg text-cc-text-secondary'>
					Sales training insights, playbooks, and field notes from the CloserCoach team.
				</p>
				<p className='mt-8 text-sm text-cc-text-muted'>
					Posts coming soon.
				</p>

				<div className='mt-16'>
					<Link
						href='/'
						className='text-sm text-cc-text-secondary transition-colors hover:text-white'
					>
						&larr; Back to homepage
					</Link>
				</div>
			</div>
		</div>
	)
}
