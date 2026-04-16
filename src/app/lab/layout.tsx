/** @fileoverview Lab layout. Strips header/footer for isolated component previews. */

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Lab | CloserCoach',
	robots: { index: false, follow: false },
}

export default function LabLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-cc-foundation">
			{children}
		</div>
	)
}
