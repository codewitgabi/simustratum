const MODES = [
  {
    icon: "📝",
    name: "Tutorial Practice",
    description: "Answer tutor questions, explain concepts clearly",
    active: true,
  },
  {
    icon: "📺",
    name: "Presentation",
    description: "Deliver slides, handle Q&A from the floor",
  },
  {
    icon: "🎓",
    name: "Project Defense",
    description: "Face a panel, defend your methodology and findings",
  },
  {
    icon: "✍️",
    name: "Oral Examination",
    description: "Rapid-fire course questions under exam conditions",
  },
  {
    icon: "🌍",
    name: "English Proficiency",
    description: "Pronunciation, fluency, and academic vocabulary drills",
  },
];

const FEEDBACK = [
  {
    type: "good" as const,
    strong: "Strong opening.",
    text: " Your intro clearly established the research gap and relevance.",
  },
  {
    type: "warn" as const,
    strong: "Pacing on Q3.",
    text: " You hesitated 4s before the methodology question. Practice this transition.",
  },
  {
    type: "warn" as const,
    strong: "Filler words.",
    text: ' "Basically" appeared 7 times. Replace with a brief pause.',
  },
  {
    type: "good" as const,
    strong: "Content accuracy.",
    text: " All factual claims in your conclusion were well-supported and clear.",
  },
];

function ModesPreview() {
  return (
    <div className="modes-preview">
      <div className="preview-header">
        <div className="preview-label">Session report</div>
        <div className="preview-title">After your practice run</div>
      </div>

      <div className="score-block">
        <div className="score-item">
          <div className="score-val">82</div>
          <div className="score-lbl">Clarity</div>
        </div>
        <div className="score-item">
          <div className="score-val">74</div>
          <div className="score-lbl">Confidence</div>
        </div>
        <div className="score-item">
          <div className="score-val">91</div>
          <div className="score-lbl">Structure</div>
        </div>
      </div>

      {FEEDBACK.map((item) => (
        <div key={item.strong} className="feedback-item">
          <div
            className={`feedback-dot fd-${item.type === "good" ? "good" : "warn"}`}
          />
          <div className="feedback-text">
            <strong>{item.strong}</strong>
            {item.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function Modes() {
  return (
    <section className="modes" id="modes">
      <div className="modes-inner">
        <div>
          <span className="section-eyebrow">Practice modes</span>
          <h2 className="section-title">
            Pick the room you&apos;re walking into
          </h2>
          <p className="section-sub">
            Each mode is calibrated to the expectations and pressure of that
            specific academic setting.
          </p>

          <div className="modes-list">
            {MODES.map((mode) => (
              <a
                key={mode.name}
                href="#"
                className={`mode-item${mode.active ? " active" : ""}`}
              >
                <div className="mode-icon">{mode.icon}</div>
                <div className="mode-info">
                  <div className="mode-name">{mode.name}</div>
                  <div className="mode-desc">{mode.description}</div>
                </div>
                <span className="mode-arrow">→</span>
              </a>
            ))}
          </div>
        </div>

        <ModesPreview />
      </div>
    </section>
  );
}

export default Modes;
