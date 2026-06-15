"use client";

type SessionOptionToggleProps = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

function SessionOptionToggle({
  id,
  label,
  description,
  enabled,
  onToggle,
}: SessionOptionToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full cursor-pointer items-start justify-between gap-4 text-left sm:items-center"
      aria-pressed={enabled}
      aria-labelledby={`${id}-label`}
    >
      <div className="min-w-0 flex-1">
        <p
          id={`${id}-label`}
          className="font-grotesk text-[0.85rem] font-bold text-ink"
        >
          {label}
        </p>
        <p className="text-[0.72rem] text-mid">{description}</p>
      </div>
      <div
        className={[
          "relative mt-0.5 flex h-6 w-11 shrink-0 items-center border-2 border-ink shadow-[2px_2px_0_#1A1109] sm:mt-0",
          enabled ? "bg-sienna" : "bg-pale",
        ].join(" ")}
        aria-hidden
      >
        <div
          className={[
            "absolute h-4 w-4 border border-ink/30 bg-white transition-all duration-150",
            enabled ? "right-0.5" : "left-0.5",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

export default SessionOptionToggle;
