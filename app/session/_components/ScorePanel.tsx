import type { SessionScores } from "@/lib/session-data";

type ScorePanelProps = {
  scores: SessionScores;
  started: boolean;
};

const ROWS: { key: keyof SessionScores; label: string }[] = [
  { key: "clarity", label: "Clarity" },
  { key: "confidence", label: "Confidence" },
  { key: "structure", label: "Structure" },
];

function ScorePanel({ scores, started }: ScorePanelProps) {
  return (
    <div className="pointer-events-none absolute top-17 left-3 z-65 flex flex-col gap-1.5 sm:left-4">
      {ROWS.map(({ key, label }) => (
        <div
          key={key}
          className="flex items-center gap-2 border border-camel/25 bg-ink/85 px-2.5 py-1.5"
        >
          <span className="min-w-14.5 font-grotesk text-2xs font-bold tracking-[0.06em] text-white/40 uppercase">
            {label}
          </span>
          <div className="h-1 w-12 overflow-hidden rounded-full bg-white/10 sm:w-15">
            <div
              className="h-full rounded-full bg-camel transition-[width] duration-1000 ease-out"
              style={{ width: started ? `${scores[key]}%` : "0%" }}
            />
          </div>
          <span className="min-w-6 text-right font-grotesk text-[0.68rem] font-bold text-camel">
            {started ? `${scores[key]}%` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ScorePanel;
