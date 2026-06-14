type FeatureRowProps = {
  label: string;
};

function FeatureRow({ label }: FeatureRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-camel/40 bg-sienna">
        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2 6l3 3 5-5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-inter text-[0.85rem] leading-snug text-white/70">
        {label}
      </span>
    </div>
  );
}

export default FeatureRow;
