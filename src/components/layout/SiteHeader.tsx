import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { scrollToId } from '../../lib/scrollToId.ts'
import { cn } from '../../lib/cn.ts'
import { BrandMark } from '../ui/Marks.tsx'

const links = [
  { to: '/jobs', label: 'Find Jobs', quiet: false },
  { to: '/hospitals', label: 'Hospitals', quiet: false },
  { to: '/#features', label: 'Features', quiet: true },
  { to: '/#solutions', label: 'Solutions', quiet: true },
  { to: '/#pricing', label: 'Pricing', quiet: true },
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
    <header className="sticky top-4 z-40 mx-auto w-[min(72rem,calc(100%-2.5rem))]">
      <div className="flex items-center justify-between gap-3 rounded-full border border-border bg-surface/95 px-3 py-2 shadow-[0_10px_40px_-24px_rgba(53,104,255,0.85)] backdrop-blur">
        <BrandMark />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <PrimaryLink key={link.to} to={link.to} quiet={link.quiet} onNavigate={handleHashClick}>
              {link.label}
            </PrimaryLink>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-heading lg:hidden"
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
        className={
          open
            ? 'mt-2 rounded-3xl border border-border bg-surface px-4 py-3 shadow-[0_16px_40px_-16px_rgba(7,11,32,0.85)] lg:hidden'
            : 'hidden'
        }
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.to}>
              <PrimaryLink to={link.to} quiet={link.quiet} block onNavigate={handleHashClick}>
                {link.label}
              </PrimaryLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function PrimaryLink({
  to,
  quiet = false,
  block = false,
  onNavigate,
  children,
}: {
  to: string
  quiet?: boolean
  block?: boolean
  onNavigate: (to: string) => void
  children: string
}) {
  const className = (isActive: boolean) =>
    cn(
      'rounded-full px-3 text-sm',
      block && 'flex min-h-11 items-center',
      !block && 'inline-flex min-h-11 items-center',
      isActive ? 'bg-signal/15 font-semibold text-heading' : quiet ? 'text-muted' : 'text-heading',
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
