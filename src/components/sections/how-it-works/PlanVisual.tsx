/** @fileoverview S3 Step 1 "Plan" visual — standalone composition.
 *
 * This component replaces the first revision (`StepOneVisual.tsx`) with a
 * flex-based layout that matches Figma node 40:1192 (file
 * fLZECQP0aetUwhj9ZHLJ6S). Renders inside the shared `StepCanvas`.
 *
 * Structure (horizontal flex, gap-[79px] at desktop):
 *   ┌ LEFT  ───────────────────────────── ┐  ┌ RIGHT ──────────────── ┐
 *   │ [✓✓]─┐  CONNECTED                   │  │ ⟳ Cloning...     3/7    │
 *   │      │  [GMeet · Teams · Salesforce]│  │ ▆▆▆░░░░                 │
 *   │      │                              │  │ ┌─Clone card──────────┐ │
 *   │ [📅]─┤  TODAY'S MEETINGS            │  │ │ [Sarah] [AI Clone]  │ │
 *   │      │  ┌─Sarah 10:30am (active)──┐ │──┤ │ NAME    ROLE        │ │
 *   │      │  └───────────────────────  ┘ │  │ │ COMPANY INDUSTRY    │ │
 *   │      │  ┌─Marcus 2:00pm  (dim) ───┐ │  │ │ ...                 │ │
 *   │      │  └─────────────────────────┘ │  │ │ [7 LAYERS OF PERSONALIZATION]
 *   │                                      │  │ └─────────────────────┘ │
 *   └──────────────────────────────────── ┘  └────────────────────────┘
 *
 * Key differences from `StepOneVisual.tsx` v1:
 *   - Flex layout instead of absolute pixel positioning — survives the
 *     StepCanvas container resizing without breaking.
 *   - Two left-column icon rails (Checks + Calendar) each with their own
 *     descending green thread, instead of a single thread from the pill.
 *   - Integrations pill is a subtle dark container with 3 brand logos, not
 *     the prior circular-badge treatment.
 *   - Connector "link" arrow hangs off the LEFT edge of the clone card at
 *     the vertical level of Sarah's active meeting card.
 *   - Sarah headshot is a dedicated asset (`avatar-sarah-v2.png`) used at
 *     both 28px (meeting card) and 40px (clone card).
 *
 * Copy source: vault/clients/closer-coach/copy/lp-copy-deck-v5.md §S3 Step 1.
 * Reduced-motion: only the spinner animates; respects the OS preference.
 */

'use client'

import Image from 'next/image'
import { useReducedMotion } from 'motion/react'
import { Calendar, Checks, Sparkle, SpinnerGap } from '@phosphor-icons/react'

const SARAH_AVATAR = '/images/step1/avatar-sarah-v2.png'
const MARCUS_AVATAR = '/images/step1/avatar-marcus-face.png'
const LOGO_GOOGLE_MEET = '/images/step1/logo-google-meet.svg'
const LOGO_TEAMS = '/images/step1/logo-teams.png'
const LOGO_SALESFORCE = '/images/step1/logo-salesforce.svg'

/* ─── Icon rail (shared between Checks and Calendar columns) ─── */

function IconRail({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex shrink-0 flex-col items-center gap-2 pb-1.5'>
			{children}
		</div>
	)
}

function IconBox({ children }: { children: React.ReactNode }) {
	return (
		<div
			className='flex shrink-0 items-center justify-center rounded-[4px] bg-cc-accent/10 p-1'
			aria-hidden='true'
		>
			{children}
		</div>
	)
}

function RailLine() {
	return (
		<span
			aria-hidden='true'
			className='min-h-full w-px flex-1 bg-gradient-to-b from-cc-accent/60 via-cc-accent/30 to-cc-accent/10'
		/>
	)
}

/* ─── Integrations pill (3 brand logos) ─── */

function IntegrationsPill() {
	return (
		<div
			className='inline-flex items-center gap-2 rounded-[12px] border border-white/[0.06] bg-cc-surface-card/60 px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.05)] backdrop-blur-sm'
			aria-label='Connected to Google Meet, Microsoft Teams, and Salesforce'
		>
			<div className='flex h-6 w-6 items-center justify-center'>
				<Image src={LOGO_GOOGLE_MEET} alt='' width={18} height={15} className='h-[15px] w-[18px]' unoptimized />
			</div>
			<div className='flex h-6 w-6 items-center justify-center'>
				<Image src={LOGO_TEAMS} alt='' width={24} height={24} className='h-6 w-6 object-contain' unoptimized />
			</div>
			<div className='flex h-8 w-8 items-center justify-center'>
				<Image src={LOGO_SALESFORCE} alt='' width={26} height={18} className='h-[18px] w-[26px] object-contain' unoptimized />
			</div>
		</div>
	)
}

