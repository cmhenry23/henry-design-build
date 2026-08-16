/**
 * The material palette, taken from Ryan's real completed projects.
 *
 * WHY THESE ARE PRE-GENERATED, NOT MADE PER CONVERSATION
 * ─────────────────────────────────────────────────────
 * There are only ~16 materials in the whole system and they never change per
 * visitor. Generating them live would cost ~$0.13 each on every conversation,
 * add seconds of latency, and produce a slightly different cedar every time.
 *
 * Instead `tools/materials/generate.mjs` renders them once, they get committed
 * to public/materials/, and the chat serves them as static files — free,
 * instant, and identical for every visitor. Only the final whole-project
 * render is generated live, because that one genuinely depends on the brief.
 *
 * If an image file is missing the board falls back to the `hex` swatch, so
 * this works before the generator has ever been run.
 */

export type MaterialCategory = 'Exterior' | 'Wood' | 'Surface' | 'Detail';

export interface Material {
  id: string;
  name: string;
  /** One line the visitor reads. Plain language, no trade jargon. */
  blurb: string;
  category: MaterialCategory;
  /** Fallback swatch, and the tile background while the image loads. */
  hex: string;
  /** Build types this is worth showing for. */
  suits: string[];
  /** Prompt for the one-time generator. Close-up, real, no styling. */
  prompt: string;
}

const SHOT =
  'Tight close-up material photograph, filling the frame, natural daylight, shallow depth of field, honest texture, no props, no styling, no people, no text or watermarks. Photographed like a builder documenting a real finished surface.';

