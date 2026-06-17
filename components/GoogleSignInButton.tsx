"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type GoogleSignInButtonProps = {
  className?: string;
  onSuccess?: () => void;
  onError?: () => void;
};

function GoogleSignInButton({ className = "", onSuccess, onError }: GoogleSignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  async function handleSuccess(credentialResponse: CredentialResponse) {
    setError(false);
    try {
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message ?? "Google sign-in failed");

      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch {
      setLoading(false);
      setError(true);
      onError?.();
    }
  }

  function handleError() {
    setLoading(false);
    setError(true);
    onError?.();
  }

  function handleClick() {
    setError(false);
    setLoading(true);
    const btn = googleBtnRef.current?.querySelector<HTMLElement>("div[role='button'], button");
    btn?.click();
  }

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      {/* Hidden GoogleLogin — triggers the real credential flow; programmatic .click() bypasses pointer-events: none */}
      <div
        ref={googleBtnRef}
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`neu-press flex w-full cursor-pointer items-center justify-center gap-3 border-2 border-ink bg-white px-4 py-3 font-grotesk text-[0.875rem] font-bold text-ink shadow-neu-md disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
          >
            <circle cx="9" cy="9" r="7" stroke="#1A1109" strokeOpacity="0.2" strokeWidth="2" />
            <path d="M9 2a7 7 0 0 1 7 7" stroke="#1A1109" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? "Connecting…" : "Continue with Google"}
      </button>

      {error && (
        <p className="text-center font-inter text-[0.72rem] font-semibold text-red-600">
          Google sign-in failed. Please try again.
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;
