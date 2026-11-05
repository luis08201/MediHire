import { FeaturedJobsSection } from '../components/home/FeaturedJobsSection.tsx'
import { FinalCtaSection } from '../components/home/FinalCtaSection.tsx'
import { HeroSection } from '../components/home/HeroSection.tsx'
import { HospitalsSection } from '../components/home/HospitalsSection.tsx'
import { HowItWorksSection } from '../components/home/HowItWorksSection.tsx'
import { PlatformSection } from '../components/home/PlatformSection.tsx'
import { WhySection } from '../components/home/WhySection.tsx'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

export function HomePage() {
  useDocumentTitle('MediHire')

  return (
    <>
      <HeroSection />
      <PlatformSection />
      <HowItWorksSection />
      <FeaturedJobsSection />
      <WhySection />
      <HospitalsSection />
      <FinalCtaSection />
    </>
  )
}
