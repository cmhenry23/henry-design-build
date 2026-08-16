'use client';

import { useEffect, useRef, useState } from 'react';
import MaterialBoard from '@/components/chat/MaterialBoard';
import PaletteBoard from '@/components/chat/PaletteBoard';
import StyleBoard from '@/components/chat/StyleBoard';
import type { Turn } from '@/components/chat/useProjectIntake';
import { UNKNOWN, type Brief } from '@/lib/brief';

/**
 * The conversation surface itself — log, quick replies, composer.
 * Rendered identically inside the floating panel and on the /start page.
 */
export default function ChatThread({
  turns,
  chips,
  busy,
  notice,
  guided,
  onSend,
  brief,
  onSelectStyle,
  onSelectPalette,
  onToggleMaterial,
  className = '',
}: {
  turns: Turn[];
  chips: string[];
  busy: boolean;
  notice: string | null;
  guided: boolean;
  onSend: (text: string) => void;
  brief: Brief;
  onSelectStyle: (id: string) => void;
  onSelectPalette: (id: string) => void;
  onToggleMaterial: (id: string) => void;
  className?: string;
}) {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [turns, busy]);

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      {notice && (
        <p className="shrink-0 border-b border-cedar/40 bg-cedar/10 px-5 py-3 text-xs leading-relaxed text-ink/70">
          {notice}
        </p>
      )}

      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {turns.map((turn, i) => (
          <div key={i} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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

        {/* Boards unfold broad -> specific as the visitor commits: style,
            then palette, then materials. Showing all three at once buries the
            conversation; revealing the next only after a pick keeps the panel
            readable and makes each choice feel like progress. */}
        {brief.buildType !== UNKNOWN && (
          <StyleBoard
            buildType={brief.buildType}
            selected={brief.style}
            onSelect={onSelectStyle}
          />
        )}

        {brief.buildType !== UNKNOWN && brief.style && (
          <PaletteBoard
            buildType={brief.buildType}
            selected={brief.palette}
            onSelect={onSelectPalette}
          />
        )}

        {brief.buildType !== UNKNOWN && brief.style && brief.palette && (
          <MaterialBoard
            buildType={brief.buildType}
            selected={brief.materials}
            onToggle={onToggleMaterial}
          />
        )}

        <div ref={endRef} />
      </div>

      {chips.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-2 border-t border-ink/12 px-5 py-3">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSend(chip)}
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
          onSend(input);
          setInput('');
        }}
        className="flex shrink-0 gap-2 border-t border-ink/12 p-4"
      >
        <label htmlFor="chat-input" className="sr-only">
          Your message
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={guided ? 'Type an answer…' : "Tell us what you're thinking…"}
          autoComplete="off"
          className="min-w-0 flex-1 border border-ink/20 bg-white/70 px-4 py-3 text-sm placeholder:text-ink/30 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="btn-primary shrink-0 !px-5 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
