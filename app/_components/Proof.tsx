const TESTIMONIALS = [
  {
    quote:
      "I ran six sessions the week before my thesis defense. The panelists asked harder questions than my actual committee did. I came out looking like I'd done this a hundred times.",
    initials: "AO",
    avatarBg: "bg-[#FDEBD0]",
    name: "Adaeze Okonkwo",
    info: "MSc Public Health, UNILAG",
    cardBg: "bg-white",
    borders:
      "border-r-2 border-ink max-[1100px]:border-r-0 max-[1100px]:border-b-2 min-[1101px]:border-r-2",
  },
  {
    quote:
      "English is my third language. The proficiency mode helped me stop translating in my head and just speak. My lecturer said my oral was among the best in the cohort.",
    initials: "KM",
    avatarBg: "bg-[#D5E8D4]",
    name: "Kwame Mensah",
    info: "BSc Computer Science, UG Legon",
    cardBg: "bg-cream",
    borders:
      "border-r-2 border-ink max-[1100px]:border-r-0 max-[1100px]:border-b-2 min-[1101px]:border-r-2",
  },
  {
    quote:
      "After three weeks with Simustratum, I presented at our faculty symposium and got a standing ovation. I had been avoiding presentations my entire undergrad. I still can't believe it.",
    initials: "FB",
    avatarBg: "bg-[#DAE8FC]",
    name: "Fatima Bah",
    info: "LLB Law, ABU Zaria",
    cardBg: "bg-white",
    borders: "max-[1100px]:border-r-0 max-[1100px]:border-b-0",
  },
];

function Proof() {
  return (
    <section
      id="proof"
      className="bg-pale px-5 py-[60px] sm:px-8 sm:py-20 min-[1101px]:px-[60px] min-[1101px]:py-[100px]"
    >
      <div className="mb-14 text-center">
        <span className="mb-5 inline-block border-2 border-ink bg-pale px-3 py-1 font-grotesk text-[0.68rem] font-bold tracking-[0.12em] text-sienna uppercase">
          Student stories
        </span>
        <h2 className="mb-3 font-grotesk text-[clamp(1.9rem,3.5vw,2.8rem)] leading-[1.1] font-bold tracking-[-1px] text-ink">
          Passed their defense. Started here.
        </h2>
        <p className="mx-auto max-w-[480px] text-[0.975rem] leading-[1.75] text-mid">
          Students across disciplines use Simustratum to walk into high-stakes
          moments with real confidence — not just hope.
        </p>
      </div>

      <div className="grid grid-cols-1 border-2 border-ink shadow-neu-lg min-[1101px]:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className={[
              "px-7 py-8 transition-colors duration-150 hover:bg-pale",
              testimonial.cardBg,
              testimonial.borders,
            ].join(" ")}
          >
            <div className="mb-[18px] flex gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[0.85rem] text-sienna">
                  ★
                </span>
              ))}
            </div>
            <p className="mb-6 text-[0.875rem] leading-[1.75] text-mid">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 border-t-2 border-ink pt-5">
              <div
                className={`flex h-[38px] w-[38px] items-center justify-center border-2 border-ink font-grotesk text-[0.8rem] font-bold ${testimonial.avatarBg}`}
              >
                {testimonial.initials}
              </div>
              <div>
                <p className="font-grotesk text-[0.875rem] font-bold text-ink">
                  {testimonial.name}
                </p>
                <p className="text-[0.72rem] text-mid">{testimonial.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Proof;
