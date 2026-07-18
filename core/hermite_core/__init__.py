"""hermite_core — shared, Resolve-independent logic.

Everything here must stay importable without DaVinci Resolve, a GUI, or the
network. Both the local desktop backend (`/backend`) and the future cloud API
(`/api`) import from this package, so Stage 4 stays a thin hosted wrapper.

Modules:
    models     — the transcription model registry (sizes, RAM needs, download state)
    subtitles  — Segment type + SRT/VTT formatting
    transcribe — the on-device transcription engine (faster-whisper, lazy import)
"""

__version__ = "0.1.0"
