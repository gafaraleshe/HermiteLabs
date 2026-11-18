import { NextResponse, type NextRequest } from "next/server";

/**
 * Two sites, one Vercel project:
 *   - cut.hermitelabs.com serves the HermiteCut pages (app/(resolve)/cut) at its
 *     root: "/" -> /cut, "/changelog" -> /cut/changelog. Shared pages (legal)
 *     pass straight through.
 *   - hermitelabs.com is the Hermite Labs hub. Its old /cut pages move to the
 *     subdomain with a 301.
 * Any other host (Vercel previews, localhost) is left alone, so /cut still
 * works there for testing.
 */
const CUT_HOST = "cut.hermitelabs.com";
const HUB_HOSTS = new Set(["hermitelabs.com", "www.hermitelabs.com"]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const { pathname, search } = req.nextUrl;

  if (host === CUT_HOST) {
    if (pathname === "/cut" || pathname.startsWith("/cut/")) {
      const url = new URL(pathname.replace(/^\/cut/, "") || "/", req.url);
      url.search = search;
      return NextResponse.redirect(url, 301);
    }
    if (pathname === "/" || pathname === "/changelog") {
      const url = req.nextUrl.clone();
      url.pathname = pathname === "/" ? "/cut" : "/cut/changelog";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  if (HUB_HOSTS.has(host) && (pathname === "/cut" || pathname.startsWith("/cut/"))) {
    const rest = pathname.replace(/^\/cut/, "") || "/";
    return NextResponse.redirect(`https://${CUT_HOST}${rest}${search}`, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|robots.txt|sitemap.xml|opengraph-image|.*\\.(?:png|jpg|svg|ico|mp3|webp|txt|xml)$).*)"],
};
