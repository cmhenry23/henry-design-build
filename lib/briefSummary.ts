/**
 * Turns a captured brief into the project overview that lands in Ryan's inbox.
 *
 * One implementation, used by every surface — the launcher panel, the brief
 * card, and the copy button — so the email, the screen and the clipboard can
 * never disagree about what was captured or what the range was.
 */

import { materialById } from '@/data/materials';
import { paletteById } from '@/data/palettes';
import { styleById } from '@/data/styles';
import { resolveBrief, type Brief } from '@/lib/brief';
import {
  ADD_ONS,
  BUILD_TYPES,
  FINISH_LEVELS,
  PITCHES,
  SEASONS,
  SITE_ACCESS,
  calculateEstimate,
  formatCAD,
} from '@/lib/estimate';
import { site } from '@/data/site';

import type { PreviewScene } from '@/components/visualizer/CabinPreview';

/** Which room the sketch should draw for each build type. */
export const SCENE_BY_TYPE: Record<string, PreviewScene> = {
  cottage: 'exterior',
  tiny: 'exterior',
  sauna: 'exterior',
  kitchen: 'kitchen',
  bath: 'bath',
  reno: 'room',
};

export function sceneFor(buildType: string): PreviewScene {
  return SCENE_BY_TYPE[buildType] ?? 'exterior';
}

const INTERIOR = ['kitchen', 'bath', 'reno'];

export interface BriefSummary {
  /** Rows shown in the on-screen card. */
  rows: { label: string; value: string }[];
  low: number;
  high: number;
  perSqFtLow: number;
  perSqFtHigh: number;
  typeLabel: string;
  /** True for any indoor scene — drives which spec rows are relevant. */
  isInterior: boolean;
  /** Which room the sketch draws. */
  scene: PreviewScene;
  /** Plain-text project overview — the email body and the clipboard payload. */
  overview: string;
  /** Ready-to-open mailto: link. */
  mailto: string;
  subject: string;
}

export function buildSummary(brief: Brief, projectId: string): BriefSummary {
  const r = resolveBrief(brief);
  const estimate = calculateEstimate({
    buildType: r.buildType,
    sqft: r.sqft,
    finish: r.finish,
    access: r.access,
    season: r.season,
    addOns: r.addOns,
  });

  const type = BUILD_TYPES.find((t) => t.id === r.buildType)!;
  const finish = FINISH_LEVELS.find((f) => f.id === r.finish)!;
  const isInterior = INTERIOR.includes(r.buildType);

  const rows: { label: string; value: string }[] = [
    { label: 'Project', value: type.label },
    { label: 'Size', value: `${r.sqft.toLocaleString()} sq ft` },
    { label: 'Finish', value: finish.label },
  ];
  if (type.showsSeason) {
    rows.push({ label: 'Use', value: SEASONS.find((s) => s.id === r.season)!.label });
  }
  if (type.showsAccess) {
    rows.push({ label: 'Access', value: SITE_ACCESS.find((a) => a.id === r.access)!.label });
  }
  if (!isInterior) {
    rows.push({ label: 'Cladding', value: r.cladding.label });
    rows.push({
      label: 'Roof',
      value: `${r.roof.label} (${PITCHES.find((p) => p.id === r.pitch.id)!.label.toLowerCase()} pitch)`,
    });
    rows.push({ label: 'Windows', value: r.windowStyle.label });
    rows.push({ label: 'Door', value: r.doorColor.label });
  }
  if (r.addOns.length) {
    rows.push({
      label: 'Add-ons',
      value: r.addOns.map((id) => ADD_ONS.find((a) => a.id === id)!.label).join(', '),
    });
  }
  const styleDef = styleById(r.style);
  if (styleDef) rows.push({ label: 'Style', value: styleDef.name });
  if (r.customPalette) {
    rows.push({
      label: 'Palette',
      value: `Custom mix — dominant ${r.customPalette.dominant}, secondary ${r.customPalette.secondary}, accent ${r.customPalette.accent}`,
    });
  } else {
    const paletteDef = paletteById(r.palette);
    if (paletteDef) {
      rows.push({
        label: 'Palette',
        value: `${paletteDef.name} (${paletteDef.colours.map((c) => `${c.name} ${c.hex}`).join(', ')})`,
      });
    }
  }
  if (r.materials.length) {
    rows.push({
      label: 'Materials liked',
      value: r.materials.map((id) => materialById(id)?.name ?? id).join(', '),
    });
  }
  if (r.customMaterials.length) {
    const named = r.customMaterials.filter((m) => m.name).map((m) => m.name);
    rows.push({
      label: 'Materials dropped in',
      value: named.length
        ? `${r.customMaterials.length} photo${r.customMaterials.length > 1 ? 's' : ''} (${named.join(', ')})`
        : `${r.customMaterials.length} reference photo${r.customMaterials.length > 1 ? 's' : ''}`,
    });
  }
  if (brief.location) rows.push({ label: 'Location', value: brief.location });
  if (brief.timeline) rows.push({ label: 'Timeline', value: brief.timeline });

  const line = (s = '') => s;
  const overview = [
    `PROJECT OVERVIEW — ${projectId}`,
    site.name,
    line(),
    'WHAT THEY WANT',
    ...rows.map((row) => `  ${row.label}: ${row.value}`),
    line(),
    'FINISH LEVEL',
    `  ${finish.label} — ${finish.blurb}`,
    ...(brief.notes ? [line(), 'IN THEIR OWN WORDS', `  ${brief.notes.replace(/\n/g, '\n  ')}`] : []),
    line(),
    'PLANNING RANGE',
    `  ${formatCAD(estimate.low)} – ${formatCAD(estimate.high)}`,
    `  Roughly ${formatCAD(estimate.perSqFtLow)} – ${formatCAD(estimate.perSqFtHigh)} per sq ft at this spec.`,
    '  This is a planning range, not a quote. Real numbers come after a site visit.',
    line(),
    'CONTACT',
    `  Name: ${brief.name || '—'}`,
    `  Email: ${brief.email || '—'}`,
    `  Location: ${brief.location || '—'}`,
    `  Timeline: ${brief.timeline || '—'}`,
    line(),
    `Captured by the intake assistant on ${site.url.replace(/^https?:\/\//, '')}`,
  ].join('\n');

  const subject = `${projectId} — ${type.label}, ${r.sqft.toLocaleString()} sq ft`;

  return {
    rows,
    low: estimate.low,
    high: estimate.high,
    perSqFtLow: estimate.perSqFtLow,
    perSqFtHigh: estimate.perSqFtHigh,
    typeLabel: type.label,
    isInterior,
    scene: sceneFor(r.buildType),
    overview,
    subject,
    mailto: `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      overview
    )}`,
  };
}
