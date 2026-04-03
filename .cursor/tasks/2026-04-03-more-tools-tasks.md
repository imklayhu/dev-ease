# 新增更多小工具 任务清单（仅规划）

关联规格：`.cursor/specs/2026-04-03-more-tools-prd.md`

## Phase 0：方案与基线

- [ ] MT-01 明确第一批工具范围与优先级（`markdown-preview` / `url-parser` / `cron-parser` / `sql-formatter` / `qr-decode`）
- [ ] MT-02 为每个工具确定分类、badge、描述与风险备注（写入规划表）
- [ ] MT-03 确认第三方依赖策略（是否需要新增 npm 包、是否支持动态导入）

## Phase A：第一批（建议 2 个）

- [ ] MT-11 新增 `markdown-preview` 页面骨架（page/layout/header/visit/history）
- [ ] MT-12 新增 `url-parser` 页面骨架（page/layout/header/visit/history）
- [ ] MT-13 将 Phase A 工具登记到 `src/data/tools.ts`
- [ ] MT-14 补齐 Phase A 四语 i18n keys（`messages/{zh,en,ja,ko}.json`）
- [ ] MT-15 补齐 Phase A metadata/JSON-LD/sitemap
- [ ] MT-16 验证 Phase A：`npm run lint` + `npm run build`

## Phase B：第二批（建议 2 个）

- [ ] MT-21 新增 `cron-parser` 页面骨架与功能实现
- [ ] MT-22 新增 `sql-formatter` 页面骨架与功能实现
- [ ] MT-23 将 Phase B 工具登记到 `src/data/tools.ts`
- [ ] MT-24 补齐 Phase B 四语 i18n keys
- [ ] MT-25 补齐 Phase B metadata/JSON-LD/sitemap
- [ ] MT-26 验证 Phase B：`npm run lint` + `npm run build`

## Phase C：第三批与收口

- [ ] MT-31 新增 `qr-decode` 页面骨架与功能实现
- [ ] MT-32 补齐 Phase C 四语 i18n keys
- [ ] MT-33 补齐 Phase C metadata/JSON-LD/sitemap
- [ ] MT-34 全量扫描硬编码可见文案并清零
- [ ] MT-35 全站 4 语言手工回归（首页、工具页、about、settings、guides）
- [ ] MT-36 最终验证：`npm run lint` + `npm run build`

## 备注

- 当前文件仅用于排期与拆解，尚未开始代码开发。
