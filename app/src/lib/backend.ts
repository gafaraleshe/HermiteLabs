/**
 * Client for the Hermite backend — the local transcription service on :8713
 * (see `backend/`). Distinct from the bridge (:8712), which runs inside
 * Resolve. Both are loopback-only.
 */

export const BACKEND_URL = "http://127.0.0.1:8713";

export interface ModelInfo {
  id: string;
  label: string;
  disk_mb: number;
  ram_gb: number;
  languages: string;
  notes: string;
  default: boolean;
  downloaded: boolean;
  downloading: boolean;
  downloadError: string | null;
}

export interface JobSegment {
  start: number;
  end: number;
  text: string;
  speaker: string | null;
}

export interface JobStatus {
  id: string;
  status: "queued" | "running" | "done" | "error";
  progress: number;
  model: string;
  segments?: JobSegment[];
  meta?: { language?: string; duration?: number };
  error?: string;
}

async function req<T>(path: string, init?: RequestInit, timeoutMs = 4000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) {
      let detail = `Backend ${res.status}`;
      try {
        detail = (await res.json()).detail ?? detail;
      } catch {
        /* non-JSON error body */
      }
      throw new Error(detail);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function backendHealth(): Promise<boolean> {
  try {
    const res = await req<{ ok: boolean }>("/health");
    return Boolean(res.ok);
  } catch {
    return false;
  }
}

export async function listModels(): Promise<ModelInfo[]> {
  const res = await req<{ models: ModelInfo[] }>("/models");
  return res.models;
}

export async function downloadModel(id: string): Promise<void> {
  await req(`/models/${id}/download`, { method: "POST" });
}

export async function transcribePath(
  path: string,
  model: string,
): Promise<string> {
  const res = await req<{ jobId: string }>("/transcribe-path", {
    method: "POST",
    body: JSON.stringify({ path, model }),
  });
  return res.jobId;
}

export async function jobStatus(jobId: string): Promise<JobStatus> {
  return req<JobStatus>(`/jobs/${jobId}`);
}

export async function jobSrt(jobId: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/jobs/${jobId}/srt`);
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return res.text();
}
