import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJournalPost, journalPosts, parsePostDate } from '@/data/journal';

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getJournalPost(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover.src }],
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function JournalPostPage({ params }: { params: { slug: string } }) {
  const post = getJournalPost(params.slug);
  if (!post) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[4.5rem] flex min-h-[70svh] items-end overflow-hidden bg-ink pt-[4.5rem]">
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30"
          aria-hidden="true"
        />

        <div className="shell relative w-full pb-16 pt-28 text-bone">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-bone/55 transition-colors hover:text-cedar"
          >
            ← Journal
          </Link>
          <p className="eyebrow mt-6 text-cedar">
            {post.category} · {dateFormatter.format(parsePostDate(post.date))}
          </p>
          <h1 className="h-hero mt-5 max-w-4xl">{post.title}</h1>
        </div>
      </section>

      <article className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-[1.05rem] leading-relaxed text-ink/80">
          {post.body.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2
                  key={i}
                  className="mt-12 font-display text-2xl font-extrabold uppercase leading-snug tracking-[-0.01em] text-ink first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'ul') {
              return (
                <ul key={i} className="mt-6 space-y-3">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span
                        className="mt-[0.6rem] h-1 w-1 shrink-0 bg-cedar"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="mt-6 first:mt-0">
                {block.text}
              </p>
            );
          })}

          <p className="mt-10 border-l-2 border-cedar pl-6 font-display text-lg font-bold italic leading-snug text-ink">
            {post.closing}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl border-t border-ink/10 pt-8">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 font-display text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink/60 transition-colors hover:text-brass"
          >
            ← Back to the journal
          </Link>
        </div>
      </article>
    </>
  );
}
