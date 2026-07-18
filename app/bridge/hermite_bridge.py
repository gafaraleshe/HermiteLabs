#!/usr/bin/env python3
"""
Hermite bridge — the local link between the desktop app and DaVinci Resolve.

WHY THIS EXISTS
    On *free* Resolve you cannot connect from an external process, and since
    19.1 you cannot draw a script GUI inside Resolve either. The workaround
    (the same one AutoSubs uses) is a small script that runs *inside* Resolve
    from Workspace -> Scripts, and exposes a localhost HTTP API the external
    app calls. This file is that script.

HOW TO RUN
    Copy this file (and the `bridge/` folder) into Resolve's Scripts folder:
      macOS  ~/Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Utility/
      Win    %APPDATA%\\Blackmagic Design\\DaVinci Resolve\\Fusion\\Scripts\\Utility\\
    Then in Resolve: Workspace -> Scripts -> hermite_bridge. It serves on
    http://127.0.0.1:8712 until you close Resolve or stop the script.

STATUS
    v0.1. The HTTP/health/selection layer is standard and solid. The Fusion
    keyframe write (`/apply-easing`) uses the documented Fusion Python API but
    has NOT been validated against a running Resolve in this environment —
    load-test on your machine and report anything that misbehaves.
"""

import json
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"
PORT = 8712


# ── Resolve connection ───────────────────────────────────────────────────────

def get_resolve():
    """Return the Resolve app object, whether launched inside Resolve or not."""
    # Injected global when run from Resolve's Scripts menu.
    if "resolve" in globals():
        return globals()["resolve"]
    try:
        import DaVinciResolveScript as dvr  # available on the Resolve Python path
    except ImportError:
        # Fall back to the default module location per platform.
        import os
        candidates = {
            "darwin": "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules",
            "win32": os.path.expandvars(r"%PROGRAMDATA%\\Blackmagic Design\\DaVinci Resolve\\Support\\Developer\\Scripting\\Modules"),
        }
        path = candidates.get(sys.platform)
        if path and path not in sys.path:
            sys.path.append(path)
        import DaVinciResolveScript as dvr
    return dvr.scriptapp("Resolve")


RESOLVE = None


def resolve():
    global RESOLVE
    if RESOLVE is None:
        RESOLVE = get_resolve()
    return RESOLVE


# ── Resolve / Fusion helpers ─────────────────────────────────────────────────

def current_comp():
    """The active Fusion comp (the clip open on the Fusion page)."""
    fusion = resolve().Fusion()
    return fusion.GetCurrentComp() if fusion else None


def health_payload():
    r = resolve()
    if r is None:
        return {"ok": False}
    pm = r.GetProjectManager()
    proj = pm.GetCurrentProject() if pm else None
    tl = proj.GetCurrentTimeline() if proj else None
    return {
        "ok": True,
        "resolveVersion": r.GetVersionString(),
        "project": proj.GetName() if proj else None,
        "timeline": tl.GetName() if tl else None,
        "page": r.GetCurrentPage(),
    }


def selection_payload():
    comp = current_comp()
    if comp is None:
        return {"hasFusion": False}
    tool = comp.ActiveTool or None
    return {
        "hasFusion": True,
        "toolName": tool.Name if tool else None,
        # A pragmatic list of the inputs Hermite animates.
        "availableInputs": ["Size", "Angle", "Blend", "Center"],
    }


def apply_easing(body):
    """Write the curve's keyframes onto the active tool's input.

    v0.1 approach: SetInput at each keyframe frame creates/extends an animation
    spline with the right frames and values. Transferring the exact cubic-bezier
    handles (RH/LH) onto that spline is the follow-up marked below — the frames
    and values are already correct, the interpolation is Fusion's default until
    then.
    """
    comp = current_comp()
    if comp is None:
        return {"ok": False, "message": "Open a clip on the Fusion page first."}
    tool = comp.ActiveTool
    if not tool:
        return {"ok": False, "message": "Select a node in the Fusion graph first."}

    input_name = body.get("input", "Size")
    keys = body.get("keys", [])
    if not keys:
        return {"ok": False, "message": "No keyframes supplied."}

    comp.StartUndo("Hermite easing")
    try:
        for k in keys:
            tool.SetInput(input_name, float(k["value"]), float(k["frame"]))
        # TODO(handles): fetch the connected BezierSpline for `input_name` and
        # SetKeyFrames with each key's RH/LH so the applied curve matches the
        # editor exactly rather than Fusion's default smoothing.
    finally:
        comp.EndUndo(True)
    return {
        "ok": True,
        "message": f"Set {len(keys)} keyframes on {tool.Name}.{input_name}.",
    }


