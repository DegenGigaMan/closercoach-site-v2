/** @fileoverview Calendly iframe embed for /sales. Two launch-critical
 * concerns handled here:
 *
 *   1. UTM propagation. The base CALENDLY_URL is static; if a visitor lands
 *      on /sales?utm_source=... we must forward those params into the
 *      Calendly iframe URL so booking attribution survives. Lazy initial
 *      useState reads window.location.search once at mount (component is
 *      rendered ssr:false via CalendlyWrapper, so window is always defined).
 *
 *   2. Scrollable Calendly shell (not "fit"). Calendly's internal steps
 *      (event-type page, time-slot grid, intake form) all have dynamic
 *      heights. Picking any static iframe height that "fits" only changes
 *      where the cutoff happens. Instead we keep the card visually fixed
 *      (parent height = CALENDLY_VIEWPORT_HEIGHT) and make that shell
 *      vertically scrollable (overflow-y-auto). The iframe renders taller
 *      than visible (IFRAME_HEIGHT) and a bottom spacer below the iframe
 *      ensures the user can always scroll the submit button above the
 *      fixed bottom mask. overscroll-behavior:contain prevents scroll
 *      chaining into the page when the shell hits its scroll end.
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
/* Iframe rendered height. Intentionally taller than the visible window so
 * Calendly's internal time-slot / intake form variants all have room to
 * render fully; the user scrolls our shell to reach the bottom. */
const IFRAME_HEIGHT_PX = 1000
/* Bottom spacer pushes Calendly's submit row above the fixed bottom mask
 * when the user scrolls to the end of the iframe. Without this the mask
 * permanently covers the last ~48px of the iframe, including the submit
 * button on long forms. */
const SCROLL_PADDING_BOTTOM_PX = 160
/* Bottom mask height — covers Calendly's cookie strip + faint shadow at
 * the iframe-top alignment. Smaller than before (was h-24/96px) so the
 * scroll-up move actually exposes the submit button. */
const BOTTOM_MASK_HEIGHT_PX = 48

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
			className='relative overflow-x-hidden overflow-y-auto'
			style={{
				height: `${CALENDLY_VIEWPORT_HEIGHT}px`,
				maxHeight: `${CALENDLY_VIEWPORT_HEIGHT}px`,
				overscrollBehavior: 'contain',
			}}
		>
			{/* Side masks — vertical edges hide Calendly's white iframe border
			    bleeding past the rounded shell corners. */}
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			{/* Bottom mask — small enough that the scroll-up move can clear it. */}
			<div
				className='pointer-events-none absolute inset-x-0 bottom-0 z-10'
				style={{ height: `${BOTTOM_MASK_HEIGHT_PX}px`, background: '#FAF9F7' }}
			/>

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

			{/* Bottom spacer — sits inside the scroll container so users can
			    scroll the submit row above the fixed bottom mask. */}
			<div style={{ height: `${SCROLL_PADDING_BOTTOM_PX}px` }} aria-hidden='true' />
		</div>
	)
}
