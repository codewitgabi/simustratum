"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UserPlan } from "@/lib/proxy";

type BillingStatus = {
  plan: UserPlan;
  sessions_used: number;
  sessions_limit: number | null;
  billing_period_end: string | null;
  cancel_at_period_end: boolean;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function PlanCard() {
  const router = useRouter();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/billing/status")
      .then((r) => r.json())
      .then((data) => {
        if (data?.logged_out) {
          router.push("/login");
          return;
        }
        if (data?.success && data.data) {
          setStatus(data.data as BillingStatus);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true));
  }, [router]);

  async function handleManageBilling() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/v1/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ return_url: `${window.location.origin}/dashboard/settings` }),
      });
      const data = await res.json();
      if (data?.logged_out) {
        router.push("/login");
        return;
      }
      const portalUrl = data?.data?.portal_url ?? data?.portal_url;
      if (!portalUrl) {
        setPortalError("Couldn't open billing portal. Try again.");
        return;
      }
      window.location.href = portalUrl;
    } catch {
      setPortalError("Couldn't reach the server. Try again.");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
      <p className="mb-4 font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
        Plan & billing
      </p>

      {!status && !loadError && (
        <div className="flex items-center gap-2 text-[0.85rem] text-mid">
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
            <path d="M7 2a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Loading plan…
        </div>
      )}

      {loadError && (
        <p className="text-[0.85rem] text-mid">Could not load plan info. Refresh to try again.</p>
      )}

      {status && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className={[
                "border px-2 py-0.5 font-grotesk text-2xs font-bold tracking-[0.08em] uppercase",
                status.plan === "pro"
                  ? "border-camel/40 bg-camel/15 text-camel"
                  : "border-ink/15 bg-pale text-mid",
              ].join(" ")}
            >
              {status.plan === "pro" ? "Student Pro" : "Free"}
            </span>
            {status.plan === "pro" && status.cancel_at_period_end && (
              <span className="border border-red-300 bg-red-50 px-2 py-0.5 font-grotesk text-2xs font-bold tracking-[0.08em] text-red-600 uppercase">
                Cancels soon
              </span>
            )}
          </div>

          {status.plan === "free" && status.sessions_limit !== null && (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="font-inter text-[0.82rem] text-mid">Sessions this month</p>
                <p className="font-grotesk text-[0.82rem] font-bold text-ink">
                  {status.sessions_used} / {status.sessions_limit}
                </p>
              </div>
              <div className="h-2 w-full border border-ink/10 bg-pale">
                <div
                  className="h-full bg-sienna transition-all"
                  style={{
                    width: `${Math.min(100, (status.sessions_used / status.sessions_limit) * 100)}%`,
                  }}
                />
              </div>
              {status.sessions_used >= status.sessions_limit && (
                <p className="mt-2 font-inter text-[0.78rem] font-semibold text-sienna">
                  You have used all sessions for this month.
                </p>
              )}
            </div>
          )}

          {status.plan === "pro" && status.billing_period_end && (
            <p className="font-inter text-[0.82rem] text-mid">
              {status.cancel_at_period_end ? "Access ends" : "Next billing date"}:{" "}
              <span className="font-semibold text-ink">{formatDate(status.billing_period_end)}</span>
            </p>
          )}

          {portalError && (
            <p className="border-2 border-red-500 bg-red-50 px-3 py-2 font-inter text-[0.78rem] font-semibold text-red-700">
              {portalError}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {status.plan === "free" ? (
              <Link
                href="/plans"
                className="neu-press-sm inline-flex items-center gap-2 border-2 border-ink bg-sienna px-5 py-2.5 font-grotesk text-[0.85rem] font-bold text-white shadow-[3px_3px_0_#1A1109] no-underline"
              >
                Upgrade to Pro
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M2 6.5h9M7.5 3l3.5 3.5-3.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="neu-press-sm border-2 border-ink bg-ink px-5 py-2.5 font-grotesk text-[0.85rem] font-bold text-white shadow-[3px_3px_0_#A0522D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {portalLoading ? "Opening…" : "Manage billing"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
