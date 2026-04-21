/** @fileoverview Homepage with all sections. */

import SectionHero from '@/components/sections/SectionHero'
import SectionSocialProof from '@/components/sections/SectionSocialProof'
import SectionPressStrip from '@/components/sections/SectionPressStrip'
import SectionHowItWorks from '@/components/sections/SectionHowItWorks'
import SectionFeatures from '@/components/sections/SectionFeatures'
import SectionResults from '@/components/sections/SectionResults'
import SectionTeams from '@/components/sections/SectionTeams'
import SectionCTA from '@/components/sections/SectionCTA'

export default function HomePage() {
	return (
		<div>
			<SectionHero />
			<SectionSocialProof />
			<SectionPressStrip />
			<SectionHowItWorks />
			<SectionFeatures />
			<SectionResults />
			<SectionTeams />
			<SectionCTA />
		</div>
	)
}
