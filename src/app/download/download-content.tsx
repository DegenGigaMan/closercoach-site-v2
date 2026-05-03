/** @fileoverview /download client component. QR museum frame + badges + proof pills + trust strip.
 * Mirrors S8 QR pattern (concentric rings + corner registration marks). Dark surface. */

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { motion, useReducedMotion } from 'motion/react'
import {
	Star,
	Users,
	Clock,
	ShieldCheck,
	CircleNotch,
	SignIn,
	Briefcase,
	Microphone,
} from '@phosphor-icons/react'
import AtmosphereNoise from '@/components/atmosphere/atmosphere-noise'
import { BRAND, STATS, getStoreUrl } from '@/lib/constants'

/** QR points at the deployed /download URL so scans resolve from print/screenshots.
 * source=qr-download lets PostHog split self-link QR scans from organic traffic. */
const QR_DESTINATION = 'https://closercoach-site-v2.vercel.app/download?source=qr-download'

type ProofPill = {
	icon: typeof Star
	label: string
	accent: 'emerald' | 'amber'
}

const PROOF_PILLS: ProofPill[] = [
	{ icon: Star, label: `${STATS.appStoreRating}\u2605 App Store`, accent: 'amber' },
	{ icon: Users, label: `${STATS.userCount} closers`, accent: 'emerald' },
	{ icon: Clock, label: `${STATS.trialDays}-day free trial`, accent: 'emerald' },
]

