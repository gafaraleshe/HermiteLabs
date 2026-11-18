import { CUT_URL } from "@/lib/config";

/**
 * The thin bar above the navigation on every page: one piece of real news,
 * linked. Change the text here when something new ships.
 */
export function Announce() {
  return (
    <a className="announce" href={`${CUT_URL}/#claude`}>
      <span className="announce-tag">New</span>
      <span>HermiteCut 2.1 works with Claude: edit in Resolve by asking.</span>
      <span className="announce-go" aria-hidden="true">See how →</span>
    </a>
  );
}
