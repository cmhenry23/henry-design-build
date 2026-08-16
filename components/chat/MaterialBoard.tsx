'use client';

import { useState } from 'react';
import { materialsFor, type Material } from '@/data/materials';

/**
 * Inline material board shown in the conversation once we know what's being
 * built. Tapping a material tells us the visitor likes it — that feeds the
 * brief, the email to Ryan, and the final render prompt.
 *
 * Images are static files generated once by tools/materials/generate.mjs. If
 * one hasn't been generated yet the tile falls back to the material's colour
 * swatch, so this is useful before the generator has ever been run.
 */
export default function MaterialBoard({
  buildType,
  selected,
  onToggle,
}: {
  buildType: string;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const materials = materialsFor(buildType);
  if (!materials.length) return null;

  return (
    <section className="border border-ink/12 bg-white/70 p-4" aria-labelledby="materials-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h4 id="materials-heading" className="eyebrow text-ink/45">
          Materials we build with
        </h4>
        <span className="text-[0.7rem] text-ink/40">
          {selected.length ? `${selected.length} picked` : 'Tap what you like'}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2">
        {materials.map((m) => (
          <MaterialTile
            key={m.id}
            material={m}
            selected={selected.includes(m.id)}
            onToggle={() => onToggle(m.id)}
          />
        ))}
      </ul>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-ink/45">
        These are real materials from Ryan&rsquo;s finished projects — not a catalogue. Picking a
        few sharpens what we send him.
      </p>
    </section>
  );
}

function MaterialTile({
  material,
  selected,
  onToggle,
}: {
  material: Material;
  selected: boolean;
  onToggle: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        title={material.blurb}
        className={`group block w-full overflow-hidden border text-left transition-colors ${
          selected ? 'border-cedar' : 'border-ink/12 hover:border-ink/40'
        }`}
      >
        <span
          className="relative block aspect-square w-full"
          style={{ backgroundColor: material.hex }}
        >
          {!failed && (
            // eslint-disable-next-line @next/next/no-img-element -- static asset, may legitimately be absent
            <img
              src={`/materials/${material.id}.jpg`}
              alt={material.name}
              loading="lazy"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
          {selected && (
            <span
              className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center bg-cedar text-[0.65rem] text-ink"
              aria-hidden="true"
            >
              ✓
            </span>
          )}
        </span>
        <span className="block px-2 py-1.5">
          <span className="block text-[0.68rem] font-semibold leading-tight text-ink/85">
            {material.name}
          </span>
        </span>
      </button>
    </li>
  );
}
