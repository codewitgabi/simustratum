import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
};

function Logo({ href = "#", className = "" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 font-grotesk text-[1.25rem] font-bold tracking-[-0.5px] text-ink no-underline ${className}`}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink bg-sienna shadow-neu-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="3" fill="white" />
          <circle
            cx="7"
            cy="7"
            r="5"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      Simustratum
    </Link>
  );
}

export default Logo;
