export const CARD_SHADOW = 'shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.15)]'

export const CARD_ENTER_SPRING = { type: 'spring' as const, stiffness: 260, damping: 24 } as const

export const FIELD_CASCADE_SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 } as const

export const THREAD_EASE = [0.22, 1, 0.36, 1] as const

export const KICKER_MONO_EMERALD = 'font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-accent'

export const KICKER_MONO_MUTED = 'font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-cc-text-muted'

export const FIELD_LABEL = 'font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-cc-text-muted'

export const FIELD_VALUE = 'font-sans text-[12px] text-cc-text-secondary'

export const PC_BADGE_PILL =
	'inline-flex items-center gap-2 rounded-full border border-cc-accent/30 bg-cc-accent/10 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.15em] text-cc-accent'
