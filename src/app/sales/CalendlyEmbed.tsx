'use client'

import { InlineWidget } from 'react-calendly'

const CALENDLY_URL = 'https://calendly.com/taylor-closercoach/demo'
const BG = '#0d0f14'

export default function CalendlyEmbed() {
	return (
		/* overflow-hidden + maxHeight clips the bottom white border.
		 * Negative marginTop pulls the iframe up, hiding the white top border. */
		<div className='relative overflow-hidden' style={{ maxHeight: '560px' }}>
			<div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-4' style={{ background: BG }} />
			<div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-4' style={{ background: BG }} />
			<div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12' style={{ background: BG }} />
			<div style={{ marginTop: '-70px' }}>
				<InlineWidget
					url={CALENDLY_URL}
					styles={{
						height: '860px',
						width: '100%',
						minWidth: 0,
						colorScheme: 'dark',
						background: BG,
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
