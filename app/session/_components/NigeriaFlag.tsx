import type { CSSProperties } from "react";

type NigeriaFlagProps = {
  style?: CSSProperties;
};

function NigeriaFlag({ style }: NigeriaFlagProps) {
  return (
    <div className="session-flag" style={style} role="img" aria-label="Nigerian flag">
      <div className="session-flag-pole" />
      <div className="session-flag-cloth">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default NigeriaFlag;
