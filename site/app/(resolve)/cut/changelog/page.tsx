import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { CUT_DOWNLOAD, CUT_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: { absolute: "Changelog — HermiteCut" },
  description: "Every HermiteCut release and what changed.",
  alternates: { canonical: `${CUT_URL}/changelog` },
};

/**
 * Fed from HermiteCut's CHANGELOG.md: data/hermitecut-changelog.md is a copy
 * (refresh it when HermiteCut releases), and the copy on GitHub's main branch
 * is used instead whenever it is newer.
 */
const RAW = "https://raw.githubusercontent.com/gafaraleshe/HermiteCut/main/CHANGELOG.md";

async function source(): Promise<string> {
  const local = fs.readFileSync(path.join(process.cwd(), "data", "hermitecut-changelog.md"), "utf8");
  try {
    const r = await fetch(RAW, { next: { revalidate: 3600 } });
    if (r.ok) {
      const remote = await r.text();
      const ver = (t: string) => (t.match(/^## \[(\d+\.\d+\.\d+)\]/m) || [])[1] || "0";
      if (ver(remote).localeCompare(ver(local), undefined, { numeric: true }) > 0) return remote;
    }
  } catch { /* offline build: use the copy */ }
  return local;
}

function inline(s: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={k++}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k++}>{t.slice(1, -1)}</code>);
    else { const mm = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!; out.push(<a key={k++} href={mm[2]}>{mm[1]}</a>); }
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function render(md: string) {
  const body = md.split(/\n(?=## \[)/).slice(1).filter(b => !b.startsWith("## [Unreleased]"));
  return body.map(block => {
    const lines = block.split("\n");
    const [, ver, date] = lines[0].match(/^## \[([^\]]+)\](?:\s*-\s*(.+))?/) || [];
    const items: React.ReactNode[] = [];
    let list: string[] = [], para: string[] = [], key = 0;
    const flushList = () => { if (list.length) items.push(<ul key={key++}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>); list = []; };
    const flushPara = () => { if (para.length) items.push(<p key={key++}>{inline(para.join(" "))}</p>); para = []; };
    for (const raw of lines.slice(1)) {
      const line = raw.trimEnd();
      if (/^\[.+\]:/.test(line)) continue;
      if (line.startsWith("### ")) { flushList(); flushPara(); items.push(<h3 key={key++}>{line.slice(4)}</h3>); }
      else if (/^\s*- /.test(line)) { flushPara(); list.push(line.replace(/^\s*- /, "")); }
      else if (/^\s{2,}\S/.test(line) && list.length) list[list.length - 1] += " " + line.trim();
      else if (!line.trim()) { flushList(); flushPara(); }
      else { flushList(); para.push(line); }
    }
    flushList(); flushPara();
    return (
      <article key={ver} id={`v${ver}`} className="studio-prose rounded-2xl bg-studio-surface border border-studio-border p-6 sm:p-8 scroll-mt-24">
        <header className="flex items-baseline justify-between gap-4 border-b border-studio-border pb-3 -mt-1">
          <h2 className="!m-0">{ver}</h2>
          {date && <time className="font-mono text-xs text-studio-muted">{date}</time>}
        </header>
        <div>{items}</div>
      </article>
    );
  });
}

export default async function Changelog() {
  const md = await source();
  return (
    <main id="main" className="studio-grid-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <span className="font-mono text-xs uppercase tracking-widest text-studio-accent block mb-2">HermiteCut</span>
        <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight text-studio-text">Changelog.</h1>
        <p className="text-studio-muted mt-4 mb-10">
          Every release, newest first. The latest downloads are on the{" "}
          <a className="text-studio-accent underline" href={CUT_DOWNLOAD}>release page</a>.
        </p>
        <div className="grid gap-5">{render(md)}</div>
      </div>
    </main>
  );
}
