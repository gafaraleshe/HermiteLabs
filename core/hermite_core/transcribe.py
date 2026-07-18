"""The on-device transcription engine.

Wraps faster-whisper (CTranslate2 Whisper) with:
  - the Hermite model registry (weights only ever downloaded explicitly)
  - Silero VAD (built into faster-whisper) to skip silence
  - word-level timestamps for the correction UI's waveform view

Everything runs locally; there is no code path that sends audio anywhere.
faster-whisper is imported lazily so the rest of hermite_core stays importable
in dependency-light contexts (tests, the cloud API's non-local paths).
"""

from __future__ import annotations

from typing import Callable

from . import models
from .subtitles import Segment, Word

_loaded: dict[str, object] = {}


def _get_model(model_id: str):
    """Load (and cache) the CT2 model from the local models dir. Raises a
    clear error if the weights aren't downloaded yet — transcription must
    never trigger a download implicitly."""
    if model_id in _loaded:
        return _loaded[model_id]
    if not models.is_downloaded(model_id):
        raise FileNotFoundError(
            f"Model '{model_id}' is not downloaded. Download it first "
            f"(~{models.spec(model_id).disk_mb} MB) via the model manager."
        )
    from faster_whisper import WhisperModel  # lazy heavy import

    model = WhisperModel(
        models.local_path(model_id),
        device="auto",
        compute_type="int8",
    )
    _loaded[model_id] = model
    return model


def transcribe_file(
    audio_path: str,
    model_id: str | None = None,
    language: str | None = None,
    vad: bool = True,
    word_timestamps: bool = True,
    on_progress: Callable[[float], None] | None = None,
) -> tuple[list[Segment], dict]:
    """Transcribe an audio file into Segments.

    Returns (segments, info) where info carries detected language/probability
    and audio duration. `on_progress` is called with 0..1 as segments stream.
    """
    model_id = model_id or models.default_model().id
    model = _get_model(model_id)

    raw_segments, info = model.transcribe(  # type: ignore[attr-defined]
        audio_path,
        language=language,
        vad_filter=vad,
        word_timestamps=word_timestamps,
        beam_size=5,
    )

    duration = float(getattr(info, "duration", 0.0) or 0.0)
    segments: list[Segment] = []
    for rs in raw_segments:  # generator — transcription happens here
        words = [
            Word(start=float(w.start), end=float(w.end), text=w.word)
            for w in (rs.words or [])
        ]
        segments.append(
            Segment(
                start=float(rs.start),
                end=float(rs.end),
                text=rs.text.strip(),
                words=words,
            )
        )
        if on_progress and duration > 0:
            on_progress(min(1.0, float(rs.end) / duration))

    meta = {
        "model": model_id,
        "language": getattr(info, "language", None),
        "language_probability": float(getattr(info, "language_probability", 0.0) or 0.0),
        "duration": duration,
        "vad": vad,
    }
    return segments, meta
