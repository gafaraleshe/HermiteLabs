/**
 * The HermiteCut product panel — the dark "app screenshot" the landing page
 * floats on the cream canvas.
 *
 * It is a drawing, not a screenshot: no image to go stale, no video to
 * download, and it themes itself from the stage tokens in cut-theme.css. The
 * animation runs on a single 9s loop shared by the timeline clips, the
 * playhead and the title card, so the three read as one take. All of it is
 * decorative and switched off under prefers-reduced-motion.
 */

/** The easing curve shown in the inspector — overshoot, the signature preset. */
function CurveGraph() {
  return (
    <svg viewBox="0 0 200 96" width="100%" role="img" aria-label="Overshoot easing curve">
      <line x1="8" y1="88" x2="192" y2="88" stroke="var(--stage-300)" strokeWidth="1" />
      <line x1="8" y1="8" x2="8" y2="88" stroke="var(--stage-300)" strokeWidth="1" />
      <path
        d="M8 88 C 62 88, 70 -6, 116 16 S 176 8, 192 8"
        fill="none"
        stroke="var(--cut-300)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="8" y1="88" x2="62" y2="88" stroke="var(--stage-line-strong)" strokeWidth="1" />
      <line x1="116" y1="16" x2="150" y2="6" stroke="var(--stage-line-strong)" strokeWidth="1" />
      <circle cx="62" cy="88" r="3.5" fill="var(--stage-000)" stroke="var(--stage-text)" strokeWidth="1.5" />
      <circle cx="150" cy="6" r="3.5" fill="var(--stage-000)" stroke="var(--stage-text)" strokeWidth="1.5" />
    </svg>
  );
}

export function CutPreview() {
  return (
    <div className="hc-app" aria-label="HermiteCut running alongside a Resolve timeline">
      <div className="hc-app-bar">
        <span className="hc-app-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="hc-app-title">HermiteCut · Resolve bridge</span>
        <span className="hc-app-right">
          <em>●</em> On device
        </span>
      </div>

      <div className="hc-app-body">
        <div className="hc-app-main">
          <div className="hc-viewer">
            <span className="hc-safe" aria-hidden="true" />
            <div className="hc-card">
              <b>Opening titles</b>
              <span>Slide-in · Overshoot · 24f</span>
            </div>
          </div>

          <div className="hc-timeline">
            <div className="hc-ruler" aria-hidden="true">
              <span>00:00:00</span>
              <span>00:00:12</span>
              <span>00:00:24</span>
            </div>
            <div className="hc-track">
              <span className="hc-track-name">Video 1</span>
              <span className="hc-lane">
                <i className="hc-clip hc-clip--base" />
              </span>
            </div>
            <div className="hc-track">
              <span className="hc-track-name">Motion</span>
              <span className="hc-lane">
                <i className="hc-clip hc-clip--motion" />
              </span>
            </div>
            <div className="hc-track">
              <span className="hc-track-name">Subtitles</span>
              <span className="hc-lane">
                <i className="hc-clip hc-clip--subs" />
              </span>
            </div>
            <span className="hc-playhead" aria-hidden="true" />
          </div>
        </div>

        <aside className="hc-app-side">
          <div>
            <span className="hc-side-label">Easing</span>
            <div className="hc-curve" style={{ marginTop: "8px" }}>
              <CurveGraph />
            </div>
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            <span className="hc-side-label">Presets</span>
            <div className="hc-preset hc-preset--on">
              Slide in · left <span>1</span>
            </div>
            <div className="hc-preset">
              Pop scale <span>2</span>
            </div>
            <div className="hc-preset">
              Ken Burns <span>3</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/** Larger version of the curve, for the feature bento. */
export function CurveFigure() {
  return (
    <div className="hc-figure">
      <svg
        viewBox="0 0 320 170"
        width="100%"
        role="img"
        aria-label="Bezier easing curve editor with draggable handles"
      >
        <g stroke="var(--hairline)" strokeWidth="1">
          <line x1="16" y1="42" x2="304" y2="42" />
          <line x1="16" y1="90" x2="304" y2="90" />
          <line x1="112" y1="14" x2="112" y2="152" />
          <line x1="208" y1="14" x2="208" y2="152" />
        </g>
        <line x1="16" y1="152" x2="304" y2="152" stroke="var(--i-400)" strokeWidth="1.5" />
        <line x1="16" y1="14" x2="16" y2="152" stroke="var(--i-400)" strokeWidth="1.5" />
        <path
          d="M16 152 C 100 152, 112 -4, 186 26 S 282 14, 304 14"
          fill="none"
          stroke="var(--accent-line)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line x1="16" y1="152" x2="100" y2="152" stroke="var(--i-500)" strokeWidth="1.5" />
        <line x1="186" y1="26" x2="242" y2="10" stroke="var(--i-500)" strokeWidth="1.5" />
        <circle cx="100" cy="152" r="5.5" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="242" cy="10" r="5.5" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="16" cy="152" r="4" fill="var(--ink)" />
        <circle cx="304" cy="14" r="4" fill="var(--ink)" />
      </svg>
    </div>
  );
}
