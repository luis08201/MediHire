import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { scrollToId } from '../../lib/scrollToId.ts'
import { cn } from '../../lib/cn.ts'
import { BrandMark } from '../ui/Marks.tsx'

const links = [
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/#features', label: 'Features' },
  { to: '/#solutions', label: 'Solutions' },
  { to: '/#pricing', label: 'Pricing' },
] as const

export function SiteHeader() {
  const menuId = useId()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 64rem)')

    function onChange() {
      if (media.matches) setOpen(false)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function handleHashClick(to: string) {
    setOpen(false)
    const hashIndex = to.indexOf('#')
    if (hashIndex === -1 || location.pathname !== '/') return
    scrollToId(to.slice(hashIndex + 1))
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white">
      <div className="mx-auto flex h-16 w-[min(78rem,calc(100%-2.5rem))] items-center justify-between gap-4 md:w-[min(78rem,calc(100%-4rem))]">
        <BrandMark />
        <div className="hidden items-center gap-8 lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-6">
            {links.map((link) => (
              <PrimaryLink key={link.to} to={link.to} onNavigate={handleHashClick}>
                {link.label}
              </PrimaryLink>
            ))}
          </nav>
          <Link
            to="/#pricing"
            onClick={() => handleHashClick('/#pricing')}
            className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            About This Preview
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md text-heading lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav
        id={menuId}
        aria-label="Primary"
        className={open ? 'border-t border-border bg-white px-5 py-3 lg:hidden' : 'hidden'}
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.to}>
              <PrimaryLink to={link.to} block onNavigate={handleHashClick}>
                {link.label}
              </PrimaryLink>
            </li>
          ))}
        </ul>
        <Link
          to="/#pricing"
          onClick={() => handleHashClick('/#pricing')}
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
        >
          About This Preview
        </Link>
      </nav>
    </header>
  )
}

function PrimaryLink({
  to,
  block = false,
  onNavigate,
  children,
}: {
  to: string
  block?: boolean
  onNavigate: (to: string) => void
  children: string
}) {
  const className = (isActive: boolean) =>
    cn(
      'text-sm font-medium text-body hover:text-heading',
      isActive && 'text-heading',
      block && 'flex min-h-11 items-center',
    )

  if (to.includes('#')) {
    return (
      <Link to={to} className={className(false)} onClick={() => onNavigate(to)}>
        {children}
      </Link>
    )
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => className(isActive)}
      onClick={() => onNavigate(to)}
    >
      {children}
    </NavLink>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
