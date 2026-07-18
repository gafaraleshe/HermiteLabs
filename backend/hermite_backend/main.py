"""Hermite backend — the local transcription service (Stage 2).

A FastAPI app serving on 127.0.0.1:8713 (loopback only — never exposed to the
network; the bridge to Resolve owns :8712). The desktop app talks to this for
everything Subs: model management, transcription jobs, and subtitle export.

Run:  uvicorn hermite_backend.main:app --host 127.0.0.1 --port 8713

Privacy invariant: audio arrives from localhost, is written to a private temp
dir, transcribed in-process, and deleted when the job is dropped. The only
network egress in this whole service is the explicit model download endpoint.
"""

from __future__ import annotations

import os
import shutil
import tempfile
import threading
import uuid
from dataclasses import dataclass, field

from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from hermite_core import __version__ as core_version
from hermite_core import models
from hermite_core.subtitles import Segment, to_srt, to_vtt

app = FastAPI(title="Hermite backend", version=core_version)

# The Tauri app (dev server or packaged webview) is the only expected caller.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^(http://(localhost|127\.0\.0\.1)(:\d+)?|tauri://localhost)$",
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Job store ────────────────────────────────────────────────────────────────

@dataclass
class Job:
    id: str
    status: str = "queued"          # queued | running | done | error
    progress: float = 0.0
    model: str = ""
    error: str | None = None
    segments: list[Segment] = field(default_factory=list)
    meta: dict = field(default_factory=dict)
    workdir: str = ""


JOBS: dict[str, Job] = {}
JOBS_LOCK = threading.Lock()

DOWNLOADS: dict[str, dict] = {}     # model_id -> {status, error}
DOWNLOADS_LOCK = threading.Lock()


def _run_job(job: Job, audio_path: str, language: str | None, vad: bool) -> None:
    from hermite_core.transcribe import transcribe_file  # heavy import off the main thread

    def on_progress(p: float) -> None:
        job.progress = p

    try:
        job.status = "running"
        segments, meta = transcribe_file(
            audio_path,
            model_id=job.model,
            language=language,
            vad=vad,
            on_progress=on_progress,
        )
        job.segments = segments
        job.meta = meta
        job.progress = 1.0
        job.status = "done"
    except FileNotFoundError as exc:      # model not downloaded
        job.status = "error"
        job.error = str(exc)
    except Exception as exc:              # decode failures, etc.
        job.status = "error"
        job.error = f"{type(exc).__name__}: {exc}"


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "service": "hermite-backend",
        "core": core_version,
        "modelsDir": models.models_dir(),
    }


@app.get("/models")
def list_models() -> dict:
    status = models.registry_status()
    with DOWNLOADS_LOCK:
        for entry in status:
            dl = DOWNLOADS.get(entry["id"])
            entry["downloading"] = bool(dl and dl["status"] == "running")
            entry["downloadError"] = dl["error"] if dl else None
    return {"models": status}


@app.post("/models/{model_id}/download")
def download_model(model_id: str) -> dict:
    try:
        spec = models.spec(model_id)
    except KeyError:
        raise HTTPException(404, f"unknown model '{model_id}'")
    if models.is_downloaded(model_id):
        return {"ok": True, "status": "downloaded"}

    with DOWNLOADS_LOCK:
        if DOWNLOADS.get(model_id, {}).get("status") == "running":
            return {"ok": True, "status": "running"}
        DOWNLOADS[model_id] = {"status": "running", "error": None}

    def run() -> None:
        try:
            models.download(model_id)
            with DOWNLOADS_LOCK:
                DOWNLOADS[model_id] = {"status": "done", "error": None}
        except Exception as exc:
            with DOWNLOADS_LOCK:
                DOWNLOADS[model_id] = {"status": "error", "error": str(exc)}

    threading.Thread(target=run, daemon=True).start()
    return {"ok": True, "status": "running", "sizeMb": spec.disk_mb}


@app.post("/transcribe")
async def transcribe(
    file: UploadFile,
    model: str = Form(default=""),
    language: str = Form(default=""),
    vad: bool = Form(default=True),
) -> dict:
    model_id = model or models.default_model().id
    try:
        models.spec(model_id)
    except KeyError:
        raise HTTPException(400, f"unknown model '{model_id}'")
    if not models.is_downloaded(model_id):
        raise HTTPException(
            409,
            f"model '{model_id}' is not downloaded — POST /models/{model_id}/download first",
        )

    workdir = tempfile.mkdtemp(prefix="hermite-job-")
    audio_path = os.path.join(workdir, file.filename or "audio")
    with open(audio_path, "wb") as fh:
        while chunk := await file.read(1 << 20):
            fh.write(chunk)

    job = Job(id=uuid.uuid4().hex[:12], model=model_id, workdir=workdir)
    with JOBS_LOCK:
        JOBS[job.id] = job
    threading.Thread(
        target=_run_job,
        args=(job, audio_path, language or None, vad),
        daemon=True,
    ).start()
    return {"ok": True, "jobId": job.id}


def _get_job(job_id: str) -> Job:
    with JOBS_LOCK:
        job = JOBS.get(job_id)
    if job is None:
        raise HTTPException(404, "no such job")
    return job


@app.get("/jobs/{job_id}")
def job_status(job_id: str) -> dict:
    job = _get_job(job_id)
    payload: dict = {
        "id": job.id,
        "status": job.status,
        "progress": round(job.progress, 3),
        "model": job.model,
    }
    if job.status == "done":
        payload["segments"] = [s.to_dict() for s in job.segments]
        payload["meta"] = job.meta
    if job.error:
        payload["error"] = job.error
    return payload


@app.get("/jobs/{job_id}/srt", response_class=PlainTextResponse)
def job_srt(job_id: str) -> str:
    job = _get_job(job_id)
    if job.status != "done":
        raise HTTPException(409, f"job is {job.status}, not done")
    return to_srt(job.segments)


@app.get("/jobs/{job_id}/vtt", response_class=PlainTextResponse)
def job_vtt(job_id: str) -> str:
    job = _get_job(job_id)
    if job.status != "done":
        raise HTTPException(409, f"job is {job.status}, not done")
    return to_vtt(job.segments)


@app.delete("/jobs/{job_id}")
def drop_job(job_id: str) -> dict:
    job = _get_job(job_id)
    with JOBS_LOCK:
        JOBS.pop(job_id, None)
    if job.workdir and os.path.isdir(job.workdir):
        shutil.rmtree(job.workdir, ignore_errors=True)  # audio deleted here
    return {"ok": True}
