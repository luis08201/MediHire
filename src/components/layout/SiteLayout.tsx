import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { scrollToId } from '../../lib/scrollToId.ts'
import { SiteFooter } from './SiteFooter.tsx'
import { SiteHeader } from './SiteHeader.tsx'

export function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      scrollToId(decodeURIComponent(location.hash.slice(1)))
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.hash, location.pathname])

  return (
    <div className="flex min-h-svh flex-col bg-background text-body">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-heading"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
