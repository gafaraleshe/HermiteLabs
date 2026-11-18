/**
 * HermiteCut product data for /cut.
 *
 * Templates come from data/cut-templates.json, which is exported from the
 * HermiteCut repo's pack generator (tools/fusegen/build_pack.py writes
 * build/HermiteCut-manifest.json). Refresh it from there rather than editing
 * names by hand, so the site always lists exactly what the pack contains.
 */
import templatesData from "../data/cut-templates.json";

export { CUT_REPO, CUT_DOWNLOAD } from "@/lib/config";

export type TemplateKind = "effect" | "transition" | "title";

export interface CutTemplate {
  name: string;
  kind: TemplateKind;
  family: string;
  blurb: string;
  styles: string[];
  controls: string[];
}

export const templates = templatesData.templates as CutTemplate[];
export const packVersion = templatesData.version;

/** Gallery tabs, in display order. Time FX are effects, shown on their own. */
export const TABS = [
  { id: "effects", label: "Effects", match: (t: CutTemplate) => t.kind === "effect" && !["Time FX", "Grid Reveal"].includes(t.family) },
  { id: "timefx", label: "Time FX", match: (t: CutTemplate) => t.family === "Time FX" },
  { id: "transitions", label: "Transitions", match: (t: CutTemplate) => t.kind === "transition" && t.family !== "Grid Reveal" },
  { id: "grid", label: "Grid Reveal", match: (t: CutTemplate) => t.family === "Grid Reveal" },
  { id: "titles", label: "Titles", match: (t: CutTemplate) => t.kind === "title" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function countFor(tab: TabId) {
  const t = TABS.find(x => x.id === tab)!;
  return templates.filter(t.match).length;
}

/**
 * Which animated illustration each template gets. Previews are drawn in
 * SVG/CSS (components/cut/preview.tsx), not rendered footage.
 */
const DEMO_BY_NAME: Record<string, string> = {
  // effects
  Flash: "flash", "Glow Flash": "glowflash", "Frame Flash": "flash", "Colour Flash": "colourflash",
  "Exposure Pop": "pop-exposure", Strobe: "strobe",
  Twitch: "twitch", "XY Shake": "shake", "Vertical Shake": "vshake", "Zoom Shake": "zoomshake",
  Earthquake: "quake", Handheld: "handheld",
  Defocus: "defocus", "Zoom Blur": "zoomblur", "Whip Blur": "whipblur", "Glow Blur": "glowblur",
  "Zoom Punch": "punch", "Zoom Out": "zoomout", Slide: "slide", Spin: "spin", Pop: "pop",
  Bounce: "bounce", "Smooth Zoom": "smoothzoom", "Ken Burns": "kenburns", "Fade Move": "fademove",
  "RGB Split": "rgb", "Digital Glitch": "glitch", VHS: "vhs", Invert: "invert", Pixelate: "pixelate",
  "Film Burn": "burn", "Light Leak": "leak", "Film Look": "filmlook", "Gate Weave": "weave",
  "Vignette Pulse": "vignette", Letterbox: "letterbox",
  // time fx
  "Slow Shutter": "shutter", Echo: "echo", Prism: "prism", Stutter: "stutter", "Time Shift": "timeshift",
  // transitions
  Whip: "t-whip", "Hyper Slide": "t-hyper", "Swish Glow": "t-swish", "Split Slide": "t-split",
  "Spin 360": "t-spin", "Scale In": "t-scalein", "Scale Out": "t-scaleout", Grid: "t-grid",
  Shake: "t-shake", "Lens Flare": "t-flare", "Light Wipe": "t-wipe", "Exposure Flash": "t-flash",
  "Luma Fade": "t-luma", "Chromatic Split": "t-rgb", Glitch: "t-glitch", Negative: "t-negative",
  Displace: "t-displace", "Focus Pull": "t-focus", "Shutter Swipe": "t-shutter", "Shutter Whip": "t-shutterwhip",
  // titles
  "Credit Clean": "title-rise", "Credit Blur": "title-blur", "Credit Distressed": "title-distressed",
  "Credit Glass": "title-glass", "Credit Neon": "title-neon", "Credit Bold": "title-bold",
  "Lower Third": "title-lower", "Social Handle": "title-social", "Subscribe Pop": "title-subscribe",
  "Cinematic Title": "title-cinematic", "Neon Location": "title-location", Caption: "title-caption",
};

export function demoFor(t: CutTemplate): string {
  if (t.family === "Grid Reveal") return "t-grid";
  if (t.kind === "transition" && (t.name === "Slide" || t.name === "Film Burn" || t.name === "Light Leak" || t.name === "Zoom Blur")) {
    return { Slide: "t-slide", "Film Burn": "t-burn", "Light Leak": "t-leak", "Zoom Blur": "t-zoomblur" }[t.name]!;
  }
  return DEMO_BY_NAME[t.name] ?? (t.kind === "transition" ? "t-whip" : t.kind === "title" ? "title-rise" : "flash");
}

import soundsData from "../data/cut-sounds.json";

export const sounds = soundsData;

export const TOOLS = [
  { name: "Ease", line: "A bezier speed-graph editor with 30 presets and your own curves, for Fusion keyframes." },
  { name: "Align", line: "A 3×3 align grid, fit and fill, split-screens, picture-in-picture and blend modes." },
  { name: "Actions", line: "67 one-click actions: speed, fades, ripple delete, silence removal, exports and more." },
  { name: "Motion", line: "Grow, slide, whip, spin, pop, punch, Ken Burns and shake, in, out or both." },
  { name: "Bounce", line: "Overshoot and bounce springs on keyframes, or a spring pop-in on clips." },
  { name: "Beats", line: "Finds the beat in a song and drops markers every beat, bar or eight." },
  { name: "Captions", line: "Speech-to-text in 36 languages, then animated word captions with Captions+." },
  { name: "Shorts", line: "A 9:16 copy of your timeline with Smart Reframe, in one click." },
];

export const counts = {
  templates: templates.length,
  effects: templates.filter(t => t.kind === "effect" && t.family !== "Grid Reveal").length,
  transitions: templates.filter(t => t.kind === "transition").length,
  titles: templates.filter(t => t.kind === "title").length,
  grid: templates.filter(t => t.family === "Grid Reveal").length,
  sounds: soundsData.count,
};

export const COMPAT = [
  ["DaVinci Resolve", "Version 20 or newer, tested on 21.2. The app and templates work in the free version; the panel inside Resolve needs Studio."],
  ["Windows", "Windows 10 or 11, 64-bit. Installs per user."],
  ["macOS", "macOS 12 or newer, on Apple Silicon or Intel."],
  ["Resolve setting", "Preferences → System → General → External scripting using: Local."],
];

export const FAQ = [
  {
    q: "Does it work in the free version of Resolve?",
    a: "Yes. The HermiteCut app, the templates, Grid Reveal and the sound library all work in DaVinci Resolve (free). The panel that opens inside Resolve (Workspace → Workflow Integrations) is a Resolve Studio feature, and a few actions use Studio-only tools such as Smart Reframe and Magic Mask.",
  },
  {
    q: "Mac and Windows?",
    a: "Both. There is an installer for Windows 10 and 11 and a disk image for Apple Silicon and Intel Macs. It is not notarised yet, so the first time you open it on a Mac, go to System Settings → Privacy & Security and click Open Anyway (on macOS 14 or older, right-click the app and choose Open).",
  },
  {
    q: "How do I install it?",
    a: "Run the installer and open HermiteCut. Enter your licence key the first time it asks, then click Setup → Install everything. That adds the templates, the Resolve panel, the Scripts menu launcher and the title fonts. Restart Resolve once and you are done.",
  },
  {
    q: "Do I get updates?",
    a: "Yes. Every update to version 2 is included, with full notes in the changelog. Download the new version from the same place you got HermiteCut and install it over the old one; your presets, favourites and licence are kept.",
  },
  {
    q: "What about refunds?",
    a: "If you buy HermiteCut and it does not work for you, you can ask for a refund within 14 days. See the refund policy for details.",
  },
  {
    q: "How many computers can I use it on?",
    a: "Your licence covers you on up to two of your own computers, Windows or Mac. See the licence (EULA) for the full terms.",
  },
  {
    q: "How do I get help?",
    a: "Open an issue on GitHub with what you tried and your Resolve version. Bugs and feature requests go to the same place, and you can follow the fix in the changelog.",
  },
];
