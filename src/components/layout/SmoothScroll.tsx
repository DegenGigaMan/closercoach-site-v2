'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
	const lenisRef = useRef<Lenis | null>(null)

	useEffect(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) return

		if (lenisRef.current) return

		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
		lenisRef.current = lenis

		function raf(time: number) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}
		requestAnimationFrame(raf)

		let resetTimer: ReturnType<typeof setTimeout> | null = null
		const onScrollReset = () => {
			if (resetTimer) clearTimeout(resetTimer)
			resetTimer = setTimeout(() => {
				lenis.scrollTo(0, { immediate: true })
			}, 100)
		}
		window.addEventListener('scroll-reset', onScrollReset)

		return () => {
			window.removeEventListener('scroll-reset', onScrollReset)
			if (resetTimer) clearTimeout(resetTimer)
			lenis.destroy()
			lenisRef.current = null
		}
	}, [])

	return null
}
