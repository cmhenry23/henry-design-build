import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';
import { getProject, projectMeta, projects } from '@/data/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.cover.src }],
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[4.5rem] flex min-h-[80svh] items-end overflow-hidden bg-ink pt-[4.5rem]">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" aria-hidden="true" />

        <div className="shell relative w-full pb-16 pt-28 text-bone">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-bone/55 transition-colors hover:text-cedar"
          >
            <span aria-hidden="true">&larr;</span> All work
          </Link>
          <p className="eyebrow mt-8 text-cedar">
            {[project.category, projectMeta(project)].filter(Boolean).join(' · ')}
          </p>
          <h1 className="h-hero mt-5 max-w-4xl">{project.title}</h1>
          <p className="lede mt-8 max-w-xl text-bone/70">{project.summary}</p>
        </div>
      </section>

      {/* Story + specs */}
      <section className="shell py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <div>
            <h2 className="eyebrow text-ink/40">The build</h2>
            <div className="mt-7 space-y-6 text-[1.05rem] leading-relaxed text-ink/75">
              {project.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <h3 className="eyebrow mt-14 text-ink/40">Details that mattered</h3>
            <ul className="mt-6 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3.5 text-ink/75">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-cedar" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pt-1">
            <div className="border border-ink/12 bg-white/55">
              <h2 className="border-b border-ink/12 px-7 py-5 font-display text-[0.7rem] font-bold uppercase tracking-[0.18em]">
                Project file
              </h2>
              <dl className="divide-y divide-ink/8">
                {project.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 px-7 py-4">
                    <dt className="shrink-0 text-xs uppercase tracking-[0.1em] text-ink/45">
                      {spec.label}
                    </dt>
                    <dd className="text-right text-sm text-ink/80">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Link href="/contact" className="btn-primary mt-4 w-full">
              Build something like this
            </Link>
          </aside>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-t border-ink/10 bg-sand py-20 sm:py-24">
        <div className="shell">
          <h2 className="eyebrow text-ink/40">
            The gallery &mdash; {project.photos.length} photos
          </h2>
          <div className="mt-9">
            <ProjectGallery photos={project.photos} projectTitle={project.title} />
          </div>
        </div>
      </section>

      {/* Build video */}
      {project.video && (
        <section className="border-t border-ink/10 bg-ink py-20 sm:py-24">
          <div className="shell">
            <h2 className="eyebrow text-bone/40">Watch it come together</h2>
            <div className="mt-9 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
              <video
                controls
                playsInline
                preload="metadata"
                poster={project.video.poster}
                className="mx-auto aspect-[9/16] w-full max-w-xs bg-black object-cover lg:mx-0"
              >
                <source src={project.video.src} type="video/mp4" />
              </video>
              <p className="max-w-md text-[1.05rem] leading-relaxed text-bone/70">
                {project.video.caption}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Next project */}
      <section className="shell py-20 sm:py-24">
        <Link href={`/portfolio/${next.slug}`} className="group grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="eyebrow text-ink/40">Next project</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-5xl">
              {next.title}
            </h2>
            <p className="mt-4 max-w-lg text-ink/65">{next.summary}</p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand sm:w-64">
            <Image
              src={next.cover.src}
              alt={next.cover.alt}
              fill
              sizes="(max-width: 640px) 100vw, 16rem"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
          </div>
        </Link>
      </section>
    </>
  );
}
