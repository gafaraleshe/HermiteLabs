import os

import pytest

from hermite_core import models


def test_registry_ids_unique_and_complete():
    ids = [m.id for m in models.REGISTRY]
    assert len(ids) == len(set(ids))
    for m in models.REGISTRY:
        assert m.disk_mb > 0
        assert m.ram_gb > 0
        assert m.hf_repo.startswith("Systran/")


def test_exactly_one_default_and_it_is_smallest():
    defaults = [m for m in models.REGISTRY if m.default]
    assert len(defaults) == 1
    # the privacy/perf promise: default to the smallest viable model
    assert defaults[0].disk_mb == min(m.disk_mb for m in models.REGISTRY)


def test_unknown_id_raises():
    with pytest.raises(KeyError):
        models.spec("nope")


def test_registry_status_reports_download_state(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMITE_MODELS_DIR", str(tmp_path))
    status = models.registry_status()
    assert all(entry["downloaded"] is False for entry in status)

    # fake a downloaded model: the presence marker is model.bin
    fast_dir = tmp_path / "fast"
    fast_dir.mkdir()
    (fast_dir / "model.bin").write_bytes(b"x")
    status = {e["id"]: e["downloaded"] for e in models.registry_status()}
    assert status["fast"] is True
    assert status["balanced"] is False


def test_models_dir_env_override(monkeypatch):
    monkeypatch.setenv("HERMITE_MODELS_DIR", "/tmp/custom-models")
    assert models.models_dir() == "/tmp/custom-models"
    assert models.local_path("fast") == os.path.join("/tmp/custom-models", "fast")
