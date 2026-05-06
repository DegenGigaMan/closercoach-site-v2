/** @fileoverview Preview route for Hero Phone V3 in-progress build.
 *
 * Mounts <HeroPhoneV3 /> at native 340×696 against a foundation backdrop with
 * the same emerald glow stack as the live hero (so visual verification matches
 * the eventual cutover surface). Route is unlinked — visitors won't reach it
 * without the URL — and gets deleted at Step 9 cutover.
 *
 * URL controls (for Figma diff verification):
 *   - Default: autoplay cycle 0→5→0 at 2.4s/state.
 *   - ?state=N (1-6): pin a single state, no cycling. */

import HeroPhoneV3PreviewClient from './preview-client'

export const metadata = {
	title: 'Hero V3 Preview · CloserCoach',
	robots: { index: false, follow: false },
}

type SearchParams = Promise<{ state?: string }>

export default async function HeroV3PreviewPage({
	searchParams,
}: {
	searchParams: SearchParams
}) {
	const { state } = await searchParams
	const parsed = state ? parseInt(state, 10) : NaN
	const pinned = Number.isInteger(parsed) && parsed >= 1 && parsed <= 6
		? ((parsed - 1) as 0 | 1 | 2 | 3 | 4 | 5)
		: null

	return <HeroPhoneV3PreviewClient pinned={pinned} />
}
