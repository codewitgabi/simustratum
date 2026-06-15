type StepTabsProps = {
  currentStep: number;
  onStepClick: (step: number) => void;
};

const STEPS = [
  {
    num: 1,
    label: "Scenario",
    shortLabel: "Scenario",
    hint: "Choose what you're practicing",
  },
  {
    num: 2,
    label: "Panelists",
    shortLabel: "Panel",
    hint: "Add your AI panel members",
  },
  {
    num: 3,
    label: "Ready?",
    shortLabel: "Ready",
    hint: "Review and begin your session",
  },
];

function StepTabs({ currentStep, onStepClick }: StepTabsProps) {
  return (
    <div className="px-4 pt-5 pb-0 sm:px-6 sm:pt-8 lg:px-8">
      <div
        className="flex items-stretch border-2 border-ink bg-white shadow-neu-md"
        role="tablist"
        aria-label="Session setup steps"
      >
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.num;
          const isComplete = currentStep > step.num;
          const isLast = index === STEPS.length - 1;

          return (
            <button
              key={step.num}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "step" : undefined}
              onClick={() => onStepClick(step.num)}
              className={[
                "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 px-1.5 py-2.5 transition-colors duration-150 sm:gap-1.5 sm:px-3 sm:py-4",
                !isLast ? "border-r-2 border-ink" : "",
                isActive
                  ? "bg-ink"
                  : isComplete
                    ? "bg-pale hover:bg-pale"
                    : "bg-white hover:bg-pale",
              ].join(" ")}
            >
              <div className="flex w-full min-w-0 items-center justify-center gap-1 sm:gap-2">
                <span
                  className={[
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border font-grotesk text-[0.58rem] font-bold sm:h-5 sm:w-5 sm:text-xxs",
                    isActive
                      ? "border-white/40 bg-white/20 text-white"
                      : isComplete
                        ? "border-ink bg-sienna text-white"
                        : "border-ink/30 bg-pale text-mid",
                  ].join(" ")}
                >
                  {isComplete ? "✓" : step.num}
                </span>
                <span
                  className={[
                    "truncate font-grotesk text-2xs font-bold sm:hidden",
                    isActive ? "text-white" : "text-mid",
                  ].join(" ")}
                >
                  {step.shortLabel}
                </span>
                <span
                  className={[
                    "hidden truncate font-grotesk text-[0.78rem] font-bold sm:inline",
                    isActive ? "text-white" : "text-mid",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              <p
                className={[
                  "hidden w-full truncate px-1 text-center text-2xs md:block",
                  isActive ? "text-white/50" : "text-mid/50",
                ].join(" ")}
              >
                {step.hint}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StepTabs;
