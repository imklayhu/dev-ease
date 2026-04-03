# DevEase · 站点结构与内链（现状 + 建议）

## 1. 当前 URL 架构（已实现）

```
/                           # 首页：工具索引、分类锚点 #cat-{categoryId}
/settings/                  # 关于我们 / 设置 / 使用洞察
/tools/{tool-id}/           # 各工具（与 src/data/tools.ts 一致）
/sitemap.xml
/robots.txt
```

**内链原则（保持）**

- 首页 `ToolCard` → 各工具；分类导航 `/#cat-*` 为同页锚点（不单独 URL，SEO 上依赖首页权重即可）。
- 顶栏/页脚指向首页与关于页；工具页回链首页与关于。

---

## 2. 建议扩展（按优先级）

### P1 — 不改路由大结构

- **面包屑**：视觉已有处统一为 `首页 > 工具分类 > 工具名`；可选增加 **BreadcrumbList** JSON-LD（需与可见面包屑一致）。
- **工具页静态内容区**：每个工具页顶部或侧栏下增加 **200～400 字** 纯 HTML 说明（同构 SEO 与无障碍），避免全文仅在 client state。

### P2 — 新栏目（利于长尾）

```
/guides/                    # 指南索引
/guides/{slug}/             # 单篇：如 json-formatting-best-practices
```

- 从首页「资源」或頁腳链到 `/guides/`；每篇文章 **2～3 条** 内链到相关 `/tools/.../`。

### P3 — 可选英文层

```
/en/                        # 英文首页镜像（或 next-intl 方案）
/en/tools/...
```

- 需 **`hreflang`**（`zh-CN` / `en`）与独立 **meta**，工作量较大，建议 Phase 3 后评估。

---

## 3. Sitemap 质量门（现状与建议）

| 规则 | 现状 |
|------|------|
| 仅索引应收录 URL | 首页、settings、全部工具 ✓ |
| 避免重复参数 URL | 静态站无参数 ✓ |
| lastmod | 构建时间统一；若加 CMS/MDX 可改为 git 时间 |
| priority | featured 工具略高 ✓；指南上线后可 `0.7` |

---

## 4. 与模板 generic.md  IA 的对照

generic 建议的 `/resources/blog`、`/legal` 等：

- **Blog/Resources** → 映射为 **`/guides/`**（静态 MDX 即可配合 `output: export`）。
- **Legal** → 若暂无独立页，可在关于页增加 **隐私说明** 区块 + 锚点；独立 `/privacy/` 为可选。

---

## 5. 信息架构与用户动线（SEO 友好）

1. **首页**：分类发现 + 品牌词。  
2. **工具页**：意图词落地 + 内链到相关工具（例如在「URL 编码」页链到「Base64」）。  
3. **指南**：教程词 → 深化停留 → 内链工具转化。  
