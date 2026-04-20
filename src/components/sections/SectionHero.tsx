/** @fileoverview S1 Hero -- centered composition (v1 port with hero phone V2 slot).
 * Atmosphere: L1 dual radial gradient (emerald, centered), L2 noise, L3 particles (desktop only),
 * H11 bottom progressive blur.
 * Stack: AnimatedBadge -> H1 -> subhead -> CTAs -> reassurance -> stars -> app badges -> phone.
 * Phone is HeroPhoneV2 (self-cycling 4-state composite) wrapped in three-layer emerald glow.
 * Perimeter is clean -- no external chips. HeroPhoneV2's internal coaching pills are
 * the only chip moments in the section.
 * Entrance choreography: motion/react translation of v1's GSAP+SplitText timeline.
 * Copy: lp-copy-deck-v5 Section 1 (verbatim). */

'use client'

import { useSyncExternalStore } from 'react'
import Image from 'next/image'
import { Star } from '@phosphor-icons/react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { BRAND, CTA, STATS } from '@/lib/constants'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import ParticleCanvas from '@/components/atmosphere/particle-canvas'
import AnimatedBadge from '@/components/ui/animated-badge'
import HeroPhoneV2 from '@/components/hero/hero-phone-v2'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

/* SSR-safe media query subscription. useSyncExternalStore avoids the
 * set-state-in-effect lint rule and serves an explicit SSR snapshot (false),
 * so the first client render matches the server output. */
function subscribeMediaQuery(query: string) {
	return (onStoreChange: () => void) => {
		const mq = window.matchMedia(query)
		mq.addEventListener('change', onStoreChange)
		return () => mq.removeEventListener('change', onStoreChange)
	}
}

function useMediaQuery(query: string): boolean {
	return useSyncExternalStore(
		subscribeMediaQuery(query),
		() => window.matchMedia(query).matches,
		() => false,
	)
}

