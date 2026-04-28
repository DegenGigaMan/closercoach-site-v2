/**
 * Wave X cloning-sequence specific capture.
 * Uses /lab/how-it-works to render Step 1 in isolation and capture
 * cloning-lab + clone-revealed states across the timeline.
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

	for (const [vpName, w, h] of VIEWPORTS) {
		const context = await browser.newContext({
			viewport: { width: w, height: h },
			deviceScaleFactor: 1,
		})
		const page = await context.newPage()

		await page.goto(BASE + '/lab/how-it-works', { waitUntil: 'networkidle', timeout: 30000 })

		// Scroll past lab header into Step 1 room so the right column visual
		// is centred in the viewport.
		await page.evaluate(() => {
			const heading = document.querySelector('h2')
			if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'start' })
			window.scrollBy({ top: 300, left: 0, behavior: 'instant' })
		})
		await page.waitForTimeout(800)

		// Mid-cloning state (lab visible, ~1s into the cloning phase)
		await page.screenshot({ path: resolve(OUT, `step1-cloning-mid-${vpName}.png`), fullPage: false })

		// Late-cloning state (~3s in, bar near full)
		await page.waitForTimeout(2200)
		await page.screenshot({ path: resolve(OUT, `step1-cloning-late-${vpName}.png`), fullPage: false })

		// Card revealed (~6s in -- post snap)
		await page.waitForTimeout(2500)
		await page.screenshot({ path: resolve(OUT, `step1-clone-revealed-${vpName}.png`), fullPage: false })

		await context.close()
	}

	await browser.close()
	console.log('OK')
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
