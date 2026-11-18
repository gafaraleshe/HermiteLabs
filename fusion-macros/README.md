# fusion-macros

> **Merged into HermiteCut.** These seven presets are now part of the
> HermiteCut template pack (`gafaraleshe/HermiteCut`, `tools/fusegen/`):
> Slide In ×4 became **Slide** with a *Side* control, and Pop In, Ken Burns and
> Fade Move became **Pop**, **Ken Burns** and **Fade Move**. The rebuilt
> versions use HermiteCut's shared timing controls (Apply at, Frames, Curve,
> Strength). They are measured from the clip's first rendered frame, so they
> also work on trimmed clips, which the keyframes at frame 0 here do not.
> This folder is kept for reference only.

Stage 1a — **Hermite Motion** preset pack. Fusion `.setting` macros packaged
into a one-click-installable `.drfx`. No app, no backend, no network — works in
free Resolve.

## Presets (v0.1)

- Slide In — Left / Right / Up / Down
- Pop In (scale with overshoot)
- Ken Burns (slow pan + zoom)
- Fade Move (fade in with a rise)

## Build

```bash
python3 build.py
```

This generates the `.setting` files (from `hermite_motion.py`), structurally
lints them, and packages `dist/Hermite-Motion.drfx`. Intermediate files land in
`build/`. Both folders are gitignored — the source of truth is the generator.

## Install into Resolve

**One-click:** double-click `dist/Hermite-Motion.drfx` with Resolve running and
confirm the install prompt. The presets appear in the Edit page **Effects
Library → Effects → Hermite**.

**Manual:** copy the `Edit/Effects/Hermite/` folder from the `.drfx` (it's a
zip) into your Fusion templates directory:

- macOS `~/Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Templates/`
- Windows `%APPDATA%\Blackmagic Design\DaVinci Resolve\Fusion\Templates\`

Requires the blackmagicdesign.com build of Resolve — the Mac App Store build
doesn't load Fusion script/template integrations.

## Status

v0.1 — the macros are structurally faithful to Fusion's `.setting` format but
have not been loaded in Resolve from this environment. Load-test on your
machine and report anything that errors; the generator makes fixes a one-line
change applied across all presets.

## How the easing stays consistent

The cubic-bezier → Fusion spline-handle mapping baked here is the same one the
desktop app applies live (`app/src/lib/easing.ts`). When `/core` is extracted
(plan milestone 8) both import a single copy.
