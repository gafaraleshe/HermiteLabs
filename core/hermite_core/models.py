"""Transcription model registry.

The user-facing promise (see the site's /ai page): requirements are shown
BEFORE download, nothing installs silently, and the smallest viable model is
the default. Sizes are the CTranslate2 int8 conversions used by faster-whisper.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field, asdict


def models_dir() -> str:
    """Where model weights live. Override with HERMITE_MODELS_DIR; defaults to
    ~/.hermite/models so weights survive app reinstalls and are easy to find
    and delete — visible on disk, exactly as the privacy story promises."""
    return os.environ.get(
        "HERMITE_MODELS_DIR",
        os.path.join(os.path.expanduser("~"), ".hermite", "models"),
    )


@dataclass(frozen=True)
class ModelSpec:
    id: str                 # Hermite-facing id ("fast", "balanced", ...)
    label: str
    hf_repo: str            # HuggingFace repo of the CT2 conversion
    disk_mb: int            # approximate download size on disk
    ram_gb: float           # approximate peak RAM during inference (int8, CPU)
    languages: str          # "multilingual" | "english"
    notes: str = ""
    default: bool = field(default=False)


REGISTRY: tuple[ModelSpec, ...] = (
    ModelSpec(
        id="fast",
        label="Fast (Whisper tiny)",
        hf_repo="Systran/faster-whisper-tiny",
        disk_mb=75,
        ram_gb=1.0,
        languages="multilingual",
        notes="Quick drafts and previews. Good enough for rough cuts.",
        default=True,
    ),
    ModelSpec(
        id="balanced",
        label="Balanced (Whisper small)",
        hf_repo="Systran/faster-whisper-small",
        disk_mb=463,
        ram_gb=2.0,
        languages="multilingual",
        notes="The sweet spot for most editing work.",
    ),
    ModelSpec(
        id="accurate",
        label="Accurate (Whisper large-v3)",
        hf_repo="Systran/faster-whisper-large-v3",
        disk_mb=2900,
        ram_gb=4.5,
        languages="multilingual",
        notes="Best quality; heavy next to a running Resolve. Needs a capable machine.",
    ),
)


def spec(model_id: str) -> ModelSpec:
    for m in REGISTRY:
        if m.id == model_id:
            return m
    raise KeyError(f"unknown model id: {model_id!r}")


def default_model() -> ModelSpec:
    return next(m for m in REGISTRY if m.default)


def local_path(model_id: str) -> str:
    return os.path.join(models_dir(), model_id)


def is_downloaded(model_id: str) -> bool:
    """A model is present when its directory holds the CT2 weights file."""
    return os.path.isfile(os.path.join(local_path(model_id), "model.bin"))


def registry_status() -> list[dict]:
    """JSON-ready registry with per-model download state — what the model
    picker UI renders."""
    out = []
    for m in REGISTRY:
        d = asdict(m)
        d["downloaded"] = is_downloaded(m.id)
        out.append(d)
    return out


def download(model_id: str) -> str:
    """Fetch a model's weights into the models dir (explicit user action only —
    never called implicitly by transcription). Returns the local path."""
    from huggingface_hub import snapshot_download  # lazy: heavy import

    target = local_path(model_id)
    os.makedirs(target, exist_ok=True)
    snapshot_download(
        repo_id=spec(model_id).hf_repo,
        local_dir=target,
        allow_patterns=["*.bin", "*.json", "*.txt", "*.model"],
    )
    return target
