import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { EMPTY_BRIEF, type Brief } from '@/lib/brief';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_B64_LEN, parseImageDataUrl } from '@/lib/dataUrl';
import {
  RENDER_SCHEMA,
  RENDER_SYSTEM,
  buildRenderUserText,
  finalizeEditPrompt,
  type PhotoDimensions,
} from '@/lib/renderPrompt';

export const runtime = 'nodejs';
export const maxDuration = 120;

const CLAUDE_MODEL = 'claude-opus-5';
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3-pro-image';

/**
 * Two calls, real money on both — a tighter throttle than the text-only
 * chat endpoint or the prompt-only image endpoint.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;
const hits: number[] = [];

function overLimit() {
  const now = Date.now();
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  if (hits.length >= MAX_PER_WINDOW) return true;
  hits.push(now);
  return false;
}

export async function POST(request: Request) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!anthropicKey) {
    return NextResponse.json(
      { error: 'no_api_key', stage: 'claude', message: 'ANTHROPIC_API_KEY is not set on the server.' },
      { status: 503 }
    );
  }
  if (!geminiKey) {
    return NextResponse.json(
      { error: 'no_api_key', stage: 'gemini', message: 'GEMINI_API_KEY is not set on the server.' },
      { status: 503 }
    );
  }

  if (overLimit()) {
    return NextResponse.json({ error: 'throttled_locally', stage: 'local' }, { status: 429 });
  }

  let body: {
    brief?: Brief;
    dimensions?: PhotoDimensions;
    ideas?: string;
    photo?: { dataUrl?: string };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', stage: 'local' }, { status: 400 });
  }

  const dataUrl = body.photo?.dataUrl;
  if (!dataUrl || typeof dataUrl !== 'string') {
    return NextResponse.json({ error: 'no_photo', stage: 'local' }, { status: 400 });
  }

  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) {
    return NextResponse.json({ error: 'bad_photo_format', stage: 'local' }, { status: 400 });
  }
  if (parsed.data.length > MAX_IMAGE_B64_LEN) {
    return NextResponse.json({ error: 'photo_too_large', stage: 'local' }, { status: 413 });
  }
  if (!ACCEPTED_IMAGE_MIME_TYPES.has(parsed.mimeType)) {
    return NextResponse.json({ error: 'bad_photo_format', stage: 'local' }, { status: 400 });
  }

  const brief: Brief = { ...EMPTY_BRIEF, ...(body.brief ?? {}) };
  const dimensions: PhotoDimensions = {
    width: Number(body.dimensions?.width) || 0,
    depth: Number(body.dimensions?.depth) || 0,
  };
  const ideas = typeof body.ideas === 'string' ? body.ideas : '';

  // Custom material reference photos — parsed and capped the same way as the
  // main photo. A bad or oversized one is dropped rather than failing the
  // whole request; the render still works without it.
  const customMaterialImages = (brief.customMaterials ?? [])
    .slice(0, 3)
    .map((m) => parseImageDataUrl(m.dataUrl))
    .filter((p): p is NonNullable<typeof p> => !!p && p.data.length <= MAX_IMAGE_B64_LEN && ACCEPTED_IMAGE_MIME_TYPES.has(p.mimeType));

  // ── Step 1: Claude looks at the photo, reads the brief, writes one edit instruction ──
  let observed: string;
  let editPrompt: string;
  try {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      // Thinking is on by default on this model and max_tokens caps thinking +
      // output together (same note as /api/chat) — the JSON we want back is
      // small, but the headroom needs to survive a thinking-heavy turn.
      max_tokens: 4096,
      system: RENDER_SYSTEM,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: RENDER_SCHEMA as unknown as Record<string, unknown> },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: parsed.mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
                data: parsed.data,
              },
            },
            ...customMaterialImages.map((m) => ({
              type: 'image' as const,
              source: {
                type: 'base64' as const,
                media_type: m.mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
                data: m.data,
              },
            })),
            { type: 'text', text: buildRenderUserText(brief, dimensions, ideas) },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'refused', stage: 'claude' }, { status: 502 });
    }
    if (response.stop_reason === 'max_tokens') {
      return NextResponse.json({ error: 'truncated', stage: 'claude' }, { status: 502 });
    }
    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') {
      return NextResponse.json({ error: 'empty_response', stage: 'claude' }, { status: 502 });
    }
    const json = JSON.parse(text.text);
    observed = String(json.observed ?? '');
    editPrompt = String(json.editPrompt ?? '');
    if (!editPrompt) {
      return NextResponse.json({ error: 'empty_response', stage: 'claude' }, { status: 502 });
    }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'rate_limited', stage: 'claude' }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'bad_api_key', stage: 'claude' }, { status: 503 });
    }
    console.error('[render] Claude analysis failed', error);
    return NextResponse.json({ error: 'upstream_failed', stage: 'claude' }, { status: 502 });
  }

  // ── Step 2: Gemini edits the photo using Claude's instruction ──
  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const interaction = await ai.interactions.create({
      model: IMAGE_MODEL,
      input: [
        { type: 'image', data: parsed.data, mime_type: parsed.mimeType },
        ...customMaterialImages.map((m) => ({
          type: 'image' as const,
          data: m.data,
          mime_type: m.mimeType,
        })),
        { type: 'text', text: finalizeEditPrompt(editPrompt) },
      ],
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        image_size: '1K',
      },
    });

    const image = interaction.output_image;
    if (!image?.data) {
      return NextResponse.json(
        { error: 'no_image', stage: 'gemini', message: interaction.output_text?.slice(0, 200) ?? null },
        { status: 502 }
      );
    }

    return NextResponse.json({
      dataUrl: `data:${image.mime_type ?? 'image/jpeg'};base64,${image.data}`,
      observed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[render] Gemini edit failed', error);
    const detail = message.slice(0, 300);

    if (/billing|not enabled|free tier|FAILED_PRECONDITION/i.test(message)) {
      return NextResponse.json({ error: 'billing_required', stage: 'gemini', detail }, { status: 402 });
    }
    if (/quota|RESOURCE_EXHAUSTED|429/i.test(message)) {
      return NextResponse.json({ error: 'quota_exceeded', stage: 'gemini', detail }, { status: 429 });
    }
    if (/api[_ ]?key|401|403|PERMISSION_DENIED|UNAUTHENTICATED/i.test(message)) {
      return NextResponse.json({ error: 'bad_api_key', stage: 'gemini', detail }, { status: 503 });
    }
    if (/not found|NOT_FOUND|unsupported|invalid model/i.test(message)) {
      return NextResponse.json(
        { error: 'model_unavailable', stage: 'gemini', detail, model: IMAGE_MODEL },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: 'upstream_failed', stage: 'gemini', detail }, { status: 502 });
  }
}
