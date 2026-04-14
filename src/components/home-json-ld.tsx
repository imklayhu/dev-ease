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
      // 首页可见顺序与页面列表保持一致
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        "@id": `${absoluteUrl(tool.href, locale)}#software`,
        name: tool.title,
        url: absoluteUrl(tool.href, locale),
        description: tool.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        inLanguage: locale === "zh" ? "zh-CN" : "en",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
