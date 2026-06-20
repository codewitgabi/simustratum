import type { Metadata } from "next";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "Terms of Service — Simustratum",
  description: "The terms that govern your use of Simustratum.",
};

function TermsPage() {
  return (
    <StaticPageLayout
      tag="Legal"
      title="Terms of Service"
      intro="The short version: practice in good faith, and we'll keep building a tool worth practicing on."
    >
      <StaticSection title="Your account">
        <p>
          You&apos;re responsible for keeping your login credentials secure and for activity that
          happens under your account. You must be old enough to consent to our processing of
          your data under your local laws.
        </p>
      </StaticSection>

      <StaticSection title="Acceptable use">
        <p>
          Simustratum is a practice tool for academic speaking scenarios. Don&apos;t use it to
          generate or distribute harmful content, attempt to abuse or overload the AI
          panelists, or try to access another user&apos;s sessions or account.
        </p>
      </StaticSection>

      <StaticSection title="Free sessions & subscriptions">
        <p>
          Your first session is free. Continued or expanded access may require a paid plan as
          described on our <a href="/pricing" className="font-bold text-sienna underline underline-offset-2">Pricing</a> page.
          Subscriptions can be cancelled at any time and remain active through the end of the
          billing period already paid for.
        </p>
      </StaticSection>

      <StaticSection title="No guarantee of outcomes">
        <p>
          Simustratum is a practice aid, not a substitute for your institution&apos;s official
          requirements, advisor guidance, or examination process. AI-generated feedback and
          questions may not always be accurate or representative of your actual defense, exam,
          or presentation.
        </p>
      </StaticSection>

      <StaticSection title="Termination">
        <p>
          We may suspend or terminate accounts that violate these terms. You can stop using
          Simustratum and request account deletion at any time by contacting us.
        </p>
      </StaticSection>

      <StaticSection title="Changes to these terms">
        <p>
          We&apos;ll update this page if these terms change materially, and continued use of
          Simustratum after an update means you accept the revised terms.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}

export default TermsPage;
