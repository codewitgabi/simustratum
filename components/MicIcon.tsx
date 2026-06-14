type MicIconProps = {
  size?: number;
};

function MicIcon({ size = 13 }: MicIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" aria-hidden>
      <rect x="4" y="1" width="5" height="7" rx="2.5" fill="white" />
      <path
        d="M2 6.5A4.5 4.5 0 0 0 11 6.5"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="6.5"
        y1="11"
        x2="6.5"
        y2="9"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="4.5"
        y1="12"
        x2="8.5"
        y2="12"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default MicIcon;
