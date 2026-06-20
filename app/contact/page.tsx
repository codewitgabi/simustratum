import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "Contact us — Simustratum",
  description: "Get in touch with the Simustratum team.",
};

function ContactPage() {
  return (
    <StaticPageLayout
      tag="Contact"
      title="We read every message"
      intro="Whether it's a bug, a billing question, or feedback on a session that didn't feel right — tell us."
    >
      <StaticSection title="Email us">
        <p>
          The fastest way to reach us is{" "}
          <a
            href="mailto:codewitgabi222@gmail.com"
            className="font-bold text-sienna underline underline-offset-2"
          >
            codewitgabi222@gmail.com
          </a>
          . We typically reply within one business day.
        </p>
      </StaticSection>

      <StaticSection title="Before you write in">
        <p>
          Check the <Link href="/faq" className="font-bold text-sienna underline underline-offset-2">FAQs</Link> first
          — most questions about sessions, recordings, and account settings are already
          answered there.
        </p>
      </StaticSection>

      <StaticSection title="Reporting a problem with a session">
        <p>
          If something went wrong mid-session — a panelist behaving strangely, audio that
          didn&apos;t upload, or a scoring issue — include the scenario, the approximate time it
          happened, and your account email so we can look it up quickly.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}

export default ContactPage;
