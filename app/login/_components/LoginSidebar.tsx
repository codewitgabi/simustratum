import SignupLogo from "@/components/SignupLogo";
import LastSessionCard from "./LastSessionCard";

function LoginSidebar() {
  const year = new Date().getFullYear();

  return (
    <aside className="relative hidden min-h-screen w-[42%] flex-col justify-between overflow-hidden border-r-2 border-ink bg-ink px-[52px] py-10 lg:flex hatch-login">
      <SignupLogo variant="dark" className="self-start" />

      <div className="my-auto flex flex-col gap-10 py-16">
        <div>
          <span className="mb-6 inline-block border border-camel/40 px-3 py-1 font-grotesk text-[0.65rem] font-bold tracking-[0.14em] text-camel uppercase">
            Welcome back
          </span>
          <h2 className="mb-4 font-grotesk text-[2.6rem] leading-[1.06] font-bold tracking-[-1.5px] text-white">
            Pick up where
            <br />
            you left
            <br />
            <span className="text-camel">off.</span>
          </h2>
          <p className="max-w-[300px] text-[0.9rem] leading-[1.75] text-white/50">
            Your sessions, scores, and progress are waiting. Sign in to keep
            practicing.
          </p>
        </div>

        <LastSessionCard />

        <p className="max-w-[280px] border-l-2 border-camel/30 pl-4 font-inter text-[0.78rem] leading-relaxed text-white/30 italic">
          &ldquo;Consistency is the difference between students who walk in
          prepared and those who walk out wishing they had.&rdquo;
        </p>
      </div>

      <p className="font-inter text-[0.72rem] tracking-wide text-white/25">
        © {year} Simustratum — Practice. Speak. Defend.
      </p>

      <div
        className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 border-t-2 border-l-2 border-camel/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-16 w-16 border-b-2 border-l-2 border-camel/15"
        aria-hidden
      />
    </aside>
  );
}

export default LoginSidebar;
