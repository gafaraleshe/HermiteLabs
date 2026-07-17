# backend

Local service exposing `core/`'s functionality over a local HTTP/IPC API for the desktop app (Stages 2–3: transcription, local LLM inference).

Starts in Python (`faster-whisper`, `llama-cpp-python`), with an explicit option to port hot paths to Rust later if startup time or memory footprint becomes a problem. Tests use **pytest** (not Jest). Talks to Resolve via the DaVinciResolveScript Python API — never through Fusion. See [HERMITE-PLAN.md §5](../HERMITE-PLAN.md#5-technical-architecture).
