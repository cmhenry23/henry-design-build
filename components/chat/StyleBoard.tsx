'use client';

import Image from 'next/image';
import { useState } from 'react';
import { stylesFor, type DesignStyle } from '@/data/styles';

/**
 * First board in the chat. Pointing at a picture is far easier than describing
 * a look, so this comes before palette and materials — broadest choice first.
 * Single-select: a project has one style.
 */
export default function StyleBoard({
  buildType,
  selected,
  onSelect,
}: {
  buildType: string;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const styles = stylesFor(buildType);
  if (!styles.length) return null;

  return (
    <section className="border border-ink/12 bg-white/70 p-4" aria-labelledby="styles-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h4 id="styles-heading" className="eyebrow text-ink/45">
          What look are you after?
        </h4>
        <span className="text-[0.7rem] text-ink/40">
          {selected ? styles.find((s) => s.id === selected)?.name : 'Pick one'}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {styles.map((s) => (
          <StyleTile
            key={s.id}
            style={s}
            selected={selected === s.id}
            onSelect={() => onSelect(s.id)}
          />
        ))}
      </ul>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-ink/45">
        Not a menu to order from — just the quickest way to tell us what you&rsquo;re picturing.
      </p>
    </section>
  );
}

function StyleTile({
  style,
  selected,
  onSelect,
}: {
  style: DesignStyle;
  selected: boolean;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        title={style.blurb}
        className={`group block w-full overflow-hidden border text-left transition-colors ${
          selected ? 'border-cedar' : 'border-ink/12 hover:border-ink/40'
        }`}
      >
        <span className="relative block aspect-[4/3] w-full" style={{ backgroundColor: style.hex }}>
          {!failed && (
            <Image
              src={`/styles/${style.id}.jpg`}
              alt={style.name}
              fill
              sizes="(max-width: 640px) 45vw, 180px"
              onError={() => setFailed(true)}
              className="object-cover"
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
          <span className="block text-[0.7rem] font-semibold leading-tight text-ink/85">
            {style.name}
          </span>
          <span className="mt-0.5 block text-[0.65rem] leading-snug text-ink/45">{style.blurb}</span>
        </span>
      </button>
    </li>
  );
}
