import type { Metadata } from "next";
import LoginFormPanel from "./_components/LoginFormPanel";
import LoginSidebar from "./_components/LoginSidebar";

export const metadata: Metadata = {
  title: "Sign in — Simustratum",
  description:
    "Sign in to Simustratum to continue practicing with AI panelists and track your progress.",
};

function LoginPage() {
  return (
    <div className="flex min-h-screen bg-cream font-inter text-ink">
      <LoginSidebar />
      <LoginFormPanel />
    </div>
  );
}

export default LoginPage;
