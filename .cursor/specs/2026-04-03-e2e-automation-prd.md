# E2E 自动化测试与报告沉淀规格

## 背景

项目已进入多工具、多语言阶段，新增功能后依赖手工回归的成本持续上升。需要建立可执行、可复用、可沉淀的自动化测试体系。

## 目标

- 基于 Playwright 建立端到端自动化测试（覆盖核心页面与全部工具页主流程）。
- 在每次功能开发完成后可一键执行自动化测试。
- 固化测试报告产物（HTML + JSON + JUnit + Markdown 摘要）用于追踪质量趋势。

## 范围

### In Scope

- Playwright 基础配置与运行脚本。
- 核心路由 smoke 用例（首页、guides、settings、4 语言入口）。
- 全工具页 workflow 用例（15 个工具至少 1 条交互断言）。
- 测试报告 Markdown 自动汇总脚本。
- 项目约束文档 `/.cursor/AGENTS.md` 同步测试要求。

### Out of Scope

- 视觉回归（截图像素级对比）。
- 性能基准测试（Lighthouse / Web Vitals 压测）。
- 真机移动端兼容矩阵。

## 验收标准（AC）

- AC-01 `npm run test:e2e` 可本地执行并产出测试结果。
- AC-02 覆盖核心页面 + 全工具页主路径，失败可定位到具体用例。
- AC-03 `npm run test:e2e:ci` 可输出 Markdown 报告到 `.cursor/docs/test-reports/`。
- AC-04 `AGENTS.md` 明确“功能开发完成后必须执行 E2E 并沉淀报告”的约束。

## 交付物

- `playwright.config.ts`
- `e2e/smoke-routes.spec.ts`
- `e2e/tools-workflows.spec.ts`
- `scripts/generate-e2e-report.mjs`
- `/.cursor/docs/test-reports/*.md`（执行后生成）

## 当前状态

- 状态：已落地首版（20 条用例全部通过，首份报告已沉淀到 `.cursor/docs/test-reports/2026-04-03-e2e-report.md`）。
