import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../_components/StaticPageLayout";
import StaticSection from "../_components/StaticSection";

export const metadata: Metadata = {
  title: "Getting started",
  description: "A quick walkthrough of your first Simustratum practice session.",
  alternates: { canonical: "/getting-started" },
  openGraph: {
    title: "Getting started · Simustratum",
    description: "A quick walkthrough of your first Simustratum practice session.",
  },
  twitter: {
    title: "Getting started · Simustratum",
    description: "A quick walkthrough of your first Simustratum practice session.",
  },
};

function GettingStartedPage() {
  return (
    <StaticPageLayout
      tag="Getting started"
      title="Your first session, end to end"
      intro="Here's exactly what happens from sign-up to your feedback report."
    >
      <StaticSection title="1. Create your account">
        <p>
          Sign up with email and password, or use Google sign-in for a one-click start. Your
          first session is free — no payment details needed.
        </p>
      </StaticSection>

      <StaticSection title="2. Pick a scenario and topic">
        <p>
          From your dashboard, choose a scenario — project defense, oral exam, seminar,
          presentation, tutorial, or English proficiency practice — and tell us your topic.
          You can optionally upload your abstract or slides so the AI panel tailors its
          questions to your actual work instead of asking generic ones.
        </p>
      </StaticSection>

      <StaticSection title="3. Build your panel">
        <p>
          Add up to three AI panelists, name them, and tune each one&apos;s personality with
          strictness and inquisitiveness sliders — a strict examiner feels very different from
          a curious, friendly reviewer.
        </p>
      </StaticSection>

      <StaticSection title="4. Choose your session options">
        <p>You can toggle three things before you begin:</p>
        <ul className="flex flex-col gap-1.5 pl-1">
          <li>• <strong className="text-ink">Real-time feedback</strong> — see your scores update after every answer.</li>
          <li>• <strong className="text-ink">Answer timer</strong> — a 90-second countdown to keep you on pace.</li>
          <li>• <strong className="text-ink">Save transcript</strong> — keep a full written + audio record you can replay later.</li>
        </ul>
      </StaticSection>

      <StaticSection title="5. Speak — out loud, for real">
        <p>
          Once you step in, your panel asks its first question out loud. Tap the mic, answer
          like you would in the real room, and tap again when you&apos;re done. The panel listens,
          asks natural follow-ups, and reacts in real time.
        </p>
      </StaticSection>

      <StaticSection title="6. Review your report">
        <p>
          When the session ends, you get scores for clarity, confidence, and structure. If you
          saved the transcript, you can replay the entire session turn-by-turn afterward —
          including your own recorded voice — from your dashboard&apos;s session history.
        </p>
      </StaticSection>

      <p className="text-[0.85rem] text-mid">
        Ready to try it? <Link href="/signup" className="font-bold text-sienna underline underline-offset-2">Create your free account</Link>.
      </p>
    </StaticPageLayout>
  );
}

export default GettingStartedPage;
