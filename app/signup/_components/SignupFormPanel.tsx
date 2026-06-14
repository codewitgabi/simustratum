import SignupLogo from "@/components/SignupLogo";
import SignupFormCard from "./SignupFormCard";

function SignupFormPanel() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-cream px-6 py-12">
      <SignupLogo variant="light" className="mb-10 lg:hidden" />

      <SignupFormCard />

      <p className="mt-6 max-w-[320px] text-center font-inter text-[0.72rem] text-mid/70">
        No credit card required. Your first session is completely free.
      </p>
    </main>
  );
}

export default SignupFormPanel;
