/** @fileoverview Proof Connector B. Surface shift strip between S4 Features (dark) and
 * S5 Results (warm). Pure visual seam — no text content.
 *
 * Composition per Q17 Wave E (Andy 2026-04-29 #19) — Variant A locked from
 * /lab/transition-explorations:
 *   1. Solid dark foundation (#0D0F14) carrying the seam — no gradient mush.
 *   2. Hard diagonal seam: SVG polygon transitions to warm (#F5F0EB) along an
 *      asymmetric diagonal (0,100 → 1440,40), producing a sharp editorial cut.
 *   3. Emerald hairline (1px, #10B981 with edge fade) traces the diagonal seam
 *      as a brand-light moment.
 *
 * AL-016 (Alim 2026-05-01 AM Slack): cut the App Store Review eyebrow + Lora
 * Bold Italic pull quote that previously sat above the diagonal. The section
 * is now a silent dark beat between S4 (warm/dark) and S5 (warm light) —
 * proof carrying moves to S5 reviews + tier cards downstream. Vertical
 * padding tightened (py-20/24 → py-16/20) since no text occupies the band.
 *
 * Lab reference: /lab/transition-explorations Variant A (preserved for record).
 *
 * Diagonal strip is 120px mobile / 140px desktop. The whole section is
 * decorative (aria-hidden) since no text content remains. */

'use client'

import type { ReactElement } from 'react'

/**
 * @description Surface shift strip. Solid dark foundation feeds into a diagonal
 * warm wedge with an emerald hairline along the seam. Pure visual transition
 * between S4 (dark/warm features) and S5 (warm light results) — no text.
 */
export default function SectionProofConnectorB(): ReactElement {
	return (
		<>
			<section
				id='proof-connector-b'
				data-surface='dark-seam'
				aria-hidden='true'
				className='relative bg-cc-foundation py-16 md:py-20'
			/>
			{/* Q17 Wave E (Andy #19): diagonal cut + emerald hairline transition.
			    Replaces the prior multi-stop gradient mush. Lab Variant A locked. */}
			<div
				aria-hidden='true'
				className='relative h-[120px] overflow-hidden md:h-[140px]'
				data-transition='diagonal-emerald-hairline'
			>
				{/* Top half: dark foundation */}
				<div className='absolute inset-x-0 top-0 h-full bg-cc-foundation' />
				{/* Diagonal warm wedge */}
				<svg
					className='absolute inset-0 h-full w-full'
					viewBox='0 0 1440 140'
					preserveAspectRatio='none'
				>
					<polygon points='0,140 1440,140 1440,40 0,100' fill='#F5F0EB' />
				</svg>
				{/* Emerald hairline along the diagonal seam */}
				<svg
					className='pointer-events-none absolute inset-0 h-full w-full'
					viewBox='0 0 1440 140'
					preserveAspectRatio='none'
				>
					<defs>
						<linearGradient id='cc-proof-b-glow' x1='0%' y1='0%' x2='100%' y2='0%'>
							<stop offset='0%' stopColor='#10B981' stopOpacity='0' />
							<stop offset='50%' stopColor='#10B981' stopOpacity='0.85' />
							<stop offset='100%' stopColor='#10B981' stopOpacity='0' />
						</linearGradient>
					</defs>
					<line x1='0' y1='100' x2='1440' y2='40' stroke='url(#cc-proof-b-glow)' strokeWidth='2' />
				</svg>
			</div>
		</>
	)
}
