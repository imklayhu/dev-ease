import type { Metadata } from "next";

import { HomeJsonLd } from "@/components/home-json-ld";
import { ToolCard } from "@/components/tool-card";
import { BRAND_DISPLAY_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { getToolsGrouped, toolCount } from "@/data/tools";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAlt } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

const homeDescription = `${BRAND_DISPLAY_NAME} 收录 JSON 格式化、Base64、时间戳、UUID、哈希、正则、JWT、颜色转换等 ${toolCount} 款纯前端开发者工具。${BRAND_TAGLINE}，无需登录，默认本地处理。`;

const homeOgImages = [
  {
    url: OG_IMAGE_PATH,
    ...OG_IMAGE_DIMENSIONS,
    alt: ogImageAlt(),
  },
];

export const metadata: Metadata = {
  title: "常用开发小工具",
  description: homeDescription,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: `${BRAND_DISPLAY_NAME} — 常用开发小工具`,
    description: homeDescription,
    url: absoluteUrl("/"),
    images: homeOgImages,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_DISPLAY_NAME} — 常用开发小工具`,
    description: homeDescription,
    images: [OG_IMAGE_PATH],
  },
};

export default function Home() {
  const grouped = getToolsGrouped();

  return (
    <div className="flex flex-1 flex-col">
      <HomeJsonLd />
      <main
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pb-24 pt-10 sm:pt-14"
        id="main-content"
      >
        {/* 与顶栏 max-w-6xl、工具区同宽，避免「介绍窄一截」 */}
        <section className="w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-elevated)] p-[1px] shadow-[var(--shadow)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-violet)]/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[var(--accent-fuchsia)]/20 blur-3xl"
            />

            <div className="relative space-y-7 rounded-[31px] glass-panel p-8 sm:p-10">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]">
                {BRAND_DISPLAY_NAME}
              </p>

              <div className="space-y-5">
                <h1 className="font-display max-w-2xl text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.15rem]">
                  <span className="text-gradient-luxe">常用开发小工具</span>
                  <span className="mt-3 block text-2xl font-semibold text-[var(--text-muted)] sm:text-3xl lg:text-[2.15rem]">
                    收进一处，随手可用
                  </span>
                </h1>

                <div className="max-w-2xl space-y-3 text-pretty text-[15px] leading-7 text-[var(--text-muted)] sm:text-base">
                  <p>
                    <strong className="font-semibold text-[var(--text)]">{BRAND_DISPLAY_NAME}</strong>{" "}
                    面向开发者与日常效率场景：把 JSON、Base64、时间戳、哈希等常用能力放进一个纯前端、无需登录的静态站点。名字里的{" "}
                    <strong className="font-semibold text-[var(--text)]">Ease</strong> 取「轻松、顺手」之意——让格式化、校验、编解码这类琐事在浏览器里快速完成。
                    <a className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline" href="/settings/">
                      关于我们
                    </a> </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  Next.js · SSG
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  GitHub Pages
                </span>
                <span className="rounded-full border border-[var(--accent-violet)]/35 bg-[var(--accent-violet)]/10 px-3 py-1 font-mono text-[11px] font-medium text-[var(--accent-violet)]">
                  本地优先
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10" id="tools">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                  工具索引
                </h2>
                <span className="rounded-full bg-gradient-to-r from-[var(--accent-violet)]/20 to-[var(--accent)]/20 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-violet)] ring-1 ring-[var(--accent-violet)]/25">
                  按用途分类
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-[15px]">
                {BRAND_DISPLAY_NAME} 当前收录的工具按用途分组如下。点进卡片即可使用；新增工具时在数据层登记分类即可出现在对应区块。
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 font-mono text-xs text-[var(--text-muted)] shadow-inner ring-1 ring-white/5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)] motion-reduce:animate-none" />
              共 <span className="font-semibold text-[var(--text)]">{toolCount}</span> 款 ·{" "}
              <span className="font-semibold text-[var(--text)]">{grouped.length}</span> 类
            </div>
          </div>

          <nav aria-label="按分类跳转" className="-mt-2 flex flex-wrap gap-2">
            {grouped.map(({ category }) => (
              <a
                key={category.id}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                href={`#cat-${category.id}`}
              >
                {category.title}
              </a>
            ))}
          </nav>

          <div className="space-y-14">
            {grouped.map(({ category, tools: categoryTools }) => (
              <section
                key={category.id}
                aria-labelledby={`heading-${category.id}`}
                className="scroll-mt-28 space-y-5"
                id={`cat-${category.id}`}
              >
                <header className="space-y-1.5 border-b border-[var(--border)]/80 pb-4">
                  <h3
                    className="font-display text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl"
                    id={`heading-${category.id}`}
                  >
                    {category.title}
                  </h3>
                  <p className="max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{category.description}</p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      badge={tool.badge}
                      description={tool.description}
                      featured={tool.featured}
                      href={tool.href}
                      icon={tool.icon}
                      title={tool.title}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
