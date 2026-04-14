import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { OG_IMAGE_PATH } from "@/lib/seo-shared";
import { SITE_ORIGIN, absoluteSiteUrl, absoluteUrl } from "@/lib/site-url";

type SiteJsonLdProps = {
  locale: string;
  /** 与首页 meta 一致的多语言描述 */
  siteDescription?: string;
};

export function SiteJsonLd({ locale, siteDescription }: SiteJsonLdProps) {
  const homeUrl = absoluteUrl("/", locale);
  const orgId = `${SITE_ORIGIN}/#organization`;
  const websiteId = `${homeUrl}#website`;
  const webAppId = `${homeUrl}#webapp`;
  const logoUrl = absoluteSiteUrl(OG_IMAGE_PATH);
  const webDesc =
    siteDescription ??
    `${BRAND_DISPLAY_NAME} developer utilities, local-first and deployable on GitHub Pages.`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: BRAND_DISPLAY_NAME,
      url: SITE_ORIGIN,
      logo: logoUrl,
      sameAs: ["https://github.com/imklayhu/dev-ease"],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: homeUrl,
      name: BRAND_DISPLAY_NAME,
      description: webDesc,
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      availableLanguage: ["zh-CN", "en"],
      publisher: { "@id": orgId },
    },
    {
      "@type": "WebApplication",
      "@id": webAppId,
      name: BRAND_DISPLAY_NAME,
      url: homeUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "JavaScript enabled browser",
      inLanguage: locale === "zh" ? "zh-CN" : "en",
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
