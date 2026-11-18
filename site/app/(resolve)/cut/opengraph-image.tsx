import { ImageResponse } from "next/og";

export const alt = "HermiteCut — effects, transitions, titles and sound for DaVinci Resolve";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const cells = Array.from({ length: 8 * 14 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#08090a", color: "#edf0f1", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, width: 640 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#b9acff" }}>DAVINCI RESOLVE · TOOLKIT</div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -4, marginTop: 18 }}>Hermite<span style={{ color: "#b9acff" }}>Cut</span></div>
          <div style={{ display: "flex", fontSize: 30, color: "#9aa1a6", marginTop: 14, lineHeight: 1.3 }}>Effects, transitions, titles, Grid Reveal and sound, in one click.</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 560, height: 630, alignContent: "center", padding: 24 }}>
          {cells.map(i => {
            const on = (i % 14) + Math.floor(i / 14) < 11;
            return <div key={i} style={{ width: 36, height: 36, margin: 1, background: on ? "#b9acff" : "#16191b", opacity: on ? 0.35 + ((i * 37) % 60) / 100 : 1 }} />;
          })}
        </div>
      </div>
    ),
    size,
  );
}
