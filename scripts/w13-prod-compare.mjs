import { chromium } from 'playwright'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
await p.goto('https://closercoach-site-v2.vercel.app/', { waitUntil: 'networkidle', timeout: 45000 })
await p.evaluate(async () => {
	const d = (ms) => new Promise((r) => setTimeout(r, ms))
	for (let y = 0; y <= document.documentElement.scrollHeight; y += Math.max(400, Math.floor(innerHeight * 0.8))) {
		window.scrollTo(0, y); await d(180)
	}
	window.scrollTo(0, 0); await d(400)
})
await p.waitForTimeout(600)
await p.screenshot({ path: '/Users/degengigaman/Desktop/workspace/scratch/captures/closer-coach/w13-baseline/home-desktop-PROD.png', fullPage: true })
console.log('prod shot captured')
await b.close()
