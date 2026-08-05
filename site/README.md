# site

One Next.js app serving two domains.

| Host | What it serves | Where it lives |
| --- | --- | --- |
| `hermitelabs.com` | The Hermite Labs parent site — the product suite, monochrome by rule | `app/page.tsx` + `app/brand.css` |
| `cut.hermitelabs.com` | HermiteCut — the DaVinci Resolve product, landing page, stage pages, roadmap and `/docs` | `app/(resolve)/` + `app/(resolve)/cut-theme.css` |

`middleware.ts` does the host routing. Route groups don't affect URLs, so the
HermiteCut pages already live at `/cut`, `/motion`, `/subs`, `/ai`,
`/enterprise`, `/roadmap` and `/docs`; the middleware maps the subdomain root
onto `/cut`, canonicalises `cut.hermitelabs.com/cut` back to `/`, and redirects
those paths off the production apex so each page has one public URL.

Preview deployments and localhost are deliberately exempt from the apex
redirect — everything stays browsable from a single origin, and
`cut.localhost:3000` exercises the subdomain behaviour locally.

## Deploy

One Vercel project, root directory `site`. Add **both** domains to it:

1. `hermitelabs.com` (and `www`) — already attached.
2. `cut.hermitelabs.com` — add it in *Project → Settings → Domains*, then point
   a `CNAME` for `cut` at `cname.vercel-dns.com`.

There is no second project and no second build: both hosts are this app, so a
deploy ships them together.

## Design

The parent site is the Hermite brand system straight (`app/brand.css`), and it
carries no accent. HermiteCut is the same system with one variable changed:
green `#46DD79` on ink, `#0C7A42` on paper. `app/(resolve)/cut-theme.css` holds
that surface, including the re-pointed Clay tokens the older stage pages still
use. See [DESIGN.md](./DESIGN.md) for the Clay reference and
[HERMITE-PLAN.md §5](../HERMITE-PLAN.md#5-technical-architecture) for the
product architecture.
