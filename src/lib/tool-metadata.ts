import type { Metadata } from "next";

import { tools } from "@/data/tools";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAlt } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

export function metadataForTool(toolId: string): Metadata {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) {
    return { title: "工具" };
  }

  const description =
    tool.seoDescription ??
    `${tool.description} 纯前端在线工具，无需登录；数据在浏览器本地处理。`;
  const url = absoluteUrl(tool.href);
  const ogTitle = `${tool.title} · ${BRAND_DISPLAY_NAME}`;
  const ogImages = [
    {
      url: OG_IMAGE_PATH,
      ...OG_IMAGE_DIMENSIONS,
      alt: ogImageAlt(),
    },
  ];

  return {
    title: tool.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: ogTitle,
      description,
      siteName: BRAND_DISPLAY_NAME,
      locale: "zh_CN",
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
