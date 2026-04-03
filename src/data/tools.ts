import type { LucideIcon } from "lucide-react";
import {
  Binary,
  Braces,
  Brackets,
  Clock,
  CodeXml,
  Fingerprint,
  Gauge,
  GitCompare,
  Hash,
  KeyRound,
  Link2,
  Palette,
  QrCode,
  Regex,
  Shield,
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
    href: "/tools/json-formatter/",
    badge: "JSON",
    icon: Braces,
    categoryId: "text-data",
    featured: true,
  },
  {
    id: "text-counter",
    title: "文本计数器",
    description: "统计字符、单词、行数；访问次数只在本地累计。",
    href: "/tools/text-counter/",
    badge: "文本",
    icon: Gauge,
    categoryId: "text-data",
  },
  {
    id: "text-diff",
    title: "文本对比（行级）",
    description: "按行 diff 两段文本，高亮增删。",
    href: "/tools/text-diff/",
    badge: "Diff",
    icon: GitCompare,
    categoryId: "text-data",
  },
  {
    id: "unicode-inspector",
    title: "Unicode 码点查看",
    description: "按字符展示码点、U+ 与 UTF-16，便于排查 emoji。",
    href: "/tools/unicode-inspector/",
    badge: "Unicode",
    icon: Brackets,
    categoryId: "text-data",
  },
  {
    id: "base64",
    title: "Base64 编解码",
    description: "Base64 编解码，UTF-8 文本不走样。",
    href: "/tools/base64/",
    badge: "编码",
    icon: Binary,
    categoryId: "encoding",
  },
  {
    id: "url-codec",
    title: "URL 组件编解码",
    description: "encodeURIComponent / decodeURIComponent。",
    href: "/tools/url-codec/",
    badge: "URL",
    icon: Link2,
    categoryId: "encoding",
  },
  {
    id: "html-entities",
    title: "HTML 实体编解码",
    description: "转义或还原 &lt; &gt; &amp; 等常见实体。",
    href: "/tools/html-entities/",
    badge: "HTML",
    icon: CodeXml,
    categoryId: "encoding",
  },
  {
    id: "qr-code",
    title: "二维码生成",
    description: "文本或链接生成 QR 码图片（本地渲染）。",
    href: "/tools/qr-code/",
    badge: "QR",
    icon: QrCode,
    categoryId: "encoding",
  },
  {
    id: "timestamp",
    title: "时间戳转换",
    description: "Unix 时间戳与可读时间互转；支持秒/毫秒。",
    href: "/tools/timestamp/",
    badge: "时间",
    icon: Clock,
    categoryId: "time-id",
  },
  {
    id: "uuid",
    title: "UUID 生成器",
    description: "批量生成 UUID v4。",
    href: "/tools/uuid/",
    badge: "随机",
    icon: Fingerprint,
    categoryId: "time-id",
  },
  {
    id: "password-generator",
    title: "随机密码生成",
    description: "可配置长度与字符集，使用 crypto 随机数。",
    href: "/tools/password-generator/",
    badge: "密码",
    icon: KeyRound,
    categoryId: "security-dev",
  },
  {
    id: "jwt-inspector",
    title: "JWT 解析",
    description: "解码 header / payload；不验证签名。",
    href: "/tools/jwt-inspector/",
    badge: "JWT",
    icon: Shield,
    categoryId: "security-dev",
  },
  {
    id: "crypto-hash",
    title: "文本哈希（SHA）",
    description: "SHA-256 / 384 / 512；输出 hex。",
    href: "/tools/crypto-hash/",
    badge: "哈希",
    icon: Hash,
    categoryId: "security-dev",
  },
  {
    id: "regex-tester",
    title: "正则测试",
    description: "调试正则：列出匹配与捕获组。",
    href: "/tools/regex-tester/",
    badge: "正则",
    icon: Regex,
    categoryId: "security-dev",
  },
  {
    id: "color-converter",
    title: "颜色转换",
    description: "HEX / RGB / HSL 互转，带预览。",
    href: "/tools/color-converter/",
    badge: "颜色",
    icon: Palette,
    categoryId: "color",
  },
];

export function getToolsGrouped(): Array<{ category: ToolCategory; tools: ToolItem[] }> {
  return toolCategories.map((category) => ({
    category,
    tools: tools.filter((t) => t.categoryId === category.id),
  }));
}

export const toolCount = tools.length;
