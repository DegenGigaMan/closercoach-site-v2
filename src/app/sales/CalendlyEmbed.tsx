'use client'

/** @fileoverview Calendly InlineWidget — auto-sized via Calendly's postMessage
 *  height events so the iframe never needs an internal scrollbar. Loaded
 *  client-only via dynamic({ ssr: false }) in CalendlyWrapper to avoid
 *  hydration mismatch.
 *
 *  H-05 v2 (2026-05-05): the previous wrapping div + ring approach left a
 *  visible white container around the iframe because react-calendly's
 *  internal `<div class="calendly-inline-widget">` ships with no background
 *  and the iframe's pre-load default is white. The CSS override in
 *  globals.css wasn't beating the inline style. Solution: render the
 *  InlineWidget completely flush — no outer wrapping, no ring. Force the
 *  iframe transparent via inline `colorScheme: dark` (browser hint to draw
 *  the iframe on the parent's bg) plus the globals.css `!important` rule
 *  on `.calendly-inline-widget iframe`. */

import { InlineWidget } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/taylor-closercoach/demo'

export default function CalendlyEmbed() {
	return (
		<InlineWidget
			url={CALENDLY_URL}
			styles={{
				height: '700px',
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
	)
}
