/* Product-UI fragments rendered inside the saturated Clay feature cards.
   Per DESIGN.md the brand voltage is product-driven — each card shows a
   small fragment of the actual product surface. */

export function CurveFragment() {
  return (
    <div className="mockup">
      <div className="mockup-titlebar">
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-title">Easing · Overshoot</span>
      </div>
      <svg viewBox="0 0 260 120" width="100%" role="img" aria-label="Bezier easing curve with draggable handles">
        <line x1="10" y1="110" x2="250" y2="110" stroke="var(--ink-400)" />
        <line x1="10" y1="10" x2="10" y2="110" stroke="var(--ink-400)" />
        <path
          d="M10 110 C 80 110, 90 -14, 150 22 S 230 10, 250 10"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line x1="10" y1="110" x2="80" y2="110" stroke="var(--ink-500)" strokeWidth="1.5" />
        <line x1="150" y1="22" x2="196" y2="8" stroke="var(--ink-500)" strokeWidth="1.5" />
        <circle cx="80" cy="110" r="5" fill="var(--ink-050)" stroke="var(--paper)" strokeWidth="2" />
        <circle cx="196" cy="8" r="5" fill="var(--ink-050)" stroke="var(--paper)" strokeWidth="2" />
        <circle cx="10" cy="110" r="4" fill="var(--paper)" />
        <circle cx="250" cy="10" r="4" fill="var(--paper)" />
      </svg>
    </div>
  );
}

export function CaptionsFragment() {
  const bars = [
    12, 22, 30, 18, 26, 34, 24, 10, 6, 14, 28, 32, 20, 26, 16, 8, 18, 30, 22,
    12, 24, 32, 18, 10,
  ];
  return (
    <div className="mockup">
      <div className="mockup-titlebar">
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-title">Correction pass</span>
      </div>
      <div className="wave" aria-hidden="true">
        {bars.map((h, i) => (
          <i key={i} style={{ height: `${h}px` }} />
        ))}
      </div>
      <div className="caption-line">
        <span className="tc">00:04.2</span>
        <span>Welcome back — today we&apos;re grading the opening scene.</span>
      </div>
      <div className="caption-line">
        <span className="tc">00:08.9</span>
        <span>Every word of this was transcribed on this machine.</span>
      </div>
      <div className="caption-line">
        <span className="tc">00:13.1</span>
        <span style={{ color: "var(--muted-soft)" }}>
          No audio ever leaves your computer.
        </span>
      </div>
    </div>
  );
}

export function ModelsFragment() {
  return (
    <div className="mockup">
      <div className="mockup-titlebar">
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-dot" />
        <span className="win-title">Model manager</span>
      </div>
      <div className="mockup-row">
        <strong>Gemma 4 · 2B</strong>
        <span className="badge-pill">
          <span className="dot dot-shipped" />
          Installed · 1.6 GB
        </span>
      </div>
      <div className="mockup-row">
        <strong>Gemma 4 · 9B</strong>
        <span className="badge-pill">8 GB RAM · Download</span>
      </div>
      <div className="mockup-row">
        <strong>Whisper large-v3</strong>
        <span className="badge-pill">
          <span className="dot dot-in-progress" />
          Downloading · 62%
        </span>
      </div>
    </div>
  );
}

export function ApiFragment() {
  return (
    <div className="mockup" style={{ padding: 0, overflow: "hidden" }}>
      <div className="code-block" style={{ margin: 0, borderRadius: 0 }}>
        <code>
          <span className="cm"># Any MCP-compatible agent can call this</span>
          {"\n"}
          <span className="ck">POST</span> /v1/curves/generate{"\n"}
          {"{"}
          {"\n"}
          {"  "}
          <span className="cs">&quot;preset&quot;</span>:{" "}
          <span className="cs">&quot;overshoot&quot;</span>,{"\n"}
          {"  "}
          <span className="cs">&quot;duration_frames&quot;</span>: 24{"\n"}
          {"}"}
        </code>
      </div>
    </div>
  );
}

/* Abstract clay-shape hero artifact — stand-in for the commissioned 3D
   claymation illustration DESIGN.md calls for (a known gap it documents). */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      width="100%"
      role="img"
      aria-label="Abstract clay shapes with a smooth easing curve"
    >
      <ellipse cx="330" cy="80" rx="52" ry="52" fill="var(--ink-400)" />
      <path
        d="M20 340 C 60 190, 150 150, 210 220 C 250 265, 260 340, 260 340 Z"
        fill="var(--ink-500)"
      />
      <path
        d="M180 340 C 230 140, 330 130, 400 340 Z"
        fill="var(--ink-300)"
      />
      <path
        d="M110 340 C 130 280, 180 270, 205 340 Z"
        fill="var(--ink-400)"
      />
      <path
        d="M20 300 C 130 300, 170 90, 400 84"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="20" cy="300" r="9" fill="var(--paper)" />
      <circle cx="400" cy="84" r="9" fill="var(--paper)" />
    </svg>
  );
}

/* Low horizon of clay mountains for the footer — Clay's signature closer. */
export function FooterMountains() {
  return (
    <svg
      className="footer-mountains"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 120 C 200 40, 320 40, 470 120 Z" fill="var(--ink-500)" />
      <path d="M300 120 C 520 10, 660 10, 900 120 Z" fill="var(--ink-300)" />
      <path d="M760 120 C 920 50, 1030 50, 1180 120 Z" fill="var(--ink-400)" />
      <path d="M1040 120 C 1200 30, 1300 30, 1440 120 Z" fill="var(--ink-400)" />
    </svg>
  );
}
