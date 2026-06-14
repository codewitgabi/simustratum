import Link from "next/link";

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-[60px] sm:px-8 sm:py-20 min-[1101px]:px-[60px] min-[1101px]:py-[100px]">
      <div
        className="hatch-cta absolute right-0 bottom-0 h-[300px] w-[300px] border-t border-l border-camel/25"
        aria-hidden
      />

      <div className="relative z-10 max-w-[680px]">
        <span className="mb-6 inline-block border-2 border-white/30 bg-sienna px-[14px] py-1 font-grotesk text-[0.68rem] font-bold tracking-widest text-white uppercase shadow-neu-sienna-soft">
          Ready when you are
        </span>
        <h2 className="mb-5 font-grotesk text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] font-bold tracking-[-1.5px] text-white">
          Your defense date
          <br />
          isn&apos;t moving.
          <br />
          <em className="text-camel not-italic">But your confidence can.</em>
        </h2>
        <p className="mb-11 max-w-[420px] text-[1rem] leading-[1.7] text-white/50">
          Join students who stopped dreading academic speaking — and started
          owning it.
        </p>
        <Link
          href="/signup"
          className="neu-press inline-flex items-center gap-3 border-[3px] border-ink bg-white px-8 py-4 font-grotesk text-[1rem] font-bold text-ink no-underline shadow-neu-camel"
        >
          Start your first session free
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default CtaSection;
