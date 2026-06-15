import type { ScenarioId } from "@/lib/dashboard-data";

type ScenarioCardProps = {
  id: ScenarioId;
  icon: string;
  title: string;
  description: string;
  tag: string;
  selected: boolean;
  onSelect: (id: ScenarioId) => void;
};

function ScenarioCard({
  id,
  icon,
  title,
  description,
  tag,
  selected,
  onSelect,
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={[
        "scenario-card border-2 border-ink bg-white p-4 text-left shadow-[4px_4px_0_#1A1109] sm:p-6",
        selected ? "selected" : "",
      ].join(" ")}
    >
      <div className="sc-icon mb-4 flex h-11 w-11 items-center justify-center border-2 border-ink bg-pale text-[1.3rem]">
        {icon}
      </div>
      <p className="sc-title mb-1.5 font-grotesk text-[0.95rem] font-bold text-ink">
        {title}
      </p>
      <p className="sc-desc mb-4 text-[0.8rem] leading-[1.6] text-mid">
        {description}
      </p>
      <span className="sc-tag inline-block border border-ink/30 px-2 py-1 font-grotesk text-[0.62rem] font-bold tracking-[0.08em] text-mid uppercase">
        {tag}
      </span>
    </button>
  );
}

export default ScenarioCard;
