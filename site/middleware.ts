import { NextResponse, type NextRequest } from "next/server";

/**
 * Host routing — one Next app, two domains.
 *
 * hermitelabs.com serves the parent site (app/page.tsx). cut.hermitelabs.com
 * serves the HermiteCut product surface, which is the app/(resolve) route
 * group. Route groups don't affect URLs, so those pages already live at /cut,
 * /motion, /subs, /ai, /enterprise, /roadmap and /docs — the only thing the
 * subdomain needs is for its root to be the product home instead of the
 * parent's.
 *
 * Three rules, in order:
 *
 *   1. On a cut host, `/` renders /cut (a rewrite — the URL stays `/`).
 *   2. On a cut host, `/cut` and `/cut/*` redirect to the same page without the
 *      prefix, so a page is never reachable at two URLs on one domain.
 *   3. On the production apex, the product paths redirect out to the subdomain.
 *
 * Rule 3 is deliberately keyed to the two live apex hosts only. Vercel preview
 * deployments and localhost keep serving everything from one origin, so the
 * whole site stays browsable without a wildcard DNS setup.
 *
 * Deploy side (not code): add cut.hermitelabs.com to the same Vercel project
 * as hermitelabs.com and point a CNAME at Vercel. No second project, no second
 * build — both hosts are this app.
 */

/** Paths that belong to HermiteCut rather than to the parent. */
const PRODUCT_PATHS = [
  "/cut",
  "/motion",
  "/subs",
  "/ai",
  "/enterprise",
  "/roadmap",
  "/docs",
];

const APEX_HOSTS = new Set(["hermitelabs.com", "www.hermitelabs.com"]);

const CUT_ORIGIN = "https://cut.hermitelabs.com";

/** `cut.hermitelabs.com`, and `cut.localhost:3000` for local checking. */
function isCutHost(host: string): boolean {
  return host === "cut.hermitelabs.com" || host.startsWith("cut.localhost");
}

function isProductPath(pathname: string): boolean {
  return PRODUCT_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname, search } = request.nextUrl;

  if (isCutHost(host)) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/cut";
      return NextResponse.rewrite(url);
    }
    // /cut and /cut/anything are the same content as the root here.
    if (pathname === "/cut" || pathname.startsWith("/cut/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.slice("/cut".length) || "/";
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  // The apex hands the product off to its own domain. `/cut` is the product
  // home, so it lands on the subdomain root rather than on `/cut` again.
  if (APEX_HOSTS.has(host) && isProductPath(pathname)) {
    const target = pathname === "/cut" ? "" : pathname;
    return NextResponse.redirect(`${CUT_ORIGIN}${target}${search}`, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals, the API routes and static files.
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\.[\\w]+$).*)"],
};
