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
      className="history-item flex cursor-pointer items-center gap-3 border-2 border-transparent px-3 py-2.5 no-underline"
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
    </Wrapper>
  );
}

export default RecentSessionItem;