export default function SectionHero() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const isDesktop = useMediaQuery('(min-width: 1024px)')

	/* Desktop scroll-linked parallax (motion-spec Section 2 rates). */
	const { scrollY } = useScroll()
	const phoneParallax = useTransform(scrollY, [0, 800], [0, -60])
	const glowParallax = useTransform(scrollY, [0, 800], [0, -30])
	const l1Parallax = useTransform(scrollY, [0, 800], [0, -15])

	/* Shared entrance config. Reduced-motion collapses to instant visibility. */
	const enter = (delay: number, fromY = 12, duration = 0.5) =>
		prefersReducedMotion
			? {
				initial: false as const,
				animate: { opacity: 1, y: 0 },
				transition: { duration: 0 },
			}
			: {
				initial: { opacity: 0, y: fromY },
				animate: { opacity: 1, y: 0 },
				transition: { duration, delay, ease: EASE },
			}

	return (
		<section
			id='hero'
			data-surface='dark-hero'
			className='relative min-h-screen overflow-hidden bg-cc-foundation'
		>
			{/* L1: Dual radial gradient -- emerald-tinted, centered at 50%. */}
			<motion.div
				className='pointer-events-none absolute inset-0 z-0'
				aria-hidden='true'
				initial={prefersReducedMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.55, ease: 'easeInOut' }}
				style={isDesktop && !prefersReducedMotion ? { y: l1Parallax } : undefined}
			>
				<div
					className='absolute inset-0'
					style={{
						background: 'radial-gradient(80vw 70vh ellipse at 50% 55%, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.025) 40%, transparent 70%), radial-gradient(120vw 100vh ellipse at 50% 50%, #1A1D26 0%, #0D0F14 60%)',
					}}
				/>
			</motion.div>

			{/* L2: Noise texture. */}
			<AtmosphereNoise opacity={0.035} />

			{/* L3: Particles -- desktop only (JS-gated so mobile skips the canvas entirely). */}
			{isDesktop && <ParticleCanvas mode='ambient' />}

			{/* H11: Progressive blur on hero bottom edge -- soft transition to S2. */}
			<div
				className='pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-[120px]'
				style={{
					backdropFilter: 'blur(8px)',
					WebkitBackdropFilter: 'blur(8px)',
					maskImage: 'linear-gradient(to bottom, transparent, black)',
					WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
				}}
				aria-hidden='true'
			/>

			{/* Content layer -- centered vertical stack. */}
			<div className='relative z-[5] mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-6 pb-16 pt-28 md:pt-32'>

				{/* Announcement badge (AnimatedBadge replaces v1's static trust pill). */}
				<motion.div className='mb-8' {...enter(0, -8, 0.5)}>
					<AnimatedBadge text={`Join ${STATS.userCount} Sales Closers`} color='#10B981' />
				</motion.div>

				{/* H1 headline -- clipPath line reveal, white with emerald italic accent. */}
				<motion.h1
					className='display-xl max-w-[920px] text-center text-white'
					initial={prefersReducedMotion ? false : { clipPath: 'inset(0 0 100% 0)' }}
					animate={{ clipPath: 'inset(0 0 0% 0)' }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.15, ease: EASE }}
				>
					The AI Sales Coach That Lives{' '}
					<motion.span
						className='font-heading italic'
						initial={prefersReducedMotion ? false : { color: '#FFFFFF' }}
						animate={{ color: '#10B981' }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.95, ease: 'easeOut' }}
					>
						in Your Pocket
					</motion.span>
				</motion.h1>

				{/* Subheadline -- centered, narrow. */}
				<motion.p
					className='mt-6 max-w-[600px] text-center font-sans text-lg leading-relaxed text-cc-text-secondary'
					{...enter(0.35, 12, 0.45)}
				>
					Practice closing deals. Record your meetings. Know exactly why you suck. All from your phone.
				</motion.p>

				{/* CTA cluster -- centered pair, stacked on mobile, row on sm+. */}
				<motion.div
					className='mt-10 flex w-full max-w-[420px] flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4'
					initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.45, ease: EASE }}
				>
					<MotionCTA
						href={CTA.tryFree.href}
						variant='primary'
						size='lg'
						className='w-full sm:w-auto'
					>
						{CTA.tryFree.text}
					</MotionCTA>
					<MotionCTA
						href={CTA.contactSales.href}
						variant='secondary'
						size='lg'
						className='w-full sm:w-auto'
					>
						{CTA.contactSales.text}
					</MotionCTA>
				</motion.div>

				{/* Reassurance line. */}
				<motion.p
					className='mt-5 text-center font-sans text-sm text-cc-text-muted'
					initial={prefersReducedMotion ? false : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.55, ease: EASE }}
				>
					No desktop. No annual contracts.
				</motion.p>

				{/* Stars row -- 4.7 + 5 amber stars + App Store mono label. */}
				<motion.div
					className='mt-8 flex flex-col items-center gap-1.5'
					{...enter(0.6, 8, 0.5)}
				>
					<div className='flex items-center gap-2'>
						<span className='font-heading text-2xl text-white'>
							{STATS.appStoreRating}
						</span>
						<div className='flex items-center gap-0.5' aria-label={`${STATS.appStoreRating} out of 5 stars`}>
							{[0, 1, 2, 3, 4].map(i => (
								<Star key={i} size={14} weight='fill' className='text-cc-amber' />
							))}
						</div>
					</div>
					<span className='font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-cc-text-muted'>
						App Store
					</span>
				</motion.div>

				{/* App Store + Google Play badges. */}
				<motion.div
					className='mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-4'
					{...enter(0.7, 8, 0.4)}
				>
					<a
						href={BRAND.appStore}
						target='_blank'
						rel='noopener noreferrer'
						className='transition-transform hover:scale-105'
					>
						<Image
							src='/images/app-store-badge.svg'
							alt='Download on the App Store'
							width={140}
							height={42}
							className='h-[42px] w-auto'
						/>
					</a>
					<a
						href={BRAND.googlePlay}
						target='_blank'
						rel='noopener noreferrer'
						className='transition-transform hover:scale-105'
					>
						<Image
							src='/images/google-play-badge.svg'
							alt='Get it on Google Play'
							width={140}
							height={42}
							className='h-[42px] w-auto'
						/>
					</a>
				</motion.div>

				{/* Phone composite -- centered below the text block. */}
				<div className='relative z-[8] mt-14 flex w-full items-center justify-center md:mt-16'>

					{/* Three-layer emerald glow -- product as light source. */}
					<motion.div
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
						aria-hidden='true'
						initial={prefersReducedMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 1.1, ease: 'easeOut' }}
						style={isDesktop && !prefersReducedMotion ? { y: glowParallax } : undefined}
					>
						<div
							className='h-[160px] w-[160px] rounded-full md:h-[200px] md:w-[200px]'
							style={{
								boxShadow: '0 0 32px rgba(16,185,129,0.15)',
								background: 'rgba(16,185,129,0.08)',
							}}
						/>
					</motion.div>
					<motion.div
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
						aria-hidden='true'
						initial={prefersReducedMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 1.2, ease: 'easeOut' }}
						style={isDesktop && !prefersReducedMotion ? { y: glowParallax } : undefined}
					>
						<div
							className='h-[320px] w-[320px] rounded-full blur-[64px] md:h-[400px] md:w-[400px]'
							style={{ background: 'rgba(16,185,129,0.10)' }}
						/>
					</motion.div>
					<motion.div
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
						aria-hidden='true'
						initial={prefersReducedMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 1.3, ease: 'easeOut' }}
						style={isDesktop && !prefersReducedMotion ? { y: glowParallax } : undefined}
					>
						<div
							className='h-[440px] w-[440px] rounded-full blur-[200px] md:h-[560px] md:w-[560px]'
							style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
						/>
					</motion.div>

					{/* Phone frame wrapper. HeroPhoneV2 ships a 320px phone inside px-40 gutters
					 * (640px outer footprint). No external chips -- the phone stands alone,
					 * with its internal coaching pills carrying all chip moments. */}
					<div className='relative'>
						{/* Phone -- parallax on desktop, enters from below with subtle scale. */}
						<motion.div
							className='relative'
							initial={prefersReducedMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.8, ease: EASE }}
							style={isDesktop && !prefersReducedMotion ? { y: phoneParallax } : undefined}
						>
							{/* Scale wrapper: down-scale on small viewports so the 640px composite
							 * fits 390px mobile without overflow. lg+ renders at full scale. */}
							<div className='origin-top scale-[0.58] sm:scale-[0.72] md:scale-[0.85] lg:scale-100'>
								<HeroPhoneV2 />
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	)
}
