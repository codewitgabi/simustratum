"use client";

import { useEffect, useState, type CSSProperties } from "react";

type WallClockProps = {
  style?: CSSProperties;
};

function WallClock({ style }: WallClockProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div className="session-clock" style={style} aria-hidden>
      <div className="session-clock-ticks" />
      <div
        className="session-clock-hand hour"
        style={{ transform: `rotate(${hourDeg}deg)` }}
      />
      <div
        className="session-clock-hand minute"
        style={{ transform: `rotate(${minuteDeg}deg)` }}
      />
      <div className="session-clock-center" />
    </div>
  );
}

export default WallClock;
