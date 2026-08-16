'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import CabinPreview from '@/components/visualizer/CabinPreview';
import { sceneFor } from '@/lib/briefSummary';
import { site } from '@/data/site';
import {
  ADD_ONS,
  BUILD_TYPES,
  CLADDINGS,
  FINISH_LEVELS,
  PITCHES,
  PLACEHOLDER_PRICING,
  ROOFS,
  SEASONS,
  SITE_ACCESS,
  calculateEstimate,
  formatCAD,
  type BuildTypeId,
  type FinishLevelId,
  type SeasonId,
  type SiteAccessId,
} from '@/lib/estimate';

const INTERIOR_TYPES: BuildTypeId[] = ['kitchen', 'bath', 'reno'];

export default function Configurator() {
  const [buildType, setBuildType] = useState<BuildTypeId>('cottage');
  const [sqft, setSqft] = useState(1400);
  const [finish, setFinish] = useState<FinishLevelId>('crafted');
  const [access, setAccess] = useState<SiteAccessId>('easy');
  const [season, setSeason] = useState<SeasonId>('four');
  const [addOns, setAddOns] = useState<string[]>(['sauna']);
  const [cladding, setCladding] = useState(CLADDINGS[0].id);
  const [roof, setRoof] = useState(ROOFS[0].id);
  const [pitch, setPitch] = useState(PITCHES[1].id);
  const [copied, setCopied] = useState(false);

  const type = BUILD_TYPES.find((t) => t.id === buildType)!;
  const claddingOpt = CLADDINGS.find((c) => c.id === cladding)!;
  const roofOpt = ROOFS.find((r) => r.id === roof)!;
  const pitchOpt = PITCHES.find((p) => p.id === pitch)!;
  const isInterior = INTERIOR_TYPES.includes(buildType);

  const availableAddOns = ADD_ONS.filter((a) => a.appliesTo.includes(buildType));
  const activeAddOns = addOns.filter((id) => availableAddOns.some((a) => a.id === id));

  const estimate = useMemo(
    () => calculateEstimate({ buildType, sqft, finish, access, season, addOns: activeAddOns }),
    [buildType, sqft, finish, access, season, activeAddOns]
  );

  const sizeRatio = Math.min(1, Math.max(0, (sqft - type.min) / (type.max - type.min)));
  const windows = Math.max(2, Math.min(8, Math.round(2 + sizeRatio * 5)));

  function changeBuildType(id: BuildTypeId) {
    const next = BUILD_TYPES.find((t) => t.id === id)!;
    setBuildType(id);
    setSqft(next.defaultSize);
    setAddOns((prev) =>
      prev.filter((a) => ADD_ONS.find((x) => x.id === a)?.appliesTo.includes(id))
    );
  }

  function toggleAddOn(id: string) {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  /** Human-readable summary the visitor can copy into an email to Ryan. */
  const summary = useMemo(() => {
    const lines = [
      `Design Studio concept — ${site.name}`,
      '',
      `Project type: ${type.label}`,
      `Approximate size: ${sqft.toLocaleString()} sq ft`,
      `Finish level: ${FINISH_LEVELS.find((f) => f.id === finish)!.label}`,
    ];
    if (type.showsSeason) lines.push(`Use: ${SEASONS.find((s) => s.id === season)!.label}`);
    if (type.showsAccess) lines.push(`Site access: ${SITE_ACCESS.find((a) => a.id === access)!.label}`);
    if (!isInterior) {
      lines.push(`Cladding: ${claddingOpt.label}`);
      lines.push(`Roof: ${roofOpt.label} (${pitchOpt.label.toLowerCase()} pitch)`);
    }
    if (activeAddOns.length) {
      lines.push(
        `Add-ons: ${activeAddOns
          .map((id) => availableAddOns.find((a) => a.id === id)!.label)
          .join(', ')}`
      );
    }
    lines.push('');
    lines.push(
      `Planning range shown by the tool: ${formatCAD(estimate.low)} – ${formatCAD(estimate.high)}`
    );
    lines.push('(Planning range only — not a quote.)');
    return lines.join('\n');
  }, [
    type,
    sqft,
    finish,
    season,
    access,
    isInterior,
    claddingOpt,
    roofOpt,
    pitchOpt,
    activeAddOns,
    availableAddOns,
    estimate,
  ]);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Design Studio concept — ${type.label}`
  )}&body=${encodeURIComponent(summary)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
      {/* ── Left column: preview + controls ── */}
      <div className="min-w-0">
        <div className="overflow-hidden border border-ink/12 bg-ink">
          <CabinPreview
            cladding={claddingOpt}
            roof={roofOpt}
            pitch={pitchOpt.value}
            sqft={sqft}
            sizeRatio={sizeRatio}
            windows={windows}
            hasDeck={activeAddOns.includes('deck')}
            hasLoft={activeAddOns.includes('loft')}
            hasFireplace={activeAddOns.includes('fireplace')}
            scene={sceneFor(buildType)}
          />
          <p className="border-t border-bone/10 px-5 py-3 text-center text-xs text-bone/45">
            A stylised sketch to make choices feel real — not an architectural drawing.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {/* Build type */}
          <Field label="What are you building?" step="01">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {BUILD_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => changeBuildType(t.id)}
                  aria-pressed={buildType === t.id}
                  className={`border p-4 text-left transition-colors ${
                    buildType === t.id
                      ? 'border-ink bg-ink text-bone'
                      : 'border-ink/15 bg-white/50 hover:border-ink/45'
                  }`}
                >
                  <span className="block font-display text-[0.78rem] font-bold uppercase tracking-[0.08em]">
                    {t.label}
                  </span>
                  <span
                    className={`mt-1.5 block text-xs leading-snug ${
                      buildType === t.id ? 'text-bone/60' : 'text-ink/55'
                    }`}
                  >
                    {t.blurb}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          {/* Size */}
          <Field label="How big, roughly?" step="02">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-4xl font-extrabold tracking-[-0.02em]">
                {sqft.toLocaleString()}
                <span className="ml-2 font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink/45">
                  sq ft
                </span>
              </span>
              <span className="text-xs text-ink/45">
                {type.min.toLocaleString()} – {type.max.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={type.min}
              max={type.max}
              step={type.step}
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="mt-4 w-full accent-cedar"
              aria-label="Approximate size in square feet"
            />
            <p className="mt-2 text-xs text-ink/50">
              Not sure? Pick the closest room or building you already know the size of. We refine
              this at the first meeting.
            </p>
          </Field>

          {/* Finish */}
          <Field label="How far do you want to take the finish?" step="03">
            <div className="grid gap-2 sm:grid-cols-3">
              {FINISH_LEVELS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinish(f.id)}
                  aria-pressed={finish === f.id}
                  className={`border p-4 text-left transition-colors ${
                    finish === f.id
                      ? 'border-cedar bg-cedar/15'
                      : 'border-ink/15 bg-white/50 hover:border-ink/45'
                  }`}
                >
                  <span className="block font-display text-[0.78rem] font-bold uppercase tracking-[0.08em]">
                    {f.label}
                  </span>
                  <span className="mt-1.5 block text-xs leading-snug text-ink/60">{f.blurb}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Season + access */}
          {(type.showsSeason || type.showsAccess) && (
            <Field label="Tell us about the site" step="04">
              <div className="grid gap-6 sm:grid-cols-2">
                {type.showsSeason && (
                  <div>
                    <p className="eyebrow mb-3 text-ink/45">Season of use</p>
                    <div className="space-y-2">
                      {SEASONS.map((s) => (
                        <Choice
                          key={s.id}
                          selected={season === s.id}
                          onClick={() => setSeason(s.id)}
                          label={s.label}
                          blurb={s.blurb}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {type.showsAccess && (
                  <div>
                    <p className="eyebrow mb-3 text-ink/45">Site access</p>
                    <div className="space-y-2">
                      {SITE_ACCESS.map((a) => (
                        <Choice
                          key={a.id}
                          selected={access === a.id}
                          onClick={() => setAccess(a.id)}
                          label={a.label}
                          blurb={a.blurb}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Field>
          )}

          {/* Exterior look */}
          {!isInterior && (
            <Field label="Pick the look" step={type.showsSeason || type.showsAccess ? '05' : '04'}>
              <div className="space-y-7">
                <div>
                  <p className="eyebrow mb-3 text-ink/45">Cladding</p>
                  <div className="flex flex-wrap gap-2">
                    {CLADDINGS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCladding(c.id)}
                        aria-pressed={cladding === c.id}
                        aria-label={c.label}
                        title={c.label}
                        className={`flex items-center gap-2.5 border py-2 pl-2 pr-4 transition-colors ${
                          cladding === c.id ? 'border-ink' : 'border-ink/15 hover:border-ink/45'
                        }`}
                      >
                        <span
                          className="h-7 w-7 border border-black/15"
                          style={{ backgroundColor: c.hex }}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-medium">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow mb-3 text-ink/45">Roof</p>
                  <div className="flex flex-wrap gap-2">
                    {ROOFS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRoof(r.id)}
                        aria-pressed={roof === r.id}
                        title={r.label}
                        className={`flex items-center gap-2.5 border py-2 pl-2 pr-4 transition-colors ${
                          roof === r.id ? 'border-ink' : 'border-ink/15 hover:border-ink/45'
                        }`}
                      >
                        <span
                          className="h-7 w-7 border border-black/15"
                          style={{ backgroundColor: r.hex }}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-medium">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow mb-3 text-ink/45">Roof pitch</p>
                  <div className="flex flex-wrap gap-2">
                    {PITCHES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPitch(p.id)}
                        aria-pressed={pitch === p.id}
                        className={`border px-5 py-2.5 text-xs font-medium transition-colors ${
                          pitch === p.id
                            ? 'border-ink bg-ink text-bone'
                            : 'border-ink/15 hover:border-ink/45'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Field>
          )}

          {/* Add-ons */}
          {availableAddOns.length > 0 && (
            <Field label="Anything else?" step={isInterior ? '04' : '06'}>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableAddOns.map((a) => {
                  const on = activeAddOns.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAddOn(a.id)}
                      aria-pressed={on}
                      className={`flex gap-3 border p-4 text-left transition-colors ${
                        on ? 'border-cedar bg-cedar/15' : 'border-ink/15 bg-white/50 hover:border-ink/45'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[0.6rem] ${
                          on ? 'border-ink bg-ink text-bone' : 'border-ink/35'
                        }`}
                        aria-hidden="true"
                      >
                        {on ? '✓' : ''}
                      </span>
                      <span>
                        <span className="block font-display text-[0.75rem] font-bold uppercase tracking-[0.08em]">
                          {a.label}
                        </span>
                        <span className="mt-1 block text-xs leading-snug text-ink/60">{a.blurb}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        </div>
      </div>

      {/* ── Right column: sticky estimate panel ── */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-ink/15 bg-ink text-bone">
          <div className="border-b border-bone/12 p-7">
            <p className="eyebrow text-cedar">Planning range</p>
            <p className="mt-4 font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.02em] sm:text-[2.5rem]">
              {formatCAD(estimate.low)}
            </p>
            <p className="mt-1 font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.02em] text-bone/45 sm:text-[2.5rem]">
              {formatCAD(estimate.high)}
            </p>
            <p className="mt-5 text-xs leading-relaxed text-bone/50">
              Roughly {formatCAD(estimate.perSqFtLow)} – {formatCAD(estimate.perSqFtHigh)} per sq ft
              at this spec.
            </p>
          </div>

          <div className="border-b border-bone/12 p-7">
            <p className="eyebrow mb-4 text-bone/40">What&rsquo;s in it</p>
            <ul className="space-y-3 text-sm">
              {estimate.lines.map((line) => (
                <li key={line.label} className="flex justify-between gap-4">
                  <span className="text-bone/70">{line.label}</span>
                  <span className="shrink-0 tabular-nums text-bone/45">
                    {formatCAD(line.low)}–{formatCAD(line.high)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 p-7">
            <a href={mailto} className="btn-cedar w-full">
              Send this to Ryan
            </a>
            <button type="button" onClick={copySummary} className="btn-ghost-dark w-full">
              {copied ? 'Copied to clipboard' : 'Copy the summary'}
            </button>
            <Link href="/contact" className="btn-ghost-dark w-full">
              Book a first meeting
            </Link>
          </div>
        </div>

        {/* Honesty notices — deliberately hard to miss. */}
        <div className="mt-4 border border-ink/15 bg-white/60 p-6 text-xs leading-relaxed text-ink/65">
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink">
            This is a planning range, not a quote
          </p>
          <p className="mt-3">
            It exists so you can find out whether an idea is anywhere near your budget before anyone
            spends time on drawings. Real numbers come after we walk the site. Foundations,
            servicing, permits, rock, and the finishes you actually fall in love with move a total
            more than square footage ever will.
          </p>
        </div>

        {PLACEHOLDER_PRICING && (
          <div className="mt-4 border border-cedar bg-cedar/15 p-6 text-xs leading-relaxed" role="note">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em]">
              Ryan — replace these rates before launch
            </p>
            <p className="mt-3 text-ink/75">
              The dollar figures above are placeholders seeded from published 2026 Ontario
              cost-per-square-foot guides, not from your jobs. Open{' '}
              <code className="bg-ink/10 px-1.5 py-0.5">lib/estimate.ts</code>, put your own numbers
              into the <code className="bg-ink/10 px-1.5 py-0.5">rate</code> field of each entry in{' '}
              <code className="bg-ink/10 px-1.5 py-0.5">BUILD_TYPES</code>, check the tool
              against a project you have already completed, then set{' '}
              <code className="bg-ink/10 px-1.5 py-0.5">PLACEHOLDER_PRICING = false</code> to hide
              this notice.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ── Small presentational helpers ── */

function Field({
  label,
  step,
  children,
}: {
  label: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cedar">
          {step}
        </span>
        <h2 className="font-display text-lg font-bold uppercase tracking-[-0.01em]">{label}</h2>
      </div>
      {children}
    </section>
  );
}

function Choice({
  selected,
  onClick,
  label,
  blurb,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  blurb: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`block w-full border p-3.5 text-left transition-colors ${
        selected ? 'border-cedar bg-cedar/15' : 'border-ink/15 bg-white/50 hover:border-ink/45'
      }`}
    >
      <span className="block text-[0.8rem] font-semibold">{label}</span>
      <span className="mt-1 block text-xs leading-snug text-ink/55">{blurb}</span>
    </button>
  );
}
