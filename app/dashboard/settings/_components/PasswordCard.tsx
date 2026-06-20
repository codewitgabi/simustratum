"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/PasswordField";
import type { SessionUser } from "@/lib/auth";

type PasswordCardProps = {
  user: SessionUser;
};

function PasswordCard({ user }: PasswordCardProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (user.auth_provider === "google") {
    return (
      <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
        <p className="mb-3 font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
          Password
        </p>
        <p className="font-inter text-[0.85rem] leading-relaxed text-mid">
          Your account signs in with Google, so there&apos;s no Simustratum password to manage.
          Update your password from your Google account instead.
        </p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();

      if (data.logged_out) {
        router.push("/login");
        return;
      }

      if (!res.ok || !data.success) {
        const fallback =
          res.status === 401
            ? "Your current password is incorrect."
            : res.status === 400
              ? "Your account doesn't have a password to change."
              : "Couldn't change your password. Try again.";
        setError(data.message ?? fallback);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
      <p className="mb-4 font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
        Password
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordField
          id="current-password"
          label="Current password"
          placeholder="Your current password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            setError(null);
            setSuccess(false);
          }}
          showStrength={false}
        />
        <PasswordField
          id="new-password"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            setError(null);
            setSuccess(false);
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
            setError(null);
            setSuccess(false);
          }}
          showStrength={false}
        />

        {error && (
          <p className="border-2 border-red-500 bg-red-50 px-3 py-2 text-[0.78rem] font-semibold text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="border-2 border-green bg-green/10 px-3 py-2 text-[0.78rem] font-semibold text-green">
            Your password has been changed.
          </p>
        )}

        <button
          type="submit"
          disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          className="neu-press-sm self-start border-2 border-ink bg-ink px-5 py-2.5 font-grotesk text-[0.85rem] font-bold text-white shadow-[3px_3px_0_#A0522D] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default PasswordCard;
