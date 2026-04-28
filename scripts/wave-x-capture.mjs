/**
 * Wave X Capture (Alim 2026-04-28 overnight feedback)
 * Captures the homepage at 1440 / 1280 / 390 with focus on:
 *   - Hero (W-X.1 pacing pass + W-X.5 corner-rays removal)
 *   - How It Works S3 Step 1 (W-X.2 clone-your-clients rebuild)
 *   - SectionHowItWorks Step 3 replaces logo strip (W-X.3)
 *   - ProofConnectorB pull quote (W-X.4 marker, no visual change)
 *
 * Output: scratch/captures/playwright/wave-x/
 */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const OUT = '/Users/degengigaman/Desktop/workspace/closercoach-site-v2/scratch/captures/playwright/wave-x'
const BASE = 'http://localhost:3000'

const VIEWPORTS = [
	['1440', 1440, 900],
	['1280', 1280, 800],
	['390', 390, 844],
]

async function main() {
	await mkdir(OUT, { recursive: true })
	const browser = await chromium.launch()
	const errors = []

	for (const [vpName, w, h] of VIEWPORTS) {
		const context = await browser.newContext({
			viewport: { width: w, height: h },
			deviceScaleFactor: 1,
		})
		const page = await context.newPage()

		const consoleErrors = []
		page.on('pageerror', (e) => consoleErrors.push(`[${vpName}] pageerror: ${e.message}`))
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(`[${vpName}] ${msg.text()}`)
		})

		await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 })
		// Hero entrance sequence ends ~5.5s. Capture mid-sequence + at-rest.
		await page.waitForTimeout(800)
		await page.screenshot({ path: resolve(OUT, `hero-mid-${vpName}.png`), fullPage: false })

		await page.waitForTimeout(5500)
		await page.screenshot({ path: resolve(OUT, `hero-rest-${vpName}.png`), fullPage: false })

		// Full page after entrance settles + scroll-trigger pass
		await page.evaluate(async () => {
			const delay = (ms) => new Promise((r) => setTimeout(r, ms))
			const total = document.documentElement.scrollHeight
			const step = Math.max(400, Math.floor(window.innerHeight * 0.8))
			for (let y = 0; y <= total; y += step) {
				window.scrollTo(0, y)
				await delay(150)
			}
			window.scrollTo(0, 0)
		})
		await page.waitForTimeout(400)
		await page.screenshot({ path: resolve(OUT, `home-full-${vpName}.png`), fullPage: true })

		// How It Works S3 -- Step 1 cloning sequence. Scroll to #how-it-works
		// then wait through the cloning lab phase (2.0-5.0s in-view) and the
		// card snap-in (5.0s).
		await page.evaluate(() => {
			const el = document.getElementById('how-it-works')
			if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
		})
		await page.waitForTimeout(500)
		await page.screenshot({ path: resolve(OUT, `how-it-works-enter-${vpName}.png`), fullPage: false })

		// Mid-cloning state (~3s into the sequence -- lab is visible)
		await page.waitForTimeout(2500)
		await page.screenshot({ path: resolve(OUT, `cloning-lab-${vpName}.png`), fullPage: false })

		// Post-snap (~6s in -- card revealed)
		await page.waitForTimeout(3500)
		await page.screenshot({ path: resolve(OUT, `clone-revealed-${vpName}.png`), fullPage: false })

		// Step 3 sell -- includes the new logo-strip
		await page.evaluate(() => {
			const headers = document.querySelectorAll('h2, h3')
			for (const h of headers) {
				if (/close the deal/i.test(h.textContent || '')) {
					h.scrollIntoView({ behavior: 'instant', block: 'center' })
					break
				}
			}
		})
		await page.waitForTimeout(800)
		await page.screenshot({ path: resolve(OUT, `step3-replaces-${vpName}.png`), fullPage: false })

		// ProofConnectorB pull quote
		await page.evaluate(() => {
			const el = document.getElementById('proof-connector-b')
			if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
		})
		await page.waitForTimeout(800)
		await page.screenshot({ path: resolve(OUT, `proof-quote-${vpName}.png`), fullPage: false })

		if (consoleErrors.length) {
			errors.push(...consoleErrors)
		}

		await context.close()
	}

	await browser.close()

	if (errors.length) {
		console.error('Console errors:')
		for (const e of errors) console.error('  ' + e)
	}

	console.log('OK')
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
