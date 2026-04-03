# DevEase · SEO 战略（基于 seo-plan 技能重规划）

> 站点：`https://devease.ai-dddd.top`（规范 URL 以 `NEXT_PUBLIC_SITE_URL` 为准）  
> 形态：纯前端开发者工具集合 · 静态托管（GitHub Pages）  
> 行业模板参照：`seo-plan` 的 **generic**（主）+ **saas**（产品化工具站 IA 与对比型内容思路）

---

## 1. Discovery（现状与目标）

### 1.1 业务类型与受众

| 维度 | 结论 |
|------|------|
| 类型 | 免费 **Web 工具站**（非订阅 SaaS），强隐私/本地处理叙事 |
| 核心受众 | 中文开发者、运维、学生；次要：需要单次格式化的非技术用户 |
| 决策路径 | 搜索具体问题（如「JSON 格式化 在线」）→ 进入工具页 → 用完即走 |
| 差异化 | 单站多工具、玻璃拟态 UI、IndexedDB 本地历史与统计、无账号 |

### 1.2 当前站点评估（技术 SEO 摘要）

**已具备（优势）**

- `metadataBase`、首页/关于/各工具 **canonical**、**Open Graph**、**Twitter**、根级 **keywords**
- **`sitemap.xml`**、**`robots.txt`**（静态导出 + `force-static`）
- **JSON-LD**：`WebSite` + `WebApplication`（`DeveloperApplication`、零价 `Offer`）
- 工具页通过 **`layout.tsx` + `metadataForTool`** 解决 client page 无法导出 metadata 的问题
- 站内导航与 `trailingSlash` 一致，利于爬虫与相对链接

**主要缺口（机会）**

- 无 **默认 OG/Twitter 大图**（`summary` 卡片分享点击率偏低）
- 工具页以 **客户端应用** 为主，首屏可索引文本偏少；需靠 **metadata + 可选静态说明区块** 补语义
- 无 **`ItemList` / `SoftwareApplication` 子项** 等增强结构化数据
- 无 **`llms.txt`**（模板中 GEO 建议项）
- 无 **博客/指南** 栏目承接长尾词；与聚合竞品相比内容厚度不足
- **E-E-A-T**：关于页可增强「维护者/开源仓库/更新记录」等可验证信号

### 1.3 约束与假设

- 无自有后端；不做用户级服务端分析（可用 **GSC + 可选隐私友好分析**）
- 域名较新时需接受 **沙盒与收录爬坡**；KPI 以 **展示/点击/收录数** 为主，不承诺 DA

### 1.4 KPI（建议）

| 指标 | 基线（上线后 T0） | 3 个月 | 6 个月 | 12 个月 |
|------|------------------|--------|--------|---------|
| GSC 已收录页面数 | 手工记录 | ≥ 12 | ≥ 15 | ≥ 20（若加内容栏目） |
| 品牌词「DevEase」展示 | 记录 | 可见 | Top3 | Top1 |
| 非品牌工具词（抽样 5 个）平均排名 | — | 进入 Top 20 优先 | Top 15 | Top 10（部分） |
| 首页 CWV（LCP/INP/CLS） | 实测 | 全绿或接近 | 维持 | 维持 |
| 自然点击（GSC） | 记录 | +30% | +80% | +150%（视内容投入） |

---

## 2. 战略支柱

1. **可抓取与规范信号**：canonical、sitemap、robots、稳定 HTTPS、一致内部链接（保持并监控）。
2. **工具意图对齐**：每个工具页 title/description 覆盖「工具名 + 动作 + 场景词」（在 `tools.ts` / `metadata` 层迭代）。
3. **内容厚度（中长期）**：`/guides` 或博客承载教程、对比、FAQ，向内链到工具页。
4. **结构化数据递进**：首页 `ItemList`；高流量工具可加 `FAQPage` / `HowTo`（仅当有可见 FAQ 内容）。
5. **GEO / AI 可见性**：清晰 H1/H2、可引用的事实句、`llms.txt`、稳定实体名「DevEase」。

---

## 3. 与 seo-plan 模板的对照

- **generic.md**：全站技术底座清单（HTTPS、sitemap、GSC、CWV）— 已大部分满足，持续验收。
- **saas.md**：工具对比、集成说明、文档站信息架构— 迁移为「工具 vs 工具」「使用场景」类内容选题，见 `CONTENT-CALENDAR.md`。

---

## 4. 风险与缓解

| 风险 | 缓解 |
|------|------|
| 纯客户端页被判定内容薄弱 | 每工具增加简短 **静态** 说明段 + FAQ；控制关键词堆砌 |
| 聚合站竞品权重高 | 聚焦 **中文长尾 + 体验 + 隐私叙事**；持续内链与指南页 |
| 静态导出限制动态 SEO | 预渲染 metadata；动态部分不替代 title/description |

---

## 5. 相关文档

- `SITE-STRUCTURE.md` — URL 与信息架构
- `COMPETITOR-ANALYSIS.md` — 竞品与词隙
- `CONTENT-CALENDAR.md` — 选题与节奏
- `IMPLEMENTATION-ROADMAP.md` — 分阶段落地
