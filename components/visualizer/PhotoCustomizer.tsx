'use client';

import { useCallback, useRef, useState } from 'react';
import type { Brief, CustomMaterial, CustomPaletteColors } from '@/lib/brief';
import { resizeToDataUrl } from '@/lib/imageResize';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; dataUrl: string; observed: string }
  | { status: 'error'; reason: string; stage: string; detail?: string };

const MESSAGES: Record<string, string> = {
  no_api_key: 'Photo customising needs both an Anthropic and a Gemini API key on the server.',
  billing_required: 'Image generation is a paid Google model — the API key’s project needs billing enabled.',
  quota_exceeded: 'The image service is out of quota for now. Try again shortly.',
  throttled_locally: 'A few too many renders in the last minute — give it a moment.',
  bad_api_key: 'The AI service rejected the server’s API key.',
  model_unavailable: 'The configured image model isn’t available to this API key.',
  no_image: 'The image service declined that edit. Try describing it a different way.',
  refused: 'The AI declined to look at that photo. Try a different one.',
  truncated: 'That took longer to think through than expected. Try again.',
  no_photo: 'Add a photo first.',
  bad_photo_format: 'That file isn’t a JPEG, PNG or WEBP.',
  photo_too_large: 'That photo is too large — try a smaller one.',
  upstream_failed: 'Something went wrong generating that. Try again.',
};

const TERMINAL = ['no_api_key', 'billing_required', 'bad_api_key', 'model_unavailable', 'bad_photo_format'];

const MAX_FILE_BYTES = 15 * 1024 * 1024;

/**
 * Upload a real photo of your space, add rough dimensions and what you want
 * changed, and get it back edited — Claude reads the photo and your words
 * into one instruction, Gemini edits the actual photo with it.
 *
 * Nothing here is stored: the photo lives in the browser tab and in the one
 * request that generates the render, same as the rest of the Design Studio.
 */
export default function PhotoCustomizer({ brief }: { brief: Brief }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [ideas, setIdeas] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    if (!file.type.startsWith('image/')) {
      setFileError('That file isn’t an image.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError('That photo is too large — try one under 15 MB.');
      return;
    }
    try {
      const dataUrl = await resizeToDataUrl(file);
      setPhoto(dataUrl);
      setState({ status: 'idle' });
    } catch {
      setFileError('Couldn’t read that photo. Try a different file.');
    }
  }, []);

  async function generate() {
    if (!photo || state.status === 'loading') return;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          dimensions: { width: Number(width) || 0, depth: Number(depth) || 0 },
          ideas,
          photo: { dataUrl: photo },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.dataUrl) {
        setState({
          status: 'error',
          reason: data.error ?? 'upstream_failed',
          stage: data.stage ?? 'unknown',
          detail: data.detail,
        });
      } else {
        setState({ status: 'ready', dataUrl: data.dataUrl, observed: data.observed ?? '' });
        setCount((c) => c + 1);
      }
    } catch {
      setState({ status: 'error', reason: 'upstream_failed', stage: 'local' });
    }
  }

  return (
    <div className="border border-ink/15 bg-white/50 p-6">
      <p className="text-sm leading-relaxed text-ink/70">
        Upload a photo of the actual space, add rough dimensions and what you want changed, and get
        it back edited to match your style, palette and material choices above.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-2 text-ink/45">Your photo</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          {photo ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="group relative block aspect-[4/3] w-full overflow-hidden border border-ink/15"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- local data: URI preview */}
              <img src={photo} alt="Your uploaded photo" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 font-display text-[0.68rem] font-bold uppercase tracking-[0.14em] text-bone opacity-0 transition-all group-hover:bg-ink/50 group-hover:opacity-100">
                Change photo
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 text-center hover:border-ink/50"
            >
              <span className="font-display text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink/60">
                Upload a photo
              </span>
              <span className="text-xs text-ink/40">JPEG, PNG or WEBP</span>
            </button>
          )}
          {fileError && <p className="mt-2 text-xs text-red-700">{fileError}</p>}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Width (ft)" value={width} onChange={setWidth} />
            <NumberField label="Depth (ft)" value={depth} onChange={setDepth} />
          </div>
          <div>
            <label
              htmlFor="render-ideas"
              className="block font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/55"
            >
              What do you want changed?
            </label>
            <textarea
              id="render-ideas"
              value={ideas}
              onChange={(e) => setIdeas(e.target.value)}
              rows={4}
              placeholder="e.g. new cabinets, take this wall out, cedar ceiling instead of drywall…"
              className="mt-2 w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-sm leading-relaxed placeholder:text-ink/30 focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={!photo || state.status === 'loading' || count >= 4}
        className="btn-cedar mt-6 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state.status === 'loading'
          ? 'Reading your photo…'
          : count >= 4
            ? 'Regeneration limit reached'
            : count > 0
              ? 'Customize it again'
              : 'Customize this rendering'}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-ink/45">
        Your photo is sent to Anthropic and Google to generate this one edited image, then
        discarded — nothing is stored on the server.
      </p>

      {state.status === 'error' && (
        <div className="mt-5 border border-ink/15 bg-ink/5 p-4 text-sm text-ink/70">
          <p>{MESSAGES[state.reason] ?? 'Something went wrong. Try again.'}</p>
          {state.detail && <p className="mt-2 text-xs text-ink/40">{state.detail}</p>}
          {!TERMINAL.includes(state.reason) && (
            <button type="button" onClick={generate} className="btn-ghost-light mt-4 !px-4 !py-2 text-xs">
              Try again
            </button>
          )}
        </div>
      )}

      {state.status === 'ready' && (
        <div className="mt-6">
          <p className="eyebrow mb-3 text-ink/45">Before / after</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element -- local data: URI */}
              <img src={photo!} alt="Original photo" className="w-full border border-ink/12" />
              <p className="mt-1.5 text-center text-[0.65rem] uppercase tracking-[0.1em] text-ink/40">
                Your photo
              </p>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URI from the API response */}
              <img src={state.dataUrl} alt="AI-edited version of your photo" className="w-full border border-cedar" />
              <p className="mt-1.5 text-center text-[0.65rem] uppercase tracking-[0.1em] text-ink/40">
                Customized
              </p>
            </div>
          </div>

          {state.observed && (
            <p className="mt-4 text-xs leading-relaxed text-ink/50">
              <strong className="font-display uppercase tracking-wider text-ink/70">
                What we noticed —
              </strong>{' '}
              {state.observed}
            </p>
          )}

          <div className="mt-4 border border-cedar/40 bg-cedar/10 p-4 text-xs leading-relaxed text-ink/70">
            <strong className="font-display uppercase tracking-wider">Style reference —</strong> this
            is an AI edit of your photo, not a design, a plan, or something Ryan has priced. It
            exists to check we&rsquo;re picturing the same thing.
          </div>
        </div>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink/55">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="optional"
        className="mt-2 w-full border border-ink/20 bg-white/70 px-3 py-2.5 text-sm placeholder:text-ink/30 focus:border-ink focus:outline-none"
      />
    </div>
  );
}
