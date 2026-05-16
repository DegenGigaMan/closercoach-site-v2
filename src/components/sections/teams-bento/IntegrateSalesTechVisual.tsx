'use client'

import Image from 'next/image'
import { useRef, type ReactElement, type RefObject } from 'react'
import { User } from '@phosphor-icons/react'
import { AnimatedBeam } from '@/components/ui/animated-beam'

const HUBSPOT_ICON = (
	<svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true' fill='#FF7A59'>
		<path d='M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z' />
	</svg>
)

const HIGHLEVEL_ICON = (
	<svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true'>
		<circle cx='12' cy='12' r='11' fill='#FF7A00' />
		<path
			d='M12.6 7.4c-2.7 0-4.9 2.1-4.9 4.7s2.2 4.7 4.9 4.7c1.5 0 2.8-.6 3.7-1.6v-3.5h-3.7v1.7h1.9v1.1c-.5.4-1.2.6-1.9.6-1.7 0-3.1-1.3-3.1-3 0-1.7 1.4-3 3.1-3 .9 0 1.7.4 2.3 1l1.3-1.3C14.9 7.9 13.8 7.4 12.6 7.4z'
			fill='#FFFFFF'
		/>
	</svg>
)

function SatelliteOrb({
	innerRef,
	children,
	size = 'md',
}: {
	innerRef: RefObject<HTMLDivElement | null>
	children: ReactElement
	size?: 'sm' | 'md'
}): ReactElement {
	const dim = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'
	return (
		<div
			ref={innerRef}
			className={`relative z-10 flex ${dim} items-center justify-center rounded-full border border-cc-surface-border bg-cc-surface-card shadow-[0_4px_12px_rgba(0,0,0,0.35)]`}
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
			className='relative h-full w-full overflow-hidden px-5 py-6 md:px-8 md:py-8'
		>
			{/* Mobile layout: centred horizontal row, all 5 nodes in one line.
			    Desktop (lg+): same justify-between but right satellites go vertical. */}
			<div className='relative flex h-full items-center justify-between gap-2'>

				{/* Left satellite: user icon */}
				<SatelliteOrb innerRef={userRef} size='sm'>
					<User size={18} weight='regular' className='text-cc-text-secondary' />
				</SatelliteOrb>

				{/* Centre hub */}
				<div
					ref={hubRef}
					className='relative z-20 flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-[0_0_0_1px_rgba(16,185,129,0.3),0_0_16px_rgba(16,185,129,0.15)]'
					style={{
						background: 'radial-gradient(ellipse at center, rgba(8,40,4,1) 30%, rgba(4,20,2,1) 65%, rgba(2,10,1,1) 82%, rgba(0,0,0,1) 100%)',
					}}
				>
					<Image
						src='/images/cc-logomark.png'
						alt='CloserCoach AI hub'
						width={30}
						height={30}
						sizes='30px'
						className='h-[30px] w-[30px] object-contain'
						unoptimized
					/>
				</div>

				{/* Right satellites — vertical column on all screen sizes */}
				<div className='flex flex-col items-center gap-3'>
					<SatelliteOrb innerRef={sfRef} size='sm'>
						<Image
							src='/images/step1/logo-salesforce.svg'
							alt='Salesforce'
							width={22}
							height={22}
							className='h-[22px] w-[22px] object-contain'
							unoptimized
						/>
					</SatelliteOrb>
					<SatelliteOrb innerRef={hsRef} size='sm'>{HUBSPOT_ICON}</SatelliteOrb>
					<SatelliteOrb innerRef={ghlRef} size='sm'>{HIGHLEVEL_ICON}</SatelliteOrb>
				</div>
			</div>

			{/* Animated beams — visible on all screen sizes */}
			<div className='pointer-events-none absolute inset-0'>
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={userRef}
					toRef={hubRef}
					pathColor='rgba(16,185,129,0.30)'
					pathOpacity={0.6}
					pathWidth={1.5}
					gradientStartColor='#10B981'
					gradientStopColor='#34E18E'
					duration={4}
				/>
				<AnimatedBeam
					containerRef={containerRef}
					fromRef={sfRef}
					toRef={hubRef}
					pathColor='rgba(16,185,129,0.30)'
					pathOpacity={0.6}
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
					pathColor='rgba(16,185,129,0.30)'
					pathOpacity={0.6}
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
					pathColor='rgba(16,185,129,0.30)'
					pathOpacity={0.6}
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
