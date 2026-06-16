type SessionTopBarProps = {
  scenarioLabel: string;
  topicLabel: string;
  elapsed: string;
  onEndSession: () => void;
};

function SessionTopBar({
  scenarioLabel,
  topicLabel,
  elapsed,
  onEndSession,
}: SessionTopBarProps) {
  return (
    <div className="pointer-events-auto absolute inset-x-0 top-0 z-70 flex h-14 items-center justify-between gap-3 border-b-2 border-camel/30 bg-ink px-3 sm:px-5">
      <div className="flex items-center gap-2 font-grotesk text-sm font-bold text-white">
        <div className="flex h-6 w-6 items-center justify-center border-2 border-camel bg-sienna text-xs">
          S
        </div>
        <span className="hidden sm:inline">Simustratum</span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden">
        <span className="border border-camel bg-sienna px-2.5 py-1 font-grotesk text-2xs font-bold tracking-[0.06em] text-white uppercase">
          {scenarioLabel}
        </span>
        <span className="hidden truncate border border-camel/35 px-2.5 py-1 font-grotesk text-2xs font-bold tracking-[0.06em] text-white/70 uppercase sm:inline">
          {topicLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-16 text-right font-grotesk text-lg font-bold tracking-wider text-white">
          {elapsed}
        </div>
        <button
          type="button"
          onClick={onEndSession}
          className="flex items-center gap-1.5 border border-white/20 px-3 py-1.5 font-grotesk text-2xs font-bold text-white/50 transition hover:border-red-400 hover:bg-red-500 hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="4" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="4" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">End Session</span>
        </button>
      </div>
    </div>
  );
}

export default SessionTopBar;
