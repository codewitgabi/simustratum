import type { Metadata } from "next";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Simustratum uses cookies and local storage.",
  alternates: { canonical: "/cookies" },
  openGraph: { title: "Cookie Policy · Simustratum", description: "How Simustratum uses cookies and local storage." },
  twitter: { title: "Cookie Policy · Simustratum", description: "How Simustratum uses cookies and local storage." },
};

function CookiesPage() {
  return (
    <StaticPageLayout
      tag="Legal"
      title="Cookie Policy"
      intro="We use a small number of cookies to keep you signed in — nothing more."
    >
      <StaticSection title="Essential cookies">
        <p>
          When you sign in, we set httpOnly session cookies that keep you authenticated and
          let your access token refresh automatically. These are required for the app to work
          and can&apos;t be turned off without signing out.
        </p>
      </StaticSection>

      <StaticSection title="Local storage">
        <p>
          Your browser&apos;s local storage is used to remember small preferences, like whether
          your dashboard sidebar is collapsed, and to carry session setup details (scenario,
          topic, panelists) between the setup wizard and the live session screen.
        </p>
      </StaticSection>

      <StaticSection title="No advertising or tracking cookies">
        <p>
          We don&apos;t use cookies for advertising, cross-site tracking, or analytics from
          third-party networks.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}

export default CookiesPage;
