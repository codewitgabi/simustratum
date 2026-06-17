"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import RememberMeCheckbox from "./RememberMeCheckbox";

function EyeOpenIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
      <path
        d="M1 8.5C1 8.5 3.5 3 8.5 3s7.5 5.5 7.5 5.5S13.5 14 8.5 14 1 8.5 1 8.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
      <path
        d="M1 1l15 15M6.5 5.5A2 2 0 0 1 10.5 9.5M4.2 4.2C2.5 5.4 1 8.5 1 8.5s2.5 5.5 7.5 5.5c1.5 0 2.9-.4 4-.9M7 3.1c.5-.1 1-.1 1.5-.1 5 0 7.5 5.5 7.5 5.5s-.8 1.8-2.3 3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoginFormCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Incorrect email or password. Check your details and try again.",
  );
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  function clearFieldErrors() {
    setEmailError(false);
    setPasswordError(false);
    setShowBanner(false);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailError) setEmailError(false);
    if (showBanner) setShowBanner(false);
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (passwordError) setPasswordError(false);
    if (showBanner) setShowBanner(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearFieldErrors();

    let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(true);
      valid = false;
    }
    if (password.trim().length < 1) {
      setPasswordError(true);
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          res.status === 401 || res.status === 400
            ? "Incorrect email or password. Check your details and try again."
            : (data.message ?? "Something went wrong. Please try again."),
        );
        setShowBanner(true);
        return;
      }

      router.push("/dashboard");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setShowBanner(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-up w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
      <div className="fade-up delay-1 mb-8">
        <p className="mb-2 font-grotesk text-xxs font-bold tracking-[0.12em] text-sienna uppercase">
          Sign in
        </p>
        <h1 className="font-grotesk text-[1.65rem] leading-tight font-bold tracking-[-0.5px] text-ink">
          Good to have you back
        </h1>
      </div>

      <div className="fade-up delay-2">
        <GoogleSignInButton />
      </div>

      <div className="fade-up delay-2 my-6 flex items-center gap-3">
        <div className="h-[2px] flex-1 bg-ink/10" />
        <span className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-mid uppercase">
          or
        </span>
        <div className="h-[2px] flex-1 bg-ink/10" />
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="fade-up delay-3 flex flex-col gap-5"
      >
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
            onChange={(e) => handleEmailChange(e.target.value)}
            className={[
              "neu-input w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.9rem] text-ink placeholder:text-mid/50",
              emailError ? "error" : "",
            ].join(" ")}
          />
          {emailError && (
            <p className="font-inter text-[0.68rem] font-semibold text-red-600">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="border-b border-sienna/50 pb-px font-grotesk text-[0.7rem] font-bold text-sienna no-underline transition-colors hover:border-ink hover:text-ink"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={visible ? "text" : "password"}
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={[
                "neu-input w-full border-2 border-ink bg-cream px-4 py-3 pr-12 font-inter text-[0.9rem] text-ink placeholder:text-mid/50",
                passwordError ? "error" : "",
              ].join(" ")}
            />
            <button
              type="button"
              className="pw-toggle absolute top-1/2 right-3.5 -translate-y-1/2 text-mid transition-colors hover:text-ink"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <EyeOffIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          {passwordError && (
            <p className="font-inter text-[0.68rem] font-semibold text-red-600">
              Please enter your password.
            </p>
          )}
        </div>

        <RememberMeCheckbox />

        {showBanner && (
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
            <p className="font-inter text-[0.78rem] leading-snug text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="neu-press mt-1 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-[14px] font-grotesk text-[0.95rem] font-bold text-white shadow-neu-md disabled:cursor-not-allowed disabled:opacity-80"
        >
          <span>{loading ? "Signing in…" : "Sign in"}</span>
          {!loading && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {loading && (
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
          )}
        </button>
      </form>

      <p className="fade-up delay-4 mt-7 text-center font-inter text-[0.82rem] text-mid">
        Don&apos;t have an account?
        <Link
          href="/signup"
          className="ml-1 font-grotesk font-bold text-ink underline underline-offset-2 transition-colors hover:text-sienna"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}

export default LoginFormCard;
