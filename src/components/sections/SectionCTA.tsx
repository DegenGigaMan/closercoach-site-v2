/** @fileoverview S8 Final CTA -- dark atmospheric bookend to hero. Atmosphere CONTRACTS
 * inward (inverse of hero expansion). Convergence composition: headline, subhead, body,
 * QR museum exhibit, app store badges, WhatsApp community pill, live growth counter (G5),
 * secondary CTA. Launch-realistic scope: 3 key atmospheric treatments (contraction gradient,
 * concentric rings, AH ambient phone-proportion glow). AE three-beat, AF metallic sweep,
 * AG particle logomark deferred to W13 coherence pass.
 * Copy locked to lp-copy-deck-v5 Section 8. Alim verbatim headline. */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { motion, useReducedMotion } from 'motion/react'
import { ChatCircleDots } from '@phosphor-icons/react'
import ScrollReveal from '@/components/shared/scroll-reveal'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND } from '@/lib/constants'

/* QR destination -- absolute URL so scans resolve from print/screenshots too.
 * Points at the /download page for platform detection and store routing. */
const QR_DESTINATION = 'https://closercoach-site-v2.vercel.app/download?source=qr-cta'
const WHATSAPP_URL = 'https://chat.whatsapp.com/HkG7urngZAV4wV9Ufd02Z1'

/**
 * @description S8 Final CTA. Dark surface (cc-foundation) bookending hero. Atmosphere
 * contracts toward center via tight radial gradient (40-60vw) -- inverse of hero's
 * expansion. Two concentric emerald rings sit behind QR as sonar/breathing marker.
 * Distant phone-proportion emerald glow (AH) whispers "your phone is waiting."
 * Reduced-motion: rings static, pulse dot static, gradient non-animated.
 */
