# backend

Stage 2 — **Hermite Subs**: the local, on-device transcription service. A
FastAPI app on `127.0.0.1:8713` (loopback only) that the desktop app calls for
model management, transcription jobs, and subtitle export. The engine is
`faster-whisper` (CTranslate2 Whisper) with Silero VAD, running entirely on
your machine — the only network egress in the whole service is the explicit
model download endpoint.

The pipeline itself lives in [`core/`](../core) (`hermite_core`): model
registry, transcription engine, SRT/VTT formatting. This service is the thin
HTTP wrapper — exactly the split that lets the Stage 4 cloud API reuse the
same core.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -e ../core -r requirements.txt
.venv/bin/uvicorn hermite_backend.main:app --host 127.0.0.1 --port 8713
```

## API

| Route | What |
|---|---|
| `GET /health` | Service + models dir |
| `GET /models` | Registry with disk/RAM requirements and download state |
| `POST /models/{id}/download` | Explicitly fetch weights (never implicit) |
| `POST /transcribe` | Multipart upload (`file`, `model`, `language`, `vad`) → `jobId` |
| `GET /jobs/{id}` | Status/progress; segments + meta when done |
| `GET /jobs/{id}/srt` · `/vtt` | Subtitle export |
| `DELETE /jobs/{id}` | Drop the job and delete its audio |

Models: `fast` (Whisper tiny, 75 MB, default), `balanced` (small, 463 MB),
`accurate` (large-v3, 2.9 GB). Weights land in `~/.hermite/models`
(override: `HERMITE_MODELS_DIR`) — visible on disk, easy to delete.

## Test

```bash
.venv/bin/python -m pytest ../core/tests tests   # pure logic + API surface
```

Verified end-to-end (2026-07-18, Linux container): model download via the
registry, engine run on generated audio (VAD correctly returns zero segments
for non-speech), and the full HTTP flow — upload → job → done → SRT → delete.
Not yet exercised: real-speech accuracy (needs real recordings), GPU paths,
and speaker diarization (planned, not in v0.1).
