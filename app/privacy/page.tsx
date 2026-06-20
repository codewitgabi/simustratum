import type { Metadata } from "next";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "Privacy Policy — Simustratum",
  description: "How Simustratum collects, uses, and protects your data.",
};

function PrivacyPage() {
  return (
    <StaticPageLayout
      tag="Legal"
      title="Privacy Policy"
      intro="Last updated: this page describes what we collect and why, in plain language."
    >
      <StaticSection title="What we collect">
        <ul className="flex flex-col gap-1.5 pl-1">
          <li>• Account info: your full name, email address, and a hashed password (or your Google account ID if you sign in with Google).</li>
          <li>• Session content: the scenario, topic, and any document you upload to tailor a session&apos;s questions.</li>
          <li>• Spoken answers: if you enable &quot;save transcript&quot; for a session, your recorded answers and the written transcript of the session.</li>
          <li>• Performance data: clarity, confidence, and structure scores generated from your sessions.</li>
        </ul>
      </StaticSection>

      <StaticSection title="What we don&apos;t collect">
        <p>
          We don&apos;t run third-party advertising trackers, and we don&apos;t sell your data to anyone.
          We don&apos;t record anything if &quot;save transcript&quot; is turned off for a session.
        </p>
      </StaticSection>

      <StaticSection title="How we use it">
        <p>
          To run your sessions, generate your feedback scores, let you replay past sessions,
          and keep your account secure. Voice recordings are stored with our audio provider
          and only ever served back to you through a freshly authenticated link.
        </p>
      </StaticSection>

      <StaticSection title="Your controls">
        <p>
          You can update your name and password from Account Settings at any time. You can
          delete any individual session — including its transcript and recordings — directly
          from your dashboard&apos;s session history.
        </p>
      </StaticSection>

      <StaticSection title="Questions">
        <p>
          Reach out to{" "}
          <a href="mailto:privacy@simustratum.app" className="font-bold text-sienna underline underline-offset-2">
            privacy@simustratum.app
          </a>{" "}
          for anything not covered here.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}

export default PrivacyPage;
