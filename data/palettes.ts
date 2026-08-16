/**
 * Colour palettes.
 *
 * DELIBERATELY NOT AI-GENERATED
 * ─────────────────────────────
 * A palette *is* a set of hex values. Asking an image model to render one gives
 * you an approximation — a swatch that photographs as #4A3446 but isn't, and
 * drifts every regeneration. These are drawn as CSS, so the colour on screen is
 * the exact colour named, free and instant.
 *
 * Every palette is anchored on a real Ryan project, then completed with
 * genuinely harmonious partners rather than arbitrary accents:
 *
 *   dominant   the wall or cladding — the most of it
 *   secondary  cabinetry, joinery, the second largest area
 *   accent     the deliberate note; sits opposite or well away from the
 *              dominant on the wheel so it reads as a choice, not a clash
 *   neutral    trim, counters, the thing that lets the rest breathe
 */

export interface Palette {
  id: string;
  name: string;
  blurb: string;
  /** Rendered left to right in the tile; first is the largest area. */
  colours: { role: 'dominant' | 'secondary' | 'accent' | 'neutral'; name: string; hex: string }[];
  suits: string[];
  /** Phrase folded into the render prompt when chosen. */
  promptFragment: string;
}

export const PALETTES: Palette[] = [
  {
    id: 'charcoal-cedar',
    name: 'Charcoal & cedar',
    blurb: 'Dark outside, warm in. The cabin palette — recedes into the trees.',
    suits: ['cottage', 'tiny', 'sauna', 'reno'],
    colours: [
      { role: 'dominant', name: 'Charcoal', hex: '#3B3A38' },
      { role: 'secondary', name: 'Cedar', hex: '#C08D57' },
      { role: 'accent', name: 'Ember', hex: '#B5652F' },
      { role: 'neutral', name: 'Bone', hex: '#F2F0EC' },
    ],
    promptFragment:
      'a charcoal and cedar palette — dark charcoal as the dominant surface, warm cedar as the second, bone-white trim, a single warm ember accent',
  },
  {
    id: 'aubergine-sage',
    name: 'Aubergine & sage',
    blurb: 'Deep plum against muted green. Small rooms that own it.',
    suits: ['bath', 'reno', 'kitchen'],
    colours: [
      { role: 'dominant', name: 'Aubergine', hex: '#4A3446' },
      { role: 'secondary', name: 'Sage', hex: '#8A9682' },
      { role: 'accent', name: 'Matte black', hex: '#22221F' },
      { role: 'neutral', name: 'Marble white', hex: '#EFEAE3' },
    ],
    promptFragment:
      'an aubergine and sage palette — deep plum walls, muted sage-green joinery, marble-white surfaces, matte black fixtures',
  },
  {
    id: 'forest-bone',
    name: 'Forest & bone',
    blurb: 'Green cladding, cream trim, natural wood. Quiet and rooted.',
    suits: ['cottage', 'tiny', 'sauna', 'reno'],
    colours: [
      { role: 'dominant', name: 'Forest', hex: '#3C4E3D' },
      { role: 'secondary', name: 'Natural oak', hex: '#C6A177' },
      { role: 'accent', name: 'Brass', hex: '#B08D57' },
      { role: 'neutral', name: 'Cream', hex: '#F0EBE0' },
    ],
    promptFragment:
      'a forest green and bone palette — deep green as the dominant colour, natural oak, cream trim, aged brass accents',
  },
  {
    id: 'slate-oak',
    name: 'Slate & white oak',
    blurb: 'Cool grey with pale wood. Modern without going cold.',
    suits: ['kitchen', 'bath', 'reno', 'cottage', 'tiny'],
    colours: [
      { role: 'dominant', name: 'Slate', hex: '#5A6167' },
      { role: 'secondary', name: 'White oak', hex: '#D9C3A0' },
      { role: 'accent', name: 'Rust', hex: '#A8542F' },
      { role: 'neutral', name: 'Chalk', hex: '#F4F2ED' },
    ],
    promptFragment:
      'a slate and white oak palette — cool grey-blue as the dominant, pale white oak, chalk-white surfaces, one rust accent',
  },
  {
    id: 'bone-black',
    name: 'Bone & black',
    blurb: 'High contrast, nothing else. Lets the carpentry be the feature.',
    suits: ['kitchen', 'bath', 'reno', 'cottage', 'tiny', 'sauna'],
    colours: [
      { role: 'dominant', name: 'Bone', hex: '#F2F0EC' },
      { role: 'secondary', name: 'Near black', hex: '#211F1D' },
      { role: 'accent', name: 'Warm wood', hex: '#B98B55' },
      { role: 'neutral', name: 'Soft grey', hex: '#CFCCC5' },
    ],
    promptFragment:
      'a bone and black palette — off-white as the dominant, near-black joinery and hardware, one warm wood element, no other colour',
  },
  {
    id: 'clay-linen',
    name: 'Clay & linen',
    blurb: 'Warm earth tones. Softer than grey, without going beige.',
    suits: ['cottage', 'tiny', 'kitchen', 'bath', 'reno'],
    colours: [
      { role: 'dominant', name: 'Weathered clay', hex: '#96604A' },
      { role: 'secondary', name: 'Linen', hex: '#E5DDD0' },
      { role: 'accent', name: 'Deep teal', hex: '#2F5D5B' },
      { role: 'neutral', name: 'Putty', hex: '#BFB6A8' },
    ],
    promptFragment:
      'a clay and linen palette — warm terracotta-clay as the dominant, linen and putty neutrals, a deep teal accent',
  },
];

export function palettesFor(buildType: string, limit = 6) {
  const matches = PALETTES.filter((p) => p.suits.includes(buildType));
  return (matches.length ? matches : PALETTES).slice(0, limit);
}

export function paletteById(id: string) {
  return PALETTES.find((p) => p.id === id);
}
