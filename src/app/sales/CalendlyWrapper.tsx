'use client'

/** @fileoverview Client wrapper that dynamically imports CalendlyEmbed with
 *  ssr:false. next/dynamic({ ssr: false }) is only valid inside a Client
 *  Component — this file satisfies that constraint so page.tsx can stay a
 *  Server Component. */

import dynamic from 'next/dynamic'

const CalendlyEmbed = dynamic(() => import('./CalendlyEmbed'), { ssr: false })

export default function CalendlyWrapper() {
	return <CalendlyEmbed />
}
