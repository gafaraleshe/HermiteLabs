"use client";

import { useMemo, useState } from "react";
import { Preview } from "@/components/cut/preview";
import { Live } from "@/components/cut/live";
import { TABS, templates, demoFor, type TabId } from "@/lib/cut";

/** The template gallery: tabs for Effects / Time FX / Transitions / Titles,
 *  family chips, and one card per template with an animated preview. */
export function TemplateGallery() {
  const [tab, setTab] = useState<TabId>("effects");
  const [family, setFamily] = useState<string>("All");

  const inTab = useMemo(() => templates.filter(TABS.find(t => t.id === tab)!.match), [tab]);
  const families = useMemo(() => ["All", ...Array.from(new Set(inTab.map(t => t.family)))], [inTab]);
  const shown = family === "All" ? inTab : inTab.filter(t => t.family === family);

  return (
    <div className="hc-gallery">
      <div className="hc-tabs" role="tablist" aria-label="Template type">
        {TABS.map(t => {
          const n = templates.filter(t.match).length;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              className="hc-tab"
              onClick={() => {
                setTab(t.id);
                setFamily("All");
              }}
            >
              {t.label}
              <span className="hc-count">{n}</span>
            </button>
          );
        })}
      </div>

      {families.length > 2 && (
        <div className="hc-chips" aria-label="Family">
          {families.map(f => (
            <button
              key={f}
              type="button"
              className="hc-chip"
              aria-pressed={family === f}
              onClick={() => setFamily(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <ul className="hc-grid" role="tabpanel">
        {shown.map(t => (
          <Live as="li" key={`${t.kind}-${t.name}`} className="hc-card">
            <Preview kind={demoFor(t)} />
            <div className="hc-card-body">
              <div className="hc-card-head">
                <h3>{t.name}</h3>
                <span className="hc-fam">{t.family}</span>
              </div>
              <p>{t.blurb}</p>
              {t.styles.length > 0 && (
                <div className="hc-styles" aria-label="Styles">
                  {t.styles.map(s => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </Live>
        ))}
      </ul>
      <p className="hc-note">
        Previews are animated illustrations. Thumbnails and clips rendered in
        DaVinci Resolve replace them when 2.0 ships.
      </p>
    </div>
  );
}
