import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../_components/StaticPageLayout";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free, upgrade when you need more practice.",
  alternates: { canonical: "/pricing" },
  openGraph: { title: "Pricing · Simustratum", description: "Start free, upgrade when you need more practice." },
  twitter: { title: "Pricing · Simustratum", description: "Start free, upgrade when you need more practice." },
};

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    description: "15 sessions a month — enough to build a real habit before you commit.",
    features: [
      "15 practice sessions per month",
      "1 AI panelist per session",
      "Clarity, confidence & structure scoring",
      "Session replay with voice playback",
    ],
    featured: false,
  },
  {
    name: "Student Pro",
    price: "₦2,500",
    period: "per month",
    description: "For anyone with a defense, oral, or presentation on the calendar.",
    features: [
      "Unlimited practice sessions",
      "Up to 3 AI panelists per session",
      "Real-time feedback & answer timers",
      "Document-tailored questions from your abstract or slides",
      "Full transcript history & replay",
    ],
    featured: true,
  },
];

function PricingPage() {
  return (
    <StaticPageLayout
      tag="Pricing"
      title="Practice now, pay only if you keep coming back"
      intro="Your first session is always free — no card required. Upgrade only once you know it's helping."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={[
              "flex flex-col border-2 border-ink p-7 shadow-neu-lg",
              plan.featured ? "bg-ink text-white" : "bg-white text-ink",
            ].join(" ")}
          >
            <p
              className={[
                "mb-1 font-grotesk text-[0.78rem] font-bold tracking-[0.1em] uppercase",
                plan.featured ? "text-camel" : "text-sienna",
              ].join(" ")}
            >
              {plan.name}
            </p>
            <div className="mb-4 flex items-baseline gap-1.5">
              <span className="font-grotesk text-[2.2rem] font-bold tracking-[-1px]">
                {plan.price}
              </span>
              <span className={plan.featured ? "text-white/50" : "text-mid"}>{plan.period}</span>
            </div>
            <p className={`mb-6 text-[0.88rem] leading-[1.6] ${plan.featured ? "text-white/65" : "text-mid"}`}>
              {plan.description}
            </p>
            <ul className="mb-8 flex flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[0.85rem] leading-snug">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${plan.featured ? "bg-camel" : "bg-sienna"}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={[
                "neu-press-sm mt-auto flex items-center justify-center border-2 px-5 py-3 font-grotesk text-[0.88rem] font-bold no-underline",
                plan.featured
                  ? "border-white bg-sienna text-white shadow-[3px_3px_0_rgba(255,255,255,0.25)]"
                  : "border-ink bg-cream text-ink shadow-[3px_3px_0_#1A1109]",
              ].join(" ")}
            >
              {plan.featured ? "Start with Pro" : "Start free"}
            </Link>
          </div>
        ))}
      </div>

      <p className="text-[0.85rem] text-mid">
        Have questions about plans for a whole class or department? <Link href="/contact" className="font-bold text-sienna underline underline-offset-2">Get in touch</Link>.
      </p>
    </StaticPageLayout>
  );
}

export default PricingPage;
