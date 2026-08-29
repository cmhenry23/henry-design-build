'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import MaterialBoard from '@/components/chat/MaterialBoard';
import StyleBoard from '@/components/chat/StyleBoard';
import StyleImage from '@/components/chat/StyleImage';
import ColorPaletteBuilder from '@/components/visualizer/ColorPaletteBuilder';
import FloorPlan from '@/components/visualizer/FloorPlan';
import MaterialDropzone from '@/components/visualizer/MaterialDropzone';
import PhotoCustomizer from '@/components/visualizer/PhotoCustomizer';
import { EMPTY_BRIEF, resolveBrief, type Brief, type CustomMaterial, type CustomPaletteColors } from '@/lib/brief';
import { buildSummary } from '@/lib/briefSummary';
import { makeProjectId } from '@/lib/projectId';
import { buildSketchUpScript, sketchupFilename } from '@/lib/sketchup';
import {
  ADD_ONS,
  BUILD_TYPES,
  CLADDINGS,
  DOOR_COLORS,
  FINISH_LEVELS,
  PITCHES,
  PLACEHOLDER_PRICING,
  ROOFS,
  SEASONS,
  SITE_ACCESS,
  WINDOW_STYLES,
  calculateEstimate,
  formatCAD,
  type BuildTypeId,
  type FinishLevelId,
  type SeasonId,
  type SiteAccessId,
} from '@/lib/estimate';

