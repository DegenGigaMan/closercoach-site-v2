'use client'

const CALENDLY_URL =
	'https://calendly.com/taylor-closercoach/demo' +
	'?background_color=FAF9F7' +
	'&primary_color=059669' +
	'&text_color=1A1D26' +
	'&hide_event_type_details=1' +
	'&hide_landing_page_details=1' +
	'&hide_gdpr_banner=1'

export default function CalendlyEmbed() {
	return (
		/* Clip top (hide Calendly header/nav) and bottom (hide cookie strip) */
		<div className='relative overflow-hidden' style={{ maxHeight: '620px' }}>
			{/* Side masks */}
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-3' style={{ background: '#FAF9F7' }} />
			{/* Bottom mask — covers the "Cookie settings" gray strip */}
			<div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24' style={{ background: '#FAF9F7' }} />

			<div style={{ marginTop: '-70px' }}>
				<iframe
					src={CALENDLY_URL}
					width='100%'
					height='900'
					frameBorder='0'
					style={{ border: 'none', background: '#FAF9F7' } as React.CSSProperties}
					title='Book a demo'
				/>
			</div>
		</div>
	)
}
