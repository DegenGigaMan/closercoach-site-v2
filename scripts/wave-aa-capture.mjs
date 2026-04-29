/** Wave AA capture — verify hero entrance revert + Step 1/2/3 staged choreography.
 *  Captures hero (1440 + 390) + How-It-Works step rooms at multiple sub-states.
 *  Each step capture uses a FRESH page load so the inView trigger fires from a
 *  cold scroll, not a warm-already-in-view state. */

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = '/Users/degengigaman/Desktop/workspace/closercoach-site-v2/scratch/captures/playwright/wave-aa'
mkdirSync(OUT, { recursive: true })

const BASE = 'http://localhost:3000'

const VIEWPORTS = [
	['1440', 1440, 900],
	['390', 390, 844],
]

async function freshPage(browser, w, h) {
	const context = await browser.newContext({
		viewport: { width: w, height: h },
		deviceScaleFactor: 2,
		reducedMotion: 'no-preference',
	})
	const page = await context.newPage()
	await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
	await page.evaluate(() => document.fonts.ready)
	return { context, page }
}

async function scrollToStepRoom(page, stepNumber) {
	/* Each StepRoom in the LEFT column contains a StepKicker rendering the
	 * 2-digit step number (01/02/03) inside an absolutely-positioned
	 * font-mono span. We look up the kicker for the requested number and
	 * scroll its parent into view. This works for ALL steps regardless of
	 * activeStep (the right-column visual mounts after we scroll). */
	return page.evaluate((n) => {
		const padded = String(n).padStart(2, '0')
		const spans = Array.from(document.querySelectorAll('span'))
		for (const s of spans) {
			if (s.textContent && s.textContent.trim() === padded
				&& s.className.includes('font-[family-name:var(--font-mono)]')) {
				/* climb to the StepRoom motion.div ancestor (~6 levels up) */
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
	/* HERO: cold load, capture early frames so the entrance pacing is visible. */
	{
		const { context, page } = await freshPage(browser, w, h)
		// 0.4s -- early in entrance: badge + headline clipPath revealing
		await page.waitForTimeout(400)
		await page.screenshot({ path: join(OUT, `hero-stage-1-early-${vpName}.png`) })
		// 1.2s -- italic accent locked, subhead in, CTAs landing
		await page.waitForTimeout(800)
		await page.screenshot({ path: join(OUT, `hero-stage-2-mid-${vpName}.png`) })
		// 2.5s -- entire hero settled (phone + glow + app badges)
		await page.waitForTimeout(1300)
		await page.screenshot({ path: join(OUT, `hero-stage-3-settled-${vpName}.png`) })
		await context.close()
	}

	/* STEP 1: cold-scroll to Step 1 room. */
	{
		const { context, page } = await freshPage(browser, w, h)
		const r1 = await scrollToStepRoom(page, 1)
		console.log(`step1 vp=${vpName}`, r1)
		// 0.4s -- container should still be near-empty (only integrations pill landing)
		await page.waitForTimeout(400)
		await page.screenshot({ path: join(OUT, `step1-stage-1-integrations-${vpName}.png`) })
		// 1.6s -- rail drew, Today's Meetings caption + Sarah card just landing
		await page.waitForTimeout(1200)
		await page.screenshot({ path: join(OUT, `step1-stage-2-meetings-${vpName}.png`) })
		// 3.0s -- cloning lab visible (right column populated, lab halo showing)
		await page.waitForTimeout(1400)
		await page.screenshot({ path: join(OUT, `step1-stage-3-cloning-${vpName}.png`) })
		// 6.2s -- card snap-in + typewriter cascade in progress
		await page.waitForTimeout(3200)
		await page.screenshot({ path: join(OUT, `step1-stage-4-card-typewriter-${vpName}.png`) })
		// 8.0s -- settled card with all fields rendered
		await page.waitForTimeout(1800)
		await page.screenshot({ path: join(OUT, `step1-stage-5-settled-${vpName}.png`) })
		await context.close()
	}

	/* STEP 2: cold-scroll to Step 2 room. */
	{
		const { context, page } = await freshPage(browser, w, h)
		const r2 = await scrollToStepRoom(page, 2)
		console.log(`step2 vp=${vpName}`, r2)
		// 0.5s -- AI Clone card landed, roleplay shell still entering
		await page.waitForTimeout(500)
		await page.screenshot({ path: join(OUT, `step2-stage-1-clone-card-${vpName}.png`) })
		// 1.4s -- shell + first AI message
		await page.waitForTimeout(900)
		await page.screenshot({ path: join(OUT, `step2-stage-2-first-message-${vpName}.png`) })
		// 2.7s -- mid-stagger
		await page.waitForTimeout(1300)
		await page.screenshot({ path: join(OUT, `step2-stage-3-mid-stagger-${vpName}.png`) })
		// 5.0s -- settled
		await page.waitForTimeout(2300)
		await page.screenshot({ path: join(OUT, `step2-stage-4-settled-${vpName}.png`) })
		await context.close()
	}

	/* STEP 3: cold-scroll to Step 3 room. */
	{
		const { context, page } = await freshPage(browser, w, h)
		const r3 = await scrollToStepRoom(page, 3)
		console.log(`step3 vp=${vpName}`, r3)
		// 1.4s -- early ringing/dialer phase (inside 3A ringing window)
		await page.waitForTimeout(1400)
		await page.screenshot({ path: join(OUT, `step3-stage-1-ringing-${vpName}.png`) })
		// 3.4s -- connecting phase (inside 3B linger)
		await page.waitForTimeout(2000)
		await page.screenshot({ path: join(OUT, `step3-stage-2-connecting-${vpName}.png`) })
		// 5.2s -- live call early (first AI transcript landing)
		await page.waitForTimeout(1800)
		await page.screenshot({ path: join(OUT, `step3-stage-3-live-message1-${vpName}.png`) })
		// 6.7s -- live call mid (user message + chip)
		await page.waitForTimeout(1500)
		await page.screenshot({ path: join(OUT, `step3-stage-4-live-mid-${vpName}.png`) })
		// 9.0s -- mode swap (record mode)
		await page.waitForTimeout(2300)
		await page.screenshot({ path: join(OUT, `step3-stage-5-record-${vpName}.png`) })
		// 11.5s -- annotations + settled
		await page.waitForTimeout(2500)
		await page.screenshot({ path: join(OUT, `step3-stage-6-settled-${vpName}.png`) })
		await context.close()
	}
}

await browser.close()
console.log(`Wave AA captures written to ${OUT}`)
