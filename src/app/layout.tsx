import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteJsonLd } from "@/components/site-json-ld";
import { SkipLink } from "@/components/skip-link";
import { BRAND_DISPLAY_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAlt } from "@/lib/seo-shared";
import { absoluteUrl, SITE_ORIGIN } from "@/lib/site-url";

const defaultDescription = `${BRAND_DISPLAY_NAME}：面向开发者与效率场景的纯前端工具集合。${BRAND_TAGLINE}——把 JSON、Base64、时间戳、哈希、正则等常用能力收进一个无需后端、可部署在 GitHub Pages 的静态站点，数据默认留在本机浏览器。`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: BRAND_DISPLAY_NAME, template: `%s · ${BRAND_DISPLAY_NAME}` },
  description: defaultDescription,
  applicationName: BRAND_DISPLAY_NAME,
  keywords: [
    "DevEase",
    "开发者工具",
    "在线工具",
    "JSON 格式化",
    "Base64",
    "时间戳",
    "UUID",
    "哈希",
    "正则",
    "JWT",
    "GitHub Pages",
    "纯前端",
  ],
  authors: [{ name: BRAND_DISPLAY_NAME, url: SITE_ORIGIN }],
  creator: BRAND_DISPLAY_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: absoluteUrl("/"),
    siteName: BRAND_DISPLAY_NAME,
    title: BRAND_DISPLAY_NAME,
    description: defaultDescription,
    images: [
      {
        url: OG_IMAGE_PATH,
        ...OG_IMAGE_DIMENSIONS,
        alt: ogImageAlt(),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_DISPLAY_NAME,
    description: defaultDescription,
    images: [OG_IMAGE_PATH],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" data-theme="system" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <SiteJsonLd />
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
