import type { MetadataRoute } from "next";

import { tools } from "@/data/tools";
import { SITE_ORIGIN } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_ORIGIN}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}/settings/`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${SITE_ORIGIN}${tool.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: tool.featured ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...toolEntries];
}
