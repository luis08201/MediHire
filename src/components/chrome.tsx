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
        <Link href="/" className="logo" aria-label={copy.brand}>
          <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#1D4ED8" />
            <path d="M8 21.5c2.4-6 4.4-8.5 8-8.5s5.6 2.5 8 8.5" stroke="#8ED4CF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="16" cy="11.2" r="2.1" fill="#F6F1E8" />
          </svg>
          {copy.brand}
        </Link>
        <nav className="primary-nav" aria-label={copy.nav.primary}>
          <Link href="/" aria-current={current(pathname, "/") ? "page" : undefined}>{copy.nav.home}</Link>
          <Link href="/about" aria-current={current(pathname, "/about") ? "page" : undefined}>{copy.nav.about}</Link>
          <PagesMenu pathname={pathname} />
          <Link href="/blog" aria-current={current(pathname, "/blog") ? "page" : undefined}>{copy.nav.blog}</Link>
        </nav>
        <div className="header-actions">
          <Link className="text-button" href="/careers">{copy.cta.browseJobs}</Link>
          <Link className="button primary" href="/contact">{copy.cta.requestStaff}</Link>
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
            <Link className="button ghost" href="/careers">{copy.cta.browseJobs}</Link>
            <Link className="button primary" href="/contact">{copy.cta.requestStaff}</Link>
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
      <div className="footer-inner footer-grid">
        <div>
          <h2>{copy.brand}</h2>
          <p>{copy.footer.summary}</p>
          <p className="legal">{copy.footer.rights}</p>
        </div>
        <div>
          <h2>{copy.footer.explore}</h2>
          <ul>
            <li><Link href="/services">{copy.nav.services}</Link></li>
            <li><Link href="/locations">{copy.nav.locations}</Link></li>
            <li><Link href="/careers">{copy.nav.careers}</Link></li>
            <li><Link href="/blog">{copy.nav.blog}</Link></li>
            <li><Link href="/team">{copy.nav.team}</Link></li>
            <li><Link href="/contact">{copy.nav.contact}</Link></li>
            <li><Link href="/search">{copy.nav.search}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{copy.footer.audiences}</h2>
          <ul>
            <li><Link href="/services">{copy.footer.forHospitals}</Link></li>
            <li><Link href="/careers">{copy.footer.forClinicians}</Link></li>
            <li><Link href="/about">{copy.nav.about}</Link></li>
          </ul>
          <h2 id="photo-credits">{copy.footer.photos}</h2>
          <ul>
            {credits.map((credit) => (
              <li key={credit.source}>
                <a href={credit.source}>{credit.title}</a>
                <span> · {credit.creator}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
