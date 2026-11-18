/**
 * Animated illustrations of HermiteCut templates.
 *
 * These are drawings, not renders: a small SVG landscape with a moving
 * subject, and CSS animations that mimic each template (see cut.css, the
 * `pv-*` classes). Real thumbnails rendered in Resolve replace them when the
 * 2.0 pack ships. Every animation is paused until the preview is on screen
 * (components/cut/live.tsx) and switched off for reduced motion.
 */

function Scene({ variant }: { variant: "a" | "b" }) {
  const id = `pv-sky-${variant}`;
  return (
    <svg className="pv-scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={variant === "a" ? "#2a2f3a" : "#1d3335"} />
          <stop offset="1" stopColor={variant === "a" ? "#5a4636" : "#2f5250"} />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#${id})`} />
      <circle cx={variant === "a" ? 118 : 42} cy="30" r="11" fill={variant === "a" ? "#e6b07a" : "#cfe3dc"} opacity="0.9" />
      <path d="M0 64 L28 50 L52 60 L84 44 L116 58 L140 50 L160 56 L160 90 L0 90 Z" fill={variant === "a" ? "#1b1d22" : "#142224"} />
      <path d="M0 74 L36 66 L74 72 L112 64 L160 70 L160 90 L0 90 Z" fill={variant === "a" ? "#121316" : "#0d1718"} />
    </svg>
  );
}

function Subject({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <span className={`pv-subj ${className}`} style={style} />;
}

function Cam({ variant = "a", className = "", children }: { variant?: "a" | "b"; className?: string; children?: React.ReactNode }) {
  return (
    <span className={`pv-cam pv-cam-${variant} ${className}`}>
      <Scene variant={variant} />
      <Subject />
      {children}
    </span>
  );
}

const GHOSTS: Record<string, number> = {
  shutter: 5, "shutter-180": 2, "shutter-360": 3, "shutter-720": 5, "shutter-1440": 8,
  echo: 5, "echo-glass": 5, "echo-stretch": 5,
  prism: 6, "prism-delay": 3,
  "stutter-soft": 1,
  timeshift: 6, "timeshift-down": 6,
};

function Ghosts({ kind }: { kind: string }) {
  const n = GHOSTS[kind] ?? 0;
  if (!n) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <Subject key={i} className={`pv-ghost pv-ghost-${i + 1}`} style={{ "--i": i + 1, "--n": n } as React.CSSProperties} />
      ))}
    </>
  );
}

function Title({ kind }: { kind: string }) {
  const lines: Record<string, [string, string]> = {
    "title-rise": ["ARTIST NAME", "“Song Title” · Directed by You"],
    "title-blur": ["ARTIST NAME", "Song Title"],
    "title-distressed": ["ARTIST NAME", "directed by your name"],
    "title-glass": ["ARTIST NAME", "Song Title"],
    "title-neon": ["ARTIST NAME", "Song Title"],
    "title-bold": ["ARTIST", "“SONG TITLE”"],
    "title-lower": ["YOUR NAME", "Director of Photography"],
    "title-social": ["FOLLOW", "@yourhandle"],
    "title-subscribe": ["SUBSCRIBE", ""],
    "title-cinematic": ["THE TITLE", "A FILM BY YOUR NAME"],
    "title-location": ["LOS ANGELES, CA", "18.11.2026 · 23:41"],
    "title-caption": ["YOUR CAPTION HERE", ""],
  };
  const [a, b] = lines[kind] ?? lines["title-rise"];
  return (
    <span className="pv-title">
      {kind === "title-glass" && <span className="pv-panel" />}
      {kind === "title-lower" && <span className="pv-bar" />}
      <span className="pv-t1">{a}</span>
      {b && <span className="pv-t2">{b}</span>}
    </span>
  );
}

export function Preview({ kind, label }: { kind: string; label?: string }) {
  const transition = kind.startsWith("t-");
  const title = kind.startsWith("title-");
  return (
    <div className={`hc-pv pv-${kind}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {transition ? (
        <>
          <Cam variant="b" className="pv-in" />
          <Cam variant="a" className="pv-out" />
          {kind === "t-split" && <Cam variant="a" className="pv-out pv-out-2" />}
        </>
      ) : (
        <Cam>
          <Ghosts kind={kind} />
          {(kind === "rgb" || kind === "vhs" || kind === "t-rgb") && (
            <>
              <Subject className="pv-chan pv-chan-r" />
              <Subject className="pv-chan pv-chan-b" />
            </>
          )}
        </Cam>
      )}
      {title && <Title kind={kind} />}
      <span className="pv-ov" />
      <span className="pv-ov2" />
    </div>
  );
}
