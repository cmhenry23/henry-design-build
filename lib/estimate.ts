/**
 * ══════════════════════════════════════════════════════════════════
 *  ⚠  PLACEHOLDER PRICING — RYAN MUST REPLACE THESE NUMBERS  ⚠
 * ══════════════════════════════════════════════════════════════════
 *
 * Every rate in this file is a PLACEHOLDER seeded from published
 * 2026 Ontario cost-per-square-foot ranges. They are NOT Ryan's
 * numbers and they are NOT a quote.
 *
 * Sources used for the seed ranges (public 2026 guides):
 *   - Ontario custom builds commonly quoted $300–$600+/sq ft
 *   - Three-season cottage roughly $350–$500/sq ft
 *   - Four-season / waterfront roughly $500–$800+/sq ft
 *   - Estate-level $900–$1,200+/sq ft
 *
 * HOW TO MAKE THIS REAL:
 *   1. Take your last 3–5 completed projects.
 *   2. Divide final invoice by finished square footage.
 *   3. Put your own low/high per-sq-ft into the `rate` field of each
 *      entry in BUILD_TYPES below.
 *   4. Adjust the multipliers so a known past project lands inside
 *      the range the tool produces. If it doesn't, the tool is
 *      wrong and it will cost you trust — fix it before launch.
 *
 * The UI always shows this as a RANGE and always labels it a
 * planning estimate, never a quote. Keep it that way.
 */

export const PLACEHOLDER_PRICING = true;

export type BuildTypeId = 'cottage' | 'tiny' | 'sauna' | 'kitchen' | 'bath' | 'reno';
export type FinishLevelId = 'essential' | 'crafted' | 'heirloom';
export type SiteAccessId = 'easy' | 'moderate' | 'remote';
export type SeasonId = 'three' | 'four';

export interface BuildType {
  id: BuildTypeId;
  label: string;
  blurb: string;
  /** Placeholder $/sq ft, [low, high]. */
  rate: [number, number];
  /** Slider bounds in sq ft. */
  min: number;
  max: number;
  step: number;
  defaultSize: number;
  /** Which option groups apply to this build type. */
  showsExterior: boolean;
  showsSeason: boolean;
  showsAccess: boolean;
}

export const BUILD_TYPES: BuildType[] = [
  {
    id: 'cottage',
    label: 'Custom cottage',
    blurb: 'A full build — foundation, frame, envelope and finish.',
    rate: [420, 700],
    min: 600,
    max: 3200,
    step: 50,
    defaultSize: 1400,
    showsExterior: true,
    showsSeason: true,
    showsAccess: true,
  },
  {
    id: 'tiny',
    label: 'Tiny home / bunkie',
    blurb: 'Small footprint, full finish. Guest space or studio.',
    rate: [350, 620],
    min: 120,
    max: 800,
    step: 20,
    defaultSize: 320,
    showsExterior: true,
    showsSeason: true,
    showsAccess: true,
  },
  {
    id: 'sauna',
    label: 'Sauna build',
    blurb: 'Cedar-lined, purpose-built, indoor or standalone.',
    rate: [400, 750],
    min: 60,
    max: 400,
    step: 10,
    defaultSize: 120,
    showsExterior: true,
    showsSeason: false,
    showsAccess: true,
  },
  {
    id: 'kitchen',
    label: 'Kitchen renovation',
    blurb: 'Gut and rebuild, including cabinetry and finishes.',
    rate: [500, 950],
    min: 80,
    max: 600,
    step: 10,
    defaultSize: 200,
    showsExterior: false,
    showsSeason: false,
    showsAccess: false,
  },
  {
    id: 'bath',
    label: 'Bathroom renovation',
    blurb: 'Back to studs, new waterproofing, new everything.',
    rate: [650, 1150],
    min: 30,
    max: 250,
    step: 5,
    defaultSize: 60,
    showsExterior: false,
    showsSeason: false,
    showsAccess: false,
  },
  {
    id: 'reno',
    label: 'Whole-home renovation',
    blurb: 'Multi-room rework, restoration or full-floor gut.',
    rate: [220, 480],
    min: 300,
    max: 4000,
    step: 50,
    defaultSize: 1200,
    showsExterior: false,
    showsSeason: false,
    showsAccess: true,
  },
];

