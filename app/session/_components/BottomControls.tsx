"use client";

import { useState, type FormEvent } from "react";

type StatusVariant = "idle" | "user" | "panelist";

type BottomControlsProps = {
  status: string;
  statusVariant: StatusVariant;
  waveActive: boolean;
  micSupported: boolean;
  micDisabled: boolean;
  isListening: boolean;
  onToggleMic: () => void;
  onToggleTranscript: () => void;
  paused: boolean;
  onTogglePause: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  canRespond: boolean;
  onSubmitText: (text: string) => void;
};

const WAVE_HEIGHTS = [
  14, 22, 18, 28, 12, 24, 20, 30, 16, 26, 14, 22, 18, 28, 12, 24, 20, 30, 16, 10,
];

const STATUS_COLOR: Record<StatusVariant, string> = {
  idle: "text-white/50",
  user: "text-[#52B788]",
  panelist: "text-camel",
};

const CTRL_BTN_CLASS =
  "flex h-11 w-11 items-center justify-center border-2 border-white/20 bg-white/8 text-white/60 transition hover:bg-white/15 hover:text-white";

function BottomControls({
  status,
  statusVariant,
  waveActive,
  micSupported,
  micDisabled,
  isListening,
  onToggleMic,
  onToggleTranscript,
  paused,
  onTogglePause,
  audioEnabled,
  onToggleAudio,
  canRespond,
  onSubmitText,
}: BottomControlsProps) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSubmitText(text);
    setDraft("");
  };

  return (
    <div className="session-hud-bottom pointer-events-auto absolute inset-x-0 bottom-0 z-70 flex flex-col items-center justify-end gap-2 bg-linear-to-t from-ink/95 to-transparent px-4 pt-6 pb-4 sm:gap-3 sm:pb-5">
      <p
        className={`font-grotesk text-2xs font-bold tracking-widest uppercase transition-colors ${STATUS_COLOR[statusVariant]}`}
      >
        {status}
      </p>

      <div className="session-wave" aria-hidden>
        {WAVE_HEIGHTS.map((height, index) => (
          <div
            key={index}
            className={`session-wave-bar${waveActive ? " active" : ""}`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleTranscript}
          aria-label="Toggle transcript"
          className={CTRL_BTN_CLASS}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <rect x="2" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onToggleAudio}
          aria-label={audioEnabled ? "Mute panelist audio" : "Unmute panelist audio"}
          className={CTRL_BTN_CLASS}
        >
          {audioEnabled ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 7v4h3l4 4V3L5 7H2Z" fill="currentColor" />
              <path d="M11.5 6.5a3 3 0 0 1 0 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M13.5 4.5a6 6 0 0 1 0 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 7v4h3l4 4V3L5 7H2Z" fill="currentColor" />
              <line x1="11.5" y1="6.5" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="6.5" x2="11.5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {micSupported ? (
          <button
            type="button"
            onClick={onToggleMic}
            disabled={micDisabled && !isListening}
            title="Hold to speak"
            aria-label={isListening ? "Stop recording" : "Start recording"}
            className={`session-mic-btn${isListening ? " recording" : ""}`}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <rect x="7" y="1" width="8" height="11" rx="4" stroke="white" strokeWidth="2" />
              <path d="M3 10a8 8 0 0 0 16 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="18" x2="11" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="7" y1="21" x2="15" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-70 items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={!canRespond}
              placeholder={canRespond ? "Type your response…" : "Listen to the panelist…"}
              className="flex-1 border-2 border-white/20 bg-white/8 px-3 py-2.5 font-inter text-[0.82rem] text-white placeholder:text-white/35 focus:border-camel focus:outline-none disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!canRespond || !draft.trim()}
              aria-label="Send response"
              className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-camel bg-sienna text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M2 9h13M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onTogglePause}
          aria-label={paused ? "Resume session" : "Pause session"}
          className={CTRL_BTN_CLASS}
        >
          {paused ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M5 3l9 6-9 6V3Z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <rect x="4" y="3" width="4" height="12" rx="1" fill="currentColor" />
              <rect x="10" y="3" width="4" height="12" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <p className="hidden font-grotesk text-2xs tracking-wide text-white/25 sm:block">
        {micSupported
          ? "PRESS MIC TO RESPOND · TAP A PANELIST TO SEE DETAILS"
          : "TYPE YOUR RESPONSE · TAP A PANELIST TO SEE DETAILS"}
      </p>
    </div>
  );
}

export default BottomControls;
