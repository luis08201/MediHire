import { FeaturedJobsSection } from '../components/home/FeaturedJobsSection.tsx'
import { FinalCtaSection } from '../components/home/FinalCtaSection.tsx'
import { HeroSection } from '../components/home/HeroSection.tsx'
import { PlatformSection } from '../components/home/PlatformSection.tsx'
import { useDocumentTitle } from '../lib/useDocumentTitle.ts'

export function HomePage() {
  useDocumentTitle('MediHire')

  return (
    <>
      <HeroSection />
      <FeaturedJobsSection />
      <PlatformSection />
      <FinalCtaSection />
    </>
  )
}
