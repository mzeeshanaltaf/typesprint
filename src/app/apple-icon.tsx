import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.45), transparent 60%)",
          color: "#ffffff",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          borderRadius: 40,
        }}
      >
        T
      </div>
    ),
    { ...size },
  );
}
