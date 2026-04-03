# i18n（zh/en/ja/ko）与 Favicon 推进规格

## 背景

用户新增两项 P0 诉求：

1. 设计并替换站点 favicon。
2. 引入国际化能力，支持中文、英文、日语、韩语。

并确认 GSC 域名验证与 sitemap 提交已完成（运维侧）。

## 范围

### In Scope

- 站点 favicon 更新（当前先落地 `src/app/icon.svg`）。
- `next-intl` 路由级国际化（`[locale]`）。
- 4 语言路由：`zh`、`en`、`ja`、`ko`。
- 站内导航 `Link` 统一走 i18n 导航封装。
- 页面 metadata / canonical / OG / sitemap 随 locale 展开。
- 静态导出（`output: "export"`）可构建通过。

### Out of Scope（本阶段）

- 全量工具正文文案翻译（允许分批迁移）。
- 自动语言协商 middleware（不适配纯静态导出场景）。

## 功能要求与验收标准（AC）

- AC-01 路由与默认入口
  - `/` 默认跳转到 `/zh/`。
  - `localePrefix: "always"` 生效，4 语言路径可访问。

- AC-02 国际化基础能力
  - `messages/{zh,en,ja,ko}.json` 可正常加载。
  - 导航、底栏、关于抽屉等核心壳层支持多语言键值。

- AC-03 SEO 与规范 URL
  - 首页、设置页、指南页、工具页 metadata 支持 locale 版 canonical/OG。
  - `sitemap.xml` 按 4 语言展开核心页面与工具页面。

- AC-04 静态导出兼容
  - 不依赖 middleware 的 locale 协商。
  - `npm run build` 在静态导出模式成功。

- AC-05 视觉资产
  - favicon 可被 Next App Router 正常识别并产出站点图标。

## 设计决策

- 使用 `next-intl@4` + `setRequestLocale`，确保 SSG/静态导出不触发动态 API。
- JSON-LD 组件显式接收 `locale`，避免 `getLocale()` 导致 `headers()` 依赖。
- 站内链接统一使用 `@/i18n/navigation` 的 `Link`，避免 locale 丢失。

## 现阶段残留

- 暂无阻塞型残留；后续主要为体验打磨与新增工具持续 i18n 维护。

## 已验证的工程质量

- `src/app/[locale]/layout.tsx` 不再注入 `<script>`，避免 React 控制台告警。
- locale 切换器采用与站点调性一致的下拉菜单交互，已验证 `next build`/`next lint` 通过。
- 语言下拉面板在 header 内可完整展示（修复容器裁剪：`site-header` 顶层容器改为 `overflow-visible`）。
- 顶部导航去除外层阴影外溢；Footer 重排为“描述 + 文本链接 + 独立技术栈行”，避免 chip 视觉与长文案换行观感问题。

## 已完成的可见收益

- `src/app/[locale]/guides/local-first-json-workflow` 的标题/描述/正文/列表/返回按钮已迁入 i18n，使切换后在指南页肉眼可见。
- `src/app/[locale]/page` 的首页“工具索引”分类/工具卡片标题、描述、徽标已迁入 i18n，使切换后首页出现明显大范围变化。
- `src/components/tool-page-header`：当工具页传入 `toolId` 时，标题/描述/徽标/分类面包屑会从 i18n 读取并随 locale 切换而更新。
- `src/app/[locale]/settings` + `SiteInfo` + `ThemeSettings` + `UsageInsights` 已迁入 i18n，设置页主体随 locale 切换。
- `src/app/[locale]/tools/json-formatter` 与 `src/app/[locale]/tools/uuid` 正文可见文案已迁入 i18n，形成工具页正文迁移样板。
- `src/app/[locale]/tools/base64` 与 `src/app/[locale]/tools/timestamp` 正文可见文案已迁入 i18n，样板可扩展到其余工具页。
- `src/app/[locale]/tools/text-counter` 与 `src/app/[locale]/tools/text-diff` 正文可见文案已迁入 i18n，覆盖统计型与对比型工具页面范式。
- `src/app/[locale]/tools/password-generator` 与 `src/app/[locale]/tools/jwt-inspector` 正文可见文案已迁入 i18n，覆盖安全类工具页面范式。
- `src/app/[locale]/tools/unicode-inspector` 与 `src/app/[locale]/tools/url-codec` 正文可见文案已迁入 i18n，覆盖编码检查与编解码类页面范式。
- `src/app/[locale]/tools/qr-code` 与 `src/app/[locale]/tools/regex-tester` 正文可见文案已迁入 i18n，覆盖二维码预览下载与正则匹配分析类页面范式。
- 首页 `Hero` 主标题/说明、工具卡片 CTA（打开/进入/首推）、About 抽屉内主题区标题、settings `UsageInsights` 图表标注与百分比文本已全部迁入 i18n，解决切换语言后混杂中文的问题。
- `CopyButton`、`SkipLink`、`ToolVisitPanel`、`ToolHistoryPanel`、`useToolVisit`、`RelatedTools` 等全站复用组件已改为多语言键，避免工具页中出现跨语言残留。
- `src/app/[locale]/tools/html-entities`、`src/app/[locale]/tools/crypto-hash`、`src/app/[locale]/tools/color-converter` 正文可见文案已迁入 i18n，补齐此前遗漏的主要工具页。
- favicon 已升级为多尺寸资产：`src/app/favicon.ico` + `src/app/icon.png` + `src/app/apple-icon.png`（保留 `src/app/icon.svg` 作为矢量源），覆盖常见浏览器标签页与 iOS 主屏图标场景。
- 修复 `json-formatter` 因 message 中花括号文本触发的 ICU `MALFORMED_ARGUMENT` 运行时错误；同时将 `RelatedTools` 调整为客户端翻译，消除工具详情页静态导出 `headers()` 冲突。
- guides 索引页 metadata（title/description）与页头 badge 已改为 i18n 键，减少语言切换时的固定中文残留。
- 发布前回归补充：`timestamp` 解析错误改为错误码分支（避免中文字符串比较）；`qr-code` 生成失败兜底文案迁入 i18n；`unicode-inspector` 默认示例改为语言中立文本；`password-generator` 脱敏复制记录文案迁入 i18n。
