'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BriefCard from '@/components/chat/BriefCard';
import ChatThread from '@/components/chat/ChatThread';
import { useProjectIntake } from '@/components/chat/useProjectIntake';
import { buildSummary } from '@/lib/briefSummary';
import { site } from '@/data/site';

/**
 * Persistent contact launcher.
 *
 * Sits in the root layout, so it survives client-side navigation — the
 * conversation is not lost when someone browses the portfolio mid-chat.
 *
 * It has two states:
 *   before  a "Let's talk" button that opens the conversation
 *   after   once the brief is priceable, it becomes "Send to Ryan" and the
 *           panel surfaces the project overview and the planning range,
 *           one tap from an email.
 *
 * Hidden on /start, which hosts the same conversation full-page.
 */
export default function ChatLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'overview'>('chat');
  const [copied, setCopied] = useState(false);
  const intake = useProjectIntake();

  const summary =
    intake.ready && intake.projectId ? buildSummary(intake.brief, intake.projectId) : null;

  // Switch to the overview when the conversation wraps up — not merely when
  // the brief becomes priceable, which can happen with questions still to go.
  // Before that the "Overview & price" tab is available to jump to early.
  useEffect(() => {
    if (intake.complete) setView('overview');
  }, [intake.complete]);

  // Close on Escape; lock the page behind the panel on small screens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (pathname === '/start') return null;

  async function copyOverview() {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary.overview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      {/* ── Launcher ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 px-5 py-4 font-display text-[0.72rem] font-bold uppercase tracking-[0.14em] shadow-[0_6px_28px_rgba(20,17,15,0.28)] transition-colors sm:bottom-7 sm:right-7 ${
          summary ? 'bg-cedar text-ink hover:bg-brass' : 'bg-ink text-bone hover:bg-stone'
        }`}
      >
        <span aria-hidden="true">{open ? <IconClose /> : summary ? <IconMail /> : <IconChat />}</span>
        <span className="hidden sm:inline">
          {open ? 'Close' : summary ? 'Send to Ryan' : "Let's talk"}
        </span>
        <span className="sm:hidden">{open ? 'Close' : summary ? 'Send' : 'Talk'}</span>
        {summary && !open && (
          <span
            className="absolute -right-1 -top-1 flex h-3 w-3"
            aria-label="Your project overview is ready"
          >
            <span className="absolute inline-flex h-full w-full animate-ping bg-ink opacity-70" />
            <span className="relative inline-flex h-3 w-3 bg-ink" />
          </span>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-ink/45 backdrop-blur-[2px] lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="chat-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Talk to Henry Design Build"
            className="fixed inset-x-0 bottom-0 top-[3.5rem] z-[58] flex flex-col border border-ink/15 bg-bone shadow-[0_10px_50px_rgba(20,17,15,0.3)] sm:inset-x-auto sm:right-7 sm:top-auto sm:bottom-28 sm:h-[min(42rem,calc(100vh-10rem))] sm:w-[26rem]"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-ink/12 px-5 py-4">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping bg-cedar opacity-60" />
                <span className="relative inline-flex h-2 w-2 bg-cedar" />
              </span>
              <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em]">
                {view === 'overview' ? 'Your project' : 'Project intake'}
              </p>
              <span className="ml-auto text-xs text-ink/40">
                {intake.guided ? 'Guided' : 'Live'}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-2 px-2 text-xl leading-none text-ink/40 transition-colors hover:text-ink"
              >
                &times;
              </button>
            </header>

            {summary && (
              <div className="flex shrink-0 border-b border-ink/12">
                {(['chat', 'overview'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    className={`flex-1 px-4 py-3 font-display text-[0.66rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                      view === v ? 'bg-ink text-bone' : 'text-ink/50 hover:text-ink'
                    }`}
                  >
                    {v === 'chat' ? 'Conversation' : 'Overview & price'}
                  </button>
                ))}
              </div>
            )}

            {view === 'chat' || !summary ? (
              <ChatThread
                turns={intake.turns}
                chips={intake.chips}
                busy={intake.busy}
                notice={intake.notice}
                guided={intake.guided}
                onSend={intake.send}
                brief={intake.brief}
                onToggleMaterial={intake.toggleMaterial}
                className="flex-1"
              />
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">
                <BriefCard
                  brief={intake.brief}
                  projectId={intake.projectId!}
                  compact
                  onCopy={copyOverview}
                  copied={copied}
                />
              </div>
            )}

            {summary && view === 'overview' && (
              <div className="shrink-0 border-t border-ink/12 p-4">
                <a href={summary.mailto} className="btn-cedar w-full">
                  Email this to Ryan
                </a>
                <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-ink/45">
                  Opens your mail app with the full overview and range filled in. Or write to{' '}
                  <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                    {site.email}
                  </a>
                  .
                </p>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}

/* ── Icons ── */

function IconChat() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 013.5 2h13A1.5 1.5 0 0118 3.5v9a1.5 1.5 0 01-1.5 1.5H7.6L4 17.4a.6.6 0 01-1-.45V14h-.5A1.5 1.5 0 011 12.5v-9z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M2 5.2A1.2 1.2 0 013.2 4h13.6A1.2 1.2 0 0118 5.2v.35l-8 4.6-8-4.6V5.2zm0 2.05l7.7 4.43a.6.6 0 00.6 0L18 7.25v7.55A1.2 1.2 0 0116.8 16H3.2A1.2 1.2 0 012 14.8V7.25z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M4.5 3.4L10 8.9l5.5-5.5 1.1 1.1L11.1 10l5.5 5.5-1.1 1.1L10 11.1l-5.5 5.5-1.1-1.1L8.9 10 3.4 4.5z" />
    </svg>
  );
}
