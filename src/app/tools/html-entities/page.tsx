"use client";

import { useMemo, useState } from "react";

import { CodeXml } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "html-entities";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function encodeHtmlEntities(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] ?? ch);
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}

export default function HtmlEntitiesPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const output = useMemo(() => {
    if (!input) {
      return "";
    }
    try {
      return mode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
    } catch {
      return "";
    }
  }, [input, mode]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: CodeXml, label: "HTML · 转义" }}
          breadcrumbLabel="HTML 实体"
          description="将文本中的 &lt; &gt; &amp; 等转为实体，或反向还原。解码依赖浏览器 DOM，请勿粘贴不可信的大型 HTML 期望「消毒」——本工具不做 CSP 级过滤。"
          title="HTML 实体编解码"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "encode"
                    ? "bg-[var(--accent-violet)]/20 text-[var(--text)] ring-2 ring-[var(--ring)]"
                    : "border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
                }`}
                type="button"
                onClick={() => setMode("encode")}
              >
                编码（转实体）
              </button>
              <button
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "decode"
                    ? "bg-[var(--accent-violet)]/20 text-[var(--text)] ring-2 ring-[var(--ring)]"
                    : "border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
                }`}
                type="button"
                onClick={() => setMode("decode")}
              >
                解码（还原文本）
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="html-in">
                输入
              </label>
              <textarea
                className={TOOL_TEXTAREA_CLASS}
                id="html-in"
                placeholder={mode === "encode" ? "<div>\"示例\" & 符号</div>" : "&lt;div&gt;&quot;示例&quot; &amp; 符号&lt;/div&gt;"}
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--text)]">输出</p>
                <CopyButton
                  historyDetail={output ? output.slice(0, 120) : undefined}
                  historyLabel={`复制 HTML 实体${mode === "encode" ? "编码" : "解码"}结果`}
                  label="复制输出"
                  text={output}
                  toolId={TOOL_ID}
                />
              </div>
              <textarea className={`${TOOL_TEXTAREA_CLASS} min-h-40`} readOnly value={output} />
            </div>
          </div>

          <div className="space-y-4">
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </div>
        </section>
      </main>
    </div>
  );
}
