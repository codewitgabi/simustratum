"use client";

import { sliderLabel } from "@/lib/dashboard-utils";

type PersonalitySliderProps = {
  leftLabel: string;
  rightLabel: string;
  labels: string[];
  value: number;
  onChange: (value: number) => void;
};

function PersonalitySlider({
  leftLabel,
  rightLabel,
  labels,
  value,
  onChange,
}: PersonalitySliderProps) {
  const current = sliderLabel(value, labels);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between sm:hidden">
        <span className="font-grotesk text-[0.62rem] font-bold tracking-wide text-sienna uppercase">
          {current}
        </span>
      </div>
      <div className="hidden items-center justify-between gap-2 sm:flex">
        <span className="shrink-0 text-[0.7rem] font-semibold text-mid">
          {leftLabel}
        </span>
        <span className="font-grotesk text-[0.62rem] font-bold tracking-wide text-sienna uppercase">
          {current}
        </span>
        <span className="shrink-0 text-[0.7rem] font-semibold text-mid">
          {rightLabel}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="personality-slider"
        aria-valuetext={current}
      />
    </div>
  );
}

export default PersonalitySlider;
