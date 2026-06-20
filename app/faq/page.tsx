import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../_components/StaticPageLayout";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about practicing on Simustratum.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQs · Simustratum",
    description: "Answers to common questions about practicing on Simustratum.",
  },
  twitter: {
    title: "FAQs · Simustratum",
    description: "Answers to common questions about practicing on Simustratum.",
  },
};

const FAQS = [
  {
    q: "Is my first session really free?",
    a: "Yes — no card required. You get one full practice session on us before deciding whether to continue.",
  },
  {
    q: "Do I need a microphone?",
    a: "Yes, Simustratum is built around speaking out loud — that's the whole point. If your browser doesn't support speech recognition, you can fall back to typing your responses instead.",
  },
  {
    q: "Can I use it on mobile?",
    a: "The dashboard and session room both work in a mobile browser, though we recommend a laptop or desktop with a quiet room and a decent microphone for the most realistic practice.",
  },
  {
    q: "What if English isn't my first language?",
    a: "There's a dedicated English Proficiency mode focused on pronunciation, fluency, and academic vocabulary under pressure, separate from the academic-defense scenarios.",
  },
  {
    q: "What happens to my voice recordings?",
    a: "If you enable \"save transcript\" for a session, your spoken answers are uploaded securely and kept so you can replay the full session afterward. If you leave that option off, nothing is recorded to your transcript and there's nothing to replay.",
  },
  {
    q: "Can I delete a session afterward?",
    a: "Yes — open the session in your dashboard's sidebar history and use the delete option. This permanently removes the session and its transcript.",
  },
  {
    q: "Can I change my password or update my name?",
    a: "Yes, both live under Account Settings. If you signed up with Google, there's no Simustratum password to manage — you're authenticated through your Google account instead.",
  },
  {
    q: "I forgot my password — what do I do?",
    a: "Use \"Forgot password?\" on the sign-in page. We'll email a reset link that's valid for 30 minutes and can only be used once.",
  },
  {
    q: "Does the AI panel know what my project is actually about?",
    a: "If you upload your abstract, slides, or project document during setup, the panel's questions are tailored to that content instead of asking generic questions for your scenario type.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function FaqPage() {
  return (
    <StaticPageLayout
      tag="FAQs"
      title="Questions people actually ask"
      intro="If yours isn't here, just reach out — we're happy to answer it directly."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="flex flex-col border-2 border-ink shadow-neu-lg">
        {FAQS.map((item, index) => (
          <div
            key={item.q}
            className={`bg-white px-6 py-6 ${index < FAQS.length - 1 ? "border-b-2 border-ink" : ""}`}
          >
            <p className="mb-2 font-grotesk text-[0.95rem] font-bold text-ink">{item.q}</p>
            <p className="text-[0.88rem] leading-[1.7] text-mid">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="text-[0.85rem] text-mid">
        Still stuck? <Link href="/contact" className="font-bold text-sienna underline underline-offset-2">Contact us</Link>.
      </p>
    </StaticPageLayout>
  );
}

export default FaqPage;
