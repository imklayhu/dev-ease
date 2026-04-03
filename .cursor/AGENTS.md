# dev-ease — Agent Harness（项目级指令）

本文档是面向自动化代理（Cursor Agent 等）的**任务约束与执行契约**。实现代码前请先对齐本节；细则见 `.cursor/rules/` 下的规则文件。

---

## 1. 产品宪章（Charter）

- **形态**：纯前端站点，聚合「开发/工作便利」类小页面与工具；无自有后端 API。
- **发布**：GitHub Pages（静态托管）。
- **技术栈**：Next.js（App Router 为主），客户端渲染与静态导出需与 Pages 兼容。
- **持久化**：浏览器 **IndexedDB** 保存用户设置与可接受的匿名行为/使用数据；禁止依赖 `localStorage` 作为唯一方案承载结构化或大体量数据（设置类可用 small key-value 辅助，但主存储策略以 IDB 为准）。

---

## 2. 不变量（Invariants）

| 类别 | 要求 |
|------|------|
| 部署 | 构建产物须可由静态服务器提供；不得假设 Node 运行时、SSR 动态服务端。 |
| 密钥 | 无服务端密钥；若将来接第三方 API，仅使用公开/前端可暴露的配置，并文档说明。 |
| 隐私 | IDB 数据默认仅存于用户本机；不上传则不在仓库中持久化用户内容。 |
| 路由 | 生产构建的 `basePath` 由环境控制：默认兼容 `*.github.io/<repo>/`；自定义域名根路径部署时设 `NEXT_STATIC_SITE_ROOT=true`（见 `next-github-pages` 规则）。站内路由仍用 `Link` 等相对路径，勿写死含仓库名的绝对 URL。 |

---

## 3. Agent 工作流（Harness Loop）

1. **对齐**：确认改动属于「工具页 / 布局 / 存储 / 构建配置 / SEO 元数据」中的哪一类，是否影响静态导出、`basePath` 或 `NEXT_PUBLIC_SITE_URL`。
2. **实现**：优先复用现有组件与存储抽象；新增工具页保持目录结构一致（见规则）。
3. **自检**：
   - `next build` 在「静态导出」配置下成功；
   - 新增 IDB 读写有版本/迁移策略或明确单版本 schema；
   - 不引入仅服务端可用的 API 到必须在客户端执行的代码路径。
4. **收尾**：用户可见文案与注释可用中文；代码标识符与提交信息保持清晰英文或与仓库一致。

---

## 4. 与规则文件的分工

| 文件 | 用途 |
|------|------|
| `.cursor/rules/dev-ease-core.mdc` | 全局适用：宪章摘要、目录约定、通用禁止项 |
| `.cursor/rules/next-github-pages.mdc` | Next.js 静态导出、`basePath`、自定义域名环境变量、`NEXT_PUBLIC_SITE_URL`、sitemap/robots |
| `.cursor/rules/indexeddb-client.mdc` | IndexedDB 封装、schema、迁移与错误处理 |

修改存储层或 `next.config` 时，应对照对应规则。

---

## 5. 定义完成（Definition of Done）

- 功能在本地通过静态导出构建；
- 新工具页可从首页或导航进入（若项目已有导航模式则遵循之）；
- IndexedDB 访问失败时有降级或提示，不静默吞掉导致白屏；
- 未无故扩大范围（不添加未要求的后端、不擅自更换框架）。
- 对“新增/修改功能”在交付前执行 E2E 自动化测试（`npm run test:e2e` 或 `npm run test:e2e:ci`）。
- E2E 执行后需沉淀报告：保留 Playwright 原始产物，并输出 Markdown 摘要到 `.cursor/docs/test-reports/`。

---

## 6. Subagents 编排与职责

项目采用三段式 subagent 协同，所有需求默认按以下链路推进：

1. `market-requirements-collector`
   - 输入：问题背景/用户反馈/访谈线索。
   - 输出：原始需求证据表、原话引用、竞品对照、待验证项。
2. `product-manager`
   - 输入：`market-requirements-collector` 的产出。
   - 输出：价值与可行性判断、范围优先级、可交付开发与测试的 PRD（含 AC）。
3. `dev-test-engineer`
   - 输入：`product-manager` 的 PRD。
   - 输出：技术方案、任务拆分、开发实现、测试与验收结果。

执行要求：

- 不跳过上游证据直接下游实现；若必须并行，需在输出里标注假设与风险。
- PRD 变更后，`dev-test-engineer` 需同步检查任务拆分与测试用例是否仍覆盖 AC。
- 三个 subagent 文件位于 `.cursor/agents/`，为本项目优先级最高的同名定义。

---

## 7. 交付物目录约束（Harness Artifacts）

为保证需求到实现可追溯，固定使用以下目录：

- `.cursor/docs/`
  - 用途：通用沉淀文档（方法、约定、复盘、术语等）。
  - 约束：不放临时草稿；内容可被后续任务复用。
- `.cursor/specs/`
  - 用途：规格文档（PRD、功能规格、验收标准、接口/数据约定）。
  - 约束：文件名建议包含日期或版本（如 `2026-04-03-xxx-prd.md`）。
- `.cursor/tasks/`
  - 用途：可执行任务清单（拆分任务、状态、负责人、里程碑）。
  - 约束：任务需能映射到 `specs` 中的需求编号或 AC 编号。

协作约束：

- `market-requirements-collector` 产出优先沉淀到 `.cursor/docs/`。
- `product-manager` 产出 PRD 与 AC 优先落到 `.cursor/specs/`。
- `dev-test-engineer` 的任务拆分与执行跟踪优先落到 `.cursor/tasks/`。
- 新任务启动时，先检查是否已有相关 `docs/specs/tasks`，避免重复造文档。

---

*修订：与产品方向冲突时，以仓库内 `README` 或负责人说明为准，并同步更新本文件与规则。*

---

## 8. 测试自动化约束（新增）

- 推荐技术方案：**Playwright E2E**（优先于临时手工脚本）。
- 标准命令：
  - `npm run test:e2e`
  - `npm run test:e2e:ci`
  - `npm run test:e2e:report`
- 用例组织：
  - 核心路由 smoke：`e2e/smoke-routes.spec.ts`
  - 工具页流程：`e2e/tools-workflows.spec.ts`
- 报告产物：
  - HTML：`playwright-report/`
  - JSON/JUnit：`test-results/`
  - Markdown 摘要：`.cursor/docs/test-reports/`
