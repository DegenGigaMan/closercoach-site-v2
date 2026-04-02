/** @fileoverview Homepage with section placeholders for iterative build. */

const sections = [
	{ id: 'hero', surface: 'dark-hero', bg: 'bg-cc-foundation', label: 'S1 Hero', dark: true },
	{ id: 'social-proof', surface: 'warm', bg: 'bg-cc-warm', label: 'S2 Social Proof', dark: false },
	{ id: 'product', surface: 'dark-education', bg: 'bg-cc-foundation', label: 'S3 How It Works', dark: true },
	{ id: 'features', surface: 'dark-features', bg: 'bg-cc-foundation', label: 'S4 Features', dark: true },
	{ id: 'results', surface: 'warm', bg: 'bg-cc-warm', label: 'S5 Results', dark: false },
	{ id: 'teams', surface: 'dark-teams', bg: 'bg-cc-foundation', label: 'S6 Teams', dark: true },
	{ id: 'cta', surface: 'dark-cta', bg: 'bg-cc-foundation', label: 'S8 CTA', dark: true },
] as const

export default function HomePage() {
	return (
		<div>
			{sections.map((s) => (
				<section
					key={s.id}
					id={s.id}
					data-surface={s.surface}
					className={`min-h-[50vh] ${s.bg}`}
				>
					<div className="mx-auto max-w-7xl px-6 py-24">
						<h2 className={`display-lg ${s.dark ? 'text-white' : 'text-cc-text-primary-warm'}`}>
							{s.label}
						</h2>
						<p className={`mt-4 text-lg ${s.dark ? 'text-cc-text-secondary' : 'text-cc-text-secondary-warm'}`}>
							Section placeholder
						</p>
					</div>
				</section>
			))}
		</div>
	)
}
