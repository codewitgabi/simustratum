import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import SignupFormPanel from "./_components/SignupFormPanel";
import SignupSidebar from "./_components/SignupSidebar";

export const metadata: Metadata = {
  title: "Sign up — Simustratum",
  description:
    "Create your Simustratum account and start practicing with AI panelists. Your first session is free.",
};

async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-cream font-inter text-ink">
      <SignupSidebar />
      <SignupFormPanel />
    </div>
  );
}

export default SignupPage;
