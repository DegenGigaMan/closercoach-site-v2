'use client'

import dynamic from 'next/dynamic'

const CalendlyEmbed = dynamic(() => import('./CalendlyEmbed'), { ssr: false })

export default function CalendlyWrapper() {
	return <CalendlyEmbed />
}
