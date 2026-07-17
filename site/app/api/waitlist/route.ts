import { NextResponse } from "next/server";
import { getServiceClient, supabaseEnvStatus } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  let source = "site";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    if (typeof body?.source === "string") source = body.source.slice(0, 40);
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    // Env not configured yet — tell the client cleanly rather than 500-ing.
    // `has` reports which vars are missing (booleans only, no secrets).
    return NextResponse.json(
      { ok: false, error: "not-configured", has: supabaseEnvStatus() },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("waitlist").insert({ email, source });
  if (error) {
    // 23505 = unique_violation → already signed up, which is a success for us.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
