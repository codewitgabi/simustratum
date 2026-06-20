import type { Metadata } from "next";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "Careers",
  description: "We're not hiring yet, but here's what we'd look for when we are.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers · Simustratum",
    description: "We're not hiring yet, but here's what we'd look for when we are.",
  },
  twitter: {
    title: "Careers · Simustratum",
    description: "We're not hiring yet, but here's what we'd look for when we are.",
  },
};

function CareersPage() {
  return (
    <StaticPageLayout
      tag="Careers"
      title="No open roles right now"
      intro="We're a small team focused on getting the product right before we grow. That said, we're always glad to hear from people who care about this problem."
    >
      <StaticSection title="What we'd value">
        <ul className="flex flex-col gap-1.5 pl-1">
          <li>• Actual empathy for the anxiety of high-stakes academic speaking</li>
          <li>• Care about getting small details — pacing, feedback, tone — genuinely right</li>
          <li>• Comfort building for students first, metrics second</li>
        </ul>
      </StaticSection>

      <StaticSection title="Want to introduce yourself anyway?">
        <p>
          Email{" "}
          <a href="mailto:careers@simustratum.app" className="font-bold text-sienna underline underline-offset-2">
            careers@simustratum.app
          </a>{" "}
          with what you&apos;d want to work on. We keep good intros on file for when roles open up.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}

export default CareersPage;
