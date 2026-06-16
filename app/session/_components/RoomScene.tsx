"use client";

import FramedPicture from "./FramedPicture";
import NigeriaFlag from "./NigeriaFlag";
import OfficePlant from "./OfficePlant";
import PanelistAvatar from "./PanelistAvatar";
import WallClock from "./WallClock";
import { useRoomCamera } from "./hooks/useRoomCamera";
import {
  PANELIST_GESTURES,
  PANELIST_POSITIONS,
  PANELIST_THEMES,
  type PanelistGesture,
  type SessionPanelist,
} from "@/lib/session-data";

type RoomSceneProps = {
  panelists: SessionPanelist[];
  activeSpeaker: number | null;
  activeGesture: PanelistGesture;
  activeQuestion: string;
};

function RoomScene({
  panelists,
  activeSpeaker,
  activeGesture,
  activeQuestion,
}: RoomSceneProps) {
  const { containerRef, transform } = useRoomCamera();

  const positions = PANELIST_POSITIONS[panelists.length] ?? PANELIST_POSITIONS[3];

  return (
    <>
      {/* 3D room — preserve-3d context, panelists are NOT inside this */}
      <div ref={containerRef} className="session-room">
        <div className="session-room-drift">
          <div className="session-room-inner" style={{ transform }}>
            <div className="session-ceiling">
              <div className="session-ceiling-light" />
            </div>

            <div className="session-back-wall">
              <div className="session-window" />
              <FramedPicture
                variant="cap"
                emoji="🎓"
                style={{
                  top: "16%",
                  left: "18%",
                  width: "clamp(50px, 7vw, 76px)",
                  height: "clamp(40px, 5.6vw, 60px)",
                }}
              />
              <FramedPicture
                variant="chart"
                emoji="📊"
                secondary
                style={{
                  top: "16%",
                  right: "18%",
                  width: "clamp(50px, 7vw, 76px)",
                  height: "clamp(40px, 5.6vw, 60px)",
                }}
              />
            </div>

            <div className="session-side-wall left">
              <NigeriaFlag style={{ top: "20%", left: "32%" }} />
              <FramedPicture
                variant="chart"
                emoji="📈"
                secondary
                style={{
                  top: "58%",
                  left: "22%",
                  width: "clamp(36px, 5vw, 52px)",
                  height: "clamp(30px, 4.2vw, 42px)",
                }}
              />
            </div>

            <div className="session-side-wall right">
              <WallClock style={{ top: "16%", right: "32%" }} />
              <FramedPicture
                variant="skyline"
                emoji="🏙️"
                secondary
                style={{
                  top: "52%",
                  right: "20%",
                  width: "clamp(40px, 5.6vw, 60px)",
                  height: "clamp(32px, 4.6vw, 46px)",
                }}
              />
            </div>

            <div className="session-floor" />

            <OfficePlant style={{ position: "absolute", bottom: "10%", left: "3%" }} />
            <OfficePlant style={{ position: "absolute", bottom: "10%", right: "3%" }} />
          </div>
        </div>
      </div>

      {/* Flat 2D panelist layer — outside the 3D context so the floor never covers them */}
      <div className="session-panelist-row">
        {panelists.map((panelist, index) => {
          const speaking = activeSpeaker === index;
          const gesture = speaking
            ? activeGesture
            : PANELIST_GESTURES[index % PANELIST_GESTURES.length];

          return (
            <div
              key={panelist.id ?? panelist.name}
              className="session-panelist-slot"
              style={{ left: positions[index] ?? "50%" }}
            >
              <div className="session-chair">
                <div className="session-chair-back" />
                <div className="session-chair-seat" />
                <div className="session-chair-leg l1" />
                <div className="session-chair-leg l2" />
              </div>
              <PanelistAvatar
                panelist={panelist}
                theme={PANELIST_THEMES[index % PANELIST_THEMES.length]}
                speaking={speaking}
                gesture={gesture}
                question={activeQuestion}
              />
              <div className="session-nameplate">{panelist.name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default RoomScene;
