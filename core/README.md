# core

Shared logic with **no Resolve dependency**: curve/easing math, the transcription pipeline (VAD + model inference), and the AI cleanup pass.

Both `backend/` (local, desktop) and `api/` (cloud, enterprise) import from here, so Stage 4 stays a thin hosted wrapper rather than a second implementation. See [HERMITE-PLAN.md §5](../HERMITE-PLAN.md#5-technical-architecture).
