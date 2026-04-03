import { BRAND_DISPLAY_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site-url";

const graph = [
  {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: BRAND_DISPLAY_NAME,
    description: `${BRAND_DISPLAY_NAME}：面向开发者与效率场景的纯前端工具集合，可部署在 GitHub Pages。${BRAND_TAGLINE}`,
    inLanguage: "zh-CN",
  },
  {
    "@type": "WebApplication",
    "@id": `${SITE_ORIGIN}/#webapp`,
    name: BRAND_DISPLAY_NAME,
    url: absoluteUrl("/"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "需要启用 JavaScript。",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": graph,
};

export function SiteJsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
