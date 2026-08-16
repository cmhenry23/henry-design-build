'use client';

import BriefCard from '@/components/chat/BriefCard';
import ChatThread from '@/components/chat/ChatThread';
import { useProjectIntake } from '@/components/chat/useProjectIntake';
import { UNKNOWN } from '@/lib/brief';
import { site } from '@/data/site';

/**
 * Full-page version of the intake conversation.
 *
 * Shares every bit of its behaviour with the floating launcher via
 * `useProjectIntake` — this component only decides the layout.
 */
export default function ProjectChat() {
  const intake = useProjectIntake();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className="flex min-h-[32rem] flex-col border border-ink/15 bg-white/60 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
        <header className="flex shrink-0 items-center gap-3 border-b border-ink/12 px-5 py-4">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping bg-cedar opacity-60" />
            <span className="relative inline-flex h-2 w-2 bg-cedar" />
          </span>
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em]">
            Project intake
          </p>
          <span className="ml-auto text-xs text-ink/40">{intake.guided ? 'Guided' : 'Live'}</span>
        </header>

        <ChatThread
          turns={intake.turns}
          chips={intake.chips}
          busy={intake.busy}
          notice={intake.notice}
          guided={intake.guided}
          onSend={intake.send}
          className="flex-1"
        />
      </div>

      <div>
        {intake.ready && intake.projectId ? (
          <BriefCard brief={intake.brief} projectId={intake.projectId} />
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
                  (i === 0 && intake.brief.buildType !== UNKNOWN) ||
                  (i === 1 && intake.brief.sqft > 0) ||
                  (i === 2 && intake.brief.finish !== UNKNOWN);
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
