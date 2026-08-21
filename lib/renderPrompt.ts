/**
 * The "customize from your own photo" pipeline.
 *
 * Two different models, two different jobs, on purpose:
 *
 *   Claude looks at the photo and reads the visitor's words. It never
 *   generates a pixel — its only output is a JSON brief describing what's
 *   actually in the photo (materials, layout, fixed elements a render
 *   shouldn't invent away) and a single, specific instruction for an image
 *   model to follow. That's a language task, and Claude is already the
 *   language model this site uses everywhere else (the intake chat).
 *
 *   Gemini takes that instruction plus the original photo and edits it.
 *   Image generation is Gemini's job everywhere else on this site
 *   (StyleImage) — this reuses the same model, just with a reference image
 *   attached instead of a blank prompt.
 *
 * Same rule as the rest of the Design Studio: nothing here is invented by
 * a model without a deterministic anchor. The brief passed in (build type,
 * style, palette, materials) comes straight from the visitor's own choices
 * in the Configurator, and the dimensions and ideas are their own words.
 * Claude's job is to translate all of that into one good instruction, not
 * to decide what the project is.
 */

import { materialById } from '@/data/materials';
import { paletteById } from '@/data/palettes';
import { site } from '@/data/site';
import { styleById } from '@/data/styles';
import type { Brief } from '@/lib/brief';
import { BUILD_TYPES, FINISH_LEVELS } from '@/lib/estimate';

export interface PhotoDimensions {
  /** Feet. 0 means not given. */
  width: number;
  depth: number;
}

const SHOT =
  'Photographed like a real completed project, natural light, no people, no text or watermarks, no styling clutter. Canadian cottage-country craft.';

export const RENDER_SYSTEM = `You are helping ${site.name} turn a customer's own photo of their space into an edit instruction for an image-generation model.

You will be shown a photo of a real room or building exterior — always the first image — plus what the visitor typed: their rough dimensions and what they want changed. If the visitor attached reference photos of specific materials (a tile, a paint chip, a fabric), those come after the main photo, in order; the text will tell you how many there are and, if given, what each is called.

YOUR JOB
1. Look at the main photo. Note what's actually there and fixed — window and door positions, ceiling height, structural walls, the room's basic shape. An edited image that moves a window or changes the room's proportions looks wrong to the one person who knows the room best: the customer.
2. If material reference photos were attached, look at each and note what it actually shows — colour, texture, pattern.
3. Write ONE clear, specific instruction for an image-editing model, combining: what's fixed in the main photo, the dimensions given, the visitor's own words about what they want, the design choices supplied (style, palette, materials, finish level), and what to do with any attached material photos. The image model will see the same photos you do, in the same order — tell it explicitly to use the material shown in reference photo 2, 3, etc. where relevant, rather than only describing the material in words. Where the visitor's own words conflict with the supplied design choices, follow the visitor.
4. Keep the instruction concrete and visual — materials, colours, finishes — not abstract ("make it nicer"). If the visitor's request is vague, make reasonable, tasteful choices consistent with the supplied style/palette/materials rather than asking a follow-up question; this is a one-shot render, not a conversation.

Never invent a room layout that contradicts the main photo. Never add people. Never add text or watermarks.`;

export const RENDER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    observed: {
      type: 'string',
      description:
        'One or two plain sentences describing what is actually in the photo — materials, layout, fixed elements. Shown back to the visitor so they can see what was noticed.',
    },
    editPrompt: {
      type: 'string',
      description:
        'The single instruction handed to the image-editing model. Specific, visual, and respectful of what is fixed in the photo.',
    },
  },
  required: ['observed', 'editPrompt'],
} as const;

/** The user-turn text Claude sees alongside the photo. */
export function buildRenderUserText(brief: Brief, dimensions: PhotoDimensions, ideas: string): string {
  const parts: string[] = [];

  const type = BUILD_TYPES.find((t) => t.id === brief.buildType);
  if (type) parts.push(`Project type: ${type.label}.`);

  const finish = FINISH_LEVELS.find((f) => f.id === brief.finish);
  if (finish) parts.push(`Finish level: ${finish.label} — ${finish.blurb}`);

  if (dimensions.width > 0 && dimensions.depth > 0) {
    parts.push(`Approximate room dimensions: ${dimensions.width} ft by ${dimensions.depth} ft.`);
  }

  const style = styleById(brief.style);
  if (style) parts.push(`Style direction: ${style.promptFragment}.`);

  if (brief.customPalette) {
    const { dominant, secondary, accent } = brief.customPalette;
    parts.push(
      `The customer mixed their own colour palette — dominant ${dominant}, secondary ${secondary}, accent ${accent}. Use these hex values, not a preset palette.`
    );
  } else {
    const palette = paletteById(brief.palette);
    if (palette) parts.push(`Colour palette: ${palette.promptFragment}.`);
  }

  const materials = brief.materials.map((id) => materialById(id)).filter(Boolean);
  if (materials.length) {
    parts.push(`Materials to feature: ${materials.map((m) => m!.name.toLowerCase()).join(', ')}.`);
  }

  if (brief.customMaterials.length) {
    const named = brief.customMaterials.filter((m) => m.name).map((m) => m.name);
    parts.push(
      `${brief.customMaterials.length} material reference photo${
        brief.customMaterials.length > 1 ? 's are' : ' is'
      } attached after the main photo${named.length ? ` (${named.join(', ')})` : ''} — the image model will see these too, so tell it explicitly to use them.`
    );
  }

  parts.push(
    ideas.trim()
      ? `What the customer typed, in their own words: "${ideas.trim().slice(0, 600)}"`
      : 'The customer did not type anything specific — use the design choices above.'
  );

  return parts.join(' ');
}

/** Wraps Claude's edit instruction with the same house style/negative rules every render on this site follows. */
export function finalizeEditPrompt(editPrompt: string): string {
  return [
    editPrompt.trim(),
    SHOT,
    'Avoid: cream or beige walls, terracotta accents, mid-century modern furniture, rattan, macramé, potted fiddle-leaf figs, marble everywhere, gold fixtures, wide-angle distortion, text, watermarks, logos, people, pets.',
  ].join(' ');
}
