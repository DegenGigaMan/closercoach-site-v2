// sitewide audit capture — 2026-04-22
// captures 10 routes × 3 viewports full-page → scratch/captures/closer-coach/sitewide-audit-2026-04-22/

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = '/Users/degengigaman/Desktop/workspace/scratch/captures/closer-coach/sitewide-audit-2026-04-22'
mkdirSync(OUT, { recursive: true })

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
	['book-demo', '/book-demo'],
]

const VIEWPORTS = [
	['1440', 1440, 900],
	['768', 768, 1024],
	['375', 375, 812],
]

const BASE = 'http://localhost:3000'

const browser = await chromium.launch({ headless: true })

for (const [vpName, w, h] of VIEWPORTS) {
	const context = await browser.newContext({
		viewport: { width: w, height: h },
		deviceScaleFactor: 2,
		reducedMotion: 'no-preference',
	})
	const page = await context.newPage()
	for (const [slug, path] of ROUTES) {
		const url = `${BASE}${path}`
		const file = join(OUT, `${slug}-${vpName}.png`)
		try {
			await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
			// wait for fonts
			await page.evaluate(() => document.fonts.ready)
			// trigger lazy / intersection observers: scroll to bottom, then back to top
			await page.evaluate(async () => {
				await new Promise((resolve) => {
					let total = 0
					const distance = 400
					const timer = setInterval(() => {
						window.scrollBy(0, distance)
						total += distance
						if (total >= document.body.scrollHeight) {
							clearInterval(timer)
							resolve(null)
						}
					}, 100)
				})
			})
			await page.waitForTimeout(800)
			await page.evaluate(() => window.scrollTo(0, 0))
			await page.waitForTimeout(500)
			await page.screenshot({ path: file, fullPage: true })
			console.log(`✓ ${slug}-${vpName}.png`)
		} catch (err) {
			console.error(`✗ ${slug}-${vpName}: ${err.message}`)
		}
	}
	await context.close()
}

await browser.close()
console.log('done')
