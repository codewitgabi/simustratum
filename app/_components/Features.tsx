const FEATURES = [
  {
    icon: "🎙️",
    title: "AI Panelists With Personality",
    description:
      "Choose from strict examiners, curious professors, or skeptical reviewers. Each has a distinct style and asks questions you won't see coming.",
    tag: "Signature Feature",
    featured: true,
  },
  {
    icon: "🧠",
    title: "Real-Time Feedback",
    description:
      "Get scored on clarity, confidence, structure, and accuracy immediately after each response. Know exactly what to fix.",
    tag: "Instant",
  },
  {
    icon: "📊",
    title: "Performance Tracking",
    description:
      "Sessions are logged so you can watch your progress over time — pacing, filler words, and accuracy all in one view.",
    tag: "Over Time",
  },
  {
    icon: "🗣️",
    title: "English Proficiency Coach",
    description:
      "Pronunciation, grammar under pressure, academic vocabulary. Designed for students presenting in a second language.",
    tag: "Language",
  },
  {
    icon: "🎯",
    title: "Scenario Customization",
    description:
      "Upload your abstract or project title and the AI tailors every question to your actual work, not a generic template.",
    tag: "Personalized",
  },
  {
    icon: "🔒",
    title: "No Audience, No Shame",
    description:
      "Make mistakes freely. Ask to repeat questions. Start over. This is your space to get it wrong until you get it right.",
    tag: "Safe Space",
  },
];

const featureGridClass = [
  "grid grid-cols-1 border-2 border-ink shadow-neu-lg",
  "sm:max-[1100px]:grid-cols-2",
  "min-[1101px]:grid-cols-3",
  // Mobile — single column, horizontal dividers only
  "max-sm:[&>*]:border-b-2 max-sm:[&>*]:border-r-0 max-sm:[&>*]:border-ink",
  "max-sm:[&>*:last-child]:border-b-0",
  // Tablet — 2 columns
  "sm:max-[1100px]:[&>*]:border-r-2 sm:max-[1100px]:[&>*]:border-b-2 sm:max-[1100px]:[&>*]:border-ink",
  "sm:max-[1100px]:[&>*:nth-child(2n)]:border-r-0",
  "sm:max-[1100px]:[&>*:nth-last-child(-n+2)]:border-b-0",
  // Desktop — 3 columns
  "min-[1101px]:[&>*]:border-r-2 min-[1101px]:[&>*]:border-b-2 min-[1101px]:[&>*]:border-ink",
  "min-[1101px]:[&>*:nth-child(3n)]:border-r-0",
  "min-[1101px]:[&>*:nth-child(n+4)]:border-b-0",
].join(" ");

function Features() {
  return (
    <section
      id="features"
      className="bg-cream px-5 py-[60px] sm:px-8 sm:py-20 min-[1101px]:px-[60px] min-[1101px]:py-[100px]"
    >
      <div className="mb-14 grid grid-cols-1 items-end gap-6 min-[1101px]:grid-cols-2 min-[1101px]:gap-10">
        <div>
          <span className="mb-5 inline-block border-2 border-ink bg-pale px-3 py-1 font-grotesk text-[0.68rem] font-bold tracking-[0.12em] text-sienna uppercase">
            What you get
          </span>
          <h2 className="max-w-[600px] font-grotesk text-[clamp(1.9rem,3.5vw,2.8rem)] leading-[1.1] font-bold tracking-[-1px] text-ink">
            Every scenario you&apos;ll face, before you face it
          </h2>
        </div>
        <p className="max-w-[480px] text-[0.975rem] leading-[1.75] text-mid min-[1101px]:justify-self-end">
          Simustratum simulates real academic pressure so that when the actual
          moment comes, your brain has already been there before.
        </p>
      </div>

      <div className={featureGridClass}>
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={[
              "cursor-default px-7 py-8 transition-colors duration-150",
              feature.featured
                ? "bg-sienna hover:bg-[#8B4220]"
                : "bg-white hover:bg-pale",
            ].join(" ")}
          >
            <div
              className={[
                "mb-5 flex h-11 w-11 items-center justify-center text-[1.2rem]",
                feature.featured
                  ? "border border-white/40 bg-white/15"
                  : "border-2 border-ink bg-pale",
              ].join(" ")}
            >
              {feature.icon}
            </div>
            <p
              className={[
                "mb-2.5 font-grotesk text-[1rem] font-bold tracking-[-0.2px]",
                feature.featured ? "text-white" : "text-ink",
              ].join(" ")}
            >
              {feature.title}
            </p>
            <p
              className={[
                "text-[0.85rem] leading-[1.65]",
                feature.featured ? "text-white/72" : "text-mid",
              ].join(" ")}
            >
              {feature.description}
            </p>
            <span
              className={[
                "mt-[18px] inline-block px-[9px] py-[3px] font-grotesk text-xxs font-bold tracking-[0.09em] uppercase",
                feature.featured
                  ? "border-[1.5px] border-white/50 text-white/85"
                  : "border-[1.5px] border-ink text-ink",
              ].join(" ")}
            >
              {feature.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
