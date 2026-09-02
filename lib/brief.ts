/**
 * The project brief the chatbot builds up from a conversation.
 *
 * IMPORTANT DESIGN RULE
 * ─────────────────────
 * The model's only job is to EXTRACT these fields from what the visitor says.
 * It never produces a price and never produces a drawing. The estimate comes
 * from `calculateEstimate()` and the visual comes from `<CabinPreview>` — both
 * deterministic functions of the fields below.
 *
 * That means a visitor cannot talk the bot into a number, and the same brief
 * always produces the same estimate and the same sketch.
 */

import {
  ADD_ONS,
  BUILD_TYPES,
  CLADDINGS,
  DOOR_COLORS,
  FINISH_LEVELS,
  PITCHES,
  ROOFS,
  SEASONS,
  SITE_ACCESS,
  WINDOW_STYLES,
  guessLocationId,
  type BuildTypeId,
  type FinishLevelId,
  type SeasonId,
  type SiteAccessId,
} from '@/lib/estimate';

/** `'unknown'` is used instead of null so the JSON schema stays simple. */
export const UNKNOWN = 'unknown' as const;

/**
 * A palette the visitor mixed themselves instead of picking a preset.
 * Configurator-only — the chat never sets this (typing a hex code isn't a
 * conversational thing to ask for), so it's absent from BRIEF_SCHEMA below.
 */
export interface CustomPaletteColors {
  dominant: string;
  secondary: string;
  accent: string;
}

/**
 * A material the visitor dropped in as a photo rather than picking from the
 * fixed board — a tile sample, a paint chip, a fabric swatch. Same
 * Configurator-only rule as CustomPaletteColors.
 */
export interface CustomMaterial {
  id: string;
  name: string;
  dataUrl: string;
}

export interface Brief {
  buildType: BuildTypeId | typeof UNKNOWN;
  /** 0 means not established yet. */
  sqft: number;
  finish: FinishLevelId | typeof UNKNOWN;
  access: SiteAccessId | typeof UNKNOWN;
  season: SeasonId | typeof UNKNOWN;
  addOns: string[];
  /** Design style id the visitor picked. Broadest signal we capture. */
  style: string;
  /** Colour palette id. */
  palette: string;
  /** A palette the visitor mixed themselves. Overrides `palette` when set. */
  customPalette: CustomPaletteColors | null;
  /** Material ids the visitor tapped in the chat. Feeds the render + the email. */
  materials: string[];
  /** Materials the visitor dropped in as photos rather than picking from the board. */
  customMaterials: CustomMaterial[];
  cladding: string;
  roof: string;
  pitch: string;
  /** Configurator-only visual choices — same reasoning as CustomPaletteColors. */
  windowStyle: string;
  doorColor: string;
  location: string;
  timeline: string;
  name: string;
  email: string;
  /** Anything the visitor said that doesn't fit a field — passed to Ryan verbatim. */
  notes: string;
}

export const EMPTY_BRIEF: Brief = {
  buildType: UNKNOWN,
  sqft: 0,
  finish: UNKNOWN,
  access: UNKNOWN,
  season: UNKNOWN,
  addOns: [],
  style: '',
  palette: '',
  customPalette: null,
  materials: [],
  customMaterials: [],
  cladding: 'charcoal',
  roof: 'steel-black',
  pitch: 'classic',
  windowStyle: 'divided',
  doorColor: 'white',
  location: '',
  timeline: '',
  name: '',
  email: '',
  notes: '',
};

/** The fields we need before a brief is worth pricing. */
export const REQUIRED_FIELDS = ['buildType', 'sqft', 'finish'] as const;

export function isPriceable(brief: Brief) {
  return brief.buildType !== UNKNOWN && brief.sqft > 0 && brief.finish !== UNKNOWN;
}

