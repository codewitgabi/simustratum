const MODES = [
  {
    icon: "📝",
    name: "Tutorial Practice",
    description: "Answer tutor questions, explain concepts clearly",
    active: true,
  },
  {
    icon: "📺",
    name: "Presentation",
    description: "Deliver slides, handle Q&A from the floor",
  },
  {
    icon: "🎓",
    name: "Project Defense",
    description: "Face a panel, defend your methodology and findings",
  },
  {
    icon: "✍️",
    name: "Oral Examination",
    description: "Rapid-fire course questions under exam conditions",
  },
  {
    icon: "🌍",
    name: "English Proficiency",
    description: "Pronunciation, fluency, and academic vocabulary drills",
  },
];

const FEEDBACK = [
  {
    type: "good" as const,
    strong: "Strong opening.",
    text: " Your intro clearly established the research gap and relevance.",
  },
  {
    type: "warn" as const,
    strong: "Pacing on Q3.",
    text: " You hesitated 4s before the methodology question. Practice this transition.",
  },
  {
    type: "warn" as const,
    strong: "Filler words.",
    text: ' "Basically" appeared 7 times. Replace with a brief pause.',
  },
  {
    type: "good" as const,
    strong: "Content accuracy.",
    text: " All factual claims in your conclusion were well-supported and clear.",
  },
];

function ModesPreview() {
  return (
    <div className="sticky top-[88px] hidden border-[3px] border-ink bg-white p-8 shadow-neu-lg min-[1101px]:block">
      <div className="mb-6 border-b-2 border-ink pb-5">
        <p className="mb-2 font-grotesk text-xxs font-bold tracking-widest text-mid uppercase">
          Session report
        </p>
        <p className="font-grotesk text-[1.1rem] font-bold text-ink">
          After your practice run
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 border-2 border-ink">
        <div className="border-r-2 border-ink bg-pale px-3 py-4 text-center">
          <p className="font-grotesk text-[1.6rem] font-bold tracking-[-1px] text-sienna">
            82
          </p>
          <p className="mt-[3px] font-grotesk text-2xs font-bold tracking-[0.08em] text-mid uppercase">
            Clarity
          </p>
        </div>
        <div className="border-r-2 border-ink bg-cream px-3 py-4 text-center">
          <p className="font-grotesk text-[1.6rem] font-bold tracking-[-1px] text-sienna">
            74
          </p>
          <p className="mt-[3px] font-grotesk text-2xs font-bold tracking-[0.08em] text-mid uppercase">
            Confidence
          </p>
        </div>
        <div className="bg-pale px-3 py-4 text-center">
          <p className="font-grotesk text-[1.6rem] font-bold tracking-[-1px] text-sienna">
            91
          </p>
          <p className="mt-[3px] font-grotesk text-2xs font-bold tracking-[0.08em] text-mid uppercase">
            Structure
          </p>
        </div>
      </div>

      {FEEDBACK.map((item, index) => (
        <div
          key={item.strong}
          className={`flex items-start gap-3 py-3 ${index < FEEDBACK.length - 1 ? "border-b border-pale" : ""}`}
        >
          <span
            className={`mt-1 h-[10px] w-[10px] shrink-0 rounded-full border-2 border-ink ${item.type === "good" ? "bg-[#52B788]" : "bg-[#F4A261]"}`}
          />
          <p className="text-[0.8rem] leading-[1.55] text-mid">
            <strong className="font-bold text-ink">{item.strong}</strong>
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function Modes() {
  return (
    <section
      id="modes"
      className="bg-cream px-5 py-[60px] sm:px-8 sm:py-20 min-[1101px]:px-[60px] min-[1101px]:py-[100px]"
    >
      <div className="grid items-start gap-20 min-[1101px]:grid-cols-[1fr_480px] min-[1101px]:gap-20">
        <div>
          <span className="mb-5 inline-block border-2 border-ink bg-pale px-3 py-1 font-grotesk text-[0.68rem] font-bold tracking-[0.12em] text-sienna uppercase">
            Practice modes
          </span>
          <h2 className="mb-4 max-w-[600px] font-grotesk text-[clamp(1.9rem,3.5vw,2.8rem)] leading-[1.1] font-bold tracking-[-1px] text-ink">
            Pick the room you&apos;re walking into
          </h2>
          <p className="mb-9 max-w-[480px] text-[0.975rem] leading-[1.75] text-mid">
            Each mode is calibrated to the expectations and pressure of that
            specific academic setting.
          </p>

          <div className="border-2 border-ink shadow-neu-lg">
            {MODES.map((mode, index) => (
              <a
                key={mode.name}
                href="#"
                className={[
                  "mode-item flex cursor-pointer items-center gap-4 px-[22px] py-[18px] bg-white no-underline text-inherit",
                  mode.active ? "active" : "",
                  index < MODES.length - 1 ? "border-b-2 border-ink" : "",
                ].join(" ")}
              >
                <div className="mode-icon flex h-[38px] w-[38px] shrink-0 items-center justify-center border-2 border-ink bg-pale text-[1.1rem]">
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <p className="mode-name font-grotesk text-[0.9rem] font-bold text-ink">
                    {mode.name}
                  </p>
                  <p className="mode-desc mt-px text-[0.78rem] text-mid">
                    {mode.description}
                  </p>
                </div>
                <span className="mode-arrow text-[1rem] text-mid">→</span>
              </a>
            ))}
          </div>
        </div>

        <ModesPreview />
      </div>
    </section>
  );
}

export default Modes;
