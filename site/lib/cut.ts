/**
 * HermiteCut product data for /cut.
 *
 * Templates come from data/cut-templates.json, which is exported from the
 * HermiteCut repo's pack generator (tools/fusegen/build_pack.py writes
 * build/HermiteCut-manifest.json). Refresh it from there rather than editing
 * names by hand, so the site always lists exactly what the pack contains.
 */
import templatesData from "../data/cut-templates.json";

export const CUT_REPO = "https://github.com/gafaraleshe/HermiteCut";
export const CUT_DOWNLOAD = `${CUT_REPO}/releases/latest`;
export const CUT_ROADMAP = `${CUT_REPO}/blob/main/docs/ROADMAP.md`;

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
  { id: "effects", label: "Effects", match: (t: CutTemplate) => t.kind === "effect" && t.family !== "Time FX" },
  { id: "timefx", label: "Time FX", match: (t: CutTemplate) => t.family === "Time FX" },
  { id: "transitions", label: "Transitions", match: (t: CutTemplate) => t.kind === "transition" },
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
  if (t.kind === "transition" && (t.name === "Slide" || t.name === "Film Burn" || t.name === "Light Leak" || t.name === "Zoom Blur")) {
    return { Slide: "t-slide", "Film Burn": "t-burn", "Light Leak": "t-leak", "Zoom Blur": "t-zoomblur" }[t.name]!;
  }
  return DEMO_BY_NAME[t.name] ?? (t.kind === "transition" ? "t-whip" : t.kind === "title" ? "title-rise" : "flash");
}

export const TOOLS_V1 = [
  { name: "Ease", line: "A bezier speed-graph editor with 30 presets and saved curves, for Fusion keyframes." },
  { name: "Align", line: "A 3×3 align grid, fit and fill, split-screens, picture-in-picture and blend modes." },
  { name: "Actions", line: "67 one-click actions: speed, fades, ripple delete, silence removal, exports and more." },
  { name: "Motion", line: "Grow, slide, whip, spin, pop, punch, Ken Burns and shake, in, out or both." },
  { name: "Bounce", line: "Overshoot and bounce springs on keyframes, or as a pop-in on clips." },
  { name: "Beats", line: "Finds the beat in a clip or song and drops markers every beat, bar or eight." },
  { name: "Captions", line: "Resolve Studio speech-to-text in 36 languages, plus .srt and .vtt import." },
];

export const SPECS = [
  { k: "Tools in 1.0", v: "7" },
  { k: "Templates in 2.0", v: String(templates.length) },
  { k: "Platforms", v: "Windows · macOS in 2.0" },
  { k: "DaVinci Resolve", v: "19+ · tested on 21.2" },
];

export const SHARED_CONTROLS = [
  {
    kind: "Effects",
    items: [
      ["Apply at", "Post (the start of the clip), Pre (the end), Both, or the Whole clip."],
      ["Frames", "How long the effect lasts at each end."],
      ["Curve", "Linear, Smooth, Ease Out, Ease In, Snap or Overshoot."],
      ["Strength", "How hard it hits, from a whisper to a slam."],
      ["Seed", "A new random pattern for shakes, glitches and burns."],
    ],
  },
  {
    kind: "Transitions",
    items: [
      ["Direction", "Left, right, up or down, wherever motion is involved."],
      ["Curve", "Linear, Smooth, Fast, Ease In, Ease Out or Overshoot."],
      ["Blur", "Motion blur and streaks that follow the move."],
      ["Glow", "A bloom that peaks on the cut."],
      ["Flash", "An exposure hit, in any colour."],
    ],
  },
  {
    kind: "Titles",
    items: [
      ["Text", "Song, Artist, Directed By and Credit fields, with fonts."],
      ["Colour", "One text colour and one accent colour drive every line."],
      ["Title Styling", "Size, position, tracking, shadow and glow."],
      ["Film Look", "Grain, flicker, jitter and softness."],
      ["Animation", "Fade, Rise, Blur, Scale, Track or Slide, with in and out frames."],
    ],
  },
] as const;

export const FAQ = [
  {
    q: "What's included?",
    a: `HermiteCut 1.0 is a panel inside DaVinci Resolve Studio with seven tools: Ease, Align, Actions, Motion, Bounce, Beats and Captions. HermiteCut 2.0 adds a template pack of ${templates.length} effects, time effects, transitions and titles, a sound-effects library, Shorts tools and a standalone app for Windows and macOS.`,
  },
  {
    q: "Is it free?",
    a: "HermiteCut 1.0 is free and open source under the MIT licence. Download the Windows installer from GitHub Releases.",
  },
  {
    q: "Where do I find the templates after installing?",
    a: "Restart Resolve, then open the Effects library on the Edit page. The effects are under Effects, the transitions under Video Transitions and the titles under Titles, each in a HermiteCut folder. Drag an effect onto a clip, a transition onto a cut, or a title onto the timeline, then adjust it in the Inspector.",
  },
  {
    q: "How do Post, Pre and Both work?",
    a: "Every effect has an Apply at control. Post puts the effect at the start of the clip, so it hits on the cut in. Pre puts it at the end, on the cut out. Both does each end, and Whole runs it across the clip. Frames sets how long it lasts, and the clip is untouched outside that window.",
  },
  {
    q: "Which version of Resolve does it need?",
    a: "The 1.0 panel is a Workflow Integration plugin, so it needs DaVinci Resolve Studio 19 or newer (tested on 21.2). The 2.0 templates are plain Fusion macros with no third-party plugins, built to work in the free version of Resolve as well as Studio.",
  },
  {
    q: "Will it work on my Mac?",
    a: "1.0 ships with a Windows installer, and the plugin can be installed by hand on macOS. 2.0 ships as a .dmg for Apple Silicon and Intel Macs, and an installer for Windows.",
  },
  {
    q: "Are the previews on this page real renders?",
    a: "Not yet. They are animated illustrations of each template. Thumbnails and clips rendered in Resolve replace them when 2.0 is released.",
  },
  {
    q: "Does anything leave my computer?",
    a: "No. HermiteCut works through Resolve's own scripting on your machine. Nothing is uploaded, and there is no account.",
  },
];

export const PROGRESS_V2 = [
  { item: "Resolve API checks: external bridge, template loading, placement", status: "shipped" as const },
  { item: "Template generator and dev pack, proven in Resolve", status: "shipped" as const },
  { item: `Template pack: ${templates.length} effects, transitions and titles`, status: "in-progress" as const },
  { item: "Sound-effects library and asset library", status: "planned" as const },
  { item: "Standalone app with Effects, Transitions, Titles, Sound, Shorts and Setup", status: "planned" as const },
  { item: "Windows installer and macOS .dmg", status: "planned" as const },
];
