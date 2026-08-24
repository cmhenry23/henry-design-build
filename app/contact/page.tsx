import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { processSteps, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name}. Tell us about your project and our team will get back to you.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="shell pb-20 pt-24 sm:pb-24 sm:pt-32">
          <p className="eyebrow text-cedar">Contact</p>
          <h1 className="h-hero mt-7 max-w-3xl">
            Make your
            <br />
            dreams a<br />
            <span className="text-cedar">reality</span>
          </h1>
          <p className="lede mt-8 max-w-xl text-bone/65">
            We want to hear your vision, build the unimaginable, and stand behind every detail.
            Together we will make your house a home.
          </p>
        </div>
      </section>

      <section className="shell py-20 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-24">
          <div>
            <h2 className="eyebrow text-ink/40">Tell us about your project</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-12">
            <div>
              <h2 className="eyebrow text-ink/40">Reach us directly</h2>
              <ul className="mt-6 space-y-4">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-display text-lg font-bold tracking-[-0.01em] underline decoration-cedar decoration-2 underline-offset-4"
                  >
                    {site.email}
                  </a>
                </li>
                {site.phone && (
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-display text-lg font-bold tracking-[-0.01em] underline decoration-cedar decoration-2 underline-offset-4"
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
                    className="text-ink/70 transition-colors hover:text-ink"
                  >
                    {site.instagramHandle} &mdash; see what&rsquo;s on the bench this week
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="eyebrow text-ink/40">Where we work</h2>
              <p className="mt-6 leading-relaxed text-ink/70">{site.serviceArea}.</p>
            </div>

            <div className="border border-ink/12 bg-white/55 p-7">
              <h2 className="eyebrow text-ink/40">What happens next</h2>
              <ol className="mt-6 space-y-5">
                {processSteps.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cedar">
                      {step.step}
                    </span>
                    <div>
                      <p className="font-display text-[0.8rem] font-bold uppercase tracking-[0.06em]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-ink/60">
                        {step.body.split('.')[0]}.
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
