# Changelog

All notable changes to HermiteCut are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [2.0.0] - 2026-11-18

HermiteCut is now its own app for **Windows and macOS** as well as the panel
inside DaVinci Resolve Studio, with a template pack, Grid Reveal, a sound
library and an asset library.

### Downloads
- **Windows:** `HermiteCut-Windows-Setup.exe`. It installs per user, with no
  administrator rights needed. SmartScreen may warn because the installer is
  not code-signed yet: click **More info → Run anyway**.
- **macOS:** `HermiteCut-Mac-arm64.dmg` (Apple Silicon) or
  `HermiteCut-Mac-x64.dmg` (Intel). **First open on Mac: right-click
  HermiteCut in Applications and choose Open**, then click Open again. The app
  is ad-hoc signed, not notarised, so a normal double-click is blocked the
  first time.
- `HermiteCut.drfx`: the template pack on its own. Double-click it with
  Resolve open, then restart Resolve.
- `HermiteCut-v2.0.0-windows-panel.zip`: the Resolve panel on its own, as in
  1.0.

### Added
- **Template pack** (`HermiteCut.drfx`): 91 Fusion templates.
  - 37 effects: flashes, shakes, blurs, motion, glitch, film and light,
    including **Slow Film Burn**. Every effect has **Apply at** (Post / Pre /
    Both / Whole), **Frames**, **Curve**, **Strength** and **Seed**.
  - 5 time effects: **Slow Shutter** (180°, 360°, 720° and 1440°), Echo,
    Prism, Stutter and Time Shift.
  - 24 transitions, with Direction, Curve, Blur, Glow and Flash.
  - 12 titles, including six music-video credit styles with Song, Artist,
    Directed By and Credit fields.
  - The Hermite Motion presets (Slide, Pop, Ken Burns, Fade Move).
- **Grid Reveal:** the next shot appears cell by cell inside a grid.
  - 11 looks: Clean Reveal, Diagonal Sweep, Spiral In, Centre Burst, Beat,
    Glitch, White Flash, Neon, Mosaic Out, Light Reveal and Collage.
  - **Hand Track**, where a moving subject drives the cells, and **Grid
    Lines**, an overlay.
  - Cell order, animation, stagger, gap, rounded corners and white flash.
  - Lines with width, major lines, dashes and draw-on.
  - The lines sit exactly on the cells at any resolution, including 9:16.
  - A live preview and your own presets in the app.
- **Sound library:** 81 sound effects made in code, so they're yours to use.
  Whooshes, risers, impacts, shutters, glitches, film and tape. Preview them,
  then place them at the playhead, on every cut or on every marker.
- **Asset library:** index your own folders, including inside .zip files,
  without copying anything. Apply LUTs, place overlays and audio, install
  packs and import timelines.
- **Captions+:** turns subtitles into animated per-phrase titles.
- **Shorts:** a 9:16 copy of the timeline, with Smart Reframe.
- **Setup:** installs the templates, the Resolve panel, the Workspace →
  Scripts launcher and the title fonts, and checks the connection to Resolve.
- **Standalone app:** reaches Resolve through its scripting interface. Set
  Preferences → System → General → **External scripting using: Local**. It
  works with the free version of Resolve too, and the panel still runs inside
  Resolve Studio.

### Changed
- The code is now a shared core (`core/`) plus a Resolve adapter
  (`hosts/resolve/`), ready for other editors later.
- Offline checks for every template (`check_pack.py`, `test_grid.py`) and an
  in-Resolve test runner (`tools/dev/test_pack.py`).

## [1.0.0] - 2026-11-18

First public release as **HermiteCut**, a Workflow Integration plugin for
DaVinci Resolve Studio 19+ (tested on 21.2, Windows).

### Added
- **Ease:** cubic-bezier speed-graph editor with 30 presets and saved custom
  curves. Applies to Fusion keyframes on selected nodes, or on selected clips'
  comps.
- **Align:** 3×3 align grid with margin, fit / fill / reset / flip, scale and
  rotate steps. Split-screen and picture-in-picture layouts with gap. Blend
  modes, opacity, and copy / paste / save transforms.
- **Actions:** 67 one-click actions in eight groups plus favourites and search.
  A Deliver section for render presets, queueing, stills and timeline export
  (FCPXML, FCP 7 XML, EDL, OTIO, CSV, DRT).
- **Motion:** Grow, Shrink, Slide ×4, Whip, Spin, Pop, Punch, Ken Burns and
  Shake, as In / Out / In + Out. Eased with the Ease curve, with optional motion
  blur. Native fades.
- **Bounce:** overshoot and bounce springs on Fusion keyframes, or as a pop-in
  on clips.
- **Beats:** beat and transient detection inside the panel, on the selected
  clip or an audio file. Markers every beat, 2, bar or 8, with offset, minimum
  gap and colour, on the timeline or the clip.
- **Captions:** Resolve Studio speech-to-text in 36 languages with phrase,
  word and custom formats. `.srt` / `.vtt` import.
- Windows installer (single `.exe`, with silent install and uninstall), a
  no-exe `.bat` installer and an uninstaller.

### Changed
- Renamed from the pre-release working name. The plugin id is now
  `com.hermitelabs.cut`. The installer removes the pre-release plugin folder,
  and HermiteCut still recognises motion nodes and beat markers made by the
  pre-release build.

[Unreleased]: https://github.com/gafaraleshe/HermiteCut/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/gafaraleshe/HermiteCut/releases/tag/v1.0.0
