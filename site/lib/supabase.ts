import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** The project URL, under either of the two common env var names. */
function supabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/**
 * Server-only Supabase client using the service_role key. Never import this
 * from a client component — the key must stay on the server. Returns null when
 * the env vars aren't set, so callers can degrade gracefully instead of
 * throwing at build time.
 */
export function getServiceClient(): SupabaseClient | null {
  const url = supabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Which required env vars are present (booleans only — never the values).
 * Surfaced in the 503 body to make misconfiguration diagnosable. */
export function supabaseEnvStatus(): { url: boolean; key: boolean } {
  return {
    url: Boolean(supabaseUrl()),
    key: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}
