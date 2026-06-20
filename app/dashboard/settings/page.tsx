import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import DashboardNavProvider from "../_components/DashboardNavProvider";
import DashboardSidebar from "../_components/DashboardSidebar";
import SettingsContent from "./_components/SettingsContent";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your profile, password, and account.",
  robots: { index: false, follow: false },
};

async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <DashboardNavProvider user={user}>
      <div className="flex min-h-screen items-start bg-cream font-inter text-ink">
        <DashboardSidebar user={user} />
        <SettingsContent user={user} />
      </div>
    </DashboardNavProvider>
  );
}

export default SettingsPage;
