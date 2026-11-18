import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * HermiteCut's latest version, from the synced changelog
 * (data/hermitecut-changelog.md, copied from the HermiteCut repo). Server only.
 */
export function cutVersion(): string {
  try {
    const md = readFileSync(join(process.cwd(), "data", "hermitecut-changelog.md"), "utf8");
    return md.match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1] ?? "";
  } catch {
    return "";
  }
}
