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
    <span className="marquee-item">
      <span className="tag-box" />
      {label}
    </span>
  );
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {items.map((label, index) => (
          <MarqueeItem key={`${label}-${index}`} label={label} />
        ))}
      </div>
    </div>
  );
}

export default Marquee;
