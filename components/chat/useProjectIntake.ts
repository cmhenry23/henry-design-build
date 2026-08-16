'use client';

import { useCallback, useEffect, useState } from 'react';
import { EMPTY_BRIEF, isPriceable, type Brief } from '@/lib/brief';
import { BUILD_TYPES, FINISH_LEVELS, SITE_ACCESS } from '@/lib/estimate';
import { makeProjectId } from '@/lib/projectId';

export interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

export const OPENING =
  "Hi — I'm here to take down what you're thinking about building. Tell me about it in your own words, or pick one below to get started.";

const OPENING_CHIPS = ['A cottage', 'A tiny home or bunkie', 'A sauna', 'Renovating a room'];

/**
 * All the intake conversation state and logic, in one place.
 *
 * The launcher panel and the /start page both drive this hook, so the two
 * surfaces behave identically — including the guided fallback, which runs
 * whenever the API is unavailable for any reason.
 */
export function useProjectIntake() {
  const [turns, setTurns] = useState<Turn[]>([{ role: 'assistant', content: OPENING }]);
  const [chips, setChips] = useState<string[]>(OPENING_CHIPS);
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [guided, setGuided] = useState(false);
  const [guidedStep, setGuidedStep] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  /**
   * `ready` means the brief can be priced. `complete` means the conversation
   * has actually wrapped up. They are different moments — in the guided script
   * the brief is priceable after three answers but two questions remain — and
   * conflating them makes the panel jump to the overview mid-sentence.
   */
  const [complete, setComplete] = useState(false);

  // Mint the reference the first time the brief becomes priceable.
  useEffect(() => {
    if (!projectId && isPriceable(brief)) {
      setProjectId(makeProjectId(JSON.stringify(brief)));
    }
  }, [brief, projectId]);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || busy) return;

      const next: Turn[] = [...turns, { role: 'user', content: message }];
      setTurns(next);
      setChips([]);
      setBusy(true);

      const toGuided = (reason: string) => {
        setGuided(true);
        setGuidedStep(0);
        setNotice(
          reason === 'no_api_key' || reason === 'bad_api_key'
            ? 'Running in guided mode — the conversational assistant needs an API key on the server. Everything else still works.'
            : 'The assistant is unavailable right now, so we switched to a few quick questions instead.'
        );
        setTurns([...next, { role: 'assistant', content: GUIDED[0].question }]);
        setChips(GUIDED[0].options.map((o) => o.label));
      };

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
          toGuided(error);
          return;
        }

        const data = await res.json();
        setTurns([...next, { role: 'assistant', content: data.reply }]);
        setChips(Array.isArray(data.quickReplies) ? data.quickReplies.slice(0, 4) : []);
        if (data.brief) setBrief((prev) => ({ ...prev, ...data.brief }));
        // The model tells us when it has what it needs and has handed off.
        if (data.ready === true) setComplete(true);
      } catch {
        toGuided('offline');
      } finally {
        setBusy(false);
      }

      function runGuidedStep(answer: string, history: Turn[]) {
        const step = GUIDED[guidedStep];
        if (step) {
          const match =
            step.options.find((o) => o.label.toLowerCase() === answer.toLowerCase()) ??
            step.options.find((o) =>
              answer.toLowerCase().includes(o.label.toLowerCase().split(' ')[0])
            );
          if (match) setBrief((prev) => step.apply(prev, match.value));
          else if (step.freeform) setBrief((prev) => step.freeform!(prev, answer));
        }

        const nextIndex = guidedStep + 1;
        setGuidedStep(nextIndex);
        const upcoming = GUIDED[nextIndex];

        if (upcoming) {
          setTurns([...history, { role: 'assistant', content: upcoming.question }]);
          setChips(upcoming.options.map((o) => o.label));
        } else {
          setTurns([
            ...history,
            {
              role: 'assistant',
              content:
                "That's everything I need. Your project overview and planning range are ready — send them over to Ryan whenever you like.",
            },
          ]);
          setChips([]);
          setComplete(true);
        }
      }
    },
    [brief, busy, guided, guidedStep, turns]
  );

  /** Single-select boards. Tapping the current pick clears it. */
  const selectStyle = useCallback((id: string) => {
    setBrief((prev) => ({ ...prev, style: prev.style === id ? '' : id }));
  }, []);

  const selectPalette = useCallback((id: string) => {
    setBrief((prev) => ({ ...prev, palette: prev.palette === id ? '' : id }));
  }, []);

  /** Visitor tapped a material tile. Not model-driven — this is their choice. */
  const toggleMaterial = useCallback((id: string) => {
    setBrief((prev) => ({
      ...prev,
      materials: prev.materials.includes(id)
        ? prev.materials.filter((m) => m !== id)
        : [...prev.materials, id],
    }));
  }, []);

  const reset = useCallback(() => {
    setTurns([{ role: 'assistant', content: OPENING }]);
    setChips(OPENING_CHIPS);
    setBrief(EMPTY_BRIEF);
    setProjectId(null);
    setGuided(false);
    setGuidedStep(0);
    setNotice(null);
    setBusy(false);
    setComplete(false);
  }, []);

  return {
    turns,
    chips,
    brief,
    projectId,
    busy,
    guided,
    notice,
    send,
    selectStyle,
    selectPalette,
    toggleMaterial,
    reset,
    /** Enough captured to draw and price it. */
    ready: projectId !== null && isPriceable(brief),
    /** The conversation itself has wrapped up. */
    complete,
  };
}

/* ── Guided fallback script ──
   Collects the same brief with no API call. Only reached when the server has
   no key or the request fails. */

interface GuidedStep {
  question: string;
  options: { label: string; value: string }[];
  apply: (brief: Brief, value: string) => Brief;
  freeform?: (brief: Brief, answer: string) => Brief;
}

export const GUIDED: GuidedStep[] = [
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
    question: 'And roughly when would you want to start?',
    options: [
      { label: 'As soon as possible', value: 'As soon as possible' },
      { label: 'Within 6 months', value: 'Within 6 months' },
      { label: 'Next year', value: 'Next year' },
      { label: 'Just exploring', value: 'Just exploring' },
    ],
    apply: (b, v) => ({ ...b, timeline: v }),
    freeform: (b, answer) => ({ ...b, timeline: answer }),
  },
  {
    question: 'Last thing — what email should Ryan reply to? Type it, or skip.',
    options: [{ label: 'Skip', value: '' }],
    apply: (b) => b,
    freeform: (b, answer) => (answer.includes('@') ? { ...b, email: answer.trim() } : b),
  },
];
