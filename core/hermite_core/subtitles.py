"""Segment type and subtitle serialization (SRT / VTT).

Pure functions, no dependencies — this is the part of the pipeline that the
correction UI, the Resolve write-back, and the cloud API all share.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict


@dataclass
class Word:
    start: float
    end: float
    text: str


@dataclass
class Segment:
    start: float
    end: float
    text: str
    speaker: str | None = None
    words: list[Word] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


def _stamp(seconds: float, sep: str) -> str:
    if seconds < 0:
        seconds = 0.0
    ms = round(seconds * 1000)
    h, rem = divmod(ms, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def srt_timestamp(seconds: float) -> str:
    return _stamp(seconds, ",")


def vtt_timestamp(seconds: float) -> str:
    return _stamp(seconds, ".")


def _line(seg: Segment) -> str:
    text = seg.text.strip()
    return f"{seg.speaker}: {text}" if seg.speaker else text


def to_srt(segments: list[Segment]) -> str:
    """Standard SRT: 1-based index, `HH:MM:SS,mmm --> HH:MM:SS,mmm`, text,
    blank line. Empty segments are skipped so silence never emits cues."""
    blocks = []
    n = 0
    for seg in segments:
        if not seg.text.strip():
            continue
        n += 1
        blocks.append(
            f"{n}\n{srt_timestamp(seg.start)} --> {srt_timestamp(seg.end)}\n{_line(seg)}\n"
        )
    return "\n".join(blocks)


def to_vtt(segments: list[Segment]) -> str:
    blocks = ["WEBVTT\n"]
    for seg in segments:
        if not seg.text.strip():
            continue
        blocks.append(
            f"{vtt_timestamp(seg.start)} --> {vtt_timestamp(seg.end)}\n{_line(seg)}\n"
        )
    return "\n".join(blocks)
