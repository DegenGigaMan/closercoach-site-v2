@AGENTS.md

# CloserCoach Site v2

## Project
- Purpose: Multi-page marketing site for CloserCoach AI sales coaching platform (clean rebuild)
- Deploy: Vercel (closercoach-site-v2.vercel.app)
- Owner: vault/clients/closer-coach/project.json
- Tracker: vault/clients/closer-coach/PROJECT-TRACKER.md

## Tech Stack
- Next.js 15 (app directory)
- React 19
- Tailwind v4
- Phosphor Icons (primary), simple-icons (brand logos)
- GSAP + Lenis (smooth scroll)
- Motion (component animations, layoutId morphing, AnimatePresence)
- Lora Bold + Lora Bold Italic (headings, --font-heading, weight 700, italic for emphasized words) + Inter (body, --font-sans) + Geist Mono (stats, --font-mono). Locked 2026-04-21, supersedes prior Young Serif lock.

## Design System
- Colors, typography, spacing from VIS (vis-visual-identity-system.md)
- See src/lib/constants.ts for locked data (stats, pricing, brand)
- Brand: dark palette (#0D0F14), emerald accent (#10B981), warm editorial breaks (#F5F0EB)
- Teal (#00D4AA) is atmospheric support only at 8-12% opacity, never interactive
- CTA text color: white on emerald background (19.2:1 contrast)
- Emerald on warm surfaces: use accent-hover (#059669) for text (WCAG AA)
- Phone allocation: 2 sections only (S1 Hero, S3 Step 2)
- Heading emphasis: weight+italic primary (Lora Bold → Lora Bold Italic for emphasized words), color variation (white/emerald) as optional layer on italicized spans. Per VIS §2 lock 2026-04-21.
- Custom Tailwind tokens: cc-foundation, cc-surface, cc-accent, cc-text-secondary, etc.

## Copy Sources
- Homepage: vault/clients/closer-coach/copy/lp-copy-deck-v5.md (LOCKED, supersedes v4)
- Subpages: vault/clients/closer-coach/copy/pages/
- Site map: vault/clients/closer-coach/copy/site-map.md
- Navigation: vault/clients/closer-coach/copy/pages/navigation.md

## Build Rules
- Section padding: py-24 desktop, py-16 mobile
- Container: max-w-7xl mx-auto px-6
- Card padding: p-8 desktop, p-6 mobile
- Build ONE section at a time with visual verification
- No substitution from spec without logging in build-deviations.md
