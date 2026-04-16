/** @fileoverview Lab preview for Hero Phone V2.
 * Family Values transition model with layoutId morphing.
 * Compare with V1 at /lab/hero-phone. */

'use client'

import HeroPhoneV2 from '@/components/hero/hero-phone-v2'

export default function LabHeroPhoneV2() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
			<div className="text-center">
				<p className="mono-label text-cc-text-muted">LAB / HERO PHONE V2</p>
				<h1 className="display-md mt-2 text-white">Family Values Transitions</h1>
				<p className="mt-2 text-sm text-cc-text-secondary">
					Shared elements morph between states. No crossfade teleportation.
				</p>
			</div>
			<HeroPhoneV2 />
		</div>
	)
}
