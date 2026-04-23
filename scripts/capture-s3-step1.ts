/* @fileoverview Targeted capture of S3 Step 1 via /lab/how-it-works with ?step=1.
 * The lab route exposes devPin so we can render the Step 1 visual deterministically.
 * Also captures the production homepage at precise S3 Step 1 scroll position. */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const OUT_DIR = '/Users/degengigaman/Desktop/workspace/scratch/captures/closer-coach/s3-canvas-build-2026-04-22'
const URL = 'http://localhost:3000'

async function main() {
	await mkdir(OUT_DIR, { recursive: true })
	const browser = await chromium.launch()

	/* Desktop: 1440x900 — scroll precisely into Step 1 room */
	const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
	const page = await ctx.newPage()
	await page.goto(URL, { waitUntil: 'networkidle' })
	await page.waitForTimeout(800)

	/* Scroll to #how-it-works then advance into the first StepRoom so it becomes
	 * in-view (40%+). StepRoom is min-h-screen (100vh) lg:py-16. Scroll so the
	 * top of the splitRef is just above viewport, putting room 1 in center. */
	await page.evaluate(() => {
		const el = document.getElementById('how-it-works')
		if (!el) return
		const rect = el.getBoundingClientRect()
		/* Scroll so the opener clears, split starts ~120px from top */
		window.scrollTo({ top: window.scrollY + rect.top + 600, behavior: 'instant' })
	})
	await page.waitForTimeout(1500)
	await page.screenshot({ path: join(OUT_DIR, 'desktop-1440-s3-step1-v2.png') })

	/* Crop-like: capture just the section */
	const sec = await page.$('#how-it-works')
	if (sec) {
		await sec.screenshot({ path: join(OUT_DIR, 'desktop-1440-s3-section-full.png') })
	}

	/* Try the /lab route for a deterministic Step 1 view */
	await page.goto(`${URL}/lab/how-it-works?step=1&pin=5`, { waitUntil: 'networkidle' })
	await page.waitForTimeout(1200)
	await page.screenshot({ path: join(OUT_DIR, 'desktop-1440-lab-step1-settled.png') })

	/* Mobile lab */
	await ctx.close()

	const ctxM = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
	const pageM = await ctxM.newPage()
	await pageM.goto(`${URL}/lab/how-it-works?step=1&pin=5`, { waitUntil: 'networkidle' })
	await pageM.waitForTimeout(1200)
	await pageM.screenshot({ path: join(OUT_DIR, 'mobile-375-lab-step1.png'), fullPage: true })
	await ctxM.close()

	await browser.close()
	console.log('done')
}

main().catch((e) => { console.error(e); process.exit(1) })
