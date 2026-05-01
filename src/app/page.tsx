/** @fileoverview Homepage with all sections. */

import type { Metadata } from 'next'
import SectionHero from '@/components/sections/SectionHero'
import SectionSocialProof from '@/components/sections/SectionSocialProof'
import SectionPressStrip from '@/components/sections/SectionPressStrip'
import SectionHowItWorks from '@/components/sections/SectionHowItWorks'
import SectionProofConnectorA from '@/components/sections/SectionProofConnectorA'
import SectionFeatures from '@/components/sections/SectionFeatures'
import SectionProofConnectorB from '@/components/sections/SectionProofConnectorB'
import SectionResults from '@/components/sections/SectionResults'
import SectionTeams from '@/components/sections/SectionTeams'
import SectionFAQ from '@/components/sections/SectionFAQ'
import SectionCTA from '@/components/sections/SectionCTA'

export const metadata: Metadata = {
	alternates: {
		canonical: '/',
	},
}

export default function HomePage() {
	return (
		<div>
			<SectionHero />
			<SectionSocialProof />
			<SectionPressStrip />
			<SectionHowItWorks />
			<SectionProofConnectorA />
			<SectionFeatures />
			<SectionProofConnectorB />
			<SectionResults />
			<SectionTeams />
			<SectionFAQ />
			<SectionCTA />
		</div>
	)
}