/** Fill gaps with sensible defaults so a partial brief can still be drawn and priced. */
export function resolveBrief(brief: Brief) {
  const buildType = (brief.buildType === UNKNOWN ? 'cottage' : brief.buildType) as BuildTypeId;
  const type = BUILD_TYPES.find((t) => t.id === buildType)!;
  return {
    buildType,
    sqft: brief.sqft > 0 ? clamp(brief.sqft, type.min, type.max) : type.defaultSize,
    finish: (brief.finish === UNKNOWN ? 'crafted' : brief.finish) as FinishLevelId,
    access: (brief.access === UNKNOWN ? 'easy' : brief.access) as SiteAccessId,
    season: (brief.season === UNKNOWN ? 'four' : brief.season) as SeasonId,
    addOns: brief.addOns.filter((id) =>
      ADD_ONS.find((a) => a.id === id)?.appliesTo.includes(buildType)
    ),
    // Pricing region, guessed from whatever town/area the visitor typed —
    // the free-text `location` field itself stays untouched for display.
    // A visitor adjusting the Design Studio's own location picker directly
    // always wins over this guess; see Configurator's sync effect.
    region: guessLocationId(brief.location),
    style: brief.style ?? '',
    palette: brief.palette ?? '',
    customPalette: brief.customPalette ?? null,
    materials: brief.materials ?? [],
    customMaterials: brief.customMaterials ?? [],
    cladding: CLADDINGS.find((c) => c.id === brief.cladding) ?? CLADDINGS[0],
    roof: ROOFS.find((r) => r.id === brief.roof) ?? ROOFS[0],
    pitch: PITCHES.find((p) => p.id === brief.pitch) ?? PITCHES[1],
    windowStyle: WINDOW_STYLES.find((w) => w.id === brief.windowStyle) ?? WINDOW_STYLES[0],
    doorColor: DOOR_COLORS.find((d) => d.id === brief.doorColor) ?? DOOR_COLORS[0],
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/* ── The JSON schema the model is constrained to ──
   Structured outputs require `additionalProperties: false` on every object
   and every property listed in `required`. No min/max, no nullable. */

const ids = <T extends { id: string }>(xs: readonly T[]) => xs.map((x) => x.id);

export const BRIEF_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply: {
      type: 'string',
      description:
        'Your next message to the visitor. Warm, plain, one or two sentences. Ask at most one question.',
    },
    quickReplies: {
      type: 'array',
      description:
        'Two to four short tappable answers to your question (max 4 words each). Empty array if your message is not a question.',
      items: { type: 'string' },
    },
    brief: {
      type: 'object',
      additionalProperties: false,
      properties: {
        buildType: { type: 'string', enum: [...ids(BUILD_TYPES), UNKNOWN] },
        sqft: {
          type: 'integer',
          description: 'Approximate finished square footage. 0 if not established yet.',
        },
        finish: { type: 'string', enum: [...ids(FINISH_LEVELS), UNKNOWN] },
        access: { type: 'string', enum: [...ids(SITE_ACCESS), UNKNOWN] },
        season: { type: 'string', enum: [...SEASONS.map((s) => s.id), UNKNOWN] },
        addOns: { type: 'array', items: { type: 'string', enum: ids(ADD_ONS) } },
        cladding: { type: 'string', enum: ids(CLADDINGS) },
        roof: { type: 'string', enum: ids(ROOFS) },
        pitch: { type: 'string', enum: ids(PITCHES) },
        location: { type: 'string', description: 'Town or area. Empty string if unknown.' },
        timeline: { type: 'string', description: 'When they want to start. Empty string if unknown.' },
        name: { type: 'string', description: 'Empty string if not given.' },
        email: { type: 'string', description: 'Empty string if not given.' },
        notes: {
          type: 'string',
          description:
            'Everything they said that does not fit a field above, in their own words. Our team reads this.',
        },
      },
      required: [
        'buildType',
        'sqft',
        'finish',
        'access',
        'season',
        'addOns',
        'cladding',
        'roof',
        'pitch',
        'location',
        'timeline',
        'name',
        'email',
        'notes',
      ],
    },
    ready: {
      type: 'boolean',
      description:
        'True once buildType, sqft and finish are all established — the brief can then be priced and drawn.',
    },
  },
  required: ['reply', 'quickReplies', 'brief', 'ready'],
} as const;
