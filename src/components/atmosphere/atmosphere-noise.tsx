/** @fileoverview L2 noise texture overlay. SVG feTurbulence at configurable opacity.
 * Fixed position, covers full viewport. Active on dark sections only.
 * Per atmosphere-spec.md Section 4.1. */

'use client'

/** @description L2 noise overlay. Use INSIDE dark section containers (position: absolute).
 * Do NOT use position: fixed -- that bleeds onto warm sections.
 * Each dark section should include this component. */
export default function AtmosphereNoise({ opacity = 0.03 }: { opacity?: number }) {
	return (
		<svg
			className="pointer-events-none absolute inset-0 z-[1] h-full w-full mix-blend-overlay"
			style={{ opacity }}
			aria-hidden="true"
		>
			<filter id="cc-noise">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.65"
					numOctaves={3}
					stitchTiles="stitch"
				/>
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#cc-noise)" />
		</svg>
	)
}
