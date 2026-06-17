"use client";

import PanelistCard, { type Panelist } from "./PanelistCard";

type StepPanelistsProps = {
  panelists: Panelist[];
  maxPanelists: number;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, updates: Partial<Panelist>) => void;
  onBack: () => void;
  onNext: () => void;
};

function StepPanelists({
  panelists,
  maxPanelists,
  onAdd,
  onRemove,
  onChange,
  onBack,
  onNext,
}: StepPanelistsProps) {
  const atMax = panelists.length >= maxPanelists;
  const canProceed = Boolean(panelists[0]?.name.trim());

  return (
    <div className="step-animate px-4 pt-5 pb-8 sm:px-6 sm:pt-7 sm:pb-10 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="mb-1 font-grotesk text-[1.25rem] font-bold tracking-[-0.5px] text-ink sm:text-[1.5rem]">
            Build your panel
          </h2>
          <p className="text-[0.9rem] text-mid">
            Add up to {maxPanelists} AI panelists. Set their name, role, and
            personality.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={atMax}
          className="neu-press-sm inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-pale px-4 py-2.5 font-grotesk text-[0.82rem] font-bold text-ink shadow-neu-sm sm:w-auto"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            aria-hidden
          >
            <path
              d="M6.5 1v11M1 6.5h11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Panelist
        </button>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        {panelists.map((panelist, index) => (
          <PanelistCard
            key={panelist.id}
            panelist={panelist}
            index={index}
            required={index === 0}
            onChange={onChange}
            onRemove={index === 0 ? undefined : () => onRemove(panelist.id)}
          />
        ))}
      </div>

      {!canProceed && (
        <p className="mb-4 text-[0.78rem] font-bold text-sienna">
          The first panelist needs a name before you can continue.
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="neu-press-sm inline-flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-white px-5 py-3 font-grotesk text-[0.88rem] font-bold text-ink shadow-neu-sm sm:w-auto"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            aria-hidden
          >
            <path
              d="M11 6.5H2M6 3L2 6.5 6 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="neu-press inline-flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-7 py-3.5 font-grotesk text-[0.9rem] font-bold text-white shadow-neu-md sm:w-auto"
        >
          Review session
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default StepPanelists;
