import type { MetadataRoute } from "next";
import { CUT_URL, HUB_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: HUB_URL, lastModified: now, priority: 1 },
    { url: CUT_URL, lastModified: now, priority: 1 },
    { url: `${CUT_URL}/changelog`, lastModified: now, priority: 0.6 },
    ...["terms", "privacy", "refunds", "eula"].map(p => ({ url: `${HUB_URL}/${p}`, lastModified: now, priority: 0.3 })),
  ];
}
