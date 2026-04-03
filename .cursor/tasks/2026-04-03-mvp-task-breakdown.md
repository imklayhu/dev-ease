# dev-ease MVP 任务拆分（v0.1）

## 任务清单

- [x] T1 初始化 Next.js（TypeScript + App Router）并安装依赖（关联 AC1）
- [x] T2 配置 `next.config` 适配 GitHub Pages 静态导出（关联 AC1）
- [x] T3 实现首页与示例工具导航（关联 AC2）
- [x] T4 实现文本计数器工具页（关联 AC3）
- [x] T5 创建 `lib/db` IndexedDB 封装（settings/activity）（关联 AC4/AC5/AC6）
- [x] T6 将主题设置接入 IDB（关联 AC4/AC6）
- [x] T7 将工具访问行为记录接入 IDB（关联 AC5/AC6）
- [x] T8 执行构建并完成手动验收记录（关联 AC1~AC6）

## 执行顺序与依赖

- T1 → T2 → (T3, T4) → (T5 → T6/T7) → T8

## 测试映射

- AC1: `npm run build` 成功。
- AC2: 首页点击卡片可跳转到 `/tools/text-counter`。
- AC3: 输入 `hello world` 得到正确计数。
- AC4: 切换主题后刷新仍保留。
- AC5: 工具页访问次数递增显示。
- AC6: IDB 异常时出现提示且功能核心不崩溃。
