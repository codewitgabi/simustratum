"use client";

import { useRef } from "react";
import { SCENARIOS, type ScenarioId } from "@/lib/dashboard-data";
import ScenarioCard from "./ScenarioCard";

const ACCEPTED_DOCUMENT_TYPES = ".pdf,.doc,.docx,.txt";
const MAX_DOCUMENT_SIZE_MB = 10;

type StepScenarioProps = {
  selectedScenario: ScenarioId | null;
  topic: string;
  document: File | null;
  onSelectScenario: (id: ScenarioId) => void;
  onTopicChange: (topic: string) => void;
  onDocumentChange: (file: File | null) => void;
  onNext: () => void;
};

function StepScenario({
  selectedScenario,
  topic,
  document,
  onSelectScenario,
  onTopicChange,
  onDocumentChange,
  onNext,
}: StepScenarioProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canProceed = Boolean(selectedScenario) && topic.trim().length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024) {
      onDocumentChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    onDocumentChange(file);
  };

  const handleRemoveDocument = () => {
    onDocumentChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="step-animate px-4 pt-5 pb-8 sm:px-6 sm:pt-7 sm:pb-10 lg:px-8">
      <div className="mb-5 sm:mb-7">
        <h2 className="mb-1 font-grotesk text-[1.25rem] font-bold tracking-[-0.5px] text-ink sm:text-[1.5rem]">
          What are you practicing for?
        </h2>
        <p className="text-[0.9rem] text-mid">
          Pick a scenario. Your AI panel will be calibrated around it.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            {...scenario}
            selected={selectedScenario === scenario.id}
            onSelect={onSelectScenario}
          />
        ))}
      </div>

      {selectedScenario && (
        <div className="step-animate mb-8">
          <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-6">
            <label className="mb-2 block font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase">
              What&apos;s your topic or subject?{" "}
              <span className="text-sienna">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g. The effect of social media on academic performance among undergraduates"
              className="neu-input-compact mb-3 w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.88rem] text-ink placeholder:text-mid/45"
            />
            <p className="mb-4 text-[0.72rem] text-mid">
              Your AI panelists will tailor every question to this topic. Be as
              specific as possible.
            </p>

            <label className="mb-2 block font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase">
              Have a reference document?{" "}
              <span className="text-mid font-normal">(optional)</span>
            </label>

            {document ? (
              <div className="flex items-center justify-between gap-3 border-2 border-ink bg-cream px-4 py-3">
                <span className="truncate font-inter text-[0.85rem] text-ink">
                  {document.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveDocument}
                  className="neu-press-sm cursor-pointer border-2 border-ink bg-white px-3 py-1.5 font-grotesk text-[0.72rem] font-bold text-ink uppercase shadow-neu-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="neu-press-sm w-full cursor-pointer border-2 border-dashed border-ink bg-cream px-4 py-3 text-left font-inter text-[0.85rem] text-mid shadow-neu-sm"
              >
                Upload a document (PDF, DOC, or TXT) for panelists to ask from
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_DOCUMENT_TYPES}
              onChange={handleFileSelect}
              className="hidden"
            />

            <p className="mt-2 text-[0.72rem] text-mid">
              If provided, panelists will draw questions from this document
              instead of general knowledge. Max {MAX_DOCUMENT_SIZE_MB}MB.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="neu-press inline-flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-7 py-3.5 font-grotesk text-[0.9rem] font-bold text-white shadow-neu-md sm:w-auto"
        >
          Set up panelists
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

export default StepScenario;
