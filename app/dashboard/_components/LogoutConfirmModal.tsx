import { useEffect } from "react";

type LogoutConfirmModalProps = {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function LogoutConfirmModal({ open, loading, onCancel, onConfirm }: LogoutConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-110 flex items-center justify-center bg-ink/75 p-4"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm border-3 border-ink bg-cream p-8 shadow-[8px_8px_0_#1A1109]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-2 font-grotesk text-xl font-bold text-ink">Sign out?</p>
        <p className="mb-7 font-inter text-[0.85rem] leading-relaxed text-mid">
          You&apos;ll need to log back in to access your sessions and dashboard.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="neu-press-sm flex-1 border-2 border-ink bg-white px-3 py-3 font-grotesk text-[0.88rem] font-bold text-ink shadow-[3px_3px_0_#1A1109] disabled:opacity-60"
          >
            Stay signed in
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="neu-press-sm flex-1 border-2 border-ink bg-sienna px-3 py-3 font-grotesk text-[0.88rem] font-bold text-white shadow-[3px_3px_0_#1A1109] disabled:opacity-60"
          >
            {loading ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmModal;
