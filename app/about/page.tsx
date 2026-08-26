import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Testimonials from '@/components/Testimonials';
import { processSteps, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description: `${site.owner.name} and ${site.partner.name} of ${site.name}. How we work, and what our four-stage process looks like.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="shell pb-20 pt-24 sm:pb-24 sm:pt-32">
          <p className="eyebrow text-cedar">About</p>
          <h1 className="h-hero mt-7 max-w-4xl">
            Real craftsmanship.
            <br />
            <span className="text-cedar">Real care.</span>
          </h1>
        </div>
      </section>

      {/* Ryan + Cam */}
      <section className="shell py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-sand">
            {/* TODO: replace with a portrait of Ryan and Cam on site. A photo of
                the people is the single highest-converting image on this page. */}
            <Image
              src="/portfolio/real-log-stair.jpg"
              alt="A hand-peeled log stair with treads cantilevered off a single scribed post"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow text-ink/40">Our team</p>
            <h2 className="h-section mt-5">Two brothers, one standard</h2>

            <div className="mt-8 space-y-5 leading-relaxed text-ink/75">
              <p>
                {site.name} was started by two brothers who grew up with sawdust in our shoes and
                a job site as our second home. Our dad renovated every house we lived in — not
                because it was easy, but because he believed a home should be shaped by the hands
                of the people who love it. Long before we could legally work, we were right there
                beside him on weekends and summers, sweeping up scraps, holding boards steady, and
                slowly learning what it really takes to build something that lasts.
              </p>
              <p>
                I&rsquo;m {site.owner.name}, founder of {site.name} and a Red Seal certified
                carpenter. My brother {site.partner.name} is our head of sales and a carpenter in
                his own right. Together, we bring that same family spirit to every project — from
                the first cup of coffee where we talk through your vision, to the final walkthrough
                when we hand you the keys.
              </p>
              <p>
                We know inviting someone into your home to build or renovate is a big deal. Too
                many contractors leave families guessing — about timelines, about budgets, about
                what&rsquo;s actually happening behind those plastic sheets. That&rsquo;s not how
                we were raised, and it&rsquo;s not how we work. Growing up, our father made every
                renovation feel less like a construction project and more like part of the family
                story. We&rsquo;ve built our business the same way: honest conversations, fair
                pricing, and craftsmanship you can trust — so the process feels as comfortable as
                the home we&rsquo;re building for you.
              </p>
              <p className="font-display text-xl font-bold uppercase leading-snug tracking-[-0.01em] text-ink">
                Because at the end of the day, we&rsquo;re not just building houses. We&rsquo;re
                building the place where your family&rsquo;s next chapter happens.
              </p>
            </div>

            <ul className="mt-10 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
              {[
                { name: site.owner.name, role: site.owner.role },
                { name: site.partner.name, role: site.partner.role },
              ].map((person) => (
                <li key={person.name} className="bg-bone p-6">
                  <p className="font-display text-[0.8rem] font-bold uppercase leading-snug tracking-[0.05em]">
                    {person.name}
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-[0.1em] text-ink/50">
                    {person.role}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-ink/10 bg-sand py-24 sm:py-32">
        <div className="shell">
          <Reveal>
            <p className="eyebrow text-ink/40">The process</p>
            <h2 className="h-section mt-5 max-w-2xl">Four stages, no surprises</h2>
          </Reveal>

          <ol className="mt-16 space-y-px border border-ink/12 bg-ink/12">
            {processSteps.map((step, i) => (
              <Reveal
                key={step.step}
                as="li"
                delay={i * 80}
                className="grid gap-6 bg-bone p-8 sm:grid-cols-[auto_14rem_1fr] sm:items-start sm:gap-10 sm:p-11"
              >
                <span className="font-display text-2xl font-extrabold tracking-[-0.02em] text-cedar">
                  {step.step}
                </span>
                <h3 className="h-card">{step.title}</h3>
                <p className="leading-relaxed text-ink/70">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Testimonials />

      <section className="shell py-24 text-center">
        <h2 className="h-section mx-auto max-w-2xl">Let&rsquo;s hear your vision</h2>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-primary">
            Start a project
          </Link>
          <Link href="/portfolio" className="btn-ghost-light">
            See the work
          </Link>
        </div>
      </section>
    </>
  );
}
