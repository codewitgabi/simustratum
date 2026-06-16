"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type {
  PanelistGesture,
  SessionPanelist,
} from "@/lib/session-data";

type AvatarTheme = {
  head: string;
  hair: string;
  body: string;
};

type AvatarStyle = CSSProperties & {
  "--avatar-head": string;
  "--avatar-hair": string;
  "--avatar-body": string;
};

type PanelistAvatarProps = {
  panelist: SessionPanelist;
  theme: AvatarTheme;
  speaking: boolean;
  gesture: PanelistGesture;
  question: string;
};

const TYPE_SPEED_MS = 28;

type TypingState = { question: string; count: number };

function PanelistAvatar({
  panelist,
  theme,
  speaking,
  gesture,
  question,
}: PanelistAvatarProps) {
  const [typing, setTyping] = useState<TypingState>({ question: "", count: 0 });

  useEffect(() => {
    if (!speaking || !question) return;

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex += 1;
      const capped = Math.min(charIndex, question.length);
      setTyping({ question, count: capped });
      if (capped >= question.length) clearInterval(interval);
    }, TYPE_SPEED_MS);

    return () => clearInterval(interval);
  }, [speaking, question]);

  const typed = typing.question === question && speaking ? typing.question.slice(0, typing.count) : "";

  const avatarStyle: AvatarStyle = {
    "--avatar-head": theme.head,
    "--avatar-hair": theme.hair,
    "--avatar-body": theme.body,
  };

  return (
    <div
      className={`session-avatar${speaking ? " speaking" : ""}`}
      data-gesture={gesture}
      style={avatarStyle}
    >
      <div className="session-avatar-upper">
        <div className={`session-bubble${speaking && typed ? " visible" : ""}`}>
          <div className="session-bubble-speaker">
            {panelist.name}
            <span className="session-bubble-live">LIVE</span>
          </div>
          <div className="session-bubble-text">{typed}</div>
        </div>

        <div className="session-avatar-head">
          <div className="session-avatar-hair" />
          <div className="session-speak-ring" />
        </div>

        <div className="session-avatar-body">
          <div className="session-avatar-arm left">
            <div className="session-avatar-hand" />
          </div>
          <div className="session-avatar-arm right">
            <div className="session-avatar-hand" />
          </div>
        </div>
      </div>

      <div className="session-avatar-legs">
        {[0, 1].map((i) => (
          <div key={i} className="session-avatar-leg-col">
            <div className="session-avatar-thigh" />
            <div className="session-avatar-shin" />
            <div className="session-avatar-shoe" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PanelistAvatar;
