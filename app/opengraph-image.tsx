import { ImageResponse } from "next/og";

export const alt = "Gym 56 — Premium Fitness in Gandhinagar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(220, 38, 38, 0.08)",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            GYM 56
          </span>
          <span
            style={{
              fontSize: 32,
              color: "#DC2626",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 16,
            }}
          >
            Premium Fitness • Gandhinagar
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
