'use client'

/** @fileoverview Calendly raw iframe embed — client-only (no SSR).
 *  Imported via dynamic({ ssr: false }) in page.tsx to avoid hydration
 *  mismatch (server can't predict the iframe src hash). */

const CALENDLY_URL =
	'https://calendly.com/taylor-closercoach/demo' +
	'?embed_type=Inline' +
	'&hide_landing_page_details=1&hide_gdpr_banner=1' +
	'&hide_event_type_details=1' +
	'&background_color=0d0f14&text_color=ffffff&primary_color=10b981'

export default function CalendlyEmbed() {
	return (
		<iframe
			src={CALENDLY_URL}
			width='100%'
			height='100%'
			frameBorder='0'
			scrolling='yes'
			title='Book a Demo with CloserCoach'
			style={{
				display: 'block',
				border: 'none',
				minWidth: 320,
				minHeight: 560,
				background: '#0d0f14',
			}}
		/>
	)
}
