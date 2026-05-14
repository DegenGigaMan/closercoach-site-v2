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
