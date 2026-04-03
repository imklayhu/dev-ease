import { tools } from "@/data/tools";
import { absoluteUrl } from "@/lib/site-url";

/** 首页工具索引的 ItemList 结构化数据（与可见工具列表一致） */
export function HomeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "DevEase 工具索引",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.title,
        url: absoluteUrl(tool.href),
        description: tool.description,
        applicationCategory: "DeveloperApplication",
      },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
