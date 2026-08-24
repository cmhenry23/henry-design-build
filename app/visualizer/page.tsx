import type { Metadata } from 'next';
import Link from 'next/link';
import Configurator from '@/components/visualizer/Configurator';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Design Studio',
  description:
    'Sketch your cottage, tiny home, sauna or renovation, choose the finishes, and get an honest planning range before you pick up the phone.',
};

export default function VisualizerPage() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="shell pb-16 pt-24 sm:pb-20 sm:pt-32">
          <p className="eyebrow text-cedar">Design Studio</p>
          <h1 className="h-hero mt-7 max-w-4xl">
            Draw it
            <br />
            <span className="text-cedar">before you</span>
            <br />
            build it
          </h1>
          <p className="lede mt-8 max-w-xl text-bone/65">
            Pick what you&rsquo;re building and watch it take shape. Change the cladding, the roof,
            the pitch, the size. When it looks right, send the whole concept to {site.owner.name} in
            one click — with a planning range attached, so nobody wastes anybody&rsquo;s time.
          </p>
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        <Configurator />
      </section>

      <section className="border-t border-ink/10 bg-sand py-20">
        <div className="shell grid gap-12 lg:grid-cols-3">
          {[
            {
              t: 'Why a range and not a price',
              b: 'Anyone who gives you a firm number before walking your site is guessing, and the guess will be wrong in the direction that suits them. A range tells you whether to keep going. That is all it is for.',
            },
            {
              t: 'What moves the number most',
              b: 'Site access, foundations, servicing, and how far you take the finish. Square footage matters less than people expect. A small cottage on rock with no road can cost more than a big one on a level lot.',
            },
            {
              t: 'What happens next',
              b: 'Send your concept over and we will come out, walk the site, and go through the scope with you. The estimate that comes out of that meeting is a real one.',
            },
          ].map((item) => (
            <div key={item.t}>
              <h2 className="h-card">{item.t}</h2>
              <p className="mt-4 leading-relaxed text-ink/65">{item.b}</p>
            </div>
          ))}
        </div>

        <div className="shell mt-14">
          <Link href="/contact" className="btn-primary">
            Book a first meeting
          </Link>
        </div>
      </section>
    </>
  );
}
