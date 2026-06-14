import CtaSection from "./_components/CtaSection";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Marquee from "./_components/Marquee";
import Modes from "./_components/Modes";
import Nav from "./_components/Nav";
import Proof from "./_components/Proof";

function Page() {
  return (
    <>
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
