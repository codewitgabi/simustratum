const STEPS = [
  {
    num: "01",
    title: "Choose your scenario",
    description:
      "Pick from defense, seminar, oral exam, presentation, tutorial, or English proficiency mode.",
    bg: "bg-white",
  },
  {
    num: "02",
    title: "Set up your panelists",
    description:
      "Select the number of AI panelists and their personalities — strict, inquisitive, or balanced.",
    bg: "bg-cream",
  },
  {
    num: "03",
    title: "Speak when ready",
    description:
      "Present your topic or answer questions in real time. The AI listens and responds like a real panel would.",
    bg: "bg-white",
  },
  {
    num: "04",
    title: "Review and improve",
    description:
      "Get detailed feedback, a session score, and specific points to address before your next run.",
    bg: "bg-cream",
  },
];

const stepsGridClass = [
  "grid grid-cols-1 border-2 border-ink shadow-neu-lg",
  "sm:max-[1100px]:grid-cols-2",
  "min-[1101px]:grid-cols-4",
  // Mobile — single column stack
  "max-sm:[&>*]:border-r-0 max-sm:[&>*]:border-b-2 max-sm:[&>*]:border-ink",
  "max-sm:[&>*]:border-t-0 max-sm:[&>*:last-child]:border-b-0",
  // Tablet — 2×2 grid
  "sm:max-[1100px]:[&>*]:border-r-2 sm:max-[1100px]:[&>*]:border-ink",
  "sm:max-[1100px]:[&>*]:border-b-0 sm:max-[1100px]:[&>*]:border-t-0",
  "sm:max-[1100px]:[&>*:nth-child(2)]:border-r-0",
  "sm:max-[1100px]:[&>*:nth-child(3)]:border-t-2",
  "sm:max-[1100px]:[&>*:nth-child(4)]:border-r-0 sm:max-[1100px]:[&>*:nth-child(4)]:border-t-2",
  // Desktop — 4 columns
  "min-[1101px]:[&>*]:border-r-2 min-[1101px]:[&>*]:border-ink",
  "min-[1101px]:[&>*]:border-b-0 min-[1101px]:[&>*]:border-t-0",
  "min-[1101px]:[&>*:last-child]:border-r-0",
].join(" ");

function HowItWorks() {
  return (
    <section
      id="how"
      className="bg-pale px-5 py-[60px] sm:px-8 sm:py-20 min-[1101px]:px-[60px] min-[1101px]:py-[100px]"
    >
      <div className="mb-16 grid grid-cols-1 items-end gap-6 min-[1101px]:grid-cols-2 min-[1101px]:gap-[60px]">
        <div>
          <span className="mb-5 inline-block border-2 border-ink bg-pale px-3 py-1 font-grotesk text-[0.68rem] font-bold tracking-[0.12em] text-sienna uppercase">
            The process
          </span>
          <h2 className="max-w-[600px] font-grotesk text-[clamp(1.9rem,3.5vw,2.8rem)] leading-[1.1] font-bold tracking-[-1px] text-ink">
            Four steps from setup to speaking
          </h2>
        </div>
        <p className="max-w-[480px] text-[0.975rem] leading-[1.75] text-mid min-[1101px]:justify-self-end">
          Run your first practice session in under three minutes. No setup, no
          friction — just speak.
        </p>
      </div>

      <div className={stepsGridClass}>
        {STEPS.map((step) => (
          <div key={step.num} className={`px-6 py-8 ${step.bg}`}>
            <p className="mb-5 font-grotesk text-[2.4rem] leading-none font-bold tracking-[-2px] text-sienna opacity-35">
              {step.num}
            </p>
            <p className="mb-2.5 font-grotesk text-[0.95rem] font-bold tracking-[-0.2px] text-ink">
              {step.title}
            </p>
            <p className="text-[0.82rem] leading-[1.65] text-mid">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
