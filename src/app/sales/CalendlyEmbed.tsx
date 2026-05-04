'use client'

/** @fileoverview Calendly InlineWidget — auto-sized via Calendly's postMessage
 *  height events so the iframe never needs an internal scrollbar. Replaces the
 *  raw iframe approach which had a fixed min-height (560px) that was too short
 *  for the actual widget content and forced an inner scroll. Loaded client-only
 *  via dynamic({ ssr: false }) in CalendlyWrapper to avoid hydration mismatch. */

import { InlineWidget } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/taylor-closercoach/demo'

export default function CalendlyEmbed() {
	return (
		<InlineWidget
			url={CALENDLY_URL}
			styles={{
				/* Tall enough for the calendar grid + month nav + time picker
				 * without ever scrolling on desktop. react-calendly listens
				 * to Calendly's postMessage and resizes within this height
				 * envelope — 1100px is the comfortable upper bound for the
				 * default scheduling view. */
				height: '1100px',
				width: '100%',
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
	)
}
