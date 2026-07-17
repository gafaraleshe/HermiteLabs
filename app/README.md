# app

The Hermite desktop app (Tauri) — Stage 1b, and later the home for Subs
correction and the AI model manager. Right now it's the **motion toolkit**: the
bezier easing curve editor and speed-ramp editor.

## How it fits together

```
┌ Hermite desktop app (this) ┐        ┌ DaVinci Resolve ────────────┐
│  React + Vite frontend      │  HTTP  │  hermite_bridge.py          │
│  (curve editor, presets)    │◀──────▶│  (Workspace › Scripts)      │
│  Tauri (Rust) window shell  │  :8712 │  drives Fusion keyframes    │
└─────────────────────────────┘        └─────────────────────────────┘
```

The app never talks to Resolve directly — it calls the **bridge**, a small
Python script that runs *inside* Resolve. That's the only path that works on
free Resolve (external scripting and in-app GUIs are Studio-only). See
[`bridge/hermite_bridge.py`](./bridge/hermite_bridge.py) and
[HERMITE-PLAN.md §0](../HERMITE-PLAN.md).

## Run it

```bash
npm install
npm run dev        # frontend in the browser at http://localhost:1420
npm test           # easing math (Jest)
npm run typecheck  # tsc --noEmit
npm run build      # production frontend into dist/
```

The frontend runs standalone in a browser — with no bridge it simply shows
"disconnected," which is the expected dev state.

### As a desktop app (Tauri)

Needs Rust + the platform webview toolchain, and app icons generated once
(see [`src-tauri/icons/README.md`](./src-tauri/icons/README.md)):

```bash
npm run tauri icon path/to/source.png   # first time only
npm run tauri dev                        # or: npm run tauri build
```

### Connect to Resolve

Copy [`bridge/hermite_bridge.py`](./bridge/hermite_bridge.py) into Resolve's
`Fusion/Scripts/Utility/` folder, then run **Workspace › Scripts ›
hermite_bridge**. It serves on `127.0.0.1:8712`; the app picks it up within a
few seconds and the top bar turns green.

## Layout

- `src/lib/easing.ts` — curve math; cubic-bezier → Fusion keyframe handles (Jest-tested)
- `src/lib/bridge.ts` — client for the Resolve bridge
- `src/components/CurveEditor.tsx` — the interactive editor
- `src-tauri/` — the Tauri window shell (Rust)
- `bridge/hermite_bridge.py` — the Resolve-side HTTP bridge

## Status

v0.1. The frontend and easing math are verified here; the Tauri build and the
bridge's Fusion keyframe write need a Mac with Resolve to validate.