const INTERIOR_TYPES: BuildTypeId[] = ['kitchen', 'bath', 'reno'];
type PreviewMode = 'render' | 'plan';

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
  const [windowStyle, setWindowStyle] = useState(WINDOW_STYLES[0].id);
  const [doorColor, setDoorColor] = useState(DOOR_COLORS[0].id);
  const [notes, setNotes] = useState('');
  const [style, setStyle] = useState('');
  const [palette, setPalette] = useState('');
  const [customPalette, setCustomPalette] = useState<CustomPaletteColors | null>(null);
  const [materials, setMaterials] = useState<string[]>([]);
  const [customMaterials, setCustomMaterials] = useState<CustomMaterial[]>([]);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<PreviewMode>('render');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [skDownloaded, setSkDownloaded] = useState(false);

  const type = BUILD_TYPES.find((t) => t.id === buildType)!;
  const isInterior = INTERIOR_TYPES.includes(buildType);

  const availableAddOns = ADD_ONS.filter((a) => a.appliesTo.includes(buildType));
  const activeAddOns = addOns.filter((id) => availableAddOns.some((a) => a.id === id));

  const brief: Brief = useMemo(
    () => ({
      ...EMPTY_BRIEF,
      buildType,
      sqft,
      finish,
      access,
      season,
      addOns: activeAddOns,
      style,
      palette,
      customPalette,
      materials,
      customMaterials,
      cladding,
      roof,
      pitch,
      windowStyle,
      doorColor,
      notes,
    }),
    [
      buildType,
      sqft,
      finish,
      access,
      season,
      activeAddOns,
      style,
      palette,
      customPalette,
      materials,
      customMaterials,
      cladding,
      roof,
      pitch,
      windowStyle,
      doorColor,
      notes,
    ]
  );

  const resolved = useMemo(() => resolveBrief(brief), [brief]);

  // Mint a project reference once, the same way the chat does — a stable
  // code to quote back if the visitor emails or calls about this concept.
  useEffect(() => {
    if (!projectId) setProjectId(makeProjectId(JSON.stringify({ buildType, sqft })));
  }, [projectId, buildType, sqft]);

  const estimate = useMemo(
    () => calculateEstimate({ buildType, sqft, finish, access, season, addOns: activeAddOns }),
    [buildType, sqft, finish, access, season, activeAddOns]
  );

  const summary = useMemo(
    () => buildSummary(brief, projectId ?? 'HDB-DRAFT'),
    [brief, projectId]
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

  function toggleMaterial(id: string) {
    setMaterials((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function addCustomMaterial(m: CustomMaterial) {
    setCustomMaterials((prev) => [...prev, m]);
  }

  function removeCustomMaterial(id: string) {
    setCustomMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  function renameCustomMaterial(id: string, name: string) {
    setCustomMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, name } : m)));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary.overview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function downloadSketchUp() {
    const script = buildSketchUpScript(resolved, projectId ?? 'HDB-DRAFT');
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sketchupFilename(projectId ?? 'HDB-DRAFT');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setSkDownloaded(true);
  }

  let stepN = 0;
  const nextStep = () => String(++stepN).padStart(2, '0');

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
      {/* ── Left column: preview + controls ── */}
      <div className="min-w-0">
        <div className="overflow-hidden border border-ink/12 bg-ink">
          <div className="flex border-b border-bone/10">
            {(
              [
                ['render', 'AI rendering'],
                ['plan', 'Floor plan'],
              ] as [PreviewMode, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                aria-pressed={mode === id}
                className={`flex-1 px-4 py-3 font-display text-[0.68rem] font-bold uppercase tracking-[0.12em] transition-colors ${
                  mode === id ? 'bg-bone text-ink' : 'text-bone/50 hover:text-bone'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Both stay mounted so switching tabs never loses a generated
              rendering or resets its loading state — only visibility
              toggles. */}
          <div className={mode === 'render' ? '' : 'hidden'}>
            <StyleImage brief={brief} auto={false} />
          </div>
          <div className={mode === 'plan' ? '' : 'hidden'}>
            <FloorPlan
              buildType={buildType}
              sqft={sqft}
              scene={summary.scene}
              windows={windows}
              hasDeck={activeAddOns.includes('deck')}
              hasLoft={activeAddOns.includes('loft')}
            />
          </div>

          <p className="border-t border-bone/10 px-5 py-3 text-center text-xs text-bone/45">
            {mode === 'render' && 'An AI image generated from your exact choices — a style reference, not a design.'}
            {mode === 'plan' && !isInterior && 'Drag a wall to resize a room, tap one to remove it, or use the toolbar below to drop in and drag around a room, window, cabinets or a fireplace — scaled to your numbers, not a real floor plan.'}
            {mode === 'plan' && isInterior && 'Use the toolbar below to drop in and drag around a room, window, cabinets or a fireplace — scaled to your numbers, not a real floor plan.'}
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {/* Build type */}
          <Field label="What are you building?" step={nextStep()}>
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
          <Field label="How big, roughly?" step={nextStep()}>
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

          {/* Free-text description — supplements the swatches below rather
              than replacing them. Reused as-is by lib/briefSummary.ts (the
              emailed overview) and lib/imagePrompt.ts (the AI rendering),
              so typing something here actually changes the outcome, not
              just a comment box nobody reads. */}
          <Field label="Anything specific in mind?" step={nextStep()}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={600}
              placeholder="A wraparound deck facing the lake, a mudroom by the side door, big windows over the sink — anything at all, in your own words."
              className="w-full border border-ink/20 bg-white/60 px-4 py-3 text-sm leading-relaxed placeholder:text-ink/35 focus:border-ink focus:outline-none"
            />
            <p className="mt-2 text-xs text-ink/50">
              Optional. Goes straight into the AI rendering and the project summary you can send
              us — word for word.
            </p>
          </Field>

          {/* Style */}
          <Field label="Style" step={nextStep()}>
            <StyleBoard buildType={buildType} selected={style} onSelect={setStyle} />
          </Field>

          {/* Palette */}
          <Field label="Colour palette" step={nextStep()}>
            <ColorPaletteBuilder
              buildType={buildType}
              preset={palette}
              onSelectPreset={setPalette}
              custom={customPalette}
              onChangeCustom={setCustomPalette}
            />
          </Field>

          {/* Materials */}
          <Field label="Materials" step={nextStep()}>
            <div className="space-y-4">
              <MaterialBoard buildType={buildType} selected={materials} onToggle={toggleMaterial} />
              <MaterialDropzone
                materials={customMaterials}
                onAdd={addCustomMaterial}
                onRemove={removeCustomMaterial}
                onRename={renameCustomMaterial}
              />
            </div>
          </Field>

          {/* Finish */}
          <Field label="How far do you want to take the finish?" step={nextStep()}>
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
            <Field label="Tell us about the site" step={nextStep()}>
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
            <Field label="Pick the look" step={nextStep()}>
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

                <div>
                  <p className="eyebrow mb-3 text-ink/45">Windows</p>
                  <div className="flex flex-wrap gap-2">
                    {WINDOW_STYLES.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setWindowStyle(w.id)}
                        aria-pressed={windowStyle === w.id}
                        title={w.blurb}
                        className={`border p-4 text-left transition-colors ${
                          windowStyle === w.id
                            ? 'border-ink bg-ink text-bone'
                            : 'border-ink/15 bg-white/50 hover:border-ink/45'
                        }`}
                      >
                        <span className="block font-display text-[0.78rem] font-bold uppercase tracking-[0.08em]">
                          {w.label}
                        </span>
                        <span
                          className={`mt-1.5 block text-xs leading-snug ${
                            windowStyle === w.id ? 'text-bone/60' : 'text-ink/55'
                          }`}
                        >
                          {w.blurb}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="eyebrow mb-3 text-ink/45">Door colour</p>
                  <div className="flex flex-wrap gap-2">
                    {DOOR_COLORS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDoorColor(d.id)}
                        aria-pressed={doorColor === d.id}
                        aria-label={d.label}
                        title={d.label}
                        className={`flex items-center gap-2.5 border py-2 pl-2 pr-4 transition-colors ${
                          doorColor === d.id ? 'border-ink' : 'border-ink/15 hover:border-ink/45'
                        }`}
                      >
                        <span
                          className="h-7 w-7 border border-black/15"
                          style={{ backgroundColor: d.hex }}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-medium">{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Field>
          )}

          {/* Add-ons */}
          {availableAddOns.length > 0 && (
            <Field label="Anything else?" step={nextStep()}>
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

          {/* Photo customizer — works for any build type, interior or exterior. */}
          <Field label="Customize from your own photo" step={nextStep()}>
            <PhotoCustomizer brief={brief} />
          </Field>

          {/* SketchUp export — exterior builds only, since it draws a standalone
              massing shell (walls + roof), which doesn't make sense for a
              kitchen, bath or whole-room renovation inside an existing house. */}
          {!isInterior && (
            <Field label="Open it in SketchUp" step={nextStep()}>
              <div className="border border-ink/15 bg-white/50 p-6">
                <p className="text-sm leading-relaxed text-ink/70">
                  Download a real, to-scale 3D starting shape built from the exact numbers above —
                  footprint, wall height and roof pitch. Open it in SketchUp to rotate it, walk
                  through it, and keep building on it yourself, or send it to our team as a
                  starting point for a proper model.
                </p>
                <button type="button" onClick={downloadSketchUp} className="btn-cedar mt-5">
                  {skDownloaded ? 'Download again (.rb)' : 'Download SketchUp file (.rb)'}
                </button>
                <p className="mt-4 text-xs leading-relaxed text-ink/45">
                  Opens via SketchUp&rsquo;s Ruby Console (Window ▸ Ruby Console — needs SketchUp
                  Pro or Studio, not the free web app). It builds walls, a roof and, if you picked
                  them, a deck and a loft floor — no windows or doors cut in yet, so treat it as a
                  rough massing model, not a finished design.
                </p>
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

          {projectId && (
            <div className="border-b border-bone/12 px-7 py-4">
              <p className="eyebrow text-bone/40">Reference</p>
              <p className="mt-1.5 font-display text-base font-extrabold tracking-[0.04em] text-cedar">
                {projectId}
              </p>
            </div>
          )}

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
            <a href={summary.mailto} className="btn-cedar w-full">
              Send this to us
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
