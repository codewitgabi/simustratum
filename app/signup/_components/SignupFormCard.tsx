"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import PasswordField from "./PasswordField";
import TermsCheckbox from "./TermsCheckbox";

type FieldErrors = {
  fullName: string;
  email: string;
  password: string;
  terms: string;
};

const NO_ERRORS: FieldErrors = { fullName: "", email: "", password: "", terms: "" };

function SignupFormCard() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(NO_ERRORS);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function clearError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  }

  function validate(): boolean {
    const next = { ...NO_ERRORS };
    let valid = true;

    if (fullName.trim().length < 2) {
      next.fullName = "Please enter your full name.";
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid email address.";
      valid = false;
    }
    if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
      valid = false;
    }
    if (!termsAccepted) {
      next.terms = "You must accept the terms to continue.";
      valid = false;
    }

    setFieldErrors(next);
    return valid;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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

      <GoogleSignInButton className="mb-6" />

      <div className="mb-6 flex items-center gap-3">
        <div className="h-[2px] flex-1 bg-ink/10" />
        <span className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-mid uppercase">
          or
        </span>
        <div className="h-[2px] flex-1 bg-ink/10" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fieldErrors.fullName) clearError("fullName");
            }}
            className={[
              "neu-input w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.9rem] text-ink placeholder:text-mid/50",
              fieldErrors.fullName ? "error" : "",
            ].join(" ")}
          />
          {fieldErrors.fullName && (
            <p className="font-inter text-[0.68rem] font-semibold text-red-600">
              {fieldErrors.fullName}
            </p>
          )}
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) clearError("email");
            }}
            className={[
              "neu-input w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.9rem] text-ink placeholder:text-mid/50",
              fieldErrors.email ? "error" : "",
            ].join(" ")}
          />
          {fieldErrors.email && (
            <p className="font-inter text-[0.68rem] font-semibold text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <PasswordField
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (fieldErrors.password) clearError("password");
            }}
            error={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <p className="font-inter text-[0.68rem] font-semibold text-red-600">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <TermsCheckbox
            checked={termsAccepted}
            onChange={(v) => {
              setTermsAccepted(v);
              if (fieldErrors.terms) clearError("terms");
            }}
          />
          {fieldErrors.terms && (
            <p className="font-inter text-[0.68rem] font-semibold text-red-600">
              {fieldErrors.terms}
            </p>
          )}
        </div>

        {serverError && (
          <div
            className="flex items-start gap-3 border-2 border-red-500 bg-red-50 px-4 py-3 shadow-[3px_3px_0_#EF4444]"
            role="alert"
          >
            <svg
              className="mt-0.5 shrink-0"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden
            >
              <circle cx="7.5" cy="7.5" r="6.5" stroke="#EF4444" strokeWidth="1.5" />
              <line x1="7.5" y1="4" x2="7.5" y2="8.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7.5" cy="11" r="0.8" fill="#EF4444" />
            </svg>
            <p className="font-inter text-[0.78rem] leading-snug text-red-700">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="neu-btn mt-1 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-3.5 font-grotesk text-[0.95rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-80"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <span>Create my account</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
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
