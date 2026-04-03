# DevEase · SEO 实施路线图（对齐 seo-plan 四阶段）

> 映射仓库现状：`src/app/*`、`src/lib/site-url.ts`、`src/lib/tool-metadata.ts`、`src/components/site-json-ld.tsx`、`src/app/sitemap.ts`、`src/app/robots.ts`、`.github/workflows/deploy-pages.yml`。

---

## Phase 1：Foundation（第 1～4 周）

| # | 任务 | 类型 | 验收 |
|---|------|------|------|
| 1.1 | **Google Search Console**：验证 `devease.ai-dddd.top`，提交 `sitemap.xml` | 运维 | 属性已验证、无严重抓取错误 |
| 1.2 | **OG 图**：增加默认 `opengraph-image` 或 `public/og.png`，根布局与工具页继承或覆盖 | 开发 | ✅ `public/og.png` + 根/首页/关于/工具 meta |
| 1.3 | **工具描述**：审计 15 个工具，确保 description **唯一**且含 1～2 个自然长尾词 | 文案/数据 | ✅ `tools.ts` 的 `seoDescription` + `tool-metadata` |
| 1.4 | **`llms.txt`**：`public/llms.txt` 说明站点用途、主要工具路径、禁止误用 | 内容 | ✅ `public/llms.txt` |
| 1.5 | **Organization JSON-LD**：在 `SiteJsonLd` 或独立脚本中增加 `sameAs`（GitHub 仓库等） | 开发 | ✅ `site-json-ld.tsx`（Organization + publisher） |
| 1.5b | **首页 ItemList** | 开发 | ✅ `home-json-ld.tsx` |
| 1.6 | **CWV 基线**：Lighthouse / CrUX 记录首页 + 1 个重工具页 | 测试 | 记录写入内部 wiki 或本目录附录 |

**已完成基线（无需重复开发）**：canonical、sitemap、robots、WebSite/WebApplication、per-tool metadata、NEXT_PUBLIC_SITE_URL。

---

## Phase 2：Expansion（第 5～12 周）

| # | 任务 | 类型 | 验收 |
|---|------|------|------|
| 2.1 | 新增 **`/guides/`** 路由 + 2～3 篇首发文章（MDX 或静态） | 开发+内容 | ✅ `/guides/` + 首篇 `local-first-json-workflow`；`src/data/guides.ts` 登记 |
| 2.2 | 首页 **ItemList**（或 `SoftwareApplication` 子项）结构化数据 | 开发 | ✅ 与首页可见工具列表一致 |
| 2.3 | **工具页互链**：在相关工具间增加「相关工具」链接（组件化） | 开发 | ✅ `RelatedTools` + `tools.relatedToolIds` |
| 2.4 | **BreadcrumbList**：与 UI 面包屑一致 | 开发 | ✅ `ToolBreadcrumbJsonLd`（首页 / 分类锚点 / 工具） |
| 2.5 | 可选：**Plausible / Cloudflare Web Analytics**（隐私友好） | 运维 | 与「无追踪」叙事一致再上线 |

---

## Phase 3：Scale（第 13～24 周）

| # | 任务 | 类型 | 验收 |
|---|------|------|------|
| 3.1 | 指南 **月更 2～4 篇**，覆盖 `CONTENT-CALENDAR.md` 队列 | 内容 | GSC 展示增长 |
| 3.2 | **FAQPage** schema：仅对「页面上真实展示的 FAQ」输出 | 开发 | 不违规结构化指南 |
| 3.3 | **图片 SEO**：如有截图，统一 `alt` 与文件名 | 内容 | Lighthouse SEO 项提升 |
| 3.4 | **性能**：大包分割、字体策略复核（尤其工具页 client bundle） | 开发 | INP 达标 |

---

## Phase 4：Authority（第 7～12 月）

| # | 任务 | 类型 | 验收 |
|---|------|------|------|
| 4.1 | **英文层** 或 最小化「English landing」评估 | 产品 | 决策文档 |
| 4.2 | 开源 **Release Note** 与站内「更新」同步 | 运营 | freshness 信号 |
| 4.3 | 高质量外链：文档、Awesome 列表、演讲 PPT 链接 | 运营 | 引用域名质量 > 数量 |

---

## 依赖与风险

- **静态导出**：动态服务端 SEO（A/B title）不适用；一律构建期确定 meta。  
- **client 工具页**：结构化正文需 **SSR/静态 HTML 区块** 或构建时注入，避免仅靠 JS 渲染空壳。

---

## 跟踪方式

- 每月更新 `SEO-STRATEGY.md` 中的 KPI 表（GSC 导出）。  
- 大改动后回归：`npm run build` + Rich Results Test 抽样。  
