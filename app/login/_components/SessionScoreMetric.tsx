type SessionScoreMetricProps = {
  label: string;
  value: number;
};

function SessionScoreMetric({ label, value }: SessionScoreMetricProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="font-grotesk text-[0.58rem] tracking-wide text-white/40 uppercase">
          {label}
        </span>
        <span className="font-grotesk text-[0.58rem] font-bold text-camel">
          {value}
        </span>
      </div>
      <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-camel"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default SessionScoreMetric;
