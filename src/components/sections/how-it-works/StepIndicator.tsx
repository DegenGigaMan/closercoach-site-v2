/** @fileoverview S3 Step Indicator: vertical emerald spine + scroll-linked traveling pulse.
 * Spine is cropped to span from step 1's dot center to step 4's dot center so the
 * line never extends above/below the kicker dots. Per-step numbered dots are
 * rendered inside each StepKicker (not here) so they anchor to each step room's
 * kicker position. Respects prefers-reduced-motion: pulse pins, no travel. */

'use client'

import { useSyncExternalStore, type RefObject } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

/* SSR-safe mount flag. SSR snapshot is false; client snapshot flips true only
 * AFTER hydration completes. Used to gate any conditional render that depends
 * on browser-only state (media queries, useReducedMotion) so first client
 * paint matches the server HTML exactly. F33 StepIndicator hydration fix. */
function subscribeNoop() { return () => {} }
function useMounted(): boolean {
	return useSyncExternalStore(subscribeNoop, () => true, () => false)
}

export interface StepMeta {
	number: string
	label: string
}

interface StepIndicatorProps {
	containerRef: RefObject<HTMLElement | null>
}

/**
 * @description Emerald spine + scroll-linked pulse. Renders absolutely inside the
 * split container, cropped vertically so it starts/ends at the first and last
 * step kicker dot centers.
 */
export default function StepIndicator({ containerRef }: StepIndicatorProps) {
	/* Normalize to boolean: useReducedMotion returns null on SSR and true/false
	 * on client. `?? false` picks the motion branch as the shared default. */
	const prefersReducedMotion = useReducedMotion() ?? false
	/* Gate the conditional pulse-dot render behind mount so SSR and first client
	 * paint produce identical DOM. Only after hydration can prefersReducedMotion
	 * flip the pulse dot off. F33 fix. */
	const mounted = useMounted()
	const showPulseDot = mounted && !prefersReducedMotion

	/* F5 (W6): Motion's "non-static position" warning fires once at hook
	 * initialisation even though the containerRef is styled position: relative
	 * (className "relative" + inline style={{position:'relative'}}). Deferred
	 * per W6 brief permission for explicit-rationale deferral. See DEV-038.
	 *
	 * Why deferred (not fixed):
	 *   - Attempted gating `target` on mount (mounted ? containerRef : undefined)
	 *     did NOT silence the warning. The fallback to window-scroll itself
	 *     tripped the same message.
	 *   - Attempting to pass a second ref + mount gating added complexity
	 *     without changing the rendered output. useScroll fires correctly once
	 *     the containerRef attaches; the pulse animation works on every
	 *     capture.
	 *   - The warning is cosmetic dev-mode output. It does NOT appear in
	 *     production builds (validated: `bun run build` + `next start` emits
	 *     0 console warnings from Motion for this hook).
	 *   - No runtime defect: all captures (desktop + mobile, default + RM)
	 *     show the pulse traveling and the markers advancing correctly.
	 * Revisit in a dedicated Motion-hook audit session. */
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start center', 'end center'],
	})

	const pulseY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

	return (
		<div
			className="pointer-events-none absolute left-5 top-[var(--cc-rail-top)] z-10 hidden lg:block"
			style={{ bottom: 'var(--cc-rail-bottom)' }}
			aria-hidden="true"
		>
			<div className="relative h-full w-px">
				<div className="absolute inset-y-0 w-px bg-cc-accent/20" />
				<motion.div
					className="absolute top-0 w-px bg-cc-accent/80"
					style={{ height: pulseY }}
				/>
				{showPulseDot && (
					<motion.div
						className="absolute left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-cc-accent"
						style={{
							top: pulseY,
							boxShadow: '0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.35)',
						}}
					/>
				)}
			</div>
		</div>
	)
}
