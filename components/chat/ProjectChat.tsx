'use client';

import { useEffect, useRef, useState } from 'react';
import BriefCard from '@/components/chat/BriefCard';
import { EMPTY_BRIEF, UNKNOWN, isPriceable, type Brief } from '@/lib/brief';
import { BUILD_TYPES, FINISH_LEVELS, SITE_ACCESS } from '@/lib/estimate';
import { makeProjectId } from '@/lib/projectId';
import { site } from '@/data/site';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

const OPENING =
  "Hi — I'm here to take down what you're thinking about building. Tell me about it in your own words, or pick one below to get started.";

const OPENING_CHIPS = ['A cottage', 'A tiny home or bunkie', 'A sauna', 'Renovating a room'];

/**
 * Conversational intake.
 *
 * Two modes, decided by the server:
 *   live    — the /api/chat route has an ANTHROPIC_API_KEY and Claude drives
 *             the conversation, understanding free text.
 *   guided  — no key configured, or the API is unreachable. Falls back to a
 *             scripted question flow that collects the same brief. The page
 *             keeps working; it just stops understanding free-form answers.
 */
export default function ProjectChat() {
  const [turns, setTurns] = useState<Turn[]>([{ role: 'assistant', content: OPENING }]);
  const [chips, setChips] = useState<string[]>(OPENING_CHIPS);
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [guided, setGuided] = useState(false);
  const [guidedStep, setGuidedStep] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view without yanking the whole page around.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [turns, busy, projectId]);

  // Mint the reference the first time the brief becomes priceable.
  useEffect(() => {
    if (!projectId && isPriceable(brief)) {
      setProjectId(makeProjectId(JSON.stringify(brief)));
    }
  }, [brief, projectId]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;

    const next: Turn[] = [...turns, { role: 'user', content: message }];
    setTurns(next);
    setInput('');
    setChips([]);
    setBusy(true);

    if (guided) {
      runGuidedStep(message, next);
      setBusy(false);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, brief }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'unknown' }));
        switchToGuided(error, next);
        return;
      }

      const data = await res.json();
      setTurns([...next, { role: 'assistant', content: data.reply }]);
      setChips(Array.isArray(data.quickReplies) ? data.quickReplies.slice(0, 4) : []);
      if (data.brief) setBrief((prev) => ({ ...prev, ...data.brief }));
    } catch {
      switchToGuided('offline', next);
    } finally {
      setBusy(false);
    }
  }

  function switchToGuided(reason: string, history: Turn[]) {
    setGuided(true);
    setGuidedStep(0);
    setNotice(
      reason === 'no_api_key' || reason === 'bad_api_key'
        ? 'Running in guided mode — the conversational assistant needs an API key on the server. Everything below still works.'
        : 'The assistant is unavailable right now, so we switched to a few quick questions instead.'
    );
    const first = GUIDED[0];
    setTurns([...history, { role: 'assistant', content: first.question }]);
    setChips(first.options.map((o) => o.label));
    setBusy(false);
  }

  /** Deterministic fallback: walk the scripted questions, matching answers by label. */
  function runGuidedStep(answer: string, history: Turn[]) {
    const step = GUIDED[guidedStep];
    if (step) {
      const match =
        step.options.find((o) => o.label.toLowerCase() === answer.toLowerCase()) ??
        step.options.find((o) => answer.toLowerCase().includes(o.label.toLowerCase().split(' ')[0]));
      if (match) setBrief((prev) => step.apply(prev, match.value));
      else if (step.freeform) setBrief((prev) => step.freeform!(prev, answer));
    }

    const nextIndex = guidedStep + 1;
    setGuidedStep(nextIndex);
    const next = GUIDED[nextIndex];

    if (next) {
      setTurns([...history, { role: 'assistant', content: next.question }]);
      setChips(next.options.map((o) => o.label));
    } else {
      setTurns([
        ...history,
        {
          role: 'assistant',
          content:
            "That's everything I need. Your reference, a sketch and a planning range are below — send it over to Ryan whenever you're ready.",
        },
      ]);
      setChips([]);
    }
  }

  const ready = projectId !== null && isPriceable(brief);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      {/* ── Conversation ── */}
      <div className="flex min-h-[32rem] flex-col border border-ink/15 bg-white/60 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
        <header className="flex items-center gap-3 border-b border-ink/12 px-5 py-4">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping bg-cedar opacity-60" />
            <span className="relative inline-flex h-2 w-2 bg-cedar" />
          </span>
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em]">
            Project intake
          </p>
          <span className="ml-auto text-xs text-ink/40">{guided ? 'Guided' : 'Live'}</span>
        </header>

        {notice && (
          <p className="border-b border-cedar/40 bg-cedar/10 px-5 py-3 text-xs leading-relaxed text-ink/70">
            {notice}
          </p>
        )}

        <div
          ref={logRef}
          className="flex-1 space-y-4 overflow-y-auto p-5"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {turns.map((turn, i) => (
            <div
              key={i}
              className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <p
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                  turn.role === 'user'
                    ? 'bg-ink text-bone'
                    : 'border border-ink/12 bg-white/80 text-ink/85'
                }`}
              >
                {turn.content}
              </p>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <p className="flex gap-1.5 border border-ink/12 bg-white/80 px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce bg-ink/40"
                    style={{ animationDelay: `${i * 130}ms` }}
                  />
                ))}
                <span className="sr-only">Thinking</span>
              </p>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-ink/12 px-5 py-3">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                disabled={busy}
                className="border border-ink/20 px-3 py-1.5 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-bone disabled:opacity-40"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 border-t border-ink/12 p-4"
        >
          <label htmlFor="chat-input" className="sr-only">
            Your message
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us what you're thinking…"
            autoComplete="off"
            className="flex-1 border border-ink/20 bg-white/70 px-4 py-3 text-sm placeholder:text-ink/30 focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn-primary !px-5 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>

      {/* ── Deliverable ── */}
      <div>
        {ready ? (
          <BriefCard brief={brief} projectId={projectId!} />
        ) : (
          <div className="border border-dashed border-ink/20 bg-white/40 p-8">
            <p className="eyebrow text-ink/40">Your project</p>
            <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-[-0.01em] text-ink/50">
              Nothing to draw yet
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              Once we know what you&rsquo;re building, roughly how big, and how far you want to take
              the finish, a sketch of your project appears here — along with a reference number and
              an honest planning range.
            </p>
            <ol className="mt-8 space-y-4">
              {[
                { k: 'What', v: 'Cottage, tiny home, sauna, kitchen, bath or renovation' },
                { k: 'How big', v: 'A rough square footage — we can work it out together' },
                { k: 'How far', v: 'Essential, crafted, or heirloom' },
              ].map((item, i) => {
                const done =
                  (i === 0 && brief.buildType !== UNKNOWN) ||
                  (i === 1 && brief.sqft > 0) ||
                  (i === 2 && brief.finish !== UNKNOWN);
                return (
                  <li key={item.k} className="flex gap-4">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[0.65rem] ${
                        done ? 'border-cedar bg-cedar text-ink' : 'border-ink/25 text-ink/30'
                      }`}
                      aria-hidden="true"
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <span>
                      <span
                        className={`block font-display text-[0.72rem] font-bold uppercase tracking-[0.1em] ${
                          done ? 'text-ink' : 'text-ink/50'
                        }`}
                      >
                        {item.k}
                      </span>
                      <span className="mt-1 block text-xs leading-snug text-ink/50">{item.v}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-8 border-t border-ink/12 pt-6 text-xs leading-relaxed text-ink/45">
              Would rather not chat? Email{' '}
              <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                {site.email}
              </a>{' '}
              or use the{' '}
              <a href="/visualizer" className="underline underline-offset-2">
                Design Studio
              </a>{' '}
              directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Guided fallback script ──
   Collects the same three essentials plus the useful extras, with no API call.
   Only reached when the server has no API key or the request fails. */

interface GuidedStep {
  question: string;
  options: { label: string; value: string }[];
  apply: (brief: Brief, value: string) => Brief;
  freeform?: (brief: Brief, answer: string) => Brief;
}

const GUIDED: GuidedStep[] = [
  {
    question: 'What are you looking to build?',
    options: BUILD_TYPES.map((t) => ({ label: t.label, value: t.id })),
    apply: (b, v) => ({ ...b, buildType: v as Brief['buildType'] }),
  },
  {
    question: 'Roughly how big? A ballpark is fine — pick the closest.',
    options: [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' },
    ],
    apply: (b, v) => {
      const type = BUILD_TYPES.find((t) => t.id === b.buildType) ?? BUILD_TYPES[0];
      const span = type.max - type.min;
      const sqft =
        v === 'small'
          ? Math.round(type.min + span * 0.15)
          : v === 'large'
            ? Math.round(type.min + span * 0.75)
            : type.defaultSize;
      return { ...b, sqft };
    },
    freeform: (b, answer) => {
      const n = Number(answer.replace(/[^0-9]/g, ''));
      return n > 0 ? { ...b, sqft: n } : b;
    },
  },
  {
    question: 'How far do you want to take the finish?',
    options: FINISH_LEVELS.map((f) => ({ label: f.label, value: f.id })),
    apply: (b, v) => ({ ...b, finish: v as Brief['finish'] }),
  },
  {
    question: 'What is the site like to get to?',
    options: SITE_ACCESS.map((a) => ({ label: a.label, value: a.id })),
    apply: (b, v) => ({ ...b, access: v as Brief['access'] }),
  },
  {
    question: 'Last one — roughly when would you want to start?',
    options: [
      { label: 'As soon as possible', value: 'asap' },
      { label: 'Within 6 months', value: '6mo' },
      { label: 'Next year', value: 'next-year' },
      { label: 'Just exploring', value: 'exploring' },
    ],
    apply: (b, v) => ({ ...b, timeline: v }),
    freeform: (b, answer) => ({ ...b, timeline: answer }),
  },
];
