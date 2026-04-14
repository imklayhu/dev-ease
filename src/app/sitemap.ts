import type { MetadataRoute } from "next";

import { guides } from "@/data/guides";
import { tools } from "@/data/tools";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

function alternatesFor(path: string): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const hreflang = locale === "zh" ? "zh-CN" : "en";
    languages[hreflang] = absoluteUrl(path, locale);
  }
  languages["x-default"] = absoluteUrl(path, routing.defaultLocale);
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/settings/", changeFrequency: "monthly", priority: 0.5 },
    { path: "/guides/", changeFrequency: "monthly", priority: 0.65 },
    ...guides.map((g) => ({
      path: `/guides/${g.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...tools.map((tool) => ({
      path: tool.href,
      changeFrequency: "monthly" as const,
      priority: tool.featured ? 0.9 : 0.8,
    })),
  ];

  return pages.map((page) => ({
    url: absoluteUrl(page.path, routing.defaultLocale),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: alternatesFor(page.path),
  }));
}
