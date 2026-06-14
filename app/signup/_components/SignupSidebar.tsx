import SignupLogo from "@/components/SignupLogo";
import FeatureRow from "./FeatureRow";

const FEATURES = [
  "AI panelists that ask hard, real questions",
  "5 academic scenarios — defense, oral, seminar & more",
  "Instant feedback on clarity, pacing & content",
  "English proficiency coaching built in",
];

function SignupSidebar() {
  const year = new Date().getFullYear();

  return (
    <aside className="relative hidden min-h-screen w-[42%] flex-col justify-between overflow-hidden border-r-2 border-ink bg-ink px-12 py-10 lg:flex hatch-sidebar">
      <SignupLogo variant="dark" className="self-start" />

      <div className="my-auto flex flex-col gap-8 py-16">
        <div>
          <span className="mb-6 inline-block border border-camel/40 px-3 py-1 font-grotesk text-[0.65rem] font-bold tracking-[0.14em] text-camel uppercase">
            Your first session is free
          </span>
          <h2 className="mb-4 font-grotesk text-[2.6rem] leading-[1.06] font-bold tracking-[-1.5px] text-white">
            Your defense
            <br />
            date isn&apos;t
            <br />
            <span className="text-camel">moving.</span>
          </h2>
          <p className="max-w-[300px] text-[0.9rem] leading-[1.75] text-white/50">
            Join students practicing with AI panelists before the real thing.
            Start today, no credit card needed.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FEATURES.map((label) => (
            <FeatureRow key={label} label={label} />
          ))}
        </div>
      </div>

      <p className="font-inter text-[0.72rem] tracking-wide text-white/30">
        © {year} Simustratum — Practice. Speak. Defend.
      </p>

      <div
        className="absolute right-0 bottom-0 h-24 w-24 border-t-2 border-l-2 border-camel/30"
        aria-hidden
      />
      <div
        className="absolute top-0 right-0 h-16 w-16 border-b-2 border-l-2 border-camel/20"
        aria-hidden
      />
    </aside>
  );
}

export default SignupSidebar;
