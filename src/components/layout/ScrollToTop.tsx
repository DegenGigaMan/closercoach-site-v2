'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
	const pathname = usePathname()
	const isFirstMount = useRef(true)

	useEffect(() => {
		if (isFirstMount.current) {
			isFirstMount.current = false
			return
		}
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
		window.dispatchEvent(new Event('scroll-reset'))
	}, [pathname])

	return null
}
