/** @fileoverview Redirect /book-demo to /sales. */

import { redirect } from 'next/navigation'

export default function BookDemo() {
	redirect('/sales')
}
// wiejpoqjdqd