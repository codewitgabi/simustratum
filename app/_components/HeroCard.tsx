const BAR_COLORS = [
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
  "bg-camel",
  "bg-sienna",
];

function HeroCard() {
  return (
    <div className="border-[3px] border-ink bg-white p-7 shadow-neu-lg">
      <div className="mb-5 flex items-center justify-between border-b-2 border-ink pb-5">
        <span className="border-2 border-ink bg-sienna px-3 py-[5px] font-grotesk text-[0.68rem] font-bold tracking-[0.1em] text-white uppercase">
          Project Defense
        </span>
        <span className="flex items-center gap-1.5 border-2 border-ink bg-pale px-[10px] py-1 font-grotesk text-[0.68rem] font-bold tracking-[0.06em] text-green uppercase">
          <span className="blink h-[7px] w-[7px] rounded-full bg-green" />
          Session live
        </span>
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-center gap-3 border-2 border-ink bg-pale px-[14px] py-[10px]">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center border-2 border-ink bg-[#FDEBD0] font-grotesk text-[0.75rem] font-bold">
            Dr
          </div>
          <div>
            <div className="text-[0.8rem] font-bold text-ink">Dr. Okafor</div>
            <div className="text-[0.65rem] text-mid">
              Strict · Research Methods
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 border-2 border-ink bg-pale px-[14px] py-[10px]">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center border-2 border-ink bg-[#D5E8D4] font-grotesk text-[0.75rem] font-bold">
            Pr
          </div>
          <div>
            <div className="text-[0.8rem] font-bold text-ink">Prof. Amara</div>
            <div className="text-[0.65rem] text-mid">Curious · Theory</div>
          </div>
        </div>
      </div>

      <div className="mb-4 border-2 border-ink bg-pale px-4 py-[14px]">
        <p className="mb-2.5 font-grotesk text-[0.62rem] font-bold tracking-[0.1em] text-mid uppercase">
          Analyzing your voice…
        </p>
        <div className="flex h-8 items-center gap-[3px]">
          {BAR_COLORS.map((color, i) => (
            <div key={i} className={`bar flex-1 ${color}`} />
          ))}
        </div>
      </div>

      <div className="border-2 border-ink bg-ink p-4 text-white">
        <p className="mb-1.5 font-grotesk text-[0.62rem] font-bold tracking-[0.08em] text-camel uppercase">
          Dr. Okafor →
        </p>
        <p className="text-[0.82rem] leading-[1.55]">
          &ldquo;Your methodology mentions convenience sampling. How do you
          justify this choice given the limitations you acknowledged in chapter
          three?&rdquo;
        </p>
      </div>
    </div>
  );
}

export default HeroCard;
