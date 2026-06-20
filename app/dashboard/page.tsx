import type { Metadata } from "next";
import { getSessionUser } from "@/lib/session";
import DashboardNavProvider from "./_components/DashboardNavProvider";
import DashboardSidebar from "./_components/DashboardSidebar";
import NewSessionWizard from "./_components/NewSessionWizard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Start a new practice session, configure your AI panel, and review your setup.",
  robots: { index: false, follow: false },
};

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
