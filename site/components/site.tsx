import Link from "next/link";
import {
  changelog,
  GITHUB_URL,
  statusLabel,
  type Feature,
  type Status,
} from "@/lib/content";
import { FooterMountains } from "@/components/fragments";
import { HermiteMark } from "@/components/hermite-mark";

export function StatusBadge({
  status,
  onDark = false,
  onColor = false,
}: {
  status: Status;
  onDark?: boolean;
  onColor?: boolean;
}) {
  const variant = onDark ? " badge-on-dark" : onColor ? " badge-on-color" : "";
  return (
    <span className={`badge-pill${variant}`}>
      <span className={`dot dot-${status}`} />
      {statusLabel[status]}
    </span>
  );
}

export function Changelog({ limit }: { limit?: number }) {
  const entries = limit ? changelog.slice(0, limit) : changelog;
  return (
    <div className="entries">
      {entries.map(e => (
        <div className="changelog-entry" key={`${e.date}-${e.title}`}>
          <time dateTime={e.date}>{e.date}</time>
          <div>
            <div className="t">{e.title}</div>
            <p>{e.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RoadmapList({ features }: { features: Feature[] }) {
  return (
    <div className="roadmap-list">
      {features.map(f => (
        <div className="roadmap-item" key={f.id}>
          <div>
            <h4>{f.title}</h4>
            <p>{f.blurb}</p>
          </div>
          <StatusBadge status={f.status} />
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/cut" className="nav-wordmark">
              <HermiteMark size={22} product="cut" title="HermiteCut" />
              <span>
                Hermite<span style={{ color: "var(--accent)" }}>Cut</span>
              </span>
            </Link>
            <p className="fine">
              Smooth animation, on-device subtitles, and a local AI layer for
              DaVinci Resolve. Built in the open by Gaffy Studios.
            </p>
            <p className="fine">
              Motion, Subs, and AI run fully on your machine. The enterprise
              API is the deliberate, clearly separated cloud exception.
            </p>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li>
                <Link href="/motion">Hermite Motion</Link>
              </li>
              <li>
                <Link href="/subs">Hermite Subs</Link>
              </li>
              <li>
                <Link href="/ai">Hermite AI</Link>
              </li>
              <li>
                <Link href="/enterprise">Hermite API</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li>
                <Link href="/roadmap">Roadmap</Link>
              </li>
              <li>
                <Link href="/roadmap#changelog">Changelog</Link>
              </li>
              <li>
                <Link href="/docs">Docs</Link>
              </li>
              <li>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5>Hermite Labs</h5>
            <ul>
              <li>
                <a href="https://hermitelabs.com">The suite</a>
              </li>
              <li>
                <a href="https://flow.hermitelabs.com">HermiteFlow</a>
              </li>
              <li>
                <a
                  href="https://gaffystudios.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Gaffy Studios
                </a>
              </li>
            </ul>
          </div>
        </div>
        <FooterMountains />
      </div>
    </footer>
  );
}
