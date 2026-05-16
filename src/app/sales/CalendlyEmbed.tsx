/** @fileoverview Calendly iframe embed for /sales. Two concerns:
 *
 *   1. UTM propagation. The base CALENDLY_URL is static; if a visitor lands
 *      on /sales?utm_source=... we must forward those params into the
 *      Calendly iframe URL so booking attribution survives. Lazy initial
 *      useState reads window.location.search once at mount (component is
 *      rendered ssr:false via CalendlyWrapper, so window is always defined).
 *
 *   2. One scroll container only — Calendly's own iframe. Earlier attempts
 *      added an outer overflow-y-auto wrapper plus a bottom spacer, which
 *      produced two competing scrollbars (ours + Calendly's) and made
 *      users "switch" scroll targets. The parent card now stays visually
 *      fixed and clipped (overflow-hidden, no scroll). Calendly handles
 *      all internal scrolling for time slots and intake forms. Top crop
 *      via negative margin hides Calendly's redundant top chrome. No
 *      bottom mask — covering the iframe bottom risks hiding the submit
 *      button on long form states, which we cannot patch through a
 *      cross-origin iframe.
 */

'use client'

import { useState } from 'react'

const BASE_CALENDLY_URL =
	'https://calendly.com/taylor-closercoach/demo' +
	'?background_color=FAF9F7' +
	'&primary_color=059669' +
	'&text_color=1A1D26' +
	'&hide_event_type_details=1' +
	'&hide_landing_page_details=1' +
	'&hide_gdpr_banner=1'

/* Visible card viewport (px) on the right panel — fixed, design-locked. */
const CALENDLY_VIEWPORT_HEIGHT = 620
/* Negative top margin hides Calendly's redundant top chrome (event title +
 * timezone selector duplicate). */
const TOP_CROP_PX = 70
/* Iframe height = visible viewport + the masked top chrome. Calendly's
 * internal scroll handles any content taller than this. */
const IFRAME_HEIGHT_PX = CALENDLY_VIEWPORT_HEIGHT + TOP_CROP_PX

const UTM_KEYS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_term',
	'utm_content',
] as const

function buildCalendlyUrl(search: string): string {
	if (!search) return BASE_CALENDLY_URL
	const params = new URLSearchParams(search)
	const utmPairs = UTM_KEYS
		.filter((k) => params.has(k))
		.map((k) => `${k}=${encodeURIComponent(params.get(k) ?? '')}`)
	if (utmPairs.length === 0) return BASE_CALENDLY_URL
	return `${BASE_CALENDLY_URL}&${utmPairs.join('&')}`
}

export default function CalendlyEmbed() {
	const [url] = useState<string>(() =>
		typeof window === 'undefined' ? BASE_CALENDLY_URL : buildCalendlyUrl(window.location.search),
	)

	return (
		<div
			className='relative overflow-hidden'
			style={{ height: `${CALENDLY_VIEWPORT_HEIGHT}px` }}
		>
			{/* Side masks — vertical edges hide Calendly's white iframe border
			    bleeding past the rounded shell corners. */}
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-3' style={{ background: '#FAF9F7' }} />

			<div style={{ marginTop: `-${TOP_CROP_PX}px` }}>
				<iframe
					src={url}
					width='100%'
					height={IFRAME_HEIGHT_PX}
					frameBorder='0'
					style={{ border: 'none', background: '#FAF9F7' } as React.CSSProperties}
					title='Book a demo'
				/>
			</div>
		</div>
	)
}
