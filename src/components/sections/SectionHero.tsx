'use client'

import { useSyncExternalStore } from 'react'
import Image from 'next/image'
import { AppleLogo, AndroidLogo, Globe } from '@phosphor-icons/react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { BRAND, CTA, STATS } from '@/lib/constants'
import { track } from '@/lib/analytics'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import AnimatedBadge from '@/components/ui/animated-badge'
import HeroPhoneV3 from '@/components/hero/hero-phone-v3'

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
	const l1Parallax = useTransform(scrollY, [0, 800], [0, -15])

	const enter = (delay: number, fromY = 12, duration = 0.55) => ({
		initial: { opacity: 0, y: fromY },
		animate: { opacity: 1, y: 0 },
		transition: prefersReducedMotion
			? { duration: 0 }
			: { duration, delay, ease: EASE },
	})

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
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.6, ease: 'easeInOut' }}
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

			{/* Progressive blur on hero bottom edge -- soft transition to S2. */}
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

			<div className='relative z-[5] mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-6 pb-16 pt-16 md:pt-20 2xl:max-w-[1440px]'>

				<motion.div className='mb-8' {...enter(0, -8)}>
					<AnimatedBadge text={`Join ${STATS.userCount} Sales Closers`} color='#10B981' />
				</motion.div>

				<h1
					className='max-w-[920px] text-center text-white'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontSize: 'clamp(2.5rem, 6vw, 72px)',
						lineHeight: 0.933,
					}}
				>
					The AI Sales Coach That Lives{' '}
					<motion.span
						className='font-heading italic'
						initial={{ color: '#FFFFFF' }}
						animate={{ color: '#10B981' }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 1.0, ease: 'easeOut' }}
					>
						in Your Pocket
					</motion.span>
				</h1>

			<p className='mt-6 max-w-[600px] text-center font-sans text-lg leading-relaxed text-cc-text-secondary'>
					Practice closing deals. Record your meetings. Know exactly where you&rsquo;re losing deals. All from your phone.
				</p>

				<div
					className='mt-10 flex w-full max-w-[420px] flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4'
				>
					{/* Wrapped in span+onClickCapture to instrument the click without
					 * disrupting MotionCTA's transition behavior. span.contents is
					 * Grid/Flex-safe (acts as if it weren't in the layout box). */}
					<span
						className='contents'
						onClickCapture={() => track('hero_cta_click', { cta_text: CTA.tryFree.text, destination: CTA.tryFree.href, location: 'hero', position: 'primary' })}
					>
						<MotionCTA
							href={CTA.tryFree.href}
							variant='primary'
							size='lg'
							className='w-full sm:w-auto'
							dataPrimaryCta
						>
							{CTA.tryFree.text}
						</MotionCTA>
					</span>
					<span
						className='contents'
						onClickCapture={() => track('hero_cta_click', { cta_text: CTA.contactSales.text, destination: CTA.contactSales.href, location: 'hero', position: 'secondary' })}
					>
						<MotionCTA
							href={CTA.contactSales.href}
							variant='secondary'
							size='lg'
							className='w-full sm:w-auto'
							dataPrimaryCta
						>
							{CTA.contactSales.text}
						</MotionCTA>
					</span>
				</div>

			<motion.div
					className='mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center font-sans text-sm text-cc-text-muted'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.55, ease: EASE }}
				>
					<span className='inline-flex items-center gap-1.5'>
						<AppleLogo size={14} weight='fill' aria-hidden='true' />
						<span>iOS</span>
					</span>
					<span className='text-cc-text-muted/40' aria-hidden='true'>·</span>
					<span className='inline-flex items-center gap-1.5'>
						<AndroidLogo size={14} weight='fill' aria-hidden='true' />
						<span>Android</span>
					</span>
					<span className='text-cc-text-muted/40' aria-hidden='true'>·</span>
					<span className='inline-flex items-center gap-1.5'>
						<Globe size={14} weight='regular' aria-hidden='true' />
						<span>Web</span>
					</span>
				</motion.div>

			<motion.div
					className='mt-8 flex flex-col items-center gap-2'
					{...enter(0.6, 8)}
				>
					<div className='flex flex-col items-center gap-1'>
						<span
							className='text-trim text-white'
							style={{
								fontFamily: 'var(--font-heading)',
								fontWeight: 700,
								fontSize: '38px',
								lineHeight: '38px',
								letterSpacing: '-1.52px',
							}}
						>
							{STATS.appStoreRating}
						</span>
					</div>
					<div
						role='img'
						className='flex items-center gap-[2px]'
						aria-label={`${STATS.appStoreRating} out of 5 stars from ${STATS.appStoreReviews} reviews`}
					>
						{[0, 1, 2, 3, 4].map((i) => (
							<Image
								key={i}
								src='/images/rating-star.svg'
								alt=''
								width={16}
								height={16}
								className='h-4 w-4'
							/>
						))}
					</div>
					<div className='flex items-center justify-center gap-2'>
						<Image
							src='/images/app-store-icon.svg'
							alt=''
							width={24}
							height={24}
							className='h-6 w-6'
						/>
						<span
							className='text-trim'
							style={{
								fontFamily: 'var(--font-sans)',
								fontSize: '16px',
								lineHeight: '20px',
								color: '#C5C9CE',
							}}
						>
							App Store
							
						</span>
					</div>
				</motion.div>

				{/* Phone composite -- centered below the text block. */}
				<div className='relative z-[8] mt-14 flex w-full items-center justify-center md:mt-16'>

					{/* Phone frame wrapper. HeroPhoneV3 ships a 320px phone inside px-40 gutters
					 * (640px outer footprint). No external chips -- the phone stands alone,
					 * with its internal product UI carrying all chrome. */}
					<div className='relative'>
						{/* Phone -- parallax on desktop, enters from below with subtle scale. */}
						<motion.div
							className='relative'
							initial={{ opacity: 0, y: 32, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.8, ease: EASE }}
							style={isDesktop && !prefersReducedMotion ? { y: phoneParallax } : undefined}
						>
							<div className='origin-top scale-[0.82] sm:scale-[0.88] md:scale-[0.92] lg:scale-100 mb-[-130px] sm:mb-[-90px] md:mb-[-50px] lg:mb-0'>
								<HeroPhoneV3 />
							</div>
						</motion.div>
					</div>
				</div>

			<motion.div
					className='mt-6 flex flex-col items-center gap-4 sm:mt-8 md:mt-10'
					{...enter(0.95, 8)}
				>
					<div className='flex flex-row items-center justify-center gap-3 sm:gap-4'>
						<a
							href={BRAND.appStore}
							target='_blank'
							rel='noopener noreferrer'
							data-primary-cta=''
							className='transition-transform hover:scale-105'
							onClick={() => track('hero_cta_click', { cta_text: 'App Store badge', destination: BRAND.appStore, location: 'hero', position: 'app_store_badge' })}
						>
							<Image
								src='/images/app-store-badge.svg'
								alt='Download on the App Store'
								width={126}
								height={42}
								className='h-[42px] w-auto'
								priority
							/>
						</a>
						<a
							href={BRAND.googlePlay}
							target='_blank'
							rel='noopener noreferrer'
							data-primary-cta=''
							className='transition-transform hover:scale-105'
							onClick={() => track('hero_cta_click', { cta_text: 'Google Play badge', destination: BRAND.googlePlay, location: 'hero', position: 'google_play_badge' })}
						>
							<Image
								src='/images/google-play-badge.svg'
								alt='Get it on Google Play'
								width={142}
								height={42}
								className='h-[42px] w-auto'
								priority
							/>
						</a>
					</div>
					<p className='text-trim text-center text-[12px] leading-[1.6] text-cc-text-secondary'>
						60 seconds to start increasing your close rate.
					</p>
				</motion.div>
			</div>
		</section>
	)
}
