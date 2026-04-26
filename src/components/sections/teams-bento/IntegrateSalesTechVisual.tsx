/** @fileoverview S6 Card 6 visual — "Integrate Your Existing Sales Technology".
 *
 * Composition (per Figma 81-4702, full col-span-3 row 3 on lg+):
 *   ─ Center: CC logomark hub orb with emerald glow.
 *   ─ Left satellite: generic user/contact icon (representing the rep team).
 *   ─ Right column satellites stacked: Salesforce (top), HubSpot (mid),
 *     GoHighLevel-style "rising bars" icon (bottom).
 *   ─ AnimatedBeam connectors flow from each satellite to the CC hub.
 *
 * Mobile (<lg): satellites collapse into a single horizontal row with the
 * hub orb in the centre, beams hidden (animation budget). */

'use client'

import Image from 'next/image'
import { useRef, type ReactElement, type RefObject } from 'react'
import { Sparkle, User } from '@phosphor-icons/react'
import { AnimatedBeam } from '@/components/ui/animated-beam'

const HUBSPOT_ICON = (
	<svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true' fill='#FF7A59'>
		<path d='M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z' />
	</svg>
)

const HIGHLEVEL_ICON = (
	<svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true' fill='none'>
		{/* Three rising bars in CC palette amber/emerald — abstract "growth" mark for GoHighLevel */}
		<rect x='4' y='14' width='3.5' height='6' rx='1' fill='#3B82F6' />
		<rect x='10' y='10' width='3.5' height='10' rx='1' fill='#F59E0B' />
		<rect x='16' y='6' width='3.5' height='14' rx='1' fill='#F59E0B' />
		<path d='M5.5 14L11.5 10L17.5 6' stroke='#FBBF24' strokeWidth='1.2' strokeLinecap='round' />
		<path d='M16 6L17.5 4M17.5 4L19 6M17.5 4V8' stroke='#FBBF24' strokeWidth='1.2' strokeLinecap='round' />
	</svg>
)

function SatelliteOrb({
	innerRef,
	children,
}: {
	innerRef: RefObject<HTMLDivElement | null>
	children: ReactElement
}): ReactElement {
	return (
		<div
			ref={innerRef}
			className='relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-cc-surface-border bg-cc-surface-card shadow-[0_4px_12px_rgba(0,0,0,0.35)]'
		>
			{children}
		</div>
	)
}

export default function IntegrateSalesTechVisual(): ReactElement {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const hubRef = useRef<HTMLDivElement | null>(null)
	const userRef = useRef<HTMLDivElement | null>(null)
	const sfRef = useRef<HTMLDivElement | null>(null)
	const hsRef = useRef<HTMLDivElement | null>(null)
	const ghlRef = useRef<HTMLDivElement | null>(null)

	return (
		<div
			ref={containerRef}
			className='relative h-full w-full overflow-hidden bg-cc-foundation px-6 py-8 md:px-10'
		>
			{/* Composition layout: 3-column horizontal grid with the CC hub centred.
			 * On lg+ the right satellites form a vertical column; on smaller widths
			 * everything reflows into a single horizontal row. */}
			<div className='relative flex h-full items-center justify-between'>
				{/* Left satellite: generic user icon */}
				<SatelliteOrb innerRef={userRef}>
					<User size={20} weight='regular' className='text-cc-text-secondary' />
				</SatelliteOrb>

				{/* Centre hub: CC sparkle (matches the rest of the bento's emerald
				 * sparkle vocabulary used for "AI orb" moments across cards 1, 3,
				 * 4, 5). Wave M chose the sparkle over the wordmark logo so the
				 * hub reads as the AI brain receiving from the satellites rather
				 * than as a brand mark. */}
				<div
					ref={hubRef}
					className='relative z-20 flex h-16 w-16 items-center justify-center rounded-full bg-cc-foundation-deep ring-2 ring-cc-accent shadow-[0_0_32px_rgba(16,185,129,0.55)]'
				>
					<Sparkle size={28} weight='fill' className='text-cc-accent' aria-label='CloserCoach AI hub' />
				</div>

				{/* Right satellites: stacked vertically on lg+, horizontal on sm */}
				<div className='flex flex-row items-center gap-3 sm:flex-col'>
					<SatelliteOrb innerRef={sfRef}>
						<Image
							src='/images/step1/logo-salesforce.svg'
							alt='Salesforce'
							width={24}
							height={24}
							className='h-6 w-6 object-contain'
							unoptimized
						/>
					</SatelliteOrb>
					<SatelliteOrb innerRef={hsRef}>{HUBSPOT_ICON}</SatelliteOrb>
					<SatelliteOrb innerRef={ghlRef}>{HIGHLEVEL_ICON}</SatelliteOrb>
				</div>
			</div>

			{/* Connecting beams (lg+ only — narrow widths skip beams for clarity) */}
			<div className='pointer-events-none absolute inset-0 hidden lg:block'>
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={userRef}
					toRef={hubRef}
					pathColor='rgba(16,185,129,0.18)'
					pathWidth={1.5}
					gradientStartColor='#10B981'
					gradientStopColor='#34E18E'
					duration={4}
				/>
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={sfRef}
					toRef={hubRef}
					pathColor='rgba(16,185,129,0.18)'
					pathWidth={1.5}
					gradientStartColor='#10B981'
					gradientStopColor='#34E18E'
					duration={4}
					reverse
					delay={0.6}
				/>
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={hsRef}
					toRef={hubRef}
					pathColor='rgba(16,185,129,0.18)'
					pathWidth={1.5}
					gradientStartColor='#10B981'
					gradientStopColor='#34E18E'
					duration={4}
					reverse
					delay={1.2}
				/>
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={ghlRef}
					toRef={hubRef}
					pathColor='rgba(16,185,129,0.18)'
					pathWidth={1.5}
					gradientStartColor='#10B981'
					gradientStopColor='#34E18E'
					duration={4}
					reverse
					delay={1.8}
				/>
			</div>
		</div>
	)
}
