'use client'

/** @fileoverview Client wrapper — dynamically imports CalendlyEmbed with
 *  ssr:false so the iframe only renders on the client. */

import dynamic from 'next/dynamic'

const CalendlyEmbed = dynamic(() => import('./CalendlyEmbed'), { ssr: false })

export default function CalendlyWrapper() {
	return <CalendlyEmbed />
}
