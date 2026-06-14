"use client";

import { useState } from "react";

function RememberMeCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <div className="relative shrink-0">
        <input
          id="remember"
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
      <span className="font-inter text-[0.82rem] text-mid">
        Keep me signed in for 30 days
      </span>
    </label>
  );
}

export default RememberMeCheckbox;
