import { getCategoryForTool, getToolById } from "@/data/tools";
import { absoluteUrl } from "@/lib/site-url";

type ToolBreadcrumbJsonLdProps = {
  toolId: string;
  locale: string;
};

export function ToolBreadcrumbJsonLd({ toolId, locale }: ToolBreadcrumbJsonLdProps) {
  const tool = getToolById(toolId);
  const category = getCategoryForTool(toolId);
  if (!tool || !category) {
    return null;
  }

  const homeLabel = locale === "zh" ? "首页" : locale === "ja" ? "ホーム" : locale === "ko" ? "홈" : "Home";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: absoluteUrl("/", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
        item: absoluteUrl(`/#cat-${category.id}`, locale),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: absoluteUrl(tool.href, locale),
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
