import Link from "next/link";
import MicIcon from "./MicIcon";

type SignupLogoProps = {
  href?: string;
  variant?: "dark" | "light";
  className?: string;
};

function SignupLogo({
  href = "/",
  variant = "light",
  className = "",
}: SignupLogoProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 no-underline ${className}`}
    >
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center border-2",
          isDark
            ? "neu-btn-sm border-camel bg-sienna"
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
