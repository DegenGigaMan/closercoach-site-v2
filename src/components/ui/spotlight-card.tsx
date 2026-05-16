/** @fileoverview Reusable card wrapper. Previously had mouse-tracked spotlight;
 * removed 2026-05-13 — the effect read as AI-generated. Now a plain wrapper
 * that passes className through without any mouse tracking or animation. */

interface SpotlightCardProps {
	children: React.ReactNode
	className?: string
}

export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
	return (
		<div className={`relative overflow-hidden ${className}`}>
			{children}
		</div>
	)
}
