import Link from 'next/link';
import { nav, site } from '@/data/site';

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-bone">
      <div className="shell py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] sm:text-4xl">
              Legacy is not
              <br />
              mass produced.
              <br />
              <span className="text-cedar">It&rsquo;s hand built.</span>
            </p>
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-bone/60">
              {site.name} — custom cottages, tiny homes, saunas and renovations across{' '}
              {site.serviceArea}.
            </p>
          </div>

          <div>
            <h2 className="eyebrow text-bone/40">Explore</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bone/70 transition-colors hover:text-cedar"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-bone/40">Get in touch</h2>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-bone/70 transition-colors hover:text-cedar"
                >
                  {site.email}
                </a>
              </li>
              {site.phone && (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-bone/70 transition-colors hover:text-cedar"
                  >
                    {site.phone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone/70 transition-colors hover:text-cedar"
                >
                  {site.instagramHandle}
                </a>
              </li>
              <li className="pt-3 text-bone/45">{site.serviceArea}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/12 pt-8 text-xs text-bone/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            {site.owner.name} &amp; {site.partner.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
