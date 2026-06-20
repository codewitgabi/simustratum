import type { Metadata } from "next";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built Simustratum and who it's for.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About · Simustratum", description: "Why we built Simustratum and who it's for." },
  twitter: { title: "About · Simustratum", description: "Why we built Simustratum and who it's for." },
};

function AboutPage() {
  return (
    <StaticPageLayout
      tag="About"
      title="Built for the moment before the moment"
      intro="Simustratum exists because the scariest part of a defense, oral exam, or presentation isn't the content — it's saying it out loud, in front of people, for the first time."
    >
      <StaticSection title="The problem we saw">
        <p>
          Students prepare for high-stakes academic speaking by rehearsing silently, in their
          heads, or in front of a mirror. None of that simulates the actual pressure of a panel
          asking a question you didn&apos;t expect. So the first time it really happens is the one
          time it counts most.
        </p>
      </StaticSection>

      <StaticSection title="What we built instead">
        <p>
          AI panelists with distinct personalities — strict, curious, skeptical — that ask
          real, unpredictable questions about your actual project, in your actual voice,
          as many times as you need until it stops feeling like a performance and starts
          feeling like a conversation you&apos;ve already had before.
        </p>
      </StaticSection>

      <StaticSection title="Who it's for">
        <p>
          Anyone with a thesis defense, oral exam, seminar, tutorial, or presentation on the
          calendar — including students practicing in a second language who want to focus on
          fluency and pronunciation without the added pressure of a live audience.
        </p>
      </StaticSection>

      <StaticSection title="Built for students, by people who've been there">
        <p>
          We&apos;ve sat on the other side of that table — nervous, underprepared, wishing
          we&apos;d practiced out loud even once before walking in. Simustratum is the tool we
          wished existed then.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}

export default AboutPage;
