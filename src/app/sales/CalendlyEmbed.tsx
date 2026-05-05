'use client'

/** @fileoverview Calendly InlineWidget — auto-sized via Calendly's postMessage
 *  height events so the iframe never needs an internal scrollbar. Loaded
 *  client-only via dynamic({ ssr: false }) in CalendlyWrapper to avoid
 *  hydration mismatch.
 *
 *  H-05 fix (2026-05-04): the prior 1100px height envelope made the embed
 *  feel comically tall on dark cc-foundation, and the iframe's default
 *  browser bg flashed white before Calendly's dark theme loaded. Now:
 *    - height reduced to 700px (matches Calendly's default scheduling view)
 *    - wrapping div + iframe both forced to cc-foundation bg so no white
 *      flash during load
 *    - emerald-tinted ring frames the embed without a heavy white card */

import { InlineWidget } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/taylor-closercoach/demo'

export default function CalendlyEmbed() {
	return (
		<div
			className='overflow-hidden rounded-2xl ring-1 ring-cc-accent/15'
			style={{ backgroundColor: '#0d0f14' }}
		>
			<InlineWidget
				url={CALENDLY_URL}
				styles={{
					height: '700px',
					width: '100%',
					backgroundColor: '#0d0f14',
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
	)
}
