import type { ReactElement } from 'react'

export default function SectionProofConnectorA(): ReactElement {
	return (
		<section
			id='proof-connector-a'
			data-surface='dark-connector'
			aria-label='Proof connector'
			className='relative flex items-center justify-center overflow-hidden bg-cc-foundation h-[48px] md:h-[60px]'
		>
			{/* Top hairline: emerald 10%, full-width edge-to-transparent-to-edge gradient */}
			<div
				className='pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>

			<p className='px-6 text-center font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-cc-text-muted'>
				3,000+ calls analyzed daily
			</p>

			{/* Bottom hairline */}
			<div
				className='pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cc-accent/20 to-transparent'
				aria-hidden='true'
			/>
		</section>
	)
}
