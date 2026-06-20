import type { Metadata } from "next";
import ForgotPasswordFormPanel from "./_components/ForgotPasswordFormPanel";
import ForgotPasswordSidebar from "./_components/ForgotPasswordSidebar";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Get a link to reset your Simustratum password.",
  alternates: { canonical: "/forgot-password" },
};

function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-cream font-inter text-ink">
      <ForgotPasswordSidebar />
      <ForgotPasswordFormPanel />
    </div>
  );
}

export default ForgotPasswordPage;
