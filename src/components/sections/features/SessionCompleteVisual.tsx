/** @fileoverview Card 2 visual -- AI Dialer + Notetaker.
 *
 * Composition: two avatar pills (Marcus R. left, Alim C. Rep right) with a
 * live waveform between them and "LIVE 02:34" label above. Below: a Session
 * Complete card with a circular 81/100 dial on the left and 3 stat bars on
 * the right (Discovery 88, Objections 61, Close Attempt 74).
 *
 * Mapped from Figma nodes 1:11220 (live strip) and 1:11256 (session card). */

'use client'

import type { ReactElement } from 'react'
import Image from 'next/image'
import { CheckCircle } from '@phosphor-icons/react'

/**
 * @description Hand-built symmetric waveform. 17 bars, decreasing emerald
 * intensity outward. Mirrors the Figma reference heights to within 1px.
 */
function Waveform(): ReactElement {
	const heights = [8, 13, 12, 7, 5, 5, 4, 12, 15, 18, 13, 8, 12, 13, 7, 10, 6]
	const opacities = [0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.18, 0.18, 0.45, 0.65, 0.7, 0.7, 0.45, 0.18, 0.18, 0.18]
	return (
		<div className='flex items-center gap-[3px]' aria-hidden='true'>
			{heights.map((h, i) => {
				const op = opacities[i] ?? 0.18
				return (
					<div
						key={i}
						className='w-[3px] rounded-full'
						style={{
							height: `${h}px`,
							backgroundColor: op > 0.1 ? `rgba(16,208,120,${op})` : `rgba(255,255,255,${op})`,
						}}
					/>
				)
			})}
		</div>
	)
}

function AvatarPill({
	src,
	label,
	ringFrom,
	ringTo,
}: {
	src: string
	label: string
	ringFrom: string
	ringTo: string
}): ReactElement {
	return (
		<div className='flex flex-col items-center gap-2'>
			<div
				className='flex h-[62px] w-[72px] items-center justify-center rounded-[28px] border border-[#2A2A32]'
				style={{
					background: '#1E2230',
					boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.4), 0px 0px 20px 0px rgba(16,185,129,0.05)',
				}}
			>
				<div
					className='relative h-10 w-10 overflow-hidden rounded-full'
					style={{ background: `linear-gradient(to bottom, ${ringFrom}, ${ringTo})` }}
				>
					<Image
						src={src}
						alt=''
						fill
						sizes='40px'
						className='object-cover'
						aria-hidden='true'
					/>
				</div>
			</div>
			<span className='text-[10px] font-semibold leading-[15px] text-white/70'>{label}</span>
		</div>
	)
}

function LiveStrip(): ReactElement {
	return (
		<div className='flex items-center justify-center gap-4'>
			<AvatarPill
				src='/images/features/card2-avatar-marcus-r.png'
				label='Marcus R.'
				ringFrom='#3B82F6'
				ringTo='#2563EB'
			/>
			<div className='flex flex-col items-center gap-2.5 pb-6'>
				<div className='flex items-center gap-1'>
					<span className='h-1 w-1 rounded-full bg-[#EF4444]' aria-hidden='true' />
					<span className='font-[family-name:var(--font-mono)] text-[8px] font-medium leading-[16px] text-white/80'>
						LIVE 02:34
					</span>
				</div>
				<Waveform />
			</div>
			<AvatarPill
				src='/images/features/card2-avatar-alim.png'
				label='Alim C. (Rep)'
				ringFrom='#10B981'
				ringTo='#059669'
			/>
		</div>
	)
}

function CircularDial(): ReactElement {
	// 81/100 emerald dial. Stroke is 10% primary gray track + emerald arc for 81%.
	const size = 80
	const stroke = 6
	const radius = (size - stroke) / 2
	const circumference = 2 * Math.PI * radius
	const pct = 0.81
	const dashOffset = circumference * (1 - pct)
	return (
		<div className='relative shrink-0' style={{ width: size, height: size }}>
			<svg width={size} height={size} className='-rotate-90'>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='rgba(255,255,255,0.08)'
					strokeWidth={stroke}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='#10B981'
					strokeWidth={stroke}
					strokeLinecap='round'
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
				/>
			</svg>
			<div className='absolute inset-0 flex items-center justify-center'>
				<div className='flex items-baseline gap-0.5'>
					<span className='font-[family-name:var(--font-heading)] text-[22px] font-bold leading-none text-cc-accent'>
						81
					</span>
					<span className='text-[11px] leading-none text-[#9CA3AF]'>/100</span>
				</div>
			</div>
		</div>
	)
}

function ScoreBar({
	label,
	value,
	color,
}: {
	label: string
	value: number
	color: string
}): ReactElement {
	return (
		<div className='flex w-full items-center gap-2'>
			<span className='w-[70px] shrink-0 text-[10px] leading-[15px] text-[#94A3B8]'>{label}</span>
			<div className='flex-1 overflow-hidden rounded-full bg-white/[0.06]'>
				<div
					className='h-[6px] rounded-full'
					style={{ width: `${value}%`, backgroundColor: color }}
				/>
			</div>
			<span className='font-[family-name:var(--font-mono)] text-[10px] leading-[15px] text-[#94A3B8]'>
				{value}
			</span>
		</div>
	)
}

function SessionCard(): ReactElement {
	return (
		<div
			className='w-full max-w-[340px] rounded-2xl border border-cc-accent/20 p-3 pt-3 pb-2'
			style={{
				backgroundColor: 'rgba(30,34,48,0.8)',
				boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.6)',
			}}
		>
			<div className='mb-6 flex items-center gap-2'>
				<CheckCircle size={14} weight='fill' className='text-cc-accent' aria-hidden='true' />
				<span className='text-[12px] font-medium leading-4 text-cc-accent'>
					Session Complete
				</span>
			</div>
			<div className='flex items-center gap-6'>
				<CircularDial />
				<div className='flex flex-1 flex-col gap-1.5'>
					<ScoreBar label='Discovery' value={88} color='#10B981' />
					<ScoreBar label='Objections' value={61} color='#F59E0B' />
					<ScoreBar label='Close Attempt' value={74} color='#10B981' />
				</div>
			</div>
		</div>
	)
}

export default function SessionCompleteVisual(): ReactElement {
	return (
		<div
			className='flex w-full flex-1 flex-col items-center justify-center gap-6 py-4'
			role='img'
			aria-label='Live call with waveform between two participants, followed by a Session Complete summary showing a score of 81 out of 100 with discovery 88, objections 61, and close attempt 74.'
		>
			<LiveStrip />
			<SessionCard />
		</div>
	)
}
