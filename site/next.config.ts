import type { NextConfig } from "next";

// Pages from the earlier staged plan now live on the HermiteCut site.
const OLD = ["/motion", "/subs", "/ai", "/enterprise", "/roadmap", "/docs", "/docs/:path*"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return OLD.map(source => ({ source, destination: "/cut", permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/cut/sfx/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
