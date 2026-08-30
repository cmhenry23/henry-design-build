'use client';

import ChatThread from '@/components/chat/ChatThread';
import { useProjectIntake } from '@/components/chat/useProjectIntake';
import Configurator from '@/components/visualizer/Configurator';

/**
 * Full-page version of the intake conversation.
 *
 * The chat sits above the actual Design Studio, not beside a static
 * summary card — everything the conversation establishes (what you're
 * building, roughly how big, style, materials, notes) fills the studio in
 * live underneath, via `Configurator`'s `seedBrief` prop. It's the same
 * component /visualizer uses, fully interactive the whole time, so a
 * visitor can watch it fill in as they talk and then keep tweaking it by
 * hand without ever leaving this page.
 */
export default function ProjectChat() {
  const intake = useProjectIntake();

  return (
    <div className="space-y-16">
      <div className="mx-auto flex min-h-[28rem] max-w-2xl flex-col border border-ink/15 bg-white/60">
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
          brief={intake.brief}
          onSelectStyle={intake.selectStyle}
          onSelectPalette={intake.selectPalette}
          onToggleMaterial={intake.toggleMaterial}
          className="flex-1"
        />
      </div>

      <div className="border-t border-ink/10 pt-12">
        <p className="eyebrow text-ink/40">The Design Studio, live</p>
        <h2 className="h-section mt-4 max-w-xl">Filling in as you talk</h2>
        <p className="lede mt-5 max-w-xl text-ink/65">
          Everything you tell us above lands here automatically — what you&rsquo;re building,
          roughly how big, the style and materials. Tweak any of it directly whenever you like;
          the chat won&rsquo;t overwrite something you&rsquo;ve changed by hand unless you tell it
          something new yourself.
        </p>
        <div className="mt-10">
          <Configurator seedBrief={intake.brief} />
        </div>
      </div>
    </div>
  );
}
