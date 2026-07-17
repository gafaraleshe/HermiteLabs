# Hermite — Project Plan

DaVinci Resolve plugin: After Effects–style animation toolkit + on-device auto-subs + swappable local AI layer, plus a paid enterprise API and MCP/agent integration. Screen recorder is parked for later — this is the full plan for Hermite alone.

## 1. Scope and sequencing

Ship in four stages, each independently useful, rather than one big release:

**Stage 1 — Hermite Motion (v1).** The animation/easing/speed-ramp toolkit as Fusion macros, packaged as an installable `.drfx`. No backend service, no models, no network — pure Fusion Lua + a `.setting` bundle. This is the fastest path to something real, and it's the headline feature ("smooth animation should be easy"), so it should be the thing that ships first and proves the product.

**Stage 2 — Hermite Subs (v1.5).** On-device transcription/captioning, AutoSubs-style. This needs a local backend process and a UI, so it's meaningfully more infrastructure than Stage 1. Ships as an add-on to the same install (a script + local app, not inside the `.drfx`).

**Stage 3 — Hermite AI (v2).** The general-purpose local LLM layer (Gemma family, model picker). This is the least proven need of the three and depends on Stage 2's backend/UI plumbing already existing, so it comes last. Treat it as genuinely optional — don't let it block Stage 1 or 2 shipping.

**Stage 4 — Hermite API (Enterprise, v2.5).** A paid, cloud-hosted API exposing Hermite's core capabilities programmatically — generate/apply easing curves and motion presets, run transcription, run the AI cleanup pass — for enterprises building their own tooling on top, plus MCP integration via Composio so AI agents (Claude, Cursor, custom agents) can call these capabilities as tool calls. This is a genuinely different product line from Stages 1–3: those are local/on-device and privacy-first; this one processes data in the cloud for paying customers who explicitly want that. Keep the positioning and the codepaths separate so the on-device privacy pitch for Stages 1–3 never gets muddied by "oh but there's also a cloud API." Comes after Stage 3 because it depends on the core logic (curve generation, transcription pipeline, AI cleanup) already existing and being proven locally — the cloud API becomes a thin hosted wrapper around that same core, not a rewrite.

