import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { EMPTY_BRIEF, isPriceable, type Brief } from '@/lib/brief';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_B64_LEN, parseImageDataUrl } from '@/lib/dataUrl';
import { aspectFor, buildImagePrompt } from '@/lib/imagePrompt';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * The model is chosen HERE, in code — not in Google AI Studio. An API key is
 * not bound to a model; AI Studio just issues the key.
 *
 * Default is Nano Banana Pro: top-ranked for architectural visualisation,
 * ~$0.13 per image at 1–2K. Set GEMINI_IMAGE_MODEL to override without a
 * code change — e.g. 'gemini-3.1-flash-image' (~$0.05, faster, weaker on
 * interiors).
 *
 * Do NOT switch this to Imagen 4: those models were shut down 2026-08-17.
 */
const MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3-pro-image';

/**
 * Crude per-instance throttle. Image calls cost real money, and the endpoint
 * is public — without this, one script can run up a bill. Resets whenever the
 * serverless instance recycles, which is fine for the scale this site runs at;
 * put a real rate limiter in front if traffic ever justifies it.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits: number[] = [];

function overLimit() {
  const now = Date.now();
  while (hits.length && now - hits[0] > WINDOW_MS) hits.shift();
  if (hits.length >= MAX_PER_WINDOW) return true;
  hits.push(now);
  return false;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'no_api_key', message: 'GEMINI_API_KEY is not set on the server.' },
      { status: 503 }
    );
  }

  // Our own throttle, not Google's — kept distinct so the two are never
  // confused when diagnosing a failure.
  if (overLimit()) {
    return NextResponse.json({ error: 'throttled_locally' }, { status: 429 });
  }

  let body: { brief?: Brief };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const brief: Brief = { ...EMPTY_BRIEF, ...(body.brief ?? {}) };

  // Nothing worth rendering until we know what it is and roughly how big.
  if (!isPriceable(brief)) {
    return NextResponse.json({ error: 'brief_incomplete' }, { status: 400 });
  }

  const prompt = buildImagePrompt(brief);

  // Custom material reference photos, if the visitor dropped any in. A bad
  // or oversized one is silently dropped rather than failing the whole
  // request — the render still works from the text prompt alone.
  const customMaterialImages = (brief.customMaterials ?? [])
    .slice(0, 3)
    .map((m) => parseImageDataUrl(m.dataUrl))
    .filter(
      (p): p is NonNullable<typeof p> =>
        !!p && p.data.length <= MAX_IMAGE_B64_LEN && ACCEPTED_IMAGE_MIME_TYPES.has(p.mimeType)
    );

  try {
    const ai = new GoogleGenAI({ apiKey });
    const interaction = await ai.interactions.create({
      model: MODEL,
      // Plain text when there's nothing to attach — keeps the common case
      // identical to before this feature existed. Reference images only
      // when the visitor actually dropped a material photo in.
      input: customMaterialImages.length
        ? [
            ...customMaterialImages.map((m) => ({
              type: 'image' as const,
              data: m.data,
              mime_type: m.mimeType,
            })),
            {
              type: 'text' as const,
              text: `${prompt} The client attached ${customMaterialImages.length} reference photo${
                customMaterialImages.length > 1 ? 's' : ''
              } of material${customMaterialImages.length > 1 ? 's' : ''} they want used — match what is shown in those photos as closely as possible.`,
            },
          ]
        : prompt,
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: aspectFor(brief),
        image_size: '1K',
      },
    });

    const image = interaction.output_image;
    if (!image?.data) {
      // Most often a safety block — the model returns text instead of an image.
      return NextResponse.json(
        { error: 'no_image', message: interaction.output_text?.slice(0, 200) ?? null },
        { status: 502 }
      );
    }

    return NextResponse.json({
      dataUrl: `data:${image.mime_type ?? 'image/jpeg'};base64,${image.data}`,
      prompt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[image] generation failed', error);

    // Pass the upstream reason through. Google's quota errors and its
    // billing-not-enabled errors are both 429-shaped, so collapsing them into
    // one generic code makes the real cause impossible to see from the client.
    // The message is Google's own text — it carries no key material.
    const detail = message.slice(0, 300);

    if (/billing|not enabled|free tier|FAILED_PRECONDITION/i.test(message)) {
      return NextResponse.json({ error: 'billing_required', detail }, { status: 402 });
    }
    if (/quota|RESOURCE_EXHAUSTED|429/i.test(message)) {
      return NextResponse.json({ error: 'quota_exceeded', detail }, { status: 429 });
    }
    if (/api[_ ]?key|401|403|PERMISSION_DENIED|UNAUTHENTICATED/i.test(message)) {
      return NextResponse.json({ error: 'bad_api_key', detail }, { status: 503 });
    }
    if (/not found|NOT_FOUND|unsupported|invalid model/i.test(message)) {
      return NextResponse.json({ error: 'model_unavailable', detail, model: MODEL }, { status: 502 });
    }
    return NextResponse.json({ error: 'upstream_failed', detail }, { status: 502 });
  }
}
