'use client'

import { useEffect } from 'react'

export default function ScrollTopOnMount() {
	useEffect(() => {
		// Instant jump: bypass any in-flight Lenis tween. 'auto' over 'smooth'
		// because the user just landed on a new route and expects the article
		// header, not a slow scroll choreography.
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
	}, [])

	return null
}
