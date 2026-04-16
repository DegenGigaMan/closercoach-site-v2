/** @fileoverview Lab preview for the hero phone 4-state animation.
 * Shows the phone in isolation on a dark surface with emerald glow. */

'use client'

import HeroPhone from '@/components/hero/hero-phone'

export default function LabHeroPhone() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
			<div className="text-center">
				<p className="mono-label text-cc-text-muted">LAB / HERO PHONE</p>
				<h1 className="display-md mt-2 text-white">4-State Product Story</h1>
				<p className="mt-2 text-sm text-cc-text-secondary">
					Auto-cycles every 4s. Each state shows a distinct product UI composition.
				</p>
			</div>
			<HeroPhone />
		</div>
	)
}
