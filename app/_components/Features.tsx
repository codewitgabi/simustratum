const FEATURES = [
  {
    icon: "🎙️",
    title: "AI Panelists With Personality",
    description:
      "Choose from strict examiners, curious professors, or skeptical reviewers. Each has a distinct style and asks questions you won't see coming.",
    tag: "Signature Feature",
    featured: true,
  },
  {
    icon: "🧠",
    title: "Real-Time Feedback",
    description:
      "Get scored on clarity, confidence, structure, and accuracy immediately after each response. Know exactly what to fix.",
    tag: "Instant",
  },
  {
    icon: "📊",
    title: "Performance Tracking",
    description:
      "Sessions are logged so you can watch your progress over time — pacing, filler words, and accuracy all in one view.",
    tag: "Over Time",
  },
  {
    icon: "🗣️",
    title: "English Proficiency Coach",
    description:
      "Pronunciation, grammar under pressure, academic vocabulary. Designed for students presenting in a second language.",
    tag: "Language",
  },
  {
    icon: "🎯",
    title: "Scenario Customization",
    description:
      "Upload your abstract or project title and the AI tailors every question to your actual work, not a generic template.",
    tag: "Personalized",
  },
  {
    icon: "🔒",
    title: "No Audience, No Shame",
    description:
      "Make mistakes freely. Ask to repeat questions. Start over. This is your space to get it wrong until you get it right.",
    tag: "Safe Space",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <div>
          <span className="section-eyebrow">What you get</span>
          <h2 className="section-title">
            Every scenario you&apos;ll face, before you face it
          </h2>
        </div>
        <p className="section-sub">
          Simustratum simulates real academic pressure so that when the actual
          moment comes, your brain has already been there before.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={`feature-card${feature.featured ? " featured" : ""}`}
          >
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-title">{feature.title}</div>
            <p className="feature-desc">{feature.description}</p>
            <span className="feature-tag">{feature.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