export interface FinishLevel {
  id: FinishLevelId;
  label: string;
  blurb: string;
  multiplier: number;
}

export const FINISH_LEVELS: FinishLevel[] = [
  {
    id: 'essential',
    label: 'Essential',
    blurb: 'Money goes into structure, envelope and substrate. Finishes stay simple and durable.',
    multiplier: 0.85,
  },
  {
    id: 'crafted',
    label: 'Crafted',
    blurb: 'The usual Henry standard. Solid materials, real carpentry, details that hold up.',
    multiplier: 1.0,
  },
  {
    id: 'heirloom',
    label: 'Heirloom',
    blurb: 'Hand-hewn timber, log work, custom millwork, stone. Built to outlive everyone.',
    multiplier: 1.32,
  },
];

export interface SiteAccess {
  id: SiteAccessId;
  label: string;
  blurb: string;
  multiplier: number;
}

export const SITE_ACCESS: SiteAccess[] = [
  { id: 'easy', label: 'Easy access', blurb: 'Road to the door, level lot, services at the lot line.', multiplier: 1.0 },
  { id: 'moderate', label: 'Some challenge', blurb: 'Long lane, slope, or limited turnaround for deliveries.', multiplier: 1.1 },
  { id: 'remote', label: 'Remote or water access', blurb: 'Barge, winter road, rock, or no services on site.', multiplier: 1.28 },
];

export const SEASONS = [
  { id: 'three' as SeasonId, label: 'Three season', blurb: 'Spring through fall. Lighter envelope, no winter heat load.', multiplier: 0.88 },
  { id: 'four' as SeasonId, label: 'Four season', blurb: 'Full insulation, winter-rated mechanicals, freeze protection.', multiplier: 1.0 },
];

/** Optional add-ons. Flat placeholder dollar amounts. */
export interface AddOn {
  id: string;
  label: string;
  blurb: string;
  cost: [number, number];
  appliesTo: BuildTypeId[];
}

export const ADD_ONS: AddOn[] = [
  {
    id: 'sauna',
    label: 'Cedar sauna',
    blurb: 'Clear cedar benches, heater, ventilation and wet-area build-up.',
    cost: [14000, 32000],
    appliesTo: ['cottage', 'tiny', 'reno'],
  },
  {
    id: 'logwork',
    label: 'Log stair or railing',
    blurb: 'Hand-peeled, scribed and fitted on site.',
    cost: [9000, 26000],
    appliesTo: ['cottage', 'tiny', 'sauna', 'reno'],
  },
  {
    id: 'fireplace',
    label: 'Stone fireplace & hewn mantel',
    blurb: 'Fieldstone surround with a hand-hewn timber mantel.',
    cost: [8000, 24000],
    appliesTo: ['cottage', 'tiny', 'kitchen', 'reno'],
  },
  {
    id: 'deck',
    label: 'Deck or covered porch',
    blurb: 'Framed, clad and railed to match the building.',
    cost: [12000, 40000],
    appliesTo: ['cottage', 'tiny', 'sauna', 'reno'],
  },
  {
    id: 'millwork',
    label: 'Custom built-ins',
    blurb: 'Site-built cabinetry, shelving, benches and storage walls.',
    cost: [6000, 28000],
    appliesTo: ['cottage', 'tiny', 'kitchen', 'bath', 'reno'],
  },
  {
    id: 'loft',
    label: 'Sleeping loft',
    blurb: 'Framed loft with stair or ladder access and railing.',
    cost: [7000, 20000],
    appliesTo: ['cottage', 'tiny'],
  },
];

/* ── Visual options. These change the preview drawing, not the price. ── */

