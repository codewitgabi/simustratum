import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import LoginFormPanel from "./_components/LoginFormPanel";
import LoginSidebar from "./_components/LoginSidebar";

export const metadata: Metadata = {
  title: "Sign in — Simustratum",
  description:
    "Sign in to Simustratum to continue practicing with AI panelists and track your progress.",
};

async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-cream font-inter text-ink">
      <LoginSidebar />
      <LoginFormPanel />
    </div>
  );
}

export default LoginPage;
