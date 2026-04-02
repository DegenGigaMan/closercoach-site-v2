/** @fileoverview Reusable card with mouse-tracked emerald radial gradient spotlight effect. */

'use client'

import { useRef, useState, useCallback } from 'react'

interface SpotlightCardProps {
	children: React.ReactNode
	className?: string
}

/**
 * @description Card with mouse-tracked emerald spotlight. On hover, a radial gradient
 * follows the cursor and the border brightens. Subtle translateY lift on hover.
 */
export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
	const cardRef = useRef<HTMLDivElement>(null)
	const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false })

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		setSpotlight({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			active: true,
		})
	}, [])

	const handleMouseLeave = useCallback(() => {
		setSpotlight((prev) => ({ ...prev, active: false }))
	}, [])

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={`relative overflow-hidden transition-transform duration-300 ease-out ${
				spotlight.active ? '-translate-y-0.5' : 'translate-y-0'
			} ${className}`}
		>
			{/* Spotlight overlay */}
			{spotlight.active && (
				<div
					className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
					aria-hidden="true"
					style={{
						background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(16,185,129,0.08) 0%, transparent 50%)`,
					}}
				/>
			)}
			<div className="relative z-0">{children}</div>
		</div>
	)
}
