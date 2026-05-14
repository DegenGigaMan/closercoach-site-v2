import { buildPageMetadata } from '@/lib/seo'
import ThankYouContent from './thank-you-content'

export const metadata = buildPageMetadata({
	title: 'Your demo is booked.',
	description: 'Your CloserCoach demo is on the calendar. Check your inbox for the invite and start exploring the app while you wait.',
	path: '/thank-you',
	indexable: false,
})

/** Pull a clean first name out of Calendly query params. Supports several common
 * key shapes the user might wire into Calendly's redirect URL template. Returns
 * undefined if no usable name is present so the headline falls back to generic. */
function sanitizeFirstName(
	params: { [key: string]: string | string[] | undefined },
): string | undefined {
	const candidates = ['first_name', 'invitee_first_name', 'name', 'invitee_full_name']
	let raw: string | undefined
	for (const key of candidates) {
		const v = params[key]
		if (typeof v === 'string' && v.trim()) {
			raw = v.trim()
			break
		}
	}
	if (!raw) return undefined
	const first = raw.split(/\s+/)[0]
	const clean = first.replace(/[^A-Za-z0-9'-]/g, '').slice(0, 30)
	if (!clean) return undefined
	return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase()
}

export default async function ThankYouPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const params = await searchParams
	const firstName = sanitizeFirstName(params)
	return <ThankYouContent firstName={firstName} />
}
