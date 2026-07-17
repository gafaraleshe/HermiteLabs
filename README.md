# Hermite

**Smooth animation for DaVinci Resolve** — a plugin by [Gaffy Studios](https://github.com/gafaraleshe/gaffystudios) that brings After Effects–style animation control into Resolve, paired with fully on-device auto-subtitling and a swappable local AI layer.

> **Status: planning / early build.** The full project plan lives in [HERMITE-PLAN.md](./HERMITE-PLAN.md).

## The four stages

| Stage | Name | What it is | Ships as |
|---|---|---|---|
| 1 | **Hermite Motion** (v1) | One-click motion presets, bezier easing curve editor, speed-ramp tools — no more hand-editing curves in Fusion | Installable `.drfx` package |
| 2 | **Hermite Subs** (v1.5) | On-device transcription and captioning (Whisper-family models, VAD, styling presets, correction UI) — no cloud calls | Resolve script + local app installer |
| 3 | **Hermite AI** (v2) | Swappable local LLM layer (model picker/manager) for caption cleanup and editing assistance | Add-on to the Stage 2 install |
| 4 | **Hermite API** (v2.5) | Paid, cloud-hosted enterprise API with MCP integration (via Composio) so AI agents can call Hermite's capabilities as tools | Hosted service + `/docs` |

Stages 1–3 are local/on-device and privacy-first. Stage 4 is explicitly a separate, cloud-by-design product line for enterprise customers who want that.

## Repository layout

Monorepo — each area maps to a section of the [plan](./HERMITE-PLAN.md#5-technical-architecture):

- [`fusion-macros/`](./fusion-macros) — Lua scripts + `.setting` files for Motion, packaged into the `.drfx`
- [`core/`](./core) — shared, Resolve-independent logic: curve/easing math, transcription pipeline, AI cleanup pass
- [`backend/`](./backend) — local service exposing `core` over a local HTTP/IPC API for the desktop app (Python)
- [`api/`](./api) — the cloud-hosted enterprise API (Stage 4): API key auth, Polar.sh billing, rate limiting, Composio/MCP toolkit
- [`app/`](./app) — desktop UI (Tauri): Subs correction, AI model manager, settings
- [`site/`](./site) — Hermite's product website: landing, full feature roadmap, and `/docs` for the enterprise API + MCP setup

## Follow along

Built by [Gafar Aleshe](https://www.gafaraleshe.com) · [github.com/gafaraleshe/hermite](https://github.com/gafaraleshe/hermite)
