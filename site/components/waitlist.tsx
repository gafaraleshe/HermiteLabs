"use client";

import { useState } from "react";

type State = "idle" | "loading" | "done" | "already" | "error";

export function WaitlistForm({ source = "site-hero" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) setState(data.already ? "already" : "done");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "done" || state === "already") {
    return (
      <p className="waitlist-done">
        {state === "already"
          ? "You're already on the list — thanks for the patience."
          : "You're on the list. We'll email you as Hermite ships."}
      </p>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={submit} noValidate>
      <input
        type="email"
        required
        placeholder="you@studio.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-primary" disabled={state === "loading"}>
        {state === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
      {state === "error" && (
        <span className="waitlist-error" role="alert">
          Something went wrong — try again in a moment.
        </span>
      )}
    </form>
  );
}
