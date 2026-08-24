'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { captionFor } from '@/lib/imagePrompt';
import { isPriceable, type Brief } from '@/lib/brief';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; dataUrl: string }
  | { status: 'error'; reason: string; detail?: string };

const MESSAGES: Record<string, string> = {
  no_api_key: 'Style images need a Gemini API key on the server. Everything else still works.',
  billing_required:
    'Image generation is a paid Google model — the API key’s project needs billing enabled.',
  quota_exceeded: 'The image service is out of quota for now. Try again shortly.',
  throttled_locally: 'A few too many images in the last minute — give it a moment.',
  bad_api_key: 'The image service rejected the server’s API key.',
  model_unavailable: 'The configured image model isn’t available to this API key.',
  brief_incomplete: 'Tell us a bit more first and we can draw it.',
  no_image: 'The image service declined that one. Try rewording what you described.',
};

/** Reasons the visitor can't fix by retrying. */
const TERMINAL = ['no_api_key', 'billing_required', 'bad_api_key', 'model_unavailable'];

/**
 * The AI-generated style reference.
 *
 * IMPORTANT — the disclaimer under this image is not decoration. A photoreal
 * image produced by a *builder's* site reads to a prospect as "this is what
 * I'm getting". It is a style reference generated from their own words, not a
 * design, not a plan, and not something Ryan has quoted. Do not remove or
 * soften the caption.
 */
export default function StyleImage({
  brief,
  auto = true,
  className = '',
}: {
  brief: Brief;
  /** Generate as soon as the brief is complete enough. */
  auto?: boolean;
  className?: string;
}) {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [count, setCount] = useState(0);
  const inFlight = useRef(false);

  const generate = useCallback(async () => {
    if (inFlight.current || !isPriceable(brief)) return;
    inFlight.current = true;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.dataUrl) {
        setState({ status: 'error', reason: data.error ?? 'upstream_failed', detail: data.detail });
      } else {
        setState({ status: 'ready', dataUrl: data.dataUrl });
        setCount((c) => c + 1);
      }
    } catch {
      setState({ status: 'error', reason: 'offline' });
    } finally {
      inFlight.current = false;
    }
  }, [brief]);

  // Generate once when the brief first becomes complete. Deliberately not
  // re-run on every brief change — each call costs money.
  useEffect(() => {
    if (auto && state.status === 'idle' && isPriceable(brief)) generate();
  }, [auto, brief, generate, state.status]);

  if (!isPriceable(brief)) return null;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative flex min-h-[12rem] items-center justify-center overflow-hidden bg-ink">
        {state.status === 'loading' && (
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <span className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce bg-cedar"
                  style={{ animationDelay: `${i * 130}ms` }}
                />
              ))}
            </span>
            <p className="font-display text-[0.68rem] uppercase tracking-[0.16em] text-bone/50">
              Drawing your {captionFor(brief).split(' · ')[0].toLowerCase()}…
            </p>
            <p className="text-xs text-bone/35">This takes a few seconds.</p>
          </div>
        )}

        {state.status === 'idle' && !auto && (
          <div className="px-6 py-14 text-center">
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-bone/55">
              A photoreal AI image of this exact configuration — cladding, roof, style, the lot.
            </p>
            <button type="button" onClick={generate} className="btn-cedar mt-5 !px-6 !py-2.5">
              Generate a rendering
            </button>
          </div>
        )}

        {state.status === 'ready' && (
          // eslint-disable-next-line @next/next/no-img-element -- data: URI, nothing for the optimizer to do
          <img
            src={state.dataUrl}
            alt={`AI-generated style reference: ${captionFor(brief)}`}
            className="h-auto w-full"
          />
        )}

        {state.status === 'error' && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm leading-relaxed text-bone/60">
              {MESSAGES[state.reason] ?? 'The style image could not be generated just now.'}
            </p>
            {/* Surface the upstream reason so a misconfiguration is diagnosable
                without digging through server logs. Google's own wording. */}
            {state.detail && (
              <p className="mx-auto mt-3 max-w-sm break-words text-[0.7rem] leading-relaxed text-bone/35">
                {state.detail}
              </p>
            )}
            {!TERMINAL.includes(state.reason) && (
              <button
                type="button"
                onClick={generate}
                className="btn-ghost-dark mt-5 !px-5 !py-2.5"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>

      <figcaption className="border-t border-cedar/40 bg-cedar/10 px-5 py-3">
        <p className="text-xs leading-relaxed text-ink/70">
          <strong className="font-display uppercase tracking-wider">Style reference —</strong> this
          image was generated by AI from what you described. It is not a design, not a plan, and not
          something we&rsquo;ve priced. It exists to check we&rsquo;re picturing the same thing.
        </p>
        {state.status === 'ready' && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={count >= 4}
              className="border border-ink/25 px-3 py-1.5 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
            >
              {count >= 4 ? 'Regeneration limit reached' : 'Show me another'}
            </button>
            <span className="text-[0.7rem] text-ink/40">{captionFor(brief)}</span>
          </div>
        )}
      </figcaption>
    </figure>
  );
}
