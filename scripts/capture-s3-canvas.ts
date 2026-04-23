/* @fileoverview Playwright capture for S3 StepCanvas build (2026-04-22).
 * Captures homepage at 1440 and 375 breakpoints; scrolls to S3 and captures
 * the section at each activeStep. Output: scratch/captures/closer-coach/
 * s3-canvas-build-2026-04-22/. */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT_DIR = '/Users/degengigaman/Desktop/workspace/scratch/captures/closer-coach/s3-canvas-build-2026-04-22'
const URL = 'http://localhost:3000'

async function main() {
	await mkdir(OUT_DIR, { recursive: true })
	const browser = await chromium.launch()

	/* Desktop: 1440x900 */
	const ctx1440 = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
	const page1440 = await ctx1440.newPage()
	await page1440.goto(URL, { waitUntil: 'networkidle' })
	await page1440.waitForTimeout(500)

	await page1440.screenshot({ path: join(OUT_DIR, 'desktop-1440-homepage-top.png') })

	/* Scroll into S3 so activeStep=1 visual is visible. The split is 100vh per
	 * step; scroll into the first room. */
	const s3 = await page1440.$('#how-it-works')
	if (s3) {
		await s3.scrollIntoViewIfNeeded()
		await page1440.evaluate(() => window.scrollBy(0, 400))
		await page1440.waitForTimeout(1200)
		await page1440.screenshot({ path: join(OUT_DIR, 'desktop-1440-s3-step1.png'), fullPage: false })

		/* Scroll further to activate step 2 */
		await page1440.evaluate(() => window.scrollBy(0, window.innerHeight))
		await page1440.waitForTimeout(1200)
		await page1440.screenshot({ path: join(OUT_DIR, 'desktop-1440-s3-step2.png') })

		await page1440.evaluate(() => window.scrollBy(0, window.innerHeight))
		await page1440.waitForTimeout(1200)
		await page1440.screenshot({ path: join(OUT_DIR, 'desktop-1440-s3-step3.png') })

		await page1440.evaluate(() => window.scrollBy(0, window.innerHeight))
		await page1440.waitForTimeout(1200)
		await page1440.screenshot({ path: join(OUT_DIR, 'desktop-1440-s3-step4.png') })
	}
	await ctx1440.close()

	/* Mobile: 375x812 */
	const ctx375 = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
	const page375 = await ctx375.newPage()
	await page375.goto(URL, { waitUntil: 'networkidle' })
	await page375.waitForTimeout(500)
	await page375.screenshot({ path: join(OUT_DIR, 'mobile-375-homepage-top.png') })

	const s3m = await page375.$('#how-it-works')
	if (s3m) {
		await s3m.scrollIntoViewIfNeeded()
		await page375.evaluate(() => window.scrollBy(0, 300))
		await page375.waitForTimeout(1200)
		await page375.screenshot({ path: join(OUT_DIR, 'mobile-375-s3-step1.png'), fullPage: false })

		await page375.evaluate(() => window.scrollBy(0, 400))
		await page375.waitForTimeout(1000)
		await page375.screenshot({ path: join(OUT_DIR, 'mobile-375-s3-step1-scrolled.png') })
	}

	await ctx375.close()
	await browser.close()
	console.log('captures saved to', OUT_DIR)
}

main().catch((e) => { console.error(e); process.exit(1) })
