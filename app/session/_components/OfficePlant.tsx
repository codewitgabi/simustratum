import type { CSSProperties } from "react";

type OfficePlantProps = {
  style?: CSSProperties;
};

function OfficePlant({ style }: OfficePlantProps) {
  return (
    <div className="session-plant" style={style} aria-hidden>
      <div className="session-plant-leaves">
        <span />
      </div>
      <div className="session-plant-pot" />
    </div>
  );
}

export default OfficePlant;
