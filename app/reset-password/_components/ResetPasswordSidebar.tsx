import SignupLogo from "@/components/SignupLogo";

const REASSURANCES = [
  "Use a password you haven't used before",
  "You'll be signed out everywhere once it's changed",
  "Your sessions, scores, and progress stay untouched",
];

function ResetPasswordSidebar() {
  const year = new Date().getFullYear();

  return (
    <aside className="relative hidden min-h-screen w-[42%] flex-col justify-between overflow-hidden border-r-2 border-ink bg-ink px-12 py-10 lg:flex hatch-login">
      <SignupLogo variant="dark" className="self-start" />

      <div className="my-auto flex flex-col gap-8 py-16">
        <div>
          <span className="mb-6 inline-block border border-camel/40 px-3 py-1 font-grotesk text-[0.65rem] font-bold tracking-[0.14em] text-camel uppercase">
            Almost there
          </span>
          <h2 className="mb-4 font-grotesk text-[2.6rem] leading-[1.06] font-bold tracking-[-1.5px] text-white">
            One new
            <br />
            password
            <br />
            <span className="text-camel">away.</span>
          </h2>
          <p className="max-w-[300px] text-[0.9rem] leading-[1.75] text-white/50">
            Set a new password to finish recovering your account.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {REASSURANCES.map((label) => (
            <div key={label} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-camel" />
              <p className="text-[0.85rem] leading-snug text-white/60">{label}</p>
            </div>
          ))}
        </div>
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

export default ResetPasswordSidebar;