**Important architectural correction from earlier:** `.drfx` only packages Fusion `.setting` files and their assets — it has no mechanism to bundle a background service (Python/Rust) or a Tauri app. So Stage 1 (Motion) ships as `.drfx`, but Stages 2 and 3 (Subs, AI) must ship as a separate installer — a small DaVinci script (dropped into Resolve's Scripts folder, same as AutoSubs does it) that launches a local backend + UI window. Both pieces install into the same Resolve, but they're two different packaging mechanisms glued together by one installer/setup flow for the user.

## 2. Feature list — Hermite Motion (Stage 1)

- One-click motion presets as reusable Fusion macros: slide-in (4 directions), pop/scale-in, ken burns pan-zoom, fade+move combo
- Bezier easing curve editor: draggable handle UI, preset library (linear, ease, ease-in-out, overshoot, bounce), applied to existing keyframes on a selected Fusion node
- Speed-ramp tool modeled on After Effects' graph editor: click-drag speed curve, ease in/out handles, freeze/hold segments — this is Resolve/Fusion-specific plumbing (time remapping via a Time Speed/Time Stretcher node driven by the curve), worth prototyping early since it's the riskiest UI-to-node mapping
- Batch-apply: select multiple clips/nodes, apply one preset to all at once

Build order inside this stage: presets first (simplest, most demonstrable), then the bezier editor UI (reusable component — the speed-ramp tool can share its curve-editing widget), then speed-ramp, then batch-apply last since it's a thin wrapper once single-clip application works.

## 3. Feature list — Hermite Subs (Stage 2)

- On-device transcription with a model choice (small/fast vs larger/accurate) — start with `faster-whisper` or `whisper.cpp` since they're the most mature and well-documented; evaluate Parakeet/Moonshine as a later, faster alternative once the pipeline is proven
- Voice activity detection to skip silence before transcribing
- Speaker diarization (nice-to-have for v1, can slip to v1.6 if it slows things down)
- Auto-generate Resolve subtitle/Text+ tracks with adjustable styling presets (font, position, background, karaoke-style highlight)
- Manual correction pass: waveform + text UI so the user fixes errors before committing to the timeline — don't auto-write to the timeline without this review step

## 4. Feature list — Hermite AI (Stage 3)

- Model picker/manager: list of supported local models (Gemma 2B/9B or whatever the current small-model landscape looks like at build time) with disk/RAM requirements shown before download, plus update/version management
- First concrete use case — pick one, not "AI does everything": caption punctuation and cleanup is the strongest v1 candidate, since it's a bounded, low-risk task that directly improves Stage 2's output quality and doesn't require deep Resolve integration
- Local inference runtime: evaluate `llama.cpp`/Ollama-style runtime (broadest model support, good Mac+Windows story) vs MLX (best perf on Apple Silicon but Mac-only) vs ONNX Runtime — recommend starting with `llama.cpp`/Ollama for cross-platform reach, and only special-casing MLX later if Apple Silicon performance becomes a complaint

## 4a. Feature list — Hermite API (Stage 4, Enterprise)

- REST API exposing: easing-curve generation (given control points, return interpolated curve data), motion-preset application (given clip metadata, return keyframe data to apply), transcription-as-a-service (upload audio/video, get back subtitle data), and the AI cleanup pass (punctuation/cleanup on raw transcript text) — all as stateless, well-documented endpoints rather than anything that assumes a running Resolve instance
- API key auth + usage-based or seat-based billing via Polar.sh, scoped for enterprise plans distinct from the desktop app's consumer licensing
- Rate limiting and usage dashboards from day one, since this is the product line most likely to get real programmatic load
- MCP integration via Composio: register Hermite's API as a Composio toolkit so it shows up alongside Composio's other 1,000+ integrations, letting any MCP-compatible agent (Claude, Cursor, custom agents) call "generate easing curve," "transcribe this file," etc. as tool calls — Composio handles the auth/execution layer so Hermite doesn't need to build and maintain its own MCP server from scratch
- API reference docs published on the Hermite site under `/docs`, including a Composio/MCP setup guide with example agent prompts

## 5. Technical architecture

Monorepo, six areas (no separate showcase site — Hermite has its own product website, living in `/site` in this same repo; the portfolio and gaffystudios site just link out to it):

- `/fusion-macros` — Lua scripts + `.setting` files for Motion, packaged into the `.drfx`
- `/core` — shared logic with no Resolve dependency: curve/easing math, the transcription pipeline (VAD + model inference), and the AI cleanup pass. Both `/backend` (local, desktop) and `/api` (cloud, enterprise) import from here so Stage 4 is a thin hosted wrapper, not a second implementation
- `/backend` — local service exposing `/core`'s functionality over a local HTTP/IPC API for the desktop app; start in Python (fastest iteration, `faster-whisper` and `llama-cpp-python` bindings are both mature) with an explicit option to port hot paths to Rust later if startup time or memory footprint becomes a problem (this is the path AutoSubs itself took)
- `/api` — the cloud-hosted, paid enterprise API (Stage 4). Same core logic as `/backend`, different host: auth via API keys instead of local trust, billing via Polar.sh, rate limiting, and a Composio toolkit registration so agents can call it over MCP
- `/app` — the UI for Subs correction, AI model manager, and settings; Tauri is a reasonable choice here since it keeps the binary small and lets the UI be built in web tech (which also makes the Jest test story clean)
- `/site` — Hermite's own product website: landing content, the full feature roadmap across all four stages, and `/docs` for the enterprise API + MCP/Composio setup guide. Built with Next.js/Astro + the Clay design system (via `npx getdesign@latest add clay`). Fully JS/TS, so Jest applies cleanly here too

**Process boundaries:** the Fusion macros never talk to the backend directly — Fusion Lua can shell out to write timeline data, but the backend/UI communicate with Resolve through the DaVinciResolveScript Python API (Media Pool, Timeline, subtitle tracks), not through Fusion. Keep that boundary sharp so Stage 1 has zero dependency on Stage 2/3/4 ever running. Similarly, `/api` never touches Resolve at all — it's pure cloud processing on uploaded data, which is exactly why it needs to be positioned as a separate, explicitly-opt-in product line from the on-device story.

**Data flow for Subs (desktop):** audio extracted from the active Resolve timeline → sent to local backend → VAD + transcription → subtitle data returned → shown in the correction UI → on confirm, written into Resolve via DaVinciResolveScript's subtitle/Text+ track APIs.

**Data flow for the enterprise API:** client (or an MCP agent via Composio) uploads audio/video or curve parameters → `/api` calls the same `/core` logic → structured JSON returned → client/agent does whatever it wants with it (no Resolve involved at all).

## 6. Tooling integration

- **Sentry** — separate projects for `/backend` and `/app`, so a Python stack trace and a frontend JS error don't get conflated
- **Jest** — covers `/app` only (it's the Tauri/web frontend). `/backend` gets pytest instead, and `/fusion-macros` needs a lightweight Lua test harness or just manual QA scripts inside Resolve — don't try to force Jest onto Python or Lua
- **PostHog** — strictly opt-in, disclosed clearly in onboarding (which presets get used, which features get opened). This needs to be genuinely optional given the "fully on-device, no cloud" story for Subs/AI — bundling it in silently would undercut the pitch
- **OpenRouter** — an optional cloud-AI tier for Stage 3, separate from the local model manager (e.g. a "higher-quality cloud pass" toggle for punctuation cleanup for users who opt in). Never a silent fallback that sends audio/text off-device without explicit action
- **Polar.sh** — consumer licensing for the desktop app (pro presets, cloud AI credits via OpenRouter) and enterprise plans/metered billing for the Stage 4 API — these are two different Polar products/pricing tables, don't conflate them
- **Resend** — license delivery and purchase receipts triggered by Polar webhooks (both consumer and enterprise), plus release/update announcement emails
- **Composio** — Stage 4 only: register Hermite's `/api` as a Composio toolkit rather than hand-building an MCP server; this is the integration layer that lets Claude/Cursor/other agents call Hermite as a tool

## 7. Milestones

1. Repo scaffold + hello-world Fusion script talking to a running Resolve instance
2. Motion presets (slide/pop/ken burns) working as Fusion macros, manually testable
3. Bezier easing curve editor UI, applied to real keyframes
4. Speed-ramp tool built on the same curve-editor component
5. Batch-apply + package Stage 1 as an installable `.drfx` — **first shippable release**
6. `/core` extraction: curve/easing math pulled into a shared, Resolve-independent module (do this before Stage 2 backend work starts, so `/api` doesn't need a later refactor)
7. Backend service scaffold (`/backend`) with `faster-whisper` transcription working standalone (no Resolve yet), built on top of `/core`
8. Resolve integration: audio extraction from timeline, subtitle write-back via DaVinciResolveScript
9. Correction UI (`/app`, Tauri) with waveform + text editing before commit
10. Package Stage 2 installer (script + local app) — **second release**
11. Model manager UI + first local LLM (Gemma) wired to the punctuation-cleanup use case
12. Wire in Sentry, Jest, Polar.sh, Resend, gated PostHog — **v2 release**
13. `/api` scaffold: hosted wrapper around `/core`, API key auth, rate limiting, enterprise Polar.sh plan
14. Composio toolkit registration for `/api` + MCP setup guide
15. `/site` shipped with the full feature roadmap + `/docs` (API reference + MCP/Composio walkthrough) — **enterprise API release**; portfolio and gaffystudios updated with a project entry linking to it

## 8. Risks and open questions to confirm early

- Whether some Fusion scripting/macro features are gated behind Resolve Studio (paid) vs free Resolve — confirm before committing to features that assume Studio
- Resolve API differences across major versions (18/19/20) — pin a minimum supported version early
- Windows vs Mac install paths for scripts and the `.drfx`/installer flow — test both, don't assume Mac-only given Resolve's userbase is cross-platform
- Model licensing for redistribution (Gemma's usage terms, Whisper's MIT license) — check before bundling any model weights directly rather than downloading on first run
- Running local transcription + LLM inference alongside Resolve itself is memory/CPU-heavy on the same machine — budget for this in the model manager's RAM/disk warnings, and default to the smallest viable model
- The enterprise API (Stage 4) processes customer data in the cloud — this needs its own data-handling/retention policy (how long uploaded audio/video is kept, whether it's used for anything beyond the request) written and published before any enterprise customer signs on, separate from the "fully on-device" claims made about Stages 1–3
- Composio's pricing is usage-metered on their end too (tool calls per month) — factor that into what Hermite charges enterprise customers so there's margin, not just pass-through cost
- Decide early whether the enterprise API requires uploading full video files (bandwidth/storage cost) or just audio/metadata — this materially affects hosting cost and should be scoped before Stage 4 starts
