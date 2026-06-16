import type { CSSProperties } from "react";

type FramedPictureProps = {
  variant: "cap" | "chart" | "skyline";
  emoji: string;
  secondary?: boolean;
  style?: CSSProperties;
};

function FramedPicture({ variant, emoji, secondary, style }: FramedPictureProps) {
  return (
    <div
      className={`session-wall-frame${secondary ? " secondary" : ""}`}
      style={style}
      aria-hidden
    >
      <div className={`session-wall-frame-art ${variant}`}>{emoji}</div>
    </div>
  );
}

export default FramedPicture;
