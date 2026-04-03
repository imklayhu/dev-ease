"use client";

import { useMemo, useState } from "react";

import { Brackets } from "lucide-react";

import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "unicode-inspector";

type Row = { glyph: string; codePoint: number; hex: string; utf16: string };

function analyzeUnicode(input: string): Row[] {
  const rows: Row[] = [];
  for (const ch of input) {
    const cp = ch.codePointAt(0)!;
    const hex = `U+${cp.toString(16).toUpperCase().padStart(cp > 0xffff ? 6 : 4, "0")}`;
    const utf16 = [...ch]
      .map((c) => `\\u${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`)
      .join("");
    rows.push({ glyph: ch, codePoint: cp, hex, utf16 });
  }
  return rows;
}

export default function UnicodeInspectorPage() {
  const [input, setInput] = useState("DevEase 你好 🎉");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const rows = useMemo(() => analyzeUnicode(input), [input]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Brackets, label: "Unicode · 码点" }}
          breadcrumbLabel="Unicode 查看"
          description="按「字素」遍历字符串，展示 Unicode 码点（U+）、UTF-16 代理项形式。便于排查 emoji、组合字符与截断问题。"
          title="Unicode 码点查看"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="uni-in">
                输入文本
              </label>
              <textarea
                className={`${TOOL_TEXTAREA_CLASS} min-h-36`}
                id="uni-in"
                placeholder="粘贴任意 Unicode 文本…"
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] font-mono text-xs uppercase tracking-wider text-[var(--text-faint)]">
                    <th className="px-3 py-2">字符</th>
                    <th className="px-3 py-2">码点</th>
                    <th className="px-3 py-2">U+</th>
                    <th className="px-3 py-2">UTF-16 字面量</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td className="px-3 py-4 text-[var(--text-muted)]" colSpan={4}>
                        空字符串
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, i) => (
                      <tr key={i} className="border-b border-[var(--border)]/60 last:border-0">
                        <td className="px-3 py-2 font-mono text-lg text-[var(--text)]">{row.glyph}</td>
                        <td className="px-3 py-2 tabular-nums text-[var(--text-muted)]">{row.codePoint}</td>
                        <td className="px-3 py-2 font-mono text-[var(--text)]">{row.hex}</td>
                        <td className="px-3 py-2 font-mono text-xs text-[var(--text-muted)]">{row.utf16}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              说明：采用 for…of 遍历，可正确处理多数 emoji（代理对）；组合音标等可能仍显示为多行。
            </p>
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
