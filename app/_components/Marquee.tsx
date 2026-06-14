const MARQUEE_ITEMS = [
  "Tutorial Practice",
  "Project Defense",
  "Oral Examination",
  "Seminar Defense",
  "English Proficiency",
  "Presentation Skills",
  "Real AI Panelists",
  "Instant Feedback",
];

function MarqueeItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-[14px] border-r border-white/10 px-7 font-grotesk text-[0.8rem] font-bold tracking-[0.1em] whitespace-nowrap text-cream uppercase">
      <span className="inline-block h-2 w-2 shrink-0 border border-white/30 bg-camel" />
      {label}
    </span>
  );
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-[14px]">
      <div className="marquee-inner flex w-max">
        {items.map((label, index) => (
          <MarqueeItem key={`${label}-${index}`} label={label} />
        ))}
      </div>
    </div>
  );
}

export default Marquee;
