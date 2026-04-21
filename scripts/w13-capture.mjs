/**
 * W13 Visual Regression Baseline
 * Captures 9 routes x 2 viewports = 18 full-page screenshots.
 * Output: scratch/captures/closer-coach/w13-baseline/
 */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const OUT = '/Users/degengigaman/Desktop/workspace/scratch/captures/closer-coach/w13-baseline'
const BASE = 'http://localhost:3001'

const ROUTES = [
	['home', '/'],
	['pricing', '/pricing'],
	['download', '/download'],
	['thank-you', '/thank-you'],
	['privacy', '/privacy'],
	['terms', '/terms'],
	['subprocessors', '/subprocessors'],
	['cookie-policy', '/cookie-policy'],
	['blog', '/blog'],
]

const VIEWPORTS = [
	['mobile', 390, 844],
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

		for (const [name, path] of ROUTES) {
			const url = BASE + path
			const out = resolve(OUT, `${name}-${vpName}.png`)
			try {
				await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
				await page.waitForTimeout(800)
				// Scroll through full page to trigger whileInView animations
				await page.evaluate(async () => {
					const delay = (ms) => new Promise((r) => setTimeout(r, ms))
					const total = document.documentElement.scrollHeight
					const step = Math.max(400, Math.floor(window.innerHeight * 0.8))
					for (let y = 0; y <= total; y += step) {
						window.scrollTo(0, y)
						await delay(180)
					}
					window.scrollTo(0, 0)
					await delay(400)
				})
				await page.waitForTimeout(600)
				await page.screenshot({ path: out, fullPage: true })
				console.log(`[OK] ${vpName} ${path} -> ${out}`)
			} catch (e) {
				errors.push(`[FAIL] ${vpName} ${path}: ${e.message}`)
				console.error(`[FAIL] ${vpName} ${path}: ${e.message}`)
			}
		}

		if (consoleErrors.length > 0) {
			errors.push(...consoleErrors)
		}
		await context.close()
	}

	await browser.close()

	if (errors.length > 0) {
		console.log(`\n[ERRORS]`)
		errors.forEach((e) => console.log(e))
		process.exit(errors.length)
	}
	console.log(`\n[DONE] ${ROUTES.length * VIEWPORTS.length} screenshots captured.`)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