export const MATERIALS: Material[] = [
  // ── Exterior ──
  {
    id: 'charcoal-board',
    name: 'Charcoal board cladding',
    blurb: 'Dark horizontal boards that let a building sit back into the treeline.',
    category: 'Exterior',
    hex: '#3B3A38',
    suits: ['cottage', 'tiny', 'sauna'],
    prompt: `Charcoal-grey painted horizontal board cladding on an exterior wall, crisp shadow lines between boards, matte finish. ${SHOT}`,
  },
  {
    id: 'natural-cedar-siding',
    name: 'Natural cedar siding',
    blurb: 'Left to silver off, or oiled to hold the warm tone.',
    category: 'Exterior',
    hex: '#C08D57',
    suits: ['cottage', 'tiny', 'sauna'],
    prompt: `Natural western red cedar exterior siding boards, warm reddish-brown, visible straight grain and knots, lightly oiled. ${SHOT}`,
  },
  {
    id: 'standing-seam',
    name: 'Black standing seam roof',
    blurb: 'Sheds snow, lasts decades, and reads as one clean plane.',
    category: 'Exterior',
    hex: '#26262A',
    suits: ['cottage', 'tiny', 'sauna'],
    prompt: `Black standing seam metal roofing, raised vertical seams running up the slope, matte finish, slight surface reflection of a grey sky. ${SHOT}`,
  },
  {
    id: 'fieldstone',
    name: 'Fieldstone',
    blurb: 'Rough local stone, laid tight. Used on fireplaces and bases.',
    category: 'Exterior',
    hex: '#A79C8C',
    suits: ['cottage', 'tiny', 'reno'],
    prompt: `Rough fieldstone masonry wall, irregular pale limestone pieces with deep recessed mortar joints, heavy natural texture. ${SHOT}`,
  },

  // ── Wood ──
  {
    id: 'clear-cedar',
    name: 'Clear cedar lining',
    blurb: 'Tongue-and-groove cedar on walls and ceiling. What a sauna is made of.',
    category: 'Wood',
    hex: '#D7A76B',
    suits: ['sauna', 'cottage', 'tiny', 'reno'],
    prompt: `Clear western red cedar tongue-and-groove interior lining boards, honey-toned, tight straight grain, small tight knots, soft warm light raking across. ${SHOT}`,
  },
  {
    id: 'maple-floor',
    name: 'Wide-plank maple',
    blurb: 'Character grade — the marks in it are the reason to choose it.',
    category: 'Wood',
    hex: '#D9C3A0',
    suits: ['cottage', 'tiny', 'kitchen', 'reno'],
    prompt: `Wide-plank character-grade maple hardwood flooring, pale cream and honey tones, natural mineral streaks and small knots, satin finish. ${SHOT}`,
  },
  {
    id: 'hewn-timber',
    name: 'Hand-hewn timber',
    blurb: 'Worked by hand with a slick, then blackened. Used for mantels and beams.',
    category: 'Wood',
    hex: '#2A2622',
    suits: ['cottage', 'tiny', 'sauna', 'reno'],
    prompt: `Hand-hewn timber beam face, blackened and burnished, deep irregular adze scallops catching light unevenly across the surface. ${SHOT}`,
  },
  {
    id: 'peeled-log',
    name: 'Peeled log',
    blurb: 'Full rounds, hand-peeled and scribed on site. Stairs and railings.',
    category: 'Wood',
    hex: '#C6A985',
    suits: ['cottage', 'tiny', 'sauna'],
    prompt: `Hand-peeled log post, pale cream cedar with visible draw-knife facets and natural undulations, satin clear finish. ${SHOT}`,
  },
  {
    id: 'walnut-shelf',
    name: 'Walnut shelving',
    blurb: 'Solid floating shelves, usually with light tucked under the front edge.',
    category: 'Wood',
    hex: '#6B4A33',
    suits: ['kitchen', 'reno'],
    prompt: `Solid black walnut floating shelf edge, deep chocolate brown with visible open grain, square machined edge, satin finish. ${SHOT}`,
  },

  // ── Surface ──
  {
    id: 'honed-quartz',
    name: 'Honed quartz',
    blurb: 'Soft grey vein on white. Takes daily use without complaint.',
    category: 'Surface',
    hex: '#F0EEEA',
    suits: ['kitchen', 'bath', 'reno'],
    prompt: `Honed white quartz countertop surface, soft irregular grey veining, matte non-reflective finish, square eased edge. ${SHOT}`,
  },
  {
    id: 'thin-brick',
    name: 'Hand-glazed thin brick',
    blurb: 'The waver in the glaze is the point — it stops a wall reading flat.',
    category: 'Surface',
    hex: '#EFEBE3',
    suits: ['kitchen', 'bath', 'reno'],
    prompt: `Hand-glazed thin brick wall tile in soft off-white, slightly uneven glossy glaze with visible variation and gentle waver, thin grout lines. ${SHOT}`,
  },
  {
    id: 'marble-porcelain',
    name: 'Marble-look porcelain',
    blurb: 'Large format, minimal grout. The look of stone without the upkeep.',
    category: 'Surface',
    hex: '#E9E4DC',
    suits: ['bath', 'reno'],
    prompt: `Large-format marble-look porcelain tile, soft warm white with fine grey veining, honed matte finish, barely visible grout joint. ${SHOT}`,
  },
  {
    id: 'slate-floor',
    name: 'Large-format slate',
    blurb: 'Dark, matte and unbothered by water. Wet rooms and saunas.',
    category: 'Surface',
    hex: '#3D4144',
    suits: ['sauna', 'bath', 'reno'],
    prompt: `Large-format dark slate floor tile, charcoal grey with subtle cloudy tonal variation, matte riven texture, tight joints. ${SHOT}`,
  },
  {
    id: 'aubergine-paint',
    name: 'Deep aubergine',
    blurb: 'A small room that stops apologising for being small.',
    category: 'Surface',
    hex: '#4A3446',
    suits: ['bath', 'reno'],
    prompt: `Flat wall painted deep aubergine plum, satin sheen, smooth even finish, soft directional daylight showing subtle colour depth. ${SHOT}`,
  },

  // ── Detail ──
  {
    id: 'reeded-glass',
    name: 'Reeded glass',
    blurb: 'Holds the light without showing the whole room.',
    category: 'Detail',
    hex: '#CFD8D6',
    suits: ['bath', 'kitchen', 'reno'],
    prompt: `Reeded fluted glass panel in a slim matte black frame, vertical ribs distorting the light behind it, clean and modern. ${SHOT}`,
  },
  {
    id: 'matte-black',
    name: 'Matte black hardware',
    blurb: 'Taps, pulls and hinges. Quiet, and it hides fingerprints.',
    category: 'Detail',
    hex: '#22221F',
    suits: ['kitchen', 'bath', 'reno', 'cottage', 'tiny'],
    prompt: `Matte black tapware and cabinet hardware detail, powder-coated black finish, crisp square-edged modern profile, against a pale surface. ${SHOT}`,
  },
];

export function materialsFor(buildType: string, limit = 6) {
  const matches = MATERIALS.filter((m) => m.suits.includes(buildType));
  return (matches.length ? matches : MATERIALS).slice(0, limit);
}

export function materialById(id: string) {
  return MATERIALS.find((m) => m.id === id);
}
