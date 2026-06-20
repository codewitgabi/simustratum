import { useEffect } from "react";

type DeleteSessionModalProps = {
  open: boolean;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteSessionModal({ open, loading, error, onCancel, onConfirm }: DeleteSessionModalProps) {
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
        <p className="mb-2 font-grotesk text-xl font-bold text-ink">Delete this session?</p>
        <p className="mb-7 font-inter text-[0.85rem] leading-relaxed text-mid">
          This will permanently remove the session and its transcript. This can&apos;t be undone.
        </p>
        {error && (
          <p className="mb-5 border-2 border-sienna bg-pale px-3 py-2 text-[0.78rem] font-bold text-sienna">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="neu-press-sm flex-1 border-2 border-ink bg-white px-3 py-3 font-grotesk text-[0.88rem] font-bold text-ink shadow-[3px_3px_0_#1A1109] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="neu-press-sm flex-1 border-2 border-ink bg-sienna px-3 py-3 font-grotesk text-[0.88rem] font-bold text-white shadow-[3px_3px_0_#1A1109] disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete session"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSessionModal;
