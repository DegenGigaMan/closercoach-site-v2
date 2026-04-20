/** @fileoverview Shared visual vocabulary for How-It-Works step visuals (W2-W5).
 *
 * Extracted from MR-S3-W2 StepOneVisual per DD-S3-W2 F19 recommendation
 * (2026-04-19). Prevents vocabulary drift across step visuals by centralizing:
 *   - Card shadow recipe (mirrors Hero V2 CARD_SHADOW)
 *   - Spring physics constants (card entrance, field cascade, thread ease)
 *   - Kicker / field label / field value classes (mono grammar)
 *   - PC badge pill (7 Layers of Personalization shape, reusable for PC2/PC3)
 *
 * Per-component tuning may diverge where a specific composition needs a
 * different value. Document any divergence in the consuming component.
 *
 * Authority sources:
 *   - src/components/hero/hero-phone-v2.tsx (CARD_SHADOW origin)
 *   - vault/clients/closer-coach/design/motion-spec.md (Thread Emergence ease)
 *   - vault/clients/closer-coach/research/r7-visual-direction.md (emerald tokens)
 */

/**
 * @description L1 elevated card dual shadow. Matches hero-phone-v2 CARD_SHADOW
 * recipe: mid-depth drop shadow + emerald bloom. Use on primary composition
 * cards (calendar widget, clone card, practice card, dashboard mock, etc.).
 */
export const CARD_SHADOW = 'shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.15)]'

/**
 * @description Spring physics for card entrance motion. Mirrors Hero V2 card
 * entrance vocabulary (stiffness 260, damping 24 in W2 baseline). W2.5
 * normalises damping to 28 for lighter, more layered arrival; W2 baseline used
 * 24 which is preserved below as CARD_ENTER_SPRING_HPV2 for parity.
 */
export const CARD_ENTER_SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 } as const
export const CARD_ENTER_SPRING_HPV2 = { type: 'spring' as const, stiffness: 260, damping: 24 } as const

/**
 * @description Spring physics for field-row cascade motion. Tighter than card
 * entrance; rows should snap into place over a short window to keep the 1.28s
 * 8-field cascade legible without dragging.
 */
export const FIELD_CASCADE_SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 } as const

/**
 * @description Overshoot-bias cubic ease used for Thread Emergence paths
 * (pathLength 0 -> 1) and any stroke-draw motion. See motion-spec.md.
 */
export const THREAD_EASE = [0.22, 1, 0.36, 1] as const

/**
 * @description Mono uppercase kicker on emerald accent. Default vocabulary for
 * state labels, section beat markers, and system-action tags (e.g., ENRICHED,
 * RECORDING, COACHED). 10px with 0.2em tracking.
 */
export const KICKER_MONO_EMERALD = 'font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-accent'

/**
 * @description Mono uppercase kicker on muted text. Default for passive or
 * placeholder state labels that should recede until activated.
 */
export const KICKER_MONO_MUTED = 'font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-text-muted'

/**
 * @description Field label class for clone-card style grids (LABEL / value).
 * 9px mono uppercase with 0.15em tracking. Pairs with FIELD_VALUE.
 */
export const FIELD_LABEL = 'font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-muted'

/**
 * @description Field value class for clone-card style grids. 12px sans on
 * secondary text color. Pairs with FIELD_LABEL.
 */
export const FIELD_VALUE = 'font-sans text-[12px] text-cc-text-secondary'

/**
 * @description PC proof-point badge pill. Reusable shape for PC1 (7 Layers of
 * Personalization), PC2, PC3, etc. Emerald border + emerald/10 surface + mono
 * uppercase label. Pair with a visual proof element (dot strip, icon cluster)
 * before the label text.
 */
export const PC_BADGE_PILL =
	'inline-flex items-center gap-2 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.15em] text-cc-accent'
