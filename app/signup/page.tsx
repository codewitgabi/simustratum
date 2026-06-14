import type { Metadata } from "next";
import SignupFormPanel from "./_components/SignupFormPanel";
import SignupSidebar from "./_components/SignupSidebar";

export const metadata: Metadata = {
  title: "Sign up — Simustratum",
  description:
    "Create your Simustratum account and start practicing with AI panelists. Your first session is free.",
};

function SignupPage() {
  return (
    <div className="flex min-h-screen bg-cream font-inter text-ink">
      <SignupSidebar />
      <SignupFormPanel />
    </div>
  );
}

export default SignupPage;
