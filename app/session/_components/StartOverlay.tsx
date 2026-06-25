type StartOverlayProps = {
  scenarioLabel: string;
  topicLabel: string;
  panelistCount: number;
  micSupported: boolean;
  onStart: () => void;
};

function StartOverlay({
  scenarioLabel,
  topicLabel,
  panelistCount,
  micSupported,
  onStart,
}: StartOverlayProps) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-120 flex items-center justify-center bg-ink/85 p-4 text-center">
      <div className="w-full max-w-md border-3 border-camel bg-ink px-8 py-10 shadow-[8px_8px_0_rgba(193,154,107,0.4)]">
        <span className="mb-4 inline-block border border-camel bg-sienna px-3 py-1 font-grotesk text-2xs font-bold tracking-[0.08em] text-white uppercase">
          {scenarioLabel}
        </span>
        <h1 className="mb-3 font-grotesk text-xl font-bold text-white sm:text-2xl">{topicLabel}</h1>
        <p className="mb-8 font-inter text-[0.85rem] leading-relaxed text-white/55">
          {panelistCount} panelist{panelistCount === 1 ? "" : "s"} {panelistCount === 1 ? "is" : "are"} ready
          for you. Click below to enter the room, enable audio
          {micSupported ? ", and allow microphone access." : "."}
          {micSupported
            ? ""
            : " Your browser doesn't support voice input, so you'll type your responses instead."}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="neu-press w-full border-2 border-camel bg-sienna px-6 py-4 font-grotesk text-sm font-bold tracking-wider text-white uppercase shadow-[5px_5px_0_#1A1109]"
        >
          Enter the room
        </button>
        <p className="mt-4 font-inter text-2xs leading-relaxed text-white/40">
          Having trouble connecting or with audio? Try disabling browser extensions (ad blockers,
          privacy/VPN tools) — they can block the session connection or microphone access.
        </p>
      </div>
    </div>
  );
}

export default StartOverlay;
