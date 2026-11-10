"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { copy } from "@/i18n/en";

const pageLinks = [
  { href: "/services", label: copy.nav.services },
  { href: "/team", label: copy.nav.team },
  { href: "/careers", label: copy.nav.careers },
  { href: "/locations", label: copy.nav.locations },
  { href: "/contact", label: copy.nav.contact },
];

function current(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PagesMenu({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionCurrent = pageLinks.some((link) => current(pathname, link.href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!rootRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div className={sectionCurrent ? "nav-menu is-current" : "nav-menu"} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        {copy.nav.pages}
        <span className="chevron" aria-hidden="true" />
      </button>
      <div id={menuId} className="nav-menu-panel" hidden={!open}>
        {pageLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current(pathname, link.href) ? "page" : undefined}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="logo" aria-label={copy.brand}>
      <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#7EE0C4" />
        <path d="M8 21.5c2.4-6 4.4-8.5 8-8.5s5.6 2.5 8 8.5" stroke="#123F48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="11.2" r="2.1" fill="#CBBAFC" />
      </svg>
      {copy.brand}
    </Link>
  );
}

function SocialMarks() {
  return (
    <div className="footer-social" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4 4 20" /></svg>
      <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" /></svg>
      <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10.5V17M8 7.5v.2M12 17v-6.5a2 2 0 0 1 4 0V17" /></svg>
      <svg className="fill" viewBox="0 0 24 24"><path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.2l.8-3H13V9c0-.6.4-1 1-1Z" /></svg>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="primary-nav" aria-label={copy.nav.primary}>
          <Link href="/" aria-current={current(pathname, "/") ? "page" : undefined}>{copy.nav.home}</Link>
          <Link href="/about" aria-current={current(pathname, "/about") ? "page" : undefined}>{copy.nav.about}</Link>
          <PagesMenu pathname={pathname} />
          <Link href="/blog" aria-current={current(pathname, "/blog") ? "page" : undefined}>{copy.nav.blog}</Link>
        </nav>
        <div className="header-actions">
          <Link className="button gradient" href="/contact">{copy.cta.requestStaff}</Link>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? copy.nav.close : copy.nav.menu}
        </button>
      </div>
      <div className="wrap">
        <div id={panelId} className={open ? "mobile-panel open" : "mobile-panel"} hidden={!open}>
          <nav aria-label={copy.nav.primary}>
            <Link href="/" aria-current={current(pathname, "/") ? "page" : undefined}>{copy.nav.home}</Link>
            <Link href="/about" aria-current={current(pathname, "/about") ? "page" : undefined}>{copy.nav.about}</Link>
            <PagesMenu pathname={pathname} onNavigate={() => setOpen(false)} />
            <Link href="/blog" aria-current={current(pathname, "/blog") ? "page" : undefined}>{copy.nav.blog}</Link>
          </nav>
          <div className="cta-row">
            <Link className="button mint" href="/contact">{copy.cta.requestStaff}</Link>
            <Link className="button lilac" href="/careers">{copy.cta.browseJobs}</Link>
          </div>
          <form className="header-search" action="/search" method="get" role="search">
            <label className="visually-hidden" htmlFor="mobile-search">{copy.search.label}</label>
            <input id="mobile-search" name="q" type="search" placeholder={copy.search.placeholder} />
            <button className="button secondary" type="submit">{copy.search.submit}</button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ credits }: { credits: { title: string; source: string; creator: string }[] }) {
  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>{copy.footer.summary}</p>
            <SocialMarks />
          </div>
          <div className="footer-columns">
            <nav aria-label={copy.footer.services}>
              <h2>{copy.footer.services}</h2>
              <ul>
                <li><Link href="/services">{copy.nav.services}</Link></li>
                <li><Link href="/locations">{copy.nav.locations}</Link></li>
                <li><Link href="/careers">{copy.nav.careers}</Link></li>
              </ul>
            </nav>
            <nav aria-label={copy.footer.resources}>
              <h2>{copy.footer.resources}</h2>
              <ul>
                <li><Link href="/blog">{copy.nav.blog}</Link></li>
                <li><Link href="/team">{copy.nav.team}</Link></li>
                <li><Link href="/search">{copy.nav.search}</Link></li>
              </ul>
            </nav>
            <nav aria-label={copy.footer.company}>
              <h2>{copy.footer.company}</h2>
              <ul>
                <li><Link href="/about">{copy.nav.about}</Link></li>
                <li><Link href="/contact">{copy.nav.contact}</Link></li>
                <li><Link href="/careers">{copy.footer.forClinicians}</Link></li>
              </ul>
            </nav>
          </div>
        </div>
        <hr className="footer-rule" />
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {copy.brand}. {copy.footer.rights}</p>
          <details className="footer-credits" id="photo-credits">
            <summary>{copy.footer.photos}</summary>
            <ul>
              {credits.map((credit) => (
                <li key={credit.source}>
                  <a href={credit.source}>{credit.title}</a>
                  <span> · {credit.creator}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
