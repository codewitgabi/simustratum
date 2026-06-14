const TESTIMONIALS = [
  {
    quote:
      "I ran six sessions the week before my thesis defense. The panelists asked harder questions than my actual committee did. I came out looking like I'd done this a hundred times.",
    initials: "AO",
    avatarClass: "ta1",
    name: "Adaeze Okonkwo",
    info: "MSc Public Health, UNILAG",
  },
  {
    quote:
      "English is my third language. The proficiency mode helped me stop translating in my head and just speak. My lecturer said my oral was among the best in the cohort.",
    initials: "KM",
    avatarClass: "ta2",
    name: "Kwame Mensah",
    info: "BSc Computer Science, UG Legon",
  },
  {
    quote:
      "After three weeks with Simustratum, I presented at our faculty symposium and got a standing ovation. I had been avoiding presentations my entire undergrad. I still can't believe it.",
    initials: "FB",
    avatarClass: "ta3",
    name: "Fatima Bah",
    info: "LLB Law, ABU Zaria",
  },
];

function Proof() {
  return (
    <section className="proof" id="proof">
      <div className="proof-header">
        <span className="section-eyebrow">Student stories</span>
        <h2 className="section-title">Passed their defense. Started here.</h2>
        <p className="section-sub">
          Students across disciplines use Simustratum to walk into high-stakes
          moments with real confidence — not just hope.
        </p>
      </div>

      <div className="testimonials">
        {TESTIMONIALS.map((testimonial) => (
          <div key={testimonial.name} className="testi">
            <div className="testi-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="star">
                  ★
                </span>
              ))}
            </div>
            <p className="testi-quote">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="testi-author">
              <div className={`testi-avatar ${testimonial.avatarClass}`}>
                {testimonial.initials}
              </div>
              <div>
                <div className="testi-name">{testimonial.name}</div>
                <div className="testi-info">{testimonial.info}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Proof;
