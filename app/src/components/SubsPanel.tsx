import { useCallback, useEffect, useRef, useState } from "react";
import {
  backendHealth,
  downloadModel,
  jobSrt,
  jobStatus,
  listModels,
  transcribePath,
  type JobSegment,
  type ModelInfo,
} from "../lib/backend";
import { exportAudio, writeSubtitles } from "../lib/bridge";

/**
 * The Resolve integration flow (Stage 2, milestone 10):
 *   1. bridge /export-audio  — Resolve renders timeline audio to a temp WAV
 *   2. backend /transcribe-path — the engine transcribes that file locally
 *   3. bridge /write-subtitles  — the SRT goes back into Resolve's Media Pool
 * The proper correction UI (waveform + editing) is the next milestone; this
 * panel shows the transcript read-only before write-back.
 */

type Phase =
  | "idle"
  | "exporting"
  | "transcribing"
  | "review"
  | "writing"
  | "written"
  | "error";

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1).padStart(4, "0");
  return `${m}:${sec}`;
};

export function SubsPanel() {
  const [backendUp, setBackendUp] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [modelId, setModelId] = useState("fast");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<JobSegment[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const jobRef = useRef<string | null>(null);

  const refreshModels = useCallback(async () => {
    const up = await backendHealth();
    setBackendUp(up);
    if (!up) return;
    try {
      setModels(await listModels());
    } catch {
      /* transient — next poll will retry */
    }
  }, []);

  useEffect(() => {
    refreshModels();
    const id = setInterval(refreshModels, 4000);
    return () => clearInterval(id);
  }, [refreshModels]);

  async function onDownload(id: string) {
    try {
      await downloadModel(id);
      await refreshModels();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Download failed.");
    }
  }

  async function run() {
    setMessage(null);
    setSegments([]);
    try {
      setPhase("exporting");
      const exported = await exportAudio();
      if (!exported.ok || !exported.path) {
        throw new Error(exported.message ?? "Audio export failed.");
      }

      setPhase("transcribing");
      setProgress(0);
      const jobId = await transcribePath(exported.path, modelId);
      jobRef.current = jobId;

      // poll until done
      for (;;) {
        await new Promise((r) => setTimeout(r, 800));
        const st = await jobStatus(jobId);
        setProgress(st.progress);
        if (st.status === "done") {
          setSegments(st.segments ?? []);
          break;
        }
        if (st.status === "error") throw new Error(st.error ?? "Transcription failed.");
      }
      setPhase("review");
    } catch (e) {
      setPhase("error");
      setMessage(e instanceof Error ? e.message : String(e));
    }
  }

  async function writeBack() {
    if (!jobRef.current) return;
    try {
      setPhase("writing");
      const srt = await jobSrt(jobRef.current);
      if (!srt.trim()) {
        throw new Error("No speech was detected, so there's nothing to write back.");
      }
      const res = await writeSubtitles(srt, "hermite_subtitles");
      setMessage(res.message);
      setPhase(res.ok ? "written" : "error");
    } catch (e) {
      setPhase("error");
      setMessage(e instanceof Error ? e.message : String(e));
    }
  }

  const busy = phase === "exporting" || phase === "transcribing" || phase === "writing";
  const selected = models.find((m) => m.id === modelId);
  const canRun = backendUp && Boolean(selected?.downloaded) && !busy;

  return (
    <main className="layout">
      <section className="panel">
        <div className="panel-head">
          <h2>Models</h2>
          <p>
            On-device only — requirements shown before anything downloads.
            {!backendUp && " Backend offline: start it (see backend/README)."}
          </p>
        </div>
        <div className="model-list">
          {models.length === 0 && (
            <p className="hint">
              {backendUp ? "Loading models…" : "Waiting for the backend on 127.0.0.1:8713…"}
            </p>
          )}
          {models.map((m) => (
            <label key={m.id} className={`model-row${m.id === modelId ? " active" : ""}`}>
              <input
                type="radio"
                name="model"
                checked={m.id === modelId}
                onChange={() => setModelId(m.id)}
              />
              <div className="model-info">
                <strong>{m.label}</strong>
                <span>
                  {m.disk_mb} MB · {m.ram_gb} GB RAM · {m.languages}
                </span>
                <em>{m.notes}</em>
              </div>
              {m.downloaded ? (
                <span className="model-state ok">Installed</span>
              ) : m.downloading ? (
                <span className="model-state">Downloading…</span>
              ) : (
                <button
                  type="button"
                  className="model-dl"
                  onClick={() => onDownload(m.id)}
                >
                  Download
                </button>
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Transcribe timeline</h2>
          <p>
            Renders the current timeline&apos;s audio, transcribes it on this
            machine, and writes the subtitles back into Resolve.
          </p>
        </div>

        <button type="button" className="apply-btn" onClick={run} disabled={!canRun}>
          {phase === "exporting"
            ? "Rendering timeline audio…"
            : phase === "transcribing"
              ? `Transcribing… ${Math.round(progress * 100)}%`
              : "Transcribe timeline"}
        </button>
        {!backendUp && (
          <p className="hint">The transcription backend isn&apos;t running.</p>
        )}
        {backendUp && selected && !selected.downloaded && (
          <p className="hint">
            Download {selected.label} first — nothing installs silently.
          </p>
        )}

        {(phase === "review" || phase === "written" || phase === "writing") && (
          <>
            <div className="segment-list">
              {segments.length === 0 ? (
                <p className="hint">No speech detected in the timeline audio.</p>
              ) : (
                segments.map((s, i) => (
                  <div className="segment" key={i}>
                    <span className="tc">
                      {fmtTime(s.start)}–{fmtTime(s.end)}
                    </span>
                    <span>{s.text}</span>
                  </div>
                ))
              )}
            </div>
            {segments.length > 0 && phase !== "written" && (
              <button
                type="button"
                className="apply-btn"
                onClick={writeBack}
                disabled={phase === "writing"}
              >
                {phase === "writing" ? "Writing to Resolve…" : "Write back to Resolve"}
              </button>
            )}
          </>
        )}

        {message && <p className="apply-status">{message}</p>}
      </section>
    </main>
  );
}
