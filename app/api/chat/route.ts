import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { BRIEF_SCHEMA, EMPTY_BRIEF, type Brief } from '@/lib/brief';
import { ADD_ONS, BUILD_TYPES, FINISH_LEVELS, SITE_ACCESS } from '@/lib/estimate';
import { site } from '@/data/site';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-opus-5';

const SYSTEM = `You are the first point of contact on the website of ${site.name}, a design-build company led by ${site.owner.name}, founder and lead carpenter. You are talking to someone who is thinking about a build and landed on the site.

Your job is to have a short, warm conversation and come away with enough to draw their project and put a planning range on it. You are not a salesperson and you are not a receptionist reading a form out loud.

WHAT YOU NEED
Three things make a brief useful: what they're building, roughly how big, and how far they want to take the finish. Everything else — site access, season of use, cladding, roof, add-ons, location, timeline, name, email — is a bonus. Collect it if it comes up naturally. Do not interrogate.

HOW TO TALK
- One question at a time. Never stack two questions in one message.
- One or two sentences. This is a chat window, not a letter.
- Plain language. "How big, roughly?" not "What is your approximate square footage requirement?"
- If they don't know a number, help them find one by comparison: a single garage is about 250 sq ft, a generous bedroom about 150, a typical cottage 1,000 to 1,600.
- Read what they've already told you. Never ask again for something they've said.
- If they describe something you can infer, infer it. "A little cabin by the lake for guests" is a tiny home, not a question.
- Match their energy. Someone who writes three words gets short replies back.

WHAT YOU MUST NOT DO
- Never quote a price, a per-square-foot figure, or a timeline for the build. You do not have those numbers. The site calculates a planning range from the brief once you have the three essentials, and it appears on its own.
- Never promise what our team will do, when we can start, or that we'll take the job.
- Never claim the estimate is a quote.
- Don't ask for a phone number or an address. Email is enough, and only if they offer or you're wrapping up.

FILLING IN THE BRIEF
Update the brief object with everything established so far — carry forward what you already had, don't blank fields out. Use 'unknown' and empty strings for what you genuinely don't know yet. Put anything they said that doesn't fit a field into notes, in their own words: that's what our team reads first.

Set ready to true as soon as buildType, sqft and finish are all established. The moment you do, the visitor sees a drawing of their project, a reference number, and a planning range. So when you set ready, say something that hands off to that — tell them it's below and offer to keep adjusting.

Build types: ${BUILD_TYPES.map((b) => `${b.id} (${b.label})`).join(', ')}.
Finish levels: ${FINISH_LEVELS.map((f) => `${f.id} — ${f.blurb}`).join(' ')}
Site access: ${SITE_ACCESS.map((a) => `${a.id} — ${a.blurb}`).join(' ')}
Add-ons: ${ADD_ONS.map((a) => `${a.id} (${a.label})`).join(', ')}.

Give two to four quickReplies whenever your message is a question and the answers are predictable. Leave the array empty for open questions like "tell me about the space".`;

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured — the client falls back to its scripted flow, which
  // collects the same brief without an API call.
  if (!apiKey) {
    return NextResponse.json(
      { error: 'no_api_key', message: 'ANTHROPIC_API_KEY is not set on the server.' },
      { status: 503 }
    );
  }

  let body: { messages?: ChatTurn[]; brief?: Brief };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
  );
  if (messages.length === 0) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // Cap the history so a long session can't run up an unbounded bill.
  const trimmed = messages.slice(-24);
  const brief = body.brief ?? EMPTY_BRIEF;

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      // Thinking is on by default on this model and max_tokens caps thinking +
      // output together. The JSON we want back is small; the headroom is here
      // so a thinking-heavy turn can't truncate it into unparseable JSON.
      max_tokens: 8192,
      system: `${SYSTEM}\n\nBRIEF ESTABLISHED SO FAR\nCarry these values forward unless the visitor changes them:\n${JSON.stringify(
        brief
      )}`,
      // Intake extraction is a light task — low effort keeps replies snappy.
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: BRIEF_SCHEMA as unknown as Record<string, unknown> },
      },
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    // Check stop_reason before reading content — on a refusal it may be empty.
    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'refused' }, { status: 502 });
    }
    if (response.stop_reason === 'max_tokens') {
      return NextResponse.json({ error: 'truncated' }, { status: 502 });
    }

    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') {
      return NextResponse.json({ error: 'empty_response' }, { status: 502 });
    }

    try {
      return NextResponse.json(JSON.parse(text.text));
    } catch {
      return NextResponse.json({ error: 'unparseable' }, { status: 502 });
    }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'bad_api_key' }, { status: 503 });
    }
    console.error('[chat] request failed', error);
    return NextResponse.json({ error: 'upstream_failed' }, { status: 502 });
  }
}
