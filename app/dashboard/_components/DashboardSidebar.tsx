"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/lib/dashboard-data";
import DashboardSidebarContent from "./DashboardSidebarContent";

const STORAGE_KEY = "dashboard-sidebar-collapsed";

const collapsedListeners = new Set<() => void>();

function notifyCollapsedListeners() {
  collapsedListeners.forEach((listener) => listener());
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    /* ignore */
  }
  notifyCollapsedListeners();
}

function subscribeCollapsed(onStoreChange: () => void) {
  collapsedListeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    collapsedListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function DashboardSidebar() {
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  );

  const toggleCollapsed = useCallback(() => {
    writeCollapsed(!readCollapsed());
  }, []);

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
  const toggleLeft = width - 12; // center 24px button on sidebar border

  return (
    <>
      <div
        className="fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 ease-out lg:block"
        style={{ width }}
      >
        <aside className="flex h-full flex-col overflow-hidden border-r-2 border-ink bg-ink">
          <DashboardSidebarContent collapsed={collapsed} />
        </aside>
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        className="neu-press-sm fixed top-5 z-50 hidden h-6 w-6 cursor-pointer items-center justify-center border-2 border-ink bg-cream text-ink shadow-neu-sm transition-[left] duration-200 ease-out lg:flex"
        style={{ left: toggleLeft }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
          className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        >
          <path
            d="M6.5 1.5L3 5l3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className="hidden shrink-0 transition-[width] duration-200 ease-out lg:block"
        style={{ width }}
        aria-hidden
      />
    </>
  );
}

export default DashboardSidebar;
