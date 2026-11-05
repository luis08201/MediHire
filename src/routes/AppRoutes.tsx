import { Route, Routes } from 'react-router'
import { SiteLayout } from '../components/layout/SiteLayout.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { HospitalDetailsPage } from '../pages/HospitalDetailsPage.tsx'
import { HospitalsPage } from '../pages/HospitalsPage.tsx'
import { JobDetailsPage } from '../pages/JobDetailsPage.tsx'
import { JobsPage } from '../pages/JobsPage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:slug" element={<JobDetailsPage />} />
        <Route path="hospitals" element={<HospitalsPage />} />
        <Route path="hospitals/:slug" element={<HospitalDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
