import Link from "next/link";

type LogoProps = {
  href?: string;
};

function LogoIcon() {
  return (
    <div className="logo-box">
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
  );
}

function Logo({ href = "#" }: LogoProps) {
  return (
    <Link href={href} className="logo">
      <LogoIcon />
      Simustratum
    </Link>
  );
}

export default Logo;
