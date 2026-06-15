type RecentSessionItemProps = {
  icon: string;
  title: string;
  meta: string;
  score: number;
  scoreClass: string;
  collapsed?: boolean;
};

function RecentSessionItem({
  icon,
  title,
  meta,
  score,
  scoreClass,
  collapsed = false,
}: RecentSessionItemProps) {
  if (collapsed) {
    return (
      <div
        className="history-item flex cursor-pointer items-center justify-center border-2 border-transparent px-0 py-2"
        title={`${title} · ${meta}`}
      >
        <span className="text-lg leading-none">{icon}</span>
      </div>
    );
  }

  return (
    <div className="history-item flex cursor-pointer items-center gap-3 border-2 border-transparent px-3 py-2.5">
      <span className="shrink-0 text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-grotesk text-[0.78rem] font-bold text-white">
          {title}
        </p>
        <p className="truncate text-xxs text-white/35">{meta}</p>
      </div>
      <span
        className={`shrink-0 px-1.5 py-0.5 font-grotesk text-xxs font-bold ${scoreClass}`}
      >
        {score}
      </span>
    </div>
  );
}

export default RecentSessionItem;
