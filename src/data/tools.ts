import type { LucideIcon } from "lucide-react";
import {
  Binary,
  Braces,
  Brackets,
  Clock,
  CodeXml,
  Fingerprint,
  FileText,
  Gauge,
  GitCompare,
  Hash,
  KeyRound,
  Link2,
  Palette,
  QrCode,
  Regex,
  Shield,
  Waypoints,
} from "lucide-react";

/** 用途分类：新增工具时在此注册，并在 `tools` 中挂上 `categoryId` */
export type ToolCategoryId = "text-data" | "encoding" | "time-id" | "security-dev" | "color";

export type ToolCategory = {
  id: ToolCategoryId;
  /** 分类展示名 */
  title: string;
  /** 一句话说明，用于首页分类区副标题 */
  description: string;
};

export const toolCategories: ToolCategory[] = [
  {
    id: "text-data",
    title: "文本与数据",
    description: "统计、diff、Unicode 与结构化数据（JSON 等）。",
  },
  {
    id: "encoding",
    title: "编码与网络",
    description: "Base64、URL、HTML、二维码等常见编解码与生成。",
  },
  {
    id: "time-id",
    title: "时间与标识",
    description: "时间换算与唯一标识生成。",
  },
  {
    id: "security-dev",
    title: "安全与调试",
    description: "密码、JWT、哈希、正则等（浏览器内处理，不代替服务端校验）。",
  },
  {
    id: "color",
    title: "颜色与设计",
    description: "色彩空间换算与预览。",
  },
];

export type ToolItem = {
  /** 与路由、统计用 id，建议与目录名一致 */
  id: string;
  title: string;
  description: string;
  /** 专用于页面 meta description，可与卡片 description 区分长度与关键词 */
  seoDescription?: string;
  /** 相关工具内链（2～3 个 id，勿含自身） */
  relatedToolIds?: string[];
  href: string;
  badge: string;
  icon: LucideIcon;
  categoryId: ToolCategoryId;
  featured?: boolean;
};

