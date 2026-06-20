"use client";

import { useState } from "react";

const LEVELS = [
  { label: "Too short", color: "#EF4444" },
  { label: "Weak", color: "#F97316" },
  { label: "Fair", color: "#EAB308" },
  { label: "Strong", color: "#22C55E" },
];

function getStrength(password: string): number {
  if (password.length < 6) return 0;
  let score = 1;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9!@#$%^&*]/.test(password)) score++;
  return Math.min(score, 4);
}

function EyeOpenIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
      <path
        d="M1 8.5C1 8.5 3.5 3 8.5 3s7.5 5.5 7.5 5.5S13.5 14 8.5 14 1 8.5 1 8.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden>
      <path
        d="M1 1l15 15M6.5 5.5A2 2 0 0 1 10.5 9.5M4.2 4.2C2.5 5.4 1 8.5 1 8.5s2.5 5.5 7.5 5.5c1.5 0 2.9-.4 4-.9M7 3.1c.5-.1 1-.1 1.5-.1 5 0 7.5 5.5 7.5 5.5s-.8 1.8-2.3 3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

type PasswordFieldProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  showStrength?: boolean;
};

function PasswordField({
  id = "password",
  label = "Password",
  placeholder = "At least 8 characters",
  autoComplete = "new-password",
  value,
  onChange,
  error,
  showStrength = true,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  const level = value.length === 0 ? 0 : getStrength(value);
  const activeLevel = level > 0 ? LEVELS[level - 1] : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-grotesk text-[0.72rem] font-bold tracking-[0.08em] text-ink uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "neu-input w-full border-2 border-ink bg-cream px-4 py-3 pr-12 font-inter text-[0.9rem] text-ink placeholder:text-mid/50",
            error ? "error" : "",
          ].join(" ")}
        />
        <button
          type="button"
          className="pw-toggle absolute top-1/2 right-3.5 -translate-y-1/2 text-mid transition-colors hover:text-ink"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon /> : <EyeOpenIcon />}
        </button>
      </div>

      {showStrength && (
        <>
          <div className="mt-1 flex gap-1" aria-hidden={value.length === 0}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[3px] flex-1"
                style={{
                  background:
                    value.length > 0 && i < level
                      ? (activeLevel?.color ?? "rgba(26,17,9,0.1)")
                      : "rgba(26,17,9,0.1)",
                }}
              />
            ))}
          </div>

          {value.length > 0 && activeLevel && (
            <p className="font-inter text-[0.65rem]" style={{ color: activeLevel.color }}>
              {activeLevel.label}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default PasswordField;
