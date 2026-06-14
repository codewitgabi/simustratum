import SessionScoreMetric from "./SessionScoreMetric";

function LastSessionCard() {
  return (
    <div className="flex flex-col gap-4 border-2 border-camel/30 bg-white/5 p-5 shadow-[4px_4px_0_rgba(193,154,107,0.18)]">
      <div className="flex items-center justify-between">
        <span className="font-grotesk text-2xs font-bold tracking-widest] text-camel uppercase">
          Last session
        </span>
        <span className="font-grotesk text-2xs text-white/30">2 days ago</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-camel/30 bg-sienna/80 text-base">
            🎓
          </span>
          <div>
            <p className="font-grotesk text-[0.82rem] font-bold text-white">
              Project Defense
            </p>
            <p className="text-[0.68rem] text-white/40">
              Dr. Okafor · Prof. Amara
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-grotesk text-[1.3rem] leading-none font-bold text-camel">
            82
          </p>
          <p className="text-[0.6rem] tracking-wide text-white/30 uppercase">
            score
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
        <SessionScoreMetric label="Clarity" value={82} />
        <SessionScoreMetric label="Conf." value={74} />
        <SessionScoreMetric label="Struct." value={91} />
      </div>
    </div>
  );
}

export default LastSessionCard;
