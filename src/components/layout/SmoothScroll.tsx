/** @fileoverview Lenis smooth scroll wrapper. Initializes smooth scrolling globally. */

'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
	useEffect(() => {
		const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
		function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
		requestAnimationFrame(raf)
		return () => lenis.destroy()
	}, [])
	return null
}
