"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MicIcon from "@/components/MicIcon";
import SignupLogo from "@/components/SignupLogo";
import {
  NAV_ITEMS,
  SCENARIO_META,
  SCENARIO_FROM_API_VALUE,
} from "@/lib/dashboard-data";
import { formatRelativeTime } from "@/lib/dashboard-utils";
import { getInitials, type SessionUser } from "@/lib/auth";
import RecentSessionItem from "./RecentSessionItem";
import NavIcon from "./NavIcon";
import LogoutButton from "./LogoutButton";

const SESSIONS_PAGE_LIMIT = 20;
const SCROLL_LOAD_THRESHOLD = 60;

type ApiSessionStatus = "pending" | "in_progress" | "completed" | "abandoned";

type ApiSession = {
  id: string;
  title: string;
  scenario: string;
  score: number;
  status: ApiSessionStatus;
  created_at: string;
};

type SessionsPage = {
  items: ApiSession[];
  meta: { total: number; page: number; limit: number };
};

type SessionDisplay = {
  id: string;
  icon: string;
  title: string;
  meta: string;
  score: number;
  scoreClass: string;
  statusLabel: string;
  statusDotClass: string;
};

function scoreClassFor(score: number): string {
  if (score <= 45) return "text-red-500 bg-red-500/20";
  if (score <= 69) return "text-camel bg-camel/20";
  return "text-green bg-green/20";
}

function statusBadgeFor(status: ApiSessionStatus): { label: string; dotClass: string } {
  switch (status) {
    case "pending":
      return { label: "Not started", dotClass: "bg-camel" };
    case "in_progress":
      return { label: "Live", dotClass: "bg-green blink" };
    case "abandoned":
      return { label: "Abandoned", dotClass: "bg-red-500" };
    case "completed":
      return { label: "Completed", dotClass: "bg-green" };
  }
}

function toDisplaySession(session: ApiSession): SessionDisplay {
  const scenarioId = SCENARIO_FROM_API_VALUE[session.scenario];
  const icon = SCENARIO_META[scenarioId]?.icon ?? "❓";
  const badge = statusBadgeFor(session.status);

  return {
    id: session.id,
    icon,
    title: session.title,
    meta: formatRelativeTime(session.created_at),
    score: session.score,
    scoreClass: scoreClassFor(session.score),
    statusLabel: badge.label,
    statusDotClass: badge.dotClass,
  };
}

type DashboardSidebarContentProps = {
  user: SessionUser | null;
  collapsed?: boolean;
  onNavigate?: () => void;
  showClose?: boolean;
};

function DashboardSidebarContent({
  user,
  collapsed = false,
  onNavigate,
  showClose = false,
}: DashboardSidebarContentProps) {
  const router = useRouter();
  const initials = user ? getInitials(user.full_name) : "?";
  const displayName = user?.full_name ?? "Guest";
  const displayEmail = user?.email ?? "";

  const [sessions, setSessions] = useState<SessionDisplay[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchSessionsPage = useCallback(
    async (pageNum: number): Promise<SessionsPage | null> => {
      const res = await fetch(
        `/api/v1/sessions?page=${pageNum}&limit=${SESSIONS_PAGE_LIMIT}`,
      );
      const data = await res.json();

      if (data.logged_out) {
        router.push("/login");
        return null;
      }

      if (res.ok && data.success) return data.data as SessionsPage;
      return null;
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await fetchSessionsPage(1);
      if (cancelled) return;
      if (result) {
        setSessions(result.items.map(toDisplaySession));
        setTotal(result.meta.total);
        setPage(1);
      }
      setLoadingSessions(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchSessionsPage]);

  const handleSessionsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMore || loadingSessions || sessions.length >= total) return;

    const el = e.currentTarget;
    if (
      el.scrollTop + el.clientHeight <
      el.scrollHeight - SCROLL_LOAD_THRESHOLD
    ) {
      return;
    }

    setLoadingMore(true);
    const nextPage = page + 1;
    fetchSessionsPage(nextPage).then((result) => {
      if (result) {
        setSessions((prev) => [...prev, ...result.items.map(toDisplaySession)]);
        setTotal(result.meta.total);
        setPage(nextPage);
      }
      setLoadingMore(false);
    });
  };

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

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {!collapsed && (
          <p className="mb-3 shrink-0 px-3 pt-2 font-grotesk text-[0.6rem] font-bold tracking-[0.12em] text-white/25 uppercase">
            Recent Sessions
          </p>
        )}
        <div
          onScroll={handleSessionsScroll}
          className={[
            "sidebar-sessions-scroll min-h-0 flex-1 overflow-y-auto",
            collapsed ? "px-2 pt-1" : "",
          ].join(" ")}
        >
          <div className={collapsed ? "" : "pl-3 pr-1"}>
            {loadingSessions && !collapsed && (
              <p className="px-3 py-2 text-xxs text-white/35">Loading…</p>
            )}
            {!loadingSessions && sessions.length === 0 && !collapsed && (
              <p className="px-3 py-2 text-xxs text-white/35">
                No sessions yet
              </p>
            )}
            {sessions.map((session) => (
              <RecentSessionItem
                key={session.id}
                {...session}
                collapsed={collapsed}
              />
            ))}
            {loadingMore && !collapsed && (
              <p className="px-3 py-2 text-xxs text-white/35">Loading more…</p>
            )}
          </div>
        </div>
      </div>

      <div
        className={[
          "flex shrink-0 items-center border-t-2 border-white/10 py-4",
          collapsed ? "justify-center px-2" : "gap-3 px-4",
        ].join(" ")}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-camel/50 bg-sienna font-grotesk text-[0.82rem] font-bold text-white"
          title={collapsed ? displayName : undefined}
        >
          {initials}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate font-grotesk text-[0.78rem] font-bold text-white">
                {displayName}
              </p>
              <p className="truncate text-2xs text-white/35">{displayEmail}</p>
            </div>
            <LogoutButton />
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardSidebarContent;
