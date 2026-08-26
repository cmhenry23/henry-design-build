import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { journalPosts, parsePostDate, PLACEHOLDER } from '@/data/journal';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Journal',
  description: `Notes on materials, sites and process from ${site.name}.`,
};

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function JournalPage() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="shell pb-20 pt-24 sm:pb-24 sm:pt-32">
          <p className="eyebrow text-cedar">Journal</p>
          <h1 className="h-hero mt-7 max-w-4xl">
            Notes from
            <br />
            <span className="text-cedar">the build</span>
          </h1>
          <p className="lede mt-8 max-w-xl text-bone/65">
            Materials, sites and the decisions that shape a project — written by the people
            actually building it.
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
                Placeholder posts —
              </strong>{' '}
              examples showing the page&rsquo;s layout, not real articles. Replace them in{' '}
              <code className="bg-ink/10 px-1.5 py-0.5 text-xs">data/journal.ts</code> with real
              writing, then set{' '}
              <code className="bg-ink/10 px-1.5 py-0.5 text-xs">PLACEHOLDER = false</code> to
              remove this notice.
            </p>
          </div>
        </div>
      )}

      <section className="shell py-16 sm:py-20">
        {journalPosts.length === 0 ? (
          <p className="text-ink/60">Nothing published yet — check back soon.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {journalPosts.map((post) => (
              <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={post.cover.src}
                    alt={post.cover.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-5 text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">
                  {post.category} · {dateFormatter.format(parsePostDate(post.date))}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold uppercase leading-snug tracking-[-0.01em] transition-colors group-hover:text-brass">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
