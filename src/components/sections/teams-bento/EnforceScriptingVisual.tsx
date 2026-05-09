'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { User } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

const AVATARS = [
	{ src: '/images/avatars/closer-1.png', alt: 'Rep avatar 1' },
	{ src: '/images/avatars/closer-2.webp', alt: 'Rep avatar 2' },
	{ src: '/images/avatars/closer-3.webp', alt: 'Rep avatar 3' },
] as const

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function Rail({ visible, delay, reduced }: { visible: boolean; delay: number; reduced: boolean }): ReactElement {
	return (
		<div aria-hidden='true' className='relative flex h-8 w-px justify-center overflow-hidden'>
			<motion.span
				className='absolute inset-0 bg-gradient-to-b from-cc-accent/0 via-cc-accent/55 to-cc-accent/0'
				initial={{ scaleY: 0, originY: 0 }}
				animate={visible ? { scaleY: 1 } : { scaleY: 0 }}
				transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay }}
			/>
		</div>
	)
}

export default function EnforceScriptingVisual(): ReactElement {
	const reduced = useReducedMotion() ?? false
	const [visible, setVisible] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const io = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
			{ threshold: 0.2 },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [])

	const fade = (delay: number) =>
		reduced
			? {}
			: { initial: { opacity: 0, y: 10 }, animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }, transition: { duration: 0.45, ease: EASE, delay } }

	return (
		<div ref={ref} className='relative flex h-full w-full items-center justify-center px-5 py-6 md:px-6 md:py-8'>
			<div className='flex w-full max-w-[320px] flex-col items-center'>

				{/* 1. Manager badge */}
				<motion.div
					className='relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#1e2230] shadow-[0_0_16px_rgba(16,185,129,0.15)]'
					aria-label='Manager'
					{...fade(0)}
				>
					<User size={20} weight='bold' className='text-white/90' aria-hidden='true' />
				</motion.div>

				<Rail visible={visible} delay={0.2} reduced={reduced} />

				{/* 2. Task pill.
				 * L-08 (2026-05-09): drop `w-full` so the pill hugs its content
				 * + padding instead of stretching the bento card width. Pill stays
				 * centered via the parent's items-center alignment. */}
				<motion.div
					className='relative z-10 w-fit shrink-0 rounded-2xl border border-white/[0.08] bg-[#1E2230] px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
					{...fade(0.35)}
				>
					<div className='flex flex-col items-center text-center gap-1'>
						<span className='text-[14px] font-bold leading-tight text-white'>
							Objection Reframe Script
						</span>
						<span className='text-[11px] font-medium leading-tight text-cc-text-secondary'>
							All 8 reps · Due Friday
						</span>
					</div>
				</motion.div>

				<Rail visible={visible} delay={0.55} reduced={reduced} />

				{/* 3. CC app icon */}
				<motion.div
					aria-label='CloserCoach app'
					className='relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-white/10 shadow-[0_0_24px_rgba(16,185,129,0.45)]'
					style={{ background: 'radial-gradient(circle at 30% 25%, #1FB174 0%, #0F7044 70%, #08482C 100%)' }}
					animate={visible && !reduced ? { boxShadow: ['0 0 24px rgba(16,185,129,0.45)', '0 0 36px rgba(16,185,129,0.7)', '0 0 24px rgba(16,185,129,0.45)'] } : undefined}
					transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
					{...fade(0.7)}
				>
					<Image src='/images/cc-logomark.png' alt='' width={26} height={26} className='h-[26px] w-[26px] object-contain' />
				</motion.div>

				<Rail visible={visible} delay={0.85} reduced={reduced} />

				{/* 4. Rep avatars */}
				<motion.div className='relative z-10 flex shrink-0 -space-x-2.5' {...fade(1.0)}>
					{AVATARS.map((avatar, i) => (
						<motion.span
							key={avatar.src}
							className='relative inline-flex h-9 w-9 overflow-hidden rounded-full border-2 border-cc-foundation ring-1 ring-white/10'
							initial={reduced ? undefined : { opacity: 0, scale: 0.7 }}
							animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
							transition={reduced ? undefined : { duration: 0.35, ease: EASE, delay: 1.0 + i * 0.1 }}
						>
							<Image src={avatar.src} alt={avatar.alt} width={64} height={64} className='h-full w-full object-cover' />
						</motion.span>
					))}
				</motion.div>

			</div>
		</div>
	)
}
