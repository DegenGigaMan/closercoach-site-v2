'use client'

/** @fileoverview Calendly InlineWidget — auto-sized via Calendly's postMessage
 *  height events so the iframe never needs an internal scrollbar. Loaded
 *  client-only via dynamic({ ssr: false }) in CalendlyWrapper to avoid
 *  hydration mismatch.
 *
 *  H-05 v3 (2026-05-05, audit option B): the white container persists
 *  because Calendly renders a card with white margins INSIDE the iframe
 *  (cross-origin, not styleable from parent). Mask it: wrap the iframe in
 *  a cc-foundation-bg container with negative margin + matching padding so
 *  the dark wrapper visually overlaps the iframe's white border. From the
 *  user's perspective, the embed sits flush on the dark page surface with
 *  rounded corners — the iframe's internal white edge is hidden behind the
 *  wrapper. */

import { InlineWidget } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/taylor-closercoach/demo'

export default function CalendlyEmbed() {
	return (
		<div className='overflow-hidden rounded-2xl bg-cc-foundation'>
			<div className='-m-6 sm:-m-8'>
				<InlineWidget
					url={CALENDLY_URL}
					styles={{
						height: '760px',
						width: '100%',
						minWidth: 0,
						colorScheme: 'dark',
						background: 'transparent',
					}}
					pageSettings={{
						backgroundColor: '0d0f14',
						primaryColor: '10b981',
						textColor: 'ffffff',
						hideEventTypeDetails: true,
						hideLandingPageDetails: true,
						hideGdprBanner: true,
					}}
				/>
			</div>
		</div>
	)
}
