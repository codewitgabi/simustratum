import HeroCard from "./HeroCard";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-stripe" aria-hidden />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          AI-Powered Academic Practice
        </div>

        <h1>
          Stop rehearsing
          <br />
          in your head.
          <br />
          <span className="highlight">Speak out loud.</span>
        </h1>

        <p className="hero-sub">
          Simustratum puts you in front of AI panelists who ask hard questions —
          just like in your real defense, seminar, or oral exam. Practice until
          it feels easy.
        </p>

        <div className="hero-actions">
          <a href="#" className="btn-primary">
            Start practicing free
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#how" className="btn-secondary">
            See how it works
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 2v10M3 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">
              5<span>+</span>
            </div>
            <div className="stat-label">Practice modes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              24<span>/7</span>
            </div>
            <div className="stat-label">Always available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              100<span>%</span>
            </div>
            <div className="stat-label">Judgment-free</div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <HeroCard />
      </div>
    </section>
  );
}

export default Hero;
