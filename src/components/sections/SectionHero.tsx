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
import { AppleLogo, AndroidLogo, Globe } from '@phosphor-icons/react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { BRAND, CTA, STATS } from '@/lib/constants'
import { track } from '@/lib/analytics'
import MotionCTA from '@/components/shared/motion-cta'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
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

	/* Shared entrance config. Initial state is stable across SSR/client to avoid
	 * hydration mismatch (useReducedMotion returns null on server, boolean on client).
	 * Reduced-motion users get duration 0 which snaps from initial to final instantly.
	 *
	 * Phase 8 (Andy 2026-05-01): preview review found the hero entrance
	 * cascade still felt slow (Wave AA.2 fixed default duration but kept the
	 * x2 delay multiplier, so calls like enter(0.95) actually delayed 1.9s).
	 * Dropped the doubler and the default duration. Cascade ORDER preserved;
	 * only per-step pace tightened. */
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

			{/* L1.5 corner light rays REMOVED in Wave X.5 (2026-04-28) reduction
			 * pass. Per Alim 'Improvement via reduction is the play' + 'okay
			 * with LESS on the visuals'. The corner rays stacked 3 layered
			 * backgrounds per side on top of L1 gradient + L2 noise + L3
			 * particles + 3-layer phone glow -- 4 ambient layers competing
			 * with the phone's product-as-light-source role per R7 v3 D8.
			 * Removing the rays lets the phone be the singular emerald source.
			 * If Andy wants the rays back, restore from main HEAD 06d0415
			 * SectionHero.tsx lines 93-127. */}

			{/* L2: Noise texture. */}
			<AtmosphereNoise opacity={0.035} />

			{/* L3: Particles REMOVED Wave Y.13 (Andy approved, Alim 2026-04-28
			 * 'okay with LESS on the visuals' + Wave X.5 reduction surface).
			 * Surfaced as medium-confidence reduction candidate B in Wave X.5:
			 * decorative ornament without a story beat — sits on top of the
			 * L1 emerald gradient, L2 noise, and the 3-layer phone glow,
			 * adding an ambient layer that competes with the phone's
			 * product-as-light-source role per R7 v3 D8.
			 *
			 * If Andy wants particles back, restore from main HEAD 06d0415:
			 *   - Add `import ParticleCanvas from '@/components/atmosphere/particle-canvas'`
			 *   - Insert `{isDesktop && <ParticleCanvas mode='ambient' />}` here. */}

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

			{/* Content layer -- centered vertical stack. Wave H.4 (2026-04-26):
			 * top padding reduced (pt-28 md:pt-32 -> pt-16 md:pt-20) so the
			 * phone composite reaches above-fold at 1440x900.
			 * Wave J.3 (FIX-04 P1, 2026-04-26): 2xl bump from 1200 -> 1440
			 * reclaims the 320px-per-side rails at 1920 viewport. Mercury /
			 * Linear push to 1440-1536 at 2xl; prior ceiling read narrow on
			 * wide canvas. */}
			<div className='relative z-[5] mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-6 pb-16 pt-16 md:pt-20 2xl:max-w-[1440px]'>

				{/* Announcement badge (AnimatedBadge replaces v1's static trust pill).
				 * Wave AA.2 (2026-04-28): reverted to 0.5s per Andy hero-only revert. */}
				<motion.div className='mb-8' {...enter(0, -8)}>
					<AnimatedBadge text={`Join ${STATS.userCount} Sales Closers`} color='#10B981' />
				</motion.div>

				{/* H1 headline -- clipPath line reveal, white with emerald italic accent.
				 * Desktop locked to 72px per Figma 62:3049; mobile collapses to
				 * ~40px via the clamp ceiling. */}
				<motion.h1
					className='max-w-[920px] text-center text-white'
					style={{
						fontFamily: 'var(--font-heading)',
						fontWeight: 700,
						fontSize: 'clamp(2.5rem, 6vw, 72px)',
						lineHeight: 0.933,
					}}
					initial={{ clipPath: 'inset(0 0 100% 0)' }}
					animate={{ clipPath: 'inset(0 0 0% 0)' }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.15, ease: EASE }}
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
				</motion.h1>

				{/* Subheadline -- centered, narrow. Wave AA.2: reverted to original timing. */}
				<motion.p
					className='mt-6 max-w-[600px] text-center font-sans text-lg leading-relaxed text-cc-text-secondary'
					{...enter(0.35, 12)}
				>
					Practice closing deals. Record your meetings. Know exactly where you&rsquo;re losing deals. All from your phone.
				</motion.p>

				{/* CTA cluster -- centered pair, stacked on mobile, row on sm+.
				 * Wave AA.2: reverted to original timing. */}
				<motion.div
					className='mt-10 flex w-full max-w-[420px] flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4'
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.45, ease: EASE }}
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
				</motion.div>

				{/* Platform availability row. iOS / Android / Web tags only. The
				 * trailing "No annual contracts." value prop was killed 2026-04-26
				 * per Andy (Wave F.1b) so the row reads as a clean three-tag
				 * platform list per Figma 85:15957. */}
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

				{/* Rating block — Figma 62:3128. Vertical stack: big 4.7 in Lora
				 * Bold 38/-1.52, 5 amber stars at 16px, Apple wordmark + "App
				 * Store" in Inter Regular 16. 8px gap between rows. */}
				<motion.div
					className='mt-8 flex flex-col items-center gap-2'
					{...enter(0.6, 8)}
				>
					{/* Wave H.4 (2026-04-26): "(378+ reviews)" subline dropped to
					 * reclaim ~20px of vertical density so phone reaches above-fold
					 * at 1440x900. The 5-star strip + AppleLogo + "App Store"
					 * wordmark below already imply the review context. */}
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

					{/* Three-layer emerald glow -- product as light source. */}
					<motion.div
						className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
						aria-hidden='true'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 1.1, ease: 'easeOut' }}
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
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 1.2, ease: 'easeOut' }}
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
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, delay: 1.3, ease: 'easeOut' }}
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
							initial={{ opacity: 0, y: 32, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.8, ease: EASE }}
							style={isDesktop && !prefersReducedMotion ? { y: phoneParallax } : undefined}
						>
							{/* Scale wrapper: down-scale on small viewports so the 640px composite
							 * fits 390px mobile without overflow. H-29 (2026-05-04) bumped
							 * mobile/sm scales (was 0.58/0.72/0.85) so the hero phone reads
							 * with more presence on mobile. body now has overflow-x: hidden
							 * so any minor edge bleed gets clipped at the viewport. Negative
							 * mb compensates for the scale-vs-layout gap. */}
							<div className='origin-top scale-[0.68] sm:scale-[0.82] md:scale-[0.92] lg:scale-100 mb-[-205px] sm:mb-[-115px] md:mb-[-50px] lg:mb-0'>
								<HeroPhoneV2 />
							</div>
						</motion.div>
					</div>
				</div>

				{/* App Store + Google Play badges — beneath the phone composite.
				 * R-02 spec; H-29 (2026-05-04): bumped top margin from 0 to mt-6
				 * sm:mt-8 md:mt-10 so the badges breathe under the larger mobile
				 * phone scale, and switched the badge row from flex-col → flex-row
				 * default so App Store + Google Play sit side-by-side on every
				 * viewport (was previously vertically stacked at <sm). Both badges
				 * (126 + 142 + 16 gap = 284px) fit at 320px+ viewports comfortably. */}
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
