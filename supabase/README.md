# supabase

Database schema for Hermite's cloud/web surfaces. Migrations live in
`migrations/` and are plain SQL — apply them however suits you.

Currently backs the **site waitlist** (Stage: site). The enterprise API schema
(`api_keys`, `usage`, `orgs`) will be added here when Stage 4 starts, in the
same project.

## Apply the schema

**Option A — dashboard (fastest, no CLI):** open your project's SQL Editor at
`https://supabase.com/dashboard/project/cyrzdfzxgpbcctzftvkk/sql`, paste the
contents of `migrations/0001_waitlist.sql`, and run it.

**Option B — Supabase CLI:**

```bash
supabase link --project-ref cyrzdfzxgpbcctzftvkk
supabase db push
```

## Wire the site to it

The waitlist API route (`site/app/api/waitlist/route.ts`) needs two server-only
env vars — set them in Vercel (Project → Settings → Environment Variables) and
in `site/.env.local` for local dev:

```
SUPABASE_URL=https://cyrzdfzxgpbcctzftvkk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your service_role key from Project Settings → API>
```

The service_role key is a secret — it's read only on the server (the route
handler), never shipped to the browser, and must never be prefixed
`NEXT_PUBLIC_`.