export const tools: ToolItem[] = [
  {
    id: "json-formatter",
    title: "JSON 格式化 / 压缩",
    description: "校验 JSON；格式化（两格缩进）或压缩成一行。",
    seoDescription:
      "在线 JSON 格式化、压缩与语法校验：两格缩进美化或一行压缩，适合接口联调与配置审查。纯前端处理，无需登录。",
    href: "/tools/json-formatter/",
    badge: "JSON",
    icon: Braces,
    categoryId: "text-data",
    featured: true,
    relatedToolIds: ["text-diff", "url-codec"],
  },
  {
    id: "text-counter",
    title: "文本计数器",
    description: "统计字符、单词、行数；访问次数只在本地累计。",
    seoDescription:
      "在线统计字符数、单词数与行数，支持中英文混排；访问统计仅存于本机浏览器。适合文案与代码片段快速计量。",
    href: "/tools/text-counter/",
    badge: "文本",
    icon: Gauge,
    categoryId: "text-data",
    relatedToolIds: ["text-diff", "unicode-inspector"],
  },
  {
    id: "text-diff",
    title: "文本对比（行级）",
    description: "按行 diff 两段文本，高亮增删。",
    seoDescription:
      "两行级文本对比与 diff 高亮，快速查看增删；日志、配置与文档版本比对均可本地完成，无需上传文件。",
    href: "/tools/text-diff/",
    badge: "Diff",
    icon: GitCompare,
    categoryId: "text-data",
    relatedToolIds: ["text-counter", "json-formatter"],
  },
  {
    id: "unicode-inspector",
    title: "Unicode 码点查看",
    description: "按字符展示码点、U+ 与 UTF-16，便于排查 emoji。",
    seoDescription:
      "逐字符查看 Unicode 码点、U+ 表示与 UTF-16 单元，排查 emoji 与异常字符。浏览器内处理，保护隐私。",
    href: "/tools/unicode-inspector/",
    badge: "Unicode",
    icon: Brackets,
    categoryId: "text-data",
    relatedToolIds: ["text-counter", "html-entities"],
  },
  {
    id: "markdown-preview",
    title: "Markdown 预览",
    description: "本地实时渲染 Markdown，便于写作与文档校对。",
    seoDescription:
      "在线 Markdown 实时预览：输入即渲染，适合 README 与文档草稿校对。纯前端本地处理，无需上传内容。",
    href: "/tools/markdown-preview/",
    badge: "Markdown",
    icon: FileText,
    categoryId: "text-data",
    relatedToolIds: ["text-counter", "text-diff"],
  },
  {
    id: "base64",
    title: "Base64 编解码",
    description: "Base64 编解码，UTF-8 文本不走样。",
    seoDescription:
      "在线 Base64 编码与解码，UTF-8 文本与常见字符串场景；纯前端完成，适合调试与快速转换，不上传内容。",
    href: "/tools/base64/",
    badge: "编码",
    icon: Binary,
    categoryId: "encoding",
    relatedToolIds: ["url-codec", "html-entities"],
  },
  {
    id: "url-codec",
    title: "URL 组件编解码",
    description: "encodeURIComponent / decodeURIComponent。",
    seoDescription:
      "URL 组件 encodeURIComponent / decodeURIComponent 在线工具，处理查询参数与特殊字符，前端本地执行、无需后端。",
    href: "/tools/url-codec/",
    badge: "URL",
    icon: Link2,
    categoryId: "encoding",
    relatedToolIds: ["base64", "qr-code"],
  },
  {
    id: "url-parser",
    title: "URL 解析器",
    description: "拆解 URL 组件并展开查询参数，便于联调与排错。",
    seoDescription:
      "在线 URL 解析器：展示协议、主机、路径、查询参数与片段，快速定位拼接错误与编码问题。浏览器本地执行。",
    href: "/tools/url-parser/",
    badge: "Parser",
    icon: Waypoints,
    categoryId: "encoding",
    relatedToolIds: ["url-codec", "qr-code"],
  },
  {
    id: "html-entities",
    title: "HTML 实体编解码",
    description: "转义或还原 &lt; &gt; &amp; 等常见实体。",
    seoDescription:
      "HTML 实体转义与还原，处理尖括号、引号与 & 等常见符号，便于模板与富文本安全输出。本地浏览器处理。",
    href: "/tools/html-entities/",
    badge: "HTML",
    icon: CodeXml,
    categoryId: "encoding",
    relatedToolIds: ["base64", "url-codec"],
  },
  {
    id: "qr-code",
    title: "二维码生成",
    description: "文本或链接生成 QR 码图片（本地渲染）。",
    seoDescription:
      "将文本或网址生成二维码图片，浏览器本地渲染与下载预览；适合活动链接与快速扫码测试，数据不离开本机。",
    href: "/tools/qr-code/",
    badge: "QR",
    icon: QrCode,
    categoryId: "encoding",
    relatedToolIds: ["url-codec", "uuid"],
  },
  {
    id: "timestamp",
    title: "时间戳转换",
    description: "Unix 时间戳与可读时间互转；支持秒/毫秒。",
    seoDescription:
      "Unix 时间戳与本地可读时间互转，支持秒与毫秒；排查日志与时区问题时常用，纯前端在线工具。",
    href: "/tools/timestamp/",
    badge: "时间",
    icon: Clock,
    categoryId: "time-id",
    relatedToolIds: ["uuid", "crypto-hash"],
  },
  {
    id: "uuid",
    title: "UUID 生成器",
    description: "批量生成 UUID v4。",
    seoDescription:
      "批量在线生成 UUID v4，使用浏览器加密随机数；适合占位 ID、测试数据与前端原型，无需安装工具。",
    href: "/tools/uuid/",
    badge: "随机",
    icon: Fingerprint,
    categoryId: "time-id",
    relatedToolIds: ["timestamp", "password-generator"],
  },
  {
    id: "password-generator",
    title: "随机密码生成",
    description: "可配置长度与字符集，使用 crypto 随机数。",
    seoDescription:
      "可配置长度与字符集的随机密码生成器，基于 Web Crypto 随机数；仅在浏览器内生成，请妥善保管生成结果。",
    href: "/tools/password-generator/",
    badge: "密码",
    icon: KeyRound,
    categoryId: "security-dev",
    relatedToolIds: ["crypto-hash", "uuid"],
  },
  {
    id: "jwt-inspector",
    title: "JWT 解析",
    description: "解码 header / payload；不验证签名。",
    seoDescription:
      "在线解码 JWT 的 header 与 payload（Base64URL），不验证签名；仅供调试与学习，不可替代服务端鉴权。",
    href: "/tools/jwt-inspector/",
    badge: "JWT",
    icon: Shield,
    categoryId: "security-dev",
    relatedToolIds: ["base64", "crypto-hash"],
  },
  {
    id: "crypto-hash",
    title: "文本哈希（SHA）",
    description: "SHA-256 / 384 / 512；输出 hex。",
    seoDescription:
      "在线计算文本的 SHA-256、SHA-384、SHA-512 摘要（hex 输出）。浏览器内 SubtleCrypto 执行，适合校验与联调。",
    href: "/tools/crypto-hash/",
    badge: "哈希",
    icon: Hash,
    categoryId: "security-dev",
    relatedToolIds: ["jwt-inspector", "password-generator"],
  },
  {
    id: "regex-tester",
    title: "正则测试",
    description: "调试正则：列出匹配与捕获组。",
    seoDescription:
      "正则表达式在线测试：列出全部匹配位置与捕获组，辅助编写与排错。在本地浏览器运行，不上传测试文本。",
    href: "/tools/regex-tester/",
    badge: "正则",
    icon: Regex,
    categoryId: "security-dev",
    relatedToolIds: ["text-diff", "url-codec"],
  },
  {
    id: "color-converter",
    title: "颜色转换",
    description: "HEX / RGB / HSL 互转，带预览。",
    seoDescription:
      "HEX、RGB、HSL 互转并带色块预览，方便前端与 UI 取色；纯前端计算，无需上传调色板数据。",
    href: "/tools/color-converter/",
    badge: "颜色",
    icon: Palette,
    categoryId: "color",
    relatedToolIds: ["unicode-inspector", "json-formatter"],
  },
];

export function getToolsGrouped(): Array<{ category: ToolCategory; tools: ToolItem[] }> {
  return toolCategories.map((category) => ({
    category,
    tools: tools.filter((t) => t.categoryId === category.id),
  }));
}

export function getToolById(id: string): ToolItem | undefined {
  return tools.find((t) => t.id === id);
}

export function getCategoryForTool(toolId: string): ToolCategory | undefined {
  const tool = getToolById(toolId);
  if (!tool) {
    return undefined;
  }
  return toolCategories.find((c) => c.id === tool.categoryId);
}

export function getRelatedTools(toolId: string): ToolItem[] {
  const tool = getToolById(toolId);
  if (!tool?.relatedToolIds?.length) {
    return [];
  }
  return tool.relatedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is ToolItem => Boolean(t));
}

export const toolCount = tools.length;
