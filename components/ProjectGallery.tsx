'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from '@/components/Lightbox';
import type { Photo } from '@/data/projects';

export default function ProjectGallery({
  photos,
  projectTitle,
}: {
  photos: Photo[];
  projectTitle: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {photos.map((photo, i) => (
          <figure key={photo.src + i} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden bg-white/50"
              aria-label={`Open photo: ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.portrait ? 800 : 1000}
                height={photo.portrait ? 1067 : 750}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <span
                className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10"
                aria-hidden="true"
              />
            </button>
            <figcaption className="mt-3 text-sm leading-snug text-ink/60">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <Lightbox
        photos={photos.map((p) => ({ ...p, project: projectTitle }))}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </>
  );
}
