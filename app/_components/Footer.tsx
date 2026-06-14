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
  return (
    <footer>
      <div className="footer-brand">
        <div className="footer-logo">
          <Logo />
        </div>
        <p className="footer-tagline">
          AI-powered academic practice that meets you where the anxiety starts.
        </p>
      </div>

      <div>
        <div className="footer-links">
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="footer-col">
              <div className="footer-col-title">{column.title}</div>
              {column.links.map((link) => (
                <a key={link} href="#">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">
            © 2025 Simustratum. All rights reserved.
          </span>
          <span className="footer-copy">
            Built for students, by people who&apos;ve been there.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
