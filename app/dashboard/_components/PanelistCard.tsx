"use client";

import { PANELIST_BG } from "@/lib/dashboard-data";
import { initialsFromName } from "@/lib/dashboard-utils";
import PersonalitySlider from "./PersonalitySlider";

const STRICT_LABELS = [
  "Lenient",
  "Fairly lenient",
  "Balanced",
  "Fairly strict",
  "Strict",
];

const INQUISITIVE_LABELS = [
  "Passive",
  "Fairly passive",
  "Balanced",
  "Fairly inquisitive",
  "Inquisitive",
];

export type Panelist = {
  id: string;
  name: string;
  role: string;
  strict: number;
  inquisitive: number;
};

type PanelistCardProps = {
  panelist: Panelist;
  index: number;
  required?: boolean;
  onChange: (id: string, updates: Partial<Panelist>) => void;
  onRemove?: () => void;
};

function PanelistCard({
  panelist,
  index,
  required,
  onChange,
  onRemove,
}: PanelistCardProps) {
  const bg = PANELIST_BG[index] ?? "#F0E5D0";
  const initials = initialsFromName(panelist.name, `P${index + 1}`);

  return (
    <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] step-animate sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center border-2 border-ink font-grotesk text-[0.82rem] font-bold text-sienna"
            style={{ background: bg }}
          >
            {initials}
          </div>
          <p className="font-grotesk text-[0.9rem] font-bold text-ink">
            Panelist {index + 1}
          </p>
        </div>
        {required ? (
          <span className="border border-sienna/30 bg-pale px-2 py-1 font-grotesk text-2xs font-bold tracking-[0.08em] text-sienna uppercase">
            Required
          </span>
        ) : (
          <button
            type="button"
            onClick={onRemove}
            className="border border-ink/20 px-2 py-1 font-grotesk text-[0.72rem] font-bold text-mid transition-colors hover:border-red-400 hover:text-red-500"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-grotesk text-[0.68rem] font-bold tracking-[0.08em] text-ink uppercase">
            Name / Title
          </label>
          <input
            type="text"
            value={panelist.name}
            onChange={(e) => onChange(panelist.id, { name: e.target.value })}
            placeholder="e.g. Dr. Okafor"
            className="neu-input-compact w-full border-2 border-ink bg-cream px-3 py-2.5 font-inter text-[0.85rem] text-ink placeholder:text-mid/45"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-grotesk text-[0.68rem] font-bold tracking-[0.08em] text-ink uppercase">
            Expertise / Role
          </label>
          <input
            type="text"
            value={panelist.role}
            onChange={(e) => onChange(panelist.id, { role: e.target.value })}
            placeholder="e.g. Research Methods"
            className="neu-input-compact w-full border-2 border-ink bg-cream px-3 py-2.5 font-inter text-[0.85rem] text-ink placeholder:text-mid/45"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-2 border-ink bg-pale p-4">
        <p className="mb-1 font-grotesk text-[0.68rem] font-bold tracking-[0.08em] text-ink uppercase">
          Personality
        </p>
        <PersonalitySlider
          leftLabel="Lenient"
          rightLabel="Strict"
          labels={STRICT_LABELS}
          value={panelist.strict}
          onChange={(strict) => onChange(panelist.id, { strict })}
        />
        <PersonalitySlider
          leftLabel="Passive"
          rightLabel="Inquisitive"
          labels={INQUISITIVE_LABELS}
          value={panelist.inquisitive}
          onChange={(inquisitive) => onChange(panelist.id, { inquisitive })}
        />
      </div>
    </div>
  );
}

export default PanelistCard;
