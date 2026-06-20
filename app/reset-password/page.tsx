import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordFormPanel from "./_components/ResetPasswordFormPanel";
import ResetPasswordSidebar from "./_components/ResetPasswordSidebar";

export const metadata: Metadata = {
  title: "Reset password — Simustratum",
  description: "Choose a new password for your Simustratum account.",
};

function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-cream font-inter text-ink">
      <ResetPasswordSidebar />
      <Suspense>
        <ResetPasswordFormPanel />
      </Suspense>
    </div>
  );
}

export default ResetPasswordPage;
