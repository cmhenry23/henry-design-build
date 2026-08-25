import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { formatCAD } from '@/lib/estimate';
import { categories, furniture, PLACEHOLDER } from '@/data/furniture';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: "Papa's Shop",
  description: `Handmade and vintage furniture for sale from ${site.name}.`,
};

export default function PapasShopPage() {
  return (
    <>
      <section className="relative -mt-[4.5rem] flex min-h-[70svh] items-end overflow-hidden bg-ink pt-[4.5rem]">
        <Image
          src="/shop/papas-shop-hero.jpg"
          alt="Papa in his workshop, surrounded by hand tools, lumber and a drill press"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30"
          aria-hidden="true"
        />

        <div className="shell relative w-full pb-20 pt-24 text-bone">
          <p className="eyebrow text-cedar">Papa&rsquo;s Shop</p>
          <h1 className="h-hero mt-7 max-w-4xl">
            Furniture,
            <br />
            <span className="text-cedar">built and found</span>
          </h1>
          <p className="lede mt-8 max-w-xl text-bone/65">
            One-off pieces made or restored by hand, sold as they come available. What&rsquo;s
            here is what&rsquo;s here — no reprints, no restocks.
          </p>
        </div>
      </section>

      {PLACEHOLDER && (
        <div className="shell mt-10">
          <div
            className="flex items-start gap-4 border border-cedar/40 bg-cedar/10 p-5 text-sm leading-relaxed text-ink"
            role="note"
          >
            <span className="mt-0.5 font-display text-base font-bold text-brass" aria-hidden="true">
              !
            </span>
            <p>
              <strong className="font-display uppercase tracking-wider">
                Placeholder listings —
              </strong>{' '}
              the pieces below are examples showing the page&rsquo;s layout, not real items for
              sale. Replace them in{' '}
              <code className="bg-ink/10 px-1.5 py-0.5 text-xs">data/furniture.ts</code> with real
              listings and photos before launch, then set{' '}
              <code className="bg-ink/10 px-1.5 py-0.5 text-xs">PLACEHOLDER = false</code> to
              remove this notice.
            </p>
          </div>
        </div>
      )}

      <section className="shell py-16 sm:py-20">
        {furniture.length === 0 ? (
          <p className="text-ink/60">Nothing listed right now — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {furniture.map((item) => (
              <Link
                key={item.slug}
                href={`/papas-shop/${item.slug}`}
                className="group block border border-ink/12 bg-white/50 transition-colors hover:border-ink/35"
              >
                <div className="relative aspect-square overflow-hidden bg-sand">
                  {item.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static listing photo
                    <img
                      src={item.photos[0].src}
                      alt={item.photos[0].alt}
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-[0.68rem] uppercase tracking-[0.14em] text-ink/30">
                        Photo coming soon
                      </span>
                    </div>
                  )}
                  {item.status === 'sold' && (
                    <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 font-display text-[0.62rem] font-bold uppercase tracking-[0.14em] text-bone">
                      Sold
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-ink/40">
                    {item.category}
                  </p>
                  <h2 className="mt-1.5 font-display text-base font-bold uppercase tracking-[-0.01em]">
                    {item.name}
                  </h2>
                  <p className="mt-2 font-display text-lg font-extrabold text-cedar">
                    {formatCAD(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="border border-ink/12 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.1em] text-ink/45"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-sand py-16 text-center sm:py-20">
        <h2 className="h-section mx-auto max-w-xl">See something you like?</h2>
        <p className="mx-auto mt-4 max-w-md text-ink/65">
          Everything sells first-come, first-served. Message us to ask a question or arrange
          pickup.
        </p>
        <div className="mt-8">
          <Link href="/contact" className="btn-primary">
            Ask about a piece
          </Link>
        </div>
      </section>
    </>
  );
}
