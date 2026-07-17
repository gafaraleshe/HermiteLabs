const stages = [
  {
    name: "Motion",
    detail:
      "One-click motion presets, a bezier easing curve editor, and speed-ramp tools — smooth keyframe animation without hand-editing curves in Fusion.",
    status: "In development",
  },
  {
    name: "Subs",
    detail:
      "Fully on-device transcription and captioning. Your audio never leaves your machine.",
    status: "Planned",
  },
  {
    name: "AI",
    detail:
      "A swappable local AI layer — pick the model that fits your hardware, for caption cleanup and editing assistance.",
    status: "Planned",
  },
  {
    name: "Enterprise API",
    detail:
      "A hosted API with MCP integration so AI agents can drive Hermite's capabilities as tool calls.",
    status: "Planned",
  },
];

export default function Home() {
  return (
    <main className="wrap">
      <p className="kicker">Gaffy Studios presents</p>
      <h1>Hermite</h1>
      <p className="tagline">
        Smooth animation for DaVinci Resolve — After Effects–style motion
        control, on-device auto-subtitles, and a local AI layer. In active
        development.
      </p>

      <ul className="stages">
        {stages.map(s => (
          <li key={s.name}>
            <div className="stage-head">
              <h2>{s.name}</h2>
              <span className="badge">{s.status}</span>
            </div>
            <p>{s.detail}</p>
          </li>
        ))}
      </ul>

      <p className="cta">
        Follow the build on{" "}
        <a
          href="https://github.com/gafaraleshe/hermite"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </main>
  );
}
