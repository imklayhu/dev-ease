import { Renderer, marked } from "marked";
import type { Token, Tokens } from "marked";

export type MarkdownTocItem = {
  id: string;
  level: number;
  text: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(text: string): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || "section";
}

/** HTML id 不能以数字开头 */
function ensureValidId(id: string): string {
  if (/^[0-9]/.test(id)) return `h-${id}`;
  return id;
}

/** 从 heading 的 inline tokens 提取纯文本（用于 slug 与目录） */
function extractPlainText(tokens: Token[]): string {
  let s = "";
  for (const t of tokens) {
    if (t.type === "text") s += t.text;
    else if (t.type === "codespan") s += t.text;
    else if (t.type === "escape") s += t.text;
    else if ("tokens" in t && Array.isArray(t.tokens)) s += extractPlainText(t.tokens);
  }
  return s;
}

function safeLangClass(lang: string | undefined): string {
  if (!lang) return "";
  const safe = lang.replace(/[^a-zA-Z0-9_-]/g, "");
  return safe ? ` language-${safe}` : "";
}

function createMarkdownRenderer(toc: MarkdownTocItem[], slugCounts: Map<string, number>) {
  const renderer = new Renderer();

  renderer.heading = function (this: Renderer, { tokens, depth }: Tokens.Heading) {
    const plain = extractPlainText(tokens);
    const base = slugify(plain);
    const n = slugCounts.get(base) ?? 0;
    slugCounts.set(base, n + 1);
    const rawId = n === 0 ? base : `${base}-${n + 1}`;
    const id = ensureValidId(rawId);
    toc.push({ level: depth, text: plain, id });
    const inner = this.parser.parseInline(tokens);
    return `<h${depth} id="${escapeHtml(id)}">${inner}</h${depth}>\n`;
  };

  renderer.code = function ({ text, lang }: Tokens.Code) {
    const escaped = escapeHtml(text);
    const langAttr = lang ? ` data-language="${escapeHtml(lang)}"` : "";
    return `<pre class="devease-md-pre"${langAttr}><code class="devease-md-codeblock${safeLangClass(lang)}">${escaped}</code></pre>\n`;
  };

  return renderer;
}

/**
 * 将 Markdown 转为 HTML（调用方负责在浏览器内 DOMPurify）。
 * 使用自定义 renderer：稳定标题 id、代码块 class、目录顺序与正文一致。
 */
export function renderMarkdownToHtml(markdown: string): { html: string; toc: MarkdownTocItem[] } {
  const toc: MarkdownTocItem[] = [];
  const slugCounts = new Map<string, number>();
  const renderer = createMarkdownRenderer(toc, slugCounts);

  const html = marked.parse(markdown, {
    gfm: true,
    breaks: true,
    renderer,
  }) as string;

  return { html, toc };
}
