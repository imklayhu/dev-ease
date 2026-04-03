# 新增更多小工具规格

## 背景

当前站点已完成多语言与基础工具集建设，下一阶段目标是持续扩充高频工具覆盖面，提升站点“开箱即用”价值。

本规格用于需求与实现边界定义，并跟踪分阶段交付状态。

## 目标

- 在保持纯前端、本地优先、静态导出可部署的前提下，新增一批高频开发小工具。
- 新工具默认接入现有工程能力：i18n、metadata、结构化数据、访问统计、操作历史、sitemap。
- 采用“小批次上线”节奏，控制回归风险。

## 范围

### In Scope

- 新工具规划与分批实现（Phase A/B/C）。
- 工具接入规范（路由、数据、i18n、SEO、UI、测试）。
- 可执行任务清单（`tasks`）与阶段性验收记录。

### Out of Scope（当前阶段）

- 视觉系统重构。
- 引入服务端依赖或后端 API。

## 第一批候选工具（P1）

1. `markdown-preview`：Markdown 实时预览（仅本地渲染）。
2. `cron-parser`：Cron 表达式解析与下一次触发时间预览。
3. `url-parser`：URL 分解（protocol/host/path/query/hash）与 query 展开。
4. `sql-formatter`：SQL 基础格式化（本地执行）。
5. `qr-decode`：二维码图片解码（浏览器端）。

> 说明：具体批次可按实现难度与依赖风险微调，但需保持“每批 2~3 个工具”滚动推进。

## 工程约束

- 必须兼容 `output: "export"`；禁止引入会触发动态渲染的服务端请求上下文依赖。
- 新工具必须在 `src/data/tools.ts` 中登记并归类。
- 新工具必须纳入 `messages/{zh,en,ja,ko}.json`，禁止新增硬编码可见文案。
- 新工具必须支持 `ToolPageHeader`、`ToolVisitPanel`、`ToolHistoryPanel` 统一体验。
- 新工具必须接入 `metadataForTool` 与 sitemap 展开逻辑。

## 验收标准（AC）

- AC-01 路由可访问：
  - 每个新工具存在 `src/app/[locale]/tools/<tool-id>/page.tsx` 与对应 `layout.tsx`。
  - 4 语言路由均可访问。
- AC-02 国际化完整：
  - 标题、描述、按钮、提示、错误、历史标签全部来自 i18n keys。
- AC-03 SEO 完整：
  - metadata/canonical/OG/JSON-LD 与工具页面一致。
  - sitemap 正确包含新增工具的 4 语言 URL。
- AC-04 质量门禁：
  - `npm run lint` 与 `npm run build` 通过。
  - 无关键控制台报错（特别是 i18n ICU 与静态导出相关错误）。

## 风险与应对

- 第三方库导致包体积增长：
  - 优先动态导入；必要时替换轻量库。
- 工具实现边缘输入导致报错：
  - 统一“可见错误提示 + 不崩溃”策略。
- 多语言键遗漏：
  - 开发完成后执行一次全量 i18n 扫描与手工切换验证。

## 交付节奏（建议）

- Phase A：`markdown-preview` + `url-parser`
- Phase B：`cron-parser` + `sql-formatter`
- Phase C：`qr-decode` + 全量收口（i18n/SEO/回归）

## 当前状态

- 状态：进行中（Phase A/B/C 功能已完成，进入发布前收口）
- Phase A 完成项：
  - `markdown-preview` 与 `url-parser` 已实现并接入 `src/data/tools.ts`。
  - 四语 i18n keys 已补齐（`messages/{zh,en,ja,ko}.json`）。
  - 路由、metadata、JSON-LD、sitemap 已随工具注册自动覆盖。
- Phase B 完成项：
  - `cron-parser`（`cron-parser` + `luxon` 依赖）与 `sql-formatter` 已上线；`npm run test:e2e` 覆盖（含 Cron / SQL 用例）。
- Phase C 进展：
  - `qr-decode` 已上线，支持上传图片后本地解析二维码文本，并纳入四语 i18n 与 E2E。
- 质量验证：`npm run lint`、`npm run build`、`npm run test:e2e`（33 passed，含 4 语言回归与 qr-decode 用例）。
- 对应任务：`.cursor/tasks/2026-04-03-more-tools-tasks.md`
