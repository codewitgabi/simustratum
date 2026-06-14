"use client";

import { useState } from "react";

function TermsCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="group flex cursor-pointer items-start gap-3">
      <div className="relative mt-0.5 shrink-0">
        <input
          id="terms"
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={[
            "flex h-5 w-5 items-center justify-center border-2 border-ink shadow-[2px_2px_0_#1A1109] transition-colors",
            checked ? "bg-sienna" : "bg-cream",
          ].join(" ")}
        >
          {checked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="font-inter text-[0.8rem] leading-[1.55] text-mid select-none">
        I agree to Simustratum&apos;s{" "}
        <a
          href="#"
          className="font-semibold text-sienna underline underline-offset-2 hover:text-ink"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="font-semibold text-sienna underline underline-offset-2 hover:text-ink"
        >
          Privacy Policy
        </a>
      </span>
    </label>
  );
}

export default TermsCheckbox;
