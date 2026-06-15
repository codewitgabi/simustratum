import type { Metadata } from "next";
import DashboardNavProvider from "./_components/DashboardNavProvider";
import DashboardSidebar from "./_components/DashboardSidebar";
import NewSessionWizard from "./_components/NewSessionWizard";

export const metadata: Metadata = {
  title: "Dashboard — Simustratum",
  description:
    "Start a new practice session, configure your AI panel, and review your setup.",
};

function DashboardPage() {
  return (
    <DashboardNavProvider>
      <div className="flex min-h-screen items-start bg-cream font-inter text-ink">
        <DashboardSidebar />
        <NewSessionWizard />
      </div>
    </DashboardNavProvider>
  );
}

export default DashboardPage;
