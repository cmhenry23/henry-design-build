import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Testimonials from '@/components/Testimonials';
import { processSteps, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description: `${site.owner.name} — ${site.owner.role} at ${site.name}. How we work, and what our four-stage process looks like.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="shell pb-20 pt-24 sm:pb-24 sm:pt-32">
          <p className="eyebrow text-cedar">About</p>
          <h1 className="h-hero mt-7 max-w-4xl">
            Small team.
            <br />
            <span className="text-cedar">Big heart.</span>
          </h1>
        </div>
      </section>

      {/* Ryan */}
      <section className="shell py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-sand">
            {/* TODO: replace with a portrait of Ryan on site. A photo of the
                person is the single highest-converting image on this page. */}
            <Image
              src="/portfolio/cabin-window-trim.jpg"
              alt="Cedar window with a deep site-built jamb and hand tools resting on the sill"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow text-ink/40">Our team</p>
            <h2 className="h-section mt-5">{site.owner.name}</h2>
            <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.14em] text-cedar">
              {site.owner.role}
            </p>

            <div className="mt-8 space-y-5 leading-relaxed text-ink/75">
              <p>
                As the owner and founder of {site.name}, I bring a lifelong obsession with building
                — and a passion for crafting exceptional homes that truly reflect each
                client&rsquo;s vision and lifestyle.
              </p>
              <p>
                With deep expertise in design-build processes, I lead every project from concept to
                completion, blending innovative design with meticulous craftsmanship to build homes
                that last.
              </p>
              <p>
                My drive comes from the belief that no two homes should ever feel ordinary. Every
                build is an opportunity to transform ideas into an extraordinary, one-of-a-kind
                reality.
              </p>
            </div>

            <ul className="mt-10 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-3">
              {[
                `${site.yearsExperience} years professional experience`,
                'A lifelong obsession',
                'Learning from the best',
              ].map((item) => (
                <li
                  key={item}
                  className="bg-bone p-6 font-display text-[0.72rem] font-bold uppercase leading-snug tracking-[0.1em]"
                >
                  {item}
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
            <h2 className="h-section mt-5 max-w-2xl">Four stages, one carpenter</h2>
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
