-- Hermite site — waitlist capture.
--
-- Row Level Security is ON with no public policies, so the anon/public keys
-- can neither read nor write this table. Only the service_role key (used
-- server-side by the /api/waitlist route) bypasses RLS to insert. That keeps
-- signups private and write-only from the public internet.

create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null unique,
  source     text        not null default 'site',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);
