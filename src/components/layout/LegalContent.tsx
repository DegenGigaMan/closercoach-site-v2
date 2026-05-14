export function Section({
	id,
	title,
	children,
}: {
	id: string
	title: string
	children: React.ReactNode
}) {
	return (
		<section id={id} className="scroll-mt-32">
			<h2 className="display-sm text-cc-text-primary-warm">{title}</h2>
			<div className="mt-4 space-y-4 text-base leading-[1.7] text-cc-text-secondary-warm">
				{children}
			</div>
		</section>
	)
}

export function BulletList({ items }: { items: React.ReactNode[] }) {
	return (
		<ul className="mt-2 space-y-3 pl-0">
			{items.map((item, i) => (
				<li key={i} className="flex gap-3">
					<span
						aria-hidden="true"
						className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-cc-accent"
					/>
					<span>{item}</span>
				</li>
			))}
		</ul>
	)
}

export function Strong({ children }: { children: React.ReactNode }) {
	return (
		<strong className="font-semibold text-cc-text-primary-warm">{children}</strong>
	)
}
