import CtaSection from "./_components/CtaSection";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Marquee from "./_components/Marquee";
import Modes from "./_components/Modes";
import Nav from "./_components/Nav";
import Proof from "./_components/Proof";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Modes />
      <Proof />
      <CtaSection />
      <Footer />
    </>
  );
}

export default Page;
