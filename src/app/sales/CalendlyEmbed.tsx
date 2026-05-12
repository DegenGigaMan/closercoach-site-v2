'use client'

const CALENDLY_URL =
	'https://calendly.com/taylor-closercoach/demo' +
	'?background_color=0d0f14' +
	'&primary_color=10b981' +
	'&text_color=ffffff' +
	'&hide_event_type_details=1' +
	'&hide_landing_page_details=1' +
	'&hide_gdpr_banner=1'

const BG = '#0d0f14'

export default function CalendlyEmbed() {
	return (
		<div className='relative overflow-hidden' style={{ maxHeight: '660px' }}>
			{/* Mask strips to hide Calendly's white border artifacts */}
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-3' style={{ background: BG }} />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-3' style={{ background: BG }} />
			<div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10' style={{ background: BG }} />

			<div style={{ marginTop: '-70px' }}>
				<iframe
					src={CALENDLY_URL}
					width='100%'
					height='860'
					frameBorder='0'
					style={{
						border: 'none',
						background: BG,
						colorScheme: 'dark',
					} as React.CSSProperties}
					title='Book a demo'
				/>
			</div>
		</div>
	)
}
