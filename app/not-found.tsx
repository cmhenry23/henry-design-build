import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-24">
      <p className="eyebrow text-cedar">404</p>
      <h1 className="h-hero mt-6 max-w-2xl">Nothing built here yet</h1>
      <p className="lede mt-7 max-w-md text-ink/65">
        That page doesn&rsquo;t exist. The work, though, does.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/portfolio" className="btn-primary">
          See the portfolio
        </Link>
        <Link href="/" className="btn-ghost-light">
          Back home
        </Link>
      </div>
    </section>
  );
}
