/** @fileoverview Card 5 visual -- 40+ Languages mic + flag orbit.
 *
 * Composition: centered emerald-glow mic button (3 concentric rings) with a
 * symmetric waveform on both sides. 5 country-flag circles arranged around
 * the mic to suggest orbit / global reach:
 *   US top-left, Brazil top-right, Japan bottom-left, China bottom-center
 *   (smaller / further), Mexico bottom-right.
 *
 * Mapped from Figma node 1:11470. Using Unicode flag emojis -- see
 * build-deviations.md entry. */

'use client'

import type { ReactElement } from 'react'
import { Microphone } from '@phosphor-icons/react'

const floatKeyframes = `
@keyframes flagFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}
@keyframes flagFloatCenter {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-15px); }
}
`

/**
 * @description Mirrored waveform strip. 18 bars per side, 3 zones (inner
 * hot green, mid green, outer dim white). Heights mirror Figma to within
 * 1px. Tighter bar spacing keeps the silhouette compact.
 */
function WaveformHalf({ mirrored }: { mirrored?: boolean }): ReactElement {
	const bars = [
		{ h: 19.6, c: 'rgba(16,208,120,0.18)' },
		{ h: 13.3, c: 'rgba(16,208,120,0.45)' },
		{ h: 28.0, c: 'rgba(16,208,120,0.70)' },
		{ h: 35.0, c: 'rgba(16,208,120,0.70)' },
		{ h: 22.4, c: 'rgba(16,208,120,0.65)' },
		{ h: 28.0, c: 'rgba(16,208,120,0.70)' },
		{ h: 19.6, c: 'rgba(16,208,120,0.45)' },
		{ h: 11.9, c: 'rgba(16,208,120,0.18)' },
		{ h: 17.5, c: 'rgba(16,208,120,0.18)' },
		{ h: 14.7, c: 'rgba(16,208,120,0.18)' },
		{ h: 11.9, c: 'rgba(16,208,120,0.18)' },
		{ h: 9.8, c: 'rgba(255,255,255,0.10)' },
		{ h: 7.0, c: 'rgba(255,255,255,0.10)' },
		{ h: 7.7, c: 'rgba(255,255,255,0.10)' },
		{ h: 6.3, c: 'rgba(255,255,255,0.10)' },
		{ h: 4.2, c: 'rgba(255,255,255,0.10)' },
		{ h: 4.9, c: 'rgba(255,255,255,0.10)' },
		{ h: 3.5, c: 'rgba(255,255,255,0.10)' },
	]
	const list = mirrored ? [...bars].reverse() : bars
	return (
		<div className='flex items-center gap-[3px]' aria-hidden='true'>
			{list.map((b, i) => (
				<div
					key={i}
					className='shrink-0 rounded'
					style={{
						height: `${b.h}px`,
						width: '3.5px',
						backgroundColor: b.c,
						opacity: 0.85,
					}}
				/>
			))}
		</div>
	)
}

function MicButton(): ReactElement {
	return (
		<div className='relative flex items-center justify-center'>
			{/* Outer atmospheric glow */}
			<div
				className='absolute rounded-full'
				style={{
					width: 220,
					height: 220,
					background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 60%)',
					filter: 'blur(30px)',
				}}
				aria-hidden='true'
			/>
			{/* Concentric rings */}
			<div
				className='absolute rounded-full border border-[rgba(16,208,120,0.1)] opacity-70'
				style={{ width: 140, height: 140 }}
				aria-hidden='true'
			/>
			<div
				className='absolute rounded-full border border-[rgba(16,208,120,0.25)] opacity-70'
				style={{ width: 110, height: 110 }}
				aria-hidden='true'
			/>
			<div
				className='absolute rounded-full border border-[rgba(16,208,120,0.35)] opacity-70'
				style={{ width: 82, height: 82 }}
				aria-hidden='true'
			/>
			{/* Mic button */}
			<div
				className='relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#10D078]'
				style={{
					boxShadow:
						'0 0 0 2px rgba(16,208,120,0.3), 0 0 32px rgba(16,208,120,0.4), 0 0 80px rgba(16,208,120,0.15)',
				}}
			>
				<Microphone size={28} weight='fill' className='text-black' aria-hidden='true' />
			</div>
		</div>
	)
}

function FlagCircle({
	flag,
	size,
	style,
	animStyle,
}: {
	flag: string
	size: number
	style: React.CSSProperties
	animStyle?: React.CSSProperties
}): ReactElement {
	return (
		<div
			className='absolute flex items-center justify-center rounded-full border border-white/[0.1] backdrop-blur-sm'
			style={{
				width: size,
				height: size,
				backgroundColor: 'rgba(20,24,20,0.85)',
				boxShadow:
					'0px 12px 40px 0px rgba(0,0,0,0.6), inset 0px 1px 0px 0px rgba(255,255,255,0.07)',
				...style,
				...animStyle,
			}}
			aria-hidden='true'
		>
			<span
				className='leading-none'
				style={{
					fontSize: `${Math.round(size * 0.52)}px`,
					fontFamily:
						'"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
				}}
			>
				{flag}
			</span>
		</div>
	)
}

export default function LanguageOrbitVisual(): ReactElement {
	// Bounded stage. Mic + waveform sit at geometric center. Flags use
	// percent-based absolute positioning so the composition scales with the
	// slot width.
	return (
		<div
			className='relative flex w-full flex-1 items-center justify-center py-6'
			role='img'
			aria-label='A microphone button glowing emerald at the center, flanked by sound waves, with five country flag badges floating around it representing the US, Brazil, Japan, China, and Mexico.'
		>
			<style>{floatKeyframes}</style>
			{/* Stage -- width clamped so the layout stays balanced inside the card. */}
			<div
				className='relative flex items-center justify-center'
				style={{ width: '100%', maxWidth: 440, aspectRatio: '11 / 6', minHeight: 240 }}
			>
				{/* Waveforms + mic centered inside the stage */}
				<div className='absolute inset-0 flex items-center justify-center gap-4'>
					<div className='hidden sm:block'>
						<WaveformHalf mirrored />
					</div>
					<MicButton />
					<div className='hidden sm:block'>
						<WaveformHalf />
					</div>
				</div>

				{/* Flag orbits -- percent anchors relative to stage */}
				<FlagCircle flag='🇺🇸' size={54} style={{ left: '4%', top: '6%' }} animStyle={{ animation: 'flagFloat 3.2s ease-in-out infinite' }} />
				<FlagCircle flag='🇧🇷' size={54} style={{ right: '4%', top: '6%' }} animStyle={{ animation: 'flagFloat 3.8s ease-in-out infinite 0.6s' }} />
				<FlagCircle flag='🇯🇵' size={40} style={{ left: '14%', bottom: '6%' }} animStyle={{ animation: 'flagFloat 3.5s ease-in-out infinite 1.2s' }} />
				<FlagCircle flag='🇨🇳' size={44} style={{ left: '50%', bottom: '-4%' }} animStyle={{ animation: 'flagFloatCenter 4.0s ease-in-out infinite 0.4s' }} />
				<FlagCircle flag='🇲🇽' size={48} style={{ right: '10%', bottom: '6%' }} animStyle={{ animation: 'flagFloat 3.6s ease-in-out infinite 0.9s' }} />
			</div>
		</div>
	)
}
