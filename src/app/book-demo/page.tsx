/** @fileoverview Redirect to Calendly demo booking page. */

import { redirect } from 'next/navigation'
import { BRAND } from '@/lib/constants'

export default function BookDemo() {
	redirect(BRAND.calendly)
}