export default function DownloadContent() {
	const prefersReducedMotion = useReducedMotion() ?? false
	const [redirectStore, setRedirectStore] = useState<string | null>(null)

	/* On mobile, auto-redirect to the right store via getStoreUrl(). 250ms delay
	 * gives the overlay time to paint so the user sees "going somewhere" instead
	 * of a flash. Desktop stays on the page (helper returns '/download'). */
	useEffect(() => {
		const target = getStoreUrl()
		if (target === '/download') return
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setRedirectStore(target.includes('apps.apple.com') ? 'App Store' : 'Play Store')
		const t = setTimeout(() => window.location.replace(target), 250)
		return () => clearTimeout(t)
	}, [])

	return (
		<div
			data-surface='dark-cta'
			className='relative overflow-hidden bg-cc-foundation'
		>
			{redirectStore && (
				<div
					role='status'
					aria-live='polite'
					className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-cc-foundation/95 backdrop-blur-sm'
				>
					<CircleNotch
						weight='regular'
						className='h-10 w-10 animate-spin text-cc-accent'
						aria-hidden='true'
					/>
					<p className='font-mono text-sm uppercase tracking-[0.2em] text-cc-accent'>
						Opening {redirectStore}…
					</p>
				</div>
			)}
			{/* L1: Contracting radial gradient, emerald bias */}
			<div
				className='pointer-events-none absolute inset-0 z-0'
				aria-hidden='true'
				style={{
					background:
						'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.03) 45%, transparent 75%)',
				}}
			/>

			{/* L2: Noise texture */}
			<AtmosphereNoise opacity={0.03} />

			{/* Content */}
			<div className='relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[calc(100vh-4rem)] md:py-24'>
				{/* Logo wordmark linking home */}
				<Link
					href='/'
					className='mb-10 inline-flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation md:mb-14'
					aria-label='CloserCoach home'
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src='/cc-logo.svg' alt={BRAND.name} width={117} height={24} className='h-8 w-auto md:h-10' />
				</Link>

				{/* Headline */}
				<h1 className='display-md text-white md:display-lg'>
					Download <span className='italic text-cc-accent'>CloserCoach</span>
				</h1>

				{/* Subline -- $4 trial */}
				<p className='mt-4 max-w-md text-base text-cc-text-secondary md:text-lg'>
					{STATS.trialDays} days free. Full access. Cancel anytime.
				</p>

				{/* QR museum frame */}
				<div className='relative mt-10 flex flex-col items-center gap-3 md:mt-12'>
					{/* Concentric rings behind QR */}
					<div
						className='pointer-events-none absolute inset-0 flex items-center justify-center'
						aria-hidden='true'
					>
						<motion.div
							className='absolute rounded-full border border-cc-accent/25'
							style={{ width: 280, height: 280 }}
							animate={
								prefersReducedMotion
									? undefined
									: { scale: [1, 1.06, 1], opacity: [0.4, 0.15, 0.4] }
							}
							transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
						/>
						<motion.div
							className='absolute rounded-full border border-cc-accent/15'
							style={{ width: 340, height: 340 }}
							animate={
								prefersReducedMotion
									? undefined
									: { scale: [1, 1.08, 1], opacity: [0.3, 0.1, 0.3] }
							}
							transition={{
								duration: 7,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: 0.7,
							}}
						/>
					</div>

					{/* QR white panel with emerald frame + corner registration marks */}
					<div data-primary-cta='' className='relative rounded-xl border border-cc-accent/40 bg-white p-4'>
						<span
							className='pointer-events-none absolute left-0 top-0 h-3 w-3 -translate-x-[6px] -translate-y-[6px] border-l-2 border-t-2 border-cc-accent'
							aria-hidden='true'
						/>
						<span
							className='pointer-events-none absolute right-0 top-0 h-3 w-3 translate-x-[6px] -translate-y-[6px] border-r-2 border-t-2 border-cc-accent'
							aria-hidden='true'
						/>
						<span
							className='pointer-events-none absolute bottom-0 left-0 h-3 w-3 -translate-x-[6px] translate-y-[6px] border-b-2 border-l-2 border-cc-accent'
							aria-hidden='true'
						/>
						<span
							className='pointer-events-none absolute bottom-0 right-0 h-3 w-3 translate-x-[6px] translate-y-[6px] border-b-2 border-r-2 border-cc-accent'
							aria-hidden='true'
						/>

						<QRCodeSVG
							value={QR_DESTINATION}
							size={220}
							bgColor='#FFFFFF'
							fgColor='#0D0F14'
							level='M'
							className='rounded-sm'
							title='QR code to install CloserCoach'
						/>
					</div>

					<span className='font-mono text-[11px] uppercase tracking-[0.2em] text-cc-accent'>
						Scan to Install
					</span>
				</div>

				{/* App Store + Google Play badges */}
				<div className='mt-8 flex flex-row items-center justify-center gap-3'>
					<Link
						href={BRAND.appStore}
						target='_blank'
						rel='noopener noreferrer'
						aria-label='Download on the App Store'
						data-primary-cta=''
						className='inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
					>
						<Image
							src='/badges/app-store.svg'
							alt='Download on the App Store'
							width={144}
							height={48}
							className='h-12 w-auto'
						/>
					</Link>
					<Link
						href={BRAND.googlePlay}
						target='_blank'
						rel='noopener noreferrer'
						aria-label='Get it on Google Play'
						data-primary-cta=''
						className='inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cc-foundation'
					>
						<Image
							src='/badges/google-play.svg'
							alt='Get it on Google Play'
							width={162}
							height={48}
							className='h-12 w-auto'
						/>
					</Link>
				</div>

				{/* 3-pill proof row (A1, G4, $4) */}
				<ul className='mt-10 flex flex-wrap items-center justify-center gap-3'>
					{PROOF_PILLS.map((pill) => {
						const Icon = pill.icon
						const accentText = pill.accent === 'amber' ? 'text-cc-amber' : 'text-cc-accent'
						return (
							<li
								key={pill.label}
								className='inline-flex items-center gap-2 rounded-full border border-cc-surface-border bg-cc-surface/40 px-3 py-1.5 text-xs text-cc-text-secondary backdrop-blur-sm md:text-sm'
							>
								<Icon weight='fill' className={`h-3.5 w-3.5 ${accentText}`} aria-hidden='true' />
								<span className='font-mono tracking-tight'>{pill.label}</span>
							</li>
						)
					})}
				</ul>

				{/* Trust strip (TR1/TR2 + press mention) */}
				<div className='mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-cc-surface-border pt-8'>
					<span className='inline-flex items-center gap-1.5 text-xs text-cc-text-secondary'>
						<ShieldCheck weight='regular' className='h-3.5 w-3.5' aria-hidden='true' />
						<span className='font-mono uppercase tracking-wider'>SOC2</span>
					</span>
					<span className='inline-flex items-center gap-1.5 text-xs text-cc-text-secondary'>
						<ShieldCheck weight='regular' className='h-3.5 w-3.5' aria-hidden='true' />
						<span className='font-mono uppercase tracking-wider'>GDPR</span>
					</span>
					<a
						href='https://hypepotamus.com/startup-news/prizepicks-alum-launches-closercoach-ai-sales-coaching-atlanta/'
						target='_blank'
						rel='noopener noreferrer'
						className='text-xs text-cc-text-secondary underline-offset-4 transition-colors hover:text-white hover:underline'
					>
						Featured in Hypepotamus
					</a>
				</div>

				{/* Wave K.2 (FIX-CC-02 P2, 2026-04-26): "60 second flow" mini-strip
				 * supporting trust + clarity at md+ only. Mobile (<md) keeps the
				 * dense single-column conversion path — auto-redirect to store
				 * fires within 250ms there, so the strip would be invisible churn.
				 * Desktop (md+) had ~700-1000px empty rails per S+ Visual Auditor;
				 * this 3-card row carries the same UI vocabulary already approved
				 * on /thank-you (Install / Community / Follow). */}
				<div
					className='mt-10 hidden w-full max-w-3xl grid-cols-3 gap-4 md:grid lg:relative lg:left-1/2 lg:max-w-none lg:-translate-x-1/2 lg:[width:min(calc(100vw-3rem),900px)] 2xl:[width:min(calc(100vw-3rem),1100px)]'
					aria-label='Sixty second flow'
				>
					{[
						{
							Icon: SignIn,
							label: 'Sign in',
							sub: 'Apple ID, Google, or email',
						},
						{
							Icon: Briefcase,
							label: 'Pick your industry',
							sub: 'Insurance, real estate, solar, more',
						},
						{
							Icon: Microphone,
							label: 'Run your first roleplay',
							sub: 'Get scored A through F in 60 seconds',
						},
					].map(({ Icon, label, sub }) => (
						<div
							key={label}
							className='flex flex-col items-center gap-3 rounded-2xl border border-cc-surface-border bg-cc-surface/40 p-6 text-center backdrop-blur-sm'
						>
							<Icon
								weight='regular'
								className='h-5 w-5 text-cc-accent'
								aria-hidden='true'
							/>
							<p
								className='text-trim text-base text-white'
								style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, lineHeight: 1.25 }}
							>
								{label}
							</p>
							<p className='text-trim text-sm text-cc-text-secondary'>
								{sub}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