def export_audio(body):
    """Render the current timeline's audio to a temp WAV and return its path.

    Synchronous: audio-only renders are fast, so the request blocks until the
    render finishes (10-minute ceiling). The app shows progress states around
    this call. v0.1 — the render-settings keys are per Blackmagic's docs but
    Resolve versions vary in accepted format/codec strings, so we try a couple
    and surface whatever Resolve reports on failure.
    """
    import os
    import tempfile
    import time

    r = resolve()
    pm = r.GetProjectManager()
    proj = pm.GetCurrentProject() if pm else None
    if proj is None:
        return {"ok": False, "message": "No project open."}
    timeline = proj.GetCurrentTimeline()
    if timeline is None:
        return {"ok": False, "message": "No timeline open."}

    outdir = tempfile.mkdtemp(prefix="hermite-audio-")
    custom_name = "hermite_timeline_audio"

    # Try known (format, codec) spellings across Resolve versions.
    for fmt, codec in (("wav", "lpcm"), ("WAV", "LinearPCM"), ("mp3", "mp3")):
        if proj.SetCurrentRenderFormatAndCodec(fmt, codec):
            break

    proj.SetRenderSettings({
        "SelectAllFrames": 1,
        "TargetDir": outdir,
        "CustomName": custom_name,
        "ExportVideo": False,
        "ExportAudio": True,
    })
    job_id = proj.AddRenderJob()
    if not job_id:
        return {"ok": False, "message": "Resolve refused the render job."}
    if not proj.StartRendering(job_id):
        proj.DeleteRenderJob(job_id)
        return {"ok": False, "message": "Rendering failed to start."}

    deadline = time.time() + 600
    while proj.IsRenderingInProgress():
        if time.time() > deadline:
            proj.StopRendering()
            proj.DeleteRenderJob(job_id)
            return {"ok": False, "message": "Render timed out after 10 minutes."}
        time.sleep(0.5)

    status = proj.GetRenderJobStatus(job_id) or {}
    proj.DeleteRenderJob(job_id)
    if status.get("JobStatus") not in ("Complete", None):
        return {"ok": False, "message": f"Render ended as {status.get('JobStatus')!r}."}

    files = sorted(
        (os.path.join(outdir, f) for f in os.listdir(outdir)),
        key=os.path.getmtime,
        reverse=True,
    )
    if not files:
        return {"ok": False, "message": "Render finished but produced no file."}
    return {"ok": True, "path": files[0], "timeline": timeline.GetName()}


def write_subtitles(body):
    """Import subtitle content (SRT text) into the project.

    v0.1 strategy — most reliable documented path first: write the SRT to
    disk, import it into the Media Pool, then attempt AppendToTimeline so it
    lands on a subtitle track. Each step reports individually, so if the
    append isn't supported in a given Resolve version, the user still has the
    SRT in the Media Pool (drag it to the timeline) and on disk.
    """
    import os
    import tempfile

    srt_text = body.get("srt", "")
    if not srt_text.strip():
        return {"ok": False, "message": "Empty subtitle content."}
    name = body.get("name") or "hermite_subtitles"

    r = resolve()
    pm = r.GetProjectManager()
    proj = pm.GetCurrentProject() if pm else None
    if proj is None:
        return {"ok": False, "message": "No project open."}

    outdir = tempfile.mkdtemp(prefix="hermite-subs-")
    srt_path = os.path.join(outdir, f"{name}.srt")
    with open(srt_path, "w", encoding="utf-8") as fh:
        fh.write(srt_text)

    media_pool = proj.GetMediaPool()
    items = media_pool.ImportMedia([srt_path]) if media_pool else None
    imported = bool(items)

    appended = False
    if imported:
        try:
            appended = bool(media_pool.AppendToTimeline(items))
        except Exception:
            appended = False

    if appended:
        message = "Subtitles added to the timeline."
    elif imported:
        message = "SRT imported to the Media Pool — drag it onto the timeline."
    else:
        message = f"Couldn't import into Resolve — the SRT is saved at {srt_path}."
    return {
        "ok": imported,
        "imported": imported,
        "appended": appended,
        "path": srt_path,
        "message": message,
    }


def apply_preset(body):
    # Motion presets ship in the .drfx and are applied from Resolve's Effects
    # library; driving that from the bridge is a later convenience.
    return {
        "ok": False,
        "message": f"Preset '{body.get('preset')}' — install the .drfx and drag it "
        "from the Effects library for now.",
    }


ROUTES_GET = {"/health": health_payload, "/selection": selection_payload}
ROUTES_POST = {
    "/apply-easing": apply_easing,
    "/apply-preset": apply_preset,
    "/export-audio": export_audio,
    "/write-subtitles": write_subtitles,
}


# ── HTTP server ──────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(200, {"ok": True})

    def do_GET(self):
        handler = ROUTES_GET.get(self.path)
        if not handler:
            return self._send(404, {"ok": False, "message": "not found"})
        try:
            self._send(200, handler())
        except Exception as exc:  # never let a Resolve API hiccup kill the server
            self._send(500, {"ok": False, "message": str(exc)})

    def do_POST(self):
        handler = ROUTES_POST.get(self.path)
        if not handler:
            return self._send(404, {"ok": False, "message": "not found"})
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw or b"{}")
            self._send(200, handler(body))
        except Exception as exc:
            self._send(500, {"ok": False, "message": str(exc)})

    def log_message(self, *_args):
        pass  # keep Resolve's console quiet


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Hermite bridge listening on http://{HOST}:{PORT}")
    # Run in a daemon thread so the script stays responsive in Resolve.
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        thread.join()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
