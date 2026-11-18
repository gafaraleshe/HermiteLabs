import { ImageResponse } from "next/og";

export const alt = "Hermite Labs — software for creative businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#08090a", color: "#edf0f1", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#6b7378" }}>HERMITE LABS — BY GAFFY STUDIOS</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Software for creative businesses.</div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 32, color: "#9aa1a6" }}>
            Hermite<span style={{ color: "#b9acff" }}>Cut</span>&nbsp;·&nbsp;Hermite<span style={{ color: "#3adcc8" }}>Flow</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
