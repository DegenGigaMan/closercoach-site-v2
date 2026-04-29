/** @fileoverview Lab route — legacy Step 4 Review (dense scorecard composite).
 *
 * Q17 Wave D2-1 (2026-04-29): the homepage swapped to the phone-mockup
 * variant per Andy #16+#17. This route preserves the legacy dense version
 * (scorecard with 250px sidebar + WHAT YOU SAID / SHOULD HAVE SAID stacked)
 * for reference / comparison if Andy wants to A/B between them. */

import StepFourReview from '@/components/sections/how-it-works/StepFourReview'

export const metadata = {
	title: 'Legacy Step Detail | CloserCoach Lab',
	robots: { index: false, follow: false },
}

export default function LegacyStepDetailPage() {
	return (
		<section className='bg-cc-foundation py-16'>
			<StepFourReview />
		</section>
	)
}
