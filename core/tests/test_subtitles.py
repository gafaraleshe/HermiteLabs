from hermite_core.subtitles import (
    Segment,
    srt_timestamp,
    to_srt,
    to_vtt,
    vtt_timestamp,
)


def test_srt_timestamp_formatting():
    assert srt_timestamp(0) == "00:00:00,000"
    assert srt_timestamp(4.21) == "00:00:04,210"
    assert srt_timestamp(3661.5) == "01:01:01,500"
    assert srt_timestamp(-3) == "00:00:00,000"  # clamped, never negative


def test_vtt_uses_dot_separator():
    assert vtt_timestamp(4.21) == "00:00:04.210"


def test_to_srt_basic():
    segs = [
        Segment(start=4.21, end=8.94, text="Welcome back."),
        Segment(start=9.0, end=12.0, text="Grading the opening scene."),
    ]
    srt = to_srt(segs)
    assert "1\n00:00:04,210 --> 00:00:08,940\nWelcome back.\n" in srt
    assert "2\n00:00:09,000 --> 00:00:12,000\nGrading the opening scene.\n" in srt


def test_to_srt_skips_empty_and_renumbers():
    segs = [
        Segment(start=0, end=1, text="  "),   # silence — skipped
        Segment(start=1, end=2, text="One."),
    ]
    srt = to_srt(segs)
    assert srt.startswith("1\n")  # numbering starts at the first real cue
    assert "One." in srt


def test_speaker_prefix():
    srt = to_srt([Segment(start=0, end=1, text="Hi there", speaker="S1")])
    assert "S1: Hi there" in srt


def test_vtt_header():
    assert to_vtt([]).startswith("WEBVTT")
