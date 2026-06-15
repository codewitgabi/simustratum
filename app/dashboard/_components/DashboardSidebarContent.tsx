import Link from "next/link";
import MicIcon from "@/components/MicIcon";
import SignupLogo from "@/components/SignupLogo";
import { NAV_ITEMS, RECENT_SESSIONS } from "@/lib/dashboard-data";
import RecentSessionItem from "./RecentSessionItem";
import NavIcon from "./NavIcon";

type DashboardSidebarContentProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  showClose?: boolean;
};

function DashboardSidebarContent({
  collapsed = false,
  onNavigate,
  showClose = false,
}: DashboardSidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={[
          "flex shrink-0 items-center border-b-2 border-white/10 py-4",
          collapsed
            ? "justify-center px-2"
            : "justify-between px-4 sm:px-6 sm:py-5",
        ].join(" ")}
      >
        {collapsed ? (
          <Link
            href="/"
            onClick={onNavigate}
            className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-camel/60 bg-sienna no-underline"
            title="Simustratum"
          >
            <MicIcon />
          </Link>
        ) : (
          <SignupLogo
            href="/"
            variant="dark"
            className="[&_span:last-child]:text-[1.05rem] [&_span:first-child]:border-camel/60"
            onClick={onNavigate}
          />
        )}
        {showClose && !collapsed && (
          <button
            type="button"
            onClick={onNavigate}
            className="flex h-8 w-8 items-center justify-center border-2 border-white/20 text-white/70 transition-colors hover:text-white"
            aria-label="Close menu"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <nav
        className={[
          "flex flex-col gap-1 pb-3",
          collapsed ? "px-2 pt-4" : "px-3 pt-5",
        ].join(" ")}
      >
        {!collapsed && (
          <p className="mb-2 px-3 font-grotesk text-[0.6rem] font-bold tracking-[0.12em] text-white/25 uppercase">
            Menu
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={[
              "dashboard-nav-link flex items-center border-2 no-underline transition-[padding] duration-200",
              collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
              item.active
                ? "active border-ink"
                : "border-transparent text-white/60",
            ].join(" ")}
          >
            <span
              className={`nav-icon shrink-0 ${item.active ? "" : "text-white/70"}`}
            >
              <NavIcon type={item.icon} />
            </span>
            <span
              className={[
                "nav-label font-grotesk text-[0.82rem] font-bold",
                collapsed ? "sr-only" : "",
              ].join(" ")}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div
        className={[
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          collapsed ? "px-2 pt-1" : "px-3 pt-2",
        ].join(" ")}
      >
        {!collapsed && (
          <p className="mb-3 px-3 font-grotesk text-[0.6rem] font-bold tracking-[0.12em] text-white/25 uppercase">
            Recent Sessions
          </p>
        )}
        {RECENT_SESSIONS.map((session) => (
          <RecentSessionItem
            key={session.title}
            {...session}
            collapsed={collapsed}
          />
        ))}
      </div>

      <div
        className={[
          "flex shrink-0 items-center border-t-2 border-white/10 py-4",
          collapsed ? "justify-center px-2" : "gap-3 px-4",
        ].join(" ")}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-camel/50 bg-sienna font-grotesk text-[0.82rem] font-bold text-white"
          title={collapsed ? "Adaeze Okonkwo" : undefined}
        >
          AO
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate font-grotesk text-[0.78rem] font-bold text-white">
                Adaeze Okonkwo
              </p>
              <p className="truncate text-2xs text-white/35">
                adaeze@unilag.edu.ng
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 text-white/30 transition-colors hover:text-white/70"
              aria-label="Sign out"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M10 11l4-4-4-4M14 7.5H6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardSidebarContent;
