"use client";

import { getInitials, type SessionUser } from "@/lib/auth";
import { useDashboardNav } from "../../_components/DashboardNavProvider";

type SettingsHeaderProps = {
  user: SessionUser | null;
};

function SettingsHeader({ user }: SettingsHeaderProps) {
  const { toggle } = useDashboardNav();
  const initials = user ? getInitials(user.full_name) : "?";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b-2 border-ink bg-cream px-4 sm:h-[60px] sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-white text-ink shadow-neu-sm lg:hidden"
          aria-label="Open menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="truncate font-grotesk text-[0.95rem] font-bold tracking-tight text-ink sm:text-[1rem]">
          Account Settings
        </p>
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

export default SettingsHeader;
