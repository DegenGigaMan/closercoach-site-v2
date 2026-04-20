/** @fileoverview Lab preview for S3 "How It Works" (post-W6).
 *
 * After W6 the lab route renders the SAME production `SectionHowItWorks`
 * component that the homepage uses. It passes `devPin={true}` so each step
 * visual re-enables its `?pin=<state>` URL-param sub-state pin (useful for
 * DD / Playwright captures of specific sub-states without racing the
 * auto-advance chain).
 *
 * Production (homepage `/`) does NOT pass devPin, so it never reads
 * URLSearchParams and never responds to URL pins.
 *
 * The outer lab-page chrome (header + label) remains so the route self-
 * identifies as a preview surface. */

'use client'

import SectionHowItWorks from '@/components/sections/SectionHowItWorks'

export default function LabHowItWorks() {
	return (
		<div className="min-h-screen w-full bg-cc-foundation">
			<div className="border-b border-white/[0.06] px-6 py-10 text-center md:px-12 lg:px-24">
				<p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-text-muted">
					LAB / HOW IT WORKS
				</p>
				<h1 className="display-md mt-3 text-white">Section 3 Scroll Experience</h1>
				<p className="mx-auto mt-3 max-w-xl text-sm text-cc-text-secondary">
					Scroll-pinned split. 4 steps. Thread emergence motion. Dev pins:
					<span className="font-[family-name:var(--font-mono)] text-[10px] text-cc-accent"> ?pin=1..5 / 2A-2E / 3A-3F / 4A-4E</span>
				</p>
			</div>
			<SectionHowItWorks devPin />
		</div>
	)
}
