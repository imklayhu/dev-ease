import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site-url";

type GuideEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

type GuideListJsonLdProps = {
  locale: string;
  name: string;
  guides: GuideEntry[];
};

export function GuideListJsonLd({ locale, name, guides }: GuideListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.date,
        inLanguage: locale === "zh" ? "zh-CN" : "en",
        url: absoluteUrl(`/guides/${guide.slug}/`, locale),
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

type GuideArticleJsonLdProps = {
  locale: string;
  slug: string;
  title: string;
  description: string;
  date: string;
};

export function GuideArticleJsonLd({ locale, slug, title, description, date }: GuideArticleJsonLdProps) {
  const articleUrl = absoluteUrl(`/guides/${slug}/`, locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: BRAND_DISPLAY_NAME,
      url: absoluteUrl("/", locale),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: BRAND_DISPLAY_NAME,
      url: absoluteUrl("/", locale),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
