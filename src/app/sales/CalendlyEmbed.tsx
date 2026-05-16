/** @fileoverview Calendly iframe embed for /sales. Two launch-critical
 * concerns handled here:
 *
 *   1. UTM propagation. The base CALENDLY_URL is static; if a visitor lands
 *      on /sales?utm_source=... we must forward those params into the
 *      Calendly iframe URL so booking attribution survives. Reading
 *      window.location.search at mount time (component is dynamic +
 *      ssr:false, so window is always defined here).
 *
 *   2. Iframe viewport alignment. Previously the parent was 620px tall but
 *      the iframe rendered at 900px, leaving 280px of Calendly's internal
 *      viewport clipped below the visible window. Calendly's own
 *      auto-scroll-into-view sometimes scrolled long forms past the
 *      visible area so users could not reach the Submit button. Fix:
 *      visible viewport (parent maxHeight) and iframe height now align —
 *      iframe height = parent maxHeight + |marginTop|, so Calendly's
 *      internal viewport matches the user-visible window minus the masked
 *      top chrome. Form content fits without the form-bottom getting
 *      clipped.
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

/* Visible viewport (px) on the right panel. Tuned to fit the typical
 * Calendly booking form (Email / Name / Company / Phone / radio group /
 * Submit) without bottom clipping. Iframe height below matches this +
 * the 70px masked top chrome. */
const VISIBLE_VIEWPORT_PX = 760
const TOP_CHROME_MASK_PX = 70
const IFRAME_HEIGHT_PX = VISIBLE_VIEWPORT_PX + TOP_CHROME_MASK_PX

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
	/* Lazy initial state: component is rendered ssr:false via CalendlyWrapper,
	 * so `window` is always defined here. Read the live search string once at
	 * mount and never recompute (booking link stays stable per page load). */
	const [url] = useState<string>(() =>
		typeof window === 'undefined' ? BASE_CALENDLY_URL : buildCalendlyUrl(window.location.search),
	)

	return (
		/* Clip top (hide Calendly header/nav) and bottom (hide cookie strip) */
		<div className='relative overflow-hidden' style={{ maxHeight: `${VISIBLE_VIEWPORT_PX}px` }}>
			{/* Side masks */}
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			{/* Bottom mask — covers the "Cookie settings" gray strip */}
			<div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24' style={{ background: '#FAF9F7' }} />

			<div style={{ marginTop: `-${TOP_CHROME_MASK_PX}px` }}>
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
