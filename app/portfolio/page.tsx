import type { Metadata } from 'next';
import Link from 'next/link';
import PortfolioBrowser from '@/components/PortfolioBrowser';
import { projects } from '@/data/projects';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: `Cottages, saunas, kitchens, bathrooms and finish carpentry built by ${site.owner.name} across ${site.serviceArea}.`,
};

export default function PortfolioPage() {
  const photoCount = projects.reduce((n, p) => n + p.photos.length, 0);

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="shell pb-20 pt-24 sm:pb-24 sm:pt-32">
          <p className="eyebrow text-cedar">Portfolio</p>
          <h1 className="h-hero mt-7 max-w-4xl">
            Creativity.
            <br />
            <span className="text-cedar">Built.</span>
          </h1>
          <p className="lede mt-8 max-w-xl text-bone/65">
            With precision and skill. Every photo below is our own work — framed, clad, tiled and
            finished by the same hands that drew it up.
          </p>

          <dl className="mt-16 flex flex-wrap gap-x-16 gap-y-8 border-t border-bone/15 pt-8">
            {[
              { k: String(projects.length), v: 'Projects documented' },
              { k: String(photoCount), v: 'Photographs' },
              { k: '4', v: 'Categories of work' },
            ].map((stat) => (
              <div key={stat.v}>
                <dt className="font-display text-3xl font-extrabold tracking-[-0.02em] text-cedar">
                  {stat.k}
                </dt>
                <dd className="mt-2 text-xs text-bone/50">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <PortfolioBrowser />
      </section>

      <section className="border-t border-ink/10 bg-sand py-24 text-center">
        <div className="shell">
          <h2 className="h-section mx-auto max-w-2xl">Something like this, for you</h2>
          <p className="lede mx-auto mt-6 max-w-lg text-ink/70">
            Sketch your version in the Design Studio, or skip straight to a conversation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/visualizer" className="btn-primary">
              Design your build
            </Link>
            <Link href="/contact" className="btn-ghost-light">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
