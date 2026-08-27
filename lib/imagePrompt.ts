/**
 * Turns a captured brief into an image prompt.
 *
 * The point of this file is that the renders should look like *Ryan's* work,
 * not like a stock AI interior. Every material below is taken from the real
 * projects in data/projects.ts — the charcoal board cladding and steep gable
 * of the Cabin, the deep grey shaker and honed quartz of the
 * Forest Kitchen, the plum walls and reeded glass of the Aubergine Bath.
 *
 * Left generic, these models default to a recognisable house style (warm
 * cream walls, terracotta accents, mid-century furniture) that looks nothing
 * like a Canadian cottage-country build. The specificity here is what
 * prevents that.
 */

import { materialById } from '@/data/materials';
import { paletteById } from '@/data/palettes';
import { styleById } from '@/data/styles';
import { resolveBrief, type Brief } from '@/lib/brief';
import { ADD_ONS, BUILD_TYPES, FINISH_LEVELS } from '@/lib/estimate';

/** House style shared by every render, so a set of them reads as one company. */
const HOUSE_STYLE = [
  'Photographed like a real completed project, not a rendering:',
  'natural light, honest materials, no styling clutter, no people.',
  'Restrained Canadian cottage-country craft — warm woods against dark',
  'exteriors, matte black hardware, clean square joinery, no ornament.',
].join(' ');

const NEGATIVE = [
  'Avoid: cream or beige walls, terracotta accents, mid-century modern furniture,',
  'rattan, macramé, potted fiddle-leaf figs, marble everywhere, gold fixtures,',
  'open shelving styled with matching ceramics, showroom gloss, wide-angle',
  'distortion, text, watermarks, logos, people, pets.',
].join(' ');

const FINISH_NOTES: Record<string, string> = {
  essential: 'Simple, hard-wearing finishes. Money visibly spent on structure rather than decoration.',
  crafted: 'Solid materials and careful carpentry — the standard level of finish.',
  heirloom: 'Hand-hewn timber, scribed log work, custom millwork and stone. Built to outlast everyone.',
};

const SUBJECT: Record<string, string> = {
  cottage:
    'Exterior of a four-season Canadian cottage at dusk, standing in mixed evergreen bush. Steep gable roof, deep eaves, a simple covered entry, warm light in the windows.',
  tiny: 'Exterior of a small guest bunkie in the trees at dusk. Single steep gable, one door, one or two windows, warm light inside. Compact and deliberate, not a shed.',
  sauna:
    'Interior of a cedar sauna. Clear cedar benches in two tiers, tongue-and-groove cedar walls and ceiling, a long low picture window looking into snowy woods, dark slate floor, soft warm light.',
  kitchen:
    'Interior of a renovated cottage kitchen. Deep grey shaker cabinetry, honed white quartz counters with a soft grey vein, hand-glazed thin brick backsplash run full height, matte black hardware, a black apron sink, induction cooktop under a black chimney hood, wide-plank maple floor, a window onto forest.',
  bath: 'Interior of a small renovated bathroom. Deep aubergine walls, large-format marble-look porcelain on the floor and tub surround, a reeded glass tub screen in a slim black frame, a fluted vanity in muted green with an integrated quartz top, ribbed glass wall lights, matte black tapware.',
  reno: 'Interior of a renovated room in an older Canadian house. Wide-plank floors, generous painted trim and baseboard, site-built joinery, two trimmed windows with natural light, quiet and uncluttered.',
};

const ADD_ON_NOTES: Record<string, string> = {
  sauna: 'A cedar-lined sauna is part of the building.',
  logwork: 'Hand-peeled, scribed log stair and railing, full rounds with blackened balusters.',
  fireplace: 'A fieldstone fireplace with a hand-hewn, blackened timber mantel.',
  deck: 'A deck with a simple square railing wraps the entry, with a few steps down.',
  millwork: 'Site-built cabinetry and built-in storage.',
  loft: 'A sleeping loft sits above, open to the room below behind a railing.',
};

