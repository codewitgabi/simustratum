import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { SessionUser } from "@/lib/auth";
import DashboardNavProvider from "./_components/DashboardNavProvider";
import DashboardSidebar from "./_components/DashboardSidebar";
import NewSessionWizard from "./_components/NewSessionWizard";

export const metadata: Metadata = {
  title: "Dashboard — Simustratum",
  description:
    "Start a new practice session, configure your AI panel, and review your setup.",
};

async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get("ss_user")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <DashboardNavProvider user={user}>
      <div className="flex min-h-screen items-start bg-cream font-inter text-ink">
        <DashboardSidebar user={user} />
        <NewSessionWizard user={user} />
      </div>
    </DashboardNavProvider>
  );
}

export default DashboardPage;
