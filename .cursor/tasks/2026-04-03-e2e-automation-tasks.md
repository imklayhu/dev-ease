# E2E 自动化测试任务清单

关联规格：`.cursor/specs/2026-04-03-e2e-automation-prd.md`

- [x] E2E-01 引入 Playwright 依赖与基础配置（`playwright.config.ts`）
- [x] E2E-02 新增核心路由 smoke 测试（`e2e/smoke-routes.spec.ts`）
- [x] E2E-03 新增全工具页 workflow 测试（`e2e/tools-workflows.spec.ts`）
- [x] E2E-04 增加 npm scripts：`test:e2e` / `test:e2e:ci` / `test:e2e:report`
- [x] E2E-05 增加测试报告汇总脚本（`scripts/generate-e2e-report.mjs`）
- [x] E2E-06 安装浏览器运行时并完成首轮执行（`npx playwright install chromium`）
- [x] E2E-07 生成并沉淀首份 Markdown 测试报告到 `.cursor/docs/test-reports/`
- [x] E2E-08 将新增工具开发流程中的“自动化测试 + 报告”设为默认门禁并持续维护（已同步 `/.cursor/AGENTS.md`）
