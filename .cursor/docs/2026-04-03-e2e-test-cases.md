# E2E 测试用例矩阵（全功能）

## 1) 核心页面与路由

- `TC-ROUTE-01`：访问 `/` 自动跳转到默认语言 `/zh/`
- `TC-ROUTE-02`：`/zh/` 首页主内容可渲染
- `TC-ROUTE-03`：`/zh/settings/` 可渲染并出现使用概览区域
- `TC-ROUTE-04`：`/zh/guides/` 可渲染并出现主标题
- `TC-ROUTE-05~07`：`en/ja/ko` 语言下首页、settings、guides 路由均可渲染

## 2) 工具页工作流（15 个）

- `TC-TOOL-01` JSON Formatter：输入 JSON，格式化输出出现缩进字段
- `TC-TOOL-02` UUID：设置数量并触发生成，结果列表出现 UUID 格式串
- `TC-TOOL-03` Base64：输入文本，输出出现编码结果
- `TC-TOOL-04` Timestamp：输入时间戳，结果区出现 ISO 字段
- `TC-TOOL-05` Text Counter：输入文本，统计数值发生变化
- `TC-TOOL-06` Text Diff：输入 A/B 文本，结果区出现差异文本
- `TC-TOOL-07` Password Generator：触发重生成，结果区保持可用
- `TC-TOOL-08` JWT Inspector：输入 JWT，页面出现 payload 字段内容
- `TC-TOOL-09` Unicode Inspector：输入字符后表格行数符合预期
- `TC-TOOL-10` URL Codec：输入包含空格文本，输出出现 `%20`
- `TC-TOOL-11` HTML Entities：输入 HTML，输出出现实体转义
- `TC-TOOL-12` Crypto Hash：输入文本，输出出现 hex 摘要
- `TC-TOOL-13` Color Converter：输入 HEX，页面出现 RGB 文本
- `TC-TOOL-14` QR Code：输入链接后预览图像可见
- `TC-TOOL-15` Regex Tester：输入模式与文本，结果区出现匹配内容

## 3) 报告与产物

- `TC-REP-01`：运行 `npm run test:e2e:ci` 产出 HTML 报告
- `TC-REP-02`：产出 JSON/JUnit 原始结果文件
- `TC-REP-03`：自动生成 Markdown 摘要报告并写入 `.cursor/docs/test-reports/`
