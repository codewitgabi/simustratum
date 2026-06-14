const STEPS = [
  {
    num: "01",
    title: "Choose your scenario",
    description:
      "Pick from defense, seminar, oral exam, presentation, tutorial, or English proficiency mode.",
  },
  {
    num: "02",
    title: "Set up your panelists",
    description:
      "Select the number of AI panelists and their personalities — strict, inquisitive, or balanced.",
  },
  {
    num: "03",
    title: "Speak when ready",
    description:
      "Present your topic or answer questions in real time. The AI listens and responds like a real panel would.",
  },
  {
    num: "04",
    title: "Review and improve",
    description:
      "Get detailed feedback, a session score, and specific points to address before your next run.",
  },
];

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="how-header">
        <div>
          <span className="section-eyebrow">The process</span>
          <h2 className="section-title">Four steps from setup to speaking</h2>
        </div>
        <p className="section-sub">
          Run your first practice session in under three minutes. No setup, no
          friction — just speak.
        </p>
      </div>

      <div className="steps">
        {STEPS.map((step) => (
          <div key={step.num} className="step">
            <div className="step-num">{step.num}</div>
            <div className="step-title">{step.title}</div>
            <p className="step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
