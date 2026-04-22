/**
 * W16 S4 Bento Regrid Post-Build Capture
 * Captures the homepage S4 features section at 375/768/1440.
 * Output: scratch/captures/closer-coach/w16-postbuild/
 */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const OUT = '/Users/degengigaman/Desktop/workspace/closercoach-site-v2/scratch/captures/closer-coach/w16-postbuild'
const BASE = 'http://localhost:3000'

const VIEWPORTS = [
	['mobile', 375, 812],
	['tablet', 768, 1024],
	['desktop', 1440, 900],
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
		await page.waitForTimeout(600)

		// Full page scroll to trigger any in-view hooks
		await page.evaluate(async () => {
			const delay = (ms) => new Promise((r) => setTimeout(r, ms))
			const total = document.documentElement.scrollHeight
			const step = Math.max(400, Math.floor(window.innerHeight * 0.8))
			for (let y = 0; y <= total; y += step) {
				window.scrollTo(0, y)
				await delay(120)
			}
			window.scrollTo(0, 0)
		})
		await page.waitForTimeout(300)

		// 1. Full page capture
		await page.screenshot({ path: resolve(OUT, `home-full-${vpName}.png`), fullPage: true })

		// 2. Scroll to #features and capture viewport
		await page.evaluate(() => {
			const el = document.getElementById('features')
			if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
		})
		await page.waitForTimeout(400)
		await page.screenshot({ path: resolve(OUT, `features-viewport-${vpName}.png`), fullPage: false })

		// 3. Capture the features section as an element bound
		const locator = page.locator('#features')
		const count = await locator.count()
		if (count > 0) {
			await locator.first().screenshot({ path: resolve(OUT, `features-section-${vpName}.png`) })
		}

		if (consoleErrors.length) {
			errors.push(...consoleErrors)
		}

		await context.close()
	}

	await browser.close()

	if (errors.length) {
		console.error('Console errors:')
		for (const e of errors) console.error('  ' + e)
		process.exit(1)
	}

	console.log('OK')
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
