type EndSessionModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function EndSessionModal({ open, onCancel, onConfirm }: EndSessionModalProps) {
  if (!open) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-110 flex items-center justify-center bg-ink/75 p-4">
      <div className="w-full max-w-sm border-3 border-ink bg-cream p-8 shadow-[8px_8px_0_#1A1109]">
        <p className="mb-2 font-grotesk text-xl font-bold text-ink">End this session?</p>
        <p className="mb-7 font-inter text-[0.85rem] leading-relaxed text-mid">
          Your progress will be saved and you&apos;ll receive a full feedback report.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="neu-press-sm flex-1 border-2 border-ink bg-white px-3 py-3 font-grotesk text-[0.88rem] font-bold text-ink shadow-[3px_3px_0_#1A1109]"
          >
            Keep going
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="neu-press-sm flex-1 border-2 border-ink bg-sienna px-3 py-3 font-grotesk text-[0.88rem] font-bold text-white shadow-[3px_3px_0_#1A1109]"
          >
            End &amp; get feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndSessionModal;
