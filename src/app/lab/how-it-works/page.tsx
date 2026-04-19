/** @fileoverview Lab preview for S3 "How It Works" scroll experience (v2 lab).
 * Scroll-pinned split layout. 4 steps. Thread emergence motion.
 * Full S3 section rendered against dark background. No site chrome.
 * W6 ports approved lab into src/components/sections/SectionHowItWorks.tsx. */

'use client'

import SectionHowItWorksLab from '@/components/sections/_lab/SectionHowItWorksLab'

export default function LabHowItWorks() {
	return (
		<div className="min-h-screen w-full bg-cc-foundation">
			<div className="border-b border-white/[0.06] px-6 py-10 text-center md:px-12 lg:px-24">
				<p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-text-muted">
					LAB / HOW IT WORKS
				</p>
				<h1 className="display-md mt-3 text-white">Section 3 Scroll Experience</h1>
				<p className="mx-auto mt-3 max-w-xl text-sm text-cc-text-secondary">
					Scroll-pinned split. 4 steps. Thread emergence motion.
				</p>
			</div>
			<SectionHowItWorksLab />
		</div>
	)
}
