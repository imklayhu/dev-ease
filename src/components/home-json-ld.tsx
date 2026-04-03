import { absoluteUrl } from "@/lib/site-url";

type HomeJsonLdProps = {
  locale: string;
  name: string;
  items: Array<{ title: string; description: string; href: string }>;
};

/** 首页工具索引的 ItemList 结构化数据（与可见工具列表一致） */
export function HomeJsonLd({ locale, name, items }: HomeJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.title,
        url: absoluteUrl(tool.href, locale),
        description: tool.description,
        applicationCategory: "DeveloperApplication",
      },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
