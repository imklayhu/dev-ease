import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { tools } from "@/data/tools";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { localeAlternates } from "@/lib/locale-alternates";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAltForLocale, toolSeoFallbackSuffix } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

export async function metadataForTool(toolId: string, locale: string): Promise<Metadata> {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) {
    return { title: "工具" };
  }

  const tTools = await getTranslations({ locale, namespace: "tools" });
  const read = (key: string, fallback: string): string => {
    try {
      return tTools(key as never) as string;
    } catch {
      return fallback;
    }
  };

  const localizedTitle = read(`items.${tool.id}.title`, tool.title);
  const localizedDescription = read(`items.${tool.id}.description`, tool.description);
  const url = absoluteUrl(tool.href, locale);
  const description =
    locale === "zh"
      ? (tool.seoDescription ?? `${localizedDescription} ${toolSeoFallbackSuffix(locale)}`)
      : `${localizedDescription} ${toolSeoFallbackSuffix(locale)}`;
  const ogTitle = `${localizedTitle} · ${BRAND_DISPLAY_NAME}`;
  const ogImages = [
    {
      url: OG_IMAGE_PATH,
      ...OG_IMAGE_DIMENSIONS,
      alt: ogImageAltForLocale(locale),
    },
  ];

  return {
    title: localizedTitle,
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
