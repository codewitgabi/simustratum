function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-hatch" aria-hidden />
      <div className="cta-inner">
        <div className="cta-eyebrow">Ready when you are</div>
        <h2 className="cta-title">
          Your defense date
          <br />
          isn&apos;t moving.
          <br />
          <em>But your confidence can.</em>
        </h2>
        <p className="cta-sub">
          Join students who stopped dreading academic speaking — and started
          owning it.
        </p>
        <a href="#" className="btn-cta-white">
          Start your first session free
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

export default CtaSection;
