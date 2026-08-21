'use client';

import { useId, useState } from 'react';
import PaletteBoard from '@/components/chat/PaletteBoard';
import type { CustomPaletteColors } from '@/lib/brief';

const DEFAULT_CUSTOM: CustomPaletteColors = {
  dominant: '#3B3A38',
  secondary: '#C08D57',
  accent: '#8EB6DC',
};

/**
 * Wraps the preset PaletteBoard with an option to mix three colours by hand
 * instead. The two are mutually exclusive — picking one clears the other,
 * same single-choice rule as every other board in the Studio.
 */
export default function ColorPaletteBuilder({
  buildType,
  preset,
  onSelectPreset,
  custom,
  onChangeCustom,
}: {
  buildType: string;
  preset: string;
  onSelectPreset: (id: string) => void;
  custom: CustomPaletteColors | null;
  onChangeCustom: (c: CustomPaletteColors | null) => void;
}) {
  const [showCustom, setShowCustom] = useState(!!custom);

  function useCustom() {
    setShowCustom(true);
    if (!custom) {
      onChangeCustom(DEFAULT_CUSTOM);
      onSelectPreset('');
    }
  }

  function updateColor(role: keyof CustomPaletteColors, hex: string) {
    onSelectPreset('');
    onChangeCustom({ ...(custom ?? DEFAULT_CUSTOM), [role]: hex });
  }

  return (
    <div className="space-y-4">
      <PaletteBoard
        buildType={buildType}
        selected={custom ? '' : preset}
        onSelect={(id) => {
          setShowCustom(false);
          onChangeCustom(null);
          onSelectPreset(id);
        }}
      />

      {!showCustom ? (
        <button
          type="button"
          onClick={useCustom}
          className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/50 underline underline-offset-4 hover:text-ink"
        >
          Or mix your own colours
        </button>
      ) : (
        <div className="border border-ink/12 bg-white/70 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="eyebrow text-ink/45">Mix your own</h4>
            <button
              type="button"
              onClick={() => {
                setShowCustom(false);
                onChangeCustom(null);
              }}
              className="text-[0.7rem] text-ink/40 underline underline-offset-4 hover:text-ink"
            >
              Use a preset instead
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <ColorField
              label="Dominant"
              value={custom?.dominant ?? DEFAULT_CUSTOM.dominant}
              onChange={(hex) => updateColor('dominant', hex)}
            />
            <ColorField
              label="Secondary"
              value={custom?.secondary ?? DEFAULT_CUSTOM.secondary}
              onChange={(hex) => updateColor('secondary', hex)}
            />
            <ColorField
              label="Accent"
              value={custom?.accent ?? DEFAULT_CUSTOM.accent}
              onChange={(hex) => updateColor('accent', hex)}
            />
          </div>
          <p className="mt-3 text-[0.7rem] leading-relaxed text-ink/45">
            Dominant is the wall or cladding colour — the most of it. Secondary is cabinetry or
            trim. Accent is the one deliberate note.
          </p>
        </div>
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-ink/50"
      >
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2 border border-ink/15 bg-white p-1.5">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 shrink-0 cursor-pointer border-0 bg-transparent p-0"
          aria-label={`${label} colour`}
        />
        <span className="truncate text-[0.68rem] uppercase text-ink/55">{value}</span>
      </div>
    </div>
  );
}
