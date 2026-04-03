import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { OG_IMAGE_PATH } from "@/lib/seo-shared";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site-url";

type SiteJsonLdProps = {
  locale: string;
  /** 与首页 meta 一致的多语言描述 */
  siteDescription?: string;
};

export function SiteJsonLd({ locale, siteDescription }: SiteJsonLdProps) {
  const orgId = `${SITE_ORIGIN}/#organization`;
  const logoUrl = absoluteUrl(OG_IMAGE_PATH, locale);
  const webDesc =
    siteDescription ??
    `${BRAND_DISPLAY_NAME} developer utilities, local-first and deployable on GitHub Pages.`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: BRAND_DISPLAY_NAME,
      url: absoluteUrl("/", locale),
      logo: logoUrl,
      sameAs: ["https://github.com/imklayhu/dev-ease"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: absoluteUrl("/", locale),
      name: BRAND_DISPLAY_NAME,
      description: webDesc,
      inLanguage: locale === "zh" ? "zh-CN" : locale === "ja" ? "ja" : locale === "ko" ? "ko" : "en",
      publisher: { "@id": orgId },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_ORIGIN}/#webapp`,
      name: BRAND_DISPLAY_NAME,
      url: absoluteUrl("/", locale),
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "JavaScript enabled browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: { "@id": orgId },
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
