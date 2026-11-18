# Deploying hermitelabs.com and cut.hermitelabs.com

Both sites are one Next.js app (this `site/` folder) on **one Vercel project**.
`middleware.ts` routes by host:

| Host | Serves |
|---|---|
| `hermitelabs.com`, `www.hermitelabs.com` | the Hermite Labs hub (`app/page.tsx`), legal pages; `/cut/*` 301 → cut.hermitelabs.com |
| `cut.hermitelabs.com` | HermiteCut (`app/(resolve)/cut`) at `/`, its changelog at `/changelog`, the shared legal pages |
| anything else (previews, localhost) | everything as-is, including `/cut` for testing |

## Vercel settings

- Framework preset **Next.js**, Root Directory **`site`**, default build
  (`next build`) and output.
- **Domains** (Project → Settings → Domains): `hermitelabs.com`,
  `www.hermitelabs.com` and `cut.hermitelabs.com`, all on this project. The
  cut subdomain is already attached; it serves HermiteCut once this branch is
  in production.
- **Production branch:** the branch these changes are merged into.

## Environment variables (Project → Settings → Environment Variables)

| Name | Needed | What it does |
|---|---|---|
| `NEXT_PUBLIC_POLAR_CHECKOUT_URL` | when you start selling | The Polar checkout link. Empty = every Buy button is hidden and only Download shows. |
| `NEXT_PUBLIC_CUT_PRICE_GBP` | optional | The UK price label (default `£30`). See the table below. |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | only for `/api/waitlist` | Unchanged from before. |

You can also set the checkout link in `lib/config.ts` (`POLAR_CHECKOUT_URL`).
Redeploy after changing either.

## Company details for the legal pages

Fill `COMPANY` in `lib/config.ts` (company number, registered address, contact
email). Each line appears on the Terms, Privacy, Refunds and EULA pages only
once it is set.

## Keeping the template list and changelog current

- `data/cut-templates.json`: exported from HermiteCut's
  `build/HermiteCut-manifest.json` (`python tools/fusegen/build_pack.py`).
- `data/cut-sounds.json` and `public/cut/sfx/`: samples from HermiteCut's
  `build/sfx` (`python tools/sfxgen/sfxgen.py`).
- `data/hermitecut-changelog.md`: a copy of HermiteCut's `CHANGELOG.md`. The
  changelog page also fetches the copy on GitHub's main branch at build and
  uses whichever is newer.

Check locally with `npm ci && npx next build && npx next start`, then
`curl -H "Host: cut.hermitelabs.com" localhost:3000/` to test the host routing.


## Prices and checkout (studio design, Nov 2026)

| Variable | Default | What it does |
|---|---|---|
| `NEXT_PUBLIC_POLAR_CHECKOUT_URL` | empty | The Polar checkout link. While empty, every page offers the free download and no Buy button shows. Once set, Buy buttons, the price card, "one-time licence" copy and the Polar footer note all switch on. |
| `NEXT_PUBLIC_POLAR_PORTAL_URL` | empty | The Polar customer portal, where buyers find their licence key and downloads ("Already bought?" links). |
| `NEXT_PUBLIC_POLAR_CHECKOUT_URL_USD` | empty | Optional separate link for US buyers; the main link is used if empty. |
| `NEXT_PUBLIC_CUT_PRICE_GBP` | `£30` | Price for the UK and elsewhere. |
| `NEXT_PUBLIC_CUT_PRICE_USD` | `$50` | Price for the US. Visitors can switch region; it is guessed from their time zone. |

Redeploy after changing them. `hermitelabs.com/cut` and `hermitelabs.com/flow` 301 to
`cut.hermitelabs.com` and `flow.hermitelabs.com` (middleware.ts).
