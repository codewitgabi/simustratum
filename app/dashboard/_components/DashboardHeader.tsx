"use client";

import { getInitials, type SessionUser } from "@/lib/auth";
import { useDashboardNav } from "./DashboardNavProvider";

type DashboardHeaderProps = {
  currentStep: number;
  user: SessionUser | null;
};

function DashboardHeader({ currentStep, user }: DashboardHeaderProps) {
  const { toggle } = useDashboardNav();
  const initials = user ? getInitials(user.full_name) : "?";

  const dotClass = (step: number) => {
    if (step < currentStep) return "step-dot done";
    if (step === currentStep) return "step-dot active";
    return "step-dot idle";
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b-2 border-ink bg-cream px-4 sm:h-[60px] sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-white text-ink shadow-neu-sm lg:hidden"
          aria-label="Open menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="truncate font-grotesk text-[0.95rem] font-bold tracking-tight text-ink sm:text-[1rem]">
          New Session
        </p>

        <div className="ml-auto hidden items-center gap-1.5 sm:ml-4 md:flex lg:ml-4">
          <div
            className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-200 ${dotClass(1)}`}
          />
          <div className="h-[2px] w-6 bg-ink/15" />
          <div
            className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-200 ${dotClass(2)}`}
          />
          <div className="h-[2px] w-6 bg-ink/15" />
          <div
            className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-200 ${dotClass(3)}`}
          />
        </div>
      </div>

      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-sienna font-grotesk text-[0.75rem] font-bold text-white shadow-[2px_2px_0_#1A1109]"
        title={user?.full_name}
      >
        {initials}
      </div>
    </header>
  );
}

export default DashboardHeader;
