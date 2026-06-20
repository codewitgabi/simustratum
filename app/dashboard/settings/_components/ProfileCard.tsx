"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getInitials, type SessionUser } from "@/lib/auth";

type ProfileCardProps = {
  user: SessionUser;
};

function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = fullName.trim().length > 0 && fullName.trim() !== user.full_name;
  const providerLabel = user.auth_provider === "google" ? "Google" : "Email & password";

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/v1/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName.trim() }),
      });
      const data = await res.json();

      if (data.logged_out) {
        router.push("/login");
        return;
      }

      if (!res.ok || !data.success) {
        const fallback = res.status === 422 ? "Please enter a name." : "Couldn't update your name. Try again.";
        setError(data.message ?? fallback);
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_#1A1109] sm:p-5">
      <p className="mb-4 font-grotesk text-[0.78rem] font-bold tracking-[0.08em] text-mid uppercase">
        Profile
      </p>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-ink bg-sienna font-grotesk text-[1.1rem] font-bold text-white shadow-[3px_3px_0_#1A1109]">
          {getInitials(fullName.trim() || user.full_name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-grotesk text-[0.95rem] font-bold text-ink">{user.full_name}</p>
          <p className="truncate text-[0.78rem] text-mid">{user.email}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="border border-ink/15 bg-pale px-1.5 py-0.5 font-grotesk text-2xs font-bold tracking-wide text-mid uppercase">
              {providerLabel}
            </span>
            {user.is_verified ? (
              <span className="border border-green/30 bg-green/15 px-1.5 py-0.5 font-grotesk text-2xs font-bold tracking-wide text-green uppercase">
                Verified
              </span>
            ) : (
              <span className="border border-camel/30 bg-camel/15 px-1.5 py-0.5 font-grotesk text-2xs font-bold tracking-wide text-camel uppercase">
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="full-name"
          className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase"
        >
          Full name
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setSaved(false);
            setError(null);
          }}
          className="neu-input w-full border-2 border-ink bg-cream px-4 py-3 font-inter text-[0.9rem] text-ink placeholder:text-mid/50"
        />
      </div>

      {error && (
        <p className="mt-3 border-2 border-red-500 bg-red-50 px-3 py-2 text-[0.78rem] font-semibold text-red-700">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="mt-3 border-2 border-green bg-green/10 px-3 py-2 text-[0.78rem] font-semibold text-green">
          Your name has been updated.
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty || saving}
        className="neu-press-sm mt-4 border-2 border-ink bg-ink px-5 py-2.5 font-grotesk text-[0.85rem] font-bold text-white shadow-[3px_3px_0_#A0522D] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

export default ProfileCard;
