import SignupLogo from "@/components/SignupLogo";
import LoginFormCard from "./LoginFormCard";

function LoginFormPanel() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-cream px-6 py-12">
      <SignupLogo variant="light" className="mb-10 lg:hidden" />
      <LoginFormCard />
    </main>
  );
}

export default LoginFormPanel;