export default function SectionCTA() {
	const prefersReducedMotion = useReducedMotion() ?? false

	return (
		<section
			id='cta'
			data-surface='dark-cta'
			className='relative overflow-hidden bg-cc-foundation py-24 md:py-40'
		>
			{/* L1: Contracting radial gradient -- CONCENTRATES toward center (inverse of hero expansion).
			    Tight 40-60vw ellipse fades to foundation at edges. */}
			<div
				className='pointer-events-none absolute inset-0 z-0'
				aria-hidden='true'
				style={{
					background:
						'radial-gradient(ellipse 50% 55% at 50% 50%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 40%, transparent 72%)',
				}}
			/>

			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.03} />

			{/* L3: AH ambient hint -- distant phone-proportion emerald glow behind CTA block.
			    Barely visible ("your phone is waiting"). */}
			<div
				className='pointer-events-none absolute left-1/2 top-1/2 z-0 h-[360px] w-[180px] -translate-x-1/2 -translate-y-[20%] rounded-[48px]'
				aria-hidden='true'
				style={{
					background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(16,185,129,0.14) 0%, transparent 70%)',
					filter: 'blur(50px)',
					opacity: 0.55,
				}}
			/>

			{/* Content */}
			<div className='relative z-10 mx-auto max-w-2xl px-6'>
				<ScrollReveal className='flex flex-col items-center gap-7 text-center'>
					{/* Headline -- Alim verbatim, Lora Bold, italic emphasis on "actually losing" */}
					<h2 className='text-trim display-lg text-white md:display-xl'>
						Find out what&apos;s{' '}
						<span className='italic text-cc-accent'>actually losing</span> you deals.
					</h2>

					{/* Subheadline */}
					<p className='text-lg text-cc-text-secondary md:text-xl'>
						Download. Pick your industry. Start your first roleplay. Get your score. Done.
					</p>

					{/* Body confidence line ($4) */}
					<p className='text-base text-cc-text-secondary'>
						3 days is plenty. Most closers know after one session.
					</p>

					{/* QR museum exhibit (AD) -- concentric rings behind, emerald frame, corner registration */}
					<div className='relative mt-4 flex flex-col items-center gap-3'>
						{/* AI concentric rings -- 2 thin emerald rings breathing behind QR */}
						<div className='pointer-events-none absolute inset-0 flex items-center justify-center' aria-hidden='true'>
							<motion.div
								className='absolute rounded-full border border-cc-accent/25'
								style={{ width: 240, height: 240 }}
								animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.4, 0.15, 0.4] }}
								transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
							/>
							<motion.div
								className='absolute rounded-full border border-cc-accent/15'
								style={{ width: 300, height: 300 }}
								animate={prefersReducedMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.3, 0.1, 0.3] }}
								transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
							/>
						</div>

						{/* QR frame -- thin emerald border with 4 corner registration marks */}
						<div className='relative rounded-xl border border-cc-accent/40 bg-white p-3'>
							{/* Corner registration marks (L-brackets) */}
							<span className='pointer-events-none absolute left-0 top-0 h-3 w-3 -translate-x-[6px] -translate-y-[6px] border-l-2 border-t-2 border-cc-accent' aria-hidden='true' />
							<span className='pointer-events-none absolute right-0 top-0 h-3 w-3 translate-x-[6px] -translate-y-[6px] border-r-2 border-t-2 border-cc-accent' aria-hidden='true' />
							<span className='pointer-events-none absolute bottom-0 left-0 h-3 w-3 -translate-x-[6px] translate-y-[6px] border-b-2 border-l-2 border-cc-accent' aria-hidden='true' />
							<span className='pointer-events-none absolute bottom-0 right-0 h-3 w-3 translate-x-[6px] translate-y-[6px] border-b-2 border-r-2 border-cc-accent' aria-hidden='true' />

							<QRCodeSVG
								value={QR_DESTINATION}
								size={176}
								bgColor='#FFFFFF'
								fgColor='#0D0F14'
								level='M'
								className='rounded-sm'
								title='QR code to download CloserCoach on the App Store'
							/>
						</div>

						{/* Scan label */}
						<span className='font-mono text-[11px] uppercase tracking-[0.2em] text-cc-accent'>
							Scan to Download
						</span>
					</div>

					{/* App Store + Google Play badges */}
					<div className='flex flex-row items-center justify-center gap-3 pt-2'>
						<Link
							href={BRAND.appStore}
							aria-label='Download on the App Store'
							className='inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
						>
							<Image
								src='/badges/app-store.svg'
								alt='Download on the App Store'
								width={148}
								height={44}
								className='h-11 w-auto'
							/>
						</Link>
						<Link
							href={BRAND.googlePlay}
							aria-label='Get it on Google Play'
							className='inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
						>
							<Image
								src='/badges/google-play.svg'
								alt='Get it on Google Play'
								width={148}
								height={44}
								className='h-11 w-auto'
							/>
						</Link>
					</div>

					{/* WhatsApp community pill (CY-1 + SP8) */}
					<Link
						href={WHATSAPP_URL}
						target='_blank'
						rel='noopener noreferrer'
						className='group inline-flex items-center gap-2 rounded-full border border-cc-accent/30 bg-cc-accent/5 px-4 py-2 text-sm text-cc-text-secondary transition-colors hover:border-cc-accent/60 hover:bg-cc-accent/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
					>
						<ChatCircleDots weight='bold' className='h-4 w-4 text-cc-accent' aria-hidden='true' />
						<span>
							Join <span className='text-white'>500+ closers</span> in our WhatsApp community.
						</span>
					</Link>

					{/* Live growth counter (G5 real data, replaces fabricated 1,247).
					    Pulse dot uses stable DOM -- motion props are the only reduced-motion switch
					    to avoid server/client tree mismatch (F38/F39/F42). */}
					<div className='flex items-center gap-2 pt-2 font-mono text-sm text-cc-text-secondary'>
						<span className='relative flex h-2 w-2' aria-hidden='true'>
							<motion.span
								className='absolute inline-flex h-full w-full rounded-full bg-cc-accent/60'
								animate={prefersReducedMotion ? undefined : { scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
								transition={prefersReducedMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
							/>
							<span className='relative inline-flex h-2 w-2 rounded-full bg-cc-accent' />
						</span>
						<span>
							<span className='text-white'>1,003 closers</span> joined last week.
						</span>
					</div>

					{/* Secondary CTA -- Book a Demo for Teams */}
					<Link
						href={BRAND.calendly}
						target='_blank'
						rel='noopener noreferrer'
						className='text-sm text-cc-accent underline-offset-4 transition-colors hover:text-cc-accent-hover hover:underline focus-visible:outline-none focus-visible:underline'
					>
						Book a Demo for Teams
					</Link>
				</ScrollReveal>
			</div>
		</section>
	)
}
