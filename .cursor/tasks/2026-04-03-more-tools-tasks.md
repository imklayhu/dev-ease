# 新增更多小工具 任务清单

关联规格：`.cursor/specs/2026-04-03-more-tools-prd.md`

## Phase 0：方案与基线

- [x] MT-01 明确第一批工具范围与优先级（`markdown-preview` / `url-parser` / `cron-parser` / `sql-formatter` / `qr-decode`）
- [x] MT-02 为每个工具确定分类、badge、描述与风险备注（写入规划表）
- [x] MT-03 确认第三方依赖策略（是否需要新增 npm 包、是否支持动态导入）

## Phase A：第一批（建议 2 个）

- [x] MT-11 新增 `markdown-preview` 页面骨架（page/layout/header/visit/history）
- [x] MT-12 新增 `url-parser` 页面骨架（page/layout/header/visit/history）
- [x] MT-13 将 Phase A 工具登记到 `src/data/tools.ts`
- [x] MT-14 补齐 Phase A 四语 i18n keys（`messages/{zh,en,ja,ko}.json`）
- [x] MT-15 补齐 Phase A metadata/JSON-LD/sitemap
- [x] MT-16 验证 Phase A：`npm run lint` + `npm run build` + `npm run test:e2e:ci`

## Phase B：第二批（建议 2 个）

- [x] MT-21 新增 `cron-parser` 页面骨架与功能实现
- [x] MT-22 新增 `sql-formatter` 页面骨架与功能实现
- [x] MT-23 将 Phase B 工具登记到 `src/data/tools.ts`
- [x] MT-24 补齐 Phase B 四语 i18n keys
- [x] MT-25 补齐 Phase B metadata/JSON-LD/sitemap
- [x] MT-26 验证 Phase B：`npm run lint` + `npm run build` + `npm run test:e2e`

## Phase C：第三批与收口

- [x] MT-31 新增 `qr-decode` 页面骨架与功能实现
- [x] MT-32 补齐 Phase C 四语 i18n keys
- [x] MT-33 补齐 Phase C metadata/JSON-LD/sitemap
- [x] MT-34 全量扫描硬编码可见文案并清零
- [x] MT-35 全站 4 语言手工回归（首页、工具页、about、settings、guides）
- [x] MT-36 最终验证：`npm run lint` + `npm run build` + `npm run test:e2e`

## 备注

- Phase A 已完成；Phase B（`cron-parser` + `sql-formatter`）已完成；Phase C 核心功能已完成（`qr-decode` 已上线）。
- MT-34 说明：已按 `toolId` + i18n keys 扫描工具页可见文案，页面实际渲染文案统一走 `messages/*` 与 `tools.items.*`。
- MT-35 说明：新增 `e2e/i18n-regression.spec.ts`，覆盖 4 语言首页/settings/guides 与代表工具页可达性回归。
