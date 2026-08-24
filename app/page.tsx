import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Testimonials from '@/components/Testimonials';
import { projects } from '@/data/projects';
import { services, site } from '@/data/site';

export default function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 2);
  const rest = projects.filter((p) => !p.featured).slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative -mt-[4.5rem] flex min-h-[92svh] items-end overflow-hidden bg-ink pt-[4.5rem]">
        <Image
          src="/portfolio/cabin-exterior-dusk.jpg"
          alt="A charcoal-clad cabin with a steep gable roof standing in the trees at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35"
          aria-hidden="true"
        />

        <div className="shell relative w-full pb-20 pt-32 text-bone">
          <p className="eyebrow animate-rise text-cedar">{site.subTagline}</p>
          <h1 className="h-hero mt-7 max-w-4xl animate-rise" style={{ animationDelay: '90ms' }}>
            Where your
            <br />
            vision
            <br />
            <span className="text-cedar">becomes home</span>
          </h1>
          <p
            className="lede mt-9 max-w-xl animate-rise text-bone/70"
            style={{ animationDelay: '180ms' }}
          >
            Custom cottages, tiny homes, saunas and renovations across {site.serviceArea} — designed
            and built hands-on by our team, from the first cut to the final flourish.
          </p>
          <div
            className="mt-11 flex animate-rise flex-wrap gap-3"
            style={{ animationDelay: '260ms' }}
          >
            <Link href="/portfolio" className="btn-cedar">
              See the work
            </Link>
            <Link href="/visualizer" className="btn-ghost-dark">
              Design your build
            </Link>
          </div>

          <dl className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-bone/15 pt-8">
            {[
              { k: site.yearsExperience, v: 'Years building' },
              { k: String(projects.length), v: 'Projects completed' },
              { k: '100%', v: 'Hands-on oversight' },
            ].map((stat) => (
              <div key={stat.v}>
                <dt className="font-display text-3xl font-extrabold tracking-[-0.02em] text-cedar sm:text-4xl">
                  {stat.k}
                </dt>
                <dd className="mt-2 text-xs leading-snug text-bone/50">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-y border-ink/10 bg-sand py-4">
        <div className="flex w-max animate-marquee" aria-hidden="true">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {['Your style', 'Your vision', 'Your home', 'Hand built', 'Built to last'].map((w) => (
                <span
                  key={w}
                  className="flex items-center gap-8 px-8 font-display text-sm font-bold uppercase tracking-[0.2em] text-ink/45"
                >
                  {w}
                  <span className="h-1 w-1 bg-cedar" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <span className="sr-only">Your style, your vision, your home. Hand built, built to last.</span>
      </div>

      {/* ── Story ── */}
      <section className="shell py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-ink/40">Our story</p>
            <h2 className="h-section mt-5">
              Hands-on.
              <br />
              Every time.
            </h2>
          </Reveal>

          <Reveal delay={120} className="space-y-6 text-[1.05rem] leading-relaxed text-ink/75">
            <p>
              {site.name} is a design-build team built around direct, hands-on craftsmanship — no
              layers of management, no subcontracted decisions, no guesswork. {site.owner.name},
              founder and lead carpenter, leads every project personally, forging homes that
              capture your family&rsquo;s heritage.
            </p>
            <p>
              Every project gets hands-on oversight from the first cut to the final flourish,
              blending bold ideas with time-honoured skill to create a home that endures and evolves
              with you.
            </p>
            <p className="font-display text-xl font-bold uppercase leading-snug tracking-[-0.01em] text-ink">
              A home is more than a structure. It&rsquo;s where traditions root, families gather,
              and legacy grows.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 pt-2 font-display text-[0.72rem] font-bold uppercase tracking-[0.16em]"
            >
              Meet Ryan
              <span className="h-px w-8 bg-cedar" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="border-y border-ink/10 bg-sand py-24 sm:py-32">
        <div className="shell">
          <Reveal>
            <p className="eyebrow text-ink/40">What we build</p>
            <h2 className="h-section mt-5 max-w-2xl">From an accent wall to the whole cottage</h2>
          </Reveal>

          <div className="mt-16 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="bg-bone p-9 sm:p-11">
                <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-cedar">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="h-card mt-5">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ink/65">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured work ── */}
      <section className="shell py-24 sm:py-32">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-ink/40">Selected work</p>
            <h2 className="h-section mt-5">Recent builds</h2>
          </div>
          <Link href="/portfolio" className="btn-ghost-light self-start">
            View full portfolio
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 110}>
              <Link href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Image
                    src={p.cover.src}
                    alt={p.cover.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-5 top-5 bg-bone/92 px-3 py-1.5 font-display text-[0.62rem] font-bold uppercase tracking-[0.16em]">
                    {p.category}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-extrabold uppercase tracking-[-0.015em] sm:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/65">{p.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={p.cover.src}
                    alt={p.cover.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="mt-4 font-display text-base font-bold uppercase tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink/40">{p.category}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Visualizer teaser ── */}
      <section className="border-y border-ink/10 bg-sand py-24 sm:py-32">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow text-ink/40">Design Studio</p>
            <h2 className="h-section mt-5">
              Sketch it out
              <br />
              before you call
            </h2>
            <p className="lede mt-7 text-ink/70">
              Choose what you&rsquo;re building, how big, how far you want to take the finish, and
              what the outside looks like. Watch it draw itself as you go, get an honest planning
              range, and send the whole thing to our team in one click.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Live sketch that updates as you choose',
                'Cladding, roof, pitch and add-ons',
                'A budget range, clearly labelled as a range',
                'Send your concept straight to our team',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink/70">
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 bg-cedar" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/visualizer" className="btn-primary mt-10">
              Open the Design Studio
            </Link>
          </Reveal>

          <Reveal delay={140} className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/portfolio/cabin-timber-frame.jpg"
              alt="A timber frame cabin shell with roof sheathing standing among evergreens"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <Testimonials />

      {/* ── CTA ── */}
      <section className="shell py-24 text-center sm:py-32">
        <Reveal>
          <p className="eyebrow text-ink/40">Get in touch</p>
          <h2 className="h-section mx-auto mt-6 max-w-3xl">
            Make your dreams a reality
          </h2>
          <p className="lede mx-auto mt-7 max-w-xl text-ink/70">
            We want to hear your vision, build the unimaginable, and stand behind every detail.
            Together we will make your house a home.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="btn-primary">
              Start a project
            </Link>
            <Link href="/contact" className="btn-ghost-light">
              Send us a message
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
