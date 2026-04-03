import type { Metadata } from "next";
import Link from "next/link";

import { Info } from "lucide-react";

import { SiteInfo } from "@/components/site-info";
import { ThemeSettings } from "@/components/theme-settings";
import { UsageInsights } from "@/components/usage-insights";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAlt } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

const aboutDescription = `${BRAND_DISPLAY_NAME} 站点信息、技术栈、基于 IndexedDB 的本地使用统计、外观主题与各工具操作历史说明。`;

const aboutOgImages = [
  {
    url: OG_IMAGE_PATH,
    ...OG_IMAGE_DIMENSIONS,
    alt: ogImageAlt(),
  },
];

export const metadata: Metadata = {
  title: "关于我们",
  description: aboutDescription,
  alternates: { canonical: absoluteUrl("/settings/") },
  openGraph: {
    title: `关于我们 · ${BRAND_DISPLAY_NAME}`,
    description: aboutDescription,
    url: absoluteUrl("/settings/"),
    images: aboutOgImages,
  },
  twitter: {
    card: "summary_large_image",
    title: `关于我们 · ${BRAND_DISPLAY_NAME}`,
    description: aboutDescription,
    images: [OG_IMAGE_PATH],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 pb-16 pt-8" id="main-content">
        <nav aria-label="面包屑导航" className="text-sm text-[var(--text-muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className="cursor-pointer rounded-md font-medium text-[var(--accent-violet)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
                href="/"
              >
                首页
              </Link>
            </li>
            <li aria-hidden className="text-[var(--text-muted)]/70">
              /
            </li>
            <li className="text-[var(--text)]">关于我们</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-violet)]/12 to-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
            <Info aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
            站点与偏好
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              关于我们
            </h1>
            <p className="text-pretty text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              <strong className="font-semibold text-[var(--text)]">{BRAND_DISPLAY_NAME}</strong>{" "}
              由项目仓库 dev-ease 构建。本页提供技术栈说明、基于 IndexedDB 的本地使用概览（图表）、以及外观等偏好设置。
            </p>
          </div>
        </header>

        <div className="space-y-12">
          <section aria-labelledby="site-info-heading" className="space-y-4">
            <h2 className="sr-only" id="site-info-heading">
              站点信息
            </h2>
            <SiteInfo />
          </section>

          <UsageInsights />

          <section aria-label="外观与主题" className="space-y-4">
            <ThemeSettings />
          </section>
        </div>
      </main>
    </div>
  );
}
