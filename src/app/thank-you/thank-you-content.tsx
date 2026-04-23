/** @fileoverview /thank-you client component. "You're in." celebration header + 3-step next-actions
 * (Download with QR + badges, WhatsApp community join, follow on social). Dark surface with warm
 * celebration atmospheric accent. Minimal footer handled via Footer.tsx pathname detection. */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import {
	CheckCircle,
	DeviceMobile,
	ChatCircleDots,
	Heart,
	InstagramLogo,
	TiktokLogo,
	LinkedinLogo,
} from '@phosphor-icons/react'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND, STATS } from '@/lib/constants'

const QR_DESTINATION = 'https://closercoach-site-v2.vercel.app/download'
const WHATSAPP_URL = 'https://chat.whatsapp.com/HkG7urngZAV4wV9Ufd02Z1'
const INSTAGRAM_URL = 'https://instagram.com/closercoach'
const TIKTOK_URL = 'https://tiktok.com/@closercoach'
const LINKEDIN_URL = 'https://linkedin.com/company/closercoach'

export default function ThankYouContent() {
	return (
		<div
			data-surface='dark-cta'
			className='relative overflow-hidden bg-cc-foundation'
		>
			{/* L1: Celebration atmospheric gradient -- warmer emerald/amber hint */}
			<div
				className='pointer-events-none absolute inset-0 z-0'
				aria-hidden='true'
				style={{
					background:
						'radial-gradient(ellipse 65% 45% at 50% 15%, rgba(16,185,129,0.12) 0%, rgba(245,158,11,0.04) 40%, transparent 75%)',
				}}
			/>

			<AtmosphereNoise opacity={0.03} />

			<div className='relative z-10 mx-auto max-w-3xl px-6 py-20 md:py-28'>
				{/* Confirmation header */}
				<div className='text-center'>
					<span className='mx-auto inline-flex items-center gap-2 rounded-full border border-cc-accent/30 bg-cc-accent/8 px-4 py-1.5 text-xs font-medium text-cc-accent'>
						<CheckCircle weight='fill' className='h-4 w-4' aria-hidden='true' />
						<span className='font-mono uppercase tracking-[0.2em]'>Trial Active</span>
					</span>

					<h1 className='mt-6 display-lg text-white md:display-xl'>
						You are <span className='italic text-cc-accent'>in</span>.
					</h1>
					<p className='mt-5 text-lg text-cc-text-secondary md:text-xl'>
						Your {STATS.trialDays}-day free trial just started.
					</p>
					<p className='mt-3 text-sm text-cc-text-muted'>
						Full access. No restrictions. Your first scored session takes 60 seconds.
					</p>
				</div>

				{/* 3-step next-actions */}
				<div className='mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-5'>
					{/* Step 1: Download */}
					<div className='flex flex-col rounded-2xl border border-cc-surface-border bg-cc-surface-card/60 p-6 backdrop-blur-sm'>
						<div className='flex items-center gap-3'>
							<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cc-accent/10 font-mono text-sm font-medium text-cc-accent'>
								1
							</span>
							<div className='flex items-center gap-2 text-cc-text-secondary'>
								<DeviceMobile weight='regular' className='h-4 w-4' aria-hidden='true' />
								<span className='font-mono text-[11px] uppercase tracking-[0.18em]'>
									Install
								</span>
							</div>
						</div>

						<h2 className='mt-4 display-sm text-white'>Install CloserCoach</h2>
						<p className='mt-2 text-sm text-cc-text-secondary'>
							Scan the code or tap a store badge.
						</p>

						{/* QR + badges */}
						<div className='mt-5 flex flex-col items-start gap-4'>
							<div className='relative rounded-lg border border-cc-accent/30 bg-white p-2.5'>
								<QRCodeSVG
									value={QR_DESTINATION}
									size={96}
									bgColor='#FFFFFF'
									fgColor='#0D0F14'
									level='M'
									className='rounded-sm'
								/>
							</div>
							<div className='flex flex-row items-center gap-2'>
								<Link
									href={BRAND.appStore}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='Download on the App Store'
									className='inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
								>
									<Image
										src='/badges/app-store.svg'
										alt='Download on the App Store'
										width={110}
										height={36}
										className='h-9 w-auto'
									/>
								</Link>
								<Link
									href={BRAND.googlePlay}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='Get it on Google Play'
									className='inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
								>
									<Image
										src='/badges/google-play.svg'
										alt='Get it on Google Play'
										width={110}
										height={36}
										className='h-9 w-auto'
									/>
								</Link>
							</div>
						</div>
					</div>

					{/* Step 2: WhatsApp community */}
					<div className='flex flex-col rounded-2xl border border-cc-surface-border bg-cc-surface-card/60 p-6 backdrop-blur-sm'>
						<div className='flex items-center gap-3'>
							<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cc-accent/10 font-mono text-sm font-medium text-cc-accent'>
								2
							</span>
							<div className='flex items-center gap-2 text-cc-text-secondary'>
								<ChatCircleDots weight='regular' className='h-4 w-4' aria-hidden='true' />
								<span className='font-mono text-[11px] uppercase tracking-[0.18em]'>
									Community
								</span>
							</div>
						</div>

						<h2 className='mt-4 display-sm text-white'>Join the community</h2>
						<p className='mt-2 text-sm text-cc-text-secondary'>
							500+ closers swap plays in our WhatsApp group. Tactical, no spam.
						</p>

						<div className='mt-auto pt-6'>
							<Link
								href={WHATSAPP_URL}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cc-accent px-4 py-3 text-sm font-medium text-cc-foundation transition-colors hover:bg-cc-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
							>
								<ChatCircleDots weight='bold' className='h-4 w-4' aria-hidden='true' />
								<span>Join WhatsApp group</span>
							</Link>
						</div>
					</div>

					{/* Step 3: Follow on social */}
					<div className='flex flex-col rounded-2xl border border-cc-surface-border bg-cc-surface-card/60 p-6 backdrop-blur-sm'>
						<div className='flex items-center gap-3'>
							<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cc-accent/10 font-mono text-sm font-medium text-cc-accent'>
								3
							</span>
							<div className='flex items-center gap-2 text-cc-text-secondary'>
								<Heart weight='regular' className='h-4 w-4' aria-hidden='true' />
								<span className='font-mono text-[11px] uppercase tracking-[0.18em]'>
									Follow
								</span>
							</div>
						</div>

						<h2 className='mt-4 display-sm text-white'>Follow along</h2>
						<p className='mt-2 text-sm text-cc-text-secondary'>
							Daily sales clips, roleplay breakdowns, and product drops.
						</p>

						<ul className='mt-auto flex gap-3 pt-6'>
							<li>
								<Link
									href={INSTAGRAM_URL}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='CloserCoach on Instagram'
									className='inline-flex h-11 w-11 items-center justify-center rounded-lg border border-cc-surface-border bg-cc-foundation/50 text-cc-text-secondary transition-colors hover:border-cc-accent/40 hover:bg-cc-surface hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
								>
									<InstagramLogo weight='regular' className='h-5 w-5' aria-hidden='true' />
								</Link>
							</li>
							<li>
								<Link
									href={TIKTOK_URL}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='CloserCoach on TikTok'
									className='inline-flex h-11 w-11 items-center justify-center rounded-lg border border-cc-surface-border bg-cc-foundation/50 text-cc-text-secondary transition-colors hover:border-cc-accent/40 hover:bg-cc-surface hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
								>
									<TiktokLogo weight='regular' className='h-5 w-5' aria-hidden='true' />
								</Link>
							</li>
							<li>
								<Link
									href={LINKEDIN_URL}
									target='_blank'
									rel='noopener noreferrer'
									aria-label='CloserCoach on LinkedIn'
									className='inline-flex h-11 w-11 items-center justify-center rounded-lg border border-cc-surface-border bg-cc-foundation/50 text-cc-text-secondary transition-colors hover:border-cc-accent/40 hover:bg-cc-surface hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
								>
									<LinkedinLogo weight='regular' className='h-5 w-5' aria-hidden='true' />
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Reassurance block */}
				<div className='mt-14 rounded-2xl border border-cc-surface-border bg-cc-surface/40 p-6 text-center md:p-8'>
					<p className='font-mono text-[11px] uppercase tracking-[0.2em] text-cc-accent'>
						Next 60 seconds
					</p>
					<p className='mt-3 text-base text-cc-text-secondary md:text-lg'>
						Open the app, pick your industry, run your first roleplay. You will have a scored session before this page even needs another look.
					</p>
				</div>
			</div>
		</div>
	)
}
