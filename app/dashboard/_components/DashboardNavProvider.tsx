"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import DashboardSidebarContent from "./DashboardSidebarContent";

type DashboardNavContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const DashboardNavContext = createContext<DashboardNavContextValue | null>(
  null,
);

export function useDashboardNav() {
  const ctx = useContext(DashboardNavContext);
  if (!ctx) {
    throw new Error("useDashboardNav must be used within DashboardNavProvider");
  }
  return ctx;
}

type DashboardNavProviderProps = {
  children: ReactNode;
};

function DashboardNavProvider({ children }: DashboardNavProviderProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <DashboardNavContext.Provider value={{ open, toggle, close }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/60"
            aria-label="Close menu"
            onClick={close}
          />
          <aside className="absolute top-0 left-0 flex h-full w-[min(280px,85vw)] flex-col overflow-y-auto border-r-2 border-ink bg-ink shadow-neu-lg">
            <DashboardSidebarContent onNavigate={close} showClose />
          </aside>
        </div>
      )}
    </DashboardNavContext.Provider>
  );
}

export default DashboardNavProvider;
