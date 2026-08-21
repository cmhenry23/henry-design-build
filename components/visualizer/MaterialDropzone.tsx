'use client';

import { useCallback, useRef, useState } from 'react';
import type { CustomMaterial } from '@/lib/brief';
import { resizeToDataUrl } from '@/lib/imageResize';

const MAX_MATERIALS = 3;
const MAX_FILE_BYTES = 15 * 1024 * 1024;

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Drop in photos of materials that aren't on the board — a tile sample, a
 * paint chip, a fabric swatch. These feed the AI renderings as reference
 * images (Gemini sees the actual photo, not just a text description of it),
 * capped at three since each one is an image sent to a paid model.
 */
export default function MaterialDropzone({
  materials,
  onAdd,
  onRemove,
  onRename,
}: {
  materials: CustomMaterial[];
  onAdd: (m: CustomMaterial) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const room = MAX_MATERIALS - materials.length;
      if (room <= 0) {
        setError(`You can drop in up to ${MAX_MATERIALS} materials.`);
        return;
      }
      const list = Array.from(files).slice(0, room);
      for (const file of list) {
        if (!file.type.startsWith('image/')) {
          setError('That file isn’t an image.');
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          setError('One of those photos is too large — try one under 15 MB.');
          continue;
        }
        try {
          const dataUrl = await resizeToDataUrl(file, { maxEdge: 900 });
          onAdd({ id: makeId(), name: '', dataUrl });
        } catch {
          setError('Couldn’t read one of those photos.');
        }
      }
    },
    [materials.length, onAdd]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`flex min-h-[6rem] flex-col items-center justify-center gap-1.5 border border-dashed p-4 text-center transition-colors ${
          dragOver ? 'border-cedar bg-cedar/10' : 'border-ink/25'
        } ${materials.length >= MAX_MATERIALS ? 'opacity-40' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          disabled={materials.length >= MAX_MATERIALS}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink/55">
          Drop material photos here
        </span>
        <span className="text-xs text-ink/40">
          or{' '}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={materials.length >= MAX_MATERIALS}
            className="underline underline-offset-2 hover:text-ink disabled:cursor-not-allowed"
          >
            browse
          </button>{' '}
          — up to {MAX_MATERIALS}
        </span>
      </div>

      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}

      {materials.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {materials.map((m) => (
            <li key={m.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- local data: URI */}
              <img src={m.dataUrl} alt={m.name || 'Custom material'} className="aspect-square w-full border border-ink/12 object-cover" />
              <button
                type="button"
                onClick={() => onRemove(m.id)}
                aria-label={`Remove ${m.name || 'this material'}`}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-ink/70 text-[0.6rem] text-bone opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
              <input
                type="text"
                value={m.name}
                onChange={(e) => onRename(m.id, e.target.value)}
                placeholder="Name it (optional)"
                className="mt-1 w-full border-0 border-b border-ink/15 bg-transparent px-0.5 py-1 text-[0.65rem] placeholder:text-ink/30 focus:border-ink focus:outline-none"
              />
            </li>
          ))}
        </ul>
      )}

      {materials.length > 0 && (
        <p className="mt-3 text-[0.7rem] leading-relaxed text-ink/45">
          These inform the AI rendering and photo customizer above, but aren&rsquo;t attached to
          the emailed summary — mailto links can&rsquo;t carry photos. Attach them yourself if you
          want Ryan to see the actual image.
        </p>
      )}
    </div>
  );
}
