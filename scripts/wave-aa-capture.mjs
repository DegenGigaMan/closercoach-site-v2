/** Wave AA capture — verify hero entrance revert + Step 1/2/3 staged choreography.
 *
 *  Wave C1 update (Q17 audit MR-Q17-CC-3):
 *  - Step 3 + Step 4 sub-states now captured via `/lab/how-it-works?pin=<state>`
 *    URL pins. This eliminates the inView race that was producing
 *    `step3-stage-1-ringing-390.png` showing post-3F annotations on mobile.
 *  - Step 1 early-frame timing tightened: capture polled at 200/400/700ms
 *    after inView trigger so `stage-1-integrations` actually shows the
 *    integrations pill landing pre-rail-draw.
 *  - Hero unchanged (cold homepage load, three timed snapshots).
 *
 *  Each step capture uses a FRESH page load so the inView trigger fires from
 *  a cold scroll, not a warm-already-in-view state. */

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = '/Users/degengigaman/Desktop/workspace/closercoach-site-v2/scratch/captures/playwright/wave-aa'
mkdirSync(OUT, { recursive: true })

const BASE = process.env.CC_BASE || 'http://localhost:3000'

const VIEWPORTS = [
	['1440', 1440, 900],
	['390', 390, 844],
]

async function freshPage(browser, w, h, path = '') {
	const context = await browser.newContext({
		viewport: { width: w, height: h },
		deviceScaleFactor: 2,
		reducedMotion: 'no-preference',
	})
	const page = await context.newPage()
	await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 })
	await page.evaluate(() => document.fonts.ready)
	return { context, page }
}

async function scrollToStepRoom(page, stepNumber) {
	/* Each StepRoom in the LEFT column contains a StepKicker rendering the
	 * 2-digit step number (01/02/03) inside an absolutely-positioned
	 * font-mono span. Scroll the kicker's StepRoom motion.div ancestor into
	 * view so the right-column visual mounts and inView fires. */
	return page.evaluate((n) => {
		const padded = String(n).padStart(2, '0')
		const spans = Array.from(document.querySelectorAll('span'))
		for (const s of spans) {
			if (s.textContent && s.textContent.trim() === padded
				&& s.className.includes('font-[family-name:var(--font-mono)]')) {
				let el = s
				for (let i = 0; i < 8 && el; i++) {
					el = el.parentElement
					if (el && el.className && el.className.includes && el.className.includes('lg:min-h-screen')) {
						el.scrollIntoView({ block: 'start', behavior: 'instant' })
						return { found: true, mode: 'kicker', stepNumber: n }
					}
				}
			}
		}
		const v = document.querySelector(`[data-step="${n}"]`)
		if (v) {
			v.scrollIntoView({ block: 'center', behavior: 'instant' })
			return { found: true, mode: 'data-step', stepNumber: n }
		}
		return { found: false, stepNumber: n }
	}, stepNumber)
}

const browser = await chromium.launch({ headless: true })

for (const [vpName, w, h] of VIEWPORTS) {
	/* HERO: cold homepage load, capture early frames so the entrance pacing
	 * is visible. */
	{
		const { context, page } = await freshPage(browser, w, h)
		await page.waitForTimeout(400)
		await page.screenshot({ path: join(OUT, `hero-stage-1-early-${vpName}.png`) })
		await page.waitForTimeout(800)
		await page.screenshot({ path: join(OUT, `hero-stage-2-mid-${vpName}.png`) })
		await page.waitForTimeout(1300)
		await page.screenshot({ path: join(OUT, `hero-stage-3-settled-${vpName}.png`) })
		await context.close()
	}

	/* STEP 1: cold homepage scroll. Step 1 has no URL pin (no sub-state
	 * machine). Use tightened polling intervals from inView trigger so the
	 * integrations-pill / meetings-caption landing frames are actually
	 * captured rather than skipped. */
	{
		const { context, page } = await freshPage(browser, w, h)
		const r1 = await scrollToStepRoom(page, 1)
		console.log(`step1 vp=${vpName}`, r1)
		await page.waitForTimeout(200)
		await page.screenshot({ path: join(OUT, `step1-stage-1-integrations-${vpName}.png`) })
		await page.waitForTimeout(500)
		await page.screenshot({ path: join(OUT, `step1-stage-2-meetings-${vpName}.png`) })
		await page.waitForTimeout(1100)
		await page.screenshot({ path: join(OUT, `step1-stage-3-cloning-${vpName}.png`) })
		await page.waitForTimeout(2000)
		await page.screenshot({ path: join(OUT, `step1-stage-4-card-typewriter-${vpName}.png`) })
		await page.waitForTimeout(2500)
		await page.screenshot({ path: join(OUT, `step1-stage-5-settled-${vpName}.png`) })
		await context.close()
	}

	/* STEP 2: cold homepage scroll. StepTwoVisual has no sub-state machine. */
	{
		const { context, page } = await freshPage(browser, w, h)
		const r2 = await scrollToStepRoom(page, 2)
		console.log(`step2 vp=${vpName}`, r2)
		await page.waitForTimeout(500)
		await page.screenshot({ path: join(OUT, `step2-stage-1-clone-card-${vpName}.png`) })
		await page.waitForTimeout(900)
		await page.screenshot({ path: join(OUT, `step2-stage-2-first-message-${vpName}.png`) })
		await page.waitForTimeout(1300)
		await page.screenshot({ path: join(OUT, `step2-stage-3-mid-stagger-${vpName}.png`) })
		await page.waitForTimeout(2300)
		await page.screenshot({ path: join(OUT, `step2-stage-4-settled-${vpName}.png`) })
		await context.close()
	}

	/* STEP 3: PIN MODE via /lab/how-it-works?pin=<state>. Each pin captures a
	 * deterministic sub-state without racing the auto-advance chain. The
	 * mobile-3-ringing race that captured post-3F annotations is now
	 * impossible because the state machine is bypassed entirely. */
	const STEP3_PINS = [
		['3A', 'step3-stage-1-ringing'],
		['3B', 'step3-stage-2-connecting'],
		['3C', 'step3-stage-3-live-message1'],
		['3C', 'step3-stage-4-live-mid'],
		['3D', 'step3-stage-5-record'],
		['3F', 'step3-stage-6-settled'],
	]
	for (const [pin, label] of STEP3_PINS) {
		const { context, page } = await freshPage(browser, w, h, `/lab/how-it-works?pin=${pin}`)
		const r3 = await scrollToStepRoom(page, 3)
		console.log(`step3-${pin} vp=${vpName}`, r3)
		/* short settle so the pinned sub-state renders any internal animations
		 * (typewriter for live-call messages, annotation springs for 3E/3F). */
		await page.waitForTimeout(label === 'step3-stage-4-live-mid' ? 1500 : 600)
		await page.screenshot({ path: join(OUT, `${label}-${vpName}.png`) })
		await context.close()
	}
}

await browser.close()
console.log(`Wave AA captures written to ${OUT}`)
