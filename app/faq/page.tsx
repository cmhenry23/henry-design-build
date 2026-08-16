import type { Metadata } from 'next';
import Link from 'next/link';
import { faqs, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Common questions about working with ${site.name} — services, getting started, and what the process looks like.`,
};

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-ink text-bone">
        <div className="shell pb-20 pt-24 sm:pb-24 sm:pt-32">
          <p className="eyebrow text-cedar">FAQ</p>
          <h1 className="h-hero mt-7">Questions</h1>
          <p className="lede mt-8 max-w-xl text-bone/65">
            If yours isn&rsquo;t here, just ask. Ryan answers his own email.
          </p>
        </div>
      </section>

      <section className="shell py-20 sm:py-24">
        <div className="mx-auto max-w-3xl divide-y divide-ink/12 border-y border-ink/12">
          {faqs.map((faq, i) => (
            <details key={faq.q} className="group py-7" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-6">
                <span className="mt-1 font-display text-[0.72rem] font-bold uppercase tracking-[0.18em] text-cedar">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display text-lg font-bold uppercase leading-snug tracking-[-0.01em] sm:text-xl">
                  {faq.q}
                </span>
                <span
                  className="mt-1 shrink-0 font-display text-xl leading-none text-ink/40 transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-5 pl-0 leading-relaxed text-ink/70 sm:pl-[3.6rem]">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-ink/60">Still wondering about something?</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Ask Ryan directly
            </Link>
            <Link href="/visualizer" className="btn-ghost-light">
              Try the Design Studio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