/* ─── Meeting card (Sarah active / Marcus dim) ─── */

function MeetingCard({ name, time, avatarSrc, active = false }: {
	name: string, time: string, avatarSrc: string, active?: boolean,
}) {
	return (
		<div
			className={[
				'flex w-full items-start gap-2 rounded-[12px] border border-white/10 bg-cc-surface-card p-[9px]',
				'shadow-[-8px_8px_16px_0_rgba(0,0,0,0.6),0_0_20px_0_rgba(16,185,129,0.05)]',
				active ? '' : 'border-white/[0.14] opacity-40',
			].join(' ').trim()}
		>
			{active && (
				<span
					aria-hidden='true'
					className='self-stretch w-[3px] shrink-0 rounded-full bg-cc-accent'
				/>
			)}
			<div className='flex flex-1 items-start gap-3'>
				<div className='relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
					<Image src={avatarSrc} alt='' fill className='object-cover' sizes='28px' unoptimized />
				</div>
				<div className='flex min-w-0 flex-1 flex-col gap-3 py-1.5'>
					<span className='text-trim truncate text-[14px] font-semibold leading-5 text-[#EBEBEB]'>{name}</span>
					<span className='text-trim truncate text-[12px] leading-none text-white/50'>{time}</span>
				</div>
			</div>
		</div>
	)
}

/* ─── Left visual (integrations + calendar) ─── */

function LeftVisual() {
	return (
		<div className='flex w-[230px] shrink-0 flex-col gap-2'>
			{/* Integrations row */}
			<div className='flex items-stretch gap-3'>
				<IconRail>
					<IconBox>
						<Checks size={16} weight='bold' className='text-cc-accent' />
					</IconBox>
					<RailLine />
				</IconRail>
				<div className='flex w-[110px] flex-col gap-4 pb-6 pt-2'>
					<span className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.1em] text-cc-accent'>
						Connected
					</span>
					<IntegrationsPill />
				</div>
			</div>

			{/* Calendar row */}
			<div className='flex w-full items-stretch gap-3'>
				<IconRail>
					<IconBox>
						<Calendar size={16} weight='duotone' className='text-cc-accent' />
					</IconBox>
					<RailLine />
				</IconRail>
				<div className='flex flex-1 flex-col gap-4 pt-2'>
					<span className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-none tracking-[0.06em] text-white/80'>
						Today&apos;s Meetings
					</span>
					<div className='flex flex-col gap-3'>
						<MeetingCard name='Sarah Chen' time='10:30am' avatarSrc={SARAH_AVATAR} active />
						<MeetingCard name='Marcus Rivera' time='2:00pm' avatarSrc={MARCUS_AVATAR} />
					</div>
				</div>
			</div>
		</div>
	)
}

/* ─── Right visual (clone) ─── */

