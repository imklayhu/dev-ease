import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: { default: BRAND_DISPLAY_NAME, template: `%s · ${BRAND_DISPLAY_NAME}` },
  description: `${BRAND_DISPLAY_NAME}：面向开发者与效率场景的纯前端工具集合。名字里的 Ease 取「轻松、顺手」之意——把格式化、校验、编解码等琐事收进一个无需后端、可部署在 GitHub Pages 的静态站点。`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" data-theme="system" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
