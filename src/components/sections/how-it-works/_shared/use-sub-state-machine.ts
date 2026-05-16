/** @fileoverview Shared sub-state machine hook for How-It-Works step visuals.
 *
 * Extracted from MR-S3-W2 StepOneVisual's inline timer chain. Locked signature
 * per DD-S3-W2 F18 recommendation (2026-04-19). Consumed by W3-W5 step visuals
 * so each step inherits a proven, tested, reduced-motion-safe state chain.
 *
 * Behavior model:
 *   - Trigger-false + not-yet-started => returns initialState.
 *   - Trigger-true (on mount or on toggle) => starts a setTimeout chain that
 *     advances subState through the `states` list at each entry's enterAtMs.
 *   - Reduced-motion => skip the chain entirely, return settledState (or the
 *     last state's id if settledState is undefined), fire onSettle on mount.
 *   - once: true (default) => once chain starts, trigger re-toggles are ignored.
 *   - once: false => re-triggers reset to initialState and re-run the chain.
 *   - Cleanup clears all pending timers on unmount or re-trigger (when allowed).
 *
 * Known consumers:
 *   - W2 StepOneVisual (5-state chain: 1, 2, 3, 4, 5 at 0/500/1400/2800/3400ms)
 *   - W3-W5 Step 2/3/4 visuals (to be wired)
 *   - HPV2 state chains: NOT a consumer yet (shipped + DD PASS, retrofit out of
 *     scope for W2.5; see dispatch brief).
 *   - W1 StepRoom: NOT a consumer (trigger-only, no state chain).
 *
 * @example W2 StepOneVisual (5-state chain)
 *   const subState = useSubStateMachine<SubState>({
 *     states: [
 *       { id: 1, enterAtMs: 0 },
 *       { id: 2, enterAtMs: 500 },
 *       { id: 3, enterAtMs: 1400 },
 *       { id: 4, enterAtMs: 2800 },
 *       { id: 5, enterAtMs: 3400 },
 *     ],
 *     trigger: inView,
 *     reducedMotion: prefersReducedMotion,
 *     initialState: 1,
 *     settledState: 5,
 *   })
 *
 * Per-step side effects (waveform duck, sound cue, etc.) live OUTSIDE the hook
 * in consumer-level useEffect blocks keyed on the returned subState.
 *
 * WARNING — states array identity:
 *   The `states` array is a dependency of the internal effect. Inlining an
 *   array literal in the consumer (`states: [{ id: 1, enterAtMs: 0 }, ...]`)
 *   creates a NEW reference every render and, with `once: false`, will
 *   restart the chain on every render. Pin states in a module-level const
 *   (e.g., `const STEP_ONE_STATES = [...] as const`) or wrap in `useMemo` to
 *   stabilize identity. `once: true` (default) is safe either way because
 *   the chain only runs once regardless of dep changes.
 */

'use client'

import { useEffect, useRef, useState } from 'react'

export type SubState<T extends number | string> = {
	id: T
	enterAtMs: number
}

export type UseSubStateMachineOptions<T extends number | string> = {
	states: ReadonlyArray<SubState<T>>
	trigger: boolean
	reducedMotion: boolean
	initialState: T
	settledState?: T
	once?: boolean
	onSettle?: () => void
}

/**
 * @description Timed sub-state machine for scroll-trigger-then-autoplay step
 * visuals. See file-level docstring for behavior model and usage.
 */
export function useSubStateMachine<T extends number | string>(
	options: UseSubStateMachineOptions<T>,
): T {
	const {
		states,
		trigger,
		reducedMotion,
		initialState,
		settledState,
		once = true,
		onSettle,
	} = options

	const resolvedSettled = settledState ?? states[states.length - 1]?.id ?? initialState
	/* Always initialize to initialState. The reducedMotion branch in the effect
	 * below advances to resolvedSettled post-mount via setTimeout(0). Gating
	 * useState's initial value on reducedMotion would produce a SSR/client
	 * hydration mismatch when useReducedMotion flips null->true across the
	 * hydration boundary (F38). Fix matches the pattern SectionHero uses. */
	const [current, setCurrent] = useState<T>(initialState)
	const hasStartedRef = useRef(false)
	const onSettleRef = useRef(onSettle)

	/* Keep the latest onSettle ref without re-running the chain effect when the
	 * parent passes a new inline callback on every render. */
	useEffect(() => {
		onSettleRef.current = onSettle
	}, [onSettle])

	useEffect(() => {
		/* All state mutations are scheduled via setTimeout(fn, 0) to avoid the
		 * "synchronous setState inside useEffect" lint rule enforced repo-wide
		 * (matches the pattern in StepOneVisual's original inline chain). */
		const timers: ReturnType<typeof setTimeout>[] = []

		if (reducedMotion) {
			timers.push(setTimeout(() => {
				setCurrent(resolvedSettled)
				onSettleRef.current?.()
			}, 0))
			hasStartedRef.current = true
			return () => timers.forEach(clearTimeout)
		}

		if (!trigger) {
			if (!once) {
				hasStartedRef.current = false
				timers.push(setTimeout(() => setCurrent(initialState), 0))
			}
			return () => timers.forEach(clearTimeout)
		}

		if (once && hasStartedRef.current) return
		hasStartedRef.current = true

		states.forEach((state) => {
			timers.push(setTimeout(() => {
				setCurrent(state.id)
				if (state.id === resolvedSettled) onSettleRef.current?.()
			}, state.enterAtMs))
		})

		return () => timers.forEach(clearTimeout)
	}, [trigger, reducedMotion, states, initialState, resolvedSettled, once])

	return current
}
