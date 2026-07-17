/**
 * Client for the Hermite bridge — the small Python HTTP server launched from
 * Resolve's Workspace → Scripts menu (see `bridge/hermite_bridge.py`). This is
 * the only path that works on *free* Resolve, where external API access and
 * in-app script GUIs are unavailable.
 *
 * In a plain browser (dev/preview) there is no bridge, so every call fails
 * fast and the UI shows a "disconnected" state with instructions — that's
 * expected, not an error.
 */

import type { FusionKey } from "./easing";

export const BRIDGE_URL = "http://127.0.0.1:8712";

export interface BridgeHealth {
  ok: boolean;
  resolveVersion?: string;
  project?: string;
  timeline?: string;
  page?: string;
}

export interface Selection {
  hasFusion: boolean;
  clipName?: string;
  toolName?: string;
  availableInputs?: string[];
}

export interface ApplyEasingPayload {
  /** Fusion input to animate on the selected tool, e.g. "Size" | "Angle" | "Blend". */
  input: string;
  keys: FusionKey[];
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);
  try {
    const res = await fetch(`${BRIDGE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`Bridge ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getHealth(): Promise<BridgeHealth | null> {
  try {
    return await req<BridgeHealth>("/health");
  } catch {
    return null;
  }
}

export async function getSelection(): Promise<Selection | null> {
  try {
    return await req<Selection>("/selection");
  } catch {
    return null;
  }
}

export async function applyEasing(
  payload: ApplyEasingPayload,
): Promise<{ ok: boolean; message: string }> {
  return req("/apply-easing", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function applyPreset(
  preset: string,
): Promise<{ ok: boolean; message: string }> {
  return req("/apply-preset", {
    method: "POST",
    body: JSON.stringify({ preset }),
  });
}
