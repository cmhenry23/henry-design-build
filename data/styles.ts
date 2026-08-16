/**
 * Design styles the visitor can point at.
 *
 * The broadest thing we ask for, and the first board shown — it's much easier
 * to say "that one" than to describe a look in words. The pick then steers the
 * final render prompt and lands in Ryan's email.
 *
 * Chosen for the market Ryan actually builds in: Canadian cottage country and
 * older houses in the surrounding towns. No lofts, no desert modern, nothing
 * he'd never be asked for.
 *
 * Images are pre-generated once by tools/generate-images.mjs into
 * public/styles/, same as the materials. Tiles fall back to the `hex` swatch
 * when a file is absent.
 */

export interface DesignStyle {
  id: string;
  name: string;
  /** One line the visitor reads. What it feels like, not an art-history note. */
  blurb: string;
  /** Fallback swatch, and the tile background while the image loads. */
  hex: string;
  /** Build types this is worth offering for. */
  suits: string[];
  /** Phrase folded into the render prompt when chosen. */
  promptFragment: string;
  /** Prompt for the one-time generator. */
  prompt: string;
}

const SHOT =
  'Photographed like a real completed project, natural light, no people, no text or watermarks, no styling clutter. Canadian setting.';

export const STYLES: DesignStyle[] = [
  {
    id: 'modern-farmhouse',
    name: 'Modern farmhouse',
    blurb: 'Clean gables, board cladding, black windows. Familiar but not fussy.',
    hex: '#E8E4DC',
    suits: ['cottage', 'tiny', 'sauna', 'kitchen', 'bath', 'reno'],
    promptFragment:
      'modern farmhouse: simple steep gables, vertical board-and-batten, black window frames, white or muted trim, natural wood accents, no ornament',
    prompt: `Exterior of a modern farmhouse style Canadian home: crisp steep gable, vertical board-and-batten cladding, black-framed windows, a simple covered porch with square posts, natural wood door. Late afternoon light, trees behind. ${SHOT}`,
  },
  {
    id: 'craftsman',
    name: 'Craftsman',
    blurb: 'Exposed rafter tails, tapered columns, honest joinery you can see.',
    hex: '#8C6A47',
    suits: ['cottage', 'tiny', 'kitchen', 'bath', 'reno'],
    promptFragment:
      'craftsman: exposed rafter tails, deep overhangs, tapered porch columns on stone piers, wide trim, visible joinery, warm stained wood',
    prompt: `Exterior of a craftsman style Canadian home: deep overhanging eaves with exposed rafter tails, tapered columns on fieldstone piers, wide painted trim, warm stained wood, a generous front porch. Soft daylight, mature trees. ${SHOT}`,
  },
  {
    id: 'nordic',
    name: 'Nordic',
    blurb: 'Pale wood, white walls, almost nothing on them. Light does the work.',
    hex: '#EDE9E2',
    suits: ['cottage', 'tiny', 'sauna', 'kitchen', 'bath', 'reno'],
    promptFragment:
      'nordic/scandinavian: pale unstained wood, white walls, restrained palette, simple square-edged joinery, uncluttered, light-filled',
    prompt: `Interior of a Nordic style Canadian cabin: pale unstained pine walls and ceiling, white-painted surfaces, wide light floorboards, a large simple window onto snowy trees, almost no decoration. Cool bright daylight. ${SHOT}`,
  },
  {
    id: 'rustic-lodge',
    name: 'Rustic lodge',
    blurb: 'Heavy timber, stone, dark wood. The cottage your grandparents had.',
    hex: '#4A3B2C',
    suits: ['cottage', 'tiny', 'sauna', 'reno'],
    promptFragment:
      'rustic lodge: heavy exposed timber, peeled log posts, fieldstone fireplace, dark stained wood, warm low lighting, cabin character',
    prompt: `Interior of a rustic Canadian lodge: heavy exposed timber beams, peeled log posts, a tall fieldstone fireplace, dark stained tongue-and-groove walls, warm low light, a window onto pines. ${SHOT}`,
  },
  {
    id: 'modern-minimal',
    name: 'Modern minimal',
    blurb: 'Flat planes, hidden hardware, dark cladding. Quiet and sharp.',
    hex: '#2B2B29',
    suits: ['cottage', 'tiny', 'sauna', 'kitchen', 'bath', 'reno'],
    promptFragment:
      'modern minimal: flat planes, dark monolithic cladding, concealed hardware, large unbroken glazing, restrained detailing, no visible trim',
    prompt: `Exterior of a modern minimal Canadian cabin: dark monolithic cladding, a single clean roof plane, large unbroken glazing, concealed hardware, no visible trim, sitting low among evergreens at dusk. ${SHOT}`,
  },
  {
    id: 'timber-frame',
    name: 'Timber frame',
    blurb: 'The structure is the finish — big posts and beams left showing.',
    hex: '#9C7A50',
    suits: ['cottage', 'tiny', 'sauna', 'reno'],
    promptFragment:
      'timber frame: exposed post-and-beam structure with visible joinery and pegs, cathedral ceiling, structure left as the finish',
    prompt: `Interior of a Canadian timber frame cottage: exposed heavy post-and-beam structure with visible mortise joinery and pegs, cathedral ceiling, pale infill walls, tall windows onto forest. ${SHOT}`,
  },
  {
    id: 'traditional-cottage',
    name: 'Traditional cottage',
    blurb: 'Painted siding, divided windows, a deep porch. Comfortably ordinary.',
    hex: '#D8DBD4',
    suits: ['cottage', 'tiny', 'kitchen', 'bath', 'reno'],
    promptFragment:
      'traditional Canadian cottage: painted horizontal siding, divided-light windows, a deep covered porch, simple pitched roof, unpretentious',
    prompt: `Exterior of a traditional Canadian lake cottage: painted horizontal siding, divided-light windows, a deep covered porch with simple railings, pitched roof, dock and water visible beyond. Summer afternoon. ${SHOT}`,
  },
  {
    id: 'transitional',
    name: 'Transitional',
    blurb: 'Traditional bones, modern surfaces. The safe middle, done properly.',
    hex: '#BFB6A8',
    suits: ['kitchen', 'bath', 'reno', 'cottage'],
    promptFragment:
      'transitional: traditional proportions and shaker joinery with modern flat surfaces, matte black hardware, muted palette, neither period nor stark',
    prompt: `Interior of a transitional style Canadian kitchen: shaker cabinetry in a muted tone, flat modern stone counters, matte black hardware, traditional trim proportions, restrained and current. Natural daylight. ${SHOT}`,
  },
];

export function stylesFor(buildType: string, limit = 6) {
  const matches = STYLES.filter((s) => s.suits.includes(buildType));
  return (matches.length ? matches : STYLES).slice(0, limit);
}

export function styleById(id: string) {
  return STYLES.find((s) => s.id === id);
}
