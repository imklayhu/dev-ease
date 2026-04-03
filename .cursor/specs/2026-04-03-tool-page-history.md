# 工具页 · 本地操作历史

## 目标

在每个工具页提供**时间线式操作历史**，强化「行为留在本机」的感知；与「访问次数」侧栏互补——访问是聚合指标，历史是**可追溯事件**。

## 数据模型

- 新对象仓库 `toolHistory`（`DB_VERSION` 2），`keyPath: id`（UUID），索引 `toolId`。
- 记录：`{ id, toolId, label, detail?, createdAt }`。
- 单工具最多保留 **50** 条，超出删除最旧（按 `createdAt`）。

## 记录策略

| 来源 | 说明 |
|------|------|
| 进入工具 | `useToolVisit` 在 `recordToolVisit` 成功后写入：`第 N 次打开此工具` |
| 复制成功 | `CopyButton` 可选 `toolId` + `historyLabel`，剪贴板写入成功后追加 |
| 个别工具 | 密码「重新生成」、二维码「生成成功」（防抖）等补充事件 |

不在首版：全文快照、跨工具搜索、导出文件。

## UI/UX（与站点一致）

- 侧栏置于 **访问记录** 下方，同玻璃卡片语言；标题「操作历史」+ 副文案「仅本机，最多 50 条」。
- 列表：**相对时间**（刚刚 / N 分钟前）+ 主文案；有 `detail` 时可展开一行等宽字体预览。
- 底部：**清空本工具历史**（二次确认 `confirm`）。
- 空状态：浅提示 + 引导使用工具产生记录。
- **无障碍**：列表 `ul`/`li` 或 `role="list"`；展开按钮带 `aria-expanded`。
- **动效**：新列表项 `motion-safe` 淡入；`prefers-reduced-motion` 关闭。

## 刷新机制

写入后 `window` 派发 `dev-ease-tool-history`，`ToolHistoryPanel` 同 `toolId` 时重新拉取，避免层层 lifting state。

## 实现落点（与代码同步）

| 项 | 位置 |
|----|------|
| IDB 读写与裁剪 | `src/lib/db/client.ts`（`appendToolHistory`、`getToolHistory`、`clearToolHistory`、`ToolHistoryRecord`） |
| 侧栏 UI | `src/components/tool-history-panel.tsx` |
| 相对时间文案 | `src/lib/format-relative-time.ts` |
| 访问成功后写「第 N 次打开」 | `src/hooks/use-tool-visit.ts` |
| 复制成功可选写历史 | `src/components/copy-button.tsx`（`toolId` / `historyLabel` / `historyDetail`） |
| 各工具页 | 侧栏 `ToolVisitPanel` 下 `ToolHistoryPanel`；二维码见 `src/app/tools/qr-code/page.tsx` 防抖去重写历史 |
