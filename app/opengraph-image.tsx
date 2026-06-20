import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — Practice. Speak. Defend.`;

const INK = "#1A1109";
const CREAM = "#FBF4EA";
const SIENNA = "#A0522D";
const CAMEL = "#C19A6B";
const GREEN = "#52B788";

function LogoMark({ size: markSize }: { size: number }) {
  return (
    <div
      style={{
        width: markSize,
        height: markSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: SIENNA,
        border: `${Math.max(2, markSize * 0.05)}px solid ${CREAM}`,
      }}
    >
      <div
        style={{
          width: markSize * 0.56,
          height: markSize * 0.56,
          borderRadius: "50%",
          border: `${Math.max(2, markSize * 0.07)}px solid #FFFFFF`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: markSize * 0.26,
            height: markSize * 0.26,
            borderRadius: "50%",
            background: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
}

function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: INK,
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* Decorative corner brackets */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 220,
            height: 220,
            borderTop: `2px solid rgba(193,154,107,0.25)`,
            borderLeft: `2px solid rgba(193,154,107,0.25)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 160,
            height: 160,
            borderBottom: `2px solid rgba(193,154,107,0.18)`,
            borderRight: `2px solid rgba(193,154,107,0.18)`,
          }}
        />

        {/* Header: logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LogoMark size={48} />
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: -0.5,
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        {/* Main row */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56, marginTop: 12 }}>
          {/* Left: headline */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: `2px solid ${CAMEL}`,
                background: "rgba(193,154,107,0.08)",
                padding: "7px 16px",
                marginBottom: 26,
                alignSelf: "flex-start",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN }} />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: CAMEL,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                AI-Powered Academic Practice
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1.5,
                color: "#FFFFFF",
                marginBottom: 22,
              }}
            >
              <span>Stop rehearsing</span>
              <span>in your head.</span>
              <span
                style={{
                  display: "flex",
                  background: SIENNA,
                  color: "#FFFFFF",
                  padding: "2px 14px",
                  marginTop: 6,
                  alignSelf: "flex-start",
                }}
              >
                Speak out loud.
              </span>
            </div>

            <span style={{ fontSize: 20, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", maxWidth: 480 }}>
              Practice with AI panelists who ask hard questions — just like your real defense,
              seminar, or oral exam.
            </span>
          </div>

          {/* Right: session card mockup */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 360,
              background: CREAM,
              border: `3px solid ${INK}`,
              boxShadow: `10px 10px 0 ${CAMEL}`,
              padding: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `2px solid ${INK}`,
                paddingBottom: 16,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: SIENNA,
                  border: `2px solid ${INK}`,
                  padding: "4px 10px",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Project Defense
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: `2px solid ${INK}`,
                  background: "#F0E5D0",
                  padding: "4px 10px",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: GREEN,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Session live
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: `2px solid ${INK}`,
                  background: "#F0E5D0",
                  padding: "8px 12px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${INK}`,
                    background: "#FDEBD0",
                    fontSize: 13,
                    fontWeight: 700,
                    color: INK,
                  }}
                >
                  Dr
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>Dr. Okafor</span>
                  <span style={{ fontSize: 11, color: "#7A5C3A" }}>Strict · Research Methods</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: `2px solid ${INK}`,
                background: INK,
                padding: 14,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: CAMEL,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Dr. Okafor →
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: "#FFFFFF" }}>
                &ldquo;How do you justify your sampling method given the limitations you
                acknowledged?&rdquo;
              </span>
            </div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div
          style={{
            display: "flex",
            borderTop: `2px solid rgba(255,255,255,0.12)`,
            paddingTop: 24,
            gap: 56,
          }}
        >
          {[
            { value: "5+", label: "Practice modes" },
            { value: "24/7", label: "Always available" },
            { value: "100%", label: "Judgment-free" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: SIENNA, letterSpacing: -0.5 }}>
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

export default OpengraphImage;
