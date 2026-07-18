# core

Shared logic with **no Resolve dependency** — the `hermite_core` Python
package. Both `backend/` (local, desktop) and `api/` (cloud, enterprise)
import from here, so Stage 4 stays a thin hosted wrapper rather than a second
implementation.

What's here today:

- `hermite_core.models` — transcription model registry: disk/RAM requirements
  shown before download, explicit-only downloads, local weight detection
- `hermite_core.transcribe` — the on-device engine (faster-whisper + Silero
  VAD, lazy-imported so the base package stays dependency-free)
- `hermite_core.subtitles` — `Segment`/`Word` types + SRT/VTT serialization

Still to land here: the curve/easing math currently duplicated between
`app/src/lib/easing.ts` and `fusion-macros/hermite_motion.py` (plan
milestone 8), and the Stage 3 caption-cleanup pass.

```bash
pip install -e .            # base: subtitles + registry only
pip install -e ".[local]"   # + faster-whisper for actual inference
python -m pytest tests
```
