/** @fileoverview Shared content primitives for legal pages: Section, BulletList, Strong, KeyValueTable. */

/**
 * @description A legal document section with an anchor id, h2 heading, and body content.
 * scroll-mt-32 ensures anchor link navigation clears the sticky header.
 */
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

/**
 * @description Bulleted list with emerald dot markers aligned to body text.
 */
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

/**
 * @description Bolded inline legal term with warm-surface text color.
 */
export function Strong({ children }: { children: React.ReactNode }) {
	return (
		<strong className="font-semibold text-cc-text-primary-warm">{children}</strong>
	)
}
