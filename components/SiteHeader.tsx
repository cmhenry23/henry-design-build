'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, site } from '@/data/site';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
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
          className="flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="relative block h-4 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 block h-[2px] w-6 bg-ink transition-all duration-300 ${
                open ? 'top-[7px] rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-[2px] w-6 bg-ink transition-all duration-200 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-6 bg-ink transition-all duration-300 ${
                open ? 'top-[7px] -rotate-45' : 'top-[14px]'
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 border-t border-ink/10 bg-bone lg:hidden"
        >
          <nav className="shell flex flex-col gap-1 py-8" aria-label="Mobile">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="animate-rise border-b border-ink/8 py-4 font-display text-2xl font-extrabold uppercase tracking-[-0.01em] text-ink transition-colors hover:text-brass"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/start" className="btn-cedar mt-6 w-full">
              Start a project
            </Link>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-center font-display text-[0.72rem] uppercase tracking-[0.18em] text-ink/55"
            >
              {site.instagramHandle}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
