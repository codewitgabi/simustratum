import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "You're all set · Simustratum",
  robots: { index: false },
};

export default function PlansSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
      <header className="absolute top-0 left-0 w-full border-b-2 border-ink/10 px-6 py-4">
        <Logo />
      </header>

      <div className="w-full max-w-sm border-2 border-ink bg-white px-8 py-10 text-center shadow-neu-lg">
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-ink bg-green shadow-[3px_3px_0_#1a1109]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M4.5 11.5l4.5 4.5 8.5-9"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="mb-2 font-grotesk text-[0.72rem] font-bold tracking-[0.12em] text-green uppercase">
          Payment confirmed
        </p>
        <h1 className="mb-3 font-grotesk text-[1.6rem] font-bold leading-tight tracking-[-0.5px] text-ink">
          You&apos;re all set
        </h1>
        <p className="mb-8 font-inter text-[0.88rem] leading-relaxed text-mid">
          Your Student Pro plan is active. Head to your dashboard and start your first session.
        </p>
        <Link
          href="/dashboard"
          className="neu-btn flex w-full items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-3.5 font-grotesk text-[0.9rem] font-bold text-white no-underline shadow-[4px_4px_0_#1a1109]"
        >
          Go to dashboard
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
