import type { Metadata } from "next";

import { tools } from "@/data/tools";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { localeAlternates } from "@/lib/locale-alternates";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAltForLocale, toolSeoFallbackSuffix } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

export function metadataForTool(toolId: string, locale: string): Metadata {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) {
    return { title: "工具" };
  }

  const url = absoluteUrl(tool.href, locale);
  const description =
    tool.seoDescription ??
    `${tool.description} ${toolSeoFallbackSuffix(locale)}`;
  const ogTitle = `${tool.title} · ${BRAND_DISPLAY_NAME}`;
  const ogImages = [
    {
      url: OG_IMAGE_PATH,
      ...OG_IMAGE_DIMENSIONS,
      alt: ogImageAltForLocale(locale),
    },
  ];

  return {
    title: tool.title,
    description,
    alternates: localeAlternates(tool.href, locale),
    openGraph: {
      type: "website",
      url,
      title: ogTitle,
      description,
      siteName: BRAND_DISPLAY_NAME,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
