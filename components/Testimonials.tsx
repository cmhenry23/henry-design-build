'use client';

import { useEffect, useState } from 'react';
import { PLACEHOLDER, testimonials } from '@/data/testimonials';

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-1" aria-label={`${count} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i < count ? 'fill-cedar' : 'fill-current opacity-20'}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.47 5.4 5.9.63-4.4 4 1.23 5.82L10 14.42 4.8 17.35 6.03 11.53l-4.4-4 5.9-.63z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const id = setInterval(() => setActive((v) => (v + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  // Section removes itself entirely when there are no testimonials to show.
  if (testimonials.length === 0) return null;

  const current = testimonials[active];

  return (
    <section
      className="bg-ink text-bone"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shell py-24 sm:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-cedar">In their words</p>
            <h2 id="testimonials-heading" className="h-section mt-5 max-w-xl">
              What it&rsquo;s like
              <br />
              to build with us
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-bone/50">
            Every project ends with a walkthrough, and every client gets Ryan&rsquo;s number
            afterwards. These are the people who used it.
          </p>
        </div>

        {PLACEHOLDER && (
          <div
            className="mt-10 flex items-start gap-4 border border-cedar/40 bg-cedar/10 p-5 text-sm leading-relaxed text-cedar"
            role="note"
          >
            <span className="mt-0.5 font-display text-base font-bold" aria-hidden="true">
              !
            </span>
            <p>
              <strong className="font-display uppercase tracking-wider">
                Placeholder content —
              </strong>{' '}
              these quotes are examples showing the layout, not real client reviews. Replace them in{' '}
              <code className="bg-ink/40 px-1.5 py-0.5 text-xs">data/testimonials.ts</code> with
              real, permissioned quotes before launch, then set{' '}
              <code className="bg-ink/40 px-1.5 py-0.5 text-xs">PLACEHOLDER = false</code> to remove
              this notice.
            </p>
          </div>
        )}

        <figure className="mt-14 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            <Stars count={current.rating} />
            <blockquote className="mt-7">
              <p
                key={active}
                className="animate-rise font-display text-2xl font-semibold leading-[1.28] tracking-[-0.01em] sm:text-[2rem]"
              >
                &ldquo;{current.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-8 text-sm">
              <span className="font-display font-bold uppercase tracking-[0.1em]">
                {current.name}
              </span>
              <span className="mt-1 block text-bone/45">{current.detail}</span>
            </figcaption>
          </div>

          <div className="flex flex-col justify-end gap-1">
            {testimonials.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Show testimonial ${i + 1}`}
                className={`group flex items-center gap-4 border-l-2 py-3 pl-5 text-left transition-colors ${
                  i === active
                    ? 'border-cedar text-bone'
                    : 'border-bone/12 text-bone/40 hover:border-bone/40 hover:text-bone/70'
                }`}
              >
                <span className="font-display text-[0.68rem] uppercase tracking-[0.16em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="line-clamp-1 text-sm">{t.quote.slice(0, 46)}&hellip;</span>
              </button>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}
