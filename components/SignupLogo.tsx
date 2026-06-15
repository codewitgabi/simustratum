import Link from "next/link";
import MicIcon from "./MicIcon";

type SignupLogoProps = {
  href?: string;
  variant?: "dark" | "light";
  className?: string;
  onClick?: () => void;
};

function SignupLogo({
  href = "/",
  variant = "light",
  className = "",
  onClick,
}: SignupLogoProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 no-underline ${className}`}
    >
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center border-2",
          isDark
            ? "neu-press-sm border-camel bg-sienna shadow-[3px_3px_0_rgba(193,154,107,0.5)]"
            : "border-ink bg-sienna shadow-[2px_2px_0_#1A1109]",
        ].join(" ")}
      >
        <MicIcon />
      </span>
      <span
        className={[
          "font-grotesk text-[1.15rem] font-bold tracking-tight",
          isDark ? "text-white" : "text-ink",
        ].join(" ")}
      >
        Simustratum
      </span>
    </Link>
  );
}

export default SignupLogo;
