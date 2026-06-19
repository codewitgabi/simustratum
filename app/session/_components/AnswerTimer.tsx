type AnswerTimerProps = {
  secondsLeft: number;
};

function AnswerTimer({ secondsLeft }: AnswerTimerProps) {
  const urgent = secondsLeft <= 10;

  return (
    <div
      className={`pointer-events-none absolute top-32 right-3 z-65 flex flex-col items-center border px-3 py-2 sm:right-4 ${
        urgent ? "border-red-500/60 bg-red-500/15" : "border-camel/25 bg-ink/85"
      }`}
    >
      <span
        className={`font-grotesk text-xl font-bold leading-none ${urgent ? "text-red-400" : "text-white"}`}
      >
        {secondsLeft}
      </span>
      <span className="font-grotesk text-[0.58rem] font-bold tracking-[0.06em] text-white/35 uppercase">
        Seconds
      </span>
    </div>
  );
}

export default AnswerTimer;
