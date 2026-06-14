import Logo from "@/components/Logo";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: ["Features", "Practice Modes", "How it works", "Pricing"],
  },
  {
    title: "Support",
    links: ["Getting started", "FAQs", "Contact us"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms", "Cookies"],
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grid grid-cols-1 items-start gap-10 border-t-[3px] border-ink bg-cream px-5 py-10 sm:px-8 min-[1101px]:grid-cols-[280px_1fr] min-[1101px]:gap-20 min-[1101px]:px-[60px] min-[1101px]:py-[60px]">
      <div>
        <Logo className="mb-4" />
        <p className="max-w-[220px] text-[0.82rem] leading-[1.6] text-mid">
          AI-powered academic practice that meets you where the anxiety starts.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-8 min-[1101px]:grid-cols-4">
          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <p className="mb-4 border-b-2 border-ink pb-2.5 font-grotesk text-[0.68rem] font-bold tracking-widest text-ink uppercase">
                {column.title}
              </p>
              {column.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="mb-2.5 block text-[0.85rem] text-mid no-underline transition-colors hover:text-sienna last:mb-0"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t-2 border-ink pt-6 min-[1101px]:flex-row min-[1101px]:items-center">
          <span className="text-[0.78rem] text-mid">
            © {year} Simustratum. All rights reserved.
          </span>
          <span className="text-[0.78rem] text-mid">
            Built for students, by people who&apos;ve been there.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
