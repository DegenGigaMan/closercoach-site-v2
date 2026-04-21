/** @fileoverview Proof Connector A. Thin E1 stat band between S3 How It Works and S4 Features.
 * CT-1 hairline + stat treatment per section-blueprint Proof Connector A. Maintains proof pressure
 * across the scroll. Dark surface continuing from S3. ~60px desktop / ~48px mobile.
 * Zero motion. Geist Mono uppercase muted, centered between AK-style emerald hairlines. */

import type { ReactElement } from 'react'

/**
 * @description Thin dark band with top/bottom emerald hairlines and centered E1 stat.
 * No entrance animation -- a quiet proof beat between two large sections.
 */
export default function SectionProofConnectorA(): ReactElement {
	return (
		<section
			id='proof-connector-a'
			data-surface='dark-connector'
			aria-label='Proof connector'
			className='relative flex items-center justify-center bg-cc-foundation h-[48px] md:h-[60px]'
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
