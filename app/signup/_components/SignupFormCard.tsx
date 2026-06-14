import Link from "next/link";
import GoogleSignInButton from "./GoogleSignInButton";
import PasswordField from "./PasswordField";
import TermsCheckbox from "./TermsCheckbox";

function SignupFormCard() {
  return (
    <div className="w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
      <div className="mb-8">
        <p className="mb-2 font-grotesk text-xxs font-bold tracking-[0.12em] text-sienna uppercase">
          Create account
        </p>
        <h1 className="font-grotesk text-[1.65rem] leading-tight font-bold tracking-[-0.5px] text-ink">
          Start practicing today
        </h1>
      </div>

      <GoogleSignInButton />

      <div className="mb-6 flex items-center gap-3">
        <div className="h-[2px] flex-1 bg-ink/10" />
        <span className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-mid uppercase">
          or
        </span>
        <div className="h-[2px] flex-1 bg-ink/10" />
      </div>

      <form className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fullname"
            className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase"
          >
            Full name
          </label>
          <input
            id="fullname"
            type="text"
            placeholder="e.g. Adaeze Okonkwo"
            autoComplete="name"
            className="neu-input w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.9rem] text-ink placeholder:text-mid/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            className="neu-input w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.9rem] text-ink placeholder:text-mid/50"
          />
        </div>

        <PasswordField />

        <TermsCheckbox />

        <button
          type="submit"
          className="neu-btn mt-1 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-3.5 font-grotesk text-[0.95rem] font-bold text-white"
        >
          Create my account
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      <p className="mt-7 text-center font-inter text-[0.82rem] text-mid">
        Already have an account?
        <Link
          href="/login"
          className="ml-1 font-grotesk font-bold text-ink underline underline-offset-2 transition-colors hover:text-sienna"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SignupFormCard;