export function buildImagePrompt(brief: Brief): string {
  const r = resolveBrief(brief);
  const type = BUILD_TYPES.find((t) => t.id === r.buildType)!;
  const finish = FINISH_LEVELS.find((f) => f.id === r.finish)!;

  const parts: string[] = [SUBJECT[r.buildType] ?? SUBJECT.cottage];

  // Exterior scenes carry the visitor's cladding and roof choices.
  if (['cottage', 'tiny', 'sauna'].includes(r.buildType)) {
    parts.push(
      `Cladding is ${r.cladding.label.toLowerCase()}; roof is ${r.roof.label.toLowerCase()} with a ${
        r.pitch.label.toLowerCase()
      } pitch.`
    );
  }

  parts.push(`Roughly ${r.sqft.toLocaleString()} square feet, so scale it accordingly.`);
  parts.push(FINISH_NOTES[r.finish] ?? FINISH_NOTES.crafted);

  for (const id of r.addOns) {
    if (ADD_ON_NOTES[id]) parts.push(ADD_ON_NOTES[id]);
  }

  // Style and palette are explicit choices, so they outrank the build-type
  // defaults above and go in before the material list.
  const style = styleById(r.style);
  if (style) parts.push(`Design style — ${style.promptFragment}.`);

  // A hand-mixed palette is a more specific choice than a preset, so it wins
  // when both are somehow present.
  if (r.customPalette) {
    parts.push(
      `Use a custom colour palette the client mixed themselves — dominant colour ${r.customPalette.dominant}, secondary colour ${r.customPalette.secondary}, accent colour ${r.customPalette.accent}. Match these hex values as closely as the medium allows.`
    );
  } else {
    const palette = paletteById(r.palette);
    if (palette) parts.push(`Use ${palette.promptFragment}.`);
  }

  // Materials the visitor actually tapped. These are concrete choices, so they
  // carry more weight than the build-type defaults.
  const picked = r.materials.map((id) => materialById(id)).filter(Boolean);
  if (picked.length) {
    parts.push(
      `The client specifically chose these materials, so feature them prominently: ${picked
        .map((m) => m!.name.toLowerCase())
        .join(', ')}.`
    );
  }
  if (r.customMaterials.length) {
    parts.push(
      `The client also attached ${r.customMaterials.length} reference photo${
        r.customMaterials.length > 1 ? 's' : ''
      } of material${r.customMaterials.length > 1 ? 's' : ''} they want used${
        r.customMaterials.some((m) => m.name)
          ? ` (${r.customMaterials
              .filter((m) => m.name)
              .map((m) => m.name)
              .join(', ')})`
          : ''
      } — match the material shown in those photos as closely as possible.`
    );
  }

  // Anything the visitor said in their own words outranks the defaults above —
  // it is the only part of the prompt that is actually about *their* project.
  if (brief.notes.trim()) {
    parts.push(
      `The client described it in their own words as: "${brief.notes
        .replace(/["\n]/g, ' ')
        .trim()
        .slice(0, 400)}". Where this conflicts with the description above, follow the client.`
    );
  }

  parts.push(HOUSE_STYLE, NEGATIVE);

  return parts.join(' ');
}

/** Exteriors read better wide; interiors of small rooms read better squarer. */
export function aspectFor(brief: Brief): '16:9' | '4:3' {
  const r = resolveBrief(brief);
  return ['cottage', 'tiny'].includes(r.buildType) ? '16:9' : '4:3';
}

/** Short human-readable caption shown under the image. */
export function captionFor(brief: Brief): string {
  const r = resolveBrief(brief);
  const type = BUILD_TYPES.find((t) => t.id === r.buildType)!;
  const finish = FINISH_LEVELS.find((f) => f.id === r.finish)!;
  return `${type.label} · ${r.sqft.toLocaleString()} sq ft · ${finish.label} finish`;
}
