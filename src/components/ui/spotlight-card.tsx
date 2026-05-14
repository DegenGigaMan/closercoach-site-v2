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
