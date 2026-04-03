"use client";

import { useMemo, useState } from "react";

import { diffLines } from "diff";
import { GitCompare } from "lucide-react";

import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "text-diff";

export default function TextDiffPage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const parts = useMemo(() => diffLines(a, b), [a, b]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: GitCompare, label: "文本 · diff" }}
          breadcrumbLabel="文本对比"
          description="按行对比两段文本，绿色为新增、红色为删除、无底色为相同。适合配置片段、日志片段等快速比对。"
          title="文本对比（行级）"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="diff-a">
                  文本 A
                </label>
                <textarea
                  className={`${TOOL_TEXTAREA_CLASS} min-h-56`}
                  id="diff-a"
                  placeholder="左侧版本…"
                  spellCheck={false}
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="diff-b">
                  文本 B
                </label>
                <textarea
                  className={`${TOOL_TEXTAREA_CLASS} min-h-56`}
                  id="diff-b"
                  placeholder="右侧版本…"
                  spellCheck={false}
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text)]">差异（行级）</p>
              <pre
                className="max-h-[min(70vh,32rem)] overflow-auto whitespace-pre-wrap break-all rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-xs leading-6 text-[var(--text)]"
                role="region"
                aria-label="diff 结果"
              >
                {parts.length === 0 ? (
                  <span className="text-[var(--text-muted)]">两侧均为空</span>
                ) : (
                  parts.map((part, index) => (
                    <span
                      key={index}
                      className={
                        part.added
                          ? "bg-emerald-500/20 text-emerald-950 dark:text-emerald-100"
                          : part.removed
                            ? "bg-rose-500/20 text-rose-950 dark:text-rose-100"
                            : ""
                      }
                    >
                      {part.value}
                    </span>
                  ))
                )}
              </pre>
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
