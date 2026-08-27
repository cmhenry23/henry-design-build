'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/data/site';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Close on a click outside the dropdown, or on Escape — standard dropdown
  // behaviour now that this no longer takes over the whole screen.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-[80] transition-all duration-300 ${
        scrolled ? 'border-b border-ink/10 bg-cedar/25 backdrop-blur-md' : 'bg-cedar/10'
      }`}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="flex items-center" aria-label={`${site.name} home`}>
          <Image
            src="/brand/logo.png"
            alt={site.name}
            width={900}
            height={391}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {nav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  scrolled
                    ? 'text-ink/70 hover:text-ink'
                    : 'text-bone/85 hover:text-bone'
                } ${active ? (scrolled ? 'text-ink' : 'text-bone') : ''}`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-cedar" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/start" className="btn-primary !px-6 !py-3">
            Start a project
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex h-11 w-11 items-center justify-center rounded-sm border transition-colors lg:hidden ${
            scrolled
              ? 'border-ink/15 bg-ink/5 hover:bg-ink/10'
              : 'border-bone/25 bg-bone/10 hover:bg-bone/20'
          }`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="relative block h-4 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 block h-[2px] w-6 transition-all duration-300 ${
                scrolled ? 'bg-ink' : 'bg-bone'
              } ${open ? 'top-[7px] rotate-45' : 'top-0'}`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-[2px] w-6 transition-all duration-200 ${
                scrolled ? 'bg-ink' : 'bg-bone'
              } ${open ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-6 transition-all duration-300 ${
                scrolled ? 'bg-ink' : 'bg-bone'
              } ${open ? 'top-[7px] -rotate-45' : 'top-[14px]'}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-[70] max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-bone shadow-[0_20px_40px_rgba(20,17,15,0.18)] lg:hidden"
        >
          <nav className="shell flex flex-col py-3" aria-label="Mobile">
            {nav.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`border-b border-ink/8 py-3.5 font-display text-base font-bold uppercase tracking-[0.02em] transition-colors hover:text-brass ${
                    active ? 'text-brass' : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/start" className="btn-cedar mt-5 w-full text-center">
              Start a project
            </Link>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 mt-4 text-center font-display text-[0.7rem] uppercase tracking-[0.18em] text-ink/55"
            >
              {site.instagramHandle}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
