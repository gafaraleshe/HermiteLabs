import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { CHECKOUT_LIVE, CUT_URL, POLAR_PORTAL_URL } from "@/lib/config";

/**
 * The update feed HermiteCut checks (app/shell.js in the HermiteCut repo):
 * https://cut.hermitelabs.com/api/hermitecut/latest
 * Built from the synced changelog (data/hermitecut-changelog.md), so syncing
 * the changelog after a release is what tells the app there is an update.
 */
export const dynamic = "force-static";

function latest() {
  const md = readFileSync(join(process.cwd(), "data", "hermitecut-changelog.md"), "utf8");
  const m = md.match(/^## \[(\d+\.\d+\.\d+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?([\s\S]*?)(?=^## \[|$(?![\s\S]))/m);
  if (!m) return null;
  // The bold lead of each top-level bullet ("- **Licence keys.** ...").
  const summary = [...(m[3] ?? "").matchAll(/^- \*\*(.+?)\*\*/gm)].map((x) => x[1].replace(/[.:]$/, "")).slice(0, 5);
  return { version: m[1], released: m[2] ?? "", summary };
}

export function GET() {
  const l = latest();
  if (!l) return NextResponse.json({ error: "No release found" }, { status: 500 });
  return NextResponse.json(
    {
      product: "HermiteCut",
      ...l,
      notesUrl: `${CUT_URL}/changelog`,
      // Paid builds come from the buyer's Polar account; free builds from the site.
      downloadUrl: CHECKOUT_LIVE && POLAR_PORTAL_URL ? POLAR_PORTAL_URL : `${CUT_URL}/#purchase`,
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600", "Access-Control-Allow-Origin": "*" } },
  );
}
