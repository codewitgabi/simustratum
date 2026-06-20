"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LogoutConfirmModal from "./LogoutConfirmModal";

function LogoutButton() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="shrink-0 text-white/30 transition-colors hover:text-white/70 disabled:opacity-50"
        aria-label="Sign out"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path
            d="M6 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M10 11l4-4-4-4M14 7.5H6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <LogoutConfirmModal
        open={confirmOpen}
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default LogoutButton;
