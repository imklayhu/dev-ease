"use client";

import { useMemo, useState } from "react";

import { Brackets } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("toolPages.unicodeInspector");
  const [input, setInput] = useState("DevEase Hello 🎉");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const rows = useMemo(() => analyzeUnicode(input), [input]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: Brackets, label: "Unicode · 码点" }}
          breadcrumbLabel="Unicode 查看"
          description="按「字素」遍历字符串，展示 Unicode 码点（U+）、UTF-16 代理项形式。便于排查 emoji、组合字符与截断问题。"
          title="Unicode 码点查看"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="uni-in">
                {t("inputLabel")}
              </label>
              <textarea
                className={`${TOOL_TEXTAREA_CLASS} min-h-36`}
                id="uni-in"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] font-mono text-xs uppercase tracking-wider text-[var(--text-faint)]">
                    <th className="px-3 py-2">{t("char")}</th>
                    <th className="px-3 py-2">{t("codePoint")}</th>
                    <th className="px-3 py-2">U+</th>
                    <th className="px-3 py-2">{t("utf16Literal")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td className="px-3 py-4 text-[var(--text-muted)]" colSpan={4}>
                        {t("empty")}
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
              {t("tip")}
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
