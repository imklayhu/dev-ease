import { getCategoryForTool, getToolById } from "@/data/tools";
import { getTranslations } from "next-intl/server";
import { absoluteUrl } from "@/lib/site-url";

type ToolBreadcrumbJsonLdProps = {
  toolId: string;
  locale: string;
};

export async function ToolBreadcrumbJsonLd({ toolId, locale }: ToolBreadcrumbJsonLdProps) {
  const tool = getToolById(toolId);
  const category = getCategoryForTool(toolId);
  if (!tool || !category) {
    return null;
  }

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tTools = await getTranslations({ locale, namespace: "tools" });
  const read = (key: string, fallback: string): string => {
    try {
      return tTools(key as never) as string;
    } catch {
      return fallback;
    }
  };

  const localizedToolTitle = read(`items.${tool.id}.title`, tool.title);
  const localizedToolDescription = read(`items.${tool.id}.description`, tool.description);
  const localizedCategoryTitle = read(`categories.${category.id}.title`, category.title);
  const toolUrl = absoluteUrl(tool.href, locale);

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav("home"),
        item: absoluteUrl("/", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: localizedCategoryTitle,
        item: absoluteUrl(`/#cat-${category.id}`, locale),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: localizedToolTitle,
        item: toolUrl,
      },
    ],
  };

  const appData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolUrl}#software`,
    name: localizedToolTitle,
    description: localizedToolDescription,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: toolUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appData) }} />
    </>
  );
}
