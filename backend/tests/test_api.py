"""API-surface tests that need no model weights: health, registry, guards.
The actual inference path is exercised by scripts/smoke.py with a real model."""

import io

import pytest
from fastapi.testclient import TestClient

from hermite_backend.main import app


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMITE_MODELS_DIR", str(tmp_path))
    return TestClient(app)


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["service"] == "hermite-backend"


def test_models_listing_shows_requirements_before_download(client):
    body = client.get("/models").json()
    ids = {m["id"] for m in body["models"]}
    assert {"fast", "balanced", "accurate"} <= ids
    for m in body["models"]:
        assert m["disk_mb"] > 0 and m["ram_gb"] > 0
        assert m["downloaded"] is False


def test_transcribe_refuses_when_model_missing(client):
    res = client.post(
        "/transcribe",
        files={"file": ("a.wav", io.BytesIO(b"RIFF"), "audio/wav")},
    )
    assert res.status_code == 409
    assert "not downloaded" in res.json()["detail"]


def test_transcribe_rejects_unknown_model(client):
    res = client.post(
        "/transcribe",
        files={"file": ("a.wav", io.BytesIO(b"RIFF"), "audio/wav")},
        data={"model": "gigantic"},
    )
    assert res.status_code == 400


def test_unknown_job_404s(client):
    assert client.get("/jobs/nope").status_code == 404
    assert client.get("/jobs/nope/srt").status_code == 404


def test_download_unknown_model_404s(client):
    assert client.post("/models/nope/download").status_code == 404
