import Link from "next/link";
import type { ElementType } from "react";

type RecentSessionItemProps = {
  icon: string;
  title: string;
  meta: string;
  score: number;
  scoreClass: string;
  statusLabel?: string | null;
  statusDotClass?: string | null;
  collapsed?: boolean;
  href?: string;
  onDelete?: () => void;
};

function RecentSessionItem({
  icon,
  title,
  meta,
  score,
  scoreClass,
  statusLabel,
  statusDotClass,
  collapsed = false,
  href,
  onDelete,
}: RecentSessionItemProps) {
  const fullMeta = statusLabel ? `${meta} · ${statusLabel}` : meta;
  const Wrapper: ElementType = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  if (collapsed) {
    return (
      <Wrapper
        {...wrapperProps}
        className="history-item relative flex cursor-pointer items-center justify-center border-2 border-transparent px-0 py-2 no-underline"
        title={`${title} · ${fullMeta}`}
      >
        <span className="text-lg leading-none">{icon}</span>
        {statusDotClass && (
          <span
            className={`absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full ${statusDotClass}`}
          />
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      className="history-item group flex cursor-pointer items-center gap-3 border-2 border-transparent px-3 py-2.5 no-underline"
    >
      <span className="shrink-0 text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {statusDotClass && (
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDotClass}`} />
          )}
          <p className="truncate font-grotesk text-[0.78rem] font-bold text-white">
            {title}
          </p>
        </div>
        <p className="truncate text-xxs text-white/35">{fullMeta}</p>
      </div>
      <span
        className={`shrink-0 px-1.5 py-0.5 font-grotesk text-xxs font-bold ${scoreClass}`}
      >
        {score}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete();
          }}
          aria-label={`Delete ${title}`}
          className="shrink-0 text-white/0 transition-colors group-hover:text-white/40 hover:!text-red-400 focus-visible:text-white/40"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2.5 3.5h9M5.5 3.5V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5M5 6v4.5M9 6v4.5M3.5 3.5l.6 7.5a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-7.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </Wrapper>
  );
}

export default RecentSessionItem;
