"use client";

import { useSearchParams } from "next/navigation";
import SignupLogo from "@/components/SignupLogo";
import ResetPasswordFormCard from "./ResetPasswordFormCard";

function ResetPasswordFormPanel() {
  const token = useSearchParams().get("token");

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-cream px-6 py-12">
      <SignupLogo variant="light" className="mb-10 lg:hidden" />
      <ResetPasswordFormCard token={token} />
    </main>
  );
}

export default ResetPasswordFormPanel;
