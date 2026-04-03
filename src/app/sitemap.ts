import type { MetadataRoute } from "next";

import { guides } from "@/data/guides";
import { tools } from "@/data/tools";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const locales = routing.locales;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl("/", locale),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: absoluteUrl("/settings/", locale),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });

    entries.push({
      url: absoluteUrl("/guides/", locale),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });

    for (const g of guides) {
      entries.push({
        url: absoluteUrl(`/guides/${g.slug}/`, locale),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const tool of tools) {
      entries.push({
        url: absoluteUrl(tool.href, locale),
        lastModified,
        changeFrequency: "monthly",
        priority: tool.featured ? 0.9 : 0.8,
      });
    }
  }

  return entries;
}
