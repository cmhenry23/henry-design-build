'use client';

import Image from 'next/image';
import { useCallback, useEffect } from 'react';

export interface LightboxPhoto {
  src: string;
  alt: string;
  caption: string;
  project?: string;
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, go]);

  if (index === null) return null;
  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || photo.alt}
      className="fixed inset-0 z-[80] flex flex-col bg-ink/97 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-bone/60 sm:px-8">
        <span className="font-display text-[0.7rem] uppercase tracking-[0.18em]">
          {index + 1} / {photos.length}
          {photo.project ? ` · ${photo.project}` : ''}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-bone/70 transition-colors hover:text-cedar"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-1 z-10 flex h-12 w-12 items-center justify-center text-3xl text-bone/50 transition-colors hover:text-cedar sm:left-4"
          aria-label="Previous photo"
        >
          &#8249;
        </button>

        <div className="relative h-full w-full">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-1 z-10 flex h-12 w-12 items-center justify-center text-3xl text-bone/50 transition-colors hover:text-cedar sm:right-4"
          aria-label="Next photo"
        >
          &#8250;
        </button>
      </div>

      <p className="mx-auto max-w-2xl px-6 pb-8 text-center text-sm leading-relaxed text-bone/65">
        {photo.caption}
      </p>
    </div>
  );
}
