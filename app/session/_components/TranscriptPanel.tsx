import type { TranscriptMessage } from "@/lib/session-data";

type TranscriptPanelProps = {
  open: boolean;
  messages: TranscriptMessage[];
  onClose: () => void;
};

function TranscriptPanel({ open, messages, onClose }: TranscriptPanelProps) {
  return (
    <div
      className={`pointer-events-auto absolute top-14 right-0 z-90 flex h-[calc(100%-3.5rem)] w-full max-w-70 flex-col border-l-2 border-camel/20 bg-ink/95 transition-transform duration-300 ease-out sm:w-70 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b-2 border-camel/20 px-4 py-3.5">
        <span className="font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-white/70 uppercase">
          Transcript
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close transcript"
          className="text-white/40 transition hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="sidebar-sessions-scroll flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <p className="font-inter text-[0.78rem] text-white/35">
            Transcript will appear here once the session starts.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`border-l-[3px] bg-white/5 px-3 py-2.5 ${
                message.isUser ? "border-l-[#52B788]" : "border-l-camel"
              }`}
            >
              <div
                className={`mb-1 font-grotesk text-2xs font-bold tracking-[0.06em] uppercase ${
                  message.isUser ? "text-[#52B788]" : "text-camel"
                }`}
              >
                {message.speaker}
              </div>
              <div className="font-inter text-[0.78rem] leading-relaxed text-white/65">
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TranscriptPanel;
