function WaveformBars() {
  const bars = Array.from({ length: 20 }, (_, i) => (
    <div key={i} className={`bar${i % 2 === 0 ? " alt" : ""}`} />
  ));

  return (
    <div className="waveform-block">
      <div className="wave-label">Analyzing your voice…</div>
      <div className="wave-bars">{bars}</div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="hero-card">
      <div className="card-tag-row">
        <span className="scenario-tag">Project Defense</span>
        <span className="live-badge">
          <span className="dot" />
          Session live
        </span>
      </div>

      <div className="panelists">
        <div className="panelist">
          <div className="panelist-avatar pa1">Dr</div>
          <div>
            <div className="panelist-name">Dr. Okafor</div>
            <div className="panelist-role">Strict · Research Methods</div>
          </div>
        </div>
        <div className="panelist">
          <div className="panelist-avatar pa2">Pr</div>
          <div>
            <div className="panelist-name">Prof. Amara</div>
            <div className="panelist-role">Curious · Theory</div>
          </div>
        </div>
      </div>

      <WaveformBars />

      <div className="question-bubble">
        <div className="who">Dr. Okafor →</div>
        <p>
          &ldquo;Your methodology mentions convenience sampling. How do you
          justify this choice given the limitations you acknowledged in chapter
          three?&rdquo;
        </p>
      </div>
    </div>
  );
}

export default HeroCard;
