# SEO 与规范站点地址

## 目标

提升可索引性与分享元信息准确性；**canonical、Open Graph、sitemap** 与线上访问域名一致（当前主域：`https://devease.ai-dddd.top`）。

## 规范 URL

- 实现：`src/lib/site-url.ts`（`SITE_ORIGIN`、`absoluteUrl`）。
- 构建/部署覆盖：`NEXT_PUBLIC_SITE_URL`（无尾斜杠），见 `.github/workflows/deploy-pages.yml`。

## 元数据

- **根布局** `src/app/layout.tsx`：`metadataBase`、`openGraph`、`twitter`、`keywords`、`robots` 等；**不在根上设置全局 canonical**，避免子页误继承首页。
- **首页** `src/app/page.tsx`：独立 `title` / `description` / `canonical` / OG / Twitter。
- **关于页** `src/app/settings/page.tsx`：同上。
- **工具页**：`src/app/tools/<id>/layout.tsx` 导出 `metadata = metadataForTool("<id>")`；逻辑在 `src/lib/tool-metadata.ts`。原因：各工具 `page.tsx` 为 `"use client"`，不能导出 `metadata`。

## 抓取

- `src/app/sitemap.ts`：首页、`/settings/`、`* /data/tools.ts` 中全部工具链接；`export const dynamic = "force-static"`。
- `src/app/robots.ts`：`Allow: /` + `Sitemap` 绝对 URL；同上 `force-static`。

## 结构化数据

- `src/components/site-json-ld.tsx`：注入 `WebSite` + `WebApplication`（`schema.org`），在根 `layout` 的 `body` 内输出。

## 验收

- `npm run lint`、`npm run build`（与 CI 一致的环境变量）通过。
- `out/sitemap.xml`、`out/robots.txt` 中 URL 主机与 `NEXT_PUBLIC_SITE_URL` 一致。
- 代表性 HTML 中含预期 `og:*` / `twitter:*` / 页面级 `canonical`（浏览器「查看源代码」或构建产物抽查）。

## 相关规则

- `.cursor/rules/next-github-pages.mdc`
