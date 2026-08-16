'use client';

import { palettesFor, type Palette } from '@/data/palettes';

/**
 * Colour palettes, drawn as CSS rather than generated images.
 *
 * A palette is a set of exact hex values. Rendering one through an image model
 * would give an approximation that drifts every regeneration — and the colour
 * on screen would no longer be the colour named. So these are real swatches:
 * exact, free, instant, and they never need regenerating.
 *
 * Each palette is anchored on one of Ryan's real projects and completed with
 * harmonious partners, so the accent reads as a decision rather than a clash.
 */
export default function PaletteBoard({
  buildType,
  selected,
  onSelect,
}: {
  buildType: string;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const palettes = palettesFor(buildType);
  if (!palettes.length) return null;

  return (
    <section className="border border-ink/12 bg-white/70 p-4" aria-labelledby="palettes-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h4 id="palettes-heading" className="eyebrow text-ink/45">
          And the colours?
        </h4>
        <span className="text-[0.7rem] text-ink/40">
          {selected ? palettes.find((p) => p.id === selected)?.name : 'Pick one'}
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {palettes.map((p) => (
          <PaletteRow
            key={p.id}
            palette={p}
            selected={selected === p.id}
            onSelect={() => onSelect(p.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function PaletteRow({
  palette,
  selected,
  onSelect,
}: {
  palette: Palette;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`flex w-full items-center gap-3 border p-2 text-left transition-colors ${
          selected ? 'border-cedar bg-cedar/10' : 'border-ink/12 hover:border-ink/40'
        }`}
      >
        {/* The swatch strip. Widths are weighted so the dominant colour reads
            as dominant — a palette is proportions, not four equal squares. */}
        <span className="flex h-11 w-24 shrink-0 overflow-hidden" aria-hidden="true">
          {palette.colours.map((c, i) => (
            <span
              key={c.hex}
              className="block h-full"
              style={{
                backgroundColor: c.hex,
                width: i === 0 ? '44%' : i === 1 ? '28%' : '14%',
              }}
            />
          ))}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[0.72rem] font-semibold leading-tight text-ink/85">
            {palette.name}
          </span>
          <span className="mt-0.5 block text-[0.65rem] leading-snug text-ink/50">
            {palette.blurb}
          </span>
        </span>

        {selected && (
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center bg-cedar text-[0.65rem] text-ink"
            aria-hidden="true"
          >
            ✓
          </span>
        )}
      </button>

      {/* Named colours, so a choice can be repeated to a painter. */}
      {selected && (
        <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 px-2 pb-1">
          {palette.colours.map((c) => (
            <li key={c.hex} className="flex items-center gap-1.5 text-[0.65rem] text-ink/50">
              <span
                className="h-2.5 w-2.5 border border-ink/15"
                style={{ backgroundColor: c.hex }}
                aria-hidden="true"
              />
              {c.name} <span className="text-ink/30">{c.hex}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
