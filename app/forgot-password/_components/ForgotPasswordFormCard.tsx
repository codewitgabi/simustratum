"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

function ForgotPasswordFormCard() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailError) setEmailError(false);
    if (serverError) setServerError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="fade-up w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-ink bg-green/15">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M3 6.5l7 5.5 7-5.5M3 6h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"
              stroke="#1A1109"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mb-3 font-grotesk text-[1.5rem] leading-tight font-bold tracking-[-0.5px] text-ink">
          Check your inbox
        </h1>
        <p className="mb-7 font-inter text-[0.88rem] leading-relaxed text-mid">
          If an account exists for <span className="font-bold text-ink">{email.trim()}</span>,
          we&apos;ve sent a link to reset your password. The link will expire soon, so use it
          promptly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="mb-5 w-full border-2 border-ink bg-white px-6 py-3 font-grotesk text-[0.88rem] font-bold text-ink shadow-neu-sm transition hover:bg-pale"
        >
          Use a different email
        </button>
        <Link
          href="/login"
          className="block text-center font-grotesk text-[0.82rem] font-bold text-ink underline underline-offset-2 transition-colors hover:text-sienna"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-up w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
      <div className="fade-up delay-1 mb-8">
        <p className="mb-2 font-grotesk text-xxs font-bold tracking-[0.12em] text-sienna uppercase">
          Forgot password
        </p>
        <h1 className="font-grotesk text-[1.65rem] leading-tight font-bold tracking-[-0.5px] text-ink">
          Let&apos;s get you back in
        </h1>
        <p className="mt-3 font-inter text-[0.85rem] leading-relaxed text-mid">
          Enter the email on your account and we&apos;ll send a link to reset your password.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="fade-up delay-2 flex flex-col gap-5">
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
          className="neu-press mt-1 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-[14px] font-grotesk text-[0.95rem] font-bold text-white shadow-neu-md disabled:cursor-not-allowed disabled:opacity-80"
        >
          <span>{loading ? "Sending…" : "Send reset link"}</span>
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

      <p className="fade-up delay-3 mt-7 text-center font-inter text-[0.82rem] text-mid">
        Remembered it?
        <Link
          href="/login"
          className="ml-1 font-grotesk font-bold text-ink underline underline-offset-2 transition-colors hover:text-sienna"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default ForgotPasswordFormCard;
