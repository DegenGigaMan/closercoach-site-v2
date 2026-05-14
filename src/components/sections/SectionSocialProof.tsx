'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const AVATARS = [
	{ src: '/images/avatars/closer-1.png', alt: '' },
	{ src: '/images/avatars/closer-2.webp', alt: '' },
	{ src: '/images/avatars/closer-3.webp', alt: '' },
] as const

const LOGOS = [
	{ name: 'Mercedes-Benz', file: '/logos/mercedes-benz.svg', width: 126, height: 32, heightClass: 'h-8' },
	{ name: 'Morgan Stanley', file: '/logos/morgan-stanley.svg', width: 167, height: 24, heightClass: 'h-[22px]' },
	{ name: 'Liberty Mutual', file: '/logos/liberty-mutual.svg', width: 158, height: 40, heightClass: 'h-9' },
	{ name: 'Family First Life', file: '/logos/family-first-life.png', width: 160, height: 34, heightClass: 'h-7' },
	{ name: 'Coverd', file: '/logos/coverd.svg', width: 127, height: 28, heightClass: 'h-7' },
	{ name: 'Aroma360', file: '/logos/aroma360.svg', width: 253, height: 24, heightClass: 'h-5' },
] as const

function LogoPass({ ariaHidden = false }: { ariaHidden?: boolean }) {
	return (
		<div className='flex items-center' aria-hidden={ariaHidden}>
			{LOGOS.map((logo) => (
				<div
					key={`${ariaHidden ? 'b' : 'a'}-${logo.name}`}
					className='mx-9 inline-flex shrink-0 select-none items-center'
					aria-label={ariaHidden ? undefined : logo.name}
				>
					<Image
						src={logo.file}
						alt={ariaHidden ? '' : logo.name}
						width={logo.width}
						height={logo.height}
						className={`${logo.heightClass} w-auto object-contain`}
						loading='lazy'
					/>
				</div>
			))}
		</div>
	)
}

export default function SectionSocialProof() {
	const trackContainerRef = useRef<HTMLDivElement>(null)
	const [duration, setDuration] = useState(0)

	const measure = useCallback(() => {
		const container = trackContainerRef.current
		if (!container) return
		const track = container.querySelector('[data-marquee-track]') as HTMLElement | null
		if (!track) return
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) {
			setDuration(0)
			return
		}
		const trackWidth = track.scrollWidth / 2
		if (trackWidth > 0) setDuration(trackWidth / 40)
	}, [])

	useEffect(() => {
		const frame = requestAnimationFrame(measure)
		const track = trackContainerRef.current?.querySelector('[data-marquee-track]') as HTMLElement | null
		if (!track) return () => cancelAnimationFrame(frame)
		const observer = new ResizeObserver(measure)
		observer.observe(track)
		return () => {
			cancelAnimationFrame(frame)
			observer.disconnect()
		}
	}, [measure])

	return (
		<section
			id='social-proof'
			data-surface='warm'
			className='relative overflow-hidden bg-cc-warm py-14 md:py-16'
		>
			{/* Top transition: soft fade from dark S1 */}
			<div
				className='pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-cc-foundation/10 to-transparent'
				aria-hidden='true'
			/>

			<div className='mx-auto max-w-7xl px-6'>
					<p className='mx-auto mb-8 max-w-2xl text-center text-xs uppercase tracking-[0.14em] text-cc-text-secondary-warm md:mb-10 md:text-[13px]'>
					Trusted by closers across Insurance, Financial, Real Estate, Automotive, and Home Services.
				</p>

				{/* Editorial row: avatar anchor + marquee */}
				<div className='flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10'>
					{/* Avatar anchor */}
					<div className='flex shrink-0 items-center gap-3'>
						<div className='flex -space-x-3'>
							{AVATARS.map((avatar, i) => (
								<div
									key={avatar.src}
									className='relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-cc-warm'
									style={{ zIndex: AVATARS.length - i }}
								>
									<Image
										src={avatar.src}
										alt={avatar.alt}
										fill
										sizes='40px'
										className='object-cover'
									/>
								</div>
							))}
						</div>
						<div className='flex flex-col gap-2'>
							<span
								className='text-trim text-cc-accent-on-warm'
								style={{
									fontFamily: 'var(--font-heading)',
									fontWeight: 700,
									fontSize: '20px',
									lineHeight: 'normal',
								}}
							>
								36,000+
							</span>
							<span className='text-trim text-xs leading-[16px] text-cc-text-secondary-warm'>
								sales closers
							</span>
						</div>
					</div>

					{/* Vertical hairline (desktop only, visual tie between anchor and marquee) */}
					<div
						className='hidden h-10 w-px bg-cc-warm-border md:block'
						aria-hidden='true'
					/>

						<div
						ref={trackContainerRef}
						className='group relative w-full overflow-hidden'
						role='marquee'
						aria-label='Companies using CloserCoach'
					>
						{/* Fade edges */}
						<div
							className='pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cc-warm to-transparent'
							aria-hidden='true'
						/>
						<div
							className='pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cc-warm to-transparent'
							aria-hidden='true'
						/>
						<div
							data-marquee-track
							className='flex w-max items-center [&:active]:[animation-play-state:paused] md:group-hover:[animation-play-state:paused]'
							style={{
								animation: duration > 0
									? `marquee-scroll ${duration}s linear infinite`
									: 'none',
								touchAction: 'pan-y',
							}}
						>
							<LogoPass />
							<LogoPass ariaHidden />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
