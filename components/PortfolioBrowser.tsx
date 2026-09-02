'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { categories, projectMeta, projects, type ProjectCategory } from '@/data/projects';

type Filter = 'All work' | ProjectCategory;
type View = 'projects' | 'photos';

const filters: Filter[] = ['All work', ...categories];

export default function PortfolioBrowser() {
  const [filter, setFilter] = useState<Filter>('All work');
  const [view, setView] = useState<View>('projects');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visibleProjects = useMemo(
    () => (filter === 'All work' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  const visiblePhotos = useMemo(
    () =>
      visibleProjects.flatMap((p) =>
        p.photos.map((photo) => ({ ...photo, project: p.title, slug: p.slug }))
      ),
    [visibleProjects]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { 'All work': projects.length };
    for (const c of categories) map[c] = projects.filter((p) => p.category === c).length;
    return map;
  }, []);

  return (
    <>
      {/* Controls */}
      <div className="sticky top-[4.5rem] z-30 -mx-6 mb-12 border-y border-ink/10 bg-bone/92 px-6 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`shrink-0 px-4 py-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  filter === f
                    ? 'bg-ink text-bone'
                    : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
                }`}
              >
                {f}
                <span className="ml-2 text-[0.65rem] opacity-50">{counts[f]}</span>
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 self-start border border-ink/15 lg:self-auto">
            {(['projects', 'photos'] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-4 py-2 font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  view === v ? 'bg-ink text-bone' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {v === 'projects' ? 'Case studies' : 'All photos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case-study view */}
      {view === 'projects' && (
        <div className="space-y-6">
          {visibleProjects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group grid gap-0 overflow-hidden border border-ink/12 bg-white/50 transition-colors hover:border-ink/35 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-sand md:aspect-auto md:min-h-[26rem] ${
                  i % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 bg-bone/92 px-3 py-1.5 font-display text-[0.62rem] font-bold uppercase tracking-[0.16em]">
                  {project.category}
                </span>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-12">
                {projectMeta(project) && (
                  <p className="eyebrow text-ink/40">{projectMeta(project)}</p>
                )}
                <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.98] tracking-[-0.015em] sm:text-[2.6rem]">
                  {project.title}
                </h2>
                <p className="mt-5 leading-relaxed text-ink/70">{project.summary}</p>

                <ul className="mt-7 space-y-2">
                  {project.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-ink/60">
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 bg-cedar" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>

                <span className="mt-9 inline-flex items-center gap-3 font-display text-[0.72rem] font-bold uppercase tracking-[0.16em]">
                  See the build
                  <span className="h-px w-8 bg-cedar transition-all duration-300 group-hover:w-14" aria-hidden="true" />
                </span>

                <span className="mt-6 font-display text-[0.65rem] uppercase tracking-[0.16em] text-ink/35">
                  {project.photos.length} photos
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Photo-wall view */}
      {view === 'photos' && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {visiblePhotos.map((photo, i) => (
            <button
              key={`${photo.src}-${i}`}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block w-full overflow-hidden break-inside-avoid bg-sand text-left"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.portrait ? 800 : 1000}
                height={photo.portrait ? 1067 : 750}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-sm leading-snug text-bone">
                  <span className="block font-display text-[0.62rem] uppercase tracking-[0.16em] text-cedar">
                    {photo.project}
                  </span>
                  {photo.caption}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {visibleProjects.length === 0 && (
        <p className="py-24 text-center text-ink/50">No projects in this category yet.</p>
      )}

      <Lightbox
        photos={visiblePhotos}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />
    </>
  );
}
