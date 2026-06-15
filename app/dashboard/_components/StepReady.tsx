"use client";

import {
  PANELIST_BG,
  SCENARIO_META,
  type ScenarioId,
} from "@/lib/dashboard-data";
import { initialsFromName, sliderLabel } from "@/lib/dashboard-utils";
import type { Panelist } from "./PanelistCard";
import SessionOptionToggle from "./SessionOptionToggle";

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

export type SessionOptions = {
  feedback: boolean;
  timer: boolean;
  transcript: boolean;
};

type StepReadyProps = {
  selectedScenario: ScenarioId | null;
  topic: string;
  panelists: Panelist[];
  options: SessionOptions;
  launching: boolean;
  onToggleOption: (key: keyof SessionOptions) => void;
  onEditScenario: () => void;
  onEditPanelists: () => void;
  onBack: () => void;
  onBegin: () => void;
};

function StepReady({
  selectedScenario,
  topic,
  panelists,
  options,
  launching,
  onToggleOption,
  onEditScenario,
  onEditPanelists,
  onBack,
  onBegin,
}: StepReadyProps) {
  const meta = selectedScenario
    ? SCENARIO_META[selectedScenario]
    : { label: "—", icon: "❓" };

  return (
    <div className="step-animate px-4 pt-5 pb-8 sm:px-6 sm:pt-7 sm:pb-10 lg:px-8">
      <div className="mb-5 sm:mb-7">
        <h2 className="mb-1 font-grotesk text-[1.25rem] font-bold tracking-[-0.5px] text-ink sm:text-[1.5rem]">
          You&apos;re almost ready
        </h2>
        <p className="text-[0.9rem] text-mid">
          Review your session setup before stepping in.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
                Scenario
              </p>
              <button
                type="button"
                onClick={onEditScenario}
                className="border-b border-sienna/40 font-grotesk text-[0.7rem] font-bold text-sienna transition-colors hover:border-sienna"
              >
                Edit
              </button>
            </div>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-pale text-[1.2rem]">
                {meta.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-grotesk text-[1rem] font-bold text-ink">
                  {meta.label}
                </p>
                <p className="text-[0.78rem] break-words text-mid">
                  {topic.trim() || "No topic entered"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
                Your Panel
              </p>
              <button
                type="button"
                onClick={onEditPanelists}
                className="border-b border-sienna/40 font-grotesk text-[0.7rem] font-bold text-sienna transition-colors hover:border-sienna"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {panelists.map((panelist, index) => {
                const name = panelist.name.trim() || `Panelist ${index + 1}`;
                const role = panelist.role.trim() || "No role specified";
                const bg = PANELIST_BG[index] ?? "#F0E5D0";
                const initials = initialsFromName(name, `P${index + 1}`);
                const strictLbl = sliderLabel(panelist.strict, STRICT_LABELS);
                const inqLbl = sliderLabel(
                  panelist.inquisitive,
                  INQUISITIVE_LABELS,
                );

                return (
                  <div
                    key={panelist.id}
                    className="flex flex-col gap-2 border-b border-pale py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink font-grotesk text-[0.75rem] font-bold"
                        style={{ background: bg }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-grotesk text-[0.85rem] font-bold text-ink">
                          {name}
                        </p>
                        <p className="truncate text-[0.7rem] text-mid">
                          {role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 pl-12 sm:block sm:shrink-0 sm:pl-0 sm:text-right">
                      <p className="font-grotesk text-2xs font-bold tracking-wide text-sienna uppercase">
                        {strictLbl}
                      </p>
                      <p className="font-grotesk text-2xs tracking-wide text-mid uppercase">
                        {inqLbl}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
            <p className="mb-4 font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
              Session Options
            </p>
            <div className="flex flex-col gap-3">
              <SessionOptionToggle
                id="opt-feedback"
                label="Real-time feedback"
                description="Show tips and scores after each answer"
                enabled={options.feedback}
                onToggle={() => onToggleOption("feedback")}
              />
              <div className="h-px bg-ink/8" />
              <SessionOptionToggle
                id="opt-timer"
                label="Answer timer"
                description="30 seconds to begin responding per question"
                enabled={options.timer}
                onToggle={() => onToggleOption("timer")}
              />
              <div className="h-px bg-ink/8" />
              <SessionOptionToggle
                id="opt-transcript"
                label="Save transcript"
                description="Keep a record of the full session conversation"
                enabled={options.transcript}
                onToggle={() => onToggleOption("transcript")}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
            <p className="mb-4 font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
              Before you start
            </p>
            <div className="flex flex-col gap-3">
              <ChecklistItem done text="Scenario selected and topic entered" />
              <ChecklistItem done text="At least one panelist configured" />
              <ChecklistItem text="Find a quiet place where you can speak freely" />
              <ChecklistItem text="Microphone access will be requested on entry" />
            </div>
          </div>

          <div className="flex items-center gap-3 border-2 border-ink bg-pale p-4 shadow-neu-sm">
            <svg
              className="shrink-0 text-sienna"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <circle
                cx="10"
                cy="10"
                r="8.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 6v4l2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p className="font-grotesk text-[0.82rem] font-bold text-ink">
                Estimated duration
              </p>
              <p className="text-[0.72rem] text-mid">
                15–25 minutes depending on panel size
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBegin}
            disabled={launching}
            className="neu-press mt-1 flex w-full cursor-pointer items-center justify-center gap-3 border-2 border-ink bg-ink px-4 py-4 font-grotesk text-[0.95rem] font-bold text-white shadow-[6px_6px_0_#A0522D] disabled:opacity-80 sm:px-6 sm:text-[1rem]"
          >
            {launching ? (
              <>
                <svg
                  className="animate-spin"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="7"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 2a7 7 0 0 1 7 7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Launching session…</span>
              </>
            ) : (
              <>
                <span className="blink h-2 w-2 shrink-0 rounded-full bg-green" />
                Begin Session
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 3l7 4.5L5 12V3z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>

          <p className="text-center text-[0.7rem] text-mid">
            You can pause or exit at any time during the session.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
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
          Back to panelists
        </button>
      </div>
    </div>
  );
}

function ChecklistItem({ done, text }: { done?: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={[
          "mt-px flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink",
          done ? "bg-[#52B788]" : "bg-pale",
        ].join(" ")}
      >
        {done ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
            <path
              d="M1.5 5l2.5 2.5 4.5-4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 5h4"
              stroke="#7A5C3A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <p className="text-[0.8rem] leading-snug text-mid">{text}</p>
    </div>
  );
}

export default StepReady;
