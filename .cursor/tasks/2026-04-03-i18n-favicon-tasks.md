# i18n（zh/en/ja/ko）与 Favicon 任务清单

关联规格：`.cursor/specs/2026-04-03-i18n-favicon-prd.md`

- [x] T-01（AC-05）新增站点 favicon：`src/app/icon.svg`
- [x] T-02（AC-01）建立 `[locale]` 路由与默认入口 `/ -> /zh/`
- [x] T-03（AC-02）接入 `next-intl` 配置与 4 语言 message 文件
- [x] T-04（AC-03）改造 metadata/canonical/OG 为 locale 感知
- [x] T-05（AC-03）改造 `sitemap.ts`，按 4 语言展开 URL
- [x] T-06（AC-04）修复静态导出动态依赖（`setRequestLocale` / 去 `getLocale`）
- [x] T-07（AC-04）验证 `npm run build` 成功
- [x] T-08（AC-04）验证 `npm run lint` 成功

## 下一步（可选项推进）

- [ ] T-09（后续）首页与工具页正文文案迁移到 i18n messages/data
- [x] T-10（可选但必要）重做语言切换器交互（下拉菜单调性）并验证 locale 可靠切换
- [x] T-12（工程质量）移除 `src/app/[locale]/layout.tsx` 中的 `<script>`，消除控制台告警
- [x] T-13（本轮收益）迁移指南 `local-first-json-workflow` 正文 + 列表标题摘要到 i18n，验证语言切换的可见性
- [x] T-14（本轮收益）迁移首页“工具索引”分类/工具卡片标题/描述/徽标到 i18n，验证语言切换的大范围可见性
- [x] T-15（本轮收益）改造 `ToolPageHeader`：工具页顶部标题/描述/徽标/分类面包屑从 i18n 读取（需要 `toolId` 对齐）
- [x] T-16（本轮收益）迁移 `settings` 可见层（页面壳层 + SiteInfo + ThemeSettings + UsageInsights）到 i18n
- [x] T-17（缺陷修复）修复语言切换下拉面板被 header 容器裁剪的问题（`overflow-visible`）
- [x] T-18（样板推进）迁移 `json-formatter` 与 `uuid` 工具页正文可见文案到 i18n（含按钮、空态、提示、历史标签）
- [x] T-19（UI修复）修复顶部导航阴影外溢 + 重做 Footer 链接区布局（去 chip 化、优化长文案换行）
- [x] T-20（批量推进）迁移 `base64` 与 `timestamp` 工具页正文可见文案到 i18n（含模式切换、提示、结果区、历史标签）
- [x] T-21（批量推进）迁移 `text-counter` 与 `text-diff` 工具页正文可见文案到 i18n（含输入区、统计标签、diff 空态）
- [x] T-22（批量推进）迁移 `password-generator` 与 `jwt-inspector` 工具页正文可见文案到 i18n（含错误提示、复制/历史文案、配置项）
- [x] T-23（批量推进）迁移 `unicode-inspector` 与 `url-codec` 工具页正文可见文案到 i18n（含表头、模式切换、空态/错误）
- [x] T-24（批量推进）迁移 `qr-code` 与 `regex-tester` 工具页正文可见文案到 i18n（含预览/下载、匹配结果、截断/风险提示）
- [x] T-25（缺口收敛）补全首页 Hero/ToolCard、About Drawer、Settings 统计图及通用组件残留文案；迁移 `html-entities`/`crypto-hash`/`color-converter` 正文到 i18n
- [x] T-11（后续）favicon 升级为多尺寸 `ico/png/apple-touch-icon`
- [x] T-26（收口巡检）修复 `json-formatter` ICU 占位报错与工具详情 `headers()` 静态冲突；补全 guides 页 metadata/badge 的 i18n
- [x] T-27（发布前回归）进一步消除隐藏硬编码：`timestamp` 错误码去中文哨兵、`qr-code` 失败文案 i18n、`unicode-inspector` 默认示例去中文、`password-generator` 脱敏复制记录 i18n
