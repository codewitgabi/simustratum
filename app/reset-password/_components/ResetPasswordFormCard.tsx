"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/PasswordField";

type ResetPasswordFormCardProps = {
  token: string | null;
};

function InvalidLinkCard() {
  return (
    <div className="fade-up w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
      <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-ink bg-red-50">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="9" stroke="#EF4444" strokeWidth="1.6" />
          <line x1="11" y1="6.5" x2="11" y2="12" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="11" cy="15.2" r="1" fill="#EF4444" />
        </svg>
      </div>
      <h1 className="mb-3 font-grotesk text-[1.5rem] leading-tight font-bold tracking-[-0.5px] text-ink">
        This link isn&apos;t valid
      </h1>
      <p className="mb-7 font-inter text-[0.88rem] leading-relaxed text-mid">
        Your password reset link is missing, expired, or has already been used. Request a new
        one to continue.
      </p>
      <Link
        href="/forgot-password"
        className="neu-press flex w-full items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-[14px] font-grotesk text-[0.95rem] font-bold text-white shadow-neu-md"
      >
        Request a new link
      </Link>
    </div>
  );
}

function ResetPasswordFormCard({ token }: ResetPasswordFormCardProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token || tokenInvalid) {
    return <InvalidLinkCard />;
  }

  if (done) {
    return (
      <div className="fade-up w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-ink bg-green/15">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path d="M5 11l4 4 8-9" stroke="#1A1109" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mb-3 font-grotesk text-[1.5rem] leading-tight font-bold tracking-[-0.5px] text-ink">
          Password updated
        </h1>
        <p className="mb-7 font-inter text-[0.88rem] leading-relaxed text-mid">
          Your password has been changed. Sign in with your new password to continue.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="neu-press flex w-full items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-[14px] font-grotesk text-[0.95rem] font-bold text-white shadow-neu-md"
        >
          Continue to sign in
        </button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 400) {
          setTokenInvalid(true);
          return;
        }
        const fallback =
          res.status === 422 ? "Password must be at least 8 characters." : "Something went wrong. Please try again.";
        setError(data.message ?? fallback);
        return;
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-up w-full max-w-[420px] border-2 border-ink bg-white p-8 shadow-neu-lg md:p-10">
      <div className="fade-up delay-1 mb-8">
        <p className="mb-2 font-grotesk text-xxs font-bold tracking-[0.12em] text-sienna uppercase">
          Reset password
        </p>
        <h1 className="font-grotesk text-[1.65rem] leading-tight font-bold tracking-[-0.5px] text-ink">
          Choose a new password
        </h1>
      </div>

      <form noValidate onSubmit={handleSubmit} className="fade-up delay-2 flex flex-col gap-5">
        <PasswordField
          id="new-password"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            setError("");
          }}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          placeholder="Re-enter new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setError("");
          }}
          showStrength={false}
        />

        {error && (
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
            <p className="font-inter text-[0.78rem] leading-snug text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="neu-press mt-1 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-sienna px-6 py-[14px] font-grotesk text-[0.95rem] font-bold text-white shadow-neu-md disabled:cursor-not-allowed disabled:opacity-80"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordFormCard;
