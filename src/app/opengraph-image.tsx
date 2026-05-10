import { ImageResponse } from "next/og";

export const alt = "TypeSprint — Improve Typing Speed with Lessons & AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(99,102,241,0.25), transparent 55%), radial-gradient(circle at 100% 100%, rgba(168,85,247,0.18), transparent 60%)",
          color: "#ffffff",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#ffffff",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
            }}
          >
            T
          </div>
          TypeSprint
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              maxWidth: 960,
            }}
          >
            Learn typing faster &amp; smarter
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a1a1aa",
              lineHeight: 1.3,
              maxWidth: 880,
            }}
          >
            Real-time WPM &middot; Accuracy tracking &middot; Structured lessons
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: "#71717a",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
            }}
          >
            typesprint.zeeshanai.cloud
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#4f46e5",
              padding: "12px 28px",
              borderRadius: 10,
            }}
          >
            Start for free →
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