export const CLADDINGS = [
  { id: 'charcoal', label: 'Charcoal board', hex: '#3B3A38', trim: '#F2F0EC' },
  { id: 'cedar', label: 'Natural cedar', hex: '#C08D57', trim: '#F2F0EC' },
  { id: 'forest', label: 'Forest green', hex: '#3C4E3D', trim: '#F2F0EC' },
  { id: 'bone', label: 'Bone white', hex: '#E9E4DA', trim: '#3B3A38' },
  { id: 'ink', label: 'Near black', hex: '#211F1D', trim: '#C08D57' },
  { id: 'clay', label: 'Weathered clay', hex: '#96604A', trim: '#F2F0EC' },
];

export const ROOFS = [
  { id: 'steel-black', label: 'Black standing seam', hex: '#26262A', ribbed: true },
  { id: 'steel-green', label: 'Green standing seam', hex: '#33463A', ribbed: true },
  { id: 'steel-galv', label: 'Galvalume', hex: '#9EA4A6', ribbed: true },
  { id: 'shingle', label: 'Asphalt shingle', hex: '#4A4744', ribbed: false },
  { id: 'cedar-shake', label: 'Cedar shake', hex: '#9A7147', ribbed: false },
];

export const PITCHES = [
  { id: 'gentle', label: 'Gentle', value: 0.34 },
  { id: 'classic', label: 'Classic', value: 0.52 },
  { id: 'steep', label: 'Steep A-frame', value: 0.78 },
];

/* ── The calculation ── */

export interface EstimateInput {
  buildType: BuildTypeId;
  sqft: number;
  finish: FinishLevelId;
  access: SiteAccessId;
  season: SeasonId;
  addOns: string[];
}

export interface EstimateResult {
  low: number;
  high: number;
  perSqFtLow: number;
  perSqFtHigh: number;
  baseLow: number;
  baseHigh: number;
  addOnLow: number;
  addOnHigh: number;
  lines: { label: string; low: number; high: number }[];
}

/** Round to a sensible presentation number so the output never looks falsely precise. */
function roundTo(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const type = BUILD_TYPES.find((t) => t.id === input.buildType) ?? BUILD_TYPES[0];
  const finish = FINISH_LEVELS.find((f) => f.id === input.finish) ?? FINISH_LEVELS[1];
  const access = SITE_ACCESS.find((a) => a.id === input.access) ?? SITE_ACCESS[0];
  const season = SEASONS.find((s) => s.id === input.season) ?? SEASONS[1];

  const accessMult = type.showsAccess ? access.multiplier : 1;
  const seasonMult = type.showsSeason ? season.multiplier : 1;
  const mult = finish.multiplier * accessMult * seasonMult;

  const perSqFtLow = type.rate[0] * mult;
  const perSqFtHigh = type.rate[1] * mult;

  const baseLow = perSqFtLow * input.sqft;
  const baseHigh = perSqFtHigh * input.sqft;

  const selected = ADD_ONS.filter(
    (a) => input.addOns.includes(a.id) && a.appliesTo.includes(input.buildType)
  );
  const addOnLow = selected.reduce((sum, a) => sum + a.cost[0], 0);
  const addOnHigh = selected.reduce((sum, a) => sum + a.cost[1], 0);

  const lines = [
    { label: `${type.label} — ${input.sqft.toLocaleString()} sq ft`, low: baseLow, high: baseHigh },
    ...selected.map((a) => ({ label: a.label, low: a.cost[0], high: a.cost[1] })),
  ];

  // Round to the nearest $5k so nothing reads like a quote.
  const nearest = baseHigh > 400000 ? 10000 : 5000;

  return {
    low: roundTo(baseLow + addOnLow, nearest),
    high: roundTo(baseHigh + addOnHigh, nearest),
    perSqFtLow: Math.round(perSqFtLow),
    perSqFtHigh: Math.round(perSqFtHigh),
    baseLow,
    baseHigh,
    addOnLow,
    addOnHigh,
    lines,
  };
}

export function formatCAD(value: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}
