"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Link from "next/link";

type Currency = "NGN" | "USD";
type LoadingKey = "none" | "free" | "pro";

type FeatureRow =
  | { label: string; free: string; pro: string }
  | { label: string; free: boolean; pro: boolean };

const FEATURES: FeatureRow[] = [
  { label: "Practice sessions", free: "15 / month", pro: "Unlimited" },
  { label: "AI panelists per session", free: "1", pro: "Up to 3" },
  { label: "Clarity, confidence & structure scoring", free: true, pro: true },
  { label: "Session replay with voice playback", free: true, pro: true },
  { label: "Real-time feedback & answer timers", free: false, pro: true },
  { label: "Document-tailored questions", free: false, pro: true },
  { label: "Full transcript history", free: false, pro: true },
];

const PRICING: Record<Currency, { free: string; pro: string; period: string }> = {
  NGN: { free: "₦0", pro: "₦2,500", period: "/ month" },
  USD: { free: "$0", pro: "$4", period: "/ month" },
};

function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Africa/Lagos" ? "NGN" : "USD";
  } catch {
    return "USD";
  }
}

function IncludedIcon({ dark }: { dark: boolean }) {
  return (
    <svg className="mt-px shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <circle cx="7.5" cy="7.5" r="7" fill={dark ? "rgba(193,154,107,0.2)" : "rgba(160,82,45,0.12)"} />
      <path d="M4.5 7.5l2 2 4-4" stroke={dark ? "#c19a6b" : "#a0522d"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExcludedIcon({ dark }: { dark: boolean }) {
  return (
    <svg className="mt-px shrink-0 opacity-30" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <circle cx="7.5" cy="7.5" r="7" fill={dark ? "rgba(255,255,255,0.06)" : "rgba(26,17,9,0.06)"} />
      <path d="M5 5l5 5M10 5l-5 5" stroke={dark ? "white" : "#1a1109"} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon({ dark }: { dark?: boolean }) {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke={dark ? "rgba(26,17,9,0.2)" : "rgba(255,255,255,0.3)"} strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke={dark ? "#1a1109" : "white"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function PlansClient() {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState<LoadingKey>("none");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(detectCurrency());

    // Skip this page only if the user is already on a paid plan
    fetch("/api/v1/billing/status")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.plan === "pro") {
          router.replace("/dashboard");
        } else {
          setReady(true);
        }
      })
      .catch(() => setReady(true));
  }, [router]);

  const pricing = PRICING[currency];

  async function handleFreePlan() {
    setError(null);
    setLoading("free");
    try {
      const res = await fetch("/api/v1/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "free" }),
      });
      const data = await res.json();
      if (data?.logged_out) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data?.message ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading("none");
    }
  }

  async function handleProPlan() {
    setError(null);
    setLoading("pro");
    try {
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", currency }),
      });
      const data = await res.json();
      if (data?.logged_out) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data?.message ?? "Something went wrong. Please try again.");
        return;
      }
      const checkoutUrl = data?.data?.checkout_url ?? data?.checkout_url;
      if (!checkoutUrl) {
        setError("Could not start checkout. Please try again.");
        return;
      }
      window.location.href = checkoutUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading("none");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="flex items-center border-b-2 border-ink/10 px-6 py-4">
        <Logo />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <p className="mb-2 font-grotesk text-[0.72rem] font-bold tracking-[0.12em] text-sienna uppercase">
              One last step
            </p>
            <h1 className="mb-3 font-grotesk text-[2rem] font-bold leading-tight tracking-[-0.5px] text-ink">
              Choose how you want to practice
            </h1>
            <p className="font-inter text-[0.9rem] leading-relaxed text-mid">
              Start free — no card needed. Upgrade whenever you need more.
            </p>
          </div>

          <div
            className={[
              "grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2",
              ready ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {/* Free plan */}
            <div className="flex flex-col border-2 border-ink bg-white p-6 shadow-neu-lg">
              <p className="mb-1 font-grotesk text-[0.68rem] font-bold tracking-[0.1em] text-sienna uppercase">
                Free
              </p>
              <div className="mb-4 flex items-baseline gap-1.5 border-b-2 border-ink/8 pb-4">
                <span className="font-grotesk text-[2.1rem] font-bold tracking-[-1px] text-ink">
                  {pricing.free}
                </span>
                <span className="font-inter text-[0.82rem] text-mid">forever</span>
              </div>
              <ul className="mb-6 flex flex-col gap-3">
                {FEATURES.map((f) => {
                  const val = f.free;
                  const included = typeof val !== "boolean" || val;
                  return (
                    <li key={f.label} className={["flex items-start gap-2.5", !included ? "opacity-35" : ""].join(" ")}>
                      {included ? <IncludedIcon dark={false} /> : <ExcludedIcon dark={false} />}
                      <span className="font-inter text-[0.82rem] leading-snug text-ink">
                        {f.label}
                        {typeof val === "string" && (
                          <span className="ml-1 font-grotesk font-bold text-sienna">{val}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={handleFreePlan}
                disabled={loading !== "none"}
                className="neu-btn mt-auto flex w-full items-center justify-center gap-2 border-2 border-ink bg-cream px-5 py-3.5 font-grotesk text-[0.88rem] font-bold text-ink disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading === "free" ? (
                  <>
                    <SpinnerIcon dark />
                    Starting…
                  </>
                ) : (
                  "Start free"
                )}
              </button>
            </div>

            {/* Student Pro plan */}
            <div className="relative flex flex-col border-2 border-ink bg-ink p-6 shadow-neu-lg">
              <span className="absolute -top-3.5 left-5 border-2 border-camel bg-camel px-2.5 py-0.5 font-grotesk text-[0.6rem] font-bold tracking-[0.1em] text-ink uppercase">
                Recommended
              </span>
              <p className="mb-1 font-grotesk text-[0.68rem] font-bold tracking-[0.1em] text-camel uppercase">
                Student Pro
              </p>
              <div className="mb-4 flex items-baseline gap-1.5 border-b-2 border-white/10 pb-4">
                <span className="font-grotesk text-[2.1rem] font-bold tracking-[-1px] text-white">
                  {pricing.pro}
                </span>
                <span className="font-inter text-[0.82rem] text-white/45">{pricing.period}</span>
              </div>
              <ul className="mb-6 flex flex-col gap-3">
                {FEATURES.map((f) => {
                  const val = f.pro;
                  return (
                    <li key={f.label} className="flex items-start gap-2.5">
                      <IncludedIcon dark={true} />
                      <span className="font-inter text-[0.82rem] leading-snug text-white/90">
                        {f.label}
                        {typeof val === "string" && (
                          <span className="ml-1 font-grotesk font-bold text-camel">{val}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={handleProPlan}
                disabled={loading !== "none"}
                className="neu-btn mt-auto flex w-full items-center justify-center gap-2 border-2 border-white/20 bg-sienna px-5 py-3.5 font-grotesk text-[0.88rem] font-bold text-white shadow-[3px_3px_0_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading === "pro" ? (
                  <>
                    <SpinnerIcon />
                    Redirecting…
                  </>
                ) : (
                  <>
                    Start with Pro
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                      <path d="M2 6.5h9M7 3l3.5 3.5L7 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 border-2 border-red-500 bg-red-50 px-4 py-3 shadow-[3px_3px_0_#EF4444]">
              <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="7.5" y1="4" x2="7.5" y2="8.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7.5" cy="11" r="0.8" fill="#EF4444" />
              </svg>
              <p className="font-inter text-[0.78rem] leading-snug text-red-700">{error}</p>
            </div>
          )}

          <p className="mt-8 text-center font-inter text-[0.82rem] text-mid">
            You can switch plans anytime from{" "}
            <Link
              href="/dashboard/settings"
              className="font-grotesk font-bold text-ink underline underline-offset-2 transition-colors hover:text-sienna"
            >
              Settings
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