function CloneHeader({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	return (
		<div className='flex w-full flex-col gap-2 px-3'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-1'>
					<SpinnerGap
						size={16}
						weight='bold'
						className={`text-cc-accent ${prefersReducedMotion ? '' : 'animate-spin'}`}
						aria-hidden='true'
					/>
					<span className='text-trim font-[family-name:var(--font-mono)] text-[12px] font-semibold uppercase tracking-[0.1em] text-cc-accent'>
						Cloning...
					</span>
				</div>
				<div className='flex items-baseline tabular-nums'>
					<span className='text-[14px] font-semibold leading-[15px] text-cc-accent'>3</span>
					<span className='text-[12px] leading-[15px] tracking-[0.06em] text-cc-text-secondary'>/7</span>
				</div>
			</div>
			<div className='flex h-1 w-full items-start gap-1' aria-hidden='true'>
				{Array.from({ length: 7 }).map((_, i) => (
					<span
						key={i}
						className={`h-full min-w-px flex-1 rounded-full ${i < 3 ? 'bg-cc-accent' : 'bg-white/15'}`}
					/>
				))}
			</div>
		</div>
	)
}

function FieldLabeled({ label, value }: { label: string, value: string }) {
	return (
		<div className='flex flex-col items-start gap-2'>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[12px] uppercase leading-[13.5px] tracking-[0.0375em] text-cc-text-secondary'>
				{label}
			</span>
			<span className='font-sans text-[14px] leading-5 text-white'>{value}</span>
		</div>
	)
}

function FieldBlurred({ label, widthClass }: { label: string, widthClass: string }) {
	return (
		<div className='flex flex-col items-start gap-[5px]' aria-label={`${label} loading`}>
			<span className='text-trim font-[family-name:var(--font-mono)] text-[12px] uppercase leading-[13.5px] tracking-[0.0375em] text-cc-text-secondary'>
				{label}
			</span>
			<span
				aria-hidden='true'
				className={`h-4 rounded bg-gradient-to-r from-white/10 via-white/[0.15] to-white/10 ${widthClass}`}
			/>
		</div>
	)
}

function ProofBadge() {
	return (
		<div className='inline-flex items-center gap-1 rounded-full border border-cc-accent/40 bg-cc-foundation px-[11px] py-[5px] shadow-[0_0_16px_rgba(16,185,129,0.25)]'>
			<Sparkle size={10} weight='fill' className='text-cc-accent' aria-hidden='true' />
			<span className='text-trim whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] font-normal uppercase leading-[15px] tracking-[0.05em] text-cc-accent'>
				7 Layers of Personalization
			</span>
		</div>
	)
}

function CloneCard() {
	return (
		<div className='relative w-full rounded-2xl border-[0.5px] border-cc-accent/60 bg-cc-surface-card px-[12.5px] pb-[32.5px] pt-[12.5px] shadow-[-8px_8px_16px_0_rgba(0,0,0,0.6),0_0_20px_0_rgba(16,185,129,0.05)]'>
			<div className='flex flex-col gap-4'>
				{/* Top row: Sarah avatar + AI Clone badge */}
				<div className='flex items-center gap-3'>
					<div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.05]'>
						<Image src={SARAH_AVATAR} alt='Sarah Chen portrait' fill className='object-cover' sizes='40px' unoptimized />
					</div>
					<span className='inline-flex items-center rounded-md border border-cc-accent/20 bg-cc-accent/20 p-[9px] font-sans text-[16px] font-medium leading-5 text-cc-accent'>
						AI Clone
					</span>
				</div>

				{/* 2-col × 4-row field grid */}
				<div className='grid grid-cols-2 gap-x-3 gap-y-6'>
					<FieldLabeled label='NAME' value='Sarah Chen' />
					<FieldLabeled label='ROLE' value='VP Operations' />

					<FieldLabeled label='COMPANY' value='Greenleaf Inc.' />
					<FieldBlurred label='INDUSTRY' widthClass='w-[93px]' />

					<FieldBlurred label='OBJECTION' widthClass='w-[97px]' />
					<FieldBlurred label='TALK TRACK' widthClass='w-[71px]' />

					<FieldBlurred label='PAIN 1' widthClass='w-[70px]' />
					<FieldBlurred label='PAIN 2' widthClass='w-[93px]' />
				</div>
			</div>

			{/* 7 Layers proof badge anchored on the bottom edge */}
			<div className='absolute -bottom-[12.5px] left-1/2 -translate-x-1/2'>
				<ProofBadge />
			</div>
		</div>
	)
}

/* Connector "link" arrow — hangs off the left of the clone column at the
 * vertical level of Sarah's active meeting card. Figma: w=82, h=6,
 * positioned at left=-82, top=191 relative to the clone-visual container.
 * SVG keeps the gradient + endpoint dots in one paint pass. */
function Connector() {
	return (
		<svg
			aria-hidden='true'
			width='82'
			height='6'
			viewBox='0 0 82 6'
			className='pointer-events-none absolute -left-[82px] top-[191px]'
		>
			<defs>
				<linearGradient id='cc-plan-link' x1='0%' y1='50%' x2='100%' y2='50%'>
					<stop offset='0%' stopColor='#10B981' stopOpacity='0.9' />
					<stop offset='100%' stopColor='#10B981' stopOpacity='0.9' />
				</linearGradient>
			</defs>
			<circle cx='3' cy='3' r='3' fill='#10B981' />
			<rect x='3' y='2' width='76' height='2' rx='1' fill='url(#cc-plan-link)' />
			<circle cx='79' cy='3' r='3' fill='#10B981' />
		</svg>
	)
}

function CloneVisual({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
	return (
		<div className='relative flex w-[250px] shrink-0 flex-col items-center gap-3'>
			<CloneHeader prefersReducedMotion={prefersReducedMotion} />
			<CloneCard />
			<Connector />
		</div>
	)
}

/* ─── Root ─── */

export default function PlanVisual({}: { devPin?: boolean } = {}) {
	const prefersReducedMotion = useReducedMotion() ?? false
	return (
		<div
			data-step='1'
			className='flex h-full w-full items-center justify-center px-8 py-10 md:px-12 md:py-14'
		>
			<div className='flex items-center gap-[79px]'>
				<LeftVisual />
				<CloneVisual prefersReducedMotion={prefersReducedMotion} />
			</div>
		</div>
	)
}
