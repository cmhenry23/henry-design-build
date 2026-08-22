import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatCAD } from '@/lib/estimate';
import { furniture, getFurnitureItem, PLACEHOLDER } from '@/data/furniture';
import { site } from '@/data/site';

export function generateStaticParams() {
  return furniture.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getFurnitureItem(params.slug);
  if (!item) return { title: 'Item not found' };
  return {
    title: `${item.name} — Papa's Shop`,
    description: item.description,
  };
}

export default function FurnitureItemPage({ params }: { params: { slug: string } }) {
  const item = getFurnitureItem(params.slug);
  if (!item) notFound();

  const subject = encodeURIComponent(`${item.name} — Papa's Shop`);
  const body = encodeURIComponent(
    `Hi, I'm interested in "${item.name}" (${formatCAD(item.price)}) listed on Papa's Shop.\n\n`
  );
  const mailto = `mailto:${site.email}?subject=${subject}&body=${body}`;

  return (
    <>
      {PLACEHOLDER && (
        <div className="shell mt-6">
          <div className="border border-cedar/40 bg-cedar/10 p-4 text-xs leading-relaxed text-ink/75" role="note">
            <strong className="font-display uppercase tracking-wider">Placeholder listing —</strong>{' '}
            an example, not a real item for sale.
          </div>
        </div>
      )}

      <section className="shell py-12 sm:py-16">
        <Link
          href="/papas-shop"
          className="inline-flex items-center gap-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink/50 transition-colors hover:text-cedar"
        >
          ← Back to Papa&rsquo;s Shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden bg-sand">
              {item.photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element -- static listing photo
                <img src={item.photos[0].src} alt={item.photos[0].alt} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-[0.7rem] uppercase tracking-[0.14em] text-ink/30">
                    Photo coming soon
                  </span>
                </div>
              )}
              {item.status === 'sold' && (
                <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 font-display text-[0.68rem] font-bold uppercase tracking-[0.14em] text-bone">
                  Sold
                </span>
              )}
            </div>
            {item.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.photos.slice(1).map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- static listing photo
                  <img
                    key={i}
                    src={p.src}
                    alt={p.alt}
                    className="aspect-square w-full border border-ink/12 object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow text-ink/40">{item.category}</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.015em] sm:text-4xl">
              {item.name}
            </h1>
            <p className="mt-4 font-display text-3xl font-extrabold text-cedar">
              {formatCAD(item.price)}
            </p>

            <dl className="mt-8 space-y-3 border-y border-ink/10 py-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/45">Condition</dt>
                <dd className="text-right text-ink/80">{item.condition}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/45">Dimensions</dt>
                <dd className="text-right text-ink/80">{item.dimensions}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/45">Status</dt>
                <dd className="text-right capitalize text-ink/80">{item.status}</dd>
              </div>
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-ink/70">{item.description}</p>

            <div className="mt-8">
              {item.status === 'available' ? (
                <a href={mailto} className="btn-primary">
                  Ask about this piece
                </a>
              ) : (
                <span className="inline-block border border-ink/15 px-7 py-3.5 font-display text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink/40">
                  Already sold
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
