"use client";

import { useState } from "react";
import { Preview } from "@/components/cut/preview";
import { Live } from "@/components/cut/live";

type Fx = {
  id: string;
  name: string;
  kicker: string;
  body: string;
  styles: { label: string; kind: string; note: string }[];
};

const FX: Fx[] = [
  {
    id: "slow-shutter",
    name: "Slow Shutter",
    kicker: "Shutter drag",
    body: "A real shutter-angle simulation. Delayed frames are averaged, the way a long exposure smears motion, so anything that moves leaves a soft trail while the rest stays sharp.",
    styles: [
      { label: "180°", kind: "shutter-180", note: "Half a frame of blur: the natural film look." },
      { label: "360°", kind: "shutter-360", note: "A full frame of blur: smooth and dreamy." },
      { label: "720°", kind: "shutter-720", note: "Two frames: motion turns to streaks." },
      { label: "1440°", kind: "shutter-1440", note: "Four frames: long, painterly drag." },
    ],
  },
  {
    id: "echo",
    name: "Echo",
    kicker: "Motion echoes",
    body: "Ghost copies trail behind anything that moves, a few frames apart, fading as they go.",
    styles: [
      { label: "Echoes", kind: "echo", note: "Clean ghosts, evenly spaced." },
      { label: "Glass", kind: "echo-glass", note: "Frosted, softly blurred trails." },
      { label: "Stretch", kind: "echo-stretch", note: "Each echo scales out, stretching the motion." },
    ],
  },
  {
    id: "prism",
    name: "Prism",
    kicker: "Colour trails",
    body: "Moving detail splits into colour. Still areas stay exactly as shot, because the colours add back up to the original.",
    styles: [
      { label: "Spectrum", kind: "prism", note: "A six-colour rainbow trail." },
      { label: "Delay", kind: "prism-delay", note: "Red, green and blue a few frames apart." },
    ],
  },
  {
    id: "stutter",
    name: "Stutter",
    kicker: "Frame repeats",
    body: "Frames hold and jump, like a dropped-frame camera. Set how many frames each one holds.",
    styles: [
      { label: "Classic", kind: "stutter", note: "Hard steps, held frames." },
      { label: "Soft Trails", kind: "stutter-soft", note: "Each step leaves a faint trace behind it." },
    ],
  },
  {
    id: "time-shift",
    name: "Time Shift",
    kicker: "Motion streaks",
    body: "Vertical streaks follow the motion, built from frames that came before.",
    styles: [
      { label: "Pull Up", kind: "timeshift", note: "Streaks rise above the subject." },
      { label: "Pull Down", kind: "timeshift-down", note: "Streaks drip below it." },
    ],
  },
];

function Block({ fx }: { fx: Fx }) {
  const [style, setStyle] = useState(0);
  const [original, setOriginal] = useState(false);
  const s = fx.styles[style];
  return (
    <article className="hc-fx" id={fx.id}>
      <div className="hc-fx-copy">
        <span className="label-upper">{fx.kicker}</span>
        <h3 className="display-sm">{fx.name}</h3>
        <p>{fx.body}</p>
        <div className="hc-seg" role="group" aria-label={`${fx.name} style`}>
          {fx.styles.map((x, i) => (
            <button
              key={x.label}
              type="button"
              aria-pressed={!original && i === style}
              onClick={() => {
                setStyle(i);
                setOriginal(false);
              }}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p className="hc-fx-note">{original ? "The clip as shot, with no effect." : s.note}</p>
        <label className="hc-toggle">
          <input type="checkbox" checked={original} onChange={e => setOriginal(e.target.checked)} />
          <span>View original clip</span>
        </label>
      </div>
      <Live className="hc-fx-stage">
        <Preview kind={original ? "original" : s.kind} label={`${fx.name}: ${original ? "original clip" : s.label}`} />
      </Live>
    </article>
  );
}

export function TimeFxShowcase() {
  return (
    <div className="hc-fx-list">
      {FX.map(fx => (
        <Block key={fx.id} fx={fx} />
      ))}
    </div>
  );
}
