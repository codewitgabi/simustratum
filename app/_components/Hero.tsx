import HeroCard from "./HeroCard";

function Hero() {
  return (
    <section className="relative grid min-h-screen items-center gap-10 bg-cream px-5 pt-[90px] pb-[60px] max-sm:px-5 sm:px-8 sm:pt-[100px] sm:pb-20 min-[1101px]:grid-cols-[1fr_420px] min-[1101px]:gap-20 min-[1101px]:px-[60px]">
      <div
        className="hatch pointer-events-none absolute top-0 right-0 z-0 h-[260px] w-[260px] border-b-2 border-l-2 border-ink"
        aria-hidden
      />

      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center gap-2.5 border-2 border-ink bg-pale px-4 py-[7px] shadow-neu-sm">
          <span className="blink h-2 w-2 shrink-0 rounded-full border border-ink bg-green" />
          <span className="font-grotesk text-[0.72rem] font-bold tracking-widest text-sienna uppercase">
            AI-Powered Academic Practice
          </span>
        </div>

        <h1 className="mb-7 font-grotesk text-[2.6rem] leading-none font-bold tracking-[-2px] text-ink sm:text-[clamp(3rem,5.5vw,5rem)]">
          Stop rehearsing
          <br />
          in your head.
          <br />
          <span className="inline-block bg-sienna px-[10px] text-white">
            Speak out loud.
          </span>
        </h1>

        <p className="mb-11 max-w-[460px] text-[1.05rem] leading-[1.75] text-mid">
          Simustratum puts you in front of AI panelists who ask hard questions —
          just like in your real defense, seminar, or oral exam. Practice until
          it feels easy.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="neu-press inline-flex items-center gap-2.5 border-[3px] border-ink bg-sienna px-7 py-[14px] font-grotesk text-[0.95rem] font-bold text-white no-underline shadow-neu-md"
          >
            Start practicing free
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#how"
            className="neu-press inline-flex items-center gap-2.5 border-[3px] border-ink bg-white px-6 py-[14px] font-grotesk text-[0.95rem] font-bold text-ink no-underline shadow-neu-md hover:bg-pale"
          >
            See how it works
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 2v10M3 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="mt-14 flex max-sm:flex-col border-2 border-ink bg-white shadow-neu-md sm:flex-row">
          <div className="flex-1 px-6 py-5 max-sm:border-b-2 max-sm:border-ink sm:border-r-2 sm:border-ink">
            <p className="font-grotesk text-[1.9rem] leading-none font-bold tracking-[-1px] text-sienna">
              5<span>+</span>
            </p>
            <p className="mt-1 text-[0.75rem] font-semibold tracking-[0.06em] text-mid uppercase">
              Practice modes
            </p>
          </div>
          <div className="flex-1 px-6 py-5 max-sm:border-b-2 max-sm:border-ink sm:border-r-2 sm:border-ink">
            <p className="font-grotesk text-[1.9rem] leading-none font-bold tracking-[-1px] text-sienna">
              24<span>/7</span>
            </p>
            <p className="mt-1 text-[0.75rem] font-semibold tracking-[0.06em] text-mid uppercase">
              Always available
            </p>
          </div>
          <div className="flex-1 px-6 py-5">
            <p className="font-grotesk text-[1.9rem] leading-none font-bold tracking-[-1px] text-sienna">
              100<span>%</span>
            </p>
            <p className="mt-1 text-[0.75rem] font-semibold tracking-[0.06em] text-mid uppercase">
              Judgment-free
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden min-[1101px]:block">
        <HeroCard />
      </div>
    </section>
  );
}

export default Hero;
